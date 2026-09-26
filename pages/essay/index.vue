<template>
    <h1 class="sr-only">文章</h1>
    <div v-if="essaylist.length === 0" class="empty-tip">
      暂无文章数据，请稍后再试。
    </div>

    <div class="article-list">
      <div v-for="article in essaylist" :key="article.name" class="article-card">
        <div class="article-header">
          <div class="article-icon"><i aria-hidden="true" class="fas fa-newspaper"></i></div>
          <div class="article-meta">
            <div class="article-title">{{ article.name }}</div>
            <div class="article-author">作者：{{ article.author }}</div>
          </div>
        </div>

        <div class="article-summary">
          {{ getSummary(article.content) }}
        </div>

        <div class="article-stats">
          <div><i aria-hidden="true" class="fas fa-eye"></i> {{ article.pageviews }} 浏览</div>
          <div><i aria-hidden="true" class="fas fa-thumbs-up"></i> {{ article.Like }} 点赞</div>
          <div><i aria-hidden="true" class="fas fa-star"></i> {{ article.collect }} 收藏</div>
          <div><i aria-hidden="true" class="fas fa-comment"></i> {{ article.comments || 0 }} 评论</div>
        </div>

        <div class="button-group">
          <a :href="`/essay/${encodeURIComponent(article.id)}`" class="text-btn">
            <i aria-hidden="true" class="fas fa-book-open"></i> 去详情页面
          </a>
        </div>
      </div>
    </div>
</template>

<script setup>
// SSR：静态 JSON 在构建期打包进 bundle（服务端内部 fetch 静态文件会落到渲染层返回 HTML）
import essaylistJson from '../../public/essaylist.json'

const essaylist = computed(() =>
  (essaylistJson.list || []).map(article => ({
    ...article,
    pageviews: article.pageviews || 0,
    Like: article.Like || 0,
    collect: article.collect || 0,
    comments: article.comments || 0,
    content: article.content || ''
  }))
);

function getSummary(content) {
  // 提取内容的前100个字符作为摘要，并去掉markdown标题符号
  if (!content) return '';
  let cleanContent = content.replace(/#{1,6}\s/g, '').trim(); // 去掉markdown标题符号
  return cleanContent.length > 100 ? cleanContent.substring(0, 100) + '...' : cleanContent;
}

useHead({
  title: '文章列表|CoCo-Community',
  meta: [
    { name: 'description', content: "CoCo-Community的文章列表，包含各种技术与创意相关的文章。" }
  ]
})
</script>

<style>
@import url(@/assets/css/dark.css);

:root {
  --primary-color: var(--primary);
  --secondary-color: var(--secondary);
  --background-color: var(--background);
  --card-color: var(--card);
  --text-color: var(--foreground);
  --shadow: var(--shadow-sm);
}

#app {
  background-color: var(--background-color);
  min-height: 100vh;
}

.nav-avatar {
  width: 40px;
  height: 40px;
}

.article-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
}

.article-card {
  background-color: var(--card-color);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  max-width: 420px;
  width: 100%;
}

.article-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.article-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-right: 1rem;
}

.article-meta {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 0.3rem;
}

.article-author {
  font-size: 0.9rem;
  color: var(--muted);
}

.article-summary {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.5;
  margin: 0.8rem 0 1rem;
}

.article-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0.5rem 0 1rem;
}

.article-stats div {
  display: flex;
  align-items: center;
}

.article-stats i {
  margin-right: 0.3rem;
  color: var(--primary-color);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.icon-btn, .text-btn {
  background-color: var(--primary-color);
  color: var(--primary-foreground);
  border-radius: 6px;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
}

.icon-btn {
  padding: 0.6rem;
  font-size: 1rem;
}

.text-btn {
  padding: 0.6rem 1rem;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-btn:hover, .text-btn:hover {
  background-color: var(--secondary-color);
}

.empty-tip {
  text-align: center;
  color: var(--muted);
  font-size: 1rem;
  margin-top: 2rem;
}

.user-name-Nav {
    font-weight: 500;
    color: var(--foreground);
    font-size: 1rem;
}
</style>
