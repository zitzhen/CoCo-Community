<template>
  <div class="submit-page page-container">
    <!-- 面包屑 -->
    <nav class="submit-breadcrumb" aria-label="面包屑导航">
      <ol>
        <li><NuxtLink to="/">首页</NuxtLink></li>
        <li><NuxtLink to="/#resources">资源</NuxtLink></li>
        <li aria-current="page">提交控件</li>
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
      <h1 class="submit-gate-title">登录后即可提交控件</h1>
      <p class="submit-gate-desc">
        提交控件需要验证 GitHub 账号身份，用于标注控件作者与保护你的控件名称。<br />
        请先使用 GitHub 登录，再来分享你的作品。
      </p>
      <a
        href="https://github.com/login/oauth/authorize?client_id=Ov23lii4E31EzV9VMW7B&redirect_uri=https://cc.zitzhen.cn/auth/github?client=web"
        class="submit-github-btn"
      >
        <i class="fab fa-github" aria-hidden="true"></i>
        使用 GitHub 登录
      </a>
      <div class="submit-gate-links">
        登录即代表同意
        <NuxtLink to="/agreement/useragreement">《用户协议》</NuxtLink>
        与
        <NuxtLink to="/agreement/privacypolicy">《隐私政策》</NuxtLink>
      </div>
    </div>

    <!-- 提交成功 -->
    <div v-else-if="submitted" class="submit-success card">
      <span class="submit-success-icon" aria-hidden="true">
        <i class="fas fa-check"></i>
      </span>
      <h1 class="submit-success-title">提交成功</h1>
      <p class="submit-success-desc">
        控件
        <strong>{{ submittedName }}</strong>
        （v{{ submittedVersion }}）已发布，社区成员现在可以浏览和下载它了。
      </p>
      <div class="submit-success-actions">
        <NuxtLink :to="`/control/${encodeURIComponent(submittedName)}`" class="btn btn-primary">
          <i class="fas fa-eye" aria-hidden="true"></i>
          查看控件
        </NuxtLink>
        <button type="button" class="btn btn-outline" @click="resetForm">
          <i class="fas fa-plus" aria-hidden="true"></i>
          继续提交
        </button>
      </div>
    </div>

    <!-- 提交表单 -->
    <div v-else class="submit-layout">
      <div>
        <!-- 页面头部 -->
        <!-- 用 div 而非 header：旧页面的全局 header { background: var(--primary-color) }
             会在 SPA 导航后残留，把语义化 header 染成蓝底 -->
        <div class="submit-hero">
          <h1 class="submit-hero-title">
            <span class="submit-hero-icon" aria-hidden="true">
              <i class="fas fa-cloud-arrow-up"></i>
            </span>
            提交控件
          </h1>
          <p class="submit-hero-desc">
            分享你的 CoCo 自定义控件，让代码"发扬光大"。提交后即刻发布到资源区。
          </p>
        </div>

        <form class="submit-card card" novalidate @submit.prevent="handleSubmit">
          <!-- 基本信息 -->
          <section class="submit-section">
            <h2 class="submit-section-title">
              <i class="fas fa-circle-info" aria-hidden="true"></i>
              基本信息
            </h2>

            <div class="submit-field">
              <label class="field-label" for="controlName">控件名称</label>
              <input
                id="controlName"
                v-model="name"
                type="text"
                class="input submit-mono"
                placeholder="例如：MyAwesomeControl"
                autocomplete="off"
                spellcheck="false"
                maxlength="64"
                required
                @input="onNameInput"
              />
              <p class="submit-hint">
                唯一标识，仅限字母、数字、下划线与连字符，将作为访问地址 /control/&lt;名称&gt;
              </p>
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

            <div class="submit-field">
              <label class="field-label" for="controlVersion">版本号</label>
              <input
                id="controlVersion"
                v-model="version"
                type="text"
                class="input submit-mono"
                placeholder="1.0.0"
                autocomplete="off"
                spellcheck="false"
                maxlength="16"
                required
              />
              <p class="submit-hint">使用数字版本号（如 1.0.0）；对已有控件提交即发布新版本</p>
            </div>
          </section>

          <!-- 控件文件 -->
          <section class="submit-section">
            <h2 class="submit-section-title">
              <i class="fas fa-file-code" aria-hidden="true"></i>
              控件文件
            </h2>

            <input
              ref="fileInputRef"
              type="file"
              accept=".jsx"
              style="display: none"
              aria-label="选择控件文件"
              @change="onFileChange"
            />

            <template v-if="!file">
              <div
                class="submit-dropzone"
                role="button"
                tabindex="0"
                aria-label="点击或拖拽 .jsx 控件文件到此处"
                @click="fileInputRef?.click()"
                @keydown.enter.prevent="fileInputRef?.click()"
                @keydown.space.prevent="fileInputRef?.click()"
                @dragover.prevent="dragover = true"
                @dragleave.prevent="dragover = false"
                @drop.prevent="onDrop"
                :class="{ dragover }"
              >
                <i class="fas fa-file-arrow-up submit-dropzone-icon" aria-hidden="true"></i>
                <div class="submit-dropzone-text">点击或拖拽文件到此处</div>
                <div class="submit-dropzone-hint">仅支持 .jsx 文件，最大 100 KiB</div>
              </div>
            </template>

            <div v-else class="submit-file">
              <span class="submit-file-icon" aria-hidden="true">
                <i class="fas fa-file-code"></i>
              </span>
              <div class="submit-file-info">
                <div class="submit-file-name">{{ file.name }}</div>
                <div class="submit-file-size">{{ formatSize(file.size) }}</div>
              </div>
              <button
                type="button"
                class="submit-file-remove"
                aria-label="移除已选择的文件"
                @click="clearFile"
              >
                <i class="fas fa-xmark" aria-hidden="true"></i>
              </button>
            </div>

            <p v-if="fileError" class="submit-field-status error" role="alert">
              <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
              {{ fileError }}
            </p>
          </section>

          <!-- README 简介 -->
          <section class="submit-section">
            <h2 class="submit-section-title">
              <i class="fas fa-book" aria-hidden="true"></i>
              README 简介（可选）
            </h2>

            <div class="submit-md-tabs" role="tablist" aria-label="README 编辑方式">
              <button
                type="button"
                class="submit-md-tab"
                :class="{ active: mdTab === 'write' }"
                role="tab"
                :aria-selected="mdTab === 'write'"
                @click="mdTab = 'write'"
              >
                编辑
              </button>
              <button
                type="button"
                class="submit-md-tab"
                :class="{ active: mdTab === 'preview' }"
                role="tab"
                :aria-selected="mdTab === 'preview'"
                @click="mdTab = 'preview'"
              >
                预览
              </button>
            </div>

            <textarea
              v-if="mdTab === 'write'"
              v-model="readme"
              class="input submit-md-editor"
              placeholder="使用 Markdown 介绍控件的用途、使用方法与注意事项…"
              spellcheck="false"
            ></textarea>
            <div v-else class="submit-md-preview prose">
              <MarkdownView v-if="readme.trim()" :content="readme" />
              <p v-else class="submit-hint" style="margin: 0">暂无内容，切换到"编辑"开始撰写</p>
            </div>

            <p class="submit-hint">将以 README.md 保存，展示在控件详情页</p>
          </section>

          <!-- 提交 -->
          <div class="submit-actions">
            <button type="submit" class="btn btn-primary btn-block" :disabled="!canSubmit">
              <i :class="submitting ? 'fas fa-circle-notch fa-spin' : 'fas fa-paper-plane'" aria-hidden="true"></i>
              {{ submitting ? "正在提交…" : "提交控件" }}
            </button>

            <div v-if="submitError" class="submit-feedback error" role="alert">
              <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
              {{ submitError }}
            </div>
          </div>
        </form>
      </div>

      <!-- 侧栏：提交须知 -->
      <aside class="submit-guide-card card">
        <h2 class="submit-section-title">
          <i class="fas fa-circle-info" aria-hidden="true"></i>
          提交须知
        </h2>
        <ul class="submit-guide-list">
          <li>
            <i class="fas fa-user-shield" aria-hidden="true"></i>
            <span>控件作者将标注为你的 GitHub 用户名（<code>{{ userLogin || "?" }}</code>），仅作者本人可以为控件发布新版本。</span>
          </li>
          <li>
            <i class="fas fa-tag" aria-hidden="true"></i>
            <span>请勿上传受版权保护的材料，除非你拥有版权或获得明确许可。</span>
          </li>
          <li>
            <i class="fas fa-shield-alt" aria-hidden="true"></i>
            <span>严禁上传恶意软件、病毒或任何有害内容。</span>
          </li>
          <li>
            <i class="fas fa-weight-hanging" aria-hidden="true"></i>
            <span>控件文件与 README 均不得超过 100 KiB。</span>
          </li>
          <li>
            <i class="fas fa-code-branch" aria-hidden="true"></i>
            <span>重复提交同名版本会覆盖旧文件，请确认版本号后再提交。</span>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { checkLoginStatus } from '@/script/login'
