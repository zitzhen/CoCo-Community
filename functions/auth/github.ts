export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const jwt = require('jsonwebtoken');

    if (!code) {
      return new Response(JSON.stringify({ error: "missing_code" }), { status: 400 });
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json(); // ✅ 正确解析 JSON
    const accessToken = tokenData.access_token;

    if (!accessToken || accessToken.length < 10) {
      return new Response(JSON.stringify({ error: "no_token", detail: JSON.stringify(tokenData) }), { status: 401 });
    }


    // 请求用户Github信息
    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
    });

    const githubResData = await githubRes.json();
    const username = githubResData.login;
    const secretKey = env.COCO_COMMUNITY_JWT;
    const maxExp = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const key_maximum_lifespan = {
      username: username,
      time: Date.now(),
      max_exp: maxExp
    };

    const maximum_lifespan_token = jwt.sign(key_maximum_lifespan, secretKey);
    
    const cookie = [
      `token=${accessToken}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`,
    ].join("; ");

    const maximum_lifespan = [
      `maximum_lifespan=${maximum_lifespan_token}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`,
    ].join("; ");

    const headers = new Headers();
    headers.append("Set-Cookie", cookie);
    headers.append("Set-Cookie", maximum_lifespan);
    headers.set("Location", "/");

    return new Response(null, {
      status: 302,
      headers: headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};