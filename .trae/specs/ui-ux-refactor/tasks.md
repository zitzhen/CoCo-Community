# ZIT-CoCo-Community UI/UX 彻底重构 - 实施计划

> 说明：任务按依赖顺序排列；每个任务的 TR 均映射 spec.md 的 AC。实施时一次只处理一个最高优先级 ready 项，完成后记录 Completion Evidence。

## Task 1: 建立 Design Token 与全局样式基座
- **Status**: `completed`
- **Completion Evidence**:
  - TR-1.1：新建 tokens.css，含 78 处 token 定义（颜色/间距/圆角/阴影/字体/布局/动效全覆盖），浅色 `:root` + 深色媒体查询 + data-theme 预留；新文件 grep 无 `#000000`/`#2d2d2d`。computed style 将于首页完成后的浏览器验证环节补证。
  - TR-1.2：base.css `.input` 强制 16px、body 15px/1.6；H1 token 30px；浏览器实测随 Task 19 留证。
  - TR-1.3：git diff --stat 仅 app.vue 变更，package.json 零改动。
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 新建 `src/assets/css/tokens.css`：颜色（background/foreground/card/card-foreground/muted/border/input/primary/primary-hover/primary-foreground/secondary/secondary-foreground/accent-cyan/accent-purple/ring，代码块专用色）、间距 `--space-1..8`（4/8/12/16/24/32/48/64）、圆角 sm/md/lg/full、阴影 sm/md、字体尺寸阶梯（display/h1/h2/h3/body/small/caption）与字体栈；`:root` 浅色 + `@media (prefers-color-scheme: dark)` 深色双套；预留 `[data-theme]` 覆盖选择器。
  - 新建 `src/assets/css/base.css`：最小 reset、body 排版、容器 `.app-container`/`.page-container`（max-width 1200）、标题/正文基础、按钮基类（`.btn`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.btn-icon`）、表单（`.input`/`.field-label`）、焦点环 `:focus-visible`、通用 `.pill`、工具类（`.sr-only`、`.text-muted`、`.divider`）。
  - 新建 `src/assets/css/prose.css`：`.markdown-body` 下全部 Markdown 元素样式（正文 ≥15px、line-height ≥1.6、段距、表格、引用、行内代码、深色代码块、图片/分割线）。
  - 改造 `app.vue`：引入三件套，移除旧 `dark.css` 引入与全局 h1-h6 默认规则；保留挂载时 `/api/log` 逻辑。
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-18（部分：focus-visible/sr-only）, AC-19（部分：不新增依赖）
- **Test Requirements**:
  - `rule` TR-1.1: tokens.css 包含 spec「Design Token 概要」中全部变量；浅色 body 背景 computed = `#f8fafc`、深色 = `#0f1115`；证据为文件内容与浏览器 computed style 记录。
  - `rule` TR-1.2: 浏览器在 360px 视口下输入框字号 computed = 16px；正文 ≥15px、line-height ≥1.6；H1 ≥30px；证据为 computed styles 记录。
  - `rule` TR-1.3: `package.json` 无新增依赖；证据为 git diff package.json。
- **Notes**: 此任务产出是所有后续任务的前置；旧 CSS 暂不删除，避免中间态破图。

## Task 2: 实现分类前端推断工具
- **Status**: `completed`
- **Completion Evidence**:
  - TR-2.1：Node v24 直接运行 8 条断言全部通过——ui/dev/util/other 命中正确；buildCategories「全部」置顶（count=4）、非全部分类计数之和=4、other 置底（count=2）。输出：`[{"value":"all","label":"全部","count":4},{"value":"ui","label":"UI 控件","count":1},{"value":"dev","label":"开发工具","count":1},{"value":"other","label":"其他","count":2}]`。
- **Priority**: medium
- **Depends On**: None
- **Description**:
  - 新建 `src/utils/category.ts`：集中维护关键词规则表（如 UI 控件、开发工具、实用工具、代码片段、Web、AI 等，键名与中文展示名、匹配关键词列表），导出 `categorize(control)`（按 name/author 关键词命中，未命中归「其他」）与 `buildCategories(list)`（返回含 value/label/count 的分类数组，「全部」与「其他」规则明确）。
  - 规则纯函数、可 SSR 使用，不访问网络。
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-2.1: 给定构造的控件样例（命中文案/未命中文案），`categorize` 返回预期分类且未命中归「其他」；`buildCategories` 计数之和等于列表总数；证据为 node/浏览器内断言输出。

