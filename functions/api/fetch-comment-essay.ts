// @ts-nocheck
import type { Env } from "./types";

export interface Comment {
  id: number;
  username: string;
  content: string;
  time: string;
  ip: string;
  essayid: number;
  nickname?: string;
  avatar?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    // CORS: 允许调试域名并处理预检
    const allowedOrigins = new Set([
      "https://www.coco-community.test:5173",
      "https://coco-community.test:5173",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]);

    const origin = request.headers.get("origin");
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Vary": "Origin",
    };

    if (origin && allowedOrigins.has(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
    } else if (!origin) {
      corsHeaders["Access-Control-Allow-Origin"] = "*";
    }

    // 处理预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 仅允许 GET 方法用于此路由（除 preflight）
    if (request.method !== "GET") {
      return new Response(
        JSON.stringify({ status: "error", message: "Only GET method is allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 从URL参数获取EssayID
    const url = new URL(request.url);
    const essayIdParam = url.searchParams.get("EssayID");
    
    if (!essayIdParam) {
      return new Response(
        JSON.stringify({ status: "error", message: "EssayID parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 验证EssayID是数字
    const essayId = parseInt(essayIdParam);
    if (isNaN(essayId)) {
      return new Response(
        JSON.stringify({ status: "error", message: "EssayID must be a valid integer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // 查询数据库中对应EssayID的所有评论
    const queryResult = await env.DB.prepare(
      "SELECT id, username, content, time, ip, essayid FROM comment WHERE essayid = ? ORDER BY time DESC"
    ).bind(essayId).all();
    
    const comments = queryResult.results as Comment[];
    
    // 为每条评论获取用户信息（昵称和头像）
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      try {
        // 查询用户信息
        const userResult = await env.DB.prepare(
          "SELECT nickname, avatar_url FROM users WHERE username = ?"
        ).bind(comment.username).first();
        
        if (userResult) {
          comment.nickname = userResult.nickname || comment.username; // 如果没有昵称，则使用用户名
          comment.avatar = userResult.avatar_url || '/images/user.png'; // 如果没有头像，则使用默认头像
        } else {
          // 如果用户不存在，使用默认值
          comment.nickname = comment.username;
          comment.avatar = '/images/user.png';
        }
      } catch (err) {
        // 如果查询用户信息失败，使用默认值
        comment.nickname = comment.username;
        comment.avatar = '/images/user.png';
      }
    }
    
    return new Response(
      JSON.stringify({
        status: "success",
        message: "comment retrieved successfully",
        data: {
          essayId: essayId,
          comment: comments,
          count: comments.length,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { status: 500, headers: { ...({
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Vary": "Origin",
      }), "Content-Type": "application/json" } }
    );
  }
};