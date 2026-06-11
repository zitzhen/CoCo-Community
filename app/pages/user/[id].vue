<template>
  <div v-if="user" class="page-shell py-12 sm:py-16">
    <div class="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside>
        <UAvatar :src="user.avatar" :alt="user.username" class="size-36 ring-4 ring-white sm:size-48 dark:ring-slate-900" />
        <h1 class="mt-6 text-2xl font-bold tracking-tight">{{ user.nickname || user.username }}</h1>
        <p class="mt-1 text-lg text-slate-400">{{ user.username }}</p>
        <p class="mt-5 leading-7 text-slate-600 dark:text-slate-300">
          {{ user.bio || '这位开发者还没有填写个人简介。' }}
        </p>
        <UButton
          :to="`https://github.com/${user.username}`"
          target="_blank"
          color="neutral"
          variant="outline"
          block
          icon="i-simple-icons-github"
          class="mt-6"
        >
          GitHub 主页
        </UButton>
        <div class="mt-6 space-y-3 text-sm text-slate-500 dark:text-slate-400">
          <p class="flex items-center gap-2"><UIcon name="i-lucide-package" /> {{ controls.length }} 个公开控件</p>
          <p class="flex items-center gap-2"><UIcon name="i-lucide-heart" /> {{ totalLikes }} 次获赞</p>
          <p class="flex items-center gap-2"><UIcon name="i-lucide-eye" /> {{ user.pageviews }} 次主页浏览</p>
        </div>
      </aside>

      <div>
        <div class="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 class="text-xl font-bold">最近发布</h2>
            <p class="mt-1 text-sm text-slate-400">{{ controls.length }} 个控件</p>
          </div>
          <UButton to="/controls" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-right">探索更多</UButton>
        </div>

        <div v-if="controls.length" class="mt-6 grid gap-5 md:grid-cols-2">
          <ControlCard v-for="control in controls" :key="control.id" :control="control" />
        </div>
        <div v-else class="mt-6 rounded-2xl border border-dashed border-slate-300 p-14 text-center dark:border-slate-700">
          <UIcon name="i-lucide-package-open" class="mx-auto size-7 text-slate-400" />
          <p class="mt-4 text-slate-500">暂无公开控件</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="page-shell py-24 text-center">
    <UIcon name="i-lucide-user-x" class="mx-auto size-12 text-slate-300" />
    <h1 class="mt-5 text-2xl font-bold">未找到这位开发者</h1>
    <UButton to="/users" class="mt-7">查看开发者列表</UButton>
  </div>
</template>

<script setup lang="ts">
import type { ControlListResponse, UserListResponse } from '~/types/community'

const route = useRoute()
const username = computed(() => String(route.params.id))

const [{ data: userData }, { data: controlData }] = await Promise.all([
  useFetch<UserListResponse>('/userlist.json', { default: () => ({ list: [] }) }),
  useFetch<ControlListResponse>('/control/list.json', { default: () => ({ list: [] }) })
])

const user = computed(() => userData.value?.list?.find(item => item.username.toLowerCase() === username.value.toLowerCase()))
const controls = computed(() => (controlData.value?.list ?? []).filter(item => item.author.toLowerCase() === username.value.toLowerCase()))
const totalLikes = computed(() => controls.value.reduce((sum, item) => sum + item.likes, 0))

onMounted(() => {
  if (user.value) {
    void $fetch('/api/pageviews_user', { query: { username: user.value.username } }).catch(() => undefined)
  }
})

useSeoMeta({
  title: () => user.value ? `${user.value.nickname || user.value.username} 的主页` : '开发者主页',
  description: () => user.value?.bio || `${username.value} 在 CoCo-Community 发布的开源控件。`,
  ogTitle: () => `${user.value?.nickname || username.value} · CoCo-Community`,
  ogDescription: () => user.value?.bio || 'CoCo-Community 开发者主页',
  ogImage: () => user.value?.avatar,
  twitterCard: 'summary'
})

useHead({
  script: computed(() => user.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: user.value.nickname || user.value.username,
          url: `https://cc.zitzhen.cn/user/${user.value.username}`,
          image: user.value.avatar,
          sameAs: [`https://github.com/${user.value.username}`]
        })
      }]
    : [])
})
</script>