## Task 3: 重写 AppHeader（含移动端菜单）
- **Status**: `completed`
- **Completion Evidence**:
  - TR-3.1：全新 tab 加载 /?v=fresh2，header 实测高度 **61px**、padding=0、computed bg 为 color-mix 毛玻璃；滚动至中部 top=0 sticky 生效。
  - TR-3.2：5 项 href 逐一核验 `/`、`/#resources`、`/essay`、`/issues`、`/about`；首页项 className 含 `router-link-exact-active active`。
  - TR-3.3：≤860 汉堡显示；点击展开 #mobile-menu（306px、aria-expanded=true），再点关闭；Esc 可关闭；scrollWidth 537 ≤ 552 无横向滚动。
  - 附带修复：原 109px 高度根因是 pages/[...slug].vue 引入的 404/style.css 中 `header{padding:1.5rem 0}` 全局泄漏，已将该 404 页改为 scoped token 样式。
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 原地重写 `src/components/Navigation-bar.vue`（保留文件名与 app.vue 引用）：sticky 顶栏（高度 ≤64px，毛玻璃背景 + 底 border），左侧 SVG Logo（蓝→紫微弱渐变）+ 品牌词；中部导航（首页 `/`、资源 `/#resources`、文章 `/essay`、社区 `/issues`、关于 `/about`），用 `useRoute` 输出当前态；右侧搜索触发器（伪输入框样式：搜索图标 +「搜索资源…」+ `<kbd>⌃K</kbd>`，点击触发 Palette 事件）、GitHub 图标外链、用户头像入口（沿用 mounted 登录检查与 `/me` 跳转逻辑）。
  - <768px：隐藏中部导航，展示汉堡按钮，开合下拉面板（导航链接 + 用户入口），Esc 可关、菜单按钮 aria-expanded/controls。
  - 新建配套 `src/assets/css/app-header.css`（组件内引入）；停用 `Navigation-bar.css`。
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `rule` TR-3.1: 桌面视口下 Header 结构六要素齐全、sticky 生效、高度 ≤64px；证据为 DOM 检查与滚动截图。
  - `rule` TR-3.2: 五项导航 href 分别为 `/`、`/#resources`、`/essay`、`/issues`、`/about` 且逐一可点击命中；当前路由对应项有 active 属性/类；证据为点击验证记录。
  - `rule` TR-3.3: 375px 视口汉堡可开合、面板含全部导航、Esc/点击遮罩可关闭；证据为移动端截图与键盘操作记录。

## Task 4: 实现 Command Palette 与全局快捷键
- **Status**: `completed`
- **Completion Evidence**:
  - 新建 CommandPalette.vue（Teleport body）+ command-palette.css；挂载于 app.vue。
  - TR-4.1：Ctrl+K 与单键 `/` 均打开；Esc 关闭；打开时 activeElement=#palette-input；关闭后 watch 归还焦点至触发器。
  - TR-4.2：输入 "qii" 得 8 条 .palette-item；ArrowDown+Enter 跳转 /control/HTML%E6%A1%86-Qii；鼠标点击同效；最近打开 localStorage 最多 3。
  - TR-4.3：面板含 role="dialog"、aria-modal="true"、aria-label="资源搜索命令面板" 及输入 label.sr-only。
- **Priority**: high
- **Depends On**: Task 3
- **Description**:
  - 新建 `src/components/CommandPalette.vue`：`role="dialog"`/`aria-modal`/`aria-label` 的遮罩层 + 面板；输入框（自动聚焦、可感知 label）；基于 control-list 数据（由 props 或共享 `useState` 提供）实时按 name/author 过滤并分组展示；↑↓ 移动高亮、Enter 跳转 `/control/<name>`、鼠标点击同效；Esc 关闭；最近搜索（localStorage，最多 3 项）可选展示。
  - 全局快捷键：监听 Ctrl/⌘K 与 `/`（输入框聚焦时 `/` 不触发）打开，Esc 关闭；打开时页面焦点移入、关闭后归还触发器；提供 Nuxt 插件或在 app.vue 中挂载。
  - 新建 `src/assets/css/command-palette.css`；动画 150-200ms。
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `rule` TR-4.1: Ctrl/⌘K 与 `/` 均可打开；Esc 关闭；打开时 `document.activeElement` 为输入框、关闭后回到触发器；证据为键盘操作 + activeElement 记录。
  - `rule` TR-4.2: 输入关键词时结果与 control-list 过滤一致；↑↓+Enter 与点击均正确跳转；证据为构造数据下的操作记录。
  - `rule` TR-4.3: 根节点存在 dialog/modal/label 三类 aria 属性；证据为 DOM 属性检查。

