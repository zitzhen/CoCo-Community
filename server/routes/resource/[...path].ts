import { getCloudflareContext } from "~/server/utils/cloudflare"
import { mimeOf } from "~/server/utils/mime"

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

  const contentType = obj.httpMetadata?.contentType || mimeOf(key)
  const isSvg = /\.svg$/i.test(key)

  return new Response(obj.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      // SVG 可内嵌脚本：直开时禁止脚本执行；经 <img> 引用不受影响
      ...(isSvg
        ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" }
        : {}),
    },
  })
})
