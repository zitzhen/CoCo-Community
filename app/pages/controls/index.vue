<template>
  <div class="page-shell py-14 sm:py-20">
    <div class="max-w-3xl">
      <UBadge color="primary" variant="subtle" class="mb-4">Explore</UBadge>
      <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl dark:text-white">发现控件</h1>
      <p class="mt-4 text-lg leading-8 text-slate-500 dark:text-slate-400">
        浏览社区创建的开源控件，为你的下一个 CoCo 作品找到可靠扩展。
      </p>
    </div>

    <div class="surface sticky top-20 z-30 mt-10 rounded-2xl p-3">
      <div class="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          size="xl"
          placeholder="搜索控件或作者..."
          class="w-full"
        />
        <USelectMenu
          v-model="category"
          :items="categoryOptions"
          value-key="value"
          size="xl"
          class="min-w-40"
        />
        <USelectMenu
          v-model="sort"
          :items="sortOptions"
          value-key="value"
          size="xl"
          class="min-w-40"
        />
      </div>
    </div>

    <div class="mt-8 flex items-center justify-between">
      <p class="text-sm text-slate-500">
        找到 <span class="font-semibold text-slate-950 dark:text-white">{{ filteredControls.length }}</span> 个控件
      </p>
      <UButton
        v-if="query || category !== '全部分类'"
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-x"
        @click="resetFilters"
      >
        清除筛选
      </UButton>
    </div>

    <div v-if="status === 'pending'" class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ControlCardSkeleton v-for="index in 9" :key="index" />
    </div>
    <div v-else-if="filteredControls.length" class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <ControlCard v-for="control in filteredControls" :key="control.id" :control="control" />
    </div>
    <div v-else class="mt-10 rounded-3xl border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
      <span class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
        <UIcon name="i-lucide-search-x" class="size-6" />
      </span>
      <h2 class="mt-5 text-lg font-bold">没有找到匹配的控件</h2>
      <p class="mt-2 text-sm text-slate-500">尝试更换关键词或分类。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ControlListResponse } from '~/types/community'

const route = useRoute()
const router = useRouter()
const query = ref(typeof route.query.q === 'string' ? route.query.q : '')
const category = ref(typeof route.query.category === 'string' ? route.query.category : '全部分类')
const sort = ref(typeof route.query.sort === 'string' ? route.query.sort : '最热')

const { data, status } = await useFetch<ControlListResponse>('/control/list.json', {
  default: () => ({ list: [] })
})

const categoryOptions = [
  { label: '全部分类', value: '全部分类' },
  ...categories.map(item => ({ label: item, value: item }))
]

const sortOptions = [
  { label: '最热', value: '最热' },
  { label: '最新', value: '最新' },
  { label: '下载量', value: '下载量' },
  { label: '点赞量', value: '点赞量' }
]

const filteredControls = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  const filtered = (data.value?.list ?? []).filter((control) => {
    const matchesQuery = !keyword || control.name.toLowerCase().includes(keyword) || control.author.toLowerCase().includes(keyword)
    const matchesCategory = category.value === '全部分类' || getControlCategory(control.name) === category.value
    return matchesQuery && matchesCategory
  })

  return [...filtered].sort((a, b) => {
    if (sort.value === '最新') return b.id - a.id
    if (sort.value === '下载量') return b.downloads - a.downloads
    if (sort.value === '点赞量') return b.likes - a.likes
    return (b.Pageviews + b.downloads * 3 + b.likes * 5) - (a.Pageviews + a.downloads * 3 + a.likes * 5)
  })
})

watch([query, category, sort], () => {
  void router.replace({
    query: {
      ...(query.value ? { q: query.value } : {}),
      ...(category.value !== '全部分类' ? { category: category.value } : {}),
      ...(sort.value !== '最热' ? { sort: sort.value } : {})
    }
  })
})

function resetFilters() {
  query.value = ''
  category.value = '全部分类'
}

useSeoMeta({
  title: '发现控件',
  description: '浏览 CoCo-Community 开源控件，支持分类、热度、下载量与点赞量筛选。',
  ogTitle: '发现控件 · CoCo-Community',
  ogDescription: '为你的 CoCo 作品找到优秀的开源控件。',
  twitterCard: 'summary'
})
</script>