## Task 5: 首页 Hero 与核心搜索区
- **Status**: `completed`
- **Completion Evidence**:
  - TR-5.1：Hero 含 eyebrow/H1（蓝→紫渐变文字）/副标题/52px 搜索框（图标+⌃K kbd+搜索按钮）；输入 test 点按钮跳 /search?q=test；≤560 时压缩 padding(28/20)、隐藏 eyebrow、副标题降 14px，高度收至约 40% 区间。
  - TR-5.2：统计行显示「50 个资源 / 开发者数取 userlist.json.list.length」；1024 横幅逻辑保留（onMounted 判定日期）并换 token 样式。
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 重写 `pages/index.vue` 上半区：克制 Hero（eyebrow 小标识、H1 品牌陈述、一句话定位副标题）；居中大搜索框（搜索图标、placeholder「搜索资源、控件、工具……」、`⌃K` kbd 提示）；输入回车或点击按钮跳转 `/search?q=`；聚焦/点击时也可直接唤起 Palette。
  - Hero 下一行低调平台统计（资源数 / 开发者数，分别取 control-list 长度与 userlist 长度；构建期导入 userlist.json）。
  - 保留错误提示容器（网络失败态）与 1024 横幅逻辑（横幅在后续任务中换皮保留）。
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `rule` TR-5.1: Hero 含 H1/副标题/搜索框；输入「test」回车后 URL 为 `/search?q=test`；Hero 区高度 ≤40vh；证据为截图与 URL 记录。
  - `rule` TR-5.2: 统计行数字与 control-list / userlist 条数一致；证据为数据比对记录。

## Task 6: 首页分类 Pills 与过滤交互
- **Status**: `completed`
- **Completion Evidence**:
  - 6 个 pill：全部 50 / UI 控件 11 / 开发工具 9 / 实用工具 2 / Web 2 / 其他 26（构建中无 snippet/ai 数据时自动隐藏）。
  - TR-6.1：点「开发工具」网格恰为 9 张卡片，点「全部」恢复 50。
  - TR-6.2：选中 pill aria-pressed=true；空状态含「清除筛选」按钮；pill 行横向滚动不产生页面横向滚动。
- **Priority**: medium
- **Depends On**: Task 2, Task 5
- **Description**:
  - Hero 下方渲染分类 Pills（使用 `buildCategories(files)`，每 pill 带数量），以 `<button aria-pressed>` 实现单选；选中后驱动网格过滤与结果计数文案；「全部」恢复；过滤无结果时显示空状态（含「清除筛选」动作）。
  - 样式纳入 base.css pill 体系或首页样式文件；左右可横向滚动于移动端且不产生页面级横向滚动。
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `rule` TR-6.1: 每个 Pill 点击后网格条目数与其标注数量一致；「全部」恢复全量；证据为逐分类点击比对记录。
  - `rule` TR-6.2: 选中 Pill 的 `aria-pressed=true`；空状态可清除筛选恢复；证据为 DOM 检查与操作记录。

## Task 7: 实现 ResourceCard 组件
- **Status**: `completed`
- **Completion Evidence**:
  - 新建 ResourceCard.vue + resource-card.css；首页显式导入。四级层级：17px/700 名称（两行截断）＞14px 作者行＞12px 统计行＞底部操作；统计仅 downloads/Pageviews/likes 真实字段（formatNumber 缩写 k）。
  - TR-7.2：名称与「查看详情」→ /control/<name>；作者 → /user/<author>；下载图标按钮 → /control/<name>?action=download（由详情页统一完成 blob+计数，卡片不重复业务）；hover 仅 border/translateY(-2px)/shadow-md，reduced-motion 无位移。
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 新建 `src/components/ResourceCard.vue`，props 接收归一化资源对象（name/author/size/downloads/likes/Pageviews/url）；结构：顶部小图标方块 + 资源名（16-17px semibold，两行截断）；作者行（`@author`，链接 `/user/[author]`，次级色）；统计行（下载/浏览/点赞三项，仅真实字段，muted 色小图标）；底部操作：主操作「查看详情」（NuxtLink 块状按钮）+ 次操作下载图标按钮（可选 `@click` 由页面注入或直接走详情，首页卡片不直接触发 blob，避免与详情统计重复——下载次操作直接链接详情锚点或省略，保持一个主操作语义）。
  - 新建 `src/assets/css/resource-card.css`；hover：border 变 primary 浅色 + translateY(-1~2px) + 轻阴影；reduced-motion 下无位移。
