import type { ControlCategory, ControlItem } from '~/types/community'
import { marked } from 'marked'

const categoryRules: Array<[ControlCategory, RegExp]> = [
  ['AI', /AI|智能|模型/i],
  ['文本工具', /文字|文本|歌词|剪切板|输入框/i],
  ['图片工具', /图片|画布|水印|渲染/i],
  ['网页工具', /HTML|网页|Web|导航|浏览器|CSS/i],
  ['娱乐工具', /音乐|播放器|彩纸|聊天|纪念/i],
  ['效率工具', /工具|快速|上传|检测|单位|优化/i]
]

export const categories: ControlCategory[] = [
  '开发工具',
  'AI',
  '效率工具',
  '文本工具',
  '图片工具',
  '网页工具',
  '娱乐工具'
]

export function getControlCategory(name: string): ControlCategory {
  return categoryRules.find(([, pattern]) => pattern.test(name))?.[0] ?? '开发工具'
}

export function getControlDescription(control: ControlItem): string {
  const category = getControlCategory(control.name)
  const descriptions: Record<ControlCategory, string> = {
    开发工具: '为 CoCo 创作流程提供更灵活的开发能力与扩展接口。',
    AI: '把智能能力带入 CoCo 作品，快速构建新一代交互体验。',
    效率工具: '减少重复操作，让控件开发和作品搭建更高效。',
    文本工具: '增强文本输入、处理与展示能力。',
    图片工具: '提供更丰富的图片、画布与视觉处理能力。',
    网页工具: '连接 Web 能力，扩展 HTML、网络与页面交互。',
    娱乐工具: '为作品加入音乐、互动与更有趣的体验。'
  }
  return descriptions[category]
}

export function controlInitial(name: string): string {
  return name.replace(/[【】\-\s]/g, '').slice(0, 1).toUpperCase() || 'C'
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', { notation: value > 9999 ? 'compact' : 'standard' }).format(value)
}

export function renderMarkdown(source: string, assetBase = ''): string {
  const html = marked.parse(source, { async: false }) as string
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/src="images\//g, `src="${assetBase}/images/`)
    .replace(/src='images\//g, `src='${assetBase}/images/`)
}