import MarkdownView from '@/components/MarkdownView.vue'

useHead({
  title: () => `提交控件|ZIT-CoCo-Community`,
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
const name = ref('')
const version = ref('1.0.0')
const file = ref(null)
const fileError = ref('')
const readme = ref('')
const mdTab = ref('write')
const fileInputRef = ref(null)
const dragover = ref(false)

const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/
const VERSION_RE = /^\d{1,4}(\.\d{1,4}){0,3}$/
const MAX_FILE_SIZE = 100 * 1024

// ---------- 名称可用性检查（防抖） ----------
const nameStatus = ref({ type: '', message: '', icon: '' })
let nameCheckTimer = null
let nameCheckSeq = 0

function onNameInput() {
  clearTimeout(nameCheckTimer)
  nameStatus.value = { type: '', message: '', icon: '' }
  if (!name.value.trim()) return

  nameCheckTimer = setTimeout(checkName, 400)
}

async function checkName() {
  const value = name.value.trim()
  if (!NAME_RE.test(value)) {
    nameStatus.value = { type: 'error', message: '名称格式不正确：仅限字母、数字、下划线与连字符', icon: 'fas fa-circle-exclamation' }
    return
  }

  const seq = ++nameCheckSeq
  nameStatus.value = { type: '', message: '正在检查名称…', icon: 'fas fa-circle-notch fa-spin' }

  try {
    const meta = await $fetch('/api/control-meta', { query: { name: value } })
    if (seq !== nameCheckSeq) return
    if (meta?.author && meta.author !== userLogin.value) {
      nameStatus.value = { type: 'error', message: '该名称已被其他用户占用，请更换', icon: 'fas fa-circle-xmark' }
    } else {
      nameStatus.value = { type: 'warn', message: `已存在该控件（作者：${meta.author || '未知'}），本次提交将发布新版本`, icon: 'fas fa-code-branch' }
    }
  } catch (err) {
    if (seq !== nameCheckSeq) return
    if (err?.statusCode === 404 || err?.status === 404) {
      nameStatus.value = { type: 'ok', message: '名称可用，将创建新控件', icon: 'fas fa-circle-check' }
    } else {
      nameStatus.value = { type: '', message: '', icon: '' }
    }
  }
}

// ---------- 文件选择 ----------
function acceptFile(selected) {
  fileError.value = ''
  if (!selected) return
  if (!/\.jsx$/i.test(selected.name)) {
    fileError.value = '仅支持 .jsx 文件'
    return
  }
  if (selected.size > MAX_FILE_SIZE) {
    fileError.value = `文件超过大小限制（当前 ${formatSize(selected.size)}，上限 100 KiB）`
    return
  }
  file.value = selected
}

function onFileChange(event) {
  acceptFile(event.target.files?.[0] || null)
}

function onDrop(event) {
  dragover.value = false
  acceptFile(event.dataTransfer?.files?.[0] || null)
}

function clearFile() {
  file.value = null
  fileError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

// ---------- 提交 ----------
const submitting = ref(false)
const submitError = ref('')
const submitted = ref(false)
const submittedName = ref('')
const submittedVersion = ref('')

const nameValid = computed(() => NAME_RE.test(name.value.trim()))
const versionValid = computed(() => VERSION_RE.test(version.value.trim()))
const canSubmit = computed(
  () => nameValid.value && versionValid.value && file.value && !submitting.value
)

async function handleSubmit() {
  if (!canSubmit.value) {
    if (!nameValid.value) nameStatus.value = { type: 'error', message: '请填写符合规则的控件名称', icon: 'fas fa-circle-exclamation' }
    else if (!versionValid.value) submitError.value = '版本号格式不正确，示例：1.0.0'
    else if (!file.value) fileError.value = '请选择 .jsx 控件文件'
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const form = new FormData()
    form.append('name', name.value.trim())
    form.append('version', version.value.trim())
    form.append('readme', readme.value)
    form.append('file', file.value)

    const res = await $fetch('/api/control-submit', { method: 'POST', body: form })
    // 清掉 SPA 会话内的列表缓存，返回首页/搜索时强制重新拉取（服务端缓存已由接口清理）
    clearNuxtData('control-list')
    submittedName.value = res.name || name.value.trim()
    submittedVersion.value = res.version || version.value.trim()
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    const status = err?.statusCode || err?.status
    if (status === 401) {
      loggedIn.value = false
      submitError.value = ''
    } else {
      const messages = {
        name_taken_by_other: '该名称已被其他用户占用，请更换名称',
        invalid_name: '控件名称格式不正确',
        invalid_version: '版本号格式不正确，示例：1.0.0',
        invalid_file_type: '仅支持 .jsx 文件',
        file_too_large: '控件文件超过 100 KiB 限制',
        readme_too_large: 'README 超过 100 KiB 限制',
        missing_file: '请选择控件文件',
        control_info_corrupted: '该控件信息异常，请联系管理员',
      }
      submitError.value = messages[err?.data?.error] || '提交失败，请稍后重试'
    }
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  name.value = ''
  version.value = '1.0.0'
  readme.value = ''
  mdTab.value = 'write'
  clearFile()
  nameStatus.value = { type: '', message: '', icon: '' }
  submitted.value = false
}
</script>

<style scoped>
@import '@/assets/css/control-submit.css';
</style>
