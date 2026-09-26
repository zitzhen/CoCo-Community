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

// 最小化的 R2 类型声明（未安装 @cloudflare/workers-types）
export interface R2Object {
  key: string
  size: number
  httpMetadata?: { contentType?: string }
  body?: ReadableStream
  text?(): Promise<string>
}

export interface R2Objects {
  objects: R2Object[]
  delimitedPrefixes: string[]
  truncated: boolean
  cursor?: string
}

export interface R2Bucket {
  get(key: string, options?: { onlyMetadata?: boolean }): Promise<R2Object | null>
  list(options?: {
    prefix?: string
    delimiter?: string
    cursor?: string
    limit?: number
  }): Promise<R2Objects>
}

export type CloudflareEnv = {
  DB: D1Database
  RESOURCES: R2Bucket
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  COCO_COMMUNITY_JWT?: string
  COCO_COMMUNITY_JWT_P?: string
}

export function getCloudflareContext(event: H3Event) {
  // 入站请求经 nitro onRequest 钩子挂载 context.cloudflare；
  // SSR 内部 $fetch 的事件不经过该挂载，回退到插件暂存的全局 env
  const ctx = (event.context.cloudflare
    || (event.context as { _platform?: { cloudflare?: { env?: CloudflareEnv } } })._platform?.cloudflare) as
    | { env?: CloudflareEnv }
    | undefined
  const env = ctx?.env || (globalThis as { __cocoCFEnv__?: CloudflareEnv }).__cocoCFEnv__

  return {
    request: toWebRequest(event),
    env: env || ({} as CloudflareEnv),
  }
}
