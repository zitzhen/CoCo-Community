function checkOrigin(value: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.origin === "https://cc.zitzhen.cn") return true;
    // 开发环境白名单
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.endsWith(".test")) return true;
  } catch {
    // ignore
  }
  return false;
}

export function getGithubToken(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
}

export function assertAllowedOrigin(request: Request) {
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";

  const hasAllowedOrigin = [origin, referer].some(checkOrigin);

  if (!hasAllowedOrigin) {
    return new Response(JSON.stringify({ error: "Forbidden: Invalid origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}

export function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "Cloudflare-Worker",
  };
}
