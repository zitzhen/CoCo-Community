/*
 * 控件许可证识别（前端纯函数，无 Nuxt / Node 依赖，SSR 与客户端通用）
 *
 * 数据来源：控件仓库经 GitHub 全量镜像同步到 R2 的 LICENSE 类文件
 * （白名单见 server/utils/mime.ts），页面通过同源 /resource/<控件名>/<文件名>
 * 读取文本后，由 identifyLicenseText() 做特征短语匹配。
 *
 * 识别顺序敏感：LGPL / AGPL 全文中包含 GPL 字样，必须先于 GPL 判断。
 */

export type LicenseCategory =
  | 'public-domain' // 公有领域 / 权利放弃（CC0、Unlicense）
  | 'permissive' // 宽松许可（MIT、BSD、Apache、ISC、Zlib）
  | 'weak-copyleft' // 弱 Copyleft（LGPL、MPL）
  | 'copyleft' // 强 Copyleft（GPL、AGPL）
  | 'other' // 存在许可证文件但未识别出具体类型
  | 'none' // 未找到许可证文件

export type LicenseInfo = {
  id: string // SPDX 标识；OTHER / NONE 为自定义占位
  name: string // 展示名称
  category: LicenseCategory
  url?: string // SPDX 许可证详情页
  tip: string // 给用户的中文使用提示
}

const SPDX_BASE = 'https://spdx.org/licenses/'

type LicenseDef = {
  id: string
  name: string
  category: Exclude<LicenseCategory, 'other' | 'none'>
  match: (normalizedText: string) => boolean
  tip?: string
}

// 版本号短语，如 “Version 3, 29 June 2007” / “version 2.1” / 简写 “GPL-3.0”
const RE_V3 = /version\s*3(?!\.\d)\b/
const RE_V2 = /version\s*2(?!\.\d)\b/
const RE_V2_1 = /version\s*2[.,]1\b/
const RE_APACHE_V2 = /version\s*2[.,]0\b/

// SPDX 简写，如 “SPDX-License-Identifier: GPL-3.0” / “gpl v2”
// 负向先行断言避免 2.0 简写误匹配 2.1；\b 保证 lgpl/agpl 中的 “gpl” 不命中
const RE_SHORT_GPL3 = /\bgpl[- ]?v?3(?:\.0)?(?!\.\d)\b/
const RE_SHORT_GPL2 = /\bgpl[- ]?v?2(?:\.0)?(?!\.\d)\b/
const RE_SHORT_LGPL3 = /\blgpl[- ]?v?3(?:\.0)?(?!\.\d)\b/
const RE_SHORT_LGPL2 = /\blgpl[- ]?v?2(?:\.0)?(?!\.\d)\b/
const RE_SHORT_LGPL21 = /\blgpl[- ]?v?2[.,]1\b/
const RE_SHORT_AGPL3 = /\bagpl[- ]?v?3(?:\.0)?(?!\.\d)\b/

