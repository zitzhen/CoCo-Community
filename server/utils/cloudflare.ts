import type { H3Event } from 'h3'

export type CloudflareEnv = {
  DB: D1Database
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  COCO_COMMUNITY_JWT?: string
  COCO_COMMUNITY_JWT_P?: string
}

export function getCloudflareContext(event: H3Event) {
  const cloudflare = event.context.cloudflare as { env?: CloudflareEnv } | undefined

  return {
    request: event.request,
    env: cloudflare?.env || ({} as CloudflareEnv),
  }
}
