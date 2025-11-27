// @ts-nocheck
export const onRequestGet: PagesFunction = async ({ request }) => {
  // ✅ 白名单校验：只允许 cc.zitzhen.cn
  const origin = request.headers.get("Origin") || "";
  const referer = request.headers.get("Referer") || "";
  const allowedDomain = "https://cc.zitzhen.cn";
  // Only allow if either Origin or Referer strictly equals the allowed domain as origin
  const isValidOrigin = (() => {
    try {
      if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.origin === allowedDomain) return true;
      }
    } catch (e) {
      // Ignore parsing errors; treat as invalid
    }
    return false;
  })();
  const isValidReferer = (() => {
    try {
      if (referer) {
        const refererUrl = new URL(referer);
        if (refererUrl.origin === allowedDomain) return true;
      }
    } catch (e) {
      // Ignore parsing errors; treat as invalid
    }
    return false;
  })();
  if (!isValidOrigin && !isValidReferer) {
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

  // 并行请求打开和关闭的议题
  const openIssuesUrl = `https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=open`;
  const closedIssuesUrl = `https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=closed`;
  
  const [openResponse, closedResponse] = await Promise.all([
    fetch(openIssuesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Cloudflare-Worker",
      },
    }),
    fetch(closedIssuesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Cloudflare-Worker",
      },
    })
  ]);

  // 检查请求是否成功
  if (!openResponse.ok) {
    const errorText = await openResponse.text();
    return new Response(JSON.stringify({ error: "GitHub API request failed for open issues", details: errorText }), {
      status: openResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!closedResponse.ok) {
    const errorText = await closedResponse.text();
    return new Response(JSON.stringify({ error: "GitHub API request failed for closed issues", details: errorText }), {
      status: closedResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 获取数据
  const openData = await openResponse.json();
  const closedData = await closedResponse.json();

  // 过滤掉 PR（pull requests）
  const filteredOpenIssues = openData.filter(item => !item.pull_request);
  const filteredClosedIssues = closedData.filter(item => !item.pull_request);

  // 合并打开和关闭的议题
  const allFilteredIssues = [...filteredOpenIssues, ...filteredClosedIssues];

  return new Response(JSON.stringify(allFilteredIssues), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": allowedDomain,
    },
  });
};