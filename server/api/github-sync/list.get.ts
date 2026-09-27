import { requireGithubUser } from '~/server/utils/auth'
import { getCloudflareContext } from '~/server/utils/cloudflare'

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 当前登录用户的仓库绑定列表（sync_secret 仅归属者本人可见，用于配置仓库 CI）
export default defineEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  const auth = await requireGithubUser(event)
  if (auth instanceof Response) return auth

  if (!env.DB) {
    return jsonRes({ error: 'server_configuration_error', detail: 'missing env: DB binding' }, 500)
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT control_name, repo_owner, repo_name, branch, sync_secret, created_at, last_synced_at, last_sync_status, last_sync_detail FROM github_sync_repos WHERE repo_owner = ?1 ORDER BY created_at DESC',
    )
      .bind(auth.login)
      .all()
    return jsonRes({
      list: (results || []).map((row: any) => ({
        controlName: row.control_name,
        repo: `${row.repo_owner}/${row.repo_name}`,
        branch: row.branch,
        syncSecret: row.sync_secret,
        createdAt: row.created_at,
        lastSyncedAt: row.last_synced_at,
        lastSyncStatus: row.last_sync_status,
        lastSyncDetail: row.last_sync_detail ? safeParse(row.last_sync_detail) : null,
      })),
    })
  } catch (err: any) {
    return jsonRes({ error: 'list_failed', detail: err?.message }, 500)
  }
})

function safeParse(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
