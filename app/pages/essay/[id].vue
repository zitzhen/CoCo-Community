<template>
  <ContentPage
    v-if="article"
    eyebrow="Article"
    :title="article.name"
    :description="`${article.author} · ${article.publication_time}`"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article class="prose-community" v-html="renderMarkdown(article.content)" />
  </ContentPage>
</template>

<script setup lang="ts">
interface Article { id: number, name: string, author: string, publication_time: string, content: string }
const route = useRoute()
const { data } = await useFetch<{ list: Article[] }>('/essaylist.json', { default: () => ({ list: [] }) })
const article = computed(() => data.value?.list?.find(item => item.id === Number(route.params.id)))
if (!article.value) throw createError({ statusCode: 404, statusMessage: '文章不存在' })
useSeoMeta({ title: () => article.value?.name, description: () => article.value ? `${article.value.author} 发布的社区文章` : '社区文章' })
</script>
