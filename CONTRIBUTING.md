# 贡献指南（Contributing Guidelines）

感谢你愿意为 CoCo-Community 做贡献！🎉 无论是报告 Bug、提出建议，还是直接提交代码，我们都非常欢迎。

开始前请花几分钟阅读本指南，以及：

- [社区行为守则](CODE_OF_CONDUCT.md)
- [安全策略](SECURITY.md)（安全漏洞**不要**提 Issue）
- [API 文档](docs/API.md)

---

## 目录

1. [报告问题](#1-报告问题)
2. [本地开发环境](#2-本地开发环境)
3. [代码规范](#3-代码规范)
4. [提交代码（Pull Request）](#4-提交代码pull-request)
5. [提交信息规范](#5-提交信息规范)
6. [常见本地任务](#6-常见本地任务)

---

## 1. 报告问题

提交 Issue 前请先搜索是否已有重复项，并使用仓库提供的 Issue 模板：

- **Bug**：操作系统 / 浏览器、复现步骤、预期行为 vs 实际行为、截图
- **功能请求**：使用场景、为什么需要、可能的实现思路
- **控件相关问题**：控件名、版本号、对应控件详情页链接

安全问题请**私下报告**，方式见 [SECURITY.md](SECURITY.md)。

---

## 2. 本地开发环境

### 2.1 前置要求

- Node.js ≥ 24.11
- npm
- Cloudflare 账号与 Wrangler（随 devDependencies 安装，用 `npx wrangler` 调用）

### 2.2 启动步骤

```bash
# 1. Fork 后克隆你的仓库
git clone https://github.com/<你的用户名>/CoCo-Community.git
cd CoCo-Community

# 2. 安装依赖（优先使用 npm ci，保证 lockfile 一致）
npm ci

# 3. 配置本地密钥（.dev.vars 已在 .gitignore 中，禁止提交）
cat > .dev.vars <<'EOF'
GITHUB_CLIENT_ID=你的 Client ID
GITHUB_CLIENT_SECRET=你的 Client Secret
COCO_COMMUNITY_JWT=足够长的随机字符串
EOF

# 4. 登录 Cloudflare（本地 wrangler.toml 中 R2 配置了 remote = true）
npx wrangler login

# 5. 启动开发服务器
npm run dev          # http://localhost:3000
```

本地 D1 若缺少表（`components`、`essay`、`essay_like`、`essay_collect`、`comment`、`user`、`log`），相关页面会报 500，可用以下方式初始化：

```bash
npx wrangler d1 execute CoCo-Community --local --command "CREATE TABLE IF NOT EXISTS ..."
```

> `user` 表必须建立大小写不敏感的唯一索引，否则用户注册会退化为非原子的先查后写，且 GitHub 同名（大小写不同）会产生重复行。本地与生产 D1 各执行一次：
> ```bash
> npx wrangler d1 execute CoCo-Community --local --command "CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username_ci ON user (LOWER(username));"
> ```

> 非交互终端中无法启动 wrangler 远程代理时（缺少 `CLOUDFLARE_API_TOKEN`），R2 / D1 不可达属于本地环境限制。

### 2.3 生产构建验证

提交 PR 前请确保构建通过：

```bash
npm run build
npx wrangler pages dev dist     # 可选：本地预览生产产物
```

### 2.4 本地 HTTPS（调试 OAuth / Secure Cookie 时）

```bash
openssl req -x509 -newkey rsa:2048 -keyout coco-community.test-key.pem -out coco-community.test.pem -days 3650 -nodes -subj "/CN=coco-community.test" -addext "subjectAltName=DNS:coco-community.test,DNS:www.coco-community.test,DNS:localhost,IP:127.0.0.1,IP:::1"
```

---

## 3. 代码规范

### 3.1 通用约定

- 缩进、引号、分号等**跟随周围既有代码的风格**，不做无关的大范围格式改动
- API 地址使用**相对路径**，不要硬编码 `https://cc.zitzhen.cn`（需区分域名时，参考登录页对 `.pages.dev` 的处理）
- 优先使用 Nuxt 内置的 `$fetch` / ofetch，**不要引入 axios**（CJS/ESM 互操作会在 Workers 生产构建中报错）
- 组件目录下的组件**不自动导入**，在页面中显式 `import`（如 `MarkdownView`），避免 SSR 的 Failed to resolve component 警告
- 图标使用 Font Awesome 6.0.0-beta3，注意部分新名称不可用（例如应使用 `fa-shield-alt` 而非 `fa-shield-halved`）
- `useHead()` 必须写在组件的 setup 上下文内（`<script setup>` 或 `setup()` 中）

### 3.2 服务端（server/）约定

- API 处理器使用 h3 原生工具函数（`getQuery`、`getRouterParam`、`readMultipartFormData` 等），**不要使用 `event.request`**（h3 v1.15 的 H3Event 没有该属性）
- 需要原生 `Request` 时，通过 `getCloudflareContext(event)` 获取（见 [server/utils/cloudflare.ts](server/utils/cloudflare.ts)）
- Cloudflare 环境变量统一从 `getCloudflareContext(event).env` 读取，它已处理入站请求与 SSR 内部请求两种路径
- JSON 响应必须显式设置 `Content-Type: application/json`；用 `new Response(jsonString, ...)` 不会自动推断
- 错误响应使用稳定的错误码字符串（如 `{ "error": "missing_file" }`），不要只返回自然语言
- 公开列表接口可使用 `defineCachedEventHandler`（5 分钟，`shouldBypass: () => import.meta.dev`）；数据写入后需要即时可见时，主动清理对应缓存键

### 3.3 安全红线

- **任何**把外部用户内容写入 `v-html` 的地方，都必须先经过 [src/utils/sanitize.ts](src/utils/sanitize.ts) 的 `sanitizeHtmlOutput()`（Issue 正文/评论、控件 README、文章正文）
- 机密（OAuth Secret、JWT 密钥、API Token）只能放 Cloudflare Secrets 或 `.dev.vars`，禁止写入 `wrangler.toml` 或提交到仓库
- 不要在错误信息、日志或响应中回显机密值

### 3.4 静态资源与数据

- 静态数据文件（`public/essaylist.json`、`public/userlist.json` 等）在构建期直接 import，保证 SSR 服务端/客户端数据一致；不要用 SSR 内部 `$fetch` 拉 public 文件（会命中 HTML 回退页）
- 控件列表以 **R2 枚举结果**为真实来源，D1 仅存放下载量/浏览量等计数，不要新增依赖静态 JSON 的控件/用户清单

---

## 4. 提交代码（Pull Request）

```bash
# 从默认分支切出主题分支
git checkout -b feat/short-description   # 新功能
git checkout -b fix/short-description    # Bug 修复
git checkout -b docs/short-description   # 文档
git checkout -b chore/short-description  # 杂项 / 依赖升级
```

PR 要求：

1. 一个 PR 只做一件事，保持 diff 聚焦
2. 关联相关 Issue（如 `Closes #123`）
3. 清晰描述改动内容、原因与测试方式
4. 涉及接口变更时同步更新 [docs/API.md](docs/API.md)
5. 确保 `npm run build` 通过
6. 及时响应 Review 意见并追加提交（不要 force-push 已 review 的分支，除非维护者要求）

欢迎对提交进行 GPG 签名（仓库以 GitHub 上的提交身份为准）。

---

## 5. 提交信息规范

推荐使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```text
<type>(<可选范围>): <简明描述>

<可选正文：为什么改、改了什么>
```

常用 type：

- `feat` 新功能
- `fix` Bug 修复
- `docs` 文档
- `style` 不影响逻辑的格式调整
- `refactor` 重构
- `perf` 性能优化
- `chore` 构建、依赖、配置

示例：

```text
feat(control): 提交成功后失效 control-list 缓存
fix(auth): 补齐错误响应的 JSON Content-Type
docs(api): 更新控件提交接口的字段说明
```

---

## 6. 常见本地任务

| 任务 | 命令 |
| --- | --- |
| 启动开发服务器 | `npm run dev` |
| 生产构建 | `npm run build` |
| 预览生产产物 | `npx wrangler pages dev dist` |
| 部署（有权限时） | `npx wrangler pages deploy dist` |
| 查询本地 D1 | `npx wrangler d1 execute CoCo-Community --local --command "SQL"` |
| 查询远程 D1 | `npx wrangler d1 execute CoCo-Community --remote --command "SQL"` |

---

有任何疑问，欢迎在 Issue 中提问或联系项目维护者。再次感谢你的贡献！✨
