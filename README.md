# ZIT-CoCo-Community

![GitHub Stars](https://img.shields.io/github/stars/zitzhen/CoCo-Community?style=flat)
![GitHub Forks](https://img.shields.io/github/forks/zitzhen/CoCo-Community?style=flat)
![GitHub Issues](https://img.shields.io/github/issues/zitzhen/CoCo-Community?style=flat)
![GitHub Top Language](https://img.shields.io/github/languages/top/zitzhen/CoCo-Community?style=flat)
![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)

ZIT 小圳创科工作室维护的**编程猫 CoCo 编辑器开发者社区**——浏览、搜索、下载 CoCo 自定义控件，阅读社区文章，通过 GitHub OAuth 登录后提交你自己的控件。

- 官方站点：<https://cc.zitzhen.cn/>
- 主仓库（一切以 GitHub 为准）：<https://github.com/zitzhen/CoCo-Community>
- 镜像仓库：[GitLab](https://gitlab.com/zitzhen/CoCo-Community) · [GitCode](https://gitcode.com/zitzhen/CoCo-Community) · Gitee

> 若在未公布的平台发现本仓库，欢迎通过 [SECURITY.md](SECURITY.md) 中的联系方式举报。

---

## 功能

| 模块 | 说明 | 状态 |
| --- | --- | :--: |
| 控件浏览 / 搜索 / 详情 | 实时枚举 R2 控件目录，合并 D1 下载量、浏览量等计数 | ✅ |
| 控件下载 | 详情页一键下载 `.jsx`，自动累计下载量 | ✅ |
| 控件在线提交 | GitHub 登录后通过 `/new-control` 上传控件（R2 + D1） | ✅ |
| GitHub 登录 | OAuth 授权码模式 + JWT 双令牌会话，支持 Web / Mobile | ✅ |
| 文章系统 | 文章列表、详情、浏览量、点赞、收藏、评论 | ✅ |
| 用户主页 | 用户资料、TA 的控件（按 R2 实时数据聚合） | ✅ |
| Issues 镜像 | 代理 GitHub Issues 列表 / 详情 / 评论 | ✅ |
| 文章在线发布 | — | 🚧 |

---

## 技术架构

```text
浏览器 (SSR 首屏 + SPA 客户端导航)
        │
        ▼
Nuxt 4 / Vue 3  ── Nitro (preset: cloudflare_pages)
        │
        ├── Cloudflare Workers 边缘函数（server/api、server/routes）
        ├── Cloudflare R2   绑定 RESOURCES —— 控件文件与信息（<name>/<version>/control.jsx）
        ├── Cloudflare D1   绑定 DB        —— 用户 / 文章 / 评论 / 点赞收藏 / 计数 / 日志
        └── GitHub API     —— OAuth 登录、Issues 代理、登录态校验
```

- **框架**：Nuxt 4（Vue 3），SSR 与 SPA 混合渲染
- **运行时**：Cloudflare Pages + Workers（Node ≥ 24.11 构建）
- **存储**：R2 对象存储（控件本体）、D1 SQLite（关系数据与计数器）
- **认证**：GitHub OAuth 2.0 授权码流程 + `jose` 签发的 HS256 JWT
- **Markdown**：`marked` 渲染，`sanitize-html` 统一消毒（防止用户内容 XSS）

---

## 快速开始（本地开发）

### 1. 环境要求

- Node.js ≥ 24.11（推荐 nvm 安装）
- npm
- 一个 [Cloudflare 账号](https://dash.cloudflare.com/)（用于 D1 / R2 绑定）
- 一个 [GitHub OAuth App](https://github.com/settings/developers)

### 2. 安装依赖

```bash
npm ci
```

### 3. 配置本地密钥

在项目根目录创建 `.dev.vars`（**不要提交到 Git**）：

```ini
GITHUB_CLIENT_ID=你的 OAuth Client ID
GITHUB_CLIENT_SECRET=你的 OAuth Client Secret
COCO_COMMUNITY_JWT=任意足够长的随机字符串（HS256 密钥）
```

OAuth App 的回调地址需包含本地回调，例如 `http://localhost:3000/auth/github`。

### 4. Cloudflare 资源

[wrangler.toml](wrangler.toml) 已声明绑定，无需修改：

| 绑定 | 类型 | 名称 |
| --- | --- | --- |
| `DB` | D1 数据库 | `CoCo-Community` |
| `RESOURCES` | R2 存储桶 | `coco-community`（本地 `remote = true`，直连真实桶） |

本地连接远程 R2 / D1 需要 `CLOUDFLARE_API_TOKEN`：

```bash
npx wrangler login          # 或 export CLOUDFLARE_API_TOKEN=xxx
```

D1 表结构需与远程一致（`components`、`essay`、`essay_like`、`essay_collect`、`comment`、`user`、`log`），可用 `wrangler d1 execute CoCo-Community --local --command "..."` 初始化。

### 5. 启动

```bash
npm run dev        # http://localhost:3000，开发环境接口不缓存
```

> 沙箱 / 非交互终端中无法启动 wrangler 远程代理时，R2 / D1 不可达属于本地环境限制，不是代码问题。

---

## 构建与部署

```bash
npm run build      # 产物输出到 dist/
npx wrangler pages dev dist        # 本地以 Pages 模式预览生产产物
npx wrangler pages deploy dist     # 部署到 Cloudflare Pages
```

Cloudflare Pages 后台需要配置的 Secrets / Variables：

| 变量 | 用途 | 示例环境 |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Production + Preview |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | Production + Preview |
| `COCO_COMMUNITY_JWT` | JWT HS256 签名密钥 | Production + Preview |
| `NODE_VERSION` | 构建 Node 版本（=24） | 已在 wrangler.toml 声明 |

> 机密变量只允许放在 Cloudflare 后台或 `.dev.vars`，**禁止写入 wrangler.toml**。

---

## 文档

- [贡献指南](CONTRIBUTING.md) —— 开发规范、分支与提交约定
- [API 文档](docs/API.md) —— 全部服务端接口与数据模型
- [安全策略](SECURITY.md) —— 漏洞报告渠道与安全机制
- [社区行为守则](CODE_OF_CONDUCT.md)
- [用户协议](https://cc.zitzhen.cn/agreement/useragreement) · [隐私政策](https://cc.zitzhen.cn/agreement/privacypolicy) · [开源许可证](https://cc.zitzhen.cn/agreement/license)
- `docs/` 目录下另有登录、文章、点赞收藏等历史开发手册

---

## 提交你的控件

1. 使用 GitHub 账号登录 <https://cc.zitzhen.cn/login>
2. 访问 <https://cc.zitzhen.cn/new-control>，或点击首页的「上传控件」
3. 填写控件名、语义化版本号，上传 `.jsx` 文件（≤ 100 KiB），可选附 README（Markdown，≤ 100 KiB）
4. 提交后立即可在首页、搜索与个人主页看到

也可以通过 GitHub Issue 或邮件 `liuxiaozhen2024@163.com` 联系我们代提交。

---

## 开发者

| 姓名 | GitHub |
| --- | --- |
| 刘小圳 | [Iamliuxiaozhen](https://github.com/Iamliuxiaozhen) |

### 控件贡献者

| 昵称 | GitHub | 昵称 | GitHub |
| --- | --- | --- | --- |
| 刘小圳 | [iamliuxiaozhen](https://github.com/iamliuxiaozhen) | 小宏 | [xiaohong2022](https://github.com/xiaohong2022) |
| QiQi | [Qiqi29](https://github.com/Qiqi29) | Inventocode | [Inventocode](https://github.com/Inventocode) |
| 垃圾桶 | [LJT-YTWH](https://github.com/LJT-YTWH) | XJ王大哥 | [xjwangdage](https://github.com/xjwangdage) |

---

## 许可证

本项目基于 [AGPL-3.0](LICENSE) 开源。**不代表用户上传的控件作品使用同款许可证**，具体以各控件作者声明为准。
