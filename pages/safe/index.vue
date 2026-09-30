<template>
  <div class="page-container safe-page">
    <!-- Toast 通知 -->
    <Transition name="toast">
      <div v-if="toastVisible" class="safe-toast" :class="{ 'safe-toast--success': toastType === 'success' }" role="alert">
        <i class="fas" :class="toastType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'" aria-hidden="true"></i>
        <span class="safe-toast-message">{{ toastMessage }}</span>
        <button type="button" class="safe-toast-close" aria-label="关闭" @click="toastVisible = false">
          <i class="fas fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>

    <!-- 面包屑 -->
    <nav class="safe-breadcrumb" aria-label="面包屑导航">
      <ol>
        <li><NuxtLink to="/">首页</NuxtLink></li>
        <li aria-current="page">安全中心</li>
      </ol>
    </nav>

    <!-- 页面头部 -->
    <header class="safe-header">
      <div class="safe-header-icon" aria-hidden="true">
        <i class="fas fa-shield-alt"></i>
      </div>
      <div class="safe-header-main">
        <h1>安全漏洞报告中心</h1>
        <p>我们非常重视产品的安全性。如果您发现了任何安全漏洞或潜在风险，请通过此页面提交报告。</p>
      </div>
    </header>

    <!-- 重要提示 -->
    <div class="safe-alert safe-alert--warning">
      <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
      <div>
        <strong>重要提示：</strong>请不要在公开场合讨论未修复的安全漏洞。请通过此安全渠道私下报告安全问题。
      </div>
    </div>

    <!-- 两栏布局 -->
    <div class="safe-content-grid">
      <!-- 左侧：表单 -->
      <div>
        <!-- 成功状态 -->
        <div v-if="submitted" class="safe-success-card">
          <div class="safe-success-icon" aria-hidden="true">
            <i class="fas fa-circle-check"></i>
          </div>
          <h2>报告提交成功</h2>
          <p>
            感谢您的报告！我们的安全团队会尽快审查并在确认后与您取得联系。<br>
            报告编号：<span class="report-id">#{{ reportId }}</span>
          </p>
          <button type="button" class="btn btn-primary" @click="resetForm">提交新的报告</button>
        </div>

        <!-- 表单 -->
        <div v-else class="safe-form-card">
          <h2>提交漏洞报告</h2>
          <form @submit.prevent="handleSubmit">
            <div class="safe-form-group">
              <label for="reporterName" class="safe-form-label">您的姓名/昵称</label>
              <input id="reporterName" v-model="form.reporterName" type="text" class="safe-form-input" required
                     placeholder="请输入您的姓名或昵称" />
            </div>

            <div class="safe-form-group">
              <label for="reporterEmail" class="safe-form-label">联系邮箱</label>
              <input id="reporterEmail" v-model="form.reporterEmail" type="email" class="safe-form-input" required
                     placeholder="用于接收确认邮件和后续沟通" />
            </div>

            <div class="safe-form-group">
              <label for="affectedComponent" class="safe-form-label">受影响的组件/功能</label>
              <input id="affectedComponent" v-model="form.affectedComponent" type="text" class="safe-form-input" required
                     placeholder="例如: 文件上传功能、用户认证系统等" />
            </div>

            <div class="safe-form-group">
              <label class="safe-form-label">漏洞严重程度</label>
              <div class="safe-severity-group">
                <div v-for="opt in severityOptions" :key="opt.value"
                     class="safe-severity-option"
                     :class="[`safe-severity-option--${opt.value}`, { selected: form.severity === opt.value }]"
                     @click="form.severity = opt.value">
                  {{ opt.label }}
                </div>
              </div>
            </div>

            <div class="safe-form-group">
              <label for="description" class="safe-form-label">漏洞详细描述</label>
              <textarea id="description" v-model="form.description" class="safe-form-input" required
                        placeholder="请详细描述漏洞的发现过程、利用方式以及可能造成的影响"></textarea>
            </div>

            <div class="safe-form-group">
              <label for="reproduceSteps" class="safe-form-label">重现步骤</label>
              <textarea id="reproduceSteps" v-model="form.reproduceSteps" class="safe-form-input" required
                        placeholder="1. 第一步操作...&#10;2. 第二步操作...&#10;3. 观察到的结果..."></textarea>
            </div>

            <div class="safe-form-group">
              <label for="additionalInfo" class="safe-form-label">附加信息</label>
              <textarea id="additionalInfo" v-model="form.additionalInfo" class="safe-form-input"
                        placeholder="任何其他有助于我们理解问题的信息（可选）"></textarea>
            </div>

            <div class="safe-form-group">
              <button type="submit" class="btn btn-primary safe-submit-btn" :disabled="submitting">
                <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'" aria-hidden="true"></i>
                {{ submitting ? '正在提交...' : '提交漏洞报告' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 右侧：侧边栏 -->
      <div class="safe-sidebar">
        <!-- 安全公告 -->
        <div class="safe-sidebar-card">
          <h3><i class="fas fa-bullhorn" aria-hidden="true"></i> 安全公告</h3>
          <ul class="safe-disclosure-list">
            <li v-for="(item, index) in announcements" :key="index" class="safe-disclosure-item">
              <div class="safe-disclosure-title">
                <i :class="item.icon" :style="{ color: item.color }" aria-hidden="true"></i>
                {{ item.title }}
                <span class="safe-disclosure-date">{{ item.date }}</span>
              </div>
              <div class="safe-disclosure-desc">{{ item.description }}</div>
            </li>
          </ul>
        </div>

        <!-- 漏洞奖励计划 -->
        <div class="safe-sidebar-card">
          <h3><i class="fas fa-gift" aria-hidden="true"></i> 漏洞奖励计划</h3>
          <div class="safe-reward-banner">
            <i class="fas fa-award" aria-hidden="true"></i>
            <strong>我们感谢您的贡献！</strong>
            对于高质量的安全漏洞报告，我们可能会提供奖励或公开致谢。
          </div>
          <p>奖励标准包括但不限于：</p>
          <ul>
            <li v-for="(criterion, index) in rewardCriteria" :key="index">{{ criterion }}</li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div class="safe-sidebar-card">
          <h3><i class="fas fa-envelope" aria-hidden="true"></i> 联系我们</h3>
          <div class="safe-contact-list">
            <div v-for="(contact, index) in contactMethods" :key="index" class="safe-contact-item">
              <i :class="contact.icon" aria-hidden="true"></i>
              <span>{{ contact.details }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '安全中心 | CoCo-Community',
  meta: [
    { name: 'description', content: 'CoCo-Community 安全漏洞报告中心，如果您发现任何安全漏洞或潜在风险，请向我们报告。' }
  ]
})

const form = reactive({
  reporterName: '',
  reporterEmail: '',
  affectedComponent: '',
  severity: '',
  description: '',
  reproduceSteps: '',
  additionalInfo: ''
})

const severityOptions = [
  { value: 'critical', label: '严重' },
  { value: 'high', label: '高危' },
  { value: 'medium', label: '中危' },
  { value: 'low', label: '低危' }
]

const announcements = [
  {
    title: 'Github',
    date: '2025-05-19',
    description: '修复了一个意外通过Github无法访问作品的BUG',
    icon: 'fas fa-check-circle',
    color: '#2ecc71'
  },
  {
    title: '无法访问',
    date: '2025-09-24',
    description: '我们正在调查一个可能影响用户访问的问题。更多信息将在确认后公布。',
    icon: 'fas fa-exclamation-triangle',
    color: '#e74c3c'
  }
]

const rewardCriteria = [
  '漏洞的严重程度',
  '报告的清晰度和完整性',
  '漏洞的潜在影响范围'
]

const contactMethods = [
  { icon: 'fas fa-envelope', details: 'coco-community-security-center@zit.email' },
  { icon: 'fas fa-comment-alt', details: 'Signal: +86 181 3824 7313' },
  { icon: 'fas fa-comment-alt', details: 'Wechat: hi_liu-xiaozhen' },
  { icon: 'fas fa-comment-alt', details: 'QQ:1967237096' }
]

const submitting = ref(false)
const submitted = ref(false)
const reportId = ref(0)
const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('error')

function showToast(message, type = 'error') {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 4000)
}

