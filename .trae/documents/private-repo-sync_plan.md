# 支持 GitHub 私有仓库绑定与同步

## Summary

当前绑定流程显式拒绝私有仓库（bind.post.ts `repoData.private` 检查），且用户 OAuth token 的 scope 为 `public_repo`（登录页）/无 scope（绑定页），技术上无法读取私有仓库。本次改造：

1. **绑定入口升级授权**：仅 repo.vue / new-control/index.vue 的 GitHub 授权链接改为 `scope=repo`（含私有仓库读权限），普通登录（login/index.vue）保持 `public_repo` 不变；
2. **bind 放开私有仓库**：移除 private 拒绝，保留归属校验（用户 token 可校验自己名下私有仓库）；
3. **CI 传 token**：sync 接口 Bearer 路径接受可选请求头 `X-GitHub-Token`（CI 用 Actions 自带的 `${{ secrets.GITHUB_TOKEN }}` 或 PAT），用于读取私有仓库；
4. Actions 示例与文档同步更新。

## Current State Analysis

- **OAuth scope**：[login/index.vue:37,45](file:///home/oliver/CoCo-Community/pages/login/index.vue) 用 `scope=public_repo`；[repo.vue:30](file:///home/oliver/CoCo-Community/pages/new-control/repo.vue#L30) 与 [new-control/index.vue:31](file:///home/oliver/CoCo-Community/pages/new-control/index.vue#L31) 的授权链接**无 scope 参数**。回调 [routes/auth/github.ts](file:///home/oliver/CoCo-Community/server/routes/auth/github.ts) 原样把 access_token 存 Cookie `token`，无需改动。
- **bind**：[bind.post.ts:62-64](file:///home/oliver/CoCo-Community/server/api/github-sync/bind.post.ts#L62-L64) 显式拒绝 `repoData.private`；仓库校验/预检已用 `auth.token`。
- **sync**：[sync.post.ts](file:///home/oliver/CoCo-Community/server/api/github-sync/sync.post.ts) 双鉴权（Cookie→用户 token / Bearer→无 token）；[github-sync.ts](file:///home/oliver/CoCo-Community/server/utils/github-sync.ts) `mirrorRepo(env, binding, userToken?)` 第三参已存在，tree 与 tarball（api.github.com 302 跳 codeload，私有仓库返回预签名 URL）均已带 token。
- **D1 表**：`github_sync_repos` 不需要存 token（用户决策：CI 用请求头传），无迁移。
- **前端错误映射**：repo.vue 对 `repo_not_accessible` 已有展示；无需新增错误码，仅调整 detail 文案。

## Proposed Changes

### 1. pages/new-control/repo.vue + pages/new-control/index.vue — scope 升级

两处 `<a href="https://github.com/login/oauth/authorize?client_id=...">` 追加 `&scope=repo`。login/index.vue 不动。

### 2. server/api/github-sync/bind.post.ts — 放开私有仓库

- 删除 `if (repoData.private) { ... }` 块（62-64 行）。
- `repoRes.ok` 为 false 时的 detail 文案改为提示授权不足可能：`仓库不存在、不可访问，或为私有仓库但当前授权不足（请从绑定页重新登录获取 repo 权限）`。
- 注释同步更新（"校验仓库存在、归属当前用户（公开或私有）"）。

### 3. server/api/github-sync/sync.post.ts — Bearer 路径接受 CI token

- 鉴权段读取可选头：`const ciToken = request.headers.get('X-GitHub-Token')?.trim() || null`（仅 Bearer 路径使用；Cookie 路径始终用会话 token，忽略该头）。
- 调用处：`mirrorRepo(env, binding, ciToken || userToken)`。
- 安全性说明：token 只作为读取**绑定仓库本身**的凭据，`mirrorRepo` 内 owner/repo 来自绑定行，header 无法改变镜像目标，无注入面。

### 4. Actions 示例更新（3 处）

- bind.post.ts `exampleCurl` 增加 `-H "X-GitHub-Token: ${{ secrets.GITHUB_TOKEN }}"`（模板字符串需转义 `${{ }}`）。
- repo.vue `actionsExample` 同步增加该头（yaml 示例）。
- [docs/API.md](file:///home/oliver/CoCo-Community/docs/API.md) §8：开头"仅支持本人名下的公开仓库"改为"支持本人名下的公开/私有仓库"；8.2 增加 `X-GitHub-Token` 说明（私有仓库必带，公开仓库可选；推荐 Actions 内置 `${{ secrets.GITHUB_TOKEN }}`）；GitHub Actions 接入示例 yaml 增加该头；错误码 `repo_not_accessible` detail 语义更新。

## Assumptions & Decisions

- **scope 只在绑定入口请求**（用户选定）：普通登录 token 权限不变；已登录用户点绑定入口的 GitHub 链接会重新走 OAuth 覆盖 Cookie，获得 `repo` scope。
- **CI token 经请求头传递**（用户选定）：不在 D1 存 token、不依赖服务级 GITHUB_TOKEN；私有仓库 CI 同步必须在 Actions 中带 `X-GitHub-Token` 头，否则 GitHub API 404 → 同步报 `repo_or_branch_not_found`。
- 不改 `requireGithubUser`、不改 D1 表结构、不改 github-sync.ts 的 mirrorRepo（签名已支持）。

## Verification

1. `npm run build` 通过。
2. dev 冒烟：4 个 github-sync 端点路由可达、未登录 401、结构化 JSON 错误（与现状一致）。
3. `parseRepoTree`/`parseTar` 本地脚本回归（/tmp/tar-test/harness.mts、pt-verify.mts）不受影响。
4. 手动验收（需用户操作）：绑定入口重新授权后绑定一个私有模板仓库 → 网页同步成功 → Actions push 触发（带 `X-GitHub-Token: ${{ secrets.GITHUB_TOKEN }}`）同步成功；公开仓库行为回归不变。
