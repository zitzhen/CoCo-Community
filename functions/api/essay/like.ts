//@ts-nocheck
import { jwtVerify } from "jose";

// 从环境变量获取JWT公钥
const secret = new TextEncoder().encode(
  process.env.COCO_COMMUNITY_JWT_P || ""
);

interface JwtPayload {
  username: string;
  time: number;
}

export const onRequest: PagesFunction<{ DB: D1Database }> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // 检查请求方法
  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ status: "error", message: "Only GET method is allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  // 从Cookie中获取JWT token
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return new Response(
      JSON.stringify({ status: "error", message: "Authentication token is required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 解析Cookie字符串获取maximum_lifespan JWT token
  const jwtTokenMatch = cookieHeader.match(/(?:^|;\s*)maximum_lifespan=([^;]+)/);
  const jwtToken = jwtTokenMatch ? decodeURIComponent(jwtTokenMatch[1]) : null;

  if (!jwtToken || jwtToken.length < 10) {
    return new Response(
      JSON.stringify({ status: "error", message: "Invalid authentication token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // 从URL参数获取EssayID
  const essayIdParam = url.searchParams.get("EssayID");
  if (!essayIdParam) {
    return new Response(
      JSON.stringify({ status: "error", message: "EssayID parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 验证EssayID是数字
  const essayId = parseInt(essayIdParam);
  if (isNaN(essayId)) {
    return new Response(
      JSON.stringify({ status: "error", message: "EssayID must be a valid integer" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 验证JWT token
    let decodedToken: JwtPayload;
    try {
      const { payload } = await jwtVerify(jwtToken, secret);
      decodedToken = payload as JwtPayload;
    } catch (error) {
      return new Response(
        JSON.stringify({ status: "error", message: "Invalid or expired token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const username = decodedToken.username;

    // 检查用户是否已经点赞了此文章
    const existingLike = await env.DB.prepare(
      "SELECT * FROM essay_like WHERE username = ? AND essayid = ?"
    ).bind(username, essayId).first();

    if (existingLike) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Essay already liked by this user" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 检查EssayID是否存在
    const essay = await env.DB.prepare(
      "SELECT * FROM essay WHERE id = ?"
    ).bind(essayId).first();

    if (!essay) {
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Essay with this ID does not exist" 
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 从Cookie中获取GitHub token
    const githubTokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const githubToken = githubTokenMatch ? decodeURIComponent(githubTokenMatch[1]) : null;

    if (!githubToken || githubToken.length < 10) {
      return new Response(
        JSON.stringify({ status: "error", message: "GitHub token is required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 通过GitHub API验证用户
    const githubResponse = await fetch(`https://api.github.com/user`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
    });

    if (!githubResponse.ok) {
      return new Response(
        JSON.stringify({ status: "error", message: "Failed to authenticate with GitHub" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const githubUser = await githubResponse.json();
    if (githubUser.login !== username) {
      return new Response(
        JSON.stringify({ status: "error", message: "Username mismatch" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 将点赞数据写入数据库
    const currentTime = new Date().toISOString();
    const result = await env.DB.prepare(
      "INSERT INTO essay_like (username, essayid, time) VALUES (?1, ?2, ?3)"
    ).bind(username, essayId, currentTime).run();

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          status: "success", 
          message: "Essay liked successfully" 
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ status: "error", message: "Failed to save like to database" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: "Internal server error", details: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};