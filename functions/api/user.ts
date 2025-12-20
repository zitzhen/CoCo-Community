export async function onRequest(context) {
  const { request, env } = context;
  
  // 确保是GET请求
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 获取URL参数
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  
  // 检查username参数是否存在
  if (!username) {
    return new Response(JSON.stringify({ error: 'Username parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // 查询D1数据库中的user表
    const result = await env.DB.prepare(
      'SELECT * FROM user WHERE username = ?'
    ).bind(username).all();
    
    // 返回查询结果
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database query failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}