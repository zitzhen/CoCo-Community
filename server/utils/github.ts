function checkOrigin(value: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.origin === "https://cc.zitzhen.cn") return true;
    // Cloudflare Pages 预览部署（<branch>.<project>.pages.dev）
    if (
      url.protocol === "https:" &&
      (url.hostname === "pages.dev" || url.hostname.endsWith(".pages.dev"))
    ) {
      return true;
    }
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

// 判断调用来源：浏览器同源请求为 web；移动端携带 X-Client: mobile/api
// 或 ?client=mobile/api 时为 api（与 /auth/github 的约定一致）
export function getClientKind(request: Request): "web" | "api" {
  const xClient = (request.headers.get("X-Client") || "").toLowerCase();
  let queryClient = "";
  try {
    queryClient = (new URL(request.url).searchParams.get("client") || "").toLowerCase();
  } catch {
    // ignore
  }
  return xClient === "mobile" || xClient === "api" ||
    queryClient === "mobile" || queryClient === "api"
    ? "api"
    : "web";
}

// 在用户正文末尾空两行追加来源标记（HTML 注释，GitHub 渲染时不可见，raw 中可审计）
export function withViaSignature(body: string, client: "web" | "api"): string {
  const tag = `<!-- via coco-community ${client} -->`;
  const trimmed = (body || "").trimEnd();
  return trimmed ? `${trimmed}\n\n\n${tag}` : tag;
}
