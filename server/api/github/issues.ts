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

async function fetchAllIssues(state: string, token: string) {
  const all: any[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
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

// GET：拉取 open + closed 全量议题（过滤 PR）
async function handleList(token: string) {
  const [openResult, closedResult] = await Promise.all([
    fetchAllIssues("open", token),
    fetchAllIssues("closed", token),
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

  // 解析 Cookie 中的 GitHub token
  const token = getGithubToken(request)
  if (!token || token.length < 10) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: JSON_HEADERS,
    })
  }

  if (request.method === "POST") {
    return handleCreate(request, token)
  }
  return handleList(token)
})
