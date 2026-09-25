import { getCloudflareContext } from "~/server/utils/cloudflare"

const FALLBACK_TYPES: Record<string, string> = {
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
}

// 同源资源代理：浏览器请求 /resource/<R2 对象 key>，由服务端通过 R2 绑定读取
// （避免浏览器直连 R2 域名的跨域限制）
export default defineEventHandler(async (event) => {
  const { env } = getCloudflareContext(event)

  const url = getRequestURL(event)
  const key = decodeURIComponent(url.pathname.replace(/^\/resource\//, ""))

  if (!key) {
    return new Response("Missing resource key", { status: 400 })
  }

  const obj = await env.RESOURCES.get(key)
  if (!obj) {
    return new Response(`Resource not found: ${key}`, { status: 404 })
  }

  const ext = key.slice(key.lastIndexOf(".")).toLowerCase()
  const contentType = obj.httpMetadata?.contentType || FALLBACK_TYPES[ext] || "application/octet-stream"

  return new Response(obj.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  })
})
