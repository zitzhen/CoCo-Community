<template>
  <div class="submit-page page-container">
    <nav class="submit-breadcrumb" aria-label="面包屑导航">
      <ol>
        <li><NuxtLink to="/">首页</NuxtLink></li>
        <li><NuxtLink to="/#resources">资源</NuxtLink></li>
        <li><NuxtLink to="/new-control">提交控件</NuxtLink></li>
        <li aria-current="page">从 Git 仓库导入</li>
      </ol>
    </nav>

    <!-- 登录检查中 -->
    <div v-if="!authChecked" class="submit-gate card" aria-live="polite">
      <span class="submit-gate-icon" aria-hidden="true">
        <i class="fas fa-circle-notch fa-spin"></i>
      </span>
      <h1 class="submit-gate-title">正在检查登录状态…</h1>
    </div>

    <!-- 未登录门禁 -->
    <div v-else-if="!loggedIn" class="submit-gate card">
      <span class="submit-gate-icon" aria-hidden="true">
        <i class="fas fa-lock"></i>
      </span>
      <h1 class="submit-gate-title">登录后即可绑定仓库</h1>
      <p class="submit-gate-desc">
        绑定 Git 仓库需要验证 GitHub 账号身份，用于确保你只能同步自己名下的仓库。
      </p>
      <a
        href="https://github.com/login/oauth/authorize?client_id=Ov23lii4E31EzV9VMW7B&redirect_uri=https://cc.zitzhen.cn/auth/github?client=web"
        class="submit-github-btn"
      >
        <i class="fab fa-github" aria-hidden="true"></i>
        使用 GitHub 登录
      </a>
    </div>

    <!-- 绑定成功 -->
    <div v-else-if="bound" class="submit-success card">
      <span class="submit-success-icon" aria-hidden="true">
        <i class="fas fa-check"></i>
      </span>
      <h1 class="submit-success-title">仓库绑定成功</h1>
      <p class="submit-success-desc">
        控件 <strong>{{ boundName }}</strong> 已绑定到仓库
        <a :href="boundRepoUrl" target="_blank" rel="noopener noreferrer">{{ boundRepo }}</a>
      </p>

      <div class="submit-card card" style="margin-top:24px;text-align:left">
        <h3 class="submit-section-title">
          <i class="fas fa-key" aria-hidden="true"></i> 同步密钥（请保存）
        </h3>
        <p class="submit-hint">此密钥用于仓库 GitHub Actions 中通知 CoCo-Community 自动同步。仅显示一次。</p>
        <div class="sync-secret-box">
          <code class="sync-secret-text">{{ boundSecret }}</code>
          <button type="button" class="btn btn-sm btn-outline" @click="copySecret">
            <i :class="copied ? 'fas fa-check' : 'fas fa-copy'"></i>
            {{ copied ? '已复制' : '复制' }}
          </button>
        </div>

        <h3 class="submit-section-title" style="margin-top:24px">
          <i class="fas fa-terminal" aria-hidden="true"></i> 仓库 Actions 示例
        </h3>
        <p class="submit-hint">在仓库 <code>.github/workflows/sync-to-coco.yml</code> 中粘贴以下内容，push 时自动同步：</p>
        <pre class="sync-code"><code>{{ actionsExample }}</code></pre>
        <button type="button" class="btn btn-sm btn-outline" @click="copyActions">
          <i :class="actionsCopied ? 'fas fa-check' : 'fas fa-copy'"></i>
          {{ actionsCopied ? '已复制' : '复制配置' }}
        </button>

        <div class="submit-actions" style="margin-top:28px">
          <button type="button" class="btn btn-primary" :disabled="syncing" @click="doSync">
            <i :class="syncing ? 'fas fa-circle-notch fa-spin' : 'fas fa-rotate'"></i>
            {{ syncing ? '正在同步…' : '立即同步' }}
          </button>
          <NuxtLink to="/" class="btn btn-outline">返回首页</NuxtLink>
        </div>

        <div v-if="syncResult" class="sync-result" :class="syncResultClass">
          <h4>同步结果：{{ syncResultText }}</h4>
          <p>
            同步 {{ syncResult.filesSynced?.length || 0 }} 个文件
            · 未变 {{ syncResult.unchanged || 0 }}
            · 删除 {{ syncResult.deleted?.length || 0 }}
            · 跳过 {{ syncResult.skipped?.length || 0 }}
          </p>
          <p v-if="syncResult.filesSynced?.length">新增/更新文件：{{ syncResult.filesSynced.join('、') }}</p>
          <p v-if="syncResult.deleted?.length">删除文件：{{ syncResult.deleted.join('、') }}</p>
          <ul v-if="syncResult.skipped?.length" class="sync-skipped-list">
            <li v-for="(s, i) in syncResult.skipped" :key="i">
              {{ s.path }} — {{ skipReason(s.reason) }}
            </li>
          </ul>
          <p v-if="syncResult.warnings?.length" class="sync-warning">
            <i class="fas fa-triangle-exclamation"></i>
            {{ syncResult.warnings.map(warningText).join('；') }}
          </p>
        </div>
      </div>
    </div>

    <!-- 绑定表单 -->
    <div v-else class="submit-layout">
      <div>
        <div class="submit-hero">
          <h1 class="submit-hero-title">
            <span class="submit-hero-icon" aria-hidden="true">
              <i class="fab fa-github"></i>
            </span>
            从 Git 仓库导入
          </h1>
          <p class="submit-hero-desc">
            绑定基于 <a href="https://github.com/zitzhen/control-template" target="_blank" rel="noopener noreferrer">zitzhen/control-template</a> 模板的 GitHub 控件仓库，增量同步版本到 CoCo-Community。
          </p>
        </div>

        <form class="submit-card card" novalidate @submit.prevent="handleBind">
          <section class="submit-section">
            <h2 class="submit-section-title">
              <i class="fas fa-circle-info" aria-hidden="true"></i> 仓库信息
            </h2>

            <div class="submit-field">
              <label class="field-label" for="repoUrl">仓库地址</label>
              <input
                id="repoUrl"
                v-model="repoUrl"
                type="text"
                class="input"
                placeholder="https://github.com/你的用户名/你的控件仓库"
                autocomplete="off"
                spellcheck="false"
                required
              />
              <p class="submit-hint">支持粘贴 GitHub 仓库链接，仓库需为公开且归属于你</p>
            </div>

            <div class="submit-field">
              <label class="field-label" for="branch">分支</label>
              <input
                id="branch"
                v-model="branch"
                type="text"
                class="input"
                placeholder="main"
                autocomplete="off"
                spellcheck="false"
              />
              <p class="submit-hint">默认 main；如果你使用其他默认分支请填写</p>
            </div>
          </section>

          <section class="submit-section">
            <h2 class="submit-section-title">
              <i class="fas fa-tag" aria-hidden="true"></i> 控件信息
            </h2>

            <div class="submit-field">
              <label class="field-label" for="controlName">控件名称</label>
              <input
                id="controlName"
                v-model="controlName"
                type="text"
                class="input submit-mono"
                placeholder="例如：MyAwesomeControl"
                autocomplete="off"
                spellcheck="false"
                maxlength="64"
                required
                @input="onNameInput"
              />
              <p class="submit-hint">唯一标识，将作为访问地址 /control/&lt;名称&gt;</p>
              <p
                v-if="nameStatus.message"
                class="submit-field-status"
                :class="nameStatus.type"
                role="status"
              >
                <i :class="nameStatus.icon" aria-hidden="true"></i>
                {{ nameStatus.message }}
              </p>
            </div>
          </section>

          <div class="submit-actions">
            <button type="submit" class="btn btn-primary btn-block" :disabled="!canBind">
              <i :class="binding ? 'fas fa-circle-notch fa-spin' : 'fas fa-link'"></i>
              {{ binding ? '正在绑定…' : '绑定仓库' }}
            </button>
            <div v-if="bindError" class="submit-feedback error" role="alert">
              <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
              {{ bindError }}
            </div>
          </div>
        </form>
      </div>

      <aside class="submit-guide-card card">
        <h2 class="submit-section-title">
          <i class="fas fa-circle-info" aria-hidden="true"></i> 仓库结构要求
        </h2>
        <ul class="submit-guide-list">
          <li>
            <i class="fas fa-folder-open" aria-hidden="true"></i>
            <span>仓库根下放 <code>README.md</code>，将展示在控件详情页。</span>
          </li>
          <li>
            <i class="fas fa-folder" aria-hidden="true"></i>
            <span>每个版本一个顶层目录，如 <code>1.0.0/</code> 或 <code>v1.0.0/</code>。</span>
          </li>
          <li>
            <i class="fas fa-file-code" aria-hidden="true"></i>
            <span>版本目录内需含 <code>information.json</code> + 至少一个 <code>.jsx</code> 控件文件。</span>
          </li>
          <li>
            <i class="fas fa-weight-hanging" aria-hidden="true"></i>
            <span>每个 .jsx 文件不得超过 100 KiB。</span>
          </li>
          <li>
            <i class="fas fa-shield-alt" aria-hidden="true"></i>
            <span>仅支持绑定你自己名下的公开仓库。</span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { checkLoginStatus } from '@/script/login'