const LICENSE_DEFS: LicenseDef[] = [
  // --- Copyleft 家族（顺序敏感：AGPL → LGPL → GPL） ---
  {
    id: 'AGPL-3.0',
    name: 'GNU AGPL-3.0',
    category: 'copyleft',
    match: (t) =>
      RE_SHORT_AGPL3.test(t) ||
      (t.includes('gnu affero general public license') && RE_V3.test(t)),
    tip: '强 Copyleft 许可证：分发衍生作品时（包括通过网络向用户提供服务），须以 AGPL-3.0 公开完整源代码。闭源商用前请仔细评估。',
  },
  {
    id: 'LGPL-3.0',
    name: 'GNU LGPL-3.0',
    category: 'weak-copyleft',
    match: (t) =>
      RE_SHORT_LGPL3.test(t) ||
      (t.includes('gnu lesser general public license') && RE_V3.test(t)),
  },
  {
    id: 'LGPL-2.1',
    name: 'GNU LGPL-2.1',
    category: 'weak-copyleft',
    match: (t) =>
      RE_SHORT_LGPL21.test(t) ||
      ((t.includes('gnu lesser general public license') ||
        t.includes('gnu library general public license')) &&
        RE_V2_1.test(t)),
  },
  {
    id: 'LGPL-2.0',
    name: 'GNU LGPL-2.0',
    category: 'weak-copyleft',
    match: (t) =>
      RE_SHORT_LGPL2.test(t) ||
      ((t.includes('gnu lesser general public license') ||
        t.includes('gnu library general public license')) &&
        RE_V2.test(t)),
  },
  {
    id: 'GPL-3.0',
    name: 'GNU GPL-3.0',
    category: 'copyleft',
    match: (t) =>
      RE_SHORT_GPL3.test(t) ||
      (t.includes('gnu general public license') && RE_V3.test(t)),
  },
  {
    id: 'GPL-2.0',
    name: 'GNU GPL-2.0',
    category: 'copyleft',
    match: (t) =>
      RE_SHORT_GPL2.test(t) ||
      (t.includes('gnu general public license') && RE_V2.test(t)),
  },

  // --- 弱 Copyleft（其他） ---
  {
    id: 'MPL-2.0',
    name: 'Mozilla Public License 2.0',
    category: 'weak-copyleft',
    match: (t) => t.includes('mozilla public license') && RE_APACHE_V2.test(t),
  },

  // --- 公有领域 / 权利放弃 ---
  {
    id: 'CC0-1.0',
    name: 'CC0-1.0 公有领域贡献',
    category: 'public-domain',
    match: (t) =>
      t.includes('cc0 1.0 universal') ||
      t.includes('creative commons legal code cc0') ||
      t.includes('creative commons zero v1.0 universal'),
  },
  {
    id: 'Unlicense',
    name: 'The Unlicense',
    category: 'public-domain',
    match: (t) => t.includes('unencumbered software released into the public domain'),
  },

  // --- 宽松许可（特征短语互不重叠，顺序不敏感） ---
  {
    id: 'Apache-2.0',
    name: 'Apache License 2.0',
    category: 'permissive',
    match: (t) => t.includes('apache license') && RE_APACHE_V2.test(t),
    tip: '宽松开源许可证：可自由使用、修改与分发（含商用、可换许可），需保留版权与许可证声明、保留 NOTICE；另有专利授权与商标使用限制。',
  },
  {
    id: 'MIT',
    name: 'MIT License',
    category: 'permissive',
    match: (t) =>
      t.includes('permission is hereby granted, free of charge') &&
      t.includes('without restriction'),
  },
  {
    id: 'ISC',
    name: 'ISC License',
    category: 'permissive',
    match: (t) =>
      t.includes('permission to use, copy, modify, and/or distribute this software'),
  },
  {
    id: 'BSD-3-Clause',
    name: 'BSD 3-Clause License',
    category: 'permissive',
    // 三条款比二条款多 “不得用版权人/贡献者名义背书” 一条
    match: (t) =>
      t.includes('redistribution and use in source and binary forms') &&
      t.includes('neither the name of'),
  },
  {
    id: 'BSD-2-Clause',
    name: 'BSD 2-Clause License',
    category: 'permissive',
    match: (t) =>
      t.includes('redistribution and use in source and binary forms') &&
      t.includes('provided by the copyright holders and contributors'),
  },
  {
    id: 'Zlib',
    name: 'zlib License',
    category: 'permissive',
    match: (t) => t.includes('altered source versions must be plainly marked'),
  },
  {
    id: 'WTFPL',
    name: 'WTFPL',
    category: 'permissive',
    match: (t) => t.includes('do what the fuck you want to public license'),
  },
]

// 分类元信息：分类名 + 默认使用提示
export const LICENSE_CATEGORY_META: Record<
  LicenseCategory,
  { label: string; tip: string }
