import { getCloudflareContext } from "~/server/utils/cloudflare"

type UserRow = {
  username: string
  nickname: string
  number_of_controls: number
  avatar: string
  bio: string
  pageviews: number
}

// 用户列表：服务端直接查询 Cloudflare D1 的 user 表
export default defineCachedEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  // number_of_controls 从 components 表动态统计（user 表的该字段从未被更新，始终为 0）
  // author 与 username 均按 LOWER() 匹配，兼容历史数据大小写不一致
  const { results } = await env.DB.prepare(
    `SELECT u.username, u.nickname, u.avatar, u.bio, u.pageviews,
            (SELECT COUNT(*) FROM components c WHERE LOWER(c.author) = LOWER(u.username)) AS number_of_controls
     FROM user u ORDER BY u.rowid`
  ).all<UserRow>()

  return { list: results }
}, {
  maxAge: 60 * 5,
  // 开发环境不缓存，保证每次都实时查询 D1
  shouldBypass: () => import.meta.dev,
})
