// @ts-nocheck
import type { CloudflareEnv } from './cloudflare'
import { githubHeaders } from './github'
import { mimeOf, isAllowedRepoPath, isRepoDotfile } from './mime'

// 大小 / 数量上限
const MAX_JSX_SIZE = 100 * 1024 // jsx 控件文件 100 KiB（维持现状）
const MAX_README_SIZE = 100 * 1024 // README 100 KiB（维持现状）
const MAX_ASSET_SIZE = 5 * 1024 * 1024 // 其他允许的仓库文件（图片等）5 MiB
const MAX_TOTAL_EXTRACTED = 25 * 1024 * 1024 // 解压后总大小 25 MiB
const MAX_FILES = 500 // 单次同步镜像文件数
const DELETE_THRESHOLD = 0.3 // 删除候选占现存 key 比例超过 30% 则中止

// 版本目录名：容忍 v 前缀（v1.0.0 / 1.0.0）
const VERSION_DIR_RE = /^v?(\d{1,4}(?:\.\d{1,4}){0,3})$/i

export type RepoBinding = {
  id: number
  control_name: string
  repo_owner: string
  repo_name: string
  branch: string
}

type TreeEntry = {
  path: string
  type: 'blob' | 'tree'
  size?: number
  sha?: string
}

export type RepoVersionCandidate = {
  dirName: string
  version: string
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

/* ============================================================
   仓库 git tree 解析（绑定预检 + 版本目录识别）
   ============================================================ */
export function parseRepoTree(tree: TreeEntry[]): ParsedRepoTree {
  const versions: RepoVersionCandidate[] = []
  const invalidDirs: { dir: string; reason: string }[] = []
  let readmePath: string | null = null
  let readmeSize = 0

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
    if (segs.length !== 2) continue
    const dir = segs[0]
    if (!dirFiles.has(dir)) dirFiles.set(dir, [])
    dirFiles.get(dir)!.push(entry)
  }

  for (const [dir, files] of dirFiles) {
    const m = dir.match(VERSION_DIR_RE)
    if (!m) continue
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

/* ============================================================
   纯函数 tar 解析器（无第三方依赖）
   支持：ustar prefix/name、GNU 'L' 长名、PAX 'x'/'g' 的 path 覆盖
   ============================================================ */
export type TarFile = { path: string; size: number; data: Uint8Array }

function readField(bytes: Uint8Array, start: number, end: number): string {
  let stop = end
  for (let i = start; i < end; i++) {
    if (bytes[i] === 0) {
      stop = i
      break
    }
  }
  return new TextDecoder('utf-8').decode(bytes.subarray(start, stop))
}

function parseOctal(s: string): number {
  const t = s.trim()
  if (!t) return 0
  const n = parseInt(t, 8)
  return Number.isNaN(n) ? 0 : n
}

// PAX 扩展头数据：形如 `%d %s=%s\n` 的记录序列
function parsePaxRecords(data: Uint8Array): Record<string, string> {
  const text = new TextDecoder('utf-8').decode(data)
  const out: Record<string, string> = {}
  let pos = 0
  while (pos < text.length) {
    const sp = text.indexOf(' ', pos)
    if (sp < 0) break
    const len = parseInt(text.slice(pos, sp), 10)
    if (!len) break
    const record = text.slice(pos, pos + len)
    const eq = record.indexOf('=')
    if (eq >= 0) {
      const key = record.slice(sp - pos + 1, eq)
      out[key] = record.slice(eq + 1, record.length - 1) // 去掉末尾 \n
    }
    pos += len
  }
  return out
}

export function parseTar(buffer: ArrayBuffer): TarFile[] {
  const bytes = new Uint8Array(buffer)
  const files: TarFile[] = []
  let offset = 0
  let longName: string | null = null
  let pax: Record<string, string> | null = null

  while (offset + 512 <= bytes.length) {
    let empty = true
    for (let i = 0; i < 512; i++) {
      if (bytes[offset + i] !== 0) {
        empty = false
        break
      }
    }
    if (empty) break // 连续零块 = 归档结束

    const nameField = readField(bytes, offset, offset + 100)
    const size = parseOctal(readField(bytes, offset + 124, offset + 136))
    const type = String.fromCharCode(bytes[offset + 156])
    const dataStart = offset + 512
    const data = bytes.subarray(dataStart, dataStart + size)
    const nextOffset = dataStart + Math.ceil(size / 512) * 512

    if (type === 'x' || type === 'g') {
      pax = { ...(pax || {}), ...parsePaxRecords(data) }
    } else if (type === 'L') {
      // GNU 长名：整块内容（去掉 NUL）作为下一条目的路径
      longName = readField(data, 0, data.length)
    } else if (type === '0' || type === '\u0000' || type === '' || type === '7') {
      const prefix = readField(bytes, offset + 345, offset + 500)
      let path = pax?.path || longName || (prefix ? `${prefix}/${nameField}` : nameField)
      // 剥离 GitHub tarball 的顶层 {owner}-{repo}-{sha}/ 目录
      const slash = path.indexOf('/')
      if (slash >= 0) path = path.slice(slash + 1)
      if (path) files.push({ path, size, data })
      longName = null
      pax = null
    } else {
      // 目录(5)/链接(1,2)等：消费扩展状态
      longName = null
      pax = null
    }

    offset = nextOffset
  }

  return files
}

/* ============================================================
   gzip 流式解压（Workers 原生 DecompressionStream），限定总量
   ============================================================ */
async function gunzip(stream: ReadableStream): Promise<{ bytes: Uint8Array; truncated: boolean }> {
  const ds = new DecompressionStream('gzip')
  const reader = stream.pipeThrough(ds).getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  let truncated = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    if (total + value.length > MAX_TOTAL_EXTRACTED) {
      truncated = true
      try {
        await reader.cancel()
      } catch {}
      break
    }
    chunks.push(value)
    total += value.length
  }

  const out = new Uint8Array(total)
  let pos = 0
  for (const c of chunks) {
    out.set(c, pos)
    pos += c.length
  }
  return { bytes: out, truncated }
}

/* ============================================================
   版本比较（与 control-resource.ts 的 versionRank 思路一致）
   ============================================================ */
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

async function listAllKeys(bucket: CloudflareEnv['RESOURCES'], prefix: string): Promise<string[]> {
  const keys: string[] = []
  let cursor: string | undefined
  do {
    const page = await bucket.list({ prefix, cursor, limit: 1000 })
    for (const o of page.objects) keys.push(o.key)
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)
  return keys
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export type MirrorResult = {
  status: 'ok' | 'partial' | 'failed'
  filesSynced: string[]
  unchanged: number
  ignored: number
  skipped: { path: string; reason: string }[]
  deleted: string[]
  versions: { added: string[]; all: string[] }
  currentVersion: string
  warnings: string[]
  error?: string
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * 全量真镜像：把绑定仓库的所有允许文件按原路径复制到 R2，
 * 覆盖变更、跳过未变、删除仓库中已不存在的文件（带保护阈值）。
 */
export async function mirrorRepo(env: CloudflareEnv, binding: RepoBinding): Promise<MirrorResult> {
  const control = binding.control_name
  const owner = binding.repo_owner
  const repo = binding.repo_name
  const branch = binding.branch

  const warnings: string[] = []
  const filesSynced: string[] = []
  const deleted: string[] = []
  const skipped: { path: string; reason: string }[] = []
  let unchanged = 0
  let ignored = 0

  // ---------- 1. git tree：blob sha 映射 + 版本目录识别 ----------
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    { headers: githubHeaders(env.GITHUB_TOKEN) },
  )
  if (!treeRes.ok) {
    return {
      status: 'failed',
      filesSynced, unchanged, ignored, skipped, deleted,
      versions: { added: [], all: [] }, currentVersion: '', warnings,
      error: treeRes.status === 404 ? 'repo_or_branch_not_found' : `github_api_${treeRes.status}`,
    }
  }
  const treeData = await treeRes.json()
  if (!Array.isArray(treeData.tree)) {
    return failedResult('invalid_tree_response')
  }
  if (treeData.truncated) warnings.push('tree_truncated')
  const treeEntries: TreeEntry[] = treeData.tree
  const blobSha = new Map<string, string>()
  for (const e of treeEntries) if (e.type === 'blob' && e.sha) blobSha.set(e.path, e.sha)
  const parsedTree = parseRepoTree(treeEntries)

  // ---------- 2. tarball 下载 + gzip 解压 ----------
  const tarRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/tarball/${encodeURIComponent(branch)}`,
    {
      headers: {
        Accept: 'application/gzip',
        'User-Agent': 'Cloudflare-Worker',
        ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
      },
    },
  )
  if (!tarRes.ok || !tarRes.body) {
    return failedResult(`tarball_download_${tarRes.status}`)
  }
  const { bytes, truncated } = await gunzip(tarRes.body)
  if (truncated) warnings.push('extracted_size_limit')

  let tarFiles: TarFile[]
  try {
    tarFiles = parseTar(bytes)
  } catch (err: any) {
    return failedResult(`invalid_tar: ${err?.message || 'unknown'}`)
  }
  const fileCapHit = tarFiles.length > MAX_FILES
  if (fileCapHit) warnings.push('file_count_limit')

  const mirrorFiles = tarFiles.slice(0, MAX_FILES)
  const byPath = new Map(mirrorFiles.map((f) => [f.path, f]))
  const repoPaths = new Set(tarFiles.map((f) => f.path))

  // 仓库中的版本目录名（用于历史版本豁免判断）
  const repoVersionDirs = new Set<string>()
  for (const f of tarFiles) {
    const seg = f.path.split('/')[0]
    if (VERSION_DIR_RE.test(seg)) repoVersionDirs.add(seg)
  }

  // ---------- 3. 版本校验：information.json 必须可解析（取自 tar，无额外请求） ----------
  const validVersions: string[] = []
  for (const cand of parsedTree.versions) {
    const infoFile = byPath.get(cand.infoPath)
    const jsxFile = byPath.get(cand.jsxPath)
    if (!infoFile || !jsxFile) {
      skipped.push({ path: cand.dirName, reason: 'version_file_missing_from_tarball' })
      continue
    }
    try {
      const parsedInfo = JSON.parse(new TextDecoder('utf-8').decode(infoFile.data))
      if (!parsedInfo || typeof parsedInfo !== 'object') throw new Error('not object')
    } catch {
      skipped.push({ path: cand.infoPath, reason: 'invalid_information_json' })
      continue
    }
    validVersions.push(cand.version)
  }

  // ---------- 4. 新控件：先写 D1 登记行（失败整体中止，R2 未被触碰） ----------
  const existingInfoObj = await env.RESOURCES.get(`${control}/information.json`)
  let counterExists = false
  try {
    counterExists = Boolean(
      await env.DB.prepare('SELECT 1 FROM components WHERE name = ?1').bind(control).first(),
    )
  } catch {
    counterExists = false
  }
  if (!existingInfoObj && !counterExists && validVersions.length > 0) {
    const highest = pickHighestVersion(validVersions)
    const cand = parsedTree.versions.find((v) => v.version === highest)!
    const sizeText = `${(cand.jsxSize / 1024).toFixed(2)} KiB`
    try {
      await env.DB.prepare(
        'INSERT INTO components (name, size, downloads, likes, collections, Pageviews, author) VALUES (?1, ?2, 0, 0, 0, 0, ?3)',
      )
        .bind(control, sizeText, owner)
        .run()
    } catch (dbErr: any) {
      return failedResult(`counter_register_failed: ${dbErr?.message || 'unknown'}`)
    }
  }

  // ---------- 5. 逐文件镜像：sha 比对，未变跳过，变更覆盖 ----------
  for (const f of mirrorFiles) {
    if (isRepoDotfile(f.path)) {
      ignored++
      continue
    }
    if (!isAllowedRepoPath(f.path)) {
      skipped.push({ path: f.path, reason: 'file_type_not_allowed' })
      continue
    }
    const base = f.path.split('/').pop() || ''
    if (/\.jsx$/i.test(base) && f.size > MAX_JSX_SIZE) {
      skipped.push({ path: f.path, reason: 'jsx_too_large' })
      continue
    }
    if (f.path === 'README.md' && f.size > MAX_README_SIZE) {
      skipped.push({ path: f.path, reason: 'readme_too_large' })
      continue
    }
    if (f.size > MAX_ASSET_SIZE) {
      skipped.push({ path: f.path, reason: 'file_too_large' })
      continue
    }

    const r2Key = `${control}/${f.path}`
    const sha = blobSha.get(f.path)
    const head = await env.RESOURCES.get(r2Key, { onlyMetadata: true })
    if (head && sha && head.customMetadata?.gh_sha === sha) {
      unchanged++
      continue
    }
    try {
      await env.RESOURCES.put(r2Key, f.data, {
        httpMetadata: { contentType: mimeOf(r2Key) },
        customMetadata: sha ? { gh_sha: sha } : undefined,
      })
      filesSynced.push(f.path)
    } catch {
      skipped.push({ path: f.path, reason: 'r2_write_failed' })
    }
  }

  // ---------- 6. 合并写根 information.json ----------
  let oldInfo: Record<string, unknown> = {}
  if (existingInfoObj && existingInfoObj.text) {
    try {
      const parsedInfo = JSON.parse(await existingInfoObj.text())
      if (parsedInfo && typeof parsedInfo === 'object') oldInfo = parsedInfo
    } catch {
      // 旧文件损坏则以新内容重建
    }
  }
  const oldVersions: string[] = Array.isArray(oldInfo.Version_number_list)
    ? oldInfo.Version_number_list
    : []
  const addedVersions = validVersions.filter((v) => !oldVersions.includes(v))
  const mergedVersions = [...oldVersions]
  for (const v of validVersions) if (!mergedVersions.includes(v)) mergedVersions.push(v)

  let currentVersion = ''
  if (mergedVersions.length > 0) {
    currentVersion = pickHighestVersion(mergedVersions)
    if (addedVersions.length > 0 || !existingInfoObj) {
      const info = {
        ...oldInfo, // 保留 Release_input 等仓库外字段
        author: owner, // 以绑定者为准，防冒名
        Current_version: currentVersion,
        Version_number_list: mergedVersions,
      }
      await env.RESOURCES.put(`${control}/information.json`, JSON.stringify(info, null, 2) + '\n', {
        httpMetadata: { contentType: 'application/json; charset=utf-8' },
      })
    }
  }

  // ---------- 7. 镜像删除（仅镜像完整、无写入错误时执行） ----------
  const hasWriteError = skipped.some((s) => s.reason === 'r2_write_failed')
  const mirrorComplete = !truncated && !fileCapHit && !hasWriteError
  if (mirrorComplete) {
    const r2Keys = await listAllKeys(env.RESOURCES, `${control}/`)
    const candidates: string[] = []
    for (const key of r2Keys) {
      const rel = key.slice(control.length + 1)
      if (repoPaths.has(rel)) continue
      // 历史版本豁免：仓库中不存在的版本目录整体保留（绑定前手动上传的版本）
      const seg = rel.split('/')[0]
      if (VERSION_DIR_RE.test(seg) && !repoVersionDirs.has(seg)) continue
      candidates.push(key)
    }
    if (r2Keys.length > 0 && candidates.length / r2Keys.length > DELETE_THRESHOLD) {
      warnings.push('deletion_aborted_threshold')
    } else {
      for (const batch of chunk(candidates, 1000)) {
        await env.RESOURCES.delete(batch)
      }
      deleted.push(...candidates.map((k) => k.slice(control.length + 1)))
    }
  }

  // ---------- 8. 有变更则清 control-list 缓存 ----------
  if (filesSynced.length > 0 || deleted.length > 0) {
    try {
      const cache = useStorage('cache')
      const keys = await cache.getKeys()
      await Promise.all(
        keys.filter((k) => k.includes('control-list')).map((k) => cache.removeItem(k)),
      )
    } catch {
      /* 缓存清理失败不影响结果 */
    }
  }

  // ---------- 9. 汇总 ----------
  const status: MirrorResult['status'] =
    skipped.length === 0 && warnings.length === 0 ? 'ok' : 'partial'

  return {
    status,
    filesSynced,
    unchanged,
    ignored,
    skipped,
    deleted,
    versions: { added: addedVersions, all: mergedVersions },
    currentVersion,
    warnings,
  }

  function failedResult(error: string): MirrorResult {
    return {
      status: 'failed',
      filesSynced, unchanged, ignored, skipped, deleted,
      versions: { added: [], all: [] }, currentVersion: '', warnings, error,
    }
  }
}

// 更新绑定行的同步状态（API handler 在拿到结果后调用）
export async function recordSyncResult(
  env: CloudflareEnv,
  bindingId: number,
  result: MirrorResult,
): Promise<void> {
  try {
    await env.DB.prepare(
      'UPDATE github_sync_repos SET last_synced_at = ?1, last_sync_status = ?2, last_sync_detail = ?3 WHERE id = ?4',
    )
      .bind(
        new Date().toISOString(),
        result.status,
        JSON.stringify({
          filesSynced: result.filesSynced,
          unchanged: result.unchanged,
          ignored: result.ignored,
          skipped: result.skipped,
          deleted: result.deleted,
          versions: result.versions,
          currentVersion: result.currentVersion,
          warnings: result.warnings,
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