> = {
  'public-domain': {
    label: '公有领域',
    tip: '版权人已放弃相关权利或将作品贡献至公有领域，可自由使用、修改与分发，通常无需署名（仍建议保留原声明）。',
  },
  permissive: {
    label: '宽松许可',
    tip: '宽松开源许可证：可自由使用、修改与分发（包括商用与闭源分发），但需保留原版权声明与许可证全文。',
  },
  'weak-copyleft': {
    label: '弱 Copyleft',
    tip: '弱 Copyleft 许可证：可在自己的作品中引用该控件；但若修改了许可证覆盖的原文件并分发，修改部分须以相同许可证开源。',
  },
  copyleft: {
    label: '强 Copyleft',
    tip: '强 Copyleft 许可证：分发包含该控件的衍生作品时，须以相同许可证公开完整源代码。商用或闭源分发前请仔细评估。',
  },
  other: {
    label: '其他许可证',
    tip: '检测到许可证文件，但未能识别为常见开源许可证类型，使用前请展开阅读全文确认具体条款。',
  },
  none: {
    label: '未提供许可证',
    tip: '未检测到许可证文件。按默认版权规则，作者保留全部权利，复制、修改或分发均可能构成侵权，建议先联系作者获得授权。',
  },
}

// 归一化：小写、折叠空白、弯引号转直引号（许可证模板普遍因换行把短语拆开）
function normalizeLicenseText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201a\u201b]/g, "'")
    .replace(/[\u201c\u201d\u201e\u201f]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getNoLicenseInfo(): LicenseInfo {
  return {
    id: 'NONE',
    name: '未声明许可证',
    category: 'none',
    tip: LICENSE_CATEGORY_META.none.tip,
  }
}

// 根据 LICENSE 文件正文识别许可证；空文本视为未声明
export function identifyLicenseText(text: string): LicenseInfo {
  if (!text || !text.trim()) return getNoLicenseInfo()

  const normalized = normalizeLicenseText(text)
  for (const def of LICENSE_DEFS) {
    if (def.match(normalized)) {
      return {
        id: def.id,
        name: def.name,
        category: def.category,
        url: `${SPDX_BASE}${encodeURIComponent(def.id)}.html`,
        tip: def.tip ?? LICENSE_CATEGORY_META[def.category].tip,
      }
    }
  }

  return {
    id: 'OTHER',
    name: '其他 / 自定义许可证',
    category: 'other',
    tip: LICENSE_CATEGORY_META.other.tip,
  }
}

/*
 * 控件根目录下可能存在的许可证文件名（按命中概率排序，短路探测）。
 * 与镜像白名单对应：无扩展名仅 LICENSE/LICENCE/COPYING 会落盘，
 * 带 .md/.txt/.markdown 扩展名的同名文件也允许镜像。
 */
export const LICENSE_FILE_NAMES = [
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'COPYING',
  'LICENCE',
  'license',
  'license.md',
  'license.txt',
]

export type LicenseFile = { fileName: string; text: string }

// fetchLicenseFile 所需的最小响应契约：仅需 ok 与 text()。
// 原生 Response 天然满足；页面侧的 $fetch 适配器返回同构最小对象即可。
export type LicenseFetchResponse = {
  ok: boolean
  text: () => Promise<string>
}

export type LicenseFetch = (url: string) => Promise<LicenseFetchResponse>

/**
 * 依次探测控件根目录下的许可证文件，返回第一个非空命中。
 * @param resourceBase 形如 '/resource/<控件名>/' 的同源基址（尾斜杠必需）
 * @param fetchImpl 可选注入（测试 / SSR $fetch 适配用），默认全局 fetch
 */
export async function fetchLicenseFile(
  resourceBase: string,
  fetchImpl: LicenseFetch = fetch,
): Promise<LicenseFile | null> {
  for (const fileName of LICENSE_FILE_NAMES) {
    try {
      const res = await fetchImpl(`${resourceBase}${encodeURIComponent(fileName)}`)
      if (!res.ok) continue
      const text = await res.text()
      if (text.trim()) return { fileName, text }
    } catch {
      // 单个候选请求失败不阻断后续探测
    }
  }
  return null
}
