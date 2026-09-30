import { getCloudflareContext } from "~/server/utils/cloudflare"
import { findUserByUsername, resolveAvatarUrl } from "~/server/utils/user"
// @ts-nocheck
import { jwtVerify } from 'jose';

export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event);
  try {
    // 1. 解析 Cookie
    const cookieHeader = request.headers.get("Cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    const maximum_lifespan_token = (request.headers.get('Cookie') || '')
      .split(';')
      .find(row => row.trim().startsWith('maximum_lifespan='))
      ?.split('=')[1] || null;

    if (!token || token.length < 10) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. 验证 maximum_lifespan_token 是否存在
    if (!maximum_lifespan_token) {
      // 如果没有 maximum_lifespan_token 但有 token，说明用户已超过最大生命周期，需要强制退出
      if (token) {
        // 设置 token 过期
        const expiredTokenCookie = [
          `token=`,
          "Path=/",
          "HttpOnly",
          "Secure",
          "SameSite=Lax",
          `Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        ].join("; ");
        
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.append("Set-Cookie", expiredTokenCookie);
        
        return new Response(JSON.stringify({ authenticated: false, error: "maximum_lifespan_token_missing" }), {
          status: 401,
          headers: headers,
        });
      } else {
        return new Response(JSON.stringify({ authenticated: false, error: "maximum_lifespan_token_missing" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 3. 验证 JWT 签名
    const secretKey = env.COCO_COMMUNITY_JWT;

    if (!secretKey) {
      return new Response(JSON.stringify({ authenticated: false, error: "server_configuration_error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decodedToken;
    try {
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(maximum_lifespan_token, secret);
      decodedToken = payload;
    } catch (err) {
      return new Response(JSON.stringify({ authenticated: false, error: "invalid_maximum_lifespan_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. 请求 GitHub 用户信息（仅用于校验 token 是否仍有效并获取 login）
    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
    });

    if (!githubRes.ok) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const githubUser = await githubRes.json();

    // 5. 校验 JWT 中的用户名是否与 GitHub token 获取的用户名匹配
    if (decodedToken.username !== githubUser.login) {
      return new Response(JSON.stringify({ authenticated: false, error: "username_mismatch" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6. 从 D1 读取用户资料（头像/昵称/bio 以 D1 为准，支持用户自定义）
    const d1User = await findUserByUsername(env, githubUser.login)

    if (!d1User) {
      return new Response(JSON.stringify({ authenticated: false, error: "user_not_found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 7. 获取剩余额度
    const rateLimitRemaining = githubRes.headers.get("X-RateLimit-Remaining");
    const rateLimitLimit = githubRes.headers.get("X-RateLimit-Limit");
    const rateLimitReset = githubRes.headers.get("X-RateLimit-Reset");

    // 8. 返回精简用户信息 + 剩余额度（资料来自 D1，字段名与旧 GitHub 响应保持一致）
    // avatar_url 已把手动上传的 avatar/<文件名> 解析为 /resource/avatar/<文件名>；
    // github_avatar_url 为 GitHub 原始头像，供设置页"获取 GitHub 头像 URL"按钮回填
    const safeUser = {
      login: d1User.username,
      name: d1User.nickname || d1User.username,
      avatar_url: resolveAvatarUrl(d1User.avatar),
      github_avatar_url: githubUser.avatar_url || "",
      bio: d1User.bio || "",
      html_url: `https://github.com/${d1User.username}`,
    };

    // 9. 实现滑动过期逻辑
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-store");
    
    // 检查是否需要续期：如果 JWT 中的登录时间在 2 天前或更早，则续期
    // 这样可以实现文档中描述的"二次活跃=>延长Cookie到期时间为3天"的逻辑
    const currentTime = Date.now();
    const loginTime = decodedToken.time || 0;
    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000; // 2天的毫秒数
    
    // 如果登录时间超过2天，则为 token 续期
    if (currentTime - loginTime > TWO_DAYS_MS) {
      // 延长 token 过期时间为 3 天（滑动过期）
      const newTokenExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toUTCString();
      const tokenCookie = [
        `token=${token}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        `Expires=${newTokenExpiry}`,
      ].join("; ");
      
      headers.append("Set-Cookie", tokenCookie);
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user: safeUser,
      rateLimit: {
        remaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : null,
        limit: rateLimitLimit ? parseInt(rateLimitLimit) : null,
        reset: rateLimitReset ? parseInt(rateLimitReset) : null,
      }
    }), {
      status: 200,
      headers: headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
