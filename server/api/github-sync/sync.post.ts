import { getCloudflareContext } from '~/server/utils/cloudflare'
import { requireGithubUser } from '~/server/utils/auth'
import { mirrorRepo, recordSyncResult, type RepoBinding } from '~/server/utils/github-sync'

const RATE_LIMIT_MS = 60 * 1000 // 同一绑定 60s 内仅允许一次同步

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

type BindingRow = RepoBinding & { sync_secret: string; last_synced_at: string | null }

// 同步触发（预留 API）：
// - 网页手动：Cookie 双令牌登录，且为绑定归属者
// - 仓库 CI 通知：Authorization: Bearer <sync_secret>（绑定接口返回，建议存仓库 Secrets）
export default defineEventHandler(async (event) => {
  try {
  const { request, env } = getCloudflareContext(event)

  if (!env.DB || !env.RESOURCES) {
    return jsonRes({ error: 'server_configuration_error', detail: 'missing env: DB/RESOURCES bindings' }, 500)
  }

  const body = await readBody(event).catch(() => null)
  const controlName = String(body?.controlName || '').trim()
  const repoInput = String(body?.repo || '').trim()

  // ---------- 鉴权：优先 Bearer sync_secret，否则回退 Cookie ----------
  const authHeader = request.headers.get('Authorization') || ''
  const bearer = authHeader.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()

  let binding: BindingRow | null = null

  if (bearer) {
    binding = await env.DB.prepare(
      'SELECT id, control_name, repo_owner, repo_name, branch, sync_secret, last_synced_at FROM github_sync_repos WHERE sync_secret = ?1',
    )
      .bind(bearer)
      .first<BindingRow>()
    if (!binding) {
      return jsonRes({ error: 'invalid_sync_secret' }, 401)
    }
    // secret 定位后若入参与绑定不符，拒绝（防止拿 A 的 secret 触发 B）
    if (controlName && controlName !== binding.control_name) {
      return jsonRes({ error: 'binding_mismatch' }, 403)
    }
  } else {
    const auth = await requireGithubUser(event)
    if (auth instanceof Response) return auth

    if (controlName) {
      binding = await env.DB.prepare(
        'SELECT id, control_name, repo_owner, repo_name, branch, sync_secret, last_synced_at FROM github_sync_repos WHERE control_name = ?1',
      )
        .bind(controlName)
        .first<BindingRow>()
    } else if (repoInput) {
      const m = repoInput.match(/(?:github\.com[/:])?([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/)
      if (m) {
        binding = await env.DB.prepare(
          'SELECT id, control_name, repo_owner, repo_name, branch, sync_secret, last_synced_at FROM github_sync_repos WHERE repo_owner = ?1 AND repo_name = ?2',
        )
          .bind(m[1], m[2])
          .first<BindingRow>()
      }
    }
    if (!binding) {
      return jsonRes({ error: 'not_bound' }, 404)
    }
    if (binding.repo_owner !== auth.login) {
      return jsonRes({ error: 'not_owner' }, 403)
    }
  }

  if (!binding) {
    return jsonRes({ error: 'not_bound' }, 404)
  }

  // ---------- 限流 ----------
  if (binding.last_synced_at) {
    const last = Date.parse(binding.last_synced_at)
    if (!Number.isNaN(last) && Date.now() - last < RATE_LIMIT_MS) {
      return jsonRes(
        { error: 'sync_too_frequent', retry_after_seconds: Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000) },
        429,
      )
    }
  }

  // ---------- 执行全量镜像 ----------
  let result
  try {
    result = await mirrorRepo(env, binding)
  } catch (err: any) {
    result = {
      status: 'failed' as const,
      filesSynced: [],
      unchanged: 0,
      ignored: 0,
      skipped: [],
      deleted: [],
      versions: { added: [], all: [] },
      currentVersion: '',
      warnings: [],
      error: `sync_exception: ${err?.message || 'unknown'}`,
    }
  }
  await recordSyncResult(env, binding.id, result)

  return jsonRes({
    ok: result.status === 'ok',
    status: result.status,
    controlName: binding.control_name,
    repo: `${binding.repo_owner}/${binding.repo_name}`,
    filesSynced: result.filesSynced,
    unchanged: result.unchanged,
    ignored: result.ignored,
    skipped: result.skipped,
    deleted: result.deleted,
    versions: result.versions,
    currentVersion: result.currentVersion,
    warnings: result.warnings,
    error: result.error,
  }, result.status === 'failed' ? 502 : 200)
  } catch (err: any) {
    return jsonRes({ error: 'server_error', message: err?.message }, 500)
  }
})
