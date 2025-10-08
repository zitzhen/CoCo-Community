export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 请求 GitHub 交换 access_token（只用 res.json()）
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

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // ✅ 正确判断：accessToken 存在且是字符串
    if (typeof accessToken !== "string" || accessToken.length < 10) {
      return new Response("Failed to get access token: " + JSON.stringify(tokenData), { status: 401 });
    }

    // Step 2: 获取 GitHub 用户信息
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const user = await userRes.json();
    console.log("GitHub user info:", user);

    // Step 3: 设置 Cookie 并跳转
    const cookie = [
      `token=${accessToken}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`,
    ].join("; ");

    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": cookie,
        Location: "/", // ✅ 可改为 /dashboard
      },
    });
  } catch (err: any) {
    console.error("OAuth error:", err);
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};