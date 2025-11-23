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

    <div class="container">
      <div class="essays-header">
        <h1>文章列表</h1>
        <p>探索社区分享的知识与经验</p>
      </div>

      <div class="essays-grid" v-if="essays.length > 0">
        <div 
          class="essay-card" 
          v-for="essay in essays" 
          :key="essay.id"
          @click="viewEssay(essay.id)"
        >
          <div class="essay-cover" v-if="essay.cover_url">
            <img :src="essay.cover_url" :alt="essay.title" />
          </div>
          <div class="essay-info">
            <h3 class="essay-title">{{ essay.title }}</h3>
            <div class="essay-meta">
              <span class="essay-author">作者: {{ essay.author }}</span>
              <span class="essay-date">{{ formatDate(essay.release_date) }}</span>
            </div>
            <div class="essay-tags">
              <span 
                class="tag" 
                v-for="tag in essay.labels" 
                :key="tag"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-essays" v-else-if="!loading">
        <p>暂无文章</p>
      </div>

      <div class="loading" v-if="loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
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
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'EssayList',
  data() {
    return {
      avatar_ber: "/images/user.png",
      username: "未登录用户",
      essays: [],
      loading: true
    }
  },
  methods: {
    gome() {
      this.$router.push('/me');
    },
    gohome() {
      this.$router.push('/');
    },
    viewEssay(id) {
      this.$router.push(`/essay/all/${id}`);
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
    async loadEssays() {
      try {
        // 获取所有文章信息
        const essayDirs = [
          '1,关于CoCo限制自定义控件那些事',
          '2,ZIT-CoCo-community的群规定',
          'example'
        ];

        const essays = [];
        
        for (const dir of essayDirs) {
          try {
            // 获取文章信息
            const infoRes = await fetch(`/information/essay/${dir}/information.json`);
            if (infoRes.ok) {
              const info = await infoRes.json();
              
              // 获取文章内容用于预览
              const readmeRes = await fetch(`/essay/${dir}/README.md`);
              let title = '未知标题';
              if (readmeRes.ok) {
                const content = await readmeRes.text();
                // 提取标题（第一行以 # 开头的内容）
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
              
              essays.push({
                id: dir,
                title: title,
                author: info.author || '未知作者',
                release_date: info.release_date || '未知日期',
                labels: info.label ? info.label.split(',').map(tag => tag.trim().replace(/^#/, '')) : [],
                cover_url: info.cover_url || ''
              });
            }
          } catch (e) {
            console.error(`加载文章 ${dir} 时出错:`, e);
          }
        }
        
        this.essays = essays;
      } catch (error) {
        console.error('加载文章列表时出错:', error);
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
    
    // 加载文章列表
    await this.loadEssays();
  }
}
</script>

<style scoped>
@import "@/assets/css/style.css";
@import "@/assets/css/Navigation-bar.css";

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.essays-header {
  text-align: center;
  margin-bottom: 40px;
}

.essays-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.essays-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.essays-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.essay-card {
  background: var(--card-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.essay-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.essay-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.essay-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.essay-info {
  padding: 20px;
}

.essay-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.essay-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.essay-author {
  font-weight: 500;
}

.essay-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background: var(--primary-color);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.no-essays {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  font-size: 1.2rem;
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
  .essays-grid {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }
  
  .essay-title {
    font-size: 1.2rem;
  }
  
  .container {
    padding: 15px;
  }
  
  .essay-meta {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>