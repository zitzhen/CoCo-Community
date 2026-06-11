interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement
  first: <T = unknown>() => Promise<T | null>
  all: <T = unknown>() => Promise<{ results: T[], success: boolean, meta: Record<string, unknown> }>
  run: () => Promise<{ success: boolean, meta: { changes: number } }>
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement
}

interface Env {
  DB: D1Database
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  COCO_COMMUNITY_JWT: string
  COCO_COMMUNITY_JWT_P: string
}

type PagesFunction<T = Env> = (context: {
  request: Request
  env: T
  params?: Record<string, string>
  data?: Record<string, unknown>
}) => Response | Promise<Response>