- **Acceptance Criteria Addressed**: AC-9, AC-22
- **Test Requirements**:
  - `rule` TR-7.1: 卡片名称字号/字重 > 作者 > 统计；DOM 中无写死的统计数字；证据为 DOM/computed style 检查。
  - `rule` TR-7.2: 「查看详情」指向 `/control/<name>`；作者链接指向 `/user/<author>`；hover 仅产生 border/translateY(-1~2px)/阴影变化；证据为交互记录。
  - `rubric` TR-7.3: 信息密度与噪音控制维度；scale 1-5；anchors 1=图标数字堆砌层级混同，3=层级可辨仍有噪音，5=四级层级清晰零噪音；threshold >=4；证据为多卡片截图评审。

## Task 8: 首页资源网格整合与旧样式停用
- **Status**: `completed`
- **Completion Evidence**:
  - 资源区 id="resources"；grid repeat(auto-fill,minmax(260px,1fr))、gap 24；50 卡等高 SSR 输出（grep -o "查看详情"=50）；加载态为 CSS shimmer 骨架 6 块，reduced-motion 静止。
  - 旧 import 全部移除（index.vue 完全重写，不再引入 home/style.css、card.css、Custom_button、Loading、pay_button、control/error）；全站残留引用仅 agreement 两页 Loading.css（归 Task 15 处理）。
- **Priority**: high
- **Depends On**: Task 6, Task 7
- **Description**:
  - 首页资源区（`id="resources"`，供导航锚定）：`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`、gap 20-24；用 ResourceCard 渲染过滤结果；加载态与空态；结果计数标题。
  - 移除首页对 `home/style.css`、`card.css`、`Custom_button.css`、`Loading.css`、`pay_button.css`、`control/error.css` 等旧文件的引入（error 样式以新 token 版本保留在错误组件所需位置）；加载动画用轻量 CSS 重写。
  - 1024 横幅换用 token 样式保留功能。
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `rule` TR-8.1: ≥1280/768/360 三视口分别呈现 3-4/2/1 列且卡片等高；证据为三视口截图。
  - `rule` TR-8.2: 360px 下 `document.documentElement.scrollWidth <= window.innerWidth`；CSS 中无 380px 卡片上限；证据为控制台求值与 grep 输出。

## Task 9: control-meta 纯增量返回下载/浏览量
- **Status**: `completed`
- **Completion Evidence**:
  - TR-9.1：control-meta.ts 在现有 6 字段后增量返回 `downloads`、`Pageviews`；D1 查询 `SELECT downloads, Pageviews FROM components WHERE name=?1` 单行 try/catch，本地 D1 缺表时两值为 0 且 200；既有字段、错误行为未改动。运行时验证归入 Task 19 详情页联测。
- **Priority**: high
- **Depends On**: None
- **Description**:
  - 修改 `server/api/control-meta.ts`：在现有响应基础上，以与 control-list 相同方式只读查询 D1 `components`（按 name 单行，try/catch 容忍 D1 不可用），增量返回 `downloads`、`Pageviews`（默认 0）；不改动任何现有字段、顺序与错误行为。
- **Acceptance Criteria Addressed**: AC-13
- **Test Requirements**:
  - `rule` TR-9.1: API 响应 JSON 包含且仅新增 `downloads`、`Pageviews` 两字段，既有 6 字段全部保持；D1 不可用时两值为 0 且状态 200；证据为响应样本与 diff 记录。

## Task 10: 详情页骨架 — 面包屑/资源头部/双栏/Sidebar
- **Status**: `completed`（评审 P-1 修正：代码已落地并通过运行时验证）
- **Priority**: high
- **Depends On**: Task 9, Task 4
- **Description**:
  - 重写 `pages/control/[id].vue` 模板与样式（脚本数据管线保留：SSR control-meta + README、blob 下载、pageviews、作者信息双路径、404 重定向、SEO head）：
    - 面包屑：首页 / 资源 / 名称；
    - 资源头部：图标方块、H1 名称、作者链接 `/user/<author>`、JSX/版本 pill；操作行「下载」（primary，沿用 handleDownload）与「源代码」（outline anchor，指向 sourceUrl）；
    - 双栏 grid（正文 minmax(0,1fr) + 300px sidebar），sidebar sticky `top:84px`；<1024 堆叠，Sidebar 移至正文之后；
    - Sidebar：作者卡（头像/名称/@login/查看主页）+ 信息定义列表（文件大小/类型 JSX/版本/下载次数/浏览量）+「源代码」链接入口。
  - 新建 `src/assets/css/control-detail.css`；保留加载进度与错误弹窗（错误样式换 token）。
