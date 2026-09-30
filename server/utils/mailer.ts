import type { CloudflareEnv } from './cloudflare'

// workerd 原生 TCP socket 模块（Cloudflare Workers 运行时内置，构建时标记为 external）
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

import { connect, type Socket } from 'cloudflare:sockets'

// 手写 SMTP 客户端：workerd 无 node:net，nodemailer 不可用，必须用 cloudflare:sockets。
// 支持 465 直连 TLS 与 587/25 STARTTLS；仅实现 AUTH LOGIN 认证。

const DEFAULT_TIMEOUT_MS = 15000

type Reply = { code: number; lines: string[] }

function b64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

// RFC 2047 encoded-word（中文标题/发件名必需）
function encodeWord(input: string): string {
  return /[^\x20-\x7E]/.test(input) ? `=?UTF-8?B?${b64(input)}?=` : input
}

function base64Body(text: string): string {
  const raw = b64(text)
  // MIME 规定 base64 正文每行 76 字符；base64 字母表不含 '.'，天然规避 dot-stuffing
  return raw.replace(/.{1,76}/g, (line) => line + '\r\n')
}

function smtpDate(): string {
  // RFC 2822 日期（UTC，格式 "Thu, 01 Oct 2026 10:00:00 +0000"）
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${days[d.getUTCDay()]}, ${p(d.getUTCDate())} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} +0000`
}

class SmtpSession {
  private socket: Socket
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private buf = ''
  private encoder = new TextEncoder()
  private decoder = new TextDecoder()

  constructor(socket: Socket) {
    this.socket = socket
    this.reader = socket.readable.getReader()
    this.writer = socket.writable.getWriter()
  }

  async upgradeTls() {
    // startTls() 返回升级后的新 socket，需重建读写流
    await this.writer.close().catch(() => {})
    this.socket = this.socket.startTls()
    this.reader = this.socket.readable.getReader()
    this.writer = this.socket.writable.getWriter()
    this.buf = ''
  }

  async send(line: string) {
    await this.writer.write(this.encoder.encode(line + '\r\n'))
  }

  async sendRaw(data: string) {
    await this.writer.write(this.encoder.encode(data))
  }

  async readReply(): Promise<Reply> {
    // SMTP 多行回复："250-..." 续行，"250 ..." 结束
    const lines: string[] = []
    let code = 0
    for (;;) {
      const line = await this.readLine()
      const m = line.match(/^(\d{3})([ -])(.*)$/)
      if (!m) throw new Error(`smtp_protocol: bad reply line: ${line}`)
      code = parseInt(m[1], 10)
      lines.push(m[3])
      if (m[2] === ' ') return { code, lines }
    }
  }

  private async readLine(): Promise<string> {
    for (;;) {
      const idx = this.buf.indexOf('\r\n')
      if (idx >= 0) {
        const line = this.buf.slice(0, idx)
        this.buf = this.buf.slice(idx + 2)
        return line
      }
      const { value, done } = await this.reader.read()
      if (done) throw new Error('smtp_protocol: connection closed while reading')
      this.buf += this.decoder.decode(value, { stream: true })
    }
  }

  async expect(expected: number[], stage: string): Promise<Reply> {
    const reply = await this.readReply()
    if (!expected.includes(reply.code)) {
      throw new Error(`smtp_${stage}: ${reply.code} ${reply.lines.join(' ')}`)
    }
    return reply
  }

  async command(line: string, expected: number[], stage: string): Promise<Reply> {
    await this.send(line)
    return this.expect(expected, stage)
  }

  async close() {
    try { this.reader.releaseLock() } catch { /* ignore */ }
    try { this.writer.releaseLock() } catch { /* ignore */ }
    await this.socket.close().catch(() => {})
  }
}

export async function sendMail(
  env: CloudflareEnv,
  opts: { to: string | string[]; subject: string; text: string; replyTo?: string },
): Promise<void> {
  const host = env.SMTP_HOST?.trim()
  const port = parseInt(env.SMTP_PORT || '', 10)
  const username = env.SMTP_USERNAME?.trim()
  const password = env.SMTP_PASSWORD
  const from = env.SMTP_FROM?.trim()
  if (!host || !port || !username || !password || !from) {
    throw new Error('smtp_not_configured')
  }

  const recipients = Array.isArray(opts.to) ? opts.to : [opts.to]
  if (recipients.length === 0) throw new Error('smtp_no_recipients')

  // 465 直连 TLS；其他端口（587/25）明文连接后 STARTTLS 升级
  const directTls = port === 465
  const ehloName = from.split('@')[1] || host

  const socket = connect({ hostname: host, port }, { secureTransport: directTls ? 'on' : 'off' })
  const session = new SmtpSession(socket)

  // 整体超时保护：防止 socket 挂起导致 Worker 子请求被拖死
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('smtp_timeout')), DEFAULT_TIMEOUT_MS)
  })

  const run = (async () => {
    await session.expect([220], 'greeting')
    await session.command(`EHLO ${ehloName}`, [250], 'ehlo')

    if (!directTls) {
      await session.command('STARTTLS', [220], 'starttls')
      await session.upgradeTls()
      await session.command(`EHLO ${ehloName}`, [250], 'ehlo_tls')
    }

    await session.command('AUTH LOGIN', [334], 'auth')
    await session.command(b64(username), [334], 'auth_user')
    await session.command(b64(password), [235], 'auth_pass')

    await session.command(`MAIL FROM:<${from}>`, [250], 'mail_from')
    for (const rcpt of recipients) {
      await session.command(`RCPT TO:<${rcpt}>`, [250, 251], 'rcpt_to')
    }
    await session.command('DATA', [354], 'data')

    const fromName = env.SMTP_FROM_NAME?.trim()
    const headers = [
      `From: ${fromName ? `${encodeWord(fromName)} <${from}>` : from}`,
      `To: ${recipients.join(', ')}`,
      `Subject: ${encodeWord(opts.subject)}`,
      ...(opts.replyTo ? [`Reply-To: ${opts.replyTo}`] : []),
      `Date: ${smtpDate()}`,
      `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@${ehloName}>`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: base64',
    ]
    await session.sendRaw(headers.join('\r\n') + '\r\n\r\n' + base64Body(opts.text) + '\r\n.\r\n')
    await session.expect([250], 'data_end')

    await session.command('QUIT', [221], 'quit').catch(() => {})
  })()

  try {
    await Promise.race([run, timeout])
  } finally {
    if (timer) clearTimeout(timer)
    await session.close()
  }
}