useHead({
  title: () => '从 Git 仓库导入 | ZIT-CoCo-Community',
})

// ---------- 登录门禁 ----------
const authChecked = ref(false)
const loggedIn = ref(false)
const userLogin = ref('')

onMounted(async () => {
  try {
    const info = await checkLoginStatus()
    if (info?.authenticated) {
      loggedIn.value = true
      userLogin.value = info.user?.login || ''
    }
  } catch {
    loggedIn.value = false
  }
  authChecked.value = true
})

// ---------- 表单状态 ----------
const repoUrl = ref('')
const branch = ref('main')
const controlName = ref('')
const binding = ref(false)
const bindError = ref('')

const NAME_RE = /^[A-Za-z0-9一-鿿][A-Za-z0-9_一-鿿-]{0,63}$/

// ---------- 名称可用性检查（防抖） ----------
const nameStatus = ref({ type: '', message: '', icon: '' })
let nameCheckTimer = null
let nameCheckSeq = 0

function onNameInput() {
  clearTimeout(nameCheckTimer)
  nameStatus.value = { type: '', message: '', icon: '' }
  if (!controlName.value.trim()) return
  nameCheckTimer = setTimeout(checkName, 400)
}

async function checkName() {
  const value = controlName.value.trim()
  if (!NAME_RE.test(value)) {
    nameStatus.value = { type: 'error', message: '名称格式不正确：仅限中文、字母、数字、下划线与连字符', icon: 'fas fa-circle-exclamation' }
    return
  }

  const seq = ++nameCheckSeq
  nameStatus.value = { type: '', message: '正在检查名称…', icon: 'fas fa-circle-notch fa-spin' }

  try {
    const meta = await $fetch('/api/control-meta', { query: { name: value } })
    if (seq !== nameCheckSeq) return
    if (meta?.author && meta.author.toLowerCase() !== userLogin.value.toLowerCase()) {
      nameStatus.value = { type: 'error', message: '该名称已被其他用户占用，请更换', icon: 'fas fa-circle-xmark' }
    } else {
      nameStatus.value = { type: 'warn', message: `已存在该控件（作者：${meta.author || '未知'}），本次绑定将关联已有控件`, icon: 'fas fa-code-branch' }
    }
  } catch (err) {
    if (seq !== nameCheckSeq) return
    if (err?.statusCode === 404 || err?.status === 404) {
      nameStatus.value = { type: 'ok', message: '名称可用，将创建新控件', icon: 'fas fa-circle-check' }
    } else {
      nameStatus.value = { type: 'error', message: '检查失败，请重试', icon: 'fas fa-circle-exclamation' }
    }
  }
}

