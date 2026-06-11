<template>
  <div v-if="control && information">
    <section class="relative overflow-hidden border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div class="soft-grid absolute inset-0 opacity-70" />
      <div class="absolute right-10 top-10 size-64 rounded-full bg-violet-500/10 blur-3xl" />
      <div class="page-shell relative py-14 sm:py-20">
        <UBreadcrumb :items="breadcrumbs" class="mb-8" />
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div class="grid size-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-4xl font-black text-white shadow-2xl shadow-blue-500/20">
              {{ controlInitial(control.name) }}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <UBadge color="primary" variant="subtle">{{ getControlCategory(control.name) }}</UBadge>
                <UBadge color="neutral" variant="soft">v{{ information.Current_version }}</UBadge>
              </div>
              <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">{{ control.name }}</h1>
              <NuxtLink :to="`/user/${information.author}`" class="mt-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500">
                <UIcon name="i-lucide-circle-user-round" />
                由 {{ information.author }} 发布
              </NuxtLink>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <UButton color="neutral" variant="outline" size="lg" icon="i-lucide-code-2" :to="sourceUrl" target="_blank">
              查看源码
            </UButton>
            <UButton size="lg" icon="i-lucide-download" @click="downloadControl">
              下载控件
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <div class="page-shell grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div class="min-w-0 space-y-8">
        <section v-if="visibleScreenshots.length" class="surface rounded-3xl p-5 sm:p-7">
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl font-bold">截图预览</h2>
            <span class="text-xs text-slate-400">{{ visibleScreenshots.length }} 张</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <img
              v-for="image in screenshotCandidates"
              v-show="!failedImages.has(image)"
              :key="image"
              :src="image"
              :alt="`${control.name} 截图`"
              class="aspect-video w-full rounded-2xl border border-slate-200 bg-slate-100 object-contain dark:border-slate-800 dark:bg-slate-900"
              loading="lazy"
              @error="markImageFailed(image)"
            >
          </div>
        </section>

        <section class="surface rounded-3xl p-6 sm:p-9">
          <div class="flex items-center gap-3 border-b border-slate-200/70 pb-5 dark:border-slate-800">
            <UIcon name="i-lucide-book-open-text" class="size-5 text-blue-500" />
            <h2 class="text-xl font-bold">README</h2>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article class="prose-community mt-6" v-html="readmeHtml" />
        </section>

        <section class="surface rounded-3xl p-6 sm:p-9">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-history" class="size-5 text-violet-500" />
            <h2 class="text-xl font-bold">更新记录</h2>
          </div>
          <div class="mt-6 space-y-3">
            <div
              v-for="(version, index) in versions"
              :key="version"
              class="flex items-center justify-between rounded-xl border border-slate-200/70 px-4 py-3 dark:border-slate-800"
            >
              <div class="flex items-center gap-3">
                <span class="size-2 rounded-full" :class="index === 0 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'" />
                <span class="font-mono text-sm">v{{ version }}</span>
              </div>
              <UBadge v-if="index === 0" color="success" variant="subtle" size="sm">Latest</UBadge>
            </div>
          </div>
        </section>

        <section v-if="relatedControls.length">
          <SectionHeading title="相关控件" description="浏览同类或来自同一开发者的更多项目。" />
          <div class="mt-6 grid gap-5 sm:grid-cols-2">
            <ControlCard v-for="item in relatedControls" :key="item.id" :control="item" />
          </div>
        </section>
      </div>

      <aside class="space-y-5">
        <div class="surface rounded-2xl p-5">
          <h2 class="text-sm font-bold">安装方式</h2>
          <ol class="mt-4 space-y-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            <li class="flex gap-3"><span class="text-blue-500">01</span> 下载最新版本 JSX 文件</li>
            <li class="flex gap-3"><span class="text-blue-500">02</span> 在 CoCo 编辑器中导入自定义控件</li>
            <li class="flex gap-3"><span class="text-blue-500">03</span> 按 README 配置并开始使用</li>
          </ol>
        </div>
        <div class="surface rounded-2xl p-5">
          <h2 class="text-sm font-bold">项目信息</h2>
          <dl class="mt-4 space-y-4 text-sm">
            <div class="flex justify-between gap-4"><dt class="text-slate-400">版本</dt><dd class="font-mono">{{ information.Current_version }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-400">大小</dt><dd>{{ control.size }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-400">下载</dt><dd>{{ formatNumber(control.downloads) }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-400">浏览</dt><dd>{{ formatNumber(control.Pageviews) }}</dd></div>
            <div class="flex justify-between gap-4"><dt class="text-slate-400">许可证</dt><dd>开源</dd></div>
          </dl>
        </div>
        <NuxtLink :to="`/user/${information.author}`" class="surface block rounded-2xl p-5 transition hover:border-blue-300">
          <p class="text-xs uppercase tracking-wider text-slate-400">Developer</p>
          <div class="mt-3 flex items-center gap-3">
            <UAvatar :src="`https://github.com/${information.author}.png`" :alt="information.author" />
            <div class="min-w-0">
              <p class="truncate font-bold">{{ information.author }}</p>
              <p class="text-xs text-slate-400">查看开发者主页</p>
            </div>
            <UIcon name="i-lucide-arrow-up-right" class="ml-auto text-slate-400" />
          </div>
        </NuxtLink>
      </aside>
    </div>
  </div>

  <div v-else class="page-shell py-24 text-center">
    <span class="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-500"><UIcon name="i-lucide-package-x" class="size-7" /></span>
    <h1 class="mt-6 text-2xl font-bold">未找到这个控件</h1>
    <p class="mt-3 text-slate-500">它可能已被移动、重命名或暂时下架。</p>
    <UButton to="/controls" class="mt-7">返回控件列表</UButton>
  </div>
</template>

<script setup lang="ts">
import type { ControlInformation, ControlListResponse } from '~/types/community'

const route = useRoute()
const id = computed(() => decodeURIComponent(String(route.params.id)))
const basePath = computed(() => `/control/${encodeURIComponent(id.value)}`)

const { data: listData } = await useFetch<ControlListResponse>('/control/list.json', { default: () => ({ list: [] }) })
const [{ data: information }, { data: readme }] = await Promise.all([
  useAsyncData<ControlInformation | null>(
    () => `control-information-${id.value}`,
    async () => {
      try {
        return await $fetch<ControlInformation>(`${basePath.value}/information.json`)
      }
      catch {
        return null
      }
    }
  ),
  useAsyncData<string>(
    () => `control-readme-${id.value}`,
    async () => {
      try {
        return await $fetch<string>(`${basePath.value}/README.md`, { responseType: 'text' })
      }
      catch {
        return ''
      }
    }
  )
])

const control = computed(() => listData.value?.list?.find(item => item.name === id.value))
const versions = computed(() => [...(information.value?.Version_number_list ?? [])].reverse())
const sourceUrl = computed(() => information.value ? `${basePath.value}/${information.value.Current_version}/control.jsx` : '#')
const readmeHtml = computed(() => renderMarkdown(readme.value || '暂无 README 文档。', basePath.value))
const breadcrumbs = computed(() => [
  { label: '首页', to: '/' },
  { label: '控件', to: '/controls' },
  { label: id.value }
])

const failedImages = ref(new Set<string>())
const screenshotCandidates = computed(() => [
  `${basePath.value}/images/1.png`,
  `${basePath.value}/images/1.webp`,
  `${basePath.value}/images/1.gif`,
  `${basePath.value}/images/2.png`
])
const visibleScreenshots = computed(() => screenshotCandidates.value.filter(image => !failedImages.value.has(image)))

const relatedControls = computed(() => (listData.value?.list ?? [])
  .filter(item => item.name !== id.value && (
    item.author === control.value?.author
    || getControlCategory(item.name) === getControlCategory(id.value)
  ))
  .slice(0, 4))

function markImageFailed(image: string) {
  failedImages.value = new Set([...failedImages.value, image])
}

async function downloadControl() {
  if (!control.value) return
  try {
    await $fetch('/api/download', { query: { name: control.value.name } })
  }
  catch {
    // The file download remains available if analytics is temporarily unavailable.
  }
  if (import.meta.client) {
    const link = document.createElement('a')
    link.href = sourceUrl.value
    link.download = `${control.value.name}-${information.value?.Current_version ?? 'latest'}.jsx`
    link.click()
  }
}

onMounted(() => {
  if (control.value) {
    void $fetch('/api/pageviews', { query: { name: control.value.name } }).catch(() => undefined)
  }
})

useSeoMeta({
  title: () => control.value?.name ?? '控件详情',
  description: () => control.value ? `${control.value.name} 是由 ${control.value.author} 发布的 CoCo 开源控件。${getControlDescription(control.value)}` : 'CoCo 控件详情',
  ogTitle: () => `${control.value?.name ?? '控件'} · CoCo-Community`,
  ogDescription: () => control.value ? getControlDescription(control.value) : 'CoCo 开源控件',
  ogType: 'article',
  twitterCard: 'summary_large_image'
})

useHead({
  script: computed(() => control.value && information.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: control.value.name,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          author: { '@type': 'Person', name: control.value.author },
          softwareVersion: information.value.Current_version,
          isAccessibleForFree: true
        })
      }]
    : [])
})
</script>
