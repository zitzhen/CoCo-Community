import { getCloudflareContext } from "~/server/utils/cloudflare"
import { requireGithubUser } from "~/server/utils/auth"
import { assertAllowedOrigin } from "~/server/utils/github"
import { findUserByUsername, upsertUser, isUploadedAvatar } from "~/server/utils/user"
import { CONTENT_TYPES, mimeOf } from "~/server/utils/mime"

// 手动上传头像：仅登录用户可用
// - 文件存入 R2 的 avatar/ 文件夹；D1 user.avatar 写相对 key（avatar/<文件名>）
// - 仅手动上传走 R2；使用 GitHub 头像时 D1 直接存 GitHub URL（见 /api/update_nickname）
// - 替换头像后尽力删除旧的手动上传文件，避免孤儿对象堆积
const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2 MiB
const ALLOWED_EXTS: Record<string, string> = {
  ".png": CONTENT_TYPES[".png"],
  ".jpg": CONTENT_TYPES[".jpg"],
  ".jpeg": CONTENT_TYPES[".jpeg"],
  ".gif": CONTENT_TYPES[".gif"],
  ".webp": CONTENT_TYPES[".webp"],
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

// 清除 /api/user-list 的 nitro 缓存，使新头像尽快对外可见
async function bustUserCache() {
  try {
    const cache = useStorage("cache")
    const keys = await cache.getKeys()
    await Promise.all(
      keys.filter((k) => k.includes("user-list")).map((k) => cache.removeItem(k))
    )
  } catch {
    /* 缓存清理失败不影响上传结果 */
  }
}

export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event)

  if (!env.DB || !env.RESOURCES) {
    return jsonRes({ error: "server_configuration_error", detail: "missing env: DB/RESOURCES bindings" }, 500)
  }

  const originError = assertAllowedOrigin(request)
  if (originError) return originError

  const auth = await requireGithubUser(event)
  if (auth instanceof Response) return auth
  const login = auth.login

  // ---------- 解析 multipart 表单 ----------
  let parts
  try {
    parts = await readMultipartFormData(event)
  } catch {
    return jsonRes({ error: "invalid_form" }, 400)
  }
  if (!parts || parts.length === 0) {
    return jsonRes({ error: "invalid_form" }, 400)
  }

  const filePart = parts.find((p) => p.name === "file")
  if (!filePart || !filePart.data || filePart.data.length === 0) {
    return jsonRes({ error: "missing_file" }, 400)
  }

  // 扩展名白名单（以原始文件名为准，防伪造 Content-Type）
  const filename = filePart.filename || ""
  const extMatch = filename.toLowerCase().match(/\.(png|jpe?g|gif|webp)$/)
  if (!extMatch) {
    return jsonRes({ error: "invalid_file_type", detail: "仅支持 PNG / JPG / GIF / WebP 图片" }, 400)
  }
  const ext = `.${extMatch[1]}`
  if (!ALLOWED_EXTS[ext]) {
    return jsonRes({ error: "invalid_file_type", detail: "仅支持 PNG / JPG / GIF / WebP 图片" }, 400)
  }

  if (filePart.data.length > MAX_AVATAR_SIZE) {
    return jsonRes({ error: "file_too_large", detail: "头像不能超过 2 MiB" }, 413)
  }

  // GitHub 登录名仅含字母数字与连字符；防御性过滤后用于文件名
  const safeLogin = login.toLowerCase().replace(/[^a-z0-9-]/g, "")
  const rand = Math.random().toString(36).slice(2, 8)
  const key = `avatar/${safeLogin}-${Date.now()}-${rand}${ext}`

  // ---------- 先查旧头像（仅手动上传文件需要后续清理） ----------
  const oldUser = await findUserByUsername(env, login)
  const oldAvatarKey = oldUser?.avatar && isUploadedAvatar(oldUser.avatar) ? oldUser.avatar.trim() : null

  // ---------- 先写 R2，再写 D1 ----------
  // D1 失败时删除刚上传的 R2 对象，整体等于未提交（重试幂等：新文件名带随机后缀）
  try {
    await env.RESOURCES.put(key, filePart.data, {
      httpMetadata: { contentType: ALLOWED_EXTS[ext] || mimeOf(key) },
    })
  } catch (err: any) {
    return jsonRes({ error: "storage_error", message: err?.message }, 500)
  }

  try {
    await upsertUser(
      env,
      login,
      { nickname: oldUser?.nickname || login, avatar: key, bio: oldUser?.bio || "" },
      ["avatar"]
    )
  } catch (err: any) {
    console.error("[avatar/upload] D1 update failed:", err?.message)
    try {
      await env.RESOURCES.delete([key])
    } catch {
      /* 忽略回滚清理失败 */
    }
    return jsonRes({ error: "database_error", detail: "头像信息保存失败，请重试" }, 500)
  }

  // D1 已指向新文件，尽力清理旧的手动上传头像（失败不影响结果）
  if (oldAvatarKey && oldAvatarKey !== key) {
    try {
      await env.RESOURCES.delete([oldAvatarKey])
    } catch {
      /* 忽略旧文件清理失败 */
    }
  }

  await bustUserCache()

  return jsonRes({
    ok: true,
    avatar: key,
    url: `/resource/${key}`,
  })
})
