export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 请求 GitHub 交换 access_token（使用 res.text() 解析）
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json", // GitHub 有时忽略这个
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const rawText = await tokenRes.text();
    const params = new URLSearchParams(rawText);
    const accessToken = params.get("access_token");

    if (!accessToken || accessToken.length < 10) {
      return new Response("Failed to get access token: " + rawText, { status: 401 });
    }

    // Step 2: 设置 Cookie（7天有效期）
    const cookie = [
      `token=${accessToken}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`,
    ].join("; ");

    // Step 3: 跳转回首页（或你指定的页面）
    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": cookie,
        Location: "/", // ✅ 可改为 /dashboard 或 /welcome
      },
    });
  } catch (err: any) {
    console.error("OAuth error:", err);
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};