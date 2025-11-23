<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo" @click="gohome">ZIT<span>-CoCo-Community</span></div>
        <div class="user-info" @click="gome">
          <img :src="avatar_ber" alt="用户头像" class="user-avatar">
          <div class="user-name">{{ username }}</div>
        </div>
      </div>
    </nav>
    
    <div style="height: 90px;"></div>

    <div class="container" v-if="!loading && !error">
      <article class="essay-content">
        <header class="essay-header">
          <h1 class="essay-title">{{ essay.title }}</h1>
          <div class="essay-meta">
            <div class="meta-item">
              <i class="fas fa-user"></i>
              <span>作者: {{ essay.author }}</span>
            </div>
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              <span>发布日期: {{ formatDate(essay.release_date) }}</span>
            </div>
            <div class="meta-item tags-container">
              <i class="fas fa-tags"></i>
              <div class="tags">
                <span 
                  class="tag" 
                  v-for="tag in essay.labels" 
                  :key="tag"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
          <div class="essay-cover" v-if="essay.cover_url">
            <img :src="essay.cover_url" :alt="essay.title" />
          </div>
        </header>

        <div class="essay-body" v-html="essay.contentHtml"></div>
      </article>
    </div>

    <div class="container" v-else-if="error">
      <div class="error-container">
        <h2>文章未找到</h2>
        <p>{{ error }}</p>
        <button class="back-btn" @click="goBack">返回文章列表</button>
      </div>
    </div>

    <div class="loading" v-if="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <footer>
      <div class="container">
        <p>© 2025 小圳社区 - CoCo-Community | 所有文章仅供学习交流使用</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'EssayDetail',
  data() {
    return {
      avatar_ber: "/images/user.png",
      username: "未登录用户",
      essay: {},
      loading: true,
      error: null
    }
  },
  methods: {
    gome() {
      this.$router.push('/me');
    },
    gohome() {
      this.$router.push('/');
    },
    goBack() {
      this.$router.push('/essay/all');
    },
    formatDate(dateString) {
      try {
        // 尝试解析不同格式的日期
        let date = new Date(dateString);
        if (isNaN(date.getTime())) {
          // 如果不是标准格式，尝试手动解析
          const match = dateString.match(/(\d{4}).*?(\d{1,2}).*?(\d{1,2})/);
          if (match) {
            date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
          }
        }
        return date.toLocaleDateString('zh-CN');
      } catch (e) {
        return dateString; // 如果解析失败，返回原始字符串
      }
    },
    async loadEssay() {
      const route = useRoute();
      const { id } = route.params;

      if (!id) {
        this.error = '未指定文章ID';
        this.loading = false;
        return;
      }

      try {
        // 获取文章信息
        const infoRes = await fetch(`/information/essay/${id}/information.json`);
        if (!infoRes.ok) {
          throw new Error(`未找到文章信息: HTTP ${infoRes.status}`);
        }
        const info = await infoRes.json();

        // 获取文章内容
        const readmeRes = await fetch(`/essay/${id}/README.md`);
        if (!readmeRes.ok) {
          throw new Error(`未找到文章内容: HTTP ${readmeRes.status}`);
        }
        const content = await readmeRes.text();

        // 提取标题（如果信息中没有标题）
        let title = info.title || '未知标题';
        if (!title || title === '未知标题') {
          // 从内容中提取标题
          const lines = content.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('# ')) {
              title = line.trim().substring(2);
              break;
            } else if (line.trim().startsWith('#')) {
              title = line.trim().substring(1).trim();
              break;
            }
          }
        }

        // 设置文章数据
        this.essay = {
          id: id,
          title: title,
          author: info.author || '未知作者',
          release_date: info.release_date || '未知日期',
          labels: info.label ? info.label.split(',').map(tag => tag.trim().replace(/^#/, '')) : [],
          cover_url: info.cover_url || '',
          contentHtml: marked.parse(content)
        };
      } catch (err) {
        console.error('加载文章时出错:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    // 检查登录状态
    checkLoginStatus().then((logininformation) => {
      if (!logininformation || !logininformation.authenticated) {
        this.username = '未登录用户';
        this.avatar_ber = '/images/user.png';
      } else {
        this.username = logininformation.user.name || logininformation.user.login;
        this.avatar_ber = logininformation.user.avatar_url || '/images/user.png';
      }
    }).catch((err) => {
      console.error("登录检查失败：", err);
      this.username = '登录信息检查失败';
    });

    // 加载文章内容
    await this.loadEssay();
  }
}
</script>

<style scoped>
@import "@/assets/css/style.css";
@import "@/assets/css/Navigation-bar.css";

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.essay-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.essay-title {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 20px 0;
  line-height: 1.3;
}

.essay-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  color: #7f8c8d;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.tags-container {
  flex-direction: row;
  align-items: center;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.essay-cover {
  margin-top: 20px;
}

.essay-cover img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.essay-body {
  line-height: 1.8;
  color: #34495e;
  font-size: 1.05rem;
}

.essay-body h1,
.essay-body h2,
.essay-body h3,
.essay-body h4,
.essay-body h5,
.essay-body h6 {
  color: #2c3e50;
  margin-top: 24px;
  margin-bottom: 16px;
}

.essay-body h1 {
  font-size: 1.8rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 8px;
}

.essay-body h2 {
  font-size: 1.6rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
}

.essay-body h3 {
  font-size: 1.4rem;
}

.essay-body h4 {
  font-size: 1.3rem;
}

.essay-body h5 {
  font-size: 1.2rem;
}

.essay-body h6 {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.essay-body p {
  margin: 0 0 16px 0;
}

.essay-body a {
  color: var(--primary-color);
  text-decoration: none;
}

.essay-body a:hover {
  text-decoration: underline;
}

.essay-body ul,
.essay-body ol {
  margin: 16px 0;
  padding-left: 32px;
}

.essay-body li {
  margin: 8px 0;
}

.essay-body blockquote {
  border-left: 4px solid var(--primary-color);
  padding: 0 16px;
  margin: 16px 0;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 0 4px 4px 0;
}

.essay-body code {
  background-color: #f1f2f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9em;
}

.essay-body pre {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 16px 0;
}

.essay-body pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.essay-body img {
  max-width: 100%;
  border-radius: 6px;
  margin: 10px 0;
}

.error-container {
  text-align: center;
  padding: 60px 20px;
}

.error-container h2 {
  color: #e74c3c;
  margin-bottom: 15px;
}

.back-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

.back-btn:hover {
  background-color: var(--secondary-color);
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

footer {
  margin-top: 60px;
  padding: 20px 0;
  background-color: #f8f9fa;
  text-align: center;
  color: #7f8c8d;
}

@media screen and (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .essay-title {
    font-size: 1.7rem;
  }
  
  .essay-meta {
    font-size: 0.9rem;
  }
  
  .essay-body {
    font-size: 1rem;
  }
}
</style>