const nameValid = computed(() => NAME_RE.test(controlName.value.trim()))
const repoValid = computed(() => repoUrl.value.trim().includes('/'))
const canBind = computed(() => nameValid.value && repoValid.value && !binding.value)

// ---------- 绑定提交 ----------
const bound = ref(false)
const boundName = ref('')
const boundRepo = ref('')
const boundSecret = ref('')
const copied = ref(false)
const actionsCopied = ref(false)

const boundRepoUrl = computed(() => `https://github.com/${boundRepo.value}`)

const actionsExample = computed(() => `name: Sync to CoCo-Community
on:
  push:
    branches: [${branch.value || 'main'}]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Notify CoCo-Community sync
        run: |
          curl -X POST -H "Authorization: Bearer ${boundSecret.value}" \\
            -H "Content-Type: application/json" \\
            -d '{"controlName":"${boundName.value}"}' \\
            https://cc.zitzhen.cn/api/github-sync/sync`)

async function handleBind() {
  if (!canBind.value) return
  binding.value = true
  bindError.value = ''

  try {
    const res = await $fetch('/api/github-sync/bind', {
      method: 'POST',
      body: {
        repo: repoUrl.value.trim(),
        branch: branch.value.trim() || 'main',
        controlName: controlName.value.trim(),
      },
    })
    boundName.value = res.controlName
    boundRepo.value = res.repo
    boundSecret.value = res.syncSecret
    bound.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    const msg = err?.data?.error
    const messages = {
      invalid_repo: '仓库地址格式不正确，请粘贴 GitHub 仓库链接',
      invalid_name: '控件名称格式不正确',
      repo_not_accessible: '仓库不存在、为私有仓库或不可访问',
      repo_not_owned: '仅支持绑定你自己名下的仓库',
      name_taken_by_other: '该控件名称已被其他用户占用',
      already_bound: '该控件已绑定其他仓库，请先解绑',
      control_info_corrupted: '该控件信息异常，请联系管理员',
      bind_failed: '绑定失败，请稍后重试',
    }
    bindError.value = messages[msg] || (err?.data?.detail) || '绑定失败，请稍后重试'
  } finally {
    binding.value = false
  }
}

