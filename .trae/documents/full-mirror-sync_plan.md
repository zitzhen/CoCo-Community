# 仓库同步从「增量」改为「全量镜像」实施计划

## 背景与目标

现有 GitHub 仓库同步（[github-sync.ts](file:///home/oliver/CoCo-Community/server/utils/github-sync.ts)）只搬运版本目录内 `information.json` + `control.jsx` 及根 `README.md`，且 R2 已存在版本跳过。问题：README 中的图片（`./images/x.png` 等）不会被搬运到 R2，图片无法展示。

**目标**：同步改为**全量真镜像**——
1. 仓库内所有**允许类型**的文件（图片等）按原路径全量复制到 R2 `<控件名>/` 下，存在即覆盖，内容未变则跳过；
2. 仓库中已删除的文件从 R2 删除（**已确认：真镜像同步删除**），含安全保护阈值；
3. README 渲染时，相对图片地址重写为同源 `/resource/<控件名>/...`，图片经现有资源代理加载。

## 调研结论

- 控件详情页 [control/[id].vue#L74](file:///home/oliver/CoCo-Community/pages/control/%5Bid%5D.vue#L74) 用 [MarkdownView.vue](file:///home/oliver/CoCo-Community/src/components/MarkdownView.vue) 渲染 README；marked 自定义 image renderer（[markdown.ts#L52-L59](file:///home/oliver/CoCo-Community/src/utils/markdown.ts#L52-L59)）原样保留 `token.href`。页面 URL 为 `/control/<name>`，相对路径图片必然 404，必须在渲染器重写到 `/resource/`。
- 资源代理 [resource/[...path].ts](file:///home/oliver/CoCo-Community/server/routes/resource/%5B...path%5D.ts) 已支持 png/jpg/jpeg/gif/svg 等 Content-Type；R2 binding 操作不占 Worker 子请求额度。
- 消毒出口 [sanitize.ts](file:///home/oliver/CoCo-Community/src/utils/sanitize.ts) 允许 `img src`，`/resource/...` 相对协议可通过（无 scheme，不被拦）。
- Cloudflare Workers 原生支持 `DecompressionStream('gzip')`；GitHub 提供整仓 tarball 下载（`api.github.com/repos/{o}/{r}/tarball/{branch}` → 302 自动跟随）。**1 次 tree API + 1 次 tarball 下载即可拿到全部文件**，避免逐文件 raw 下载的子请求上限（免费 50/付费 1000）。
- tar 格式简单（512 字节头），GitHub tarball 长路径使用 PAX('x')/GNU('L') 扩展头，需在解析器中支持。
- `R2Bucket` 类型（[cloudflare.ts#L31-L43](file:///home/oliver/CoCo-Community/server/utils/cloudflare.ts#L31-L43)）还缺 `delete`。

## 文件与改动

### 1. 新增 `server/utils/mime.ts`
- 导出 `CONTENT_TYPES: Record<string,string>`（在现有资源代理 12 种基础上补 `.webp .bmp .ico .woff .woff2 .ttf .otf .eot .webm .txt .css .xml .yml .yaml .ts .mjs .cjs .markdown`）。
- 导出 `mimeOf(key)` 与白名单判断 `isAllowedRepoPath(path)`：
  - 允许扩展名见上；无扩展名仅允许文件名 `LICENSE/LICENCE/COPYING/NOTICE`（不区分大小写）。
  - 点开头的顶层目录/文件（`.github/`、`.gitignore` 等仓库管道文件）归为 `ignored`（静默跳过，不报错）。
  - `.html/.htm/.xhtml` 等可执行为活动页面的类型拒绝（`file_type_not_allowed`）。

### 2. 改 `server/utils/cloudflare.ts`
- `R2Bucket` 增加 `delete(keys: string[]): Promise<void>`。

### 3. 重写 `server/utils/github-sync.ts` 核心（保留 `@ts-nocheck`、`RepoBinding`、`parseRepoTree`、`recordSyncResult` 导出）
新增：
- `parseTar(buffer: ArrayBuffer)`：纯函数 tar 解析器（无依赖）——支持 ustar prefix/name、GNU `L` 长名、PAX `x`/`g` 的 `path=`/`linkpath=`；跳过目录/硬链接/软链接条目；返回 `{ path, size, data }[]`，路径已剥离 tarball 顶层 `{owner}-{repo}-{sha}/` 段。
- `mirrorRepo(env, binding)`：
  1. 拉 tree（拿 blob sha/size 映射，同时得到版本候选——复用 `parseRepoTree` 的版本目录识别）；
  2. 下载 tarball → `DecompressionStream('gzip')` 解压（限总解压 ≤ **25 MiB**、文件数 ≤ **500**，超限截断并告警）→ `parseTar`；
  3. 文件分级：点文件 → ignored；非白名单 → skipped(`file_type_not_allowed`)；白名单文件大小校验：jsx/readme ≤ 100 KiB（维持现状），其他文件 ≤ **5 MiB**，超限 skipped；
  4. 新控件：R2 无 information.json 且 D1 无 components 行 → **先 INSERT D1 components**（size 取最高版本 jsx，author=绑定者），失败整体中止（维持现有 D1-first 约束）；
  5. 逐文件与 R2 现状比对（`onlyMetadata` 头，读 `customMetadata.gh_sha`）：sha 相同 → unchanged；不同/新增 → `put`（httpMetadata contentType 取 mimeOf；customMetadata 存 `gh_sha`），单文件失败进 skipped 不中断；
  6. 合并写根 `<control>/information.json`：版本列表 = 仓库版本目录 ∪ 旧列表（去重），`Current_version` 取语义最高，`author`=绑定者，其他字段保留旧值（逻辑同现状）；
  7. **镜像删除（仅在步骤 5 全部 put 无错误后执行）**：列举 R2 `${control}/` 全部 key → 路径不在仓库文件集合中的进删除候选；
     - **保护规则**：删除数占现存 key 比例 > **30%** → 放弃删除，warnings 加 `deletion_aborted_threshold`（本次状态记 partial，写入仍有效）；
     - **历史版本豁免**：仓库中不存在的版本目录（`<v?>X.Y.Z/` 整目录）整体豁免（保护绑定前手动上传的历史版本），其余仓库版本目录内缺失的文件照删；
     - 通过后 `delete` 批量删除。
  8. 清 `control-list` nitro 缓存（有任何文件变更才清，逻辑同现状）。
- 新结果结构：
```ts
{ status: 'ok'|'partial'|'failed',
  filesSynced: string[],   // 新增/覆盖的路径
  unchanged: number,
  ignored: number,
  skipped: { path: string, reason: string }[],
  deleted: string[],
  versions: { added: string[], all: string[] },
  currentVersion: string,
  warnings: string[],
  error?: string }
```

### 4. 改 `server/api/github-sync/bind.post.ts`
- 预检改为报告 `totalFiles`（tree blob 总数）+ `validVersions`（现状字段保留）；绑定仍允许空仓库。

### 5. 改 `server/api/github-sync/sync.post.ts`
- 透传新结果字段（鉴权/限流 60s/双鉴权不变）；warnings 非空时 status 200 但 `ok` 字段如实反映。

### 6. 改 `server/routes/resource/[...path].ts`
- Content-Type 改用 `mimeOf()`（删本地 FALLBACK_TYPES，统一到 mime.ts）；
- `.svg` 响应增加 `Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'`（防直开 SVG 执行脚本）；全部响应加 `X-Content-Type-Options: nosniff`。

### 7. 改 `src/utils/markdown.ts`
- `renderMarkdown(markdown, resourceBase?)`：image renderer 中，绝对协议（`/^[a-z][a-z0-9+.-]*:/i`、`//`、`data:`）保留；相对地址用 `new URL(href, 'https://local' + resourceBase).pathname` 解析（resourceBase 形如 `/resource/小圳控件/`，含尾斜杠；未传则保持原样）。

### 8. 改 `src/components/MarkdownView.vue`
- 增加可选 prop `resourceBase: String`，透传给 `renderMarkdown`。

### 9. 改 `pages/control/[id].vue`
- `<MarkdownView :resource-base="`/resource/${id}/`" />`（两处仅一个实例）。

### 10. 改前端展示
- [pages/new-control/repo.vue](file:///home/oliver/CoCo-Community/pages/new-control/repo.vue)：同步结果区改为展示「同步 N 文件 · 未变 N · 删除 N · 跳过 N」+ skipped/deleted 明细；文案把「版本」表述泛化。
- [pages/me/index.vue](file:///home/oliver/CoCo-Community/pages/me/index.vue)：同步成功提示改为基于 `filesSynced.length`（如「同步完成：新增/更新 N 个文件，删除 M 个文件」）。

### 11. 改 `docs/API.md`
- 第 8 章语义从「增量」改为「全量真镜像」：同步文件白名单与大小上限（jsx/readme 100 KiB、其他 5 MiB、总量 25 MiB/500 文件）、30% 删除保护、历史版本豁免、新结果字段示例。

## 依赖顺序

1 → 2 → 3（核心）→ 6/7/8/9（展示链路）→ 4/5（接口接线）→ 10（前端文案）→ 11（文档）→ 验证。

## 验证

1. `npm run build` 通过。
2. **tar 解析器实证**：用 node24（type stripping）写 /tmp 临时脚本，import 实际 `server/utils/github-sync.ts` 的 `parseTar`，对真实下载的 control-template 及一个含深层目录/长路径/图片的 fork tarball 解压，断言文件路径与大小与 `tar tz` 列表一致（脚本放 /tmp，不污染仓库）。
3. dev server 冒烟：4 端点路由可达、未登录 401、错误 secret 401（与现有行为一致；无 CLOUDFLARE_API_TOKEN 时本地 bindings 不可用属已知环境限制）。
4. 逻辑走查（生产部署后由用户验证）：带图片 README 的仓库同步 → 详情页图片经 `/resource/` 正常加载；二次同步全 unchanged；仓库删图后同步 → 该图从 R2 删除且 30% 阈值可阻断异常批量删除；非白名单类型（.html）被跳过并返回原因。

## 风险与处理

- **CPU/时长**：25 MiB gzip 解压 + tar 解析在边缘有 CPU 开销；上限已限定，且多数控件仓库很小；超限截断告警不报错。
- **误删除**：30% 阈值 + 仅全 put 成功后执行 + 历史版本整目录豁免，三层保护。
- **SVG 脚本**：资源代理对 SVG 加 CSP，直开不执行脚本。
- **非白名单类型**：.html 等拒绝搬运并在响应中明示，避免同源 HTML XSS。
- 不新增环境变量；无需改 wrangler.toml。
