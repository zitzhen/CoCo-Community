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

  return {
    name,
    author: info.author,
    currentVersion: info.currentVersion,
    versions: info.versions,
    controlKey,
  }
})
