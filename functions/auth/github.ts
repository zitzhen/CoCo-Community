export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 交换 access token（修复格式）
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("GitHub token response:", tokenData); // 调试输出

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new Response("Failed to get access token: " + JSON.stringify(tokenData), { status: 401 });
    }

    // Step 2: 获取用户信息
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const user = await userRes.json();

    // Step 3: 设置 Cookie 并跳转
    const cookie = `token=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`;

    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": cookie,
        Location: "/",
      },
    });
  } catch (err: any) {
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};