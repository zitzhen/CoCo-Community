<template>
<div id="app">
<div style="height: 65px;"></div>

    <!-- 搜索页面主体 -->
    <div class="search-page-container">
      <div class="search-container">
        <div class="search-bar">
          <input 
            type="text" 
            id="globalSearchInput" 
            placeholder="搜索控件、文章、用户..." 
            v-model="searchTerm" 
            @keyup.enter="performSearch"
          >
          <button id="globalSearchBtn" @click="performSearch">
            <i class="fas fa-search"></i> 搜索
          </button>
        </div>
        
        <!-- 搜索结果分类 -->
        <div class="search-filters" v-if="hasResults">
          <div 
            class="filter-item" 
            :class="{ active: activeTab === 'all' }"
            @click="switchTab('all')"
          >
            全部 ({{ totalResults }})
          </div>
          <div 
            class="filter-item" 
            :class="{ active: activeTab === 'controls' }"
            @click="switchTab('controls')"
          >
            控件 ({{ searchResults.controls.length }})
          </div>
          <div 
            class="filter-item" 
            :class="{ active: activeTab === 'articles' }"
            @click="switchTab('articles')"
          >
            文章 ({{ searchResults.articles.length }})
          </div>
          <div 
            class="filter-item" 
            :class="{ active: activeTab === 'users' }"
            @click="switchTab('users')"
          >
            用户 ({{ searchResults.users.length }})
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div class="loading" v-if="loading">
          <p>搜索中，请稍候...</p>
        </div>
        
        <!-- 搜索结果 -->
        <div class="search-results" v-if="hasResults && !loading">
          <div class="results-header">
            <h2>搜索结果</h2>
            <p>找到 {{ totalResults }} 个结果 (用时 {{ searchTime }} ms)</p>
          </div>
          
          <!-- 控件结果 -->
          <div class="result-section" v-if="activeTab === 'all' || activeTab === 'controls'">
            <h3 v-if="searchResults.controls.length > 0">控件</h3>
            <div class="search-control-list" id="search-controlList">
              <div class="search-control-card" v-for="control in searchResults.controls" :key="control.name">
                <div class="search-control-header">
                  <div class="search-control-icon">
                    <i class="fas fa-search-control-code"></i>
                  </div>
                  <div class="search-control-meta">
                    <div class="search-control-name">{{ control.name }}</div>
                    <div class="search-control-author">作者：{{ control.author }}</div>
                  </div>
                </div>

                <div class="search-control-stats">
                  <div><i class="fas fa-search-control"></i> {{ control.size }}</div>
                  <div><i class="fas fa-download"></i> {{ control.downloads }}</div>
                  <div><i class="fas fa-eye"></i> {{ control.Pageviews }}</div>
                </div>

                <div class="button-group">
                  <a :href="control.url" class="icon-btn" title="下载">
                    <i class="fas fa-download"></i>
                  </a>
                  <a :href="control.url" class="text-btn">
                    <i class="fas fa-eye"></i> 去详情页面
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 文章结果 -->
          <div class="result-section" v-if="activeTab === 'all' || activeTab === 'articles' && searchResults.articles.length > 0">
            <h3>文章</h3>
            <div class="article-list">
              <div class="article-item" v-for="article in searchResults.articles" :key="article.id">
                <div class="article-header">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <div class="article-meta">
                    <span class="article-author">作者：{{ article.author }}</span>
                    <span class="article-date">{{ formatDate(article.date) }}</span>
                  </div>
                </div>
                <p class="article-excerpt">{{ article.excerpt }}</p>
                <a :href="article.url" class="read-more">阅读更多</a>
              </div>
            </div>
          </div>
          
          <!-- 用户结果 -->
          <div class="result-section" v-if="activeTab === 'all' || activeTab === 'users' && searchResults.users.length > 0">
            <h3>用户</h3>
            <div class="user-list">
              <div class="user-item" v-for="user in searchResults.users" :key="user.id">
                <img :src="user.avatar" :alt="user.name" class="user-avatar-small">
                <div class="search-user-info">
                  <div class="search-user-name">{{ user.name }}</div>
                  <div class="user-login">@{{ user.login }}</div>
                </div>
                <a :href="user.url" class="view-prosearch-control">查看资料</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 无结果提示 -->
        <div class="no-results" v-if="!loading && !hasResults">
          <h2>未找到相关结果</h2>
          <p>尝试使用其他关键词搜索</p>
        </div>
        
        <!-- 搜索历史 -->
        <div class="search-suggestions" v-if="!searchTerm && !loading">
          <h3>热门搜索</h3>
          <div class="suggestions-list">
            <span 
              class="suggestion-item" 
              v-for="suggestion in popularSearches" 
              :key="suggestion"
              @click="searchWithTerm(suggestion)"
            >
              {{ suggestion }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'Search',
  data() {
    return {
      searchTerm: '',
      searchResults: {
        controls: [],
        articles: [],
        users: []
      },
      loading: false,
      activeTab: 'all',
      searchTime: 0,
      popularSearches: []
    };
  },
  computed: {
    hasResults() {
      return this.searchResults.controls.length > 0 || 
             this.searchResults.articles.length > 0 || 
             this.searchResults.users.length > 0;
    },
    totalResults() {
      return this.searchResults.controls.length + 
             this.searchResults.articles.length + 
             this.searchResults.users.length;
    }
  },
  methods: {
    async performSearch() {
      if (!this.searchTerm.trim()) return;
      
      this.loading = true;
      const startTime = Date.now();
      
      try {
        // 搜索控件
        const controls = await this.searchControls(this.searchTerm);
        // 搜索文章（模拟，因为项目中没有文章搜索API）
        const articles = await this.searchArticles(this.searchTerm);
        // 搜索用户（模拟，因为项目中没有用户搜索API）
        const users = await this.searchUsers(this.searchTerm);
        
        this.searchResults = {
          controls,
          articles,
          users
        };
        
        this.searchTime = Date.now() - startTime;
      } catch (error) {
        console.error('搜索出错:', error);
      } finally {
        this.loading = false;
      }
    },
    async searchControls(term) {
      try {
        const { data } = await axios.get('/control/list.json');
        const allControls = data.list || [];
        
        const filteredControls = allControls.filter(control => 
          control.name.toLowerCase().includes(term.toLowerCase()) ||
          control.author.toLowerCase().includes(term.toLowerCase())
        ).map(control => ({
          id: control.id,
          name: control.name,
          author: control.author,
          size: control.size,
          downloads: control.downloads,
          Pageviews: control.Pageviews,
          url: `${window.location.origin}/control/${control.name}`
        }));
        
        return filteredControls;
      } catch (error) {
        console.error('搜索控件出错:', error);
        return [];
      }
    },
    async searchArticles(term) {
      // 搜索文章
      try {
        const response = await axios.get('/essaylist.json');
        const allArticles = Array.isArray(response.data) ? response.data : [];
        
        const filteredArticles = allArticles.filter(article => 
          article.title && article.title.toLowerCase().includes(term.toLowerCase()) ||
          (article.author && article.author.toLowerCase().includes(term.toLowerCase())) ||
          (article.content && article.content.toLowerCase().includes(term.toLowerCase()))
        ).map(article => ({
          id: article.id || article.title?.toLowerCase().replace(/\s+/g, '-'),
          title: article.title || '无标题',
          author: article.author || '未知作者',
          date: article.date || '',
          excerpt: article.content ? (article.content.length > 100 ? article.content.substring(0, 100) + '...' : article.content) : '无内容预览',
          url: `${window.location.origin}/essay/${article.id || article.title?.toLowerCase().replace(/\s+/g, '-')}`
        }));
        
        return filteredArticles;
      } catch (error) {
        console.error('搜索文章出错:', error);
        return [];
      }
    },
    async searchUsers(term) {
      // 搜索用户
      try {
        const response = await axios.get('/userlist.json');
        const allUsers = Array.isArray(response.data) ? response.data : [];
        
        const filteredUsers = allUsers.filter(user => 
          (user.name && user.name.toLowerCase().includes(term.toLowerCase())) ||
          (user.login && user.login.toLowerCase().includes(term.toLowerCase()))
        ).map(user => ({
          id: user.id || user.login,
          name: user.name || user.login || '未知用户',
          login: user.login || 'unknown',
          avatar: user.avatar || '/images/user.png',
          url: `${window.location.origin}/user/${user.login || user.id}`
        }));
        
        return filteredUsers;
      } catch (error) {
        console.error('搜索用户出错:', error);
        return [];
      }
    },
    switchTab(tabName) {
      this.activeTab = tabName;
    },
    goHome(event) {
      event.preventDefault();
      this.$router.push('/');
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    searchWithTerm(term) {
      this.searchTerm = term;
      this.performSearch();
    }
  },
  mounted() {
    this.updateLoginInfo();
    
    // 如果URL中有搜索参数，执行搜索
    const query = this.$route.query.q;
    if (query) {
      this.searchTerm = query;
      this.performSearch();
    }
  }
}
</script>

<style scoped>
@import url(@/assets/css/dark.css);

.search-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

.search-bar input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.search-bar button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.search-bar button:hover {
  background-color: #2980b9;
}

.search-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-item {
  padding: 8px 16px;
  background-color: #f0f4f8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-item:hover {
  background-color: #e1e8ed;
}

.filter-item.active {
  background-color: #3498db;
  color: white;
}

.results-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e4e8;
}

