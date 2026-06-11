<template>
  <ContentPage eyebrow="Legal" title="协议与政策" description="了解使用 CoCo-Community 服务和社区内容时适用的规则。">
    <div class="grid gap-4 sm:grid-cols-3">
      <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="group rounded-2xl border border-slate-200/70 p-5 transition hover:border-blue-300 dark:border-slate-800">
        <UIcon :name="item.icon" class="size-5 text-blue-500" />
        <h2 class="mt-4 font-bold">{{ item.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ item.description }}</p>
        <UIcon name="i-lucide-arrow-right" class="mt-5 text-slate-400 group-hover:text-blue-500" />
      </NuxtLink>
    </div>
  </ContentPage>
</template>

<script setup lang="ts">
const items = [
  { title: '用户协议', description: '账户、内容发布与社区行为规则。', to: '/agreement/useragreement', icon: 'i-lucide-scroll-text' },
  { title: '隐私政策', description: '数据收集、使用和用户权利说明。', to: '/agreement/privacypolicy', icon: 'i-lucide-shield-check' },
  { title: '开源协议', description: '平台代码与控件内容的许可边界。', to: '/agreement/license', icon: 'i-lucide-scale' }
]

useSeoMeta({ title: '协议与政策', description: 'CoCo-Community 用户协议、隐私政策和开源许可。' })
</script>
