import { getCloudflareContext } from "~/server/utils/cloudflare"

type EssayRow = {
  name: string
  author: string
  publication_time: string
  content: string
  pageviews: number
  Like: number
  collect: number
  id: number
}

// 文章列表：服务端直接查询 Cloudflare D1 的 essay 表
// （"Like" 是 SQL 保留字，需双引号转义）
export default defineCachedEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  const { results } = await env.DB.prepare(
    `SELECT name, author, publication_time, content, pageviews, "Like", collect, id FROM essay ORDER BY rowid`
  ).all<EssayRow>()

  return { list: results }
}, {
  maxAge: 60 * 5,
  // 开发环境不缓存，保证每次都实时查询 D1
  shouldBypass: () => import.meta.dev,
})
