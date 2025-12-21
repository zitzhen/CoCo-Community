<template>
  <div id="app">
    <div class="essay-author-info-section">
      <div class="essay-main-content">
        <div class="essay-detail">
          <div class="essay-header">
            <h1 class="essay-title">{{ essay.name }}</h1>
            <div class="essay-meta">
              <span class="author">作者：{{ essay.author }}</span>
              <span class="date">发布时间：{{ formatDate(essay.publication_time) }}</span>
              <div class="essay-stats">
                <span><i class="fas fa-eye"></i> {{ essay.pageviews }} 浏览</span>
                <span><i class="fas fa-thumbs-up"></i> {{ essay.Like }} 点赞</span>
                <span><i class="fas fa-star"></i> {{ essay.collect }} 收藏</span>
                <span><i class="fas fa-comment"></i> {{ essay.comments || 0 }} 评论</span>
              </div>
            </div>
          </div>

          <div class="essay-content" v-html="essay.content"></div>
          
          <!-- 文章底部的点赞和收藏按钮 -->
          <div class="essay-bottom-actions">
            <button @click="toggleLike" :class="['essay-action-btn', 'like-btn', { 'liked': isLiked }]">
              <i :class="['fas', isLiked ? 'fa-thumbs-up' : 'fa-thumbs-up']"></i>
              <span>{{ isLiked ? '已点赞' : '点赞' }} ({{ essay.Like || 0 }})</span>
            </button>
            <button @click="toggleCollect" :class="['essay-action-btn', 'collect-btn', { 'collected': isCollected }]">
              <i :class="['fas', isCollected ? 'fa-star' : 'fa-star']"></i>
              <span>{{ isCollected ? '已收藏' : '收藏' }} ({{ essay.collect || 0 }})</span>
            </button>
          </div>
        </div>

        <!-- 评论区 -->
        <div class="essay-comments-section">
          <div class="essay-comments-header">
            <h3>评论 <span class="essay-comment-count">({{ essay.comments || 0 }})</span></h3>
          </div>

          <!-- 评论输入框 -->
          <div class="essay-comment-input-area" v-if="isLoggedIn">
            <div class="essay-comment-input-container">
              <textarea 
                v-model="newComment" 
                placeholder="写下你的评论..."
                class="essay-comment-input"
                rows="3"
              ></textarea>
              <div class="essay-comment-actions">
                <button @click="submitComment" class="essay-submit-comment-btn">发布评论</button>
              </div>
            </div>
          </div>

          <!-- 登录提示 -->
          <div class="essay-comment-login-prompt" v-else>
            <p>请<router-link to="/login" class="essay-login-bin">登录</router-link>后发表评论</p>
          </div>

          <!-- 评论列表 -->
          <div class="essay-comments-list">
            <div 
              v-for="(comment, index) in comments" 
              :key="index" 
              class="essay-comment-item"
            >
              <div class="essay-comment-avatar">
                <img :src="comment.avatar || '/images/user.png'" :alt="comment.nickname || comment.username" />
              </div>
              <div class="essay-comment-content">
                <div class="essay-comment-header">
                  <span class="essay-comment-username">{{ comment.nickname || comment.username }}</span>
                  <span class="essay-comment-time">{{ formatDate(comment.time) }}</span>
                </div>
                <div class="essay-comment-text">{{ comment.content }}</div>
                <div class="essay-comment-actions">
                  <!--
                  <button class="essay-like-comment-btn">
                    <i class="fas fa-thumbs-up"></i> {{ comment.likes || 0 }}
                  </button>
                  -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="essay-sidebar">
        <!-- 作者信息卡片 -->
        <div class="essay-creator-card">
          <h3 class="essay-section-title"><i class="fas fa-user"></i> 作者信息</h3>
          <div class="essay-creator-info">
            <img :src="authorAvatar" :alt="essay.author" class="essay-creator-avatar" />
            <div><h4 class="essay-creator-name">{{ essay.author }}</h4></div>
          </div>
          <div class="essay-creator-bio"><p>{{ authorBio }}</p></div>
        </div>
        <div class="essay-stats-card">
          <h3 class="essay-section-title"><i class="fas fa-chart-bar"></i> 文章统计</h3>
          <div class="essay-stat-item">
            <span class="essay-stat-label">发布时间</span>
            <span class="essay-stat-value">{{ formatDate(essay.publication_time) }}</span>
          </div>
          <div class="essay-stat-item">
            <span class="essay-stat-label">浏览量</span>
            <span class="essay-stat-value">{{ essay.pageviews }} 次</span>
          </div>
          <div class="essay-stat-item">
            <span class="essay-stat-label">点赞数</span>
            <span class="essay-stat-value">{{ essay.Like }} 次</span>
          </div>
          <div class="essay-stat-item">
            <span class="essay-stat-label">收藏数</span>
            <span class="essay-stat-value">{{ essay.collect }} 次</span>
          </div>
          <div class="essay-actions">
            <button @click="toggleLike" :class="['essay-action-btn', 'like-btn', { 'liked': isLiked }]">
              <i :class="['fas', isLiked ? 'fa-thumbs-up' : 'fa-thumbs-up']"></i>
              <span>{{ isLiked ? '已点赞' : '点赞' }}</span>
            </button>
            <button @click="toggleCollect" :class="['essay-action-btn', 'collect-btn', { 'collected': isCollected }]">
              <i :class="['fas', isCollected ? 'fa-star' : 'fa-star']"></i>
              <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

 <!--需要登录-->
 <div class="modal-overlay" :class="{ active: islogintip }" @click="clonelogintip">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">请登录</h2>
        <button class="close-btn" @click="clonelogintip">×</button>
      </div>
      <div class="modal-body">
        <p>抱歉，您需要登录才能 点赞/收藏/发表评论</p>
        <p>点击右上角登录按钮，或点击下方按钮登录</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="closeNicknameModal">好的</button>
        <button class="modal-btn modal-btn-confirm" @click="gologin">去登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import { checkLoginStatus } from '@/script/login';

