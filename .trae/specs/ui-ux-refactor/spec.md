# ZIT-CoCo-Community UI/UX 彻底重构 - 产品需求文档

## Overview
- **Summary**: 在不改变任何现有业务逻辑的前提下，对 ZIT-CoCo-Community 全站进行一次完整的前端信息架构与视觉体系重构：建立统一 Design Token 与组件体系，重构 Header、首页（Hero/搜索/分类/资源网格）、资源详情页（面包屑/资源头部/Markdown 阅读区/Sticky Sidebar/相关资源）与 Footer，并完成响应式、可访问性、微动效与性能治理。
- **Purpose**: 解决当前站点「早期 Bootstrap/后台管理系统」观感——大面积纯黑、内容区狭窄、卡片信息密度失衡、字体层级弱、Header/Footer 简陋、详情页布局僵硬、Markdown 阅读体验差，使产品呈现现代开发者资源社区（GitHub / Vercel / Linear / shadcn 气质）的专业感。
- **Target Users**: 使用 CoCo 编辑器及相关开发工具的开发者；在社区内浏览、搜索、查看、下载控件/资源、获取源码、阅读文章、查看作者信息的用户。

## Goals
- 建立全站唯一 Design Token 体系（颜色 / 间距 / 圆角 / 阴影 / 字体层级），消除组件内随意硬编码。
- 重构 Header 为产品级 Sticky 导航（品牌 + 导航 + 搜索入口 + GitHub + 用户入口），含移动端方案。
- 首页重组为：Header → Hero/搜索 → 分类过滤 → 资源网格 → Footer，具备明确视觉焦点。
- 搜索成为核心交互：Hero 大搜索框 + Ctrl/⌘K（及 `/`）Command Palette；保留并复用现有 `/search` 页能力。
- 资源卡片重新设计：名称最突出、作者次级、统计再次级、操作清晰；去除虚假硬编码统计。
- 详情页重构为：面包屑 → 资源头部（操作靠近标题）→ 正文 + Sticky Sidebar → 相关资源。
- Markdown 建立完整排版体系（H1-H3 / 段落 / 引用 / 行内代码 / 代码块 / 列表 / 表格 / 链接 / 图片 / 分割线），代码块带语言标识与复制按钮。
- 真正的 Desktop / Tablet / Mobile 响应式，无横向滚动。
- 同步处理语义化 HTML、键盘导航、focus-visible、aria、对比度、reduced-motion 等可访问性。
- 不新增前端重依赖；移除生产环境不推荐的 Tailwind CDN；CSS 优先、组件复用、保持轻量。

## Non-Goals
- 不重写业务逻辑：下载、搜索过滤、统计上报、登录态、GitHub/Gitee/GitLab/Gitcode 链接、评论、点赞/收藏等行为保持不变。
- 不修改 R2 存量数据结构与 `information.json` 数据格式（不要求存量数据补分类/描述）。
- 不新增后端业务端点；仅对 `/api/control-meta` 做**纯增量字段**返回（已获用户批准）。
- 不做主题手动切换器（继续跟随系统 `prefers-color-scheme`，但 token 结构预留 `data-theme` 覆盖能力）。
- 不引入分页组件（现有数据量小、无分页 API；仅保留结果计数，未来有 API 后再接入）。
- 不替换 Font Awesome 图标体系（全站大量使用，继续沿用其 CDN）。
- 不做企业官网、电商、花哨 SaaS Landing、玻璃拟态、大面积渐变/发光/粒子/视差。

## Background & Context

### 一、当前技术栈
- Nuxt `4.5.2` + Vue `3.5`，SSR；Nitro preset `cloudflare_pages`，部署于 Cloudflare Pages。
- 后端资源：Cloudflare R2（bucket `coco-community`，经同源 `/resource/[...path]` 代理访问）+ D1（`components` 表计数）。
- Markdown：`marked` `^16.3.0`（客户端渲染）。
- 鉴权：`jose`，GitHub OAuth；登录态经 `/api/me` + `checkLoginStatus()`。
- 样式：纯手写 CSS，无预处理器、无 UI 框架；通过 CDN 引入 Font Awesome 6 与 Tailwind（`cdn.tailwindcss.com`，仅 5 处工具类使用）。

