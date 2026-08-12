export function getGithubToken(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
}

export function assertAllowedOrigin(request: Request) {
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const allowedDomain = "https://cc.zitzhen.cn";

  const hasAllowedOrigin = [origin, referer].some((value) => {
    if (!value) return false;
    try {
      return new URL(value).origin === allowedDomain;
    } catch {
      return false;
    }
  });

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
