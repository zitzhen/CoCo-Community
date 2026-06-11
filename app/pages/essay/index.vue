<template>
  <div class="page-shell py-16 sm:py-20">
    <SectionHeading eyebrow="Articles" title="社区文章" description="开发经验、控件实践与社区动态。" />
    <div class="mt-10 grid gap-6">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/essay/${article.id}`"
        class="surface group rounded-2xl p-6 transition hover:-translate-y-1"
      >
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>{{ article.publication_time }}</span><span>·</span><span>{{ article.author }}</span>
        </div>
        <h2 class="mt-4 text-xl font-bold group-hover:text-blue-500">{{ article.name }}</h2>
        <p class="mt-3 line-clamp-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{{ stripMarkdown(article.content) }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Article { id: number, name: string, author: string, publication_time: string, content: string }
const { data } = await useFetch<{ list: Article[] }>('/essaylist.json', { default: () => ({ list: [] }) })
const articles = computed(() => data.value?.list ?? [])
const stripMarkdown = (value: string) => value.replace(/<br\s*\/?>|[#*_[\]()`>-]/gi, ' ').replace(/\s+/g, ' ').trim()
useSeoMeta({ title: '社区文章', description: '阅读 CoCo-Community 开发经验、控件实践与社区动态。' })
</script>