.results-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.results-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.result-section {
  margin-bottom: 2rem;
}

.result-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.search-control-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-control-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-control-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.search-control-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.search-control-icon {
  width: 40px;
  height: 40px;
  background-color: #f0f4f8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
}

.search-control-meta .search-control-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.2rem;
}

.search-control-meta .search-control-author {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.search-control-stats {
  display: flex;
  gap: 1.5rem;
  margin-right: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f0f4f8;
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background-color: #3498db;
  color: white;
}

.text-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.text-btn:hover {
  background-color: #2980b9;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-header {
  margin-bottom: 1rem;
}

.article-title {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.article-excerpt {
  color: #586069;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
}

.search-user-info {
  flex: 1;
}

.search-user-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.2rem;
}

.user-login {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.view-prosearch-control {
  padding: 0.5rem 1rem;
  background-color: #f0f4f8;
  color: #3498db;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.view-prosearch-control:hover {
  background-color: #e1e8ed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: #7f8c8d;
}

.no-results h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.search-suggestions {
  margin-top: 2rem;
}

.search-suggestions h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-item {
  padding: 0.5rem 1rem;
  background-color: #f0f4f8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background-color: #3498db;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  
  .search-bar button {
    width: 100%;
  }
  
  .search-control-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-control-stats {
    align-self: flex-start;
    margin-left: 3.5rem;
  }
  
  .button-group {
    align-self: flex-end;
  }
  
  .filter-item {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .search-page-container {
    padding: 0.5rem;
  }
}
</style>