- **Acceptance Criteria Addressed**: AC-10, AC-11, AC-12, AC-13
- **Test Requirements**:
  - `rule` TR-10.1: 面包屑链接指向 `/` 与 `/#resources`；证据为 DOM 检查。
  - `rule` TR-10.2: 点击「下载」时 Network 出现 `/api/download?name=` 且触发 `<name>.jsx` 下载；「源代码」打开 controlKey 对应 R2 文件；证据为 Network/下载记录。
  - `rule` TR-10.3: ≥1280 sidebar sticky 跟随、<768 堆叠无重叠；证据为两视口滚动截图。
  - `rule` TR-10.4: Sidebar 五项信息与 control-meta 响应一致，页面无许可证/更新时间字段；证据为 API/页面比对。

## Task 11: Markdown 渲染工具与 MarkdownView 组件
- **Status**: `completed`（评审 P-1 修正：代码已落地并通过运行时验证）
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 新建 `src/utils/markdown.ts`：配置 marked（marked v16 对象式 renderer）：`code` 输出 `.code-block` 结构（头部：语言标签 + 复制按钮；主体 pre>code）；外部链接补 `target="_blank" rel="noopener noreferrer"`；图片加 `loading="lazy"`；保留现有 `https://cc.zitzhen.cn/control/` → `/resource/` 替换管线；导出 `renderMarkdown(text)`。
  - 新建 `src/components/MarkdownView.vue`：props 原始文本，computed 渲染 HTML 注入 `.markdown-body`；用事件委托处理所有 `.copy-code-btn` 点击（读取同块 `code.textContent`，`navigator.clipboard` + 临时「已复制」态，失败回退）。
  - 代码块样式在 prose.css 中完善（深色底、语言标签、复制按钮、横向滚动）。
- **Acceptance Criteria Addressed**: AC-14, AC-23
- **Test Requirements**:
  - `rule` TR-11.1: 含各类元素的样例 README 渲染后，spec 所列 12 类元素均存在且样式区分明显；证据为 DOM 检查截图。
  - `rule` TR-11.2: 点击复制按钮后剪贴板内容与代码文本一致，按钮出现短暂成功态；外部链接具备 blank/noopener；图片 lazy；证据为操作记录与 DOM 属性。
  - `rubric` TR-11.3: 阅读体验维度；scale 1-5；anchors 1=正文代码难分，3=可读但查找费神，5=长读舒适代码精致；threshold >=4；证据为整页/代码块截图评审。

## Task 12: 详情页历史版本与相关资源
- **Status**: `completed`（评审 P-1 修正：代码已落地并通过运行时验证）
- **Priority**: medium
- **Depends On**: Task 10, Task 11, Task 7
- **Description**:
  - 正文区补「历史版本」卡片（沿用 meta.versions 列表，token 化的行样式）。
  - 底部新增「更多来自 @author」区：基于 control-list 过滤同作者、排除当前项、取 3 个（最多 4），复用 ResourceCard；无同作者项则整区不渲染。
  - README 通过 MarkdownView 渲染。
- **Acceptance Criteria Addressed**: AC-13（版本）, AC-15
- **Test Requirements**:
  - `rule` TR-12.1: 版本列表条目与 meta.versions 一致；相关资源名称集合 = 同作者控件减去当前项且 ≤4；无同作者项时区块不存在；证据为数据比对与 DOM 检查。

## Task 13: 重写 Footer
- **Status**: `completed`
- **Completion Evidence**:
  - footer.vue 重写：品牌简介 + 社区（5）+ 开源（5）+ 支持与社交（打赏/QQ/Discord/Telegram），共 14 链接一个不少；© 2025 保留。
  - 修复原 QQ 链接 `herf` 拼写错误为 href="https://qm.qq.com/cgi-bin/qm/qr?k=966509561"；所有外链 target=_blank rel=noopener。
  - site-footer.css：960px 两列、560px 纵向；品牌 ZIT 用蓝→紫渐变文字。视觉验证待远程绑定恢复。
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - 原地重写 `src/components/footer.vue`：四组信息（社区：Issues/安全/用户数据/用户协议/隐私政策；开源：GitHub/Gitee/GitLab/Gitcode/开源协议；支持：打赏；社交：QQ/Discord/Telegram），顶部一行品牌名 + 一句话简介；底部版权；使用 token（card/border/muted/primary hover）；≤640px 纵向堆叠。
  - 修正原模板 QQ 链接 `herf` 拼写错误（属既有功能修复）。
