import { getCloudflareContext } from "~/server/utils/cloudflare"
import { readControlInfo, resolveControlKey } from "~/server/utils/control-resource"

// 控件元信息：information.json + 解析出的实际控件文件 R2 key
// （控件详情页用，容忍版本目录 / 文件名与 information.json 不一致）
export default defineEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)
  const name = (getQuery(event).name as string) || ""

  if (!name) {
    return new Response(JSON.stringify({ error: "Missing name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const info = await readControlInfo(env.RESOURCES, name)
  if (!info) {
    return new Response(JSON.stringify({ error: "Control not found", name }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const controlKey = await resolveControlKey(env.RESOURCES, name, info)

  let size
  if (controlKey) {
    const meta = await env.RESOURCES.get(controlKey, { onlyMetadata: true })
    if (meta) size = meta.size
  }

  // 计数类字段：D1 可用时按名称取单行；失败默认 0（纯增量，不影响现有字段）
  let downloads = 0
  let Pageviews = 0
  try {
    const row = await env.DB.prepare(
      "SELECT downloads, Pageviews FROM components WHERE name = ?1"
    )
      .bind(name)
      .first<{ downloads: number; Pageviews: number }>()
    if (row) {
      downloads = row.downloads ?? 0
      Pageviews = row.Pageviews ?? 0
    }
  } catch {
    // D1 不可用（如本地未建表）保持默认 0
  }

  return {
    name,
    author: info.author,
    currentVersion: info.currentVersion,
    versions: info.versions,
    controlKey,
    size,
    downloads,
    Pageviews,
  }
})