### 二、当前页面结构（路由）
- `/` 首页：搜索条 + 控件卡片网格（数据源 `/api/control-list`），含 1024 节日横幅。
- `/control/[id]` 资源详情：control-meta + R2 README + blob 下载；`/control/index.vue` 为「禁止根路径访问」提示；`/control/404.vue` 为资源不存在页。
- `/essay`、`/essay/[id]` 文章列表/详情（构建期打包 `essaylist.json`）。
- `/user`、`/user/[id]` 用户列表/详情（构建期打包 `userlist.json`）。
- `/issues`、`/issues/[number]` GitHub 议题列表/详情。
- `/search` 全局搜索（前端本地过滤 控件/文章/用户）。
- 其余：`/about`、`/agreement`（license/useragreement/privacypolicy）、`/safe`、`/tipping`、`/me`、`/login`、`/new-control`、`/1024`、`/[...slug]`。

### 三、当前组件结构
- `src/components/Navigation-bar.vue`：fixed 顶部栏，仅 Logo + 用户头像/名称块；无导航、无搜索入口。
- `src/components/Navigation-lines.vue`：70px 占位条。
- `src/components/footer.vue`：传统四列 Footer。
- 无卡片、搜索、Markdown、面包屑等可复用组件，全部内联在页面中。

### 四、当前样式体系（主要问题根因）
- `src/assets/css/dark.css`：仅在 `prefers-color-scheme: dark` 下把 body 置为纯黑 `#000000`、卡片置为 `#2d2d2d`。
- `src/assets/css/style.css` 与 `src/assets/style/home/style.css`：重复定义 `:root`（`--primary-color:#3498db` 等），container 1200px。
- `src/assets/css/card.css`：卡片被强制 `max-width:380px`，网格单元拉伸而卡片不拉伸——这是「内容窄、两侧大黑边」的直接原因。
- 样式分散在 `src/assets/style/<页面>/` 与各页面内联 `<style>`，存在大量重复按钮/卡片定义与硬编码颜色；无统一字号、间距、圆角体系，正文统计字号小至 0.85rem。
- Logo 色：`#cc00ff`（紫）+ `#3498db`（蓝）。

### 五、当前 API 使用情况
- `GET /api/control-list` → `{list:[{id,name,size("x KiB"),downloads,likes,collections,author,Pageviews}]}`（R2 枚举 + information.json + D1 计数）。
- `GET /api/control-meta?name=` → `{name,author,currentVersion,versions,controlKey,size}`。
- `GET /api/download?name=`（下载计数）、`/api/pageviews`、`/api/pageviews_essay`、`/api/pageviews_user`、`/api/me`、`/api/log`。
- GitHub：`/api/github/issues`、`/api/github/issues/[number]`、`/api/github/user`；评论：`/api/comment-essay`、`/api/fetch-comment-essay`。
- `GET /resource/[...path]`：同源 R2 读取。
- R2 内 `information.json` 实际字段：`author`、`Current_version`、`Version_number_list`（**无分类/标签/描述/许可证/更新时间**）。D1 `components` 表字段：`id,name,size,downloads,likes,collections,author,Pageviews`（同样**无分类/描述**）。

### 六、可复用 vs 需重写
- **保留/复用**：所有 API 调用、数据映射逻辑、下载 blob 逻辑、`checkLoginStatus`、marked 渲染管线（升级配置）、Font Awesome、静态 JSON 构建期导入模式、R2 同源路由。
- **重写**：Navigation-bar、footer、首页、资源详情页模板结构、分散的旧 CSS（逐步停用/删除）。
- **新增**：Design Token 三件套（tokens/base/prose）、ResourceCard、CommandPalette、MarkdownView、分类推断工具。

### 七、数据缺口处理决策（已与用户确认）
1. 分类/标签/描述在后端与 R2 中均不存在：分类采用**前端关键词推断规则**（无法识别归入「其他」），分类展示真实计数；卡片副标题位置展示真实元信息（作者/类型/大小），**不编造描述**。规则集中管理，未来后端补字段可无缝替换。
2. `/api/control-meta` 允许**纯增量**返回 `downloads`、`Pageviews`（只读 D1，不改现有字段与行为）。
3. 移除 Tailwind CDN，5 处工具类替换为自有类。
4. 主题继续跟随系统，浅色/深色双套完整 Token。