export default {
  data() {
    return {
      essaylist: [],
      essay: {
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
      comments: [],
      isLoggedIn: false,
      authorAvatar: '/images/user.png',
      authorBio: '暂无作者简介',
      isLiked: false,
      isCollected: false,
      islogintip: false
    };
  },
  methods: {
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
    },gologin(){
      this.$router.push('/login');
    },
    async fetchessayDetail() {
      try {
        // 获取文章列表
        const response = await axios.get('/essaylist.json');
        this.essaylist = response.data.list || [];
        
        // 从路由参数获取文章ID
        const essayId = this.$route.params.id;
        
        // 根据ID查找对应的文章
        // 现在使用文章的ID字段进行匹配
        const essay = this.essaylist.find(item => 
          item.id && item.id.toString() === essayId
        );
        
        if (essay) {
          // 使用marked解析Markdown内容
          const parsedContent = marked(essay.content || "");
          this.essay = {
            name: essay.name,
            author: essay.author,
            publication_time: essay.publication_time,
            pageviews: essay.pageviews || 0,
            Like: essay.Like || 0,
            collect: essay.collect || 0,
            comments: essay.comments || 0,  // 初始值从JSON获取，但会在fetchComments中被数据库实际值覆盖
            content: parsedContent
          };
        } else {
          console.error(`未找到ID为 ${essayId} 的文章`);
          // 可以跳转到404页面或显示错误信息
          this.$router.push('/NotFound');
        }
      } catch (error) {
        console.error("获取文章详情失败：", error);
      }
    },
    async fetchComments(){
      try{
        // 从路由参数获取文章ID
        const essayId = this.$route.params.id;
        
        const response = await axios.get(`https://cc.zitzhen.cn/api/fetch-comment-essay?EssayID=${essayId}`);
        
        if (response.data && response.data.data) {
          // API 返回的是 comment 数组，而非 comments
          this.comments = response.data.data.comment || [];
          // 输出获取到的头像和昵称

          /*
          this.comments.forEach((comment, index) => {
            console.log(`评论 ${index + 1}:`);
            console.log(`  用户名: ${comment.username}`);
            console.log(`  昵称: ${comment.nickname}`);
            console.log(`  头像: ${comment.avatar}`);
          });
          /*/

          // 更新文章的评论数
          this.essay.comments = response.data.data.count || 0;
        } else {
          this.comments = [];
          console.error('响应数据格式不正确，设置为空数组');
        }
        
        return this.comments;

      }catch(error){
        console.error("获取评论失败：", error);
        console.error("错误详情：", error.response || error.message);
        this.comments = [];
        return [];
      }
    },
    async fetchAuthorInfo() {
      try {
        if (!this.essay.author) {
          console.log('文章作者信息为空，跳过获取');
          return;
        }

        // 检查登录状态
        const loginStatus = await checkLoginStatus();
        let creatorRes;
        
        if (loginStatus && loginStatus.authenticated) {
          // 已登录，使用内部API
          creatorRes = await fetch(`/api/github/user/?username=${this.essay.author}`);
        } else {
          // 未登录，使用GitHub API
          creatorRes = await fetch(`https://api.github.com/users/${this.essay.author}`);
        }
        
        if (creatorRes.ok) {
          const creator = await creatorRes.json();
          this.authorAvatar = creator.avatar_url || '/images/user.png';
          this.authorBio = creator.bio || '暂无作者简介';
        } else {
          console.log(`获取作者信息失败，HTTP状态: ${creatorRes.status}`);
          this.authorAvatar = '/images/user.png';
          this.authorBio = '暂无作者简介';
        }
      } catch (error) {
        console.error("获取作者信息过程中发生错误：", error);
        this.authorAvatar = '/images/user.png';
        this.authorBio = '暂无作者简介';
      }
    },
    async submitComment() {
      
      if (!this.newComment.trim()) {
        alert('请输入评论内容');
        return;
      }
      
      // 检查用户是否登录
      if (!this.isLoggedIn) {
        this.islogintip = true;
        return;
      }
      
      // 从路由参数获取文章ID
      const essayId = this.$route.params.id;
      
      // 获取当前用户名
      const logininformation = await checkLoginStatus();
      const username = logininformation?.user?.login || '未知用户';
      
      // 将评论请求至服务器
      try{
        const response = await fetch("https://cc.zitzhen.cn/api/comment-essay",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            EssayID: parseInt(essayId),
            content: this.newComment
          })
        })
        
        if (response.ok) {
          const result = await response.json();
          
          // 重新获取评论列表，以确保新评论包含完整的用户信息
          await this.fetchComments();
          //console.log('重新获取评论列表完成');
          
          // 清空输入框
          this.newComment = '';
          
        } else {
          console.error("发送评论失败：" + response.status);
          if (response.status === 401) {
            alert('登录状态已过期，请重新登录');
            this.$router.push('/login');
          } else {
            alert('发表评论失败，请重试');
          }
        }
      }catch(error){
        console.error("发送评论失败："+"\n" + error);
        alert('网络错误，请稍后重试');
      }
    },
    async toggleLike() {
      if (!this.isLoggedIn) {
        this.islogintip = true;
        return;
      }
      
      // 临时更新UI状态
      if (this.isLiked) {
        this.isLiked = false;
        this.essay.Like = Math.max(0, (this.essay.Like || 0) - 1);
      } else {
        this.isLiked = true;
        this.essay.Like = (this.essay.Like || 0) + 1;
      }
      
      // TODO: 实际的API调用应该在这里进行
      // await this.callLikeAPI();
    },
    async toggleCollect() {
      if (!this.isLoggedIn) {
        this.islogintip = true;
        return;
      }
      
      // 临时更新UI状态
      if (this.isCollected) {
        this.isCollected = false;
        this.essay.collect = Math.max(0, (this.essay.collect || 0) - 1);
      } else {
        this.isCollected = true;
        this.essay.collect = (this.essay.collect || 0) + 1;
      }
      
      // TODO: 实际的API调用应该在这里进行
      // await this.callCollectAPI();
    },
    clonelogintip() {
      this.islogintip = false;
    },
    closeNicknameModal() {
      this.islogintip = false;
    }
  },
  async mounted() {
    // 检查用户登录状态
    try {
      const logininformation = await checkLoginStatus();
      if (logininformation && logininformation.authenticated) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    } catch (err) {
      console.error("登录状态检查失败：", err);
      this.isLoggedIn = false;
    }
    
    // 获取文章详情
    await this.fetchessayDetail();
    await this.fetchComments();
    
    // 获取作者信息
    await this.fetchAuthorInfo();
    
    // 发送页面浏览统计请求
    const apiUrl = `https://cc.zitzhen.cn/api/pageviews_essay?name=${encodeURIComponent(this.essay.name)}`;
    fetch(apiUrl, { method: 'GET' });
  }
}

</script>

<style scoped>
@import url('@/assets/style/essay/essay.css');
@import url('@/assets/css/popup.css');
@media (prefers-color-scheme: dark) {
  .essay-detail {
        background-color: #2d2d2d;
        color: #fff;
    }
    .essay-stat-label {
        color: #aaa;
    }
    .essay-stat-item {
        border-color: #555;
    }
    .essay-stats-card {
        background-color: #2d2d2d;
        border-color: #555;
    }
    .essay-creator-bio {
        color: #ccc;
    }
    .essay-creator-card {
        background-color: #2d2d2d;
        border-color: #555;
    }
    .essay-author-info-section {
        color: #fff;
    }
    .essay-comment-login-prompt {
        background-color: #3d3d3d;
        color: #ccc;
    }
    .essay-comment-input {
        background-color: #3d3d3d;
        color: #fff;
        border-color: #555;
    }
    .essay-comment-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
    }
    .essay-comments-section {
        background-color: #2d2d2d;
        color: #fff;
    }
    .essay-content {
        color: #e0e0e0;
    }
    .essay-content h1,
    .essay-content h2,
    .essay-content h3,
    .essay-content h4,
    .essay-content h5,
    .essay-content h6 {
        color: #fff;
    }
}
</style>

