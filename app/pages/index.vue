<template>
  <div>
    <section class="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800">
      <div class="soft-grid absolute inset-0" />
      <div class="absolute left-[15%] top-10 size-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div class="absolute right-[10%] top-24 size-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div class="page-shell relative grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <UBadge color="primary" variant="subtle" size="lg" class="mb-6">
            <span class="mr-1.5 size-1.5 rounded-full bg-blue-500" />
            开源驱动的 CoCo 控件生态
          </UBadge>
          <h1 class="max-w-3xl text-5xl font-black tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
            发现优秀
            <span class="gradient-text">开源控件</span>
          </h1>
          <p class="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
            CoCo-Community 是一个开源控件社区，帮助开发者分享、发现和管理优秀控件。
          </p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <UButton to="/controls" size="xl" trailing-icon="i-lucide-arrow-right">
              浏览控件
            </UButton>
            <UButton to="/new-control" size="xl" color="neutral" variant="outline" icon="i-lucide-package-plus">
              发布控件
            </UButton>
          </div>
          <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-2"><UIcon name="i-lucide-check" class="text-emerald-500" /> 开源免费</span>
            <span class="flex items-center gap-2"><UIcon name="i-lucide-check" class="text-emerald-500" /> GitHub 登录</span>
            <span class="flex items-center gap-2"><UIcon name="i-lucide-check" class="text-emerald-500" /> 全球加速</span>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-xl">
          <div class="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-400/20 blur-3xl" />
          <div class="surface relative overflow-hidden rounded-3xl p-4 shadow-2xl shadow-blue-950/10">
            <div class="flex items-center gap-2 border-b border-slate-200/70 px-2 pb-4 dark:border-slate-700/70">
              <span class="size-2.5 rounded-full bg-rose-400" />
              <span class="size-2.5 rounded-full bg-amber-400" />
              <span class="size-2.5 rounded-full bg-emerald-400" />
              <div class="ml-3 h-7 flex-1 rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
            <div class="grid gap-3 pt-4 sm:grid-cols-2">
              <div class="rounded-2xl bg-slate-950 p-5 text-white sm:row-span-2">
                <div class="flex items-center justify-between">
                  <div class="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 font-black">C</div>
                  <UIcon name="i-lucide-sparkles" class="size-5 text-cyan-300" />
                </div>
                <p class="mt-12 text-xs uppercase tracking-[0.2em] text-slate-400">Featured</p>
                <h2 class="mt-2 text-2xl font-bold">让创意成为可复用的能力</h2>
                <div class="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div class="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300" />
                </div>
              </div>
              <div class="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div class="flex items-center gap-3">
                  <span class="grid size-9 place-items-center rounded-lg bg-blue-500/10 text-blue-500"><UIcon name="i-lucide-box" /></span>
                  <div><p class="text-xs text-slate-400">控件生态</p><p class="font-bold">{{ controls.length }}+ 项目</p></div>
                </div>
              </div>
              <div class="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-500/10 to-cyan-400/10 p-4 dark:border-slate-700">
                <div class="flex items-center gap-3">
                  <span class="grid size-9 place-items-center rounded-lg bg-violet-500/10 text-violet-500"><UIcon name="i-lucide-github" /></span>
                  <div><p class="text-xs text-slate-400">开放协作</p><p class="font-bold">Built in public</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b border-slate-200/60 bg-white/60 py-10 dark:border-slate-800 dark:bg-slate-950/30">
      <div class="page-shell grid grid-cols-2 gap-8 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <p class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            {{ formatNumber(Math.round(stat.value)) }}<span class="text-blue-500">{{ stat.suffix }}</span>
          </p>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <section class="section-space">
      <div class="page-shell">
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="精选"
            title="本周值得关注"
            description="由社区数据与内容质量共同筛选，快速发现实用、可靠的优秀控件。"
          />
          <UButton to="/controls" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-right">查看全部</UButton>
        </div>
        <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ControlCard v-for="control in featuredControls" :key="control.id" :control="control" />
        </div>
      </div>
    </section>

    <section class="section-space border-y border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-950/40">
      <div class="page-shell">
        <SectionHeading
          center
          eyebrow="分类"
          title="按场景探索控件"
          description="从开发工具到 AI 能力，找到适合当前作品的扩展模块。"
        />
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="category in categoryCards"
            :key="category.name"
            :to="`/controls?category=${encodeURIComponent(category.name)}`"
            class="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-blue-500/40"
          >
            <span :class="category.color" class="grid size-11 place-items-center rounded-xl">
              <UIcon :name="category.icon" class="size-5" />
            </span>
            <div class="mt-5 flex items-center justify-between">
              <h3 class="font-bold text-slate-950 dark:text-white">{{ category.name }}</h3>
              <UIcon name="i-lucide-arrow-up-right" class="text-slate-400 transition group-hover:text-blue-500" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-space">
      <div class="page-shell">
        <SectionHeading
          eyebrow="开发者"
          title="认识社区贡献者"
          description="他们持续分享代码、经验与创意，共同构建 CoCo 开源生态。"
        />
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          <NuxtLink
            v-for="developer in developers"
            :key="developer.username"
            :to="`/user/${developer.username}`"
            class="surface group rounded-2xl p-6 transition hover:-translate-y-1"
          >
            <div class="flex items-center gap-4">
              <UAvatar :src="developer.avatar" :alt="developer.username" size="xl" />
              <div class="min-w-0">
                <h3 class="truncate font-bold text-slate-950 dark:text-white">{{ developer.nickname || developer.username }}</h3>
                <p class="truncate text-sm text-slate-400">@{{ developer.username }}</p>
              </div>
            </div>
            <p class="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {{ developer.bio || '持续为 CoCo 开源生态贡献优秀控件。' }}
            </p>
            <div class="mt-5 flex items-center justify-between text-sm">
              <span class="text-slate-500">{{ developer.number_of_controls }} 个控件</span>
              <span class="flex items-center gap-1 text-blue-500">查看主页 <UIcon name="i-lucide-arrow-right" /></span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section-space pt-0">
      <div class="page-shell overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white sm:px-12">
        <SectionHeading
          center
          eyebrow="Community"
          title="为开放创作而生"
          description="社区基础设施保持简单、透明、可靠，让每一位开发者专注于创造。"
        />
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div v-for="feature in features" :key="feature.title" class="text-center">
            <span class="mx-auto grid size-11 place-items-center rounded-xl bg-white/10 text-cyan-300">
              <UIcon :name="feature.icon" class="size-5" />
            </span>
            <h3 class="mt-4 font-bold">{{ feature.title }}</h3>
            <p class="mt-2 text-xs leading-5 text-slate-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ControlListResponse, UserListResponse } from '~/types/community'

