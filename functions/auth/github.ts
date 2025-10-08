export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 请求 GitHub 交换 access_token（解析为文本）
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json", // ✅ GitHub 有时忽略这个
        "User-Agent": "Cloudflare-Worker-OAuth",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const rawText = await tokenRes.text();
    console.log("GitHub raw token response:", rawText);

    // Step 2: 手动解析 access_token
    const params = new URLSearchParams(rawText);
    const accessToken = params.get("access_token");

    if (!accessToken) {
      return new Response("Failed to get access token: " + rawText, { status: 401 });
    }

    // Step 3: 获取 GitHub 用户信息
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const user = await userRes.json();
    console.log("GitHub user info:", user);

    // Step 4: 设置 Cookie 并跳转
    const cookie = `token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`;

    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": cookie,
        Location: "/",
      },
    });
  } catch (err: any) {
    console.error("OAuth error:", err);
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};