## Design Token 概要（实施依据）
- **Light**：background `#F8FAFC`；foreground `#0F172A`；card `#FFFFFF`；border/input `#E2E8F0`；muted `#64748B`；primary `#2196F3`（hover `#1E88E5`）；secondary `#F1F5F9`；accent-cyan `#06B6D4`；accent-purple `#8B5CF6`。
- **Dark**：background `#0F1115`；foreground `#E6EAF2`；card `#181B21`；border `#262B33`；muted `#939BA9`；primary `#42A5F5`；secondary `#1F242D`。
- 代码块在两套主题中均使用深色（`#0F1115` 底 / `#E6EDF3` 字），与正文形成明确区分；行内代码随主题取色。
- 间距阶梯：4 / 8 / 12 / 16 / 24 / 32 / 48 / 64；圆角：sm 6 / md 8 / lg 12 / full；阴影：sm / md 两档，克制使用。
- 字体层级：Display 40-44 / H1 30-32 / H2 24 / H3 19-20 / Body 15-16 / Small 14 / Caption 12-13；行高正文 ≥1.6。
- 字体栈：`-apple-system, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif`；等宽：`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`。
- 容器宽度：`max-width: 1200px`（Header 与正文左右边缘对齐）。

## Functional Requirements
- **FR-1 全局样式基座**：全站样式经 tokens/base/prose 三个全局文件统一；页面与组件不得出现散落硬编码色值；浅色与深色模式均完整可用。
- **FR-2 Header**：Sticky 顶栏（高度 ≤64px），左 Logo+品牌名，中部导航（首页 / 资源 / 文章 / 社区 / 关于），右侧搜索触发器（含 ⌃K 提示）、GitHub 链接、用户头像入口；移动端折叠为菜单面板；当前路由有明确指示。导航中「资源」锚定到首页资源区（`/#resources`，因 `/control` 根路径为禁用页）。
- **FR-3 Hero**：首页顶部简洁 Hero（非一屏式），含品牌陈述 H1、一句话定位、核心搜索框（搜索图标 + 快捷键提示），提交后跳转 `/search?q=`；可附低调的资源/开发者数量统计。
- **FR-4 Command Palette**：Ctrl/⌘K 与 `/` 唤起；内含搜索输入、实时控件结果（基于已加载的 control-list）、键盘上下选择、Enter/点击跳转；Esc 关闭；焦点进入输入框、关闭后归还触发器；具备完整 aria 角色与标签。
- **FR-5 分类过滤**：Hero 下分类 Pills（全部 + 推断分类，带数量）；点击即时过滤网格与结果计数；`aria-pressed` 语义；无结果有空状态。
- **FR-6 资源网格**：响应式 auto-fill 网格（宽屏 3-4 列、平板 2 列、手机 1 列），卡片等高，无横向滚动；移除 380px 卡片宽度上限。
- **FR-7 Resource Card**：资源名视觉权重最高；作者次级；统计（下载/浏览/点赞，真实数据）再次级；操作含「查看详情」主操作与「下载」次操作；Hover 仅做轻微 border/位移/阴影变化。
- **FR-8 详情页**：面包屑（首页 / 资源 / 名称）；资源头部集中展示图标、名称、作者、JSX/版本元信息 pill，并把「下载 / 源代码」按钮置于标题附近；正文 + 300px Sticky Sidebar 双栏（移动端堆叠）；正文含 README 与历史版本；Sidebar 含作者卡与信息定义列表；底部展示同作者相关资源。
- **FR-9 Markdown**：支持并美化全部所列元素；代码块带语言标签与可工作的复制按钮；外部链接安全属性；图片 lazy/alt；正文阅读字号与行长舒适。
- **FR-10 Footer**：重组为现代社区 Footer，保留全部既有链接（Issues/安全/用户数据/两个协议、四个代码托管站与开源协议、打赏、QQ/Discord/Telegram）；移动端纵向；版权信息保留。
- **FR-11 业务保持**：下载仍走 blob + `/api/download` 计数；页面浏览统计；登录态区分的作者信息拉取；404 → `/control/404`；搜索页三类结果过滤逻辑不变。
- **FR-12 可访问性**：语义化 landmark、键盘可完成全部操作、可见 focus-visible、表单 label、图片 alt、对比度达标、尊重 `prefers-reduced-motion`。

## Non-Functional Requirements
- **NFR-1 性能**：不新增任何 npm 依赖；移除 Tailwind CDN；CSS 优先实现动效；图片 lazy；交互响应无多余 JS。
- **NFR-2 兼容性**：保持 SSR/同构水合正确；客户端日期类逻辑（1024 横幅）仍在 mounted 后判定。
- **NFR-3 可维护性**：颜色/间距/圆角/字号只允许取自 Token；组件复用（ResourceCard 同时服务首页与相关资源/搜索）。
- **NFR-4 动效**：150-250ms、快速自然；仅 hover/focus/dropdown/modal/页面级过渡；支持 reduced-motion 降级。
- **NFR-5 质量门**：`nuxt build` 必须通过；dev 环境所有关键路由实际渲染验证。

