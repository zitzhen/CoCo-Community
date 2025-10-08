export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 调用 GitHub 交换 access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "User-Agent": "CloudflarePages-Debug/1.0 (+https://yourdomain.com)", // ✅ GitHub 要求
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    // 打印所有可见的响应信息（用于确认被封原因）
    const status = tokenRes.status;
    const headers: Record<string, string> = {};
    for (const [key, value] of tokenRes.headers.entries()) {
      headers[key] = value;
    }

    const rawBody = await tokenRes.text(); // ⚠️ 不解析 JSON，直接读原文
    console.log("GitHub token fetch result:", {
      status,
      headers,
      rawBody: rawBody.slice(0, 500), // 日志中只显示前500字符，防止太长
    });

    // 将完整响应返回给浏览器（仅调试用）
    return new Response(
      JSON.stringify(
        {
          status,
          headers,
          body: rawBody,
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (err: any) {
    console.error("OAuth error:", err);
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};
/*export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("Missing code", { status: 400 });
    }

    // Step 1: 正确交换 access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json", // ✅ 只保留这一项
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("GitHub token response:", tokenData);

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
    console.log("GitHub user info:", user);

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
    console.error("OAuth error:", err);
    return new Response("OAuth error: " + err.message, { status: 500 });
  }
};
*/