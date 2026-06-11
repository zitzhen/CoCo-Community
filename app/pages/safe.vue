<template>
  <ContentPage
    eyebrow="Security"
    title="安全中心"
    description="安全是控件生态的基础。我们通过透明规则、最小权限与社区反馈持续降低风险。"
  >
    <div class="grid gap-5 sm:grid-cols-2">
      <div v-for="item in practices" :key="item.title" class="rounded-2xl border border-slate-200/70 p-5 dark:border-slate-800">
        <UIcon :name="item.icon" class="size-5 text-emerald-500" />
        <h2 class="mt-4 font-bold">{{ item.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ item.description }}</p>
      </div>
    </div>
    <div class="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
      <h2 class="font-bold">报告安全问题</h2>
      <p class="mt-2 text-sm leading-6 text-slate-400">请不要在公开 Issue 中披露可被利用的漏洞。通过仓库 Security Policy 提交报告。</p>
      <UButton to="https://github.com/zitzhen/CoCo-Community/security/policy" target="_blank" class="mt-5" color="neutral" variant="solid">查看安全政策</UButton>
    </div>
  </ContentPage>
</template>

<script setup lang="ts">
const practices = [
  { title: '最小权限 OAuth', description: '仅使用 GitHub 公开身份完成登录，不获取密码与私有仓库。', icon: 'i-lucide-key-round' },
  { title: 'HTTPS 传输', description: '生产环境通过 Cloudflare 强制加密连接并保护会话 Cookie。', icon: 'i-lucide-lock-keyhole' },
  { title: '开源审查', description: '控件通过代码评审进入仓库，风险行为可被社区共同检查。', icon: 'i-lucide-code-search' },
  { title: '边缘防护', description: '使用 Cloudflare 网络提供基础攻击缓解与全球分发。', icon: 'i-simple-icons-cloudflare' }
]

useSeoMeta({ title: '安全中心', description: 'CoCo-Community 的安全实践、OAuth 权限与漏洞报告方式。' })
</script>
