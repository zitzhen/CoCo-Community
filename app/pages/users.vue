<template>
  <div class="page-shell py-16 sm:py-20">
    <SectionHeading
      eyebrow="Developers"
      title="社区开发者"
      description="认识正在构建 CoCo 开源生态的开发者，探索他们分享的控件与作品。"
    />

    <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="user in users"
        :key="user.username"
        :to="`/user/${user.username}`"
        class="surface group rounded-2xl p-6 transition hover:-translate-y-1 hover:border-blue-300"
      >
        <div class="flex items-center gap-4">
          <UAvatar :src="user.avatar" :alt="user.username" size="2xl" />
          <div class="min-w-0">
            <h2 class="truncate text-lg font-bold">{{ user.nickname || user.username }}</h2>
            <p class="truncate text-sm text-slate-400">@{{ user.username }}</p>
          </div>
        </div>
        <p class="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {{ user.bio || '这位开发者正在为 CoCo 社区贡献开源控件。' }}
        </p>
        <div class="mt-5 flex gap-5 border-t border-slate-200/70 pt-4 text-sm dark:border-slate-800">
          <span><strong>{{ user.number_of_controls }}</strong> <span class="text-slate-400">控件</span></span>
          <span><strong>{{ user.pageviews }}</strong> <span class="text-slate-400">主页浏览</span></span>
          <UIcon name="i-lucide-arrow-up-right" class="ml-auto text-slate-400 group-hover:text-blue-500" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserListResponse } from '~/types/community'

const { data } = await useFetch<UserListResponse>('/userlist.json', { default: () => ({ list: [] }) })
const users = computed(() => [...(data.value?.list ?? [])].sort((a, b) => Number(b.number_of_controls) - Number(a.number_of_controls)))

useSeoMeta({
  title: '社区开发者',
  description: '认识 CoCo-Community 开源控件开发者，探索他们的贡献与作品。',
  ogTitle: '社区开发者 · CoCo-Community',
  twitterCard: 'summary'
})
</script>
