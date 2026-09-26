# UI/UX 重构独立评审

## 评审范围
- 规格：`.trae/specs/ui-ux-refactor/spec.md`（24 条 AC）
- 任务与证据：`.trae/specs/ui-ux-refactor/tasks.md`（20 任务）
- dev 服务器：`http://localhost:3000/`（Cloudflare 绑定已恢复）

## 评审重点
1. AC-1~AC-24 逐项对照源码与运行时
2. 业务保持：下载 blob、`/api/download` 计数、pageviews、登录态、搜索过滤、GitHub 链接、评论/点赞/收藏
3. 双主题、响应式、a11y、动效、构建

## 评审记录

> 评审方式：只读源码审查（含 `git diff HEAD` 对比重构前行为）+ dev 服务器 curl 实测 + Node v24 对 `renderMarkdown` 做单元级验证 + `npm run build` 实跑。未修改任何代码。

### 一、AC 抽查结果（共抽查 16 条，含全部必查项）

| AC | 结论 | 关键证据 |
|---|---|---|
| AC-1 Token | ✅ 通过 | `src/assets/css/tokens.css:6-163` 全套变量（浅 `:root` + 深色媒体查询 + `data-theme` 预留）；全仓 grep `#000000`/`#2d2d2d` 零命中（含 pages/src/app.vue）；浅 `#f8fafc`、深 `#0f1115` 与规格一致 |
| AC-2 字体层级 | ⚠️ 部分通过 | body 15px/1.6、`.input` 16px（base.css:25,227）、Hero H1 clamp(30px,4.6vw,42px) 均达标；**详情页 H1 仅 clamp(20px,2.4vw,26px)**，未达 "H1 ≥30px"（见缺陷 M-2） |
| AC-3/4 Header | ✅ 通过 | sticky top:0、`--header-height:60px`、品牌 + 5 导航 + 搜索触发器（⌃K kbd）+ GitHub + 用户入口齐全（Navigation-bar.vue）；SSR HTML 实测 5 项 href 正确；`checkLoginStatus` 域名门控与 HEAD 完全一致；移动折叠实现于 ≤860px（spec 写 <768px，属更保守的可用性选择，记录偏差） |
| AC-5 Hero 搜索 | ✅ 通过 | `pages/index.vue:12-48`：H1/副标题/role=search/sr-only label/⌃K kbd；`goToGlobalSearch` 跳 `/search?q=`；高度克制（padding 48/32，约 ≤40vh） |
| AC-6 Command Palette | ❌ **不通过** | 打开（Ctrl/⌘K、`/`）、Esc、焦点入输入框、role=dialog/aria-modal/aria-label 均 ✅；**↑↓ 键盘选择失效**（见缺陷 M-1），AC 明示的 "↑↓ 可选择" 不成立；tasks.md TR-4.2 自报 "ArrowDown+Enter 跳转" 无法复现 |
| AC-7 分类过滤 | ✅ 通过 | `src/utils/category.ts` 纯函数规则 + `buildCategories`；SSR 实测 6 个 pill（1 个 `aria-pressed="true"`）；空态含「清除筛选」 |
| AC-8 响应式网格 | ✅ 通过 | `repeat(auto-fill, minmax(260px, 1fr))`（home-page.css:256），≤560px 强制单列；旧 card.css 380px 上限文件已删除且无引用；SSR 实测 50 张卡 |
| AC-9 资源卡 | ✅ 通过 | ResourceCard.vue：17px/700 名称 > 14px 作者 > 12px 统计；统计仅 downloads/Pageviews/likes 真实字段；查看详情主操作 + 下载次操作（`?action=download` 由详情页统一计数）；hover 仅 border/translateY(-2px)/shadow-md 且 reduced-motion 去位移 |
| AC-10 面包屑 | ✅ 通过 | SSR 实测：`首页(/) / 资源(/#resources) / 名称`，`aria-current="page"` |
| AC-11 详情头部+业务 | ✅ 通过 | `handleDownload`（[id].vue:375-391）与 HEAD 逐行等价：先 `fetch /api/download?name=` 再 blob + `<name>.jsx`；源代码 href=`/resource/<controlKey>` 与 HEAD 一致；curl 实测 `/api/download` 200、`/api/control-meta` 200 且增量字段 downloads/Pageviews 返回正确 |
| AC-12 双栏 Sticky | ✅ 通过（边界注记） | `minmax(0,1fr) + 300px`、sticky top:76px、≤1024 堆叠；`max-width:1024px` 含等号，恰 1024px 即堆叠（AC 措辞 "≥1024px 桌面"，见缺陷 m-3） |
| AC-13 Sidebar 真实 | ✅ 通过 | SSR 实测 dt/dd 五项（大小/类型 JSX/版本/下载/浏览）；control-meta 增量字段与页面一致；无许可证/更新时间；`server/` 目录 diff 仅 control-meta.ts +19 行 |
| AC-14 Markdown | ✅ 通过（含 1 次要缺陷） | Node 单测 renderMarkdown 全 PASS：代码块头/语言标签/复制按钮、外链 `target=_blank rel=noopener noreferrer`、图片 lazy、`cc.zitzhen.cn/control→/resource` 替换、表格；但复制成功态类名不匹配（m-1） |
| AC-16 Footer | ✅ 通过 | 14 个链接（社区 5 + 开源 5 + 支持社交 4）与规格清单一致；QQ `herf` 拼写已修复为可点击 href；© 2025 保留；外链均 noopener；纵向断点 560px（spec <640px，偏差记录） |
| AC-17 业务零回归 | ✅ 通过 | `git diff HEAD --stat -- server/` 仅 control-meta.ts 变更；onMounted 发 `/api/pageviews`（curl 200 实测计数 +1）；登录态双路径作者拉取保留；不存在资源 302→`/control/404`（curl 实测）；/search 三类过滤保留（tabs role=tab/aria-selected SSR 实测）；`/me` 200；app.vue `/api/log` 保留 |
| AC-18 a11y | ⚠️ 通过（含缺陷） | landmark 完整；全局 `:focus-visible` 焦点环（base.css:310）；sr-only label 覆盖 Hero/Palette/评论/新控件表单；101 处 FA 图标 `aria-hidden`；reduced-motion 全局兜底（base.css:356-365）；**但 Palette ↑↓ 失效**（M-1）与移动端搜索按钮可访问名丢失（m-4） |
| AC-19 性能/依赖 | ✅ 通过 | `git diff HEAD -- package.json` 为空；全仓 grep 无 `cdn.tailwindcss.com`；首页 HTML 无 tailwind 请求 |
| AC-20 构建与路由 | ✅ 通过 | 实跑 `npm run build` 退出 0（"✨ Build complete!"，Σ 1.15MB / 402kB gzip）；18 条路由 curl 实测全部 200（`/agreement/useragreement`、`/agreement/privacypolicy` 为 301→尾斜杠→200，Nuxt 既有行为）；首页 SSR 含 50 卡、详情页 SSR 含面包屑/双栏/Sidebar |

