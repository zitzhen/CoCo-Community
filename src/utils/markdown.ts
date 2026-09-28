import { Marked } from 'marked'
import { sanitizeHtmlOutput } from '@/utils/sanitize'

/* ============================================================
   Markdown 渲染（marked v16，独立实例，不影响全局 marked）
   - 代码块：.code-block 结构（语言标签 + 复制按钮）
   - 外链：target=_blank rel=noopener
   - 图片：lazy
   ============================================================ */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const renderer = {
  code(token) {
    const lang = token.lang || ''
    const label = lang || 'text'
    return (
      `<div class="code-block">` +
      `<div class="code-block-header">` +
      `<span class="code-block-lang">${escapeHtml(label)}</span>` +
      `<button type="button" class="copy-code-btn" aria-label="复制代码">` +
      `<i class="fas fa-copy" aria-hidden="true"></i> 复制` +
      `</button>` +
      `</div>` +
      `<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>` +
      escapeHtml(token.text) +
      `</code></pre>` +
      `</div>\n`
    )
  },

  link(token) {
    const href = token.href || ''
    const titleAttr = token.title ? ` title="${escapeHtml(token.title)}"` : ''
    const inner = token.tokens
      ? this.parser.parseInline(token.tokens)
      : escapeHtml(token.text || '')
    const external = /^https?:\/\//i.test(href)
    const externalAttrs = external
      ? ' target="_blank" rel="noopener noreferrer"'
      : ''
    return `<a href="${escapeHtml(href)}"${titleAttr}${externalAttrs}>${inner}</a>`
  },

  image(token) {
    const alt = token.text || ''
    const titleAttr = token.title ? ` title="${escapeHtml(token.title)}"` : ''
    return (
      `<img src="${escapeHtml(token.href || '')}" ` +
      `alt="${escapeHtml(alt)}"${titleAttr} loading="lazy" decoding="async">`
    )
  },
}

const markedInstance = new Marked({ gfm: true, breaks: false, renderer })

// 绝对地址（含协议 / 协议相对 / data:）原样保留；相对地址按 resourceBase 解析
function resolveImageSrc(href: string, resourceBase?: string): string {
  if (!resourceBase) return href
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) return href
  try {
    return new URL(href, `https://local${resourceBase}`).pathname
  } catch {
    return href
  }
}

export function renderMarkdown(markdown, resourceBase?: string) {
  if (!markdown) return ''
  // README 内旧图片地址 https://cc.zitzhen.cn/control/... 改走同源资源路由
  const normalized = String(markdown).replaceAll(
    'https://cc.zitzhen.cn/control/',
    '/resource/'
  )
  const html = String(markedInstance.parse(normalized))
  if (!resourceBase) return sanitizeHtmlOutput(html)
  // 把相对图片地址重写到同源资源路由（在消毒前做，路径均为站内相对路径）
  const rewritten = html.replace(
    /(<img\b[^>]*\bsrc=")([^"]*)(")/gi,
    (_, pre, src, post) => `${pre}${resolveImageSrc(src, resourceBase)}${post}`,
  )
  return sanitizeHtmlOutput(rewritten)
}
