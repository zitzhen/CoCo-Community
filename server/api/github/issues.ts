import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin, getGithubToken, githubHeaders, getClientKind, withViaSignature } from "~/server/utils/github"
// @ts-nocheck

// GitHub 默认每页 30 条且无分页会静默截断；这里按 100/页循环拉全量，
// 设 10 页上限（1000 条）防止异常仓库拖垮 Worker
const PER_PAGE = 100
const MAX_PAGES = 10
const REPO = "zitzhen/CoCo-Community"
const TITLE_MAX = 256
const BODY_MAX = 10000

const JSON_HEADERS = { "Content-Type": "application/json" }

async function fetchAllIssues(state: string, token: string | null, firstPageOnly = false) {
  // 匿名用户仅允许查看第一页（每个状态最多 1 次上游请求），
  // 登录用户按 MAX_PAGES 循环拉全量
  const maxPages = firstPageOnly ? 1 : MAX_PAGES
  const all: any[] = []
  for (let page = 1; page <= maxPages; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/issues?state=${state}&per_page=${PER_PAGE}&page=${page}`,
      { headers: githubHeaders(token) }
    )
    if (!res.ok) {
      return { failed: { status: res.status, text: await res.text(), state } }
    }
    const data = await res.json()
    all.push(...data)
    if (data.length < PER_PAGE) break
  }
  return { data: all }
}

// GET：拉取 open + closed 议题（过滤 PR）。token 可为空（匿名公共 API）。
// 匿名用户仅返回第一页（每状态前 100 条）；登录用户拉全量。
async function handleList(token: string | null) {
  const isAnonymous = !token
  const [openResult, closedResult] = await Promise.all([
    fetchAllIssues("open", token, isAnonymous),
    fetchAllIssues("closed", token, isAnonymous),
  ])

  for (const result of [openResult, closedResult]) {
    if (result.failed) {
      const f = result.failed
      return new Response(
        JSON.stringify({ error: `GitHub API request failed for ${f.state} issues`, details: f.text }),
        { status: f.status, headers: JSON_HEADERS }
      )
    }
  }

  const filtered = [...openResult.data, ...closedResult.data].filter(
    (item) => !item.pull_request
  )

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
      // 标注本次列表是否为匿名截断结果，便于客户端提示登录查看全部
      "X-List-Truncated": isAnonymous ? "true" : "false",
    },
  })
}

// POST：代用户创建议题（token 即创建者身份）
async function handleCreate(request: Request, token: string) {
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }

  const title = typeof body?.title === "string" ? body.title.trim() : ""
  const issueBody = typeof body?.body === "string" ? body.body.trim() : ""

  if (!title) {
    return new Response(JSON.stringify({ error: "missing_title" }), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }
  if (title.length > TITLE_MAX) {
    return new Response(
      JSON.stringify({ error: "title_too_long", detail: `标题不能超过 ${TITLE_MAX} 个字符` }),
      { status: 400, headers: JSON_HEADERS }
    )
  }
  if (issueBody.length > BODY_MAX) {
    return new Response(
      JSON.stringify({ error: "body_too_long", detail: `正文不能超过 ${BODY_MAX} 个字符` }),
      { status: 400, headers: JSON_HEADERS }
    )
  }

  // 不在服务端指定 labels：非协作者设置标签会被 GitHub 静默丢弃，保持创建结果可预期
  const client = getClientKind(request)
  const payload: { title: string; body: string } = {
    title,
    // 正文可空，但统一追加来源标记（空两行）
    body: withViaSignature(issueBody, client),
  }

  const githubResponse = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: { ...githubHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const text = await githubResponse.text()
  if (!githubResponse.ok) {
    return new Response(
      JSON.stringify({ error: "GitHub API create issue failed", details: text }),
      { status: githubResponse.status, headers: JSON_HEADERS }
    )
  }

  // 透传 GitHub 创建结果（含 number、html_url），状态码 201
  return new Response(text, {
    status: githubResponse.status,
    headers: {
      ...JSON_HEADERS,
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
    },
  })
}

export default defineEventHandler(async (event) => {
  const { request } = getCloudflareContext(event)
  // 白名单校验：生产域名 + pages.dev 预览 + 开发环境
  const forbidden = assertAllowedOrigin(request)
  if (forbidden) return forbidden

  // 解析 Cookie 中的 GitHub token（GET 允许匿名，POST 必须登录）
  const token = getGithubToken(request)

  // 跨域预检：同源请求不会走到这里，移动端等跨域客户端需要
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Client",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  if (request.method === "GET") {
    // 无 token 时以匿名方式请求 GitHub 公共 API（githubHeaders 会省略 Authorization）
    return handleList(token)
  }

  if (request.method === "POST") {
    if (!token || token.length < 10) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: JSON_HEADERS,
      })
    }
    return handleCreate(request, token)
  }

  // 其余方法一律拒绝，避免落到 handleList 造成语义混乱
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { ...JSON_HEADERS, Allow: "GET, POST, OPTIONS" },
  })
})
