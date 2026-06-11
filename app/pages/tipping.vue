<template>
  <ContentPage eyebrow="Support" title="支持社区" description="CoCo-Community 坚持免费与开源。你可以通过参与开发、完善文档和分享项目支持社区。">
    <div class="grid gap-5 sm:grid-cols-3">
      <div v-for="item in items" :key="item.title" class="rounded-2xl border border-slate-200/70 p-5 dark:border-slate-800">
        <UIcon :name="item.icon" class="size-5 text-blue-500" />
        <h2 class="mt-4 font-bold">{{ item.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ item.description }}</p>
      </div>
    </div>
  </ContentPage>
</template>

<script setup lang="ts">
const items = [
  { title: '贡献代码', description: '修复问题、改进体验或提交新的基础能力。', icon: 'i-lucide-code-2' },
  { title: '完善文档', description: '让控件更容易被理解、安装和安全使用。', icon: 'i-lucide-book-open' },
  { title: '分享社区', description: '向更多 CoCo 开发者介绍优秀开源项目。', icon: 'i-lucide-share-2' }
]
useSeoMeta({ title: '支持社区', description: '通过代码、文档与分享支持 CoCo-Community。' })
</script>
