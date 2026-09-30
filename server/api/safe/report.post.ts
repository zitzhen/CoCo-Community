import { getCloudflareContext } from '~/server/utils/cloudflare'
import { assertAllowedOrigin } from '~/server/utils/github'
import { sendMail } from '~/server/utils/mailer'

const SEVERITIES = new Set(['critical', 'high', 'medium', 'low'])
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 小时
const RATE_LIMIT_MAX = 5 // 同一 IP 每小时最多 5 次

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function getClientIp(request: Request): string {
  const cf = request.headers.get('CF-Connecting-IP')
  if (cf) return cf
  const xf = request.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0].trim()
  return 'unknown'
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default defineEventHandler(async (event) => {
  const { request, env } = getCloudflareContext(event)

  // 1. Origin 白名单
  const forbidden = assertAllowedOrigin(request)
  if (forbidden) return forbidden

  if (request.method !== 'POST') {
    return jsonRes({ error: 'method_not_allowed' }, 405)
  }

  // 2. 解析请求体
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return jsonRes({ error: 'invalid_json' }, 400)
  }

  const reporterName = typeof body.reporterName === 'string' ? body.reporterName.trim() : ''
  const reporterEmail = typeof body.reporterEmail === 'string' ? body.reporterEmail.trim() : ''
  const affectedComponent = typeof body.affectedComponent === 'string' ? body.affectedComponent.trim() : ''
  const severity = typeof body.severity === 'string' ? body.severity.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const reproduceSteps = typeof body.reproduceSteps === 'string' ? body.reproduceSteps.trim() : ''
  const additionalInfo = typeof body.additionalInfo === 'string' ? body.additionalInfo.trim() : ''

  if (!reporterName || !reporterEmail || !affectedComponent || !severity || !description || !reproduceSteps) {
    return jsonRes({ error: 'missing_field' }, 400)
  }

  if (!validateEmail(reporterEmail) || reporterEmail.length > 254) {
    return jsonRes({ error: 'invalid_email' }, 400)
  }

  if (!SEVERITIES.has(severity)) {
    return jsonRes({ error: 'invalid_severity' }, 400)
  }

  if (reporterName.length > 64) {
    return jsonRes({ error: 'field_too_long', detail: 'reporterName 不能超过 64 个字符' }, 400)
  }
  if (affectedComponent.length > 128) {
    return jsonRes({ error: 'field_too_long', detail: 'affectedComponent 不能超过 128 个字符' }, 400)
  }
  if (description.length > 10000) {
    return jsonRes({ error: 'field_too_long', detail: 'description 不能超过 10000 个字符' }, 400)
  }
  if (reproduceSteps.length > 10000) {
    return jsonRes({ error: 'field_too_long', detail: 'reproduceSteps 不能超过 10000 个字符' }, 400)
  }
  if (additionalInfo.length > 5000) {
    return jsonRes({ error: 'field_too_long', detail: 'additionalInfo 不能超过 5000 个字符' }, 400)
  }

  // 3. IP 限流
  const clientIp = getClientIp(request)
  try {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
    const recentRow = await env.DB.prepare(
      'SELECT COUNT(*) as cnt FROM safe_report WHERE ip = ?1 AND created_at > ?2',
    )
      .bind(clientIp, since)
      .first<{ cnt: number }>()
    if (recentRow && recentRow.cnt >= RATE_LIMIT_MAX) {
      return jsonRes({ error: 'too_frequent', detail: '每小时最多提交 5 次，请稍后再试' }, 429)
    }
  } catch (dbErr: any) {
    console.error('[safe/report] rate-limit check failed:', dbErr?.message)
    // 限流查失败不阻断，继续提交（安全侧降级：宁可放行也比阻断服务强）
  }

  // 4. 写入 D1
  const createdAt = new Date().toISOString()
  const userAgent = request.headers.get('User-Agent') || ''
  let reportId: number
  try {
    const result = await env.DB.prepare(
      'INSERT INTO safe_report (reporter_name, reporter_email, affected_component, severity, description, reproduce_steps, additional_info, ip, user_agent, status, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)',
    )
      .bind(
        reporterName,
        reporterEmail,
        affectedComponent,
        severity,
        description,
        reproduceSteps,
        additionalInfo,
        clientIp,
        userAgent,
        'open',
        createdAt,
      )
      .run()
    reportId = result.meta.changes > 0 ? result.meta.last_row_id || 0 : 0
    if (!reportId) {
      return jsonRes({ error: 'db_error', detail: 'D1 写入未返回有效 ID' }, 500)
    }
  } catch (dbErr: any) {
    console.error('[safe/report] D1 insert failed:', dbErr?.message)
    return jsonRes({ error: 'db_error', detail: dbErr?.message || '数据库写入失败' }, 500)
  }

  // 5. 发邮件（best-effort，失败不阻断响应）
  const emailSent = { admin: false, reporter: false }
  const severityLabel: Record<string, string> = {
    critical: '严重',
    high: '高危',
    medium: '中危',
    low: '低危',
  }

  // 管理员通知
  if (env.SECURITY_NOTIFY_EMAIL) {
    const adminText = `收到新的安全漏洞报告：

报告编号：#${reportId}
报告者：${reporterName}
联系邮箱：${reporterEmail}
受影响组件：${affectedComponent}
严重程度：${severityLabel[severity] || severity}

【漏洞描述】
${description}

【重现步骤】
${reproduceSteps}

【附加信息】
${additionalInfo || '（无）'}

提交 IP：${clientIp}
提交时间：${createdAt}
`
    try {
      await sendMail(env, {
        to: env.SECURITY_NOTIFY_EMAIL,
        subject: `[安全报告][${severityLabel[severity] || severity}] ${affectedComponent}`,
        text: adminText,
        replyTo: reporterEmail,
      })
      emailSent.admin = true
    } catch (err: any) {
      console.error('[safe/report] admin email failed:', err?.message)
    }
  }

  // 报告者确认
  try {
    const reporterText = `您好 ${reporterName}，

我们已收到您的安全漏洞报告（#${reportId}），感谢您对 CoCo-Community 安全的关注！

【报告摘要】
受影响组件：${affectedComponent}
严重程度：${severityLabel[severity] || severity}

我们的安全团队会尽快审查您的报告，并在确认后与您取得联系。请妥善保管报告编号以便后续查询。

⚠️ 重要提示：在漏洞修复并公开披露前，请勿在任何公开场合讨论该安全问题，以防被恶意利用。

此致
CoCo-Community 安全团队
`
    await sendMail(env, {
      to: reporterEmail,
      subject: `我们已收到您的安全报告（#${reportId}）`,
      text: reporterText,
      replyTo: env.SECURITY_NOTIFY_EMAIL,
    })
    emailSent.reporter = true
  } catch (err: any) {
    console.error('[safe/report] reporter email failed:', err?.message)
  }

  return jsonRes({ ok: true, id: reportId, email_sent: emailSent }, 200)
})
