/* ============================================================
 * 分类前端推断（纯函数，可 SSR）
 * 后端暂无分类字段：按资源名/作者关键词命中首个规则，
 * 未命中归「其他」。规则集中维护，未来后端补字段可直接替换。
 * ============================================================ */

export type CategoryValue =
  | 'ui'
  | 'dev'
  | 'util'
  | 'snippet'
  | 'web'
  | 'ai'
  | 'other'

export type Category = {
  value: CategoryValue
  label: string
  keywords: string[]
}

export type CategoryFilter = {
  value: CategoryValue | 'all'
  label: string
  count: number
}

export const CATEGORIES: Category[] = [
  {
    value: 'ui',
    label: 'UI 控件',
    keywords: [
      'ui',
      '文本',
      '按钮',
      '控件',
      '菜单',
      '弹窗',
      '卡片',
      '滑块',
      '输入',
      '列表',
      '标签',
      '进度',
      '轮播',
      '导航',
      '图标',
      '对话框',
      '滚动',
      '选择',
      '表单',
      '提示',
      '面板',
      '工具栏',
    ],
  },
  {
    value: 'dev',
    label: '开发工具',
    keywords: [
      '工具',
      'tool',
      '导入',
      'import',
      '编译',
      '构建',
      'build',
      '调试',
      'debug',
      '生成',
      '转换',
      '加密',
      '解密',
      'api',
      '请求',
      '插件',
      'plugin',
      'cli',
    ],
  },
  {
    value: 'util',
    label: '实用工具',
    keywords: [
      '实用',
      '计算',
      '查询',
      '时间',
      '随机',
      'qrcode',
      '二维码',
      '截图',
      '下载',
      '上传',
      '计时',
      '存储',
      '天气',
    ],
  },
  {
    value: 'snippet',
    label: '代码片段',
    keywords: ['片段', 'snippet', 'demo', '模板', 'template', '示例', 'example'],
  },
  {
    value: 'web',
    label: 'Web',
    keywords: ['web', 'http', 'html', 'css', 'vue', 'react', '网页', '浏览器', '网站'],
  },
  {
    value: 'ai',
    label: 'AI',
    keywords: ['ai', '智能', 'gpt', 'chatgpt', '模型', '机器', '学习', '神经网络'],
  },
]

export const OTHER_CATEGORY: Category = {
  value: 'other',
  label: '其他',
  keywords: [],
}

type Categorizable = {
  name?: string
  author?: string
}

/** 推断单个资源分类；未命中任何规则归 other */
export function categorize(control: Categorizable): CategoryValue {
  const haystack = `${control.name ?? ''} ${control.author ?? ''}`.toLowerCase()

  for (const category of CATEGORIES) {
    if (category.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return category.value
    }
  }
  return 'other'
}

export function categoryLabel(value: CategoryValue): string {
  return (
    CATEGORIES.find((category) => category.value === value)?.label ??
    OTHER_CATEGORY.label
  )
}

/**
 * 由资源列表构建过滤分类：
 * 「全部」置顶，其余仅包含数量 > 0 的分类（按规则顺序），other 置底。
 */
export function buildCategories(list: Categorizable[]): CategoryFilter[] {
  const counts = new Map<CategoryValue, number>()

  for (const item of list) {
    const value = categorize(item)
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  const filters: CategoryFilter[] = [
    { value: 'all', label: '全部', count: list.length },
  ]

  for (const category of CATEGORIES) {
    const count = counts.get(category.value)
    if (count) filters.push({ value: category.value, label: category.label, count })
  }

  const otherCount = counts.get('other')
  if (otherCount) {
    filters.push({ value: 'other', label: OTHER_CATEGORY.label, count: otherCount })
  }

  return filters
}
