export const onRequestGet: PagesFunction = async ({ request, env }) => {
  try {
    // 1. 解析 Cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const getCookie = (name: string) => {
      const match = cookieHeader.match(new RegExp("(^|; )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    };
    const token = getCookie("token");

    if (!token) {
      return new Response(JSON.stringify({ error: "no_token" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }

    // 2. 可选：简易令牌长度校验，防止空字符串
    if (typeof token !== "string" || token.length < 10) {
      return new Response(JSON.stringify({ error: "invalid_token" }), {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // 3. 请求 GitHub 验证 token 并获取用户信息
    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "YourAppName-Server",
      },
    });

    // 4. 如果 token 无效或被撤销，GitHub 通常返回 401/403
    if (!githubRes.ok) {
      const text = await githubRes.text().catch(() => "");
      return new Response(JSON.stringify({ error: "github_error", status: githubRes.status, detail: text }), {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    const user = await githubRes.json();

    // 5. 只返回安全且必要的字段
    const safeUser = {
      id: user.id,
      login: user.login,
      name: user.name ?? null,
      avatar_url: user.avatar_url ?? null,
      html_url: user.html_url ?? null,
      email: user.email ?? null,
      bio: user.bio ?? null,
    };

    // 6. 成功响应（可根据需要添加缓存头或使用 KV 缓存）
    return new Response(JSON.stringify({ authenticated: true, user: safeUser }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store", // token 相关数据通常不缓存到浏览器
      },
    });
  } catch (err: any) {
    console.error("api/me error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};
