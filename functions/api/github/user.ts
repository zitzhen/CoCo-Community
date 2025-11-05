// @ts-nocheck
export const onRequestGet: PagesFunction = async ({ request }) => {
  // ✅ 白名单校验：只允许 cc.zitzhen.cn
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const allowedDomain = "https://cc.zitzhen.cn";

  if (!origin.startsWith(allowedDomain) && !referer.startsWith(allowedDomain)) {
    return new Response(JSON.stringify({ error: "Forbidden: Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ 解析 Cookie 中的 GitHub token
  const cookieHeader = request.headers.get("Cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  if (!token || token.length < 10) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ 获取前端传入的用户名
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "Missing 'username' parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ✅ 请求 GitHub API
  const githubApiUrl = `https://api.github.com/users/${username}`;
  const githubResponse = await fetch(githubApiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "Cloudflare-Worker",
    },
  });

  if (!githubResponse.ok) {
    const errorText = await githubResponse.text();
    return new Response(JSON.stringify({ error: "GitHub API request failed", details: errorText }), {
      status: githubResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userData = await githubResponse.json();

  return new Response(JSON.stringify(userData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": allowedDomain,
    },
  });
};