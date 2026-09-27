import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin, getGithubToken, githubHeaders } from "~/server/utils/github"
// @ts-nocheck

// GitHub 默认每页 30 条且无分页会静默截断；这里按 100/页循环拉全量，
// 设 10 页上限（1000 条）防止异常仓库拖垮 Worker
const PER_PAGE = 100
const MAX_PAGES = 10
const REPO = "zitzhen/CoCo-Community"

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

export default defineEventHandler(async (event) => {
  const { request } = getCloudflareContext(event);
  // ✅ 白名单校验：生产域名 + pages.dev 预览 + 开发环境
  const forbidden = assertAllowedOrigin(request);
  if (forbidden) return forbidden;

  // ✅ 解析 Cookie 中的 GitHub token
  const token = getGithubToken(request);

  if (!token || token.length < 10) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 并行分页请求打开和关闭的议题
  const [openResult, closedResult] = await Promise.all([
    fetchAllIssues("open", token),
    fetchAllIssues("closed", token),
  ]);

  if (openResult.failed) {
    const f = openResult.failed;
    return new Response(JSON.stringify({ error: `GitHub API request failed for ${f.state} issues`, details: f.text }), {
      status: f.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (closedResult.failed) {
    const f = closedResult.failed;
    return new Response(JSON.stringify({ error: `GitHub API request failed for ${f.state} issues`, details: f.text }), {
      status: f.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 过滤掉 PR（pull requests）后合并
  const filteredOpenIssues = openResult.data.filter(item => !item.pull_request);
  const filteredClosedIssues = closedResult.data.filter(item => !item.pull_request);
  const allFilteredIssues = [...filteredOpenIssues, ...filteredClosedIssues];

  return new Response(JSON.stringify(allFilteredIssues), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://cc.zitzhen.cn",
    },
  });
});