import type { H3Event } from 'h3'

type PagesHandler = (context: {
  request: Request
  env: Record<string, unknown>
  params: Record<string, string>
  data: Record<string, unknown>
}) => Response | Promise<Response>

export function runPagesFunction(event: H3Event, handler: PagesHandler) {
  const cloudflare = event.context.cloudflare as { env?: Record<string, unknown> } | undefined

  return handler({
    request: event.req,
    env: cloudflare?.env ?? {},
    params: {},
    data: {},
  })
}
