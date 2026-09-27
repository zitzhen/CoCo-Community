import sanitizeHtml from 'sanitize-html'

/* ============================================================
   HTML 消毒（全站统一出口）
   所有把「外部用户内容」渲染为 v-html 的地方必须经过这里：
   - GitHub issue 正文/评论（任何 GitHub 用户可写）
   - 控件 README（任何登录作者可上传到 R2）
   - 文章正文（防御性消毒）
   允许常规 Markdown 产出标签，剥离 script/iframe/事件属性/
   javascript: 等危险协议。纯 JS 实现，SSR 与 Workers 均可运行。
   ============================================================ */

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  'img',
  'del',
  'input', // GFM 任务列表复选框
]

const allowedAttributes = {
  a: ['href', 'name', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height', 'align', 'loading', 'decoding'],
  input: ['type', 'checked', 'disabled'],
  code: ['class'],
  span: ['class'],
  div: ['class'],
  '*': ['class'],
}

const allowedSchemes = ['http', 'https', 'mailto']

export function sanitizeHtmlOutput(html) {
  if (!html) return ''
  return sanitizeHtml(String(html), {
    allowedTags,
    allowedAttributes,
    allowedSchemes,
    allowProtocolRelative: false,
    // 链接统一补安全属性（issues 渲染用的裸 marked 不会加）
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      }),
    },
  })
}