## Constraints
- **Technical**：Nuxt 4 + Vue 3 SSR、Cloudflare Pages/Nitro、R2/D1；h3 原生工具函数；`$fetch`/ofetch；不新增依赖。
- **Business**：不删除任何已有功能；不改变下载/统计/登录/搜索行为；外部代码托管与社交链接保持原样。
- **Dependencies**：marked v16（renderer 新 API）、Font Awesome CDN、现有 `server/utils/*`。

## Assumptions
- 现有控件数量为小体量（约十个量级），首页一次加载全量列表用于 Palette 与前端过滤是可接受的。
- R2 `README.md` 与 `control.jsx` 为详情页必需约定（现状已如此）。
- 资源「标签」位置以真实元信息 pill（JSX / 版本号）填充，不虚构技术标签。
- 许可证、更新时间无数据源，Sidebar 不予展示；开源协议入口已在 Footer 存在。

## Acceptance Criteria

### AC-1: Design Token 建立并被全站消费
- **Type**: `rule`
- **Given**: 全站源码
- **When**: 检查样式资产与渲染后页面
- **Then**: 存在 tokens.css 定义颜色/间距/圆角/阴影/字体全套变量（浅色 `:root` + 深色媒体查询）；body 背景在浅色为 `#F8FAFC`、深色为 `#0F1115`；除 Token 定义文件与代码块有意使用的深色外，源码中不再出现 `#000000`、`#2d2d2d` 硬编码
- **Pass Condition**: 对 `src/` 与 `pages/` 的 grep 无违例硬编码（tokens/base/prose 及代码块样式除外），且浏览器 computed style 与 Token 一致
- **Evidence**: grep 输出 + 浏览器 computed style 截图/记录

### AC-2: Typography 字体层级体系
- **Type**: `rule`
- **Given**: 任意内容页
- **When**: 检查标题/正文/辅助文字
- **Then**: H1 ≥30px 且与 H2、正文（≥15px、line-height ≥1.6）、辅助文字（≤14px）有可辨识层级；移动端输入框字号 16px（防止 iOS 缩放）
- **Pass Condition**: 抽查首页与详情页各级字号/行高符合 Token 类型阶梯
- **Evidence**: 浏览器 computed styles 记录

### AC-3: 产品级 Sticky Header
- **Type**: `rule`
- **Given**: 全站所有页面
- **When**: 滚动与在不同视口下查看
- **Then**: Header sticky 置顶、高度 ≤64px、含品牌 Logo+名称、5 项导航、搜索触发器（带快捷键提示）、GitHub 链接、用户入口；<768px 折叠为汉堡菜单且可开合
- **Pass Condition**: 桌面与移动两种形态结构完整、菜单可键盘操作
- **Evidence**: 多视口截图 + DOM 结构检查

### AC-4: Header 导航路由正确性与当前态
- **Type**: `rule`
- **Given**: 用户点击导航
- **When**: 分别点击 首页/资源/文章/社区/关于
- **Then**: 跳转 `/`、`/#resources`、`/essay`、`/issues`、`/about`；当前对应导航项有 active 指示
- **Pass Condition**: 五项链接逐一验证命中
- **Evidence**: 浏览器点击验证记录

### AC-5: 首页 Hero 与核心搜索
- **Type**: `rule`
- **Given**: 访问 `/`
- **When**: 查看 Hero 并输入关键词回车
- **Then**: 出现 H1 品牌陈述、一句话定位、显眼搜索框（图标 + ⌃K 提示）；回车跳转 `/search?q=<关键词>`；Hero 高度克制（不超过约 40vh）
- **Pass Condition**: 结构与跳转均成立
- **Evidence**: 截图 + 跳转 URL 记录

### AC-6: Command Palette 交互
- **Type**: `rule`
- **Given**: 任意页面
- **When**: 按 Ctrl/⌘K 或 `/`
- **Then**: Palette 打开且焦点落入输入框；输入时实时显示匹配控件；↑↓ 可选择、Enter/点击跳转详情；Esc 关闭并归还焦点；含 `role="dialog"`、`aria-modal`、`aria-label`
- **Pass Condition**: 上述键盘/鼠标路径全部通过
- **Evidence**: 键盘操作验证记录 + DOM 属性检查

