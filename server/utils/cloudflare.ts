import { toWebRequest, type H3Event } from 'h3'

// 最小化的 D1 类型声明（未安装 @cloudflare/workers-types）
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  run(): Promise<{ success: boolean; meta: { changes: number } }>
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement
}

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
    request: toWebRequest(event),
    env: cloudflare?.env || ({} as CloudflareEnv),
  }
}
