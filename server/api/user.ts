import { getCloudflareContext } from "~/server/utils/cloudflare"
import { resolveAvatarUrl } from "~/server/utils/user"
export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event);
  
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
    // 查询D1数据库中的user表（GitHub 用户名大小写不敏感，用 LOWER 匹配）
    const result = await env.DB.prepare(
      'SELECT * FROM user WHERE LOWER(username) = LOWER(?)'
    ).bind(username).all();
    
    // 手动上传头像在 D1 中为 avatar/<文件名>，输出为可访问的 /resource/ 路径
    const results = (result.results || []).map((u) => ({
      ...u,
      avatar: resolveAvatarUrl(u.avatar),
    }));
    
    // 返回查询结果
    return new Response(JSON.stringify({ ...result, results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Database query failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
