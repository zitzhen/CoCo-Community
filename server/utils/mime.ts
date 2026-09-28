// 统一的 MIME 类型表与仓库文件白名单
// 资源代理（/resource/）与 Git 仓库镜像同步共用，避免两处维护

export const CONTENT_TYPES: Record<string, string> = {
  // 文本 / 代码
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.markdown': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.ts': 'text/plain; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.yml': 'text/plain; charset=utf-8',
  '.yaml': 'text/plain; charset=utf-8',
  // 图片
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  // 字体
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  // 音视频
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

// 无扩展名但常见的法律/说明文件（tar 中无扩展名，R2 落盘后以 octet-stream 提供）
const ALLOWED_BARE_NAMES = new Set(['LICENSE', 'LICENCE', 'COPYING', 'NOTICE'])

function extOf(path: string): string {
  const base = path.split('/').pop() || ''
  const dot = base.lastIndexOf('.')
  return dot <= 0 ? '' : base.slice(dot).toLowerCase()
}

export function mimeOf(key: string): string {
  return CONTENT_TYPES[extOf(key)] || 'application/octet-stream'
}

// 仓库管道文件（.github/ 目录、.gitignore 等点开头顶层条目）：静默忽略，不算拒绝
export function isRepoDotfile(path: string): boolean {
  const first = path.split('/')[0] || ''
  return first.startsWith('.')
}

// 是否允许从仓库镜像到 R2。
// 拒绝 .html/.htm/.xhtml 等可在同源执行为活动页面的类型（防存储型 XSS），
// 其余以扩展名白名单为准；无扩展名仅放行 LICENSE 类文件。
export function isAllowedRepoPath(path: string): boolean {
  const base = path.split('/').pop() || ''
  if (base.includes('.')) {
    const ext = extOf(path)
    return Boolean(CONTENT_TYPES[ext])
  }
  return ALLOWED_BARE_NAMES.has(base.toUpperCase())
}
