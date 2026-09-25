import { getCloudflareContext } from "~/server/utils/cloudflare"
import { readControlInfo, resolveControlKey } from "~/server/utils/control-resource"
import type { R2Bucket } from "~/server/utils/cloudflare"

type CounterRow = {
  name: string
  downloads: number
  likes: number
  collections: number
  Pageviews: number
}

// 枚举 R2 桶内所有控件（顶层“目录”即一个控件）
async function listControlNames(bucket: R2Bucket): Promise<string[]> {
  const names: string[] = []
  let cursor: string | undefined

  do {
    const page = await bucket.list({ delimiter: "/", cursor, limit: 1000 })
    for (const prefix of page.delimitedPrefixes) {
      names.push(prefix.replace(/\/$/, ""))
    }
    cursor = page.truncated ? page.cursor : undefined
  } while (cursor)

  return names
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KiB`
}

// 控件列表：R2 枚举控件目录 + information.json，计数类字段合并自 D1
// （R2 上没有 list.json，因此由服务端直接查询 R2）
export default defineCachedEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  try {
    const names = await listControlNames(env.RESOURCES)

    // 计数信息：D1 可用时（生产）按名称合并；失败则全部为 0
    const counters = new Map<string, CounterRow>()
    try {
      const { results } = await env.DB.prepare(
        "SELECT name, downloads, likes, collections, Pageviews FROM components"
      ).all<CounterRow>()
      for (const row of results) counters.set(row.name, row)
    } catch {
      // D1 不可用（如本地未建表）不影响控件目录展示
    }

    const list = await Promise.all(
      names.map(async (name, index) => {
        const info = await readControlInfo(env.RESOURCES, name)
        const controlKey = await resolveControlKey(env.RESOURCES, name, info)

        let size = ""
        if (controlKey) {
          const meta = await env.RESOURCES.get(controlKey, { onlyMetadata: true })
          if (meta) size = formatSize(meta.size)
        }

        const counter = counters.get(name)

        return {
          id: index + 1,
          name,
          size,
          downloads: counter?.downloads ?? 0,
          likes: counter?.likes ?? 0,
          collections: counter?.collections ?? 0,
          author: info?.author ?? "",
          Pageviews: counter?.Pageviews ?? 0,
        }
      })
    )

    return { list }
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Failed to load controls from R2", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}, {
  maxAge: 60 * 5,
  // 开发环境不缓存，保证每次都实时查询 R2
  shouldBypass: () => import.meta.dev,
})
