// workerd 原生 TCP socket 模块类型声明（Cloudflare Workers 运行时内置，构建时标记为 external）
declare module 'cloudflare:sockets' {
  export interface Socket {
    readonly readable: ReadableStream<Uint8Array>
    readonly writable: WritableStream<Uint8Array>
    readonly closed: Promise<void>
    close(): Promise<void>
    startTls(): Socket
  }
  export function connect(
    address: { hostname: string; port: number },
    options?: { secureTransport?: 'on' | 'off' | 'starttls' },
  ): Socket
}