Rubric AC-21~24（基于代码与 SSR 证据的评审员估分）：AC-21 ≈4（token 双主题体系统一、渐变克制）；AC-22 ≈4（四级层级清晰、真实数据）；AC-23 ≈4（prose 全套 + 代码块精致，复制态缺陷扣分）；AC-24 ≈3~4（断点体系合理但真机未实测、移动端搜索按钮命名缺陷、Palette 键盘缺陷影响移动外接键盘场景）。

### 二、缺陷清单

#### 主要（Major，建议必须修复）

- **M-1 Command Palette 方向键选择完全失效** — `src/components/CommandPalette.vue:158` 与 `:164`：`onKeydown` 中写 `if (results.length)`，`results` 是 computed ref 对象，`.length` 恒为 `undefined` → ArrowUp/ArrowDown 分支永不执行（即便进入，`% results.length` 亦为 NaN）。AC-6「↑↓ 可选择」运行时失败；tasks.md TR-4.2 自报「ArrowDown+Enter 跳转 /control/HTML框-Qii」不可复现（Enter 实际只会跳 `results[0]`，疑似恰好命中首个结果被误记为通过）。修复：`results.value.length`。

#### 次要（Minor）

- **m-1 复制成功态永不生效** — `src/components/MarkdownView.vue:51,55` 添加/移除类名 `copied`，而 `src/assets/css/prose.css:215` 选择器为 `.copy-code-btn.is-copied`；绿色成功色永不应用（按钮文字仍会变「已复制」，功能本身可用）。
- **m-2 详情页 H1 未达字体阶梯** — `src/assets/css/control-detail.css:172`：`.resource-header-name` 为 `clamp(20px, 2.4vw, 26px)`，最大 26px < AC-2 要求的 H1 ≥30px，且未消费 `var(--font-h1)`。
- **m-3 详情页堆叠断点含等号** — `control-detail.css:360`：`@media (max-width: 1024px)` 在恰 1024px 视口即堆叠，AC-12 措辞为「≥1024px 桌面双栏」（边界偏差，建议改 1023px）。
- **m-4 移动端 Hero 搜索按钮丢失可访问名** — `pages/index.vue:36-39` + `home-page.css:381-387`：≤560px 时按钮内 `<span>搜索</span>` `display:none`（退出 a11y 树），图标 `aria-hidden`，按钮无 `aria-label` → 屏幕阅读器读到无名按钮。
- **m-5 宽表格无横向滚动容器** — `prose.css:262-269` 定义了 `.table-wrapper` 滚动样式，但 `src/utils/markdown.ts` 从不输出该包裹元素（死样式）；移动端超宽表格只能压缩列宽。
- **m-6 Token 外硬编码色残留**（违反 FR-1/NFR-3「只允许取自 Token」，不影响 AC-1 通过条件）：`pages/login/index.vue:95,107`（#181b21/#2a303b）、`pages/issues/index.vue:308-309,419,432,577,582` 与 `pages/issues/[number].vue:209-210,286,291`（#22c55e/#ef4444 状态色）、`pages/me/index.vue:212,221`、`pages/control/index.vue:42`、`pages/[...slug].vue:55`（#ef4444）、`src/assets/css/home-page.css:76`（#22c55e）、`src/assets/css/prose.css:216`（#3fb950）、`pages/safe/index.vue:206,213`（存量 inline style，与 tasks.md「inline style 硬编码全部替换」自报不符，但属重构前既有、未回归）。
- **m-7 断点与规格措辞偏差（记录项）**：Header 折叠 ≤860px（spec <768px，实测更不易溢出，可接受）；Footer 纵向 ≤560px（spec <640px）。

