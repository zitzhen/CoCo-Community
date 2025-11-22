// @ts-nocheck
export const onRequestGet: PagesFunction = async ({ request }) => {
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

    // 2. 请求 GitHub 用户信息
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

    // 3. 获取剩余额度
    const rateLimitRemaining = githubRes.headers.get("X-RateLimit-Remaining");
    const rateLimitLimit = githubRes.headers.get("X-RateLimit-Limit");
    const rateLimitReset = githubRes.headers.get("X-RateLimit-Reset");

    // 4. 返回精简用户信息 + 剩余额度
    const safeUser = {
      id: user.id,
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    };

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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
