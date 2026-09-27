// @ts-nocheck
import type { CloudflareEnv } from './cloudflare'
import { githubHeaders } from './github'

// 与 control-submit 保持一致的上限与版本号规则
const MAX_JSX_SIZE = 100 * 1024 // 100 KiB
const MAX_README_SIZE = 100 * 1024 // 100 KiB
// 版本目录名：容忍 v 前缀（v1.0.0 / 1.0.0）
const VERSION_DIR_RE = /^v?(\d{1,4}(?:\.\d{1,4}){0,3})$/i
// 单次同步最多处理的版本数（限制子请求数量，防滥用）
const MAX_SYNC_VERSIONS = 50

export type RepoBinding = {
  id: number
  control_name: string
  repo_owner: string
  repo_name: string
  branch: string
}

export type TreeEntry = {
  path: string
  type: 'blob' | 'tree'
  size?: number
}

export type RepoVersionCandidate = {
  dirName: string // 仓库中的目录名（可能带 v 前缀）
  version: string // 归一化后的版本号（去 v 前缀）
  infoPath: string
  jsxPath: string
  jsxSize: number
}

export type ParsedRepoTree = {
  versions: RepoVersionCandidate[]
  invalidDirs: { dir: string; reason: string }[]
  readmePath: string | null
  readmeSize: number
}

// 从 GitHub git tree 中筛选合法版本目录（只做结构判断，不下载内容）
export function parseRepoTree(tree: TreeEntry[]): ParsedRepoTree {
  const versions: RepoVersionCandidate[] = []
  const invalidDirs: { dir: string; reason: string }[] = []
  let readmePath: string | null = null
  let readmeSize = 0

  // 顶层目录 → 直接子文件
  const dirFiles = new Map<string, TreeEntry[]>()
  for (const entry of tree) {
    if (entry.type !== 'blob') continue
    const segs = entry.path.split('/')
    if (segs.length === 1) {
      if (/^readme\.md$/i.test(segs[0])) {
        readmePath = entry.path
        readmeSize = entry.size ?? 0
      }
      continue
    }
    if (segs.length !== 2) continue // 版本目录内只认直接子文件
    const dir = segs[0]
    if (!dirFiles.has(dir)) dirFiles.set(dir, [])
    dirFiles.get(dir)!.push(entry)
  }

  for (const [dir, files] of dirFiles) {
    const m = dir.match(VERSION_DIR_RE)
    if (!m) continue // 非版本目录静默忽略
    const version = m[1]

    const infoEntry = files.find((f) => f.path.split('/')[1].toLowerCase() === 'information.json')
    if (!infoEntry) {
      invalidDirs.push({ dir, reason: 'missing_information_json' })
      continue
    }

    const jsxEntries = files.filter((f) => /\.jsx$/i.test(f.path.split('/')[1]))
    if (jsxEntries.length === 0) {
      invalidDirs.push({ dir, reason: 'missing_jsx' })
      continue
    }
    const jsxEntry =
      jsxEntries.find((f) => f.path.split('/')[1].toLowerCase() === 'control.jsx') || jsxEntries[0]

    const jsxSize = jsxEntry.size ?? 0
    if (jsxSize > MAX_JSX_SIZE) {
      invalidDirs.push({ dir, reason: 'jsx_too_large' })
      continue
    }

    versions.push({
      dirName: dir,
      version,
      infoPath: infoEntry.path,
      jsxPath: jsxEntry.path,
      jsxSize,
    })
  }

  return { versions, invalidDirs, readmePath, readmeSize }
}

// 下载仓库单个文件（公共仓库走 raw，无需令牌）
async function fetchRepoFileText(
  binding: RepoBinding,
  path: string,
  token?: string,
): Promise<string | null> {
  const rawUrl = `https://raw.githubusercontent.com/${binding.repo_owner}/${binding.repo_name}/${encodeURIComponent(binding.branch)}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`
  const res = await fetch(rawUrl, { headers: githubHeaders(token) })
  if (!res.ok) return null
  return res.text()
}

// 语义化版本比较（与 control-resource.ts 的 versionRank 思路一致）
function versionRank(v: string): number[] {
  return v.split('.').map((p) => Number(p) || 0)
}

