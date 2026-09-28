import { getCloudflareContext } from '~/server/utils/cloudflare'
import { requireGithubUser } from '~/server/utils/auth'
import { assertAllowedOrigin } from '~/server/utils/github'

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 解绑仓库：仅删除 D1 绑定关系，不动 R2 中已同步的控件数据
export default defineEventHandler(async (event) => {
  try {
  const { request, env } = getCloudflareContext(event)

  if (!env.DB) {
    return jsonRes({ error: 'server_configuration_error', detail: 'missing env: DB binding' }, 500)
  }

  const originError = assertAllowedOrigin(request)
  if (originError) return originError

  const auth = await requireGithubUser(event)
  if (auth instanceof Response) return auth

  const body = await readBody(event).catch(() => null)
  const controlName = String(body?.controlName || '').trim()
  if (!controlName) {
    return jsonRes({ error: 'missing_control_name' }, 400)
  }

  const binding = await env.DB.prepare(
    'SELECT id, repo_owner FROM github_sync_repos WHERE control_name = ?1',
  )
    .bind(controlName)
    .first<{ id: number; repo_owner: string }>()

  if (!binding) {
    return jsonRes({ error: 'not_bound' }, 404)
  }
  if (binding.repo_owner !== auth.login) {
    return jsonRes({ error: 'not_owner' }, 403)
  }

  try {
    await env.DB.prepare('DELETE FROM github_sync_repos WHERE id = ?1').bind(binding.id).run()
  } catch (err: any) {
    return jsonRes({ error: 'unbind_failed', detail: err?.message }, 500)
  }

  return jsonRes({ ok: true, controlName })
  } catch (err: any) {
    return jsonRes({ error: 'server_error', message: err?.message }, 500)
  }
})
