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

    <!-- 评论区 -->
    <div class="comments-section">
      <div class="comments-header">
        <h3>评论 <span class="comment-count">({{ article.comments || 0 }})</span></h3>
      </div>

      <!-- 评论输入框 -->
      <div class="comment-input-area" v-if="isLoggedIn">
        <div class="user-avatar-small">
          <img :src="avatar" :alt="username" />
        </div>
        <div class="comment-input-container">
          <textarea 
            v-model="newComment" 
            placeholder="写下你的评论..."
            class="comment-input"
            rows="3"
          ></textarea>
          <div class="comment-actions">
            <button @click="submitComment" class="submit-comment-btn">发布评论</button>
          </div>
        </div>
      </div>

      <!-- 登录提示 -->
      <div class="comment-login-prompt" v-else>
        <p>请 <a @click="goLogin" class="login-link">登录</a> 后发表评论</p>
      </div>

      <!-- 评论列表 -->
      <div class="comments-list">
        <div 
          v-for="(comment, index) in comments" 
          :key="index" 
          class="comment-item"
        >
          <div class="comment-avatar">
            <img :src="comment.avatar || '/images/user.png'" :alt="comment.username" />
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-username">{{ comment.username }}</span>
              <span class="comment-time">{{ formatDate(comment.time) }}</span>
            </div>
            <div class="comment-text">{{ comment.content }}</div>
            <div class="comment-actions">
              <!--
              <button class="like-comment-btn">
                <i class="fas fa-thumbs-up"></i> {{ comment.likes || 0 }}
              </button>
              -->
            </div>
          </div>
        </div>
      </div>
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
        name: "",
        author: "",
        publication_time: new Date().toISOString(),
        pageviews: 0,
        Like: 0,
        collect: 0,
        comments: 0,
        content: ""
      },
      newComment: "",
      comments: []
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
  methods: {
    async updateLoginInfo() {
      try {
        const logininformation = await checkLoginStatus();
        if (!logininformation || !logininformation.authenticated) {
          this.username = '未登录用户';
          this.avatar = '/images/user.png';
          this.isLoggedIn = false;
        } else {
          this.username = logininformation.user.name || logininformation.user.login;
          this.avatar = logininformation.user.avatar_url || '/images/user.png';
          this.isLoggedIn = true;
        }
      } catch (err) {
        console.error("登录检查失败：", err);
        this.username = '登录信息检查失败';
        this.isLoggedIn = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    goHome(event) {
      event.preventDefault();
      this.$router.push('/');
    },
    goMe() {
      this.$router.push('/me');
    },
    goLogin() {
      this.$router.push('/login');
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
    },
    submitComment() {
      if (!this.isLoggedIn) {
        this.goLogin();
        return;
      }
      
      if (!this.newComment.trim()) {
        alert('请输入评论内容');
        return;
      }
      
      // 创建新评论
      const newCommentObj = {
        id: this.comments.length + 1,
        username: this.username,
        avatar: this.avatar,
        content: this.newComment,
        time: new Date().toISOString(),
        likes: 0
      };
      
      // 添加到评论列表
      this.comments.unshift(newCommentObj);
      
      // 清空输入框
      this.newComment = "";
      
      // 更新文章评论数
      this.article.comments = this.comments.length;
    }
  },
  mounted() {
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

/* 评论区样式 */
.comments-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.comments-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.comments-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.comment-count {
  color: var(--primary-color);
  font-weight: normal;
  font-size: 1rem;
}

.comment-input-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-container {
  flex: 1;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
  font-family: inherit;
  margin-bottom: 0.5rem;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-comment-btn {
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.submit-comment-btn:hover {
  background-color: var(--secondary-color);
}

.comment-login-prompt {
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.login-link {
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
}

.comments-list {
  margin-top: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 40px;
  height: 40px;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-username {
  font-weight: 500;
  color: var(--text-color);
}

.comment-time {
  color: #999;
  font-size: 0.85rem;
}

.comment-text {
  margin-bottom: 0.75rem;
  line-height: 1.6;
  color: #444;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.like-comment-btn,
.reply-comment-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.like-comment-btn:hover,
.reply-comment-btn:hover {
  color: var(--primary-color);
}
</style>