function validateForm() {
  if (!form.reporterName.trim() || !form.reporterEmail.trim() ||
      !form.affectedComponent.trim() || !form.severity ||
      !form.description.trim() || !form.reproduceSteps.trim()) {
    showToast('请填写所有必填字段')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.reporterEmail)) {
    showToast('请输入有效的邮箱地址')
    return false
  }
  return true
}

async function handleSubmit() {
  if (submitting.value) return
  if (!validateForm()) return

  submitting.value = true
  try {
    const res = await $fetch('/api/safe/report', {
      method: 'POST',
      body: {
        reporterName: form.reporterName.trim(),
        reporterEmail: form.reporterEmail.trim(),
        affectedComponent: form.affectedComponent.trim(),
        severity: form.severity,
        description: form.description.trim(),
        reproduceSteps: form.reproduceSteps.trim(),
        additionalInfo: form.additionalInfo.trim()
      }
    })
    reportId.value = res.id
    submitted.value = true
    showToast('报告提交成功！', 'success')
  } catch (err) {
    const data = err?.data || {}
    const msgMap = {
      missing_field: '请填写所有必填字段',
      invalid_email: '请输入有效的邮箱地址',
      invalid_severity: '请选择有效的严重程度',
      field_too_long: data.detail || '输入内容过长',
      too_frequent: '提交过于频繁，请稍后再试',
      db_error: '服务器内部错误，请稍后再试',
      'Forbidden: Invalid origin': '请求来源不被允许'
    }
    showToast(msgMap[data.error] || data.detail || data.error || '提交失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.reporterName = ''
  form.reporterEmail = ''
  form.affectedComponent = ''
  form.severity = ''
  form.description = ''
  form.reproduceSteps = ''
  form.additionalInfo = ''
  submitted.value = false
  reportId.value = 0
}
</script>

<style>
@import url(@/assets/css/dark.css);
@import url(@/assets/css/safe.css);
</style>