### AC-7: 分类过滤可用且语义正确
- **Type**: `rule`
- **Given**: 首页
- **When**: 点击各分类 Pill
- **Then**: 网格按前端推断规则过滤，Pill 显示真实数量，选中态使用 `aria-pressed`；「全部」恢复全量；无匹配时显示空状态
- **Pass Condition**: 每个分类的过滤结果数与标注一致
- **Evidence**: 点击验证与计数比对记录

### AC-8: 响应式资源网格
- **Type**: `rule`
- **Given**: 首页资源区
- **When**: 分别在 ≥1280 / 768 / 360px 视口查看
- **Then**: 宽屏 3-4 列、平板 2 列、手机 1 列；卡片等高；360px 下无横向滚动；不存在 380px 宽度上限
- **Evidence**: 三视口截图 + `document.documentElement.scrollWidth <= innerWidth` 验证
- **Pass Condition**: 三种视口全部满足

### AC-9: Resource Card 信息层级与真实数据
- **Type**: `rule`
- **Given**: 首页卡片
- **When**: 检查内容与交互
- **Then**: 资源名为最大最粗元素；作者为次级；下载/浏览/点赞统计取自 API 真实字段（无硬编码 0 的星标/拇指项）；「查看详情」为明确主操作、「下载」为次操作；Hover 仅有轻微 border/translateY(-1~2px)/阴影
- **Pass Condition**: DOM 中不存在写死的统计数字；层级与操作符合要求
- **Evidence**: 卡片 DOM 检查 + 交互截图

### AC-10: 详情页面包屑
- **Type**: `rule`
- **Given**: 访问存在的 `/control/[id]`
- **Then**: 顶部显示低调面包屑「首页 / 资源 / 名称」，前两项可点击
- **Pass Condition**: 链接分别指向 `/` 与 `/#resources`
- **Evidence**: DOM/点击记录

### AC-11: 详情页资源头部与就近操作
- **Type**: `rule`
- **Given**: 详情页
- **Then**: 标题区展示图标、资源名、作者（链接到 `/user/[author]`）、JSX/版本 pill；「下载」「源代码」按钮位于标题附近；下载仍先请求 `/api/download` 再经 blob 触发 `<name>.jsx` 下载；源代码打开 R2 控件文件
- **Pass Condition**: 业务调用与现状一致（Network 可观测到 `/api/download`），布局就近
- **Evidence**: Network 记录 + 截图

### AC-12: 详情页双栏与 Sticky Sidebar
- **Type**: `rule`
- **Given**: 详情页
- **When**: ≥1024px 与 <768px 分别查看
- **Then**: 桌面为正文 + 300px Sidebar，Sidebar sticky 跟随滚动；移动端上下堆叠且顺序合理；无内容重叠
- **Evidence**: 两视口滚动验证截图
- **Pass Condition**: 两种布局均成立

### AC-13: Sidebar 与版本信息真实
- **Type**: `rule`
- **Given**: 详情页
- **Then**: Sidebar 展示作者（头像/名称/主页链接）、文件大小、文件类型 JSX、当前版本、下载次数、浏览量（后两项来自 control-meta 增量字段）；正文区展示历史版本列表；不展示无数据源的许可证/更新时间
- **Pass Condition**: 字段与 API 返回逐一对应
- **Evidence**: API 响应与页面内容比对

### AC-14: Markdown 排版与代码块
- **Type**: `rule`
- **Given**: 含 README 的详情页
- **Then**: H1/H2/H3、段落、引用、行内代码、代码块、UL/OL、表格、链接、图片、分割线均有明确样式；代码块含语言标签与复制按钮且点击复制成功；外部链接含 `target="_blank" rel="noopener noreferrer"`；图片 `loading="lazy"`
- **Pass Condition**: 逐元素在 README 页面可观测，复制后剪贴板内容正确
- **Evidence**: 元素检查 + 复制验证记录

### AC-15: 相关资源
- **Type**: `rule`
- **Given**: 同一作者存在其他控件
- **Then**: 详情页底部展示同作者相关资源（排除当前项、上限 3-4 个、复用 ResourceCard）；无其他资源时整区隐藏
- **Pass Condition**: 列表内容与 control-list 同作者项一致
- **Evidence**: 数据比对记录

### AC-16: 现代 Footer 与链接保留
- **Type**: `rule`
- **Given**: 全站底部
- **Then**: 信息分组重组（社区/开源/支持/社交），既有 13+ 个链接一个不少；<640px 改为纵向；版权信息保留
- **Pass Condition**: 链接清单逐一比对、移动端布局成立
- **Evidence**: 链接清单比对 + 移动截图

