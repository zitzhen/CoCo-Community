import { jwtVerify } from 'jose'
import type { H3Event } from 'h3'
import { getCloudflareContext } from './cloudflare'

export type GithubUser = {
  login: string
  token: string
}

export async function requireGithubUser(event: H3Event): Promise<GithubUser | Response> {
  const { request, env } = getCloudflareContext(event)

  const cookieHeader = request.headers.get('Cookie') || ''
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null
  const maximum_lifespan_token = cookieHeader
    .split(';')
    .find(row => row.trim().startsWith('maximum_lifespan='))
    ?.split('=')[1] || null

  if (!token || token.length < 10 || !maximum_lifespan_token) {
    return new Response(JSON.stringify({ error: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const secretKey = env.COCO_COMMUNITY_JWT
  if (!secretKey) {
    return new Response(JSON.stringify({ error: 'server_configuration_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let decodedToken
  try {
    const secret = new TextEncoder().encode(secretKey)
    const { payload } = await jwtVerify(maximum_lifespan_token, secret)
    decodedToken = payload
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_session' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const githubRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'User-Agent': 'Cloudflare-Worker-OAuth',
    },
  })

  if (!githubRes.ok) {
    return new Response(JSON.stringify({ error: 'invalid_github_token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const user = await githubRes.json()
  if (decodedToken.username !== user.login) {
    return new Response(JSON.stringify({ error: 'username_mismatch' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return { login: user.login, token }
}
