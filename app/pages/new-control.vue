<template>
  <div class="page-shell py-14 sm:py-20">
    <div class="mx-auto max-w-3xl">
      <SectionHeading
        eyebrow="Publish"
        title="发布开源控件"
        description="CoCo-Community 通过 GitHub 协作维护控件质量。准备好项目资料后，创建贡献请求即可开始审核。"
      />

      <div class="mt-10 grid gap-5 sm:grid-cols-3">
        <div v-for="(step, index) in steps" :key="step.title" class="surface rounded-2xl p-5">
          <span class="font-mono text-sm text-blue-500">0{{ index + 1 }}</span>
          <h2 class="mt-4 font-bold">{{ step.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ step.description }}</p>
        </div>
      </div>

      <div class="surface mt-8 rounded-3xl p-7 sm:p-9">
        <div class="flex items-start gap-4">
          <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-500"><UIcon name="i-lucide-file-check-2" /></span>
          <div>
            <h2 class="text-lg font-bold">提交前检查</h2>
            <ul class="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li v-for="item in checklist" :key="item" class="flex gap-2"><UIcon name="i-lucide-check" class="mt-0.5 shrink-0 text-emerald-500" /> {{ item }}</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <UButton
            to="https://github.com/zitzhen/CoCo-Community/blob/main/CONTRIBUTING.md"
            target="_blank"
            size="lg"
            icon="i-lucide-book-open"
          >
            阅读贡献指南
          </UButton>
          <UButton
            to="https://github.com/zitzhen/CoCo-Community/pulls"
            target="_blank"
            size="lg"
            color="neutral"
            variant="outline"
            icon="i-simple-icons-github"
          >
            创建 Pull Request
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { title: '准备控件', description: '整理 JSX 文件、版本号、README 和截图。' },
  { title: '提交代码', description: 'Fork 仓库并按现有目录规范添加控件资源。' },
  { title: '社区审核', description: '维护者检查安全性、可用性与文档完整度。' }
]

const checklist = [
  '控件代码不包含恶意行为、远程执行或隐私收集',
  'README 清楚描述用途、安装方法和使用示例',
  '提供准确的作者、版本与开源许可证信息',
  '截图不含敏感信息并能够代表实际使用效果'
]

useSeoMeta({ title: '发布控件', description: '向 CoCo-Community 提交并发布开源控件。', robots: 'noindex, follow' })
</script>
