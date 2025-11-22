// @ts-nocheck
export const onRequestGet: PagesFunction = async ({ request, env }) => {
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
      return new Response(JSON.stringify({ authenticated: false, error: "maximum_lifespan_token_missing" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. 验证 JWT 签名
    const jwt = require('jsonwebtoken');
    const secretKey = env.COCO_COMMUNITY_JWT;

    if (!secretKey) {
      return new Response(JSON.stringify({ authenticated: false, error: "server_configuration_error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(maximum_lifespan_token, secretKey);
    } catch (err) {
      return new Response(JSON.stringify({ authenticated: false, error: "invalid_maximum_lifespan_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. 请求 GitHub 用户信息
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

    const user = await githubRes.json();

    // 5. 校验 JWT 中的用户名是否与 GitHub token 获取的用户名匹配
    if (decodedToken.username !== user.login) {
      return new Response(JSON.stringify({ authenticated: false, error: "username_mismatch" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6. 获取剩余额度
    const rateLimitRemaining = githubRes.headers.get("X-RateLimit-Remaining");
    const rateLimitLimit = githubRes.headers.get("X-RateLimit-Limit");
    const rateLimitReset = githubRes.headers.get("X-RateLimit-Reset");

    // 7. 返回精简用户信息 + 剩余额度
    const safeUser = {
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    };

    // 8. 实现滑动过期逻辑
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
};
