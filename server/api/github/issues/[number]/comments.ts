import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin, getGithubToken, githubHeaders, getClientKind, withViaSignature } from "~/server/utils/github"
// @ts-nocheck

const REPO = "zitzhen/CoCo-Community"
const BODY_MAX = 5000
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

  // ---------- GET：评论列表（GitHub 默认每页 30 条） ----------
  const githubResponse = await fetch(
    `https://api.github.com/repos/${REPO}/issues/${number}/comments`,
    { headers: githubHeaders(token) },
  );

  if (!githubResponse.ok) {
    const errorText = await githubResponse.text();
    return new Response(JSON.stringify({ error: "GitHub API request failed", details: errorText }), {
      status: githubResponse.status,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify(await githubResponse.json()), {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
    },
  });
});
