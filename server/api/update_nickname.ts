import { getCloudflareContext } from "~/server/utils/cloudflare"
import { upsertUser, findUserByUsername, isUploadedAvatar, normalizeAvatarInput } from "~/server/utils/user"
import { assertAllowedOrigin } from "~/server/utils/github"
// @ts-nocheck
import { jwtVerify } from 'jose'

// 更新当前登录用户的昵称 / 头像
// - 双 Cookie 鉴权（与 /api/me 相同）：用户名一律取自登录态，忽略请求体中的 username，
//   防止越权修改他人资料
// - 线上表名为 user（历史代码误写为 users）；该表无 updated_at 列
// - user 表中尚无记录的新用户执行 UPSERT 语义（先查后写，不依赖唯一约束）
// - 头像：GitHub 头像直接存 https URL；手动上传头像由 /api/avatar/upload 处理，
//   D1 中存 avatar/<文件名>。从上传头像切换为 URL 时尽力删除旧 R2 文件
const NICKNAME_MIN = 1
const NICKNAME_MAX = 32
const AVATAR_URL_MAX = 512

export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event)

  const jsonHeaders = { "Content-Type": "application/json" }
  const forbidden = assertAllowedOrigin(request)
  if (forbidden) return forbidden

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: jsonHeaders,
    })
  }

  // ---------- 1. 双 Cookie 鉴权 ----------
  const cookieHeader = request.headers.get("Cookie") || ""
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null
  const jwtToken = cookieHeader
    .split(";")
    .find((row) => row.trim().startsWith("maximum_lifespan="))
    ?.split("=")[1] || null

  if (!token || token.length < 10 || !jwtToken) {
    return new Response(JSON.stringify({ error: "unauthenticated" }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  const secretKey = env.COCO_COMMUNITY_JWT
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "server_configuration_error" }), {
      status: 500,
      headers: jsonHeaders,
    })
  }

  let decoded
  try {
    const secret = new TextEncoder().encode(secretKey)
    decoded = (await jwtVerify(jwtToken, secret)).payload
  } catch {
    return new Response(JSON.stringify({ error: "invalid_session" }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  const githubRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "Cloudflare-Worker-OAuth",
    },
  })
  if (!githubRes.ok) {
    return new Response(JSON.stringify({ error: "invalid_github_token" }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  const githubUser = await githubRes.json()
  if (decoded.username !== githubUser.login) {
    return new Response(JSON.stringify({ error: "username_mismatch" }), {
      status: 401,
      headers: jsonHeaders,
    })
  }
  const username = githubUser.login

  // ---------- 2. 校验请求体 ----------
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  const hasNickname = typeof body?.nickname === "string"
  const hasAvatar = typeof body?.avatar === "string"
  if (!hasNickname && !hasAvatar) {
    return new Response(
      JSON.stringify({ error: "invalid_body", detail: "nickname 与 avatar 至少提供一项" }),
      { status: 400, headers: jsonHeaders }
    )
  }

  const nickname = hasNickname ? body.nickname.trim() : ""
  if (hasNickname && (nickname.length < NICKNAME_MIN || nickname.length > NICKNAME_MAX)) {
    return new Response(
      JSON.stringify({
        error: "invalid_nickname",
        detail: `nickname 长度需为 ${NICKNAME_MIN}-${NICKNAME_MAX} 个字符`,
      }),
      { status: 400, headers: jsonHeaders }
    )
  }

  // 允许：https URL（GitHub 头像等外链）或 avatar/<文件名>（上传头像，正常由上传接口写入）
  const avatar = hasAvatar ? normalizeAvatarInput(body.avatar) : ""
  if (hasAvatar) {
    const validHttps = /^https:\/\//i.test(avatar)
    const validAvatarKey = /^avatar\/[A-Za-z0-9._-]+$/i.test(avatar)
    if (!avatar || avatar.length > AVATAR_URL_MAX || (!validHttps && !validAvatarKey)) {
      return new Response(
        JSON.stringify({
          error: "invalid_avatar",
          detail: "头像需为 https 图片 URL，或通过上传接口上传",
        }),
        { status: 400, headers: jsonHeaders }
      )
    }
  }

  // ---------- 3. 写入 user 表（原子 UPSERT：仅更新请求中携带的字段） ----------
  try {
    // 读取现有资料：INSERT 兜底需要昵称/bio；切换头像时需要判断旧文件是否要清理
    const existing = await findUserByUsername(env, username)

    const conflictFields = []
    if (hasNickname) conflictFields.push("nickname")
    if (hasAvatar) conflictFields.push("avatar")

    await upsertUser(
      env,
      username,
      {
        nickname: hasNickname ? nickname : existing?.nickname || username,
        // 未携带头像时给 GitHub 头像作插入默认值；冲突更新字段不含 avatar，不会覆盖旧值
        avatar: hasAvatar ? avatar : githubUser.avatar_url || "",
        bio: existing?.bio || "",
      },
      conflictFields
    )

    // 从手动上传头像切换为其他头像：删除旧 R2 文件（尽力而为，失败不影响结果）
    if (hasAvatar && existing?.avatar && isUploadedAvatar(existing.avatar)) {
      const oldKey = existing.avatar.trim()
      if (oldKey !== avatar) {
        try {
          await env.RESOURCES.delete([oldKey])
        } catch {
          /* 忽略旧文件清理失败 */
        }
      }
    }

    // 清除用户列表缓存，使昵称/头像变更尽快对外可见
    try {
      const cache = useStorage("cache")
      const keys = await cache.getKeys()
      await Promise.all(
        keys.filter((k) => k.includes("user-list")).map((k) => cache.removeItem(k))
      )
    } catch { /* 忽略缓存清理失败 */ }

    const result = { username }
    if (hasNickname) result.nickname = nickname
    if (hasAvatar) result.avatar = avatar

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: jsonHeaders }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "database_error", message: err.message }),
      { status: 500, headers: jsonHeaders }
    )
  }
})