### AC-17: 既有业务行为零回归
- **Type**: `rule`
- **Given**: 重构后站点
- **Then**: 页面挂载仍发 `/api/pageviews`；作者信息仍按登录态走内部/GitHub 两条路径；不存在的资源仍重定向 `/control/404`；`/search` 仍可过滤控件/文章/用户；`/me`、登录入口可用
- **Pass Condition**: 每项行为有 Network/页面证据
- **Evidence**: Network 与跳转记录

### AC-18: 可访问性
- **Type**: `rule`
- **Given**: 全站
- **Then**: 使用 header/nav/main/footer 语义 landmark；交互元素为 button/a 且具 aria-label/title；存在明显 :focus-visible；图片有 alt；输入框有可感知 label；开启系统 reduced-motion 时动效全部降级
- **Pass Condition**: 键盘可独立完成 首页搜索→详情→下载/源码 全链路；reduced-motion 下无位移动画
- **Evidence**: 键盘走查记录 + 媒体偏好模拟

### AC-19: 性能与依赖治理
- **Type**: `rule`
- **Given**: 重构后仓库
- **Then**: `package.json` 依赖数量不增加；nuxt.config 中 Tailwind CDN 脚本移除且页面无其网络请求；5 处原工具类被自有类等价替换
- **Pass Condition**: 依赖 diff 为空 + Network 无 `cdn.tailwindcss.com` 请求 + 相关页面布局无回归
- **Evidence**: package.json diff + Network 记录

### AC-20: 构建与运行时验证
- **Type**: `rule`
- **Given**: 完成实施的代码
- **Then**: `nuxt build` 成功退出；dev 服务下 `/`、`/control/<真实存在的 id>`、`/search?q=`、`/essay`、`/user`、`/issues`、`/agreement/useragreement`、`/agreement/privacypolicy` 均返回 200 且正常渲染（无未捕获错误）
- **Pass Condition**: 构建通过 + 所列路由状态码与页面内容检查全部通过
- **Evidence**: 构建日志与路由检查记录

### AC-21: 现代开发者社区视觉品质
- **Type**: `rubric`
- **Dimension**: 整体视觉专业度与品牌一致性（配色、留白、层级、品牌蓝/青/紫的克制运用）
- **Scale**: 1-5
- **Anchors**: 1 = 仍是旧式后台/Bootstrap 模板感，纯黑大面积存在；3 = 干净但无明显品牌语言或局部不统一；5 = 具备 GitHub/Vercel/Linear 级现代开发者社区气质，品牌识别清晰、全站统一
- **Pass Threshold**: >= 4
- **Evidence**: 首页/详情/列表页整页截图对照评审

### AC-22: 卡片信息密度与层级质量
- **Type**: `rubric`
- **Dimension**: 卡片「这是什么 / 谁做的 / 可以干什么」的一眼可读性与噪音控制
- **Scale**: 1-5
- **Anchors**: 1 = 图标数字按钮堆砌、层级混同；3 = 层级可辨但仍有多余信息或操作不够明确；5 = 名称/作者/统计/操作四级层级清晰、零噪音、操作明确
- **Pass Threshold**: >= 4
- **Evidence**: 多卡片截图评审

### AC-23: 详情页阅读体验
- **Type**: `rubric`
- **Dimension**: README 排版舒适度与信息获取效率（行长、段距、代码块、Sidebar 信息组织）
- **Scale**: 1-5
- **Anchors**: 1 = 像 Markdown 直接套 Card，代码与正文难分；3 = 可读但信息查找仍费神；5 = 长时间阅读舒适、代码块精致、Sidebar 信息一查即得
- **Pass Threshold**: >= 4
- **Evidence**: 详情页整页与代码块截图评审

### AC-24: 响应式与移动端体验质量
- **Type**: `rubric`
- **Dimension**: 移动端不是「缩小的桌面」，而是重新组织的可用性
- **Scale**: 1-5
- **Anchors**: 1 = 存在横向滚动、按钮挤压、内容重叠；3 = 无硬伤但布局只是简单堆叠；5 = 导航/卡片/详情/搜索/Footer 均按移动端规律重组，单手可用
- **Pass Threshold**: >= 4
- **Evidence**: 360-390px 全流程走查截图

## Open Questions
- 无（四个关键边界问题已在分析阶段通过用户确认闭环；若实施中发现新的数据缺口，将按「不编造、最小必要调整」原则处理并在 tasks.md 留痕）。
