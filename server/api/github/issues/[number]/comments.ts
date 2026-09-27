import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin, getGithubToken, githubHeaders, getClientKind, withViaSignature } from "~/server/utils/github"
// @ts-nocheck

const REPO = "zitzhen/CoCo-Community"
const BODY_MAX = 5000
// 评论 GET 分页聚合：100 条/页，最多 5 页（500 条），防止异常议题拖垮 Worker
const COMMENTS_PER_PAGE = 100
const COMMENTS_MAX_PAGES = 5
const JSON_HEADERS = { "Content-Type": "application/json" }

export default defineEventHandler(async (event) => {
  const { request } = getCloudflareContext(event);
  const forbidden = assertAllowedOrigin(request);
  if (forbidden) return forbidden;

  const token = getGithubToken(request);

  const number = getRouterParam(event, "number");
  if (!number || !/^\d+$/.test(number)) {
    return new Response(JSON.stringify({ error: "Missing or invalid issue number" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // ---------- POST：发表评论（必须登录） ----------
  if (request.method === "POST") {
    if (!token || token.length < 10) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: JSON_HEADERS,
      });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "invalid_json" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }

    const content = typeof body?.body === "string" ? body.body.trim() : "";
    if (!content) {
      return new Response(JSON.stringify({ error: "missing_body" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }
    if (content.length > BODY_MAX) {
      return new Response(
        JSON.stringify({ error: "body_too_long", detail: `评论不能超过 ${BODY_MAX} 个字符` }),
        { status: 400, headers: JSON_HEADERS }
      );
    }

    const githubResponse = await fetch(
      `https://api.github.com/repos/${REPO}/issues/${number}/comments`,
      {
        method: "POST",
        headers: { ...githubHeaders(token), "Content-Type": "application/json" },
        // 正文末尾空两行追加来源标记（web / api）
        body: JSON.stringify({ body: withViaSignature(content, getClientKind(request)) }),
      }
    );

    const text = await githubResponse.text();
    if (!githubResponse.ok) {
      // 议题不存在 / 已关闭不可评论等情况透传 GitHub 状态码
      return new Response(
        JSON.stringify({ error: "GitHub API create comment failed", details: text }),
        { status: githubResponse.status, headers: JSON_HEADERS }
      );
    }

    return new Response(text, {
      status: githubResponse.status,
      headers: { ...JSON_HEADERS, "Access-Control-Allow-Origin": "https://cc.zitzhen.cn" },
    });
  }

  // ---------- GET：评论列表（分页聚合，突破 GitHub 默认 30 条截断） ----------
  const allComments = []
  let truncated = false
  for (let page = 1; page <= COMMENTS_MAX_PAGES; page++) {
    const githubResponse = await fetch(
      `https://api.github.com/repos/${REPO}/issues/${number}/comments?per_page=${COMMENTS_PER_PAGE}&page=${page}`,
      { headers: githubHeaders(token) },
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return new Response(JSON.stringify({ error: "GitHub API request failed", details: errorText }), {
        status: githubResponse.status,
        headers: JSON_HEADERS,
      });
    }

    const data = await githubResponse.json();
    allComments.push(...data);
    // 不足整页说明已到末尾；超过页数上限则标记截断
    if (data.length < COMMENTS_PER_PAGE) break;
    if (page === COMMENTS_MAX_PAGES) truncated = true;
  }

  return new Response(JSON.stringify(allComments), {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
      "X-List-Truncated": truncated ? "true" : "false",
    },
  });
});
