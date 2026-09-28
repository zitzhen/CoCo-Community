# Git 仓库连接与控件自动同步到 R2

## 概要

为 CoCo-Community 增加「Git 仓库绑定 + 增量同步」能力：用户将自己的 GitHub 控件仓库（基于 `zitzhen/control-template` 模板）绑定到平台上的某个控件名，服务端把仓库中的合法版本文件（`information.json` + `control.jsx` + 根 `README.md`）增量复制到 R2。同步通过**预留的同步 API** 触发：用户可在网页手动触发，也可把 API 配到仓库的 GitHub Actions（push 时通知），实现"定期/自动同步"。

**已确认的决策**（来自用户）：
1. 定时机制：**本期不引入 Cloudflare Cron**，预留同步 API（支持 Bearer 密钥调用，供仓库 CI 通知触发）。
2. 控件名：**绑定仓库时用户自填**（一个仓库 = 一个控件，版本目录在仓库根下）。
3. 同步范围：**增量**——只同步 R2 中不存在的新版本，已存在版本不覆盖、不删除。

## 现状分析

- 控件数据流（[control-submit.ts](file:///home/oliver/CoCo-Community/server/api/control-submit.ts)）：multipart 表单 → 校验 → **先写 D1 `components` 表登记 → 再写 R2** `<name>/<version>/control.jsx`、`<name>/information.json`、`<name>/README.md` → 清 control-list 缓存。
- R2 目录约定：`<控件名>/information.json`（字段 `author` / `Current_version` / `Version_number_list`）、`<控件名>/<版本>/control.jsx`、`<控件名>/README.md`。
- 校验规则（[control-submit.ts#L8-L11](file:///home/oliver/CoCo-Community/server/api/control-submit.ts#L8-L11)）：`NAME_RE = /^[A-Za-z0-9一-鿿][A-Za-z0-9_一-鿿-]{0,63}$/`，`VERSION_RE = /^\d{1,4}(\.\d{1,4}){0,3}$/`，jsx ≤ 100 KiB，README ≤ 100 KiB。
- 模板仓库 `zitzhen/control-template` 结构：仓库根放 `README.md`（展示到社区）；每个版本一个顶层目录（如 `1.0.0/` 或 `v1.0.0/`），内含 `information.json` + `control.jsx`。模板 information.json 含 `Release_input` / `Current_version` / `author` / `Latest_submission_time` / `Version_number_list`。
- 登录鉴权模式（control-submit 同款）：Cookie 中 `token`（GitHub OAuth token）+ `maximum_lifespan`（JWT，密钥 `COCO_COMMUNITY_JWT`）双令牌，再用 token 调 `api.github.com/user` 校验 username 与 JWT payload 一致。
- Cloudflare 上下文：统一走 [cloudflare.ts](file:///home/oliver/CoCo-Community/server/utils/cloudflare.ts) 的 `getCloudflareContext(event)`（含 globalThis 兜底）。注意其 `R2Bucket` 接口**缺少 `put` 类型声明**（control-submit 靠 `@ts-nocheck` 绕过）。
- 部署形态：纯 Cloudflare Pages（`wrangler.toml` 无 `[triggers]`，Nitro preset `cloudflare_pages`）。本期保持不变。
- GitHub 工具：[github.ts](file:///home/oliver/CoCo-Community/server/utils/github.ts) 已有 `githubHeaders(token?)`（支持匿名）、`getGithubToken`、`assertAllowedOrigin`。
- D1 `components` 表远程 `size`/`author` 为 NOT NULL 无默认值，INSERT 必须显式提供（[经验教训]）。
- 前端：`pages/new-control/index.vue` 为上传表单页（含登录门禁、控件名可用性检查）；`pages/me/index.vue` 有设置区块。

## 方案设计

### 总体数据流

```
绑定:  用户登录 → 填写 [仓库 owner/repo + 分支 + 控件名]
       → 校验仓库归属(owner==当前用户)与结构 → 校验控件名可用/归属
       → 生成 sync_secret → 写 D1 github_sync_repos → (可选)立即首次同步

同步:  触发(Cookie 手动 / Bearer sync_secret 供 CI 预留)
       → 限流检查(60s) → GitHub API 拉 tree → 筛选合法版本目录
       → 过滤掉 R2 已存在版本 → [新控件: 先写 D1 components]
       → 逐版本下载文件写 R2 → 合并写 information.json → 覆盖写 README.md
       → 更新绑定记录同步状态 → 清列表缓存 → 返回明细
```

### D1 新表 `github_sync_repos`

```sql
CREATE TABLE IF NOT EXISTS github_sync_repos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  control_name TEXT NOT NULL UNIQUE,      -- R2 控件名（一个控件仅绑一个仓库）
  repo_owner TEXT NOT NULL,               -- GitHub 归属者 login（= 绑定人）
  repo_name TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  sync_secret TEXT NOT NULL,              -- CI 通知调用凭据（预留）
  created_at TEXT NOT NULL,
  last_synced_at TEXT,
  last_sync_status TEXT,                  -- ok / partial / failed / never
  last_sync_detail TEXT                   -- 最近一次同步的 JSON 摘要
);
```

本地初始化（与 CONTRIBUTING.md 现有方式一致）：
`npx wrangler d1 execute CoCo-Community --local --command "<上 SQL>"`，远程去掉 `--local`。

### 服务端新增文件

**1. `server/utils/auth.ts`（新）** — 提取 control-submit 的双令牌登录校验为 `requireGithubUser(event)`：成功返回 `{ login, token }`，失败直接返回 401 `Response`（`unauthenticated` / `server_configuration_error` / `invalid_session` / `invalid_github_token` / `username_mismatch`）。仅供本次新端点使用，**不改 control-submit**（最小改动）。

**2. `server/utils/github-sync.ts`（新）** — 核心逻辑，供 API handler 与未来其他触发方式复用：

- `parseRepoTree(tree)`：从 GitHub git tree（`GET /repos/{o}/{r}/git/trees/{branch}?recursive=1`）筛选合法版本目录：
  - 顶层目录名匹配 `/^v?(\d{1,4}(\.\d{1,4}){0,3})$/i`（容忍 `v` 前缀，版本号部分必须符合 VERSION_RE）；
  - 目录内存在 `information.json`（可解析为 JSON 对象）；
  - 目录内存在 `.jsx` 文件（优先 `control.jsx`，否则取第一个 `.jsx`；写入 R2 时统一命名 `control.jsx`）；
  - `.jsx` ≤ 100 KiB（用 tree 中的 blob size 预过滤）；
  - 不合法目录记录跳过原因，不阻断其他版本。
  - 根级 `README.md`（≤100 KiB）单独识别。
- `fetchRepoFile(owner, repo, ref, path, token?)`：优先 `raw.githubusercontent.com/{o}/{r}/{ref}/{path}` 下载内容；GitHub API 用 `githubHeaders(env.GITHUB_TOKEN)`（匿名兜底，env 可选新增 `GITHUB_TOKEN` 仅用于提升速率，文档说明）。
- `mergeInfo(existing, authorLogin, newVersions)`：合并 information.json——
  - `Version_number_list` = 旧列表 ∪ 新版本（去重，保留顺序）；
  - `Current_version` = 全部版本中语义最高者（复用 [control-resource.ts](file:///home/oliver/CoCo-Community/server/utils/control-resource.ts) 的版本比较思路，抽取 `pickHighestVersion(versions)` 到 github-sync.ts 内部实现）；
  - `author` = 绑定用户 login（以绑定者为准，防冒名）；
  - 其他字段（`Release_input`、`Latest_submission_time` 等）保留旧值。
- `syncRepo(env, binding, trigger)`：执行同步，返回 `{ added: [], skipped: [{version, reason}], readmeUpdated, info }`：
  1. 拉 tree → `parseRepoTree` → 得到候选版本；
  2. 对每个候选版本 `HEAD` 检查 R2 `${control}/${version}/control.jsx` 存在则跳过（增量语义）；
  3. **新控件**（R2 无 information.json 且 D1 无 components 行）：先 `INSERT INTO components (name, size, downloads, likes, collections, Pageviews, author)`（size 用最新 jsx 的 KiB 文本，author 用绑定者 login），失败即整体中止（遵循 D1 先 R2 后约束，防半截提交）；
  4. 逐版本下载并 `put` `${control}/${version}/control.jsx`（contentType `text/javascript; charset=utf-8`），单版本失败记入 skipped 不中断；
  5. 合并写 `<control>/information.json`（有新增版本才写）；
  6. 根 README.md 存在且 ≤100KiB → 覆盖写 `<control>/README.md`（README 不受增量限制，属仓库级内容）；
  7. 有新增版本时清 nitro `control-list` 缓存（复制 control-submit 的清缓存片段）；
  8. 更新 D1 绑定行 `last_synced_at / last_sync_status / last_sync_detail`。

**3. `server/api/github-sync/bind.post.ts`（新）**
- `requireGithubUser` 登录 → `assertAllowedOrigin` → `readBody` 取 `{ repo: "owner/name" 或 URL, branch?, controlName }`；
- 校验：`controlName` 过 NAME_RE；解析 repo（支持粘贴 GitHub URL）；
- `GET /repos/{owner}/{repo}`（匿名 + 可选 GITHUB_TOKEN）：仓库须**公开**且 `owner.login === 当前用户 login`（仅允许绑自己的仓库），否则 403 `repo_not_owned`；私有/不存在 → 404 `repo_not_accessible`；
- 拉 tree 预检：返回 `validVersions` 数量（0 个也允许绑定，响应中如实返回，由用户后续推代码再同步）；
- 控件名归属：R2 已有 `information.json` 且 `author` 与当前用户不一致（大小写不敏感比较）→ 409 `name_taken_by_other`；D1 已有该 control_name 绑定 → 409 `already_bound`；
- `sync_secret = crypto.randomUUID()`（ hex 无连字符拼接两个 UUID），写 D1；
- 响应 `{ ok, controlName, repo, branch, syncSecret, validVersions, syncEndpoint: "/api/github-sync/sync", exampleCurl }`。

**4. `server/api/github-sync/sync.post.ts`（新）** — 预留的核心同步 API，双鉴权：
- 方式 A（网页手动）：Cookie 双令牌，且 `repo_owner === 当前用户 login`；
- 方式 B（CI 通知，预留）：`Authorization: Bearer <sync_secret>`，按 secret 查绑定行；
- 入参：`{ controlName }` 或 `{ repo: "owner/name" }` 定位绑定行，未绑定 → 404 `not_bound`；
- 限流：`last_synced_at` 距今 < 60s → 429 `sync_too_frequent`（防 secret 泄露被刷）；
- 调 `syncRepo`，按结果更新状态（全部失败 → failed，部分成功 → partial，否则 ok），返回明细 JSON；
- 全部响应带 `Content-Type: application/json`。

**5. `server/api/github-sync/list.get.ts`（新）**：Cookie 登录 → 返回当前用户（`repo_owner = login`）的绑定列表（含 control_name、repo、branch、last_synced_at、last_sync_status、sync_secret——归属者可见，便于配置仓库 Secrets；风险可控：secret 仅能触发同步，不能注入内容）。

**6. `server/api/github-sync/unbind.post.ts`（新）**：Cookie 登录 + 归属校验 → 删除 D1 绑定行（不动 R2 数据）。

**7. `server/utils/cloudflare.ts`（改）**：`R2Bucket` 接口补 `put(key, value, options?): Promise<void>`；`CloudflareEnv` 加可选 `GITHUB_TOKEN?: string`。

### 前端新增/修改

**8. `pages/new-control/repo.vue`（新）** — 「从 Git 仓库导入」页，复用现有登录门禁模式（`checkLoginStatus`）：
- 表单：仓库地址（支持粘贴 URL）、分支（默认 main）、控件名（复用 `/api/control-meta` 防抖可用性检查逻辑）；
- 绑定成功后展示：`sync_secret`（一次性强提醒保存）、手动「立即同步」按钮、GitHub Actions 配置示例（workflow yml：push 时 `curl -X POST -H "Authorization: Bearer <secret>" https://cc.zitzhen.cn/api/github-sync/sync -d '{"controlName":"..."}'`）；
- 同步结果明细展示（新增/跳过版本及原因）；
- `useHead` 标题 `从 Git 仓库导入|ZIT-CoCo-Community`。

**9. `pages/new-control/index.vue`（改）**：侧栏「提交须知」下方或 hero 区加一行入口链接「也可以从 Git 仓库导入并自动同步 → /new-control/repo」（纯链接，不动表单逻辑）。

**10. `pages/me/index.vue`（改）**：设置 tab 增加「Git 仓库同步」区块：调 `/api/github-sync/list` 展示绑定（控件名 ⇄ 仓库、最近同步时间/状态），每行提供「立即同步」「解绑」按钮 + 「去绑定」入口链接。未绑定/未登录时优雅降级。

### 文档

**11. `docs/API.md`（改）**：新增 4 个接口章节（bind / sync / list / unbind），含 sync API 的 Bearer 调用方式与 GitHub Actions 示例（即"预留"说明）。

## 关键规则汇总

| 项 | 规则 |
|---|---|
| 合法版本目录 | 顶层目录 `v?X.Y.Z`，含可解析 `information.json` + 至少一个 `.jsx`（≤100KiB） |
| 增量语义 | R2 已存在 `${control}/${version}/control.jsx` → 跳过；不覆盖、不删除 |
| information.json | 版本列表取并集，`Current_version` 取语义最高，`author` 以绑定者 login 为准，其余字段保留旧值 |
| README | 仓库根 README.md 每次同步覆盖写（≤100KiB），不受增量限制 |
| LICENSE 等 | 本期不同步（现有站点渲染不消费） |
| 写入顺序 | 新控件：D1 components 登记在前，R2 在后（失败即中止） |
| 私有仓库 | 不支持（匿名 API 不可达即拒绝） |
| 限流 | 同一绑定 60s 内仅允许一次同步 |
| 缓存 | 有新增版本才清 `control-list` nitro 缓存 |

## 假设与决策记录

- 不引入 Cron / 不改 Pages 部署形态（用户决策：仓库侧通知 + 预留 API）。
- `sync_secret` 对归属者常显（可重新进入绑定详情查看），不提供重置功能（泄露时解绑重绑即可）。
- `GITHUB_TOKEN` 为可选服务端环境变量，仅用于提高 GitHub API 速率上限；不配置时匿名访问公共仓库。
- 绑定时不做"至少一个合法版本"的硬性要求（允许先绑空仓库）。
- 同步失败的单版本不阻断其他版本；整体状态区分 ok/partial/failed。
- 不做 GitHub Webhook（需 secret 管理与公网回调验签，超出"预留 API"范围）；Actions curl 已满足通知场景。

## 验证步骤

1. `npm run build` 通过。
2. 本地：`npx wrangler d1 execute CoCo-Community --local --command "CREATE TABLE ..."` 建表 → `npm run dev` → 登录后访问 `/new-control/repo`，用自己的模板仓库（如 `zitzhen/control-template` 的 fork，构造 `1.0.0/` 目录）完成绑定。
3. 手动触发同步 → 检查 R2 出现 `<control>/1.0.0/control.jsx`、`information.json`（author=本人）、`README.md`；首页/搜索可见新控件（缓存已清）。
4. 幂等：再次同步 → 版本全部 skipped，无重复写入。
5. 增量：仓库新增 `1.1.0/` → 同步后仅新增该版本；`Current_version` 变为 1.1.0。
6. 归属：用他人控件名绑定 → 409 `name_taken_by_other`；绑他人仓库 → 403 `repo_not_owned`。
7. Bearer：用 `sync_secret` curl 调 `/api/github-sync/sync` → 成功；错误 secret → 401；60s 内重复 → 429。
8. /me 设置区展示绑定列表，解绑后列表为空且 sync API 返回 `not_bound`。

## 部署清单

- 远程 D1 执行建表 SQL（见上）。
- （可选）Cloudflare Pages 环境变量加 `GITHUB_TOKEN`。
- 无需改 wrangler.toml、无需新密钥（`COCO_COMMUNITY_JWT` 复用）。