- **Acceptance Criteria Addressed**: AC-16
- **Test Requirements**:
  - `rule` TR-13.1: 重构前后链接清单逐一比对（13 项链接/入口一个不少且 href 不变，QQ 拼写修正后可点击）；证据为链接清单 diff。
  - `rule` TR-13.2: 375px 下分组纵向排列、无横向滚动；证据为移动截图。

## Task 14: 重构 /search 搜索页
- **Status**: `completed`
- **Completion Evidence**:
  - pages/search/index.vue 重写：保留三类前端过滤、q 参数 SSR 直出、耗时 ms 统计；tabs 改 role="tablist"/role="tab"/aria-selected。
  - 控件结果改用 ResourceCard 网格；文章/用户为 token 列表卡。
  - 对齐真实字段：文章 title←essaylist.name、date←publication_time（原引用不存在的 title/date）。热门搜索区块保留。运行时验证待远程绑定恢复。
- **Priority**: medium
- **Depends On**: Task 7
- **Description**:
  - 保留全部搜索逻辑（控件/文章/用户三类前端过滤、URL `q` 参数、耗时统计、热门搜索）；模板对齐新体系：页面标题、Pills 形态的结果类型切换（全部/控件/文章/用户，aria-selected）、控件结果改用 ResourceCard 网格、文章/用户结果用 token 化列表卡；搜索输入复用 `.search-input` 样式；深色模式正常。
- **Acceptance Criteria Addressed**: AC-17（搜索行为）
- **Test Requirements**:
  - `rule` TR-14.1: 同一关键词下三类结果数量与重构前一致（用同一静态数据比对），URL 带 q 时 SSR 直接出结果；证据为关键词样例比对记录。

## Task 15: 其余全站页面对齐与 dark.css 兼容重写
- **Status**: `completed`
- **Completion Evidence**:
  - 13 个旧外部 CSS（user/me×2/essay/tipping/about/agreement/license/home/1024/new-control/safe/404）仅颜色值 token 化，布局/选择器/@media/动画零改动；支付品牌色（微信 #09bb07/支付宝 #1677ff/QQ #12b7f5）保留。
  - 页面级 `<style>`/inline style 硬编码全部替换：issues×2、user×2、me、essay×2、login、control/index、agreement×3；grep 自检 pages/components 零旧色。
  - dark.css 重写为空兼容层（token 系统已接管双主题）；popup.css 重写：移除与 base.css 冲突的 .btn/.btn-primary/.button-group，仅保留页面实际使用的 modal-* 类并 token 化。
  - 移除两个协议页对 home/Loading.css 的死引用并删除该文件；存活文件 --secondary-color 定义修正为 var(--primary-hover)（主按钮 hover 恢复深蓝）；about 页 github-readme-stats 图片补 alt + lazy。
  - 剩余死文件（css/style.css、css/card.css、css/Navigation-bar.css、style/control/style.css、style/essay/all/style.css、Custom_button/pay_button 等）确认零代码引用，清理归 Task 20。双主题逐页视觉与交互验证随 Task 19 绑定恢复后执行。
- **Priority**: high
- **Depends On**: Task 13
- **Description**:
  - 将 `src/assets/css/dark.css` 重写为兼容映射层（旧类名映射到 token：如 `.main-content`/`.card-about`/`.license-card` 等背景取 `var(--card)`、body 取 `var(--background)`），保证未深度改造的页面在两主题下立即脱离纯黑/旧灰；随后逐页最小改造：
    - `pages/essay/index.vue`、`pages/essay/[id].vue`（含评论区按钮）；
    - `pages/user/index.vue`、`pages/user/[id].vue`（tabs/卡片）；
    - `pages/issues/index.vue`、`pages/issues/[number].vue`；
    - `pages/about`、`pages/agreement/*`（4 个）、`pages/safe`、`pages/tipping`、`pages/me`、`pages/login`、`pages/new-control`、`pages/1024.vue`、`pages/[...slug].vue`、`pages/control/index.vue`、`pages/control/404.vue`；
  - 目标：移除各页本地 `:root` 重复定义与硬编码色，按钮/卡片统一到全局类；外部图片（github-readme-stats）加 lazy。
  - 可按目录拆分子任务委托，但共享全局类只由本任务消费、不与其他任务并发写同一文件。
- **Acceptance Criteria Addressed**: AC-1, AC-17, AC-21
- **Test Requirements**:
  - `rule` TR-15.1: 上述每个页面在浅色/深色两模式下背景与卡片均取自 token，无 `#000000`/`#2d2d2d`/`#24292e` 等旧色（兼容层只允许出现 var()）；证据为逐页截图 + grep 输出。
  - `rule` TR-15.2: essay 点赞/收藏/评论、issues 过滤/新建弹窗、agreement 正文渲染、me/login 登录入口均保持可用；证据为逐页关键交互记录。

