import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin } from "~/server/utils/github"
export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event);

  // 限制来源（生产域名 + 开发环境）
  const forbidden = assertAllowedOrigin(request);
  if (forbidden) return forbidden;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { username, nickname } = await request.json();

    if (!username || !nickname) {
      return new Response('Missing username or nickname', { status: 400 });
    }

    // 查询用户是否存在
    const existingUser = await env.DB.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first();

    if (!existingUser) {
      return new Response('User not found', { status: 404 });
    }

    // 更新昵称
    await env.DB.prepare(
      'UPDATE users SET nickname = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?'
    ).bind(nickname, username).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Nickname updated',
      data: { username, nickname }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