export function pickHighestVersion(versions: string[]): string {
  return versions.slice().sort((a, b) => {
    const ra = versionRank(a)
    const rb = versionRank(b)
    const len = Math.max(ra.length, rb.length)
    for (let i = 0; i < len; i++) {
      const d = (rb[i] || 0) - (ra[i] || 0)
      if (d !== 0) return d
    }
    return 0
  })[0]
}

export type SyncResult = {
  status: 'ok' | 'partial' | 'failed'
  added: string[]
  skipped: { version: string; reason: string }[]
  readmeUpdated: boolean
  error?: string
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 增量同步：把绑定仓库中的合法新版本文件复制到 R2。
 * 已存在版本跳过（不覆盖不删除）；新控件先写 D1 再写 R2（与 control-submit 同一约束）。
 */
export async function syncRepo(env: CloudflareEnv, binding: RepoBinding): Promise<SyncResult> {
  const control = binding.control_name
  const skipped: { version: string; reason: string }[] = []
  const added: string[] = []

  // ---------- 1. 拉取仓库 git tree ----------
  const treeRes = await fetch(
    `https://api.github.com/repos/${binding.repo_owner}/${binding.repo_name}/git/trees/${encodeURIComponent(binding.branch)}?recursive=1`,
    { headers: githubHeaders(env.GITHUB_TOKEN) },
  )
  if (!treeRes.ok) {
    return {
      status: 'failed',
      added,
      skipped,
      readmeUpdated: false,
      error: treeRes.status === 404 ? 'repo_or_branch_not_found' : `github_api_${treeRes.status}`,
    }
  }
  const treeData = (await treeRes.json()) as { tree?: TreeEntry[]; truncated?: boolean }
  if (!Array.isArray(treeData.tree)) {
    return { status: 'failed', added, skipped, readmeUpdated: false, error: 'invalid_tree_response' }
  }

  const parsed = parseRepoTree(treeData.tree)
  for (const inv of parsed.invalidDirs) {
    skipped.push({ version: inv.dir, reason: inv.reason })
  }

  // ---------- 2. 过滤 R2 已存在版本（增量语义） ----------
  const newCandidates: RepoVersionCandidate[] = []
  for (const cand of parsed.versions) {
    const existing = await env.RESOURCES.get(`${control}/${cand.version}/control.jsx`, {
      onlyMetadata: true,
    })
    if (existing) {
      skipped.push({ version: cand.version, reason: 'already_exists' })
    } else {
      newCandidates.push(cand)
    }
  }

  const limited = newCandidates.slice(0, MAX_SYNC_VERSIONS)
  for (const overflow of newCandidates.slice(MAX_SYNC_VERSIONS)) {
    skipped.push({ version: overflow.version, reason: 'sync_limit_reached' })
  }

  // ---------- 3. 先下载全部待同步文件（失败发生在写库之前） ----------
  const downloads: { cand: RepoVersionCandidate; jsx: string }[] = []
  for (const cand of limited) {
    const infoText = await fetchRepoFileText(binding, cand.infoPath, env.GITHUB_TOKEN)
    if (!infoText) {
      skipped.push({ version: cand.version, reason: 'information_json_download_failed' })
      continue
    }
    try {
      const parsedInfo = JSON.parse(infoText)
      if (!parsedInfo || typeof parsedInfo !== 'object') throw new Error('not object')
    } catch {
      skipped.push({ version: cand.version, reason: 'invalid_information_json' })
      continue
    }
    const jsx = await fetchRepoFileText(binding, cand.jsxPath, env.GITHUB_TOKEN)
    if (jsx === null) {
      skipped.push({ version: cand.version, reason: 'jsx_download_failed' })
      continue
    }
    if (new TextEncoder().encode(jsx).length > MAX_JSX_SIZE) {
      skipped.push({ version: cand.version, reason: 'jsx_too_large' })
      continue
    }
    downloads.push({ cand, jsx })
  }

  // ---------- 4. 新控件：先写 D1 登记行（失败即整体中止，R2 尚未被触碰） ----------
  if (downloads.length > 0) {
    const existingInfoObj = await env.RESOURCES.get(`${control}/information.json`)
    let counterExists = false
    try {
      const row = await env.DB.prepare('SELECT 1 FROM components WHERE name = ?1')
        .bind(control)
        .first()
      counterExists = Boolean(row)
    } catch {
      counterExists = false
    }
    if (!existingInfoObj && !counterExists) {
      const highest = pickHighestVersion(downloads.map((d) => d.cand.version))
      const sizeText = `${(downloads.find((d) => d.cand.version === highest)!.cand.jsxSize / 1024).toFixed(2)} KiB`
      try {
        await env.DB.prepare(
          'INSERT INTO components (name, size, downloads, likes, collections, Pageviews, author) VALUES (?1, ?2, 0, 0, 0, 0, ?3)',
        )
          .bind(control, sizeText, binding.repo_owner)
          .run()
      } catch (dbErr: any) {
        return {
          status: 'failed',
          added,
          skipped,
          readmeUpdated: false,
          error: `counter_register_failed: ${dbErr?.message || 'unknown'}`,
        }
      }
    }
  }

  // ---------- 5. 写入 R2 控件文件 ----------
  for (const { cand, jsx } of downloads) {
    try {
      await env.RESOURCES.put(`${control}/${cand.version}/control.jsx`, jsx, {
        httpMetadata: { contentType: 'text/javascript; charset=utf-8' },
      })
      added.push(cand.version)
    } catch {
      skipped.push({ version: cand.version, reason: 'r2_write_failed' })
    }
  }

  // ---------- 6. 合并写 information.json（有新增版本才写） ----------
  if (added.length > 0) {
    let existing: Record<string, unknown> = {}
    const existingObj = await env.RESOURCES.get(`${control}/information.json`)
    if (existingObj && existingObj.text) {
      try {
        const parsedInfo = JSON.parse(await existingObj.text())
        if (parsedInfo && typeof parsedInfo === 'object') existing = parsedInfo
      } catch {
        // 旧文件损坏时以新内容重建
      }
    }
    const oldVersions = Array.isArray(existing.Version_number_list)
      ? (existing.Version_number_list as string[])
      : []
    const merged = [...oldVersions]
    for (const v of added) if (!merged.includes(v)) merged.push(v)

    const info = {
      ...existing, // 保留 Release_input / Latest_submission_time 等旧字段
      author: binding.repo_owner, // 以绑定者为准，防冒名
      Current_version: pickHighestVersion(merged),
      Version_number_list: merged,
    }
    await env.RESOURCES.put(`${control}/information.json`, JSON.stringify(info, null, 2) + '\n', {
      httpMetadata: { contentType: 'application/json; charset=utf-8' },
    })
  }

  // ---------- 7. 仓库根 README.md 覆盖写（仓库级内容，不受增量限制） ----------
  let readmeUpdated = false
  if (parsed.readmePath && parsed.readmeSize <= MAX_README_SIZE) {
    const readme = await fetchRepoFileText(binding, parsed.readmePath, env.GITHUB_TOKEN)
    if (readme !== null && new TextEncoder().encode(readme).length <= MAX_README_SIZE) {
      await env.RESOURCES.put(`${control}/README.md`, readme, {
        httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
      })
      readmeUpdated = true
    }
  }

  // ---------- 8. 有新增版本时清 control-list 缓存（与 control-submit 同一逻辑） ----------
  if (added.length > 0) {
    try {
      const cache = useStorage('cache')
      const keys = await cache.getKeys()
      await Promise.all(
        keys.filter((k) => k.includes('control-list')).map((k) => cache.removeItem(k)),
      )
    } catch {
      /* 忽略缓存清理失败 */
    }
  }

  // ---------- 9. 汇总状态 ----------
  const failedCount = skipped.filter(
    (s) => !['already_exists', 'sync_limit_reached'].includes(s.reason),
  ).length
  const status: SyncResult['status'] =
    failedCount === 0 ? 'ok' : added.length > 0 ? 'partial' : 'failed'

  return { status, added, skipped, readmeUpdated }
}

// 更新绑定行的同步状态（由 API handler 在拿到结果后调用）
export async function recordSyncResult(
  env: CloudflareEnv,
  bindingId: number,
  result: SyncResult,
): Promise<void> {
  try {
    await env.DB.prepare(
      'UPDATE github_sync_repos SET last_synced_at = ?1, last_sync_status = ?2, last_sync_detail = ?3 WHERE id = ?4',
    )
      .bind(
        new Date().toISOString(),
        result.status,
        JSON.stringify({
          added: result.added,
          skipped: result.skipped,
          readmeUpdated: result.readmeUpdated,
          error: result.error,
        }),
        bindingId,
      )
      .run()
  } catch {
    // 状态记录失败不影响同步结果本身
  }
}

export { jsonRes }