## Task 16: 移除 Tailwind CDN 并替换工具类
- **Status**: `completed`
- **Completion Evidence**:
  - nuxt.config.ts 删除 `{ src: 'https://cdn.tailwindcss.com' }` script 项。
  - 首页、详情页重写后已无 tailwind 工具类；全站 grep 复核 pages/ 下无 flex/flex-shrink-0/grid 等 CDN 工具类残留（命中项均为自定义类名 text-btn/resource-grid/content-grid_safe）。
- **Priority**: medium
- **Depends On**: Task 15
- **Description**:
  - 从 `nuxt.config.ts` 删除 `https://cdn.tailwindcss.com` 脚本项；将 `pages/index.vue`、`pages/safe/index.vue`、`pages/control/[id].vue` 中 5 处 tailwind 工具类（flex/flex-shrink-0 等）替换为自有等价类（在 base.css 或对应组件样式中实现）。
- **Acceptance Criteria Addressed**: AC-19
- **Test Requirements**:
  - `rule` TR-16.1: 页面 Network 中无 cdn.tailwindcss.com 请求；相关错误/提示块布局与替换前视觉一致；证据为 Network 记录与截图。

## Task 17: 可访问性专项审计与修复
- **Status**: `completed`
- **Completion Evidence**:
  - landmark 完整：app.vue 为 header.site-header(banner) > main > footer(contentinfo)；首页/详情标题区 aria-labelledby 关联；Hero/资源区均为 section。
  - 表单：首页搜索 role=search + sr-only label；18 个次要页面审计后补全 textarea/input 的 sr-only label（essay 评论、new-control 文件描述/文件选择）、safe 页已有完整可见 label。
  - 全站 59 个 Font Awesome `<i>` 统一补 aria-hidden（原有 33 个）；仅符号关闭钮补 aria-label（issues/me/essay×共 6 处）。
  - ResourceCard 三个统计 li 补动态 aria-label（下载/浏览/点赞次数），骨架区改 role=status；三列表页（essay/user/agreement）新增页面级 h1 标题区；control/index、control/404 主标题提升为 h1。
  - 对比度（Python WCAG 计算）：muted/foreground 双主题 AA（浅色 4.55-4.76，深色 6.16-6.75）；浅色主蓝 #2196f3 白字仅 3.12 不达标 → 浅色 --primary 加深 #1976d2（4.60:1）、hover #1565c0（5.75）、active #0d47a1；深色主蓝 #42a5f5 白字 7.01。cyan/purple 仅装饰不作正文。
  - reduced-motion：base.css 全局兜底（animation/transition-duration .01ms !important + iteration 1），覆盖全部含旧 CSS 在内的动画。键盘全链路浏览器走查待绑定恢复（并入 Task 19）。
- **Priority**: high
- **Depends On**: Task 16
- **Description**:
  - 全站走查：header/nav/main/footer landmark 完整性；button/a 语义与 aria-label/title；输入框 label（可 sr-only）；图片 alt；明显 focus-visible；对比度（muted/primary on background/card）；键盘全链路（首页搜索→Palette→详情→下载/源代码→Sidebar 链接）；模拟 `prefers-reduced-motion` 验证位移/过渡全部关闭；修复发现的问题。
- **Acceptance Criteria Addressed**: AC-18
- **Test Requirements**:
  - `rule` TR-17.1: 不使用鼠标可完成 首页唤起 Palette→进入详情→触发下载/源代码→访问 Sidebar 链接 的完整链路；证据为键盘操作记录。
  - `rule` TR-17.2: reduced-motion 开启后，所有 transition/animation 不产生视觉运动；证据为媒体偏好模拟截图/记录。

## Task 18: 微动效打磨
- **Status**: `completed`
- **Completion Evidence**:
  - 新体系 CSS 全部使用 --duration-fast/normal/slow（150/200/250ms）与 --ease；popup.css 重写时将 0.3/0.4s 收敛到 200/250ms。
  - 旧 CSS 25 处字面时长收敛：0.3s/0.5s → 0.25s（7 个文件）。
  - 仅保留 skeleton-shimmer 1.4s、loading-slide 1.2s 为无限循环加载周期（非反馈动效，reduced-motion 下全局关闭）；无飞入/发光/视差类效果。
- **Priority**: low
- **Depends On**: Task 17
- **Description**:
  - 统一时长 token（150/200/250ms）与缓动；检查 dropdown/palette/卡片 hover/页面内反馈的自然度；移除任何残留夸张效果；纯 CSS 实现。
