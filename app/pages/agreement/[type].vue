<template>
  <ContentPage
    eyebrow="Legal"
    :title="page.title"
    :description="page.description"
    :breadcrumbs="[{ label: '首页', to: '/' }, { label: '协议与政策', to: '/agreement' }, { label: page.title }]"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article class="prose-community" v-html="html" />
  </ContentPage>
</template>

<script setup lang="ts">
const route = useRoute()
const type = computed(() => String(route.params.type))

const pages: Record<string, { title: string, description: string, source: string }> = {
  useragreement: {
    title: '用户协议',
    description: '使用 CoCo-Community 前请仔细阅读本协议。',
    source: '/agreement/useragreement/content.md'
  },
  privacypolicy: {
    title: '隐私政策',
    description: '说明我们如何处理登录身份、Cookie 与访问数据。',
    source: '/agreement/privacypolicy/content.md'
  },
  license: {
    title: '开源与控件许可',
    description: '平台代码和社区控件分别适用的许可说明。',
    source: '/control/LICENSE.md'
  }
}

const page = computed(() => pages[type.value] ?? pages.useragreement!)
const { data: markdown } = await useFetch<string>(() => page.value.source, { responseType: 'text', default: () => '' })
const html = computed(() => renderMarkdown(markdown.value))

useSeoMeta({
  title: () => page.value.title,
  description: () => page.value.description,
  robots: 'index, follow'
})
</script>
