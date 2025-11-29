<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <a href="/" class="logo">ZIT<span>-CoCo-Community</span></a>
        <div class="user-info">
          <img :src="avatar" alt="用户头像" class="user-avatar">
          <div class="user-name-Nav">{{ username }}</div>
        </div>
      </div>
    </nav>

    <div style="height: 90px;"></div>

    <div v-if="essaylist.length === 0" class="empty-tip">
      暂无文章数据，请稍后再试。
    </div>

    <div class="article-list">
      <div v-for="article in essaylist" :key="article.name" class="article-card">
        <div class="article-header">
          <div class="article-icon"><i class="fas fa-newspaper"></i></div>
          <div class="article-meta">
            <div class="article-title">{{ article.name }}</div>
            <div class="article-author">作者：{{ article.author }}</div>
          </div>
        </div>

        <div class="article-summary">
          {{ getSummary(article.content) }}
        </div>

        <div class="article-stats">
          <div><i class="fas fa-eye"></i> {{ article.pageviews }} 浏览</div>
          <div><i class="fas fa-thumbs-up"></i> {{ article.Like }} 点赞</div>
          <div><i class="fas fa-star"></i> {{ article.collect }} 收藏</div>
          <div><i class="fas fa-comment"></i> {{ article.comments || 0 }} 评论</div>
        </div>

        <div class="button-group">
          <a :href="`/essay/${encodeURIComponent(article.id)}`" class="text-btn">
            <i class="fas fa-book-open"></i> 去详情页面
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkLoginStatus } from '@/script/login';
import axios from 'axios';

export default {
  data() {
    return {
      username: "未登录用户",
      avatar: "/images/user.png",
      essaylist: []
    };
  },
  methods: {
    async updateLoginInfo() {
      try {
        const logininformation = await checkLoginStatus();
        if (!logininformation || !logininformation.authenticated) {
          this.username = '未登录用户';
          this.avatar = '/images/user.png';
        } else {
          this.username = logininformation.user.name || logininformation.user.login;
          this.avatar = logininformation.user.avatar_url || '/images/user.png';
        }
      } catch (err) {
        console.error("登录检查失败：", err);
        this.username = '登录信息检查失败';
      }
    },
    async fetchEssaylist() {
      try {
        const response = await axios.get('/essaylist.json');
        this.essaylist = (response.data.list || []).map(article => ({
          ...article,
          name: article.name,
          author: article.author,
          pageviews: article.pageviews || 0,
          Like: article.Like || 0,
          collect: article.collect || 0,
          comments: article.comments || 0,
          content: article.content || ''
        }));
        console.log("文章列表:", this.essaylist);
      } catch (error) {
        console.error("获取文章列表失败：", error);
      }
    },
    getSummary(content) {
      // 提取内容的前100个字符作为摘要，并去掉markdown标题符号
      if (!content) return '';
      let cleanContent = content.replace(/#{1,6}\s/g, '').trim(); // 去掉markdown标题符号
      return cleanContent.length > 100 ? cleanContent.substring(0, 100) + '...' : cleanContent;
    }
  },
  mounted() {
    this.updateLoginInfo();
    this.fetchEssaylist();
  }
};
</script>

<style>
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/css/dark.css);

:root {
  --primary-color: #2ecc71;
  --secondary-color: #27ae60;
  --background-color: #f0f4f8;
  --card-color: #ffffff;
  --text-color: #2c3e50;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.article-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
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
  color: #666;
}

.article-summary {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin: 0.8rem 0 1rem;
}

.article-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  color: #555;
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
  color: white;
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
  color: #999;
  font-size: 1rem;
  margin-top: 2rem;
}

.user-name-Nav {
    font-weight: 500;
    color: #2c3e50;
    font-size: 1rem;
}
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '文章列表|CoCo-Community',
  meta: [
    { name: 'description', content: "CoCo-Community的文章列表，包含各种技术与创意相关的文章。" }
  ]
})
</script>