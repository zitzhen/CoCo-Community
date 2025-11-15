export async function onRequest(context) {
  const { request, env } = context;

  // 限制来源
  const origin = request.headers.get('Origin');
  if (origin !== 'https://cc.zitzhen.cn') {
    return new Response('Forbidden: Invalid origin', { status: 403 });
  }

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
}