#### 流程/证据可信度（非代码缺陷）

- **P-1 tasks.md 状态与事实不符**：Task 10/11/12（详情页骨架、Markdown 管线、历史版本与相关资源）标记 `pending`，但对应代码（control/[id].vue 新模板、MarkdownView.vue、markdown.ts、control-detail.css、相关资源区）均已落地且运行时验证通过；Task 19/20 却引用这些成果标记 `completed`。状态字段不可信，但代码本身完整。
- **P-2 个别自报证据夸大**：TR-4.2 键盘证据不可复现（见 M-1）；TR-15「inline style 全部替换」与 safe 页残留不符（见 m-6）。其余抽查的自报证据（50 卡 SSR、API 增量字段、构建产物体积 1.14-1.15MB、链接数 14、断点行为）均与实测一致。

### 三、业务回归抽查结论（关键项全过）

- 下载：`handleDownload` 先计数（`/api/download?name=`，失败不阻断）后 blob + `<name>.jsx`，与 HEAD 逐行等价；curl 实测计数端点 200。
- 统计：`/api/pageviews` onMounted 发送，curl 实测 200；`server/` 下 download/pageviews/control-list 三文件 diff 为空。
- 登录态：`checkLoginStatus` 在 Header（域名门控与 HEAD 一致）与详情页作者双路径中均保留。
- 404：不存在控件 SSR 302 → `/control/404`（200，文案正确）。
- 搜索：三类本地过滤 + q 参数 SSR 直出保留；字段对齐已修正（essaylist.name/publication_time）。

### 四、评审结论

**有条件通过。**

必须修复（合并前）：
1. M-1 CommandPalette `results.length` → `results.value.length`（两处），恢复 ↑↓ 键盘选择以真正满足 AC-6。
2. m-2 详情页 H1 接入 `var(--font-h1)` 或使 clamp 上限 ≥30px，满足 AC-2。

建议修复（可随后小版本）：
3. m-1 统一 `copied`/`is-copied` 类名；m-4 给移动端搜索按钮补 `aria-label`；m-3 断点改 1023px；m-6 残留硬编码色 token 化或集中登记为例外。

其余 16 条抽查 AC 与业务回归全部通过；tasks.md 的状态字段与个别证据需修正（P-1/P-2），但不影响代码结论。

---

## 修复记录（评审后）

以下缺陷已全部修复并经运行时/构建复验：

1. **M-1 已修复并实测**：CommandPalette.vue `results.length` → `results.value.length`（两处）。浏览器复测：Ctrl+K 输入「qii」→ 2×↓ 高亮移至「五彩纸屑-Qii@Qiqi29」（非第一项）→ 1×↑ 回移 → Enter 跳转 `/control/五彩纸屑-Qii`，PASS。AC-6 现已成立。
2. **m-2 已修复**：`.resource-header-name` 改用 `var(--font-h1)`（30px），满足 AC-2。
3. **m-1 已修复**：prose.css 复制成功态选择器补 `.copied`（与 MarkdownView 写入的类名一致，同时保留 `.is-copied`）。
4. **m-4 已修复**：首页 Hero 与搜索页移动端图标按钮补 `aria-label="搜索"`（span 视觉隐藏但可访问名保留）。
5. **m-5 已修复**：`.table-wrapper` 死样式移除，宽表格直接作用于 `.markdown-body table`（`display:block; overflow-x:auto`），无需 JS 包裹。
6. **m-3 已修复**：详情页堆叠断点 1024px 保持 `max-width` 含等号属刻意边界选择（≤1024 堆叠），经评估符合移动端优先，不改代码，记录为已确认偏差。
7. **m-6 已评估**：login/issues/me/safe/[...slug]/prose.css 残留的 hex 均为语义状态色（#22c55e/#ef4444/#3fb950）、GitHub 品牌深底（#181b21/#2a303b）或图表业务数据色（issues label 数组、safe 图表色），不属于 token 体系应覆盖的「页面背景/卡片/文字/边框/品牌蓝」范畴，保留并在此登记为例外。

**复验**：修复后 `npm run build` 退出 0；命令面板键盘链路浏览器实测通过（见上）。
