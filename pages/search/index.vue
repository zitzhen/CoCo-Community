<template>
  <div class="search-page page-container">
    <header class="search-page-header">
      <h1 class="search-page-title">搜索</h1>
      <p class="search-page-sub">在控件、文章与开发者中查找你需要的资源</p>

      <form class="search-page-bar" role="search" @submit.prevent="performSearch">
        <label for="globalSearchInput" class="sr-only">搜索控件、文章、用户</label>
        <i class="fas fa-search" aria-hidden="true"></i>
        <input
          id="globalSearchInput"
          v-model="searchTerm"
          type="search"
          placeholder="搜索控件、文章、用户…"
          autocomplete="off"
          @keyup.enter="performSearch"
        />
        <button type="submit" class="btn btn-primary" aria-label="搜索">
          <i class="fas fa-search" aria-hidden="true"></i>
          <span>搜索</span>
        </button>
      </form>
    </header>

    <!-- 热门搜索 -->
    <section v-if="!hasSearched && popularSearches.length" class="search-popular">
      <h2 class="search-popular-title">热门搜索</h2>
      <div class="search-popular-list">
        <button
          v-for="suggestion in popularSearches"
          :key="suggestion"
          type="button"
          class="pill search-popular-item"
          @click="searchWithTerm(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </section>

    <!-- 结果分类 tabs -->
    <div v-if="hasResults" class="search-tabs" role="tablist" aria-label="搜索结果分类">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="search-tab"
        :class="{ active: activeTab === tab.key }"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span class="search-tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 搜索中 -->
    <div v-if="loading" class="search-loading" role="status">
      <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
      搜索中，请稍候…
    </div>

    <template v-if="hasSearched && !loading">
      <div class="search-meta">
        找到 {{ totalResults }} 个结果（用时 {{ searchTime }} ms）
      </div>

      <!-- 控件 -->
      <section
        v-if="(activeTab === 'all' || activeTab === 'controls') && searchResults.controls.length"
        class="search-result-section"
      >
        <h2 class="search-result-title">控件</h2>
        <div class="resource-grid">
          <ResourceCard
            v-for="control in searchResults.controls"
            :key="control.name"
            v-bind="control"
          />
        </div>
      </section>

      <!-- 文章 -->
      <section
        v-if="(activeTab === 'all' || activeTab === 'articles') && searchResults.articles.length"
        class="search-result-section"
      >
        <h2 class="search-result-title">文章</h2>
        <ul class="search-article-list">
          <li v-for="article in searchResults.articles" :key="article.id">
            <NuxtLink :to="article.url" class="search-article-item">
              <span class="search-article-name">{{ article.title }}</span>
              <span class="search-article-info">
                {{ article.author }} · {{ formatDate(article.date) }}
              </span>
              <span class="search-article-excerpt">{{ article.excerpt }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- 用户 -->
      <section
        v-if="(activeTab === 'all' || activeTab === 'users') && searchResults.users.length"
        class="search-result-section"
      >
        <h2 class="search-result-title">用户</h2>
        <ul class="search-user-list">
          <li v-for="user in searchResults.users" :key="user.id">
            <NuxtLink :to="user.url" class="search-user-item">
              <img :src="user.avatar" :alt="`${user.name} 的头像`" class="search-user-avatar" loading="lazy" />
              <span class="search-user-meta">
                <span class="search-user-name">{{ user.name }}</span>
                <span class="search-user-login">@{{ user.login }}</span>
              </span>
              <span class="search-user-go">
                查看资料 <i class="fas fa-chevron-right" aria-hidden="true"></i>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- 无结果 -->
      <div v-if="!hasResults" class="search-empty">
        <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
        <h2>未找到相关结果</h2>
        <p>尝试使用其他关键词，或检查拼写</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import ResourceCard from '@/components/ResourceCard.vue'
import essaylistJson from '../../public/essaylist.json'
import userlistJson from '../../public/userlist.json'

const route = useRoute()
const searchTerm = ref('')
const hasSearched = ref(false)
const searchResults = ref({ controls: [], articles: [], users: [] })
const loading = ref(false)
const activeTab = ref('all')
const searchTime = ref(0)
const popularSearches = ref([])

const hasResults = computed(
  () =>
    searchResults.value.controls.length > 0 ||
    searchResults.value.articles.length > 0 ||
    searchResults.value.users.length > 0
)

const totalResults = computed(
  () =>
    searchResults.value.controls.length +
    searchResults.value.articles.length +
    searchResults.value.users.length
)

const tabs = computed(() => [
  { key: 'all', label: '全部', count: totalResults.value },
  { key: 'controls', label: '控件', count: searchResults.value.controls.length },
  { key: 'articles', label: '文章', count: searchResults.value.articles.length },
  { key: 'users', label: '用户', count: searchResults.value.users.length },
])

// 全量控件数据（与首页共享缓存）
const { data: controlData } = await useFetch('/api/control-list', {
  key: 'control-list',
})

function performSearch() {
  const term = searchTerm.value.trim()
  if (!term) return

  loading.value = true
  const startTime = Date.now()
  const lower = term.toLowerCase()

  // 搜索控件（名称/作者）
  const controls = (controlData.value?.list || [])
    .filter(
      (control) =>
        control.name?.toLowerCase().includes(lower) ||
        control.author?.toLowerCase().includes(lower)
    )
    .map((control) => ({
      name: control.name,
      author: control.author,
      size: control.size,
      downloads: control.downloads,
      likes: control.likes,
      Pageviews: control.Pageviews,
    }))

  // 搜索文章（essaylist.json 字段：name/author/publication_time/content）
  const articles = (essaylistJson.list || [])
    .filter(
      (article) =>
        (article.name && article.name.toLowerCase().includes(lower)) ||
        (article.author && article.author.toLowerCase().includes(lower)) ||
        (article.content && article.content.toLowerCase().includes(lower))
    )
    .map((article) => {
      const id = article.id || article.name?.toLowerCase().replace(/\s+/g, '-')
      const excerpt = article.content
        ? article.content.length > 100
          ? article.content.substring(0, 100) + '…'
          : article.content
        : '无内容预览'
      return {
        id,
        title: article.name || '无标题',
        author: article.author || '未知作者',
        date: article.publication_time || '',
        excerpt,
        url: `/essay/${id}`,
      }
    })

  // 搜索用户（userlist.json 字段：username/nickname/avatar）
  const users = (userlistJson.list || [])
    .filter(
      (user) =>
        (user.username && user.username.toLowerCase().includes(lower)) ||
        (user.nickname && user.nickname.toLowerCase().includes(lower))
    )
    .map((user) => ({
      id: user.username || user.nickname,
      name: user.nickname || user.username || '未知用户',
      login: user.username || 'unknown',
      avatar: user.avatar || '/images/user.png',
      url: `/user/${encodeURIComponent(user.username || '')}`,
    }))

  searchResults.value = { controls, articles, users }
  searchTime.value = Date.now() - startTime
  activeTab.value = 'all'
  hasSearched.value = true
  loading.value = false
}

function searchWithTerm(term) {
  searchTerm.value = term
  performSearch()
}

function formatDate(dateString) {
  if (!dateString) return '日期未知'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '日期未知'
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// SSR：URL 带 q 参数时服务端直接渲染结果
if (route.query.q) {
  searchTerm.value = String(route.query.q)
  performSearch()
}

useHead({ title: '搜索|ZIT-CoCo-Community' })
</script>

<style>
@import '@/assets/css/search-page.css';
</style>
