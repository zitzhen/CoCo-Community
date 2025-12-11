// @ts-nocheck
import type { Env } from "./types";

export interface GitHubUser {
  login: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    
    // 确保是POST请求
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ status: "error", message: "Only POST method is allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    const { EssayID, content } = body;
    
    // 验证必需参数
    if (!EssayID || !content) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "EssayID and content are required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 验证EssayID是数字
    if (typeof EssayID !== 'number' || !Number.isInteger(EssayID)) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "EssayID must be an integer" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 验证content是字符串且长度合理
    if (typeof content !== 'string' || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Content must be a non-empty string" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (content.trim().length > 1000) { // 最大长度为1000字符
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Content is too long (maximum 1000 characters)" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 从Cookie中获取token
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Authentication token is required" 
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 解析Cookie字符串获取token
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const token = cookies['token'];
    if (!token) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Authentication token is required" 
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 获取客户端 IP
    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for") ||
      "unknown";
    
    // 使用token查询GitHub API获取用户名
    const githubResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'CoCo-Community'
      }
    });
    
    if (!githubResponse.ok) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Failed to authenticate with GitHub" 
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const githubUser: GitHubUser = await githubResponse.json();
    const username = githubUser.login;
    
    // 将评论数据插入数据库
    await env.DB.prepare(
      "INSERT INTO comments (username, content, time, ip, essayid) VALUES (?1, ?2, ?3, ?4, ?5)"
    ).bind(
      username, 
      content.trim(), 
      new Date().toISOString(), 
      ip, 
      EssayID
    ).run();
    
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Comment added successfully",
        data: {
          id:EssayID,
          username,
          content: content.trim(),
          time: new Date().toISOString(),
          ip,
          essayid: EssayID
        }
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