const { data: controlsData } = await useFetch<ControlListResponse>('/control/list.json', { default: () => ({ list: [] }) })
const { data: usersData } = await useFetch<UserListResponse>('/userlist.json', { default: () => ({ list: [] }) })

const controls = computed(() => controlsData.value?.list ?? [])
const developers = computed(() => [...(usersData.value?.list ?? [])].sort((a, b) => Number(b.number_of_controls) - Number(a.number_of_controls)).slice(0, 3))
const featuredControls = computed(() => [...controls.value].sort((a, b) => (b.downloads + b.Pageviews) - (a.downloads + a.Pageviews)).slice(0, 6))

const totals = computed(() => ({
  controls: controls.value.length,
  developers: usersData.value?.list?.length ?? 0,
  downloads: controls.value.reduce((sum, item) => sum + item.downloads, 0),
  likes: controls.value.reduce((sum, item) => sum + item.likes, 0)
}))

const animatedControls = useTransition(computed(() => totals.value.controls), { duration: 900 })
const animatedDevelopers = useTransition(computed(() => totals.value.developers), { duration: 1000 })
const animatedDownloads = useTransition(computed(() => totals.value.downloads), { duration: 1100 })
const animatedLikes = useTransition(computed(() => totals.value.likes), { duration: 1200 })

const stats = computed(() => [
  { label: '控件总数', value: animatedControls.value, suffix: '+' },
  { label: '开发者数量', value: animatedDevelopers.value, suffix: '+' },
  { label: '下载量', value: animatedDownloads.value, suffix: '+' },
  { label: '点赞量', value: animatedLikes.value, suffix: '' }
])

const categoryCards = [
  { name: '开发工具', icon: 'i-lucide-terminal-square', color: 'bg-blue-500/10 text-blue-500' },
  { name: 'AI', icon: 'i-lucide-sparkles', color: 'bg-violet-500/10 text-violet-500' },
  { name: '效率工具', icon: 'i-lucide-zap', color: 'bg-amber-500/10 text-amber-500' },
  { name: '文本工具', icon: 'i-lucide-type', color: 'bg-cyan-500/10 text-cyan-500' },
  { name: '图片工具', icon: 'i-lucide-image', color: 'bg-rose-500/10 text-rose-500' },
  { name: '网页工具', icon: 'i-lucide-globe-2', color: 'bg-emerald-500/10 text-emerald-500' },
  { name: '娱乐工具', icon: 'i-lucide-gamepad-2', color: 'bg-fuchsia-500/10 text-fuchsia-500' }
]

const features = [
  { title: '开源', description: '代码与协作流程公开透明', icon: 'i-lucide-code-2' },
  { title: '安全', description: '社区审核与安全反馈机制', icon: 'i-lucide-shield-check' },
  { title: 'GitHub 登录', description: '使用开发者身份快速加入', icon: 'i-simple-icons-github' },
  { title: '永久免费', description: '核心服务面向社区免费开放', icon: 'i-lucide-heart-handshake' },
  { title: '全球加速', description: 'Cloudflare 边缘网络分发', icon: 'i-simple-icons-cloudflare' }
]

useSeoMeta({
  title: '发现优秀开源控件',
  description: 'CoCo-Community 是一个开源控件社区，帮助开发者分享、发现和管理优秀控件。',
  ogTitle: 'CoCo-Community - 发现优秀开源控件',
  ogDescription: '面向 CoCo 开发者的现代开源控件社区。',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CoCo-Community',
      url: 'https://cc.zitzhen.cn',
      description: '面向 CoCo 开发者的开源控件社区',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://cc.zitzhen.cn/controls?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    })
  }]
})
</script>
