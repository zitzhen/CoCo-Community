<template>
  <div id="app">
    <div class="article-detail">
      <div class="article-header">
        <h1 class="article-title">{{ article.name }}</h1>
        <div class="article-meta">
          <span class="author">作者：{{ article.author }}</span>
          <span class="date">发布时间：{{ formatDate(article.publication_time) }}</span>
          <div class="article-stats">
            <span><i class="fas fa-eye"></i> {{ article.pageviews }} 浏览</span>
            <span><i class="fas fa-thumbs-up"></i> {{ article.Like }} 点赞</span>
            <span><i class="fas fa-star"></i> {{ article.collect }} 收藏</span>
            <span><i class="fas fa-comment"></i> {{ article.comments || 0 }} 评论</span>
          </div>
        </div>
      </div>

      <div class="article-content" v-html="article.content"></div>
    </div>


  </div>
</template>
<script>
import axios from 'axios';
import { marked } from 'marked';

export default {
  data() {
    return {
      essaylist: [],
      article: {
        name: "测试",
        author: "测试工程师",
        publication_time: new Date().toISOString(),
        pageviews: 0,
        Like: 0,
        collect: 0,
        comments: 0,
        content: ""
      }
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    goHome(event) {
      event.preventDefault();
      this.$router.push('/');
    },
    async fetchArticleDetail() {
      try {
        // 获取文章列表
        const response = await axios.get('/essaylist.json');
        this.essaylist = response.data.list || [];
        
        // 从路由参数获取文章ID
        const articleId = this.$route.params.id;
        
        // 根据ID查找对应的文章
        // 现在使用文章的ID字段进行匹配
        const article = this.essaylist.find(item => 
          item.id && item.id.toString() === articleId
        );
        
        if (article) {
          // 使用marked解析Markdown内容
          const parsedContent = marked(article.content || "");
          this.article = {
            name: article.name,
            author: article.author,
            publication_time: article.publication_time,
            pageviews: article.pageviews || 0,
            Like: article.Like || 0,
            collect: article.collect || 0,
            comments: article.comments || 0,
            content: parsedContent
          };
        } else {
          console.error(`未找到ID为 ${articleId} 的文章`);
          // 可以跳转到404页面或显示错误信息
          this.$router.push('/NotFound');
        }
      } catch (error) {
        console.error("获取文章详情失败：", error);
      }
    }
  },
  mounted() {
    this.updateLoginInfo();
    // 获取文章详情
    this.fetchArticleDetail();
  }
}
</script>

<style>
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

.article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.article-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.article-title {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.article-stats {
  display: flex;
  gap: 1.5rem;
}

.article-stats span {
  display: flex;
  align-items: center;
}

.article-stats i {
  margin-right: 0.3rem;
  color: var(--primary-color);
}

.article-content {
  line-height: 1.8;
  color: #333;
  font-size: 1.05rem;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.article-content h1 {
  font-size: 1.8rem;
}

.article-content h2 {
  font-size: 1.6rem;
}

.article-content h3 {
  font-size: 1.4rem;
}

.article-content p {
  margin-bottom: 1rem;
}

.article-content a {
  color: var(--primary-color);
}

.article-content ul,
.article-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.article-content li {
  margin-bottom: 0.5rem;
}

.article-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
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