function copySecret() {
  navigator.clipboard?.writeText(boundSecret.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function copyActions() {
  navigator.clipboard?.writeText(actionsExample.value)
  actionsCopied.value = true
  setTimeout(() => (actionsCopied.value = false), 2000)
}

// ---------- 即时同步 ----------
const syncing = ref(false)
const syncResult = ref(null)

const syncResultClass = computed(() => {
  if (!syncResult.value) return ''
  if (syncResult.value.status === 'ok') return 'success'
  if (syncResult.value.status === 'partial') return 'warn'
  return 'error'
})

const syncResultText = computed(() => {
  const map = { ok: '全部成功', partial: '部分成功', failed: '全部失败' }
  return map[syncResult.value?.status] || syncResult.value?.status
})

function skipReason(reason) {
  const map = {
    missing_information_json: '版本目录缺少 information.json',
    missing_jsx: '版本目录缺少 .jsx 控件文件',
    jsx_too_large: '控件文件超过 100 KiB',
    readme_too_large: 'README 超过 100 KiB',
    file_too_large: '文件超过 5 MiB',
    file_type_not_allowed: '该文件类型不允许镜像（如 .html）',
    version_file_missing_from_tarball: '版本文件缺失',
    invalid_information_json: 'information.json 格式异常',
    r2_write_failed: '写入存储失败',
  }
  return map[reason] || reason
}

function warningText(warning) {
  const map = {
    tree_truncated: '仓库文件树被 GitHub 截断，结果可能不完整',
    extracted_size_limit: '超过 25 MiB 解压上限，已截断，本次未执行删除',
    file_count_limit: '超过 500 文件上限，本次未执行删除',
    deletion_aborted_threshold: '删除比例超过 30% 保护阈值，已中止删除',
  }
  return map[warning] || warning
}

async function doSync() {
  syncing.value = true
  syncResult.value = null
  try {
    const res = await $fetch('/api/github-sync/sync', {
      method: 'POST',
      body: { controlName: boundName.value },
    })
    syncResult.value = res
  } catch (err) {
    syncResult.value = {
      status: 'failed',
      added: [],
      skipped: [],
      readmeUpdated: false,
      error: err?.data?.error || '同步失败',
    }
  } finally {
    syncing.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/control-submit.css';

.sync-secret-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--muted-background);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-top: 10px;
}
.sync-secret-text {
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
  word-break: break-all;
  flex: 1;
  color: var(--foreground);
}
.sync-code {
  background: #0d1117;
  color: #c9d1d9;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.6;
  margin-top: 10px;
  white-space: pre;
}
/* 同步结果：语义色变量双主题覆盖（浅色实底 / 深色半透明底） */
.sync-result {
  --ok-fg: #047857;
  --ok-bg: #ecfdf5;
  --ok-border: #10b981;
  --warn-fg: #92400e;
  --warn-bg: #fffbeb;
  --warn-border: #f59e0b;
  --err-fg: #b91c1c;
  --err-bg: #fef2f2;
  --err-border: #ef4444;
  margin-top: 20px;
  padding: 16px;
  border-radius: 8px;
  background: var(--muted-background);
  color: var(--foreground);
}
@media (prefers-color-scheme: dark) {
  .sync-result {
    --ok-fg: #6ee7b7;
    --ok-bg: rgba(16, 185, 129, 0.12);
    --ok-border: rgba(16, 185, 129, 0.45);
    --warn-fg: #fcd34d;
    --warn-bg: rgba(245, 158, 11, 0.12);
    --warn-border: rgba(245, 158, 11, 0.45);
    --err-fg: #fca5a5;
    --err-bg: rgba(239, 68, 68, 0.12);
    --err-border: rgba(239, 68, 68, 0.45);
  }
}
.sync-result.success {
  background: var(--ok-bg);
  border: 1px solid var(--ok-border);
  color: var(--ok-fg);
}
.sync-result.warn {
  background: var(--warn-bg);
  border: 1px solid var(--warn-border);
  color: var(--warn-fg);
}
.sync-result.error {
  background: var(--err-bg);
  border: 1px solid var(--err-border);
  color: var(--err-fg);
}
.sync-skipped-list {
  margin: 8px 0 0 20px;
  padding: 0;
  color: var(--muted-foreground);
  font-size: 14px;
}
.sync-skipped-list li {
  margin-bottom: 4px;
}
.sync-warning {
  font-size: 14px;
}
</style>
