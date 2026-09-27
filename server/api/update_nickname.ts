import { getCloudflareContext } from "~/server/utils/cloudflare"
import { assertAllowedOrigin } from "~/server/utils/github"
// @ts-nocheck
import { jwtVerify } from 'jose'

// 更新当前登录用户的昵称
// - 双 Cookie 鉴权（与 /api/me 相同）：用户名一律取自登录态，忽略请求体中的 username，
//   防止越权修改他人昵称
// - 线上表名为 user（历史代码误写为 users）；该表无 updated_at 列
// - user 表中尚无记录的新用户执行 UPSERT 语义（先查后写，不依赖唯一约束）
const NICKNAME_MIN = 1
const NICKNAME_MAX = 32

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

  // ---------- 2. 校验昵称 ----------
  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  const nickname = typeof body?.nickname === "string" ? body.nickname.trim() : ""
  if (nickname.length < NICKNAME_MIN || nickname.length > NICKNAME_MAX) {
    return new Response(
      JSON.stringify({
        error: "invalid_nickname",
        detail: `nickname 长度需为 ${NICKNAME_MIN}-${NICKNAME_MAX} 个字符`,
      }),
      { status: 400, headers: jsonHeaders }
    )
  }

  // ---------- 3. 写入 user 表（存在则更新，不存在则插入） ----------
  try {
    const existing = await env.DB.prepare(
      "SELECT username FROM user WHERE username = ?1"
    )
      .bind(username)
      .first()

    if (existing) {
      await env.DB.prepare("UPDATE user SET nickname = ?1 WHERE username = ?2")
        .bind(nickname, username)
        .run()
    } else {
      await env.DB.prepare(
        "INSERT INTO user (username, nickname, number_of_controls, avatar, bio, pageviews) VALUES (?1, ?2, 0, ?3, '', 0)"
      )
        .bind(username, nickname, githubUser.avatar_url || "/images/user.png")
        .run()
    }

    return new Response(
      JSON.stringify({ success: true, data: { username, nickname } }),
      { status: 200, headers: jsonHeaders }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "database_error", message: err.message }),
      { status: 500, headers: jsonHeaders }
    )
  }
})
