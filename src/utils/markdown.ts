import { Marked } from 'marked'

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

export function renderMarkdown(markdown) {
  if (!markdown) return ''
  // README 内旧图片地址 https://cc.zitzhen.cn/control/... 改走同源资源路由
  const normalized = String(markdown).replaceAll(
    'https://cc.zitzhen.cn/control/',
    '/resource/'
  )
  return markedInstance.parse(normalized)
}
