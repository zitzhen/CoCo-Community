# API 接口文档

> 本文档以仓库 `server/` 目录中的**实际实现**为准，最后核对时间：2026-09-27。
> 接口变更时请同步更新本文档（见 [CONTRIBUTING.md](../CONTRIBUTING.md)）。

## 目录

- [1. 通用说明](#1-通用说明)
- [2. 环境变量与资源绑定](#2-环境变量与资源绑定)
- [3. 认证](#3-认证)
- [4. 控件（R2 + D1）](#4-控件r2--d1)
- [5. 文章与评论](#5-文章与评论)
- [6. 用户](#6-用户)
- [7. GitHub 代理](#7-github-代理)
- [8. 日志](#8-日志)
- [9. 数据模型附录](#9-数据模型附录)

---

## 1. 通用说明

### Base URL

| 环境 | 地址 |
| --- | --- |
| 生产 | `https://cc.zitzhen.cn` |
| Cloudflare Pages 预览 | `https://<branch>.<project>.pages.dev` |
| 本地开发 | `http://localhost:3000` |

接口全部为同源调用（前端使用相对路径），无独立 API 域名。

### 鉴权模型

采用 **GitHub OAuth + 双 Cookie 令牌**：

| Cookie | 内容 | 属性 | 有效期 |
| --- | --- | --- | --- |
| `token` | GitHub OAuth access token | `HttpOnly; Secure; SameSite=Lax` | 7 天；登录满 2 天后访问 `/api/me` 会滑动续期 3 天 |
| `maximum_lifespan` | HS256 JWT，载荷 `{ username, time, max_exp }` | 同上 | 30 天 |

需要登录的接口会：

1. 校验 JWT 签名（密钥 `COCO_COMMUNITY_JWT`，文章点赞/收藏接口使用 `COCO_COMMUNITY_JWT_P`）
2. 用 `token` 请求 `https://api.github.com/user`
3. 要求 JWT 中的 `username` 与 GitHub 返回的 `login` 完全一致

未登录时相关接口返回 `401 {"authenticated":false}` 或对应错误码。

### Origin 白名单

GitHub 代理、昵称更新接口通过 `server/utils/github.ts` 的 `assertAllowedOrigin` 校验 `Origin` / `Referer`：

- `https://cc.zitzhen.cn`
- `https://*.pages.dev`（Cloudflare Pages 预览部署，仅 HTTPS）
- `localhost`、`127.0.0.1`、`*.test`（任意端口、任意协议）

### 响应约定

- JSON 响应均带 `Content-Type: application/json`
- 计数类老接口（`/api/download`、`/api/pageviews*`）返回 `text/plain`
- 错误响应形如 `{ "error": "错误码" }` 或 `{ "status": "error", "message": "..." }`
- 列表类接口有 5 分钟边缘缓存（`defineCachedEventHandler`），`npm run dev` 开发环境自动绕过

### GitHub API 速率限制

- 未认证调用 GitHub API：60 次/小时/出口 IP
- 携带用户 token：5000 次/小时/用户
- `/api/me` 会透传 `X-RateLimit-*` 中的剩余额度

---

## 2. 环境变量与资源绑定

### Secrets（Cloudflare 后台 / 本地 `.dev.vars`）

| 变量 | 使用方 | 说明 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | `/auth/github` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | `/auth/github` | GitHub OAuth App Client Secret |
| `COCO_COMMUNITY_JWT` | `/auth/github`、`/api/me`、`/api/control-submit`、`/api/essay/like`、`/api/essay/collect`、`/api/update_nickname` | JWT HS256 对称密钥（全站统一） |
| `COCO_COMMUNITY_JWT_P` | 仅作为点赞/收藏接口的**历史回退** | 已废弃，新环境无需配置；配置时仅在主变量缺失时生效 |

### wrangler.toml 绑定

| 绑定 | 类型 | 名称 |
| --- | --- | --- |
| `DB` | D1 | `CoCo-Community` |
| `RESOURCES` | R2 | `coco-community`（本地 `remote = true`） |

---

## 3. 认证

### 3.1 GitHub OAuth 回调

```
GET /auth/github?code={code}&client=web
```

OAuth 授权码换 token 的回调端点。前端登录页将用户引导至 GitHub 授权页，GitHub 携带 `code` 跳回本端点。

**Query 参数**

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `code` | 是 | GitHub 授权码 |
| `client` | 否 | `web`（默认）/ `mobile`；也可用请求头 `X-Client: mobile` |

**Web 流程成功响应**：`302`，`Location: /`，并设置两枚 `Set-Cookie`（`token`、`maximum_lifespan`）。

**Mobile 流程成功响应**（`client=mobile`）：`200`

```json
{
  "access_token": "ghu_xxx",
  "jwt": "eyJ...",
  "username": "Iamliuxiaozhen",
  "expires_in": 2592000
}
```

**错误**

| 状态码 | error | 触发条件 |
| --- | --- | --- |
| 400 | `missing_code` | 缺少 code |
| 401 | `no_token` | 换取 token 失败（含 `missing_env` 字段提示缺失的环境变量） |
| 500 | `server_configuration_error` | 未配置 `COCO_COMMUNITY_JWT` |
| 500 | `server_error` | 其他异常（含 message） |

### 3.2 当前登录用户

```
GET /api/me
```

**认证**：双 Cookie。成功：`200`，`Cache-Control: no-store`

```json
{
  "authenticated": true,
  "user": {
    "id": 149680880,
    "login": "Iamliuxiaozhen",
    "name": "刘小圳",
    "avatar_url": "https://avatars.githubusercontent.com/u/...",
    "html_url": "https://github.com/Iamliuxiaozhen"
  },
  "rateLimit": { "remaining": 4999, "limit": 5000, "reset": 1790000000 }
}
```

副作用：JWT 内登录时间早于 2 天时，通过 `Set-Cookie` 把 `token` 滑动续期 3 天；`maximum_lifespan` 缺失会清除 `token` Cookie 并返回 401。

**错误**：401（`authenticated:false` / `maximum_lifespan_token_missing` / `invalid_maximum_lifespan_token` / `username_mismatch`）、500 `server_configuration_error` / `server_error`。

### 3.3 登出

```
GET /api/logout
```

无认证要求。清除当前域下请求携带的**所有** Cookie（含 Host / 带点前缀 Domain 三种 Set-Cookie）。成功：`200 {"status":"ok"}`，`Cache-Control: no-store`。

---

## 4. 控件（R2 + D1）

R2 是控件本体与元信息的真实来源；D1 `components` 表只存计数。目录结构见 [9.1](#91-r2-布局)。

### 4.1 控件列表

```
GET /api/control-list
```

**认证**：无。**缓存**：5 分钟（dev 绕过）。枚举 R2 顶层目录，逐个读取 `information.json` 并解析实际 `.jsx` 文件大小，合并 D1 计数。

**200**

```json
{
  "list": [
    {
      "id": 1,
      "name": "小圳邮件",
      "size": "2.34 KiB",
      "downloads": 12,
      "likes": 0,
      "collections": 0,
      "author": "iamliuxiaozhen",
      "Pageviews": 100
    }
  ]
}
```

字段说明：`size` 为字符串（KiB，实时读 R2；D1 不可用时列表仍正常）；`downloads / likes / collections / Pageviews` 来自 D1，缺失时为 `0`；`author` 缺失时为空字符串。

**错误**：500 `{ "error": "Failed to load controls from R2", "details": "..." }`。

### 4.2 控件元信息

```
GET /api/control-meta?name={name}
```

**认证**：无。读取 `<name>/information.json` 并解析实际控件文件 R2 key（容忍版本目录名/文件名与信息文件不一致）。

**200**

```json
{
  "name": "小圳邮件",
  "author": "iamliuxiaozhen",
  "currentVersion": "1.0.0",
  "versions": ["1.0.0"],
  "controlKey": "小圳邮件/1.0.0/control.jsx",
  "size": 2396,
  "downloads": 12,
  "Pageviews": 100
}
```

`size` 此处为**字节数**（number，取不到时为 null）；`controlKey` 可能为 `null`（桶内无任何 `.jsx`）。

**错误**：400 `Missing name`；404 `{ "error": "Control not found", "name": "..." }`。

### 4.3 提交控件

```
POST /api/control-submit
Content-Type: multipart/form-data
```

**认证**：双 Cookie（与 `/api/me` 相同校验链）。

**表单字段**

| 字段 | 必填 | 规则 |
| --- | --- | --- |
| `name` | 是 | `/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/` |
| `version` | 是 | `/^\d{1,4}(\.\d{1,4}){0,3}$/`（如 `1`、`1.2`、`1.0.0`） |
| `file` | 是 | 文件名以 `.jsx` 结尾，≤ 100 KiB |
| `readme` | 否 | Markdown 文本，≤ 100 KiB，空白内容不落盘 |

**写入逻辑**：先写 D1 计数行（失败直接 500，此时 R2 未被触碰），再写 R2：

- 新控件：`<name>/<version>/control.jsx`、`<name>/information.json`（有 readme 时再加 `<name>/README.md`）
- 已有控件：仅原作者可发新版本（`author` 为空的历史数据允许首次提交者认领）；合并版本列表并更新 `Current_version`，覆盖 `information.json` / `README.md`

成功后会清理 `/api/control-list` 的服务端缓存。

**200**

```json
{ "ok": true, "name": "MyControl", "version": "1.0.0", "existing": false }
```

**错误码**

| 状态码 | error | 说明 |
| --- | --- | --- |
| 400 | `invalid_form` / `invalid_name` / `invalid_version` / `missing_file` / `invalid_file_type` | 表单或字段不合法 |
| 401 | `unauthenticated` / `invalid_session` / `invalid_github_token` / `username_mismatch` | 登录态问题 |
| 403 | `name_taken_by_other` | 控件名已被其他作者占用 |
| 409 | `control_info_corrupted` | R2 上的 information.json 无法解析 |
| 413 | `file_too_large` / `readme_too_large` | 超过 100 KiB |
| 500 | `counter_register_failed` / `server_configuration_error` / `server_error` | D1 登记失败 / 密钥缺失 / 其他异常 |

### 4.4 累计下载量

```
GET /api/download?name={name}
```

无认证。将 D1 `components.downloads` +1，返回 `text/plain`：`Updated 'x' downloads to N`。计数行缺失时自动自愈：R2 上存在该控件则补建行并计 1；不存在返回 404 `Component 'x' not found`。400：`Missing 'name' parameter`。

> 该接口**只负责计数**；文件本体通过 `/resource/{controlKey}` 获取（前端先调 `/api/control-meta` 拿到 key）。

### 4.5 累计控件浏览量

```
GET /api/pageviews?name={name}
```

行为与 4.4 完全相同，自增字段为 D1 `components.Pageviews`。

### 4.6 R2 同源资源代理

```
GET /resource/{key}
```

**认证**：无。按 key 从 R2 读取对象并流式返回，绕开浏览器直连 R2 的 CORS 限制。

- `Cache-Control: public, max-age=3600`
- Content-Type 优先取对象元数据，其次按扩展名兜底（`.json/.md/.jsx/.js/.png/.jpg/.jpeg/.gif/.svg/.mp3/.mp4`），未知类型为 `application/octet-stream`
- key 需 URL 编码；400 `Missing resource key`；404 `Resource not found: {key}`

---

## 5. 文章与评论

### 5.1 文章列表

```
GET /api/essay-list
```

**认证**：无。**缓存**：5 分钟（dev 绕过）。

**200**

```json
{
  "list": [
    {
      "id": 1,
      "name": "文章名",
      "author": "Iamliuxiaozhen",
      "publication_time": "2026-09-01T08:00:00.000Z",
      "content": "Markdown 全文……",
      "pageviews": 100,
      "Like": 5,
      "collect": 2
    }
  ]
}
```

> 注意：列表响应包含每篇文章的 `content` 全文；字段名 `Like` 为大写（SQL 保留字）。

### 5.2 累计文章浏览量

```
GET /api/pageviews_essay?name={文章名}
```

按文章 **name**（不是 id）自增 `essay.pageviews`。200 返回 `Updated 'x' pageviews to N`（text/plain）；404 `Essay 'x' not found`；400 缺参。

### 5.3 获取文章评论

```
GET /api/fetch-comment-essay?EssayID={id}
```

**认证**：无。支持 `OPTIONS` 预检；对本地开发源（`localhost:5173`、`coco-community.test:5173` 等）回显具体 Origin，无 Origin 头时为 `*`。

**200**

```json
{
  "status": "success",
  "message": "comment retrieved successfully",
  "data": {
    "essayId": 1,
    "count": 2,
    "comment": [
      {
        "id": 10,
        "username": "Iamliuxiaozhen",
        "content": "评论内容",
        "time": "2026-09-26T10:00:00.000Z",
        "essayid": 1,
        "nickname": "刘小圳",
        "avatar": "https://.../avatar.png"
      }
    ]
  }
}
```

`nickname` / `avatar` 由服务端按 username 关联 `user` 表补充，查不到时回退为用户名与 `/images/user.png`。评论按 `time DESC` 排序。400（缺参/非整数）、405（非 GET）、500。

> 评论者 IP 仅在发表时写入 `comment` 表供内部审计，查询接口不返回该字段。

### 5.4 发表文章评论

```
POST /api/comment-essay
Content-Type: application/json
```

**认证**：仅需 `token` Cookie（调 GitHub `/user` 验证，不校验 JWT）。

**请求体**

```json
{ "EssayID": 1, "content": "评论内容（必填，trim 后 ≤ 1000 字符）" }
```

**200**

```json
{
  "status": "success",
  "message": "Comment added successfully",
  "data": {
    "id": 1,
    "username": "Iamliuxiaozhen",
    "content": "评论内容",
    "time": "2026-09-26T10:00:00.000Z",
    "essayid": 1
  }
}
```

错误：405（非 POST）、400（缺字段 / `EssayID` 非整数 / content 空或超长）、401（无 token / GitHub 校验失败）、500。

### 5.5 点赞文章

```
GET /api/essay/like?EssayID={id}
```

**认证**：双 Cookie（JWT 密钥为 `COCO_COMMUNITY_JWT`，并校验用户名一致）。CORS 为 `*`。

- 200 `{ "status": "success", "message": "Essay liked successfully" }`
- 400 `Essay already liked by this user`（重复点赞）
- 400 参数缺失/非整数；401 认证失败；404 文章不存在；405 非 GET；500

写入表 `essay_like(username, essayid, time)`，唯一去重粒度为「用户 + 文章」。

### 5.6 收藏文章

```
GET /api/essay/collect?EssayID={id}
```

与 5.5 完全一致，写入表 `essay_collect(username, essayid, time)`，成功消息为 `Essay collected successfully`，重复收藏返回 400 `Essay already collected by this user`。

---

## 6. 用户

### 6.1 用户列表

```
GET /api/user-list
```

**认证**：无。**缓存**：5 分钟（dev 绕过）。

**200**

```json
{
  "list": [
    {
      "username": "Iamliuxiaozhen",
      "nickname": "刘小圳",
      "number_of_controls": 1,
      "avatar": "https://.../avatar.png",
      "bio": "……",
      "pageviews": 30
    }
  ]
}
```

### 6.2 查询单个用户（原始 D1 结果）

```
GET /api/user?username={login}
```

**认证**：无（但仅接受 GET）。直接返回 D1 `.all()` 的完整结果对象：

```json
{
  "results": [ { "username": "Iamliuxiaozhen", "nickname": "……" } ],
  "success": true,
  "meta": {}
}
```

用户不存在时 `results` 为空数组（仍为 200）。400 缺参；405 非 GET；500 `Database query failed`。

### 6.3 累计用户主页浏览量

```
GET /api/pageviews_user?username={login}
```

自增 `user.pageviews`。200 返回 text/plain `Updated 'x' pageviews to N`；404 `Component 'x' not found`（历史文案）；400 缺参。

### 6.4 更新昵称

```
POST /api/update_nickname
Content-Type: application/json
```

**认证 / 来源**：双 Cookie（与 `/api/me` 相同校验链）+ Origin/Referer 白名单（见 1.3）。用户名**一律取自登录态**，请求体中的 username 会被忽略，无法修改他人昵称。

请求体：

```json
{ "nickname": "新昵称（trim 后 1-32 字符）" }
```

行为：`user` 表中已有记录则更新，无记录则插入新行（`avatar` 取 GitHub 头像，其余计数字段为 0）。

**200**

```json
{ "success": true, "data": { "username": "Iamliuxiaozhen", "nickname": "新昵称" } }
```

错误：400 `invalid_json` / `invalid_nickname`；401 `unauthenticated` / `invalid_session` / `invalid_github_token` / `username_mismatch`；403 来源不在白名单；405 非 POST；500 `server_configuration_error` / `database_error`。

---

## 7. GitHub 代理

这组接口在服务端转发 GitHub API，受 1.3 的 Origin 白名单保护，白名单外返回 403 `{ "error": "Forbidden: Invalid origin" }`。

**鉴权规则**：

- `GET`（读公开数据）：**允许匿名**——Cookie 中有 token 时携带（5000 次/小时），无 token 时省略 Authorization 走 GitHub 公共 API（60 次/小时/IP）；上游失败透传 GitHub 状态码与 `details`
  - 列表接口对**匿名用户只返回第一页**（open/closed 各前 100 条，共最多 2 次上游请求），响应头带 `X-List-Truncated: true`；登录用户不受限，拉取全量（响应头 `X-List-Truncated: false`）
- `POST`（创建 issue / 评论）：**必须登录**，无有效 token 返回 401 `{ "authenticated": false }`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/github/issues` | 登录用户：分页拉取 open + closed 全量议题（100 条/页，最多 10 页），过滤 PR 后合并；匿名用户：仅第一页（每状态前 100 条，`X-List-Truncated: true`） |
| POST | `/api/github/issues` | 代登录用户创建议题，见 [7.1](#71-创建议题) |
| GET | `/api/github/issues/{number}` | 单个议题；number 命中 PR 时返回 404 `{ "error": "Not an issue (pull request)" }` |
| GET | `/api/github/issues/{number}/comments` | 议题评论的 GitHub 原始数组 |
| POST | `/api/github/issues/{number}/comments` | 代登录用户发表评论，见 [7.2](#72-发表评论) |
| GET | `/api/github/user?username={login}` | 代理 `GET api.github.com/users/{login}` 公开资料 |

### 7.1 创建议题

```
POST /api/github/issues
Content-Type: application/json
```

**认证**：Cookie 中的 GitHub token（同时受 Origin 白名单保护）。以 token 所属用户身份创建。

请求体：

```json
{
  "title": "必填，trim 后 1-256 字符",
  "body": "可选，Markdown，trim 后 ≤ 10000 字符"
}
```

成功：透传 GitHub 201 响应（创建结果原始对象，前端使用其中的 `number` 跳转详情页）。错误：400 `invalid_json` / `missing_title` / `title_too_long` / `body_too_long`；401 未登录；403 来源不在白名单；其余失败透传 GitHub 状态码与 `{ error: "GitHub API create issue failed", details }`。

> 服务端不设置 labels：非仓库协作者指定标签会被 GitHub 静默丢弃，标签由维护者后续在 GitHub 端添加。
>
> 来源标记：服务端自动在正文末尾空两行追加 `<!-- via coco-community web -->` 或 `<!-- via coco-community api -->`（浏览器同源请求为 web；携带 `X-Client: mobile/api` 头或 `?client=mobile/api` 为 api）。正文为空时仅写入该标记。标记为 HTML 注释，GitHub 页面渲染不可见。

### 7.2 发表评论

```
POST /api/github/issues/{number}/comments
Content-Type: application/json
```

请求体：`{ "body": "必填，trim 后 1-5000 字符，支持 Markdown" }`（长度校验针对用户内容，不含自动追加的标记）

成功：透传 GitHub 201 响应（新建评论原始对象）。错误：400 `invalid_json` / `missing_body` / `body_too_long` / `Missing or invalid issue number`；401 未登录；403 来源不合法；议题不存在等错误透传 GitHub 状态码与 `{ error: "GitHub API create comment failed", details }`。

评论同样按环境自动追加来源标记，规则同 [7.1](#71-创建议题)。

注意事项：

- 议题列表已服务端聚合分页，单次最多返回 1000 条；评论 GET 接口仍遵循 GitHub 默认每页 30 条，暂未分页
- 成功响应头带 `Access-Control-Allow-Origin: https://cc.zitzhen.cn`
- 所有渲染到页面的议题/评论正文在前端经 `sanitize-html` 消毒后才会插入 HTML

---

## 8. 日志

### 8.1 访问日志

```
GET /api/log?url={被访问路径}
```

**认证**：无。将 `CF-Connecting-IP`（回退 `x-forwarded-for`，再回退 `unknown`）与 url 写入 D1 `log` 表。

**200**

```json
{ "status": "success", "ip": "1.2.3.4", "url": "/control/xxx", "time": "2026-09-26T10:00:00.000Z" }
```

500：`{ "status": "error", "message": "..." }`。

---

## 9. 数据模型附录

### 9.1 R2 布局（桶 `coco-community`）

```text
<控件名>/
├── information.json          # { author, Current_version, Version_number_list: [] }
├── README.md                 # 可选，Markdown
└── <版本号>/
    └── control.jsx           # 控件本体
```

`information.json` 示例：

```json
{
  "author": "Iamliuxiaozhen",
  "Current_version": "1.0.0",
  "Version_number_list": ["1.0.0", "1.1.0"]
}
```

历史数据的 `author` 可能为空字符串或大小写不一致；解析实际文件 key 时会容忍版本号写法差异（`1.0` ≈ `1.0.0`）及 `control.jsx` 文件名拼写差异。

### 9.2 D1 表（数据库 `CoCo-Community`）

| 表 | 主要列 | 用途 |
| --- | --- | --- |
| `components` | `name`（控件名）, `size`（NOT NULL 文本）, `downloads`, `likes`, `collections`, `Pageviews`, `author` | 控件计数 |
| `essay` | `id`, `name`, `author`, `publication_time`, `content`, `pageviews`, `"Like"`, `collect` | 文章 |
| `essay_like` | `username`, `essayid`, `time` | 点赞记录 |
| `essay_collect` | `username`, `essayid`, `time` | 收藏记录 |
| `comment` | `id`, `username`, `content`, `time`, `ip`, `essayid` | 文章评论 |
| `user` | `username`, `nickname`, `number_of_controls`, `avatar`, `bio`, `pageviews` | 用户资料 |
| `log` | `ip`, `url`（及自增 id / 时间列） | 访问日志 |

> 建议给 `components(name)` 建唯一索引以兜底并发重复提交：
> `CREATE UNIQUE INDEX IF NOT EXISTS idx_components_name ON components(name)`（建前需确认无重名行）。

### 9.3 页面路由速查

| 路由 | 页面 |
| --- | --- |
| `/` | 首页（Hero 搜索 + 控件网格 + 上传入口） |
| `/control`、`/control/{name}` | 控件列表 / 详情 |
| `/new-control` | 提交控件（登录） |
| `/essay`、`/essay/{id}` | 文章列表 / 详情 |
| `/user`、`/user/{login}` | 用户列表 / 主页 |
| `/me` | 个人中心（登录） |
| `/issues`、`/issues/{number}` | Issues 列表 / 详情 |
| `/search` | 全站搜索 |
| `/login`、`/auth/github` | 登录页 / OAuth 回调 |
| `/safe`、`/tipping`、`/agreement/*` | 安全反馈 / 赞赏 / 协议页 |
