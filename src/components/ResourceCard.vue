<template>
  <article class="resource-card">
    <div class="resource-card-top">
      <span class="resource-card-icon" aria-hidden="true">
        <i aria-hidden="true" class="fas fa-file-code"></i>
      </span>
      <span class="pill">JSX</span>
    </div>

    <NuxtLink :to="detailUrl" class="resource-card-name-link">
      <h3 class="resource-card-name">{{ name }}</h3>
    </NuxtLink>

    <NuxtLink :to="authorUrl" class="resource-card-author">
      <i class="fas fa-user-pen" aria-hidden="true"></i>
      <span>{{ author || '未知作者' }}</span>
    </NuxtLink>

    <ul class="resource-card-stats" aria-label="资源统计">
      <li :aria-label="`下载次数 ${formatNumber(downloads)}`">
        <i class="fas fa-download" aria-hidden="true"></i>
        {{ formatNumber(downloads) }}
      </li>
      <li :aria-label="`浏览次数 ${formatNumber(Pageviews)}`">
        <i class="fas fa-eye" aria-hidden="true"></i>
        {{ formatNumber(Pageviews) }}
      </li>
      <li :aria-label="`点赞数 ${formatNumber(likes)}`">
        <i class="fas fa-heart" aria-hidden="true"></i>
        {{ formatNumber(likes) }}
      </li>
    </ul>

    <div class="resource-card-actions">
      <NuxtLink :to="detailUrl" class="btn btn-primary resource-card-detail">
        查看详情
      </NuxtLink>
      <NuxtLink
        :to="downloadUrl"
        class="btn btn-outline btn-icon"
        :aria-label="`下载资源 ${name}`"
        title="下载"
      >
        <i class="fas fa-download" aria-hidden="true"></i>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  name: { type: String, required: true },
  author: { type: String, default: '' },
  size: { type: [String, Number], default: '' },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  Pageviews: { type: Number, default: 0 },
})

function formatNumber(value) {
  const number = Number(value) || 0
  if (number < 1000) return String(number)
  if (number < 10000) return `${(number / 1000).toFixed(1)}k`
  return `${Math.round(number / 1000)}k`
}

const detailUrl = computed(() => `/control/${encodeURIComponent(props.name)}`)
const authorUrl = computed(() =>
  props.author ? `/user/${encodeURIComponent(props.author)}` : '/user'
)
// 携带下载意图进入详情页，由详情页统一完成 blob 与计数（不在卡片重复业务逻辑）
const downloadUrl = computed(() => `${detailUrl.value}?action=download`)
</script>

<style>
@import '@/assets/css/resource-card.css';
</style>
