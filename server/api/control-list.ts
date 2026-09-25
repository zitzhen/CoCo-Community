import { getCloudflareContext } from "~/server/utils/cloudflare"

type ComponentRow = {
  id: number
  name: string
  size: string
  downloads: number
  likes: number
  collections: number
  author: string
  Pageviews: number
}

// 控件列表：直接从 D1 components 表实时读取（原由子模块的 list.json 提供）
export default defineEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  try {
    const stmt = env.DB.prepare(
      "SELECT id, name, size, downloads, likes, collections, author, Pageviews FROM components ORDER BY id"
    )
    const { results } = await stmt.all<ComponentRow>()

    return { list: results || [] }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Failed to load components", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
