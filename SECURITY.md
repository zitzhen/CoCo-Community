# 安全策略（Security Policy）

## 支持的版本

安全修复只针对当前主线代码（GitHub 默认分支）与线上部署 <https://cc.zitzhen.cn/>。历史镜像（Gitee / GitLab / GitCode）与 Fork 不在支持范围内。

---

## 报告安全漏洞

**请勿在 GitHub Issues 等公开渠道讨论或复现安全漏洞。**

请通过以下私密渠道报告：

1. 邮件：`liuxiaozhen2024@163.com`
2. 站内安全页面：<https://cc.zitzhen.cn/safe>

报告建议包含：

- 漏洞类型与受影响的 URL / 接口
- 复现步骤与最小化 PoC（请使用自己的测试账号）
- 影响范围评估与可能的修复方向

### 响应时限（SLA）

| 阶段 | 时限 |
| --- | --- |
| 确认收到报告 | 24 小时内 |
| 初步评估与分级 | 72 小时内 |
| 高危漏洞修复目标 | 7 天内 |
| 修复发布 | 随 Cloudflare Pages 部署即时生效 |

修复发布后，在征得报告者同意的前提下将其列入致谢名单（可匿名）。我们不会在修复上线前公开漏洞细节。

---

## 安全机制（现状）

### 认证与会话

- GitHub OAuth 2.0 授权码模式：授权码仅在边缘函数内通过 `client_id + client_secret` 换取 token，密钥永不下发浏览器
- 双令牌会话（均为 `HttpOnly; Secure; SameSite=Lax`，JavaScript 不可读取）：
  - `token`：GitHub 访问令牌，7 天有效；登录超过 2 天后再次访问会滑动续期 3 天
  - `maximum_lifespan`：HS256 JWT（载荷含 `username`、签发时间、最长 30 天）
- 敏感操作（`/api/me`、控件提交、文章点赞/收藏）同时校验两枚令牌，并要求 JWT 中的用户名与 GitHub 实时返回的 `login` 一致，防止令牌拼接冒用
- 登出接口会清空当前域下的全部 Cookie

### 授权与来源校验

- GitHub 代理类接口带有 Origin / Referer 白名单（生产域名 + 本地开发域名）
- GitHub token 采用经典 OAuth App 的 `public_repo` scope（经典 OAuth 下的最小可行授权，语义为"用户全部公开仓库的读写"）。服务端仅将其用于固定的本仓库议题/评论 GitHub API 调用，不提供任意 URL 转发代理；新增 GitHub 代理接口必须保持该约束，禁止把用户 token 暴露给客户端或第三方
- 控件提交采用归属校验：已有控件只有原作者可发新版本；`author` 缺失的历史数据允许认领

### 用户内容防护

- 所有 Markdown（Issue 正文/评论、控件 README、文章正文）经 `marked` 渲染后统一通过 `sanitize-html` 白名单消毒，剥离脚本、事件属性与 `javascript:` 等危险协议
- Vue 模板默认对插值内容做 HTML 转义；任何 `v-html` 出口都必须经过统一消毒函数
- 控件提交对名称、版本号、文件类型与体积做服务端白名单校验（`.jsx` ≤ 100 KiB，README ≤ 100 KiB）

### 基础设施

- 全部逻辑运行在 Cloudflare Workers 边缘运行时，无自建服务器
- 对象存储 R2 仅通过同源路由 `/resource/<key>` 代理访问，浏览器不直连存储桶
- D1 / R2 凭证由 Cloudflare 平台托管；OAuth 与 JWT 机密只存于 Cloudflare Secrets 或本地 `.dev.vars`，禁止入库
- 公开列表类接口启用 5 分钟边缘缓存，开发环境自动绕过

---

## 范围内 / 范围外

**在范围内**：

- 认证绕过、越权操作他人账号或控件
- XSS / CSRF / 会话固定 / Cookie 安全属性缺陷
- R2 对象越权读写、D1 注入或数据泄露
- 边缘函数的服务端请求伪造（SSRF）、密钥泄露
- 与线上域名、`*.pages.dev` 预览环境相关的实际可利用问题

**不在范围内**：

- 没有实际影响、仅理论上的问题（如无 PoC 的版本号告警）
- 针对 GitHub 平台、Cloudflare 平台自身的漏洞
- 拒绝服务（DoS/DDoS）与压测类报告
- 需要受害者自己执行操作的 Self-XSS
- 用户上传的控件 `.jsx` 内容本身（控件在 CoCo 编辑器内运行的行为由编辑器沙箱负责）
- 社工、物理攻击与钓鱼（针对维护者的除外，欢迎提醒）

---

## 最佳实践（给使用者与部署者）

1. 始终使用线上最新版本
2. 自行部署时使用独立的 OAuth App 与高强度随机 JWT 密钥
3. `.dev.vars` 与 Cloudflare 后台之外不得存放任何机密
4. 生产环境保持 HTTPS，不关闭 Cookie 的 Secure 属性
5. 定期更新依赖并关注 `npm audit`

---

## 致谢

感谢以下安全研究者对本项目的帮助：

- [刘小圳](https://github.com/Iamliuxiaozhen)

（名单按报告时间更新，匿名报告以“匿名研究者”标注。）
