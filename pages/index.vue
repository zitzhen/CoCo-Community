<template>
  <div class="home-page">
    <!-- 1024 节日横幅 -->
    <div class="page-container">
      <section v-if="a1024Banner" class="banner-1024" aria-label="1024 程序员节">
        <i class="fas fa-party-horn" aria-hidden="true"></i>
        <span>今天是我们的节日——1024 程序员节，快来同我们一起庆祝！</span>
      </section>
    </div>

    <!-- Hero -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="page-container hero-inner">
        <span class="hero-eyebrow">
          <span class="hero-eyebrow-dot" aria-hidden="true"></span>
          开源 · 开发者资源社区
        </span>
        <h1 id="hero-title" class="hero-title">ZIT-CoCo-Community</h1>
        <p class="hero-subtitle">
          面向开发者的开源资源与工具社区——浏览、搜索、下载控件，获取源码
        </p>

        <form class="hero-search" role="search" @submit.prevent="goToGlobalSearch">
          <label for="home-search-input" class="sr-only">搜索资源、控件、工具</label>
          <i class="fas fa-search hero-search-icon" aria-hidden="true"></i>
          <input
            id="home-search-input"
            v-model="searchTerm"
            type="search"
            class="hero-search-input"
            placeholder="搜索资源、控件、工具……"
            autocomplete="off"
            @keyup.enter="goToGlobalSearch"
          />
          <kbd class="kbd hero-search-kbd">⌃K</kbd>
          <button type="submit" class="btn btn-primary hero-search-submit" aria-label="搜索">
            <i class="fas fa-search" aria-hidden="true"></i>
            <span>搜索</span>
          </button>
        </form>

        <div class="hero-meta">
          <span><strong>{{ files.length }}</strong> 个资源</span>
          <span class="hero-meta-sep" aria-hidden="true">·</span>
          <span><strong>{{ developerCount }}</strong> 位开发者</span>
        </div>
      </div>
    </section>

    <!-- 资源区 -->
    <section id="resources" class="resources" aria-labelledby="resources-title">
      <div class="page-container">
        <!-- 分类过滤 -->
        <div class="category-pills" role="group" aria-label="按分类过滤资源">
          <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            class="category-pill"
            :class="{ active: activeCategory === category.value }"
            :aria-pressed="activeCategory === category.value"
            @click="activeCategory = category.value"
          >
            {{ category.label }}
            <span class="category-pill-count">{{ category.count }}</span>
          </button>
        </div>

        <h2 id="resources-title" class="sr-only">{{ activeCategoryLabel }}</h2>

        <!-- 加载骨架 -->
        <div v-if="loading" class="resource-grid" role="status" aria-label="资源加载中">
          <div
            v-for="n in 6"
            :key="n"
            class="resource-skeleton"
            aria-hidden="true"
          >
            <div class="resource-skeleton-icon"></div>
            <div class="resource-skeleton-line resource-skeleton-line-l"></div>
            <div class="resource-skeleton-line resource-skeleton-line-m"></div>
            <div class="resource-skeleton-line resource-skeleton-line-s"></div>
          </div>
        </div>

        <!-- 网格 -->
        <div v-else-if="filteredFiles.length" class="resource-grid">
          <ResourceCard
            v-for="file in filteredFiles"
            :key="file.name"
            v-bind="file"
          />
        </div>

        <!-- 空状态 -->
        <div v-else class="resources-empty">
          <i class="fas fa-box-open" aria-hidden="true"></i>
          <p>该分类下暂无资源</p>
          <button type="button" class="btn btn-secondary" @click="activeCategory = 'all'">
            清除筛选
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ResourceCard from '@/components/ResourceCard.vue'
import {
  buildCategories,
  categorize,
  categoryLabel,
} from '@/utils/category'

// SSR：服务端直接查询 Cloudflare D1（用户总数，key 与用户列表页共享）
const { data: rawUsers } = await useFetch('/api/user-list', { key: 'userlist' })

function isOctober24th() {
  const today = new Date()
  return today.getMonth() === 9 && today.getDate() === 24
}

const searchTerm = ref('')
const a1024Banner = ref(false)
const loading = ref(true)
const files = ref([])
const activeCategory = ref('all')

const developerCount = computed(() => rawUsers.value?.list?.length || 0)

const categories = computed(() => buildCategories(files.value))

const activeCategoryLabel = computed(() =>
  activeCategory.value === 'all'
    ? '全部资源'
    : categoryLabel(activeCategory.value)
)

const filteredFiles = computed(() => {
  if (activeCategory.value === 'all') return files.value
  // files 由 control-list 归一化而来，分类规则同样作用于其 name/author
  return files.value.filter((file) => categorize(file) === activeCategory.value)
})

function goToGlobalSearch() {
  if (searchTerm.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchTerm.value.trim())}`)
  }
}

// SSR：服务端取数，首屏 HTML 直接包含控件列表
const { data: controlData, error: controlError } = await useFetch('/api/control-list', {
  key: 'control-list',
})

if (controlError.value) {
  console.error('Error fetching directories:', controlError.value)
  loading.value = false
} else {
  files.value = (controlData.value?.list || []).map((information) => ({
    name: information.name,
    author: information.author || '',
    type: 'code',
    size: information.size || '',
    downloads: information.downloads || 0,
    likes: information.likes || 0,
    Pageviews: information.Pageviews || 0,
    url: `/control/${information.name}`,
  }))
  loading.value = false
}

// 1024 横幅依赖客户端本地日期，放 onMounted 避免水合不一致
onMounted(() => {
  a1024Banner.value = isOctober24th()
})

useHead({
  title: 'ZIT-CoCo-Community|CoCo编辑器的小圳社区|自定义控件下载中心',
  meta: [
    {
      name: 'description',
      content:
        'CoCo-Community，全称为ZIT-CoCo-Community。这是ZIT小圳创科工作室创造的编程猫CoCo编辑器社区，提供自定义控件下载、源码获取与开发者交流服务。',
    },
  ],
})
</script>

<style>
/* 首页：Hero / 分类 / 资源网格 */
@import '@/assets/css/home-page.css';
</style>
