<template>
  <div>
    <section class="relative overflow-hidden border-b border-slate-200/70 py-20 dark:border-slate-800">
      <div class="soft-grid absolute inset-0" />
      <div class="page-shell relative text-center">
        <UBadge color="primary" variant="subtle">About</UBadge>
        <h1 class="mt-5 text-4xl font-black tracking-tight sm:text-6xl">为 CoCo 开发者构建的<br><span class="gradient-text">开放社区</span></h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500 dark:text-slate-400">
          CoCo-Community 由小圳工作室发起，通过开放协作连接控件作者与创作者，让优秀能力被更容易地发现和复用。
        </p>
      </div>
    </section>

    <section class="section-space">
      <div class="page-shell grid gap-6 md:grid-cols-3">
        <div v-for="value in values" :key="value.title" class="surface rounded-2xl p-7">
          <span class="grid size-11 place-items-center rounded-xl bg-blue-500/10 text-blue-500"><UIcon :name="value.icon" /></span>
          <h2 class="mt-5 text-xl font-bold">{{ value.title }}</h2>
          <p class="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{{ value.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const values = [
  { title: '开放协作', description: '平台代码、控件内容与贡献流程保持公开，让社区共同参与建设。', icon: 'i-lucide-git-pull-request-arrow' },
  { title: '开发者优先', description: '围绕发现、文档、版本和分发体验设计，减少发布与使用成本。', icon: 'i-lucide-terminal' },
  { title: '长期可信', description: '依托 GitHub、Cloudflare 与明确的安全规则构建可持续基础设施。', icon: 'i-lucide-shield-check' }
]

useSeoMeta({
  title: '关于我们',
  description: '了解 CoCo-Community 的使命、开源协作方式和社区价值。',
  ogTitle: '关于 CoCo-Community',
  twitterCard: 'summary'
})
</script>
