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
- [8. Git 仓库同步](#8-git-仓库同步)
- [9. 日志](#9-日志)
- [10. 数据模型附录](#10-数据模型附录)

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

R2 是控件本体与元信息的真实来源；D1 `components` 表只存计数。目录结构见 [10.1](#101-r2-布局)。

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
| `name` | 是 | `/^[A-Za-z0-9一-鿿][A-Za-z0-9_一-鿿-]{0,63}$/` |
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
| GET | `/api/github/issues/{number}/comments` | 议题评论的 GitHub 原始数组（服务端聚合分页：100 条/页，最多 5 页 = 500 条，超出时响应头 `X-List-Truncated: true`） |
| POST | `/api/github/issues/{number}/comments` | 代登录用户发表评论，见 [7.2](#72-发表评论) |
| OPTIONS | `/api/github/*` | 跨域预检（同源请求不触发）：返回 204，`Allow-Methods: GET, POST, OPTIONS`，`Allow-Headers: Content-Type, X-Client` |
| 任意 | 其他 HTTP 方法 | 返回 405 `{ "error": "Method Not Allowed" }`，响应头 `Allow: GET, POST, OPTIONS` |
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
>
> ⚠️ 来源标记仅表示客户端**自我声明**的渠道（可被伪造），不是可信身份认证或审计证据；可信凭据只有服务端校验的 Cookie token。
>
> ⚠️ 权限范围：登录采用 GitHub 经典 OAuth App，`public_repo` 是其最小可行 scope，但语义为"用户全部公开仓库的读写"。服务端只将 token 用于本节固定的 GitHub API 调用（创建/读取本仓库议题与评论），**不存在任意 URL 转发代理**；新增 GitHub 代理接口时必须保持这一约束。

### 7.2 发表评论

```
POST /api/github/issues/{number}/comments
Content-Type: application/json
```

请求体：`{ "body": "必填，trim 后 1-5000 字符，支持 Markdown" }`（长度校验针对用户内容，不含自动追加的标记）

成功：透传 GitHub 201 响应（新建评论原始对象）。错误：400 `invalid_json` / `missing_body` / `body_too_long` / `Missing or invalid issue number`；401 未登录；403 来源不合法；议题不存在等错误透传 GitHub 状态码与 `{ error: "GitHub API create comment failed", details }`。

评论同样按环境自动追加来源标记，规则同 [7.1](#71-创建议题)。

注意事项：

- 议题列表与评论 GET 均已服务端聚合分页：议题单次最多 1000 条（100 条/页 × 10 页），评论单次最多 500 条（100 条/页 × 5 页），超出上限时响应头带 `X-List-Truncated: true`
- 成功响应头带 `Access-Control-Allow-Origin: https://cc.zitzhen.cn`
- 所有渲染到页面的议题/评论正文在前端经 `sanitize-html` 消毒后才会插入 HTML

---

## 8. Git 仓库同步

将基于 [`zitzhen/control-template`](https://github.com/zitzhen/control-template) 模板的 GitHub 控件仓库绑定到社区控件，服务端**全量真镜像**仓库：
- 仓库中所有**允许类型**的文件（版本目录内 `information.json` / `control.jsx`、根 `README.md`、README 引用的图片、LICENSE 等）按原路径复制到 R2 `<控件名>/` 下；
- 内容按 GitHub blob sha 判断：未变跳过、变更覆盖；
- 仓库中已删除的文件从 R2 同步删除（带保护阈值，见 8.2）。

绑定关系存于 D1 `github_sync_repos` 表（见 [10.2](#102-d1-表)）。一个控件名仅可绑定一个仓库；仅支持绑定**本人名下的公开仓库**。

**允许镜像的文件类型**：图片（`.png .jpg .jpeg .gif .webp .bmp .ico .svg`）、文档/代码（`.md .markdown .txt .json .jsx .js .mjs .cjs .ts .css .xml .yml .yaml`）、字体（`.woff .woff2 .ttf .otf .eot`）、音视频（`.mp3 .mp4 .webm`），以及无扩展名的 `LICENSE/LICENCE/COPYING/NOTICE`。`.html/.htm/.xhtml` 等可在同源执行为活动页面的类型拒绝（`file_type_not_allowed`）；`.github/` 等点开头的仓库管道文件静默忽略。

**大小上限**：jsx 与 README ≤ 100 KiB，其他单个文件 ≤ 5 MiB，解压后总量 ≤ 25 MiB、文件数 ≤ 500（超限截断，本次不执行删除并返回 warning）。

**同步触发（预留 API）**：`/api/github-sync/sync` 支持两种鉴权——网页手动（Cookie 登录 + 归属校验）与仓库 CI 通知（`Authorization: Bearer <sync_secret>`，secret 由绑定接口返回）。后者即为预留的自动同步入口：在控件仓库的 GitHub Actions 中于 push 时调用，实现自动同步。同一绑定 60 秒内仅允许同步一次。

### 8.1 绑定仓库

```
POST /api/github-sync/bind
Content-Type: application/json
```

**认证**：双 Cookie + Origin 白名单。

**请求体**

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `repo` | 是 | `owner/name` 或 GitHub 仓库 URL（支持 `.git` 后缀） |
| `controlName` | 是 | R2 控件名，规则同 `control-submit` 的 NAME_RE；已存在控件要求 author 与当前用户一致（大小写不敏感） |
| `branch` | 否 | 默认 `main` |

**200**

```json
{
  "ok": true,
  "controlName": "MyControl",
  "repo": "Iamliuxiaozhen/my-control",
  "branch": "main",
  "validVersions": 1,
  "totalFiles": 4,
  "syncSecret": "a1b2...（64 位 hex，仅归属者可见，用于 CI 鉴权）",
  "syncEndpoint": "/api/github-sync/sync",
  "exampleCurl": "curl -X POST -H \"Authorization: Bearer ...\" ..."
}
```

`validVersions` 为合法版本目录数，`totalFiles` 为仓库 blob 总数（均允许 0，可先绑空仓库再推代码）。

**错误码**：400 `invalid_repo` / `invalid_name`；401（同登录校验链）；403 `repo_not_owned` / 来源不在白名单；404 `repo_not_accessible`（不存在或私有）；409 `name_taken_by_other` / `already_bound` / `control_info_corrupted`；500 `bind_failed`。

### 8.2 触发同步（预留 API）

```
POST /api/github-sync/sync
Content-Type: application/json
```

**认证**（二选一）：

- **Cookie**：双令牌登录，且为绑定归属者（`repo_owner` 匹配登录名）
- **Bearer**：`Authorization: Bearer <sync_secret>`（无需登录，供仓库 CI 调用）

**请求体**：`{ "controlName": "MyControl" }` 或 `{ "repo": "owner/name" }`（Cookie 方式下二选一定位绑定；Bearer 方式下由 secret 直接定位，controlName 不匹配时 403 `binding_mismatch`）。

**镜像流程**：

1. 拉取绑定分支 git tree（blob sha 映射 + 版本目录识别，tree 被截断返回 `tree_truncated`）
2. 下载整仓 tarball（共 2 次出站请求，与文件数无关），gzip 流式解压后解析 tar
3. 文件分级：点文件忽略、非白名单拒绝、大小超限拒绝；版本目录内 `information.json` 必须可解析
4. 新控件：先写 D1 `components` 登记行（失败即整体中止，R2 未被触碰）
5. 逐文件 sha 比对：未变跳过，新增/变更覆盖写 R2（customMetadata 存 `gh_sha`）
6. 合并写根 `information.json`（版本列表取并集，`Current_version` 取语义最高，`author` 以绑定者为准）
7. **镜像删除**：R2 中路径已不存在于仓库的文件删除——仅在镜像完整且无写入错误时执行；删除数占现存 key 超过 **30%** 则中止（`deletion_aborted_threshold`）；仓库中不存在的版本目录**整目录豁免**（保护绑定前手动上传的历史版本）
8. 有任何变更时清理 `/api/control-list` 缓存；更新绑定行同步状态

**200**（`ok` / `partial`）

```json
{
  "ok": true,
  "status": "ok",
  "controlName": "MyControl",
  "repo": "Iamliuxiaozhen/my-control",
  "filesSynced": ["README.md", "images/demo.png", "1.0.0/control.jsx", "1.0.0/information.json"],
  "unchanged": 0,
  "ignored": 2,
  "skipped": [],
  "deleted": ["images/old.png"],
  "versions": { "added": ["1.0.0"], "all": ["1.0.0"] },
  "currentVersion": "1.0.0",
  "warnings": []
}
```

**README 图片展示**：控件详情页渲染 README 时，相对图片地址（`./images/x.png`）由前端重写为 `/resource/<控件名>/images/x.png` 经同源资源代理加载；外链图片（http/https）原样保留。

**skipped.reason 取值**：`file_type_not_allowed` / `file_too_large` / `jsx_too_large` / `readme_too_large` / `invalid_information_json` / `version_file_missing_from_tarball` / `r2_write_failed`。

**warnings 取值**：`tree_truncated` / `extracted_size_limit` / `file_count_limit` / `deletion_aborted_threshold`（有 warning 时 `ok=false`、HTTP 仍为 200）。

**错误码**：401 `unauthenticated` / `invalid_sync_secret`；403 `not_owner` / `binding_mismatch`；404 `not_bound`；429 `sync_too_frequent`（含 `retry_after_seconds`）；502 同步整体失败（`error` 字段说明原因，如 `repo_or_branch_not_found` / `counter_register_failed: ...`）。

**GitHub Actions 接入示例**（绑定接口响应中附带同内容）：

```yaml
name: Sync to CoCo-Community
on:
  push:
    branches: [main]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Notify CoCo-Community sync
        run: |
          curl -X POST -H "Authorization: Bearer ${{ secrets.COCO_SYNC_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{"controlName":"MyControl"}' \
            https://cc.zitzhen.cn/api/github-sync/sync
```

`sync_secret` 仅可触发同步，无法注入内容；如泄露，解绑后重新绑定即可更换。

### 8.3 我的绑定列表

```
GET /api/github-sync/list
```

**认证**：双 Cookie。返回当前用户全部绑定（`sync_secret` 仅归属者本人可见）：

```json
{
  "list": [
    {
      "controlName": "MyControl",
      "repo": "Iamliuxiaozhen/my-control",
      "branch": "main",
      "syncSecret": "a1b2...",
      "createdAt": "2026-09-28T08:00:00.000Z",
      "lastSyncedAt": "2026-09-28T09:00:00.000Z",
      "lastSyncStatus": "ok",
      "lastSyncDetail": {
        "filesSynced": ["README.md", "1.0.0/control.jsx"],
        "unchanged": 0,
        "deleted": [],
        "versions": { "added": ["1.0.0"], "all": ["1.0.0"] }
      }
    }
  ]
}
```

`lastSyncStatus`：`never` / `ok` / `partial` / `failed`。错误：401；500 `list_failed`。

### 8.4 解绑仓库

```
POST /api/github-sync/unbind
Content-Type: application/json
```

**认证**：双 Cookie + Origin 白名单。请求体 `{ "controlName": "MyControl" }`。仅删除 D1 绑定关系，R2 中已同步的控件数据保持不变。

**200** `{ "ok": true, "controlName": "MyControl" }`。错误：400 `missing_control_name`；401；403 `not_owner` / 来源不在白名单；404 `not_bound`；500 `unbind_failed`。

> 服务端访问 GitHub API 的鉴权优先级：**网页触发（bind/sync）优先使用登录用户的 GitHub token**（5000 次/小时/用户，OAuth 时下发）；Bearer CI 触发无用户会话，回退 Cloudflare Pages 可选环境变量 `GITHUB_TOKEN`（同为 5000 次/小时）；两者皆无时匿名（60 次/小时/IP，Cloudflare 共享出口 IP 下极易 403 限流）。

---

## 9. 日志

### 9.1 访问日志

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

## 10. 数据模型附录

### 10.1 R2 布局（桶 `coco-community`）

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

### 10.2 D1 表（数据库 `CoCo-Community`）

| 表 | 主要列 | 用途 |
| --- | --- | --- |
| `components` | `name`（控件名）, `size`（NOT NULL 文本）, `downloads`, `likes`, `collections`, `Pageviews`, `author` | 控件计数 |
| `essay` | `id`, `name`, `author`, `publication_time`, `content`, `pageviews`, `"Like"`, `collect` | 文章 |
| `essay_like` | `username`, `essayid`, `time` | 点赞记录 |
| `essay_collect` | `username`, `essayid`, `time` | 收藏记录 |
| `comment` | `id`, `username`, `content`, `time`, `ip`, `essayid` | 文章评论 |
| `user` | `username`, `nickname`, `number_of_controls`, `avatar`, `bio`, `pageviews` | 用户资料 |
| `log` | `ip`, `url`（及自增 id / 时间列） | 访问日志 |
| `github_sync_repos` | `id`, `control_name`(UNIQUE), `repo_owner`, `repo_name`, `branch`, `sync_secret`, `created_at`, `last_synced_at`, `last_sync_status`, `last_sync_detail` | Git 仓库绑定与同步状态 |

`github_sync_repos` 建表 SQL：

```sql
CREATE TABLE IF NOT EXISTS github_sync_repos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  control_name TEXT NOT NULL UNIQUE,
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  sync_secret TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_synced_at TEXT,
  last_sync_status TEXT,
  last_sync_detail TEXT
);
```

> 建议给 `components(name)` 建唯一索引以兜底并发重复提交：
> `CREATE UNIQUE INDEX IF NOT EXISTS idx_components_name ON components(name)`（建前需确认无重名行）。

### 10.3 页面路由速查

| 路由 | 页面 |
| --- | --- |
| `/` | 首页（Hero 搜索 + 控件网格 + 上传入口） |
| `/control`、`/control/{name}` | 控件列表 / 详情 |
| `/new-control` | 提交控件（登录） |
| `/new-control/repo` | 从 Git 仓库导入（登录） |
| `/essay`、`/essay/{id}` | 文章列表 / 详情 |
| `/user`、`/user/{login}` | 用户列表 / 主页 |
| `/me` | 个人中心（登录） |
| `/issues`、`/issues/{number}` | Issues 列表 / 详情 |
| `/search` | 全站搜索 |
| `/login`、`/auth/github` | 登录页 / OAuth 回调 |
| `/safe`、`/tipping`、`/agreement/*` | 安全反馈 / 赞赏 / 协议页 |
