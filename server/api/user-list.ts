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

  const { results } = await env.DB.prepare(
    `SELECT username, nickname, number_of_controls, avatar, bio, pageviews FROM user ORDER BY rowid`
  ).all<UserRow>()

  return { list: results }
}, {
  maxAge: 60 * 5,
  // 开发环境不缓存，保证每次都实时查询 D1
  shouldBypass: () => import.meta.dev,
})
