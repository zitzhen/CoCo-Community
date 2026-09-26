// 将入站请求携带的 Cloudflare 绑定（D1/R2 等 env）暂存到 globalThis，
// 供 SSR 期间内部 $fetch 创建的"无上下文事件"兜底使用：
// 内部 fetch 不会经过 worker 入口的上下文挂载，事件里拿不到 env，
// 而同一 isolate 中 SSR 必然发生在某个入站请求之后，因此全局兜底始终可用。
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    const ctx = (event.context.cloudflare
      || (event.context as { _platform?: { cloudflare?: { env?: unknown } } })._platform?.cloudflare) as
      | { env?: unknown }
      | undefined
    if (ctx?.env) {
      ;(globalThis as { __cocoCFEnv__?: unknown }).__cocoCFEnv__ = ctx.env
    }
  })
})