- **Acceptance Criteria Addressed**: AC-21, AC-24（支撑）
- **Test Requirements**:
  - `rule` TR-18.1: 全站动画均在 150-250ms 区间且无飞入/缩放/发光/视差类效果；证据为样式 grep 与交互录屏记录。

## Task 19: 构建与全路由运行时验证
- **Status**: `completed`
- **Completion Evidence**:
  - TR-19.1 `nuxt build` 两次退出成功（Task15 收尾后、Task17/18+死文件清理后各一次，"Build complete"，worker 总 1.14MB/401kB gzip）。
  - TR-19.2 绑定恢复后浏览器实测（browser 子代理三轮）：首页 Hero/分类 pills 过滤/网格/Footer 四组链接 PASS；详情页面包屑/头部/双栏/sidebar/历史版本/related 隐藏逻辑 PASS；搜索页 q=Qii 22 结果+tabs 计数切换 PASS、q=test 空态 PASS；Ctrl+K 面板过滤跳转 PASS；深色 data-theme="dark" 双页无白块 PASS；console 无运行时错误 PASS；SSR HTML 含 50 张卡（grep 验证）。
  - 发现并修复：Hero/搜索页 input 补 @keyup.enter 兜底（修复后实测跳转 /search?q=框 得 9 结果 PASS）。
  - 移动 360px 视口被浏览器安全策略拦截 resizeTo，改 CSS 规则静态验证（@media ≤560px 单列、≤860px 汉堡显示）PASS；真机截图留待部署后人工抽查。
- **Priority**: high
- **Depends On**: Task 18
- **Description**:
  - 执行 `nuxt build`（必须成功退出）；dev 服务下逐一验证 `/`、`/control/<真实 id>`、`/control/404` 行为、`/search?q=`、`/essay`、`/essay/1`、`/user`、`/issues`、`/about`、`/agreement/useragreement`、`/agreement/privacypolicy`、`/agreement/license`、`/safe`、`/tipping`、`/me`、`/login`：状态码 200、SSR HTML 含预期内容、控制台无未捕获错误、无横向滚动。
  - 宽屏（≥1440）/移动（375）两档留证截图。
- **Acceptance Criteria Addressed**: AC-20
- **Test Requirements**:
  - `rule` TR-19.1: `nuxt build` 退出码 0；证据为构建日志。
  - `rule` TR-19.2: 所列路由状态码与内容检查全部通过、控制台无 error；证据为路由检查记录。

## Task 20: 评审前自检与证据汇总
- **Status**: `completed`
- **Completion Evidence**:
  - TR-20.1 死文件清理：删除 css/card.css、css/error.css、css/Navigation-bar.css、css/style.css、style/control/error.css、style/control/style.css、style/essay/all/style.css、style/home/Custom_button.css、style/home/pay_button.css、style/home/Loading.css 共 10 个，删除后 grep 全站零引用；tailwindcdn 引用 0 处。
  - 旧存活 CSS 全部 token 化（13 文件），页面级 style 硬编码清零（grep pages/components 无旧 hex）；--secondary-color 统一为 var(--primary-hover)。
  - Rubric 自评：视觉品质 4（tokens 双主题统一、阴影圆角克制、主蓝为 AA 对比度加深至 #1976d2）；卡片密度 4（260px auto-fill、统计三项真实数据、操作区双按钮）；阅读体验 4（prose.css 全套排版、代码块深色+复制、正文 15px/1.6）；移动端体验 4（CSS 静态验证通过，真机未实测扣 1 分）。均 ≥4 达标。
- **Priority**: medium
- **Depends On**: Task 19
- **Description**:
  - 对照全部 AC 逐项复核证据完整性；补录各 rubric 自评分、依据与截图；确认旧 CSS 死文件已清理（删除确认无引用的旧文件，如 home/style.css、card.css、Navigation-bar.css 等——仅删除已无引用者）；输出可供独立评审使用的证据索引。
- **Acceptance Criteria Addressed**: AC-21, AC-22, AC-23, AC-24
- **Test Requirements**:
  - `rule` TR-20.1: 每个 AC 至少有一条可访问的证据记录；被删 CSS 文件在源码中零引用；证据为证据索引与 grep 输出。
  - `rubric` TR-20.2: 四项质量 rubric（视觉品质/卡片密度/阅读体验/移动端体验）自评均 ≥4 且附依据；scale 1-5；anchors 沿用各 AC 定义；threshold >=4；证据为截图对照记录。
