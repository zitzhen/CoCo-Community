import { getCloudflareContext } from '~/server/utils/cloudflare'
import { requireGithubUser } from '~/server/utils/auth'
import { assertAllowedOrigin } from '~/server/utils/github'
import { parseRepoTree, type TreeEntry } from '~/server/utils/github-sync'
import { githubHeaders } from '~/server/utils/github'

// 与 control-submit 同一控件名规则
const NAME_RE = /^[A-Za-z0-9一-鿿][A-Za-z0-9_一-鿿-]{0,63}$/

// 支持 "owner/name"、"github.com/owner/name"、"https://github.com/owner/name(.git)"
function parseRepoInput(input: string): { owner: string; repo: string } | null {
  const m = input
    .trim()
    .match(/(?:github\.com[/:])?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/)
  if (!m) return null
  return { owner: m[1], repo: m[2] }
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 绑定 GitHub 控件仓库：一个仓库 ⇄ 一个控件名，后续通过 /api/github-sync/sync 增量同步
export default defineEventHandler(async (event) => {
  try {
  const { request, env } = getCloudflareContext(event)

  if (!env.DB || !env.RESOURCES) {
    return jsonRes({ error: 'server_configuration_error', detail: 'missing env: DB/RESOURCES bindings' }, 500)
  }

  const originError = assertAllowedOrigin(request)
  if (originError) return originError

  const auth = await requireGithubUser(event)
  if (auth instanceof Response) return auth

  const body = await readBody(event)
  const repoInput = String(body?.repo || '')
  const controlName = String(body?.controlName || '').trim()
  const branch = String(body?.branch || 'main').trim() || 'main'

  const parsed = parseRepoInput(repoInput)
  if (!parsed) {
    return jsonRes({ error: 'invalid_repo' }, 400)
  }
  if (!NAME_RE.test(controlName)) {
    return jsonRes({ error: 'invalid_name' }, 400)
  }

  // ---------- 校验仓库存在、公开、且归属当前用户 ----------
  const repoRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
    headers: githubHeaders(env.GITHUB_TOKEN),
  })
  if (!repoRes.ok) {
    return jsonRes({ error: 'repo_not_accessible', detail: '仓库不存在、为私有仓库或不可访问' }, 404)
  }
  const repoData = await repoRes.json()
  if (repoData.private) {
    return jsonRes({ error: 'repo_not_accessible', detail: '暂不支持私有仓库' }, 404)
  }
  if (repoData.owner?.login !== auth.login) {
    return jsonRes({ error: 'repo_not_owned', detail: '仅支持绑定你自己名下的仓库' }, 403)
  }

  // ---------- 校验控件名归属（大小写不敏感，与历史数据一致处理） ----------
  const existingInfo = await env.RESOURCES.get(`${controlName}/information.json`)
  if (existingInfo && existingInfo.text) {
    try {
      const info = JSON.parse(await existingInfo.text())
      if (info?.author && String(info.author).toLowerCase() !== auth.login.toLowerCase()) {
        return jsonRes({ error: 'name_taken_by_other' }, 409)
      }
    } catch {
      return jsonRes({ error: 'control_info_corrupted' }, 409)
    }
  }

  // ---------- 一个控件仅允许绑定一个仓库 ----------
  const existingBinding = await env.DB.prepare(
    'SELECT id, repo_owner, repo_name FROM github_sync_repos WHERE control_name = ?1',
  )
    .bind(controlName)
    .first()
  if (existingBinding) {
    return jsonRes({ error: 'already_bound', detail: '该控件已绑定其他仓库，请先解绑' }, 409)
  }

  // ---------- 预检仓库结构（允许 0 个合法版本，先绑后推代码） ----------
  let validVersions = 0
  let totalFiles = 0
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      { headers: githubHeaders(env.GITHUB_TOKEN) },
    )
    if (treeRes.ok) {
      const treeData = await treeRes.json()
      if (Array.isArray(treeData?.tree)) {
        const entries = treeData.tree as TreeEntry[]
        validVersions = parseRepoTree(entries).versions.length
        totalFiles = entries.filter((e) => e.type === 'blob').length
      }
    }
  } catch {
    // 预检失败不阻断绑定
  }

  // ---------- 写入绑定关系 ----------
  const syncSecret = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
  try {
    await env.DB.prepare(
      'INSERT INTO github_sync_repos (control_name, repo_owner, repo_name, branch, sync_secret, created_at, last_sync_status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
    )
      .bind(controlName, auth.login, parsed.repo, branch, syncSecret, new Date().toISOString(), 'never')
      .run()
  } catch (dbErr: any) {
    return jsonRes({ error: 'bind_failed', detail: dbErr?.message }, 500)
  }

  return jsonRes({
    ok: true,
    controlName,
    repo: `${parsed.owner}/${parsed.repo}`,
    branch,
    validVersions,
    totalFiles,
    syncSecret,
    syncEndpoint: '/api/github-sync/sync',
    exampleCurl: `curl -X POST -H "Authorization: Bearer ${syncSecret}" -H "Content-Type: application/json" -d '{"controlName":"${controlName}"}' https://cc.zitzhen.cn/api/github-sync/sync`,
  })
  } catch (err: any) {
    return jsonRes({ error: 'server_error', message: err?.message }, 500)
  }
})
