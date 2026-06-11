<template>
  <ContentPage
    eyebrow="GitHub"
    title="社区议题"
    description="问题反馈、功能建议和开发讨论统一在 GitHub Issues 中公开进行。"
  >
    <div class="rounded-2xl bg-slate-950 p-7 text-white">
      <UIcon name="i-simple-icons-github" class="size-8" />
      <h2 class="mt-6 text-2xl font-bold">参与公开讨论</h2>
      <p class="mt-3 max-w-xl leading-7 text-slate-400">在提交前请搜索已有议题，并提供复现步骤、浏览器环境和必要截图。</p>
      <div class="mt-7 flex flex-wrap gap-3">
        <UButton to="https://github.com/zitzhen/CoCo-Community/issues" target="_blank">浏览 Issues</UButton>
        <UButton to="https://github.com/zitzhen/CoCo-Community/issues/new" target="_blank" color="neutral" variant="outline">创建 Issue</UButton>
      </div>
    </div>
  </ContentPage>
</template>

<script setup lang="ts">
useSeoMeta({ title: '社区议题', description: '通过 GitHub Issues 参与 CoCo-Community 问题反馈和功能讨论。' })
</script>
