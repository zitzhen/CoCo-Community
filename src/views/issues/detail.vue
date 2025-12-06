<template>
    <div style="height: 90px;"></div>

    <!-- Issue 详情页面主体 -->
    <div class="issue-detail-container" v-if="issue">
      <div class="issue-detail-header">
        <div class="issue-state" :class="issue.state">
          <span v-if="issue.state === 'open'" class="state-icon">●</span>
          <span v-else class="state-icon-closed">●</span>
        </div>
        <div class="issue-detail-info">
          <h1>{{ issue.title }}</h1>
          <div class="issue-meta">
            <span class="issue-number">#{{ issue.number }}</span>
            <span>由 {{ issue.user?.login || issue.author || '未知用户' }} 创建于 {{ formatDate(issue.created_at || issue.date) }}</span>
          </div>
        </div>
      </div>
      
      <div class="issue-detail-content">
        <div class="issue-author-info">
          <img :src="issue.user?.avatar_url || issue.avatar || '/images/user.png'" alt="头像" class="issue-author-avatar-large">
          <div class="issue-author-details">
            <div class="issue-author">{{ issue.user?.login || issue.author || '未知用户' }}</div>
            <div class="issue-created-date">{{ formatDate(issue.created_at || issue.date) }}</div>
          </div>
        </div>
        
        <div class="issue-body" v-html="issueBodyContent"></div>
        
        <div class="issue-labels" v-if="issue.labels && issue.labels.length > 0">
          <span 
            class="label-badge" 
            v-for="label in issue.labels" 
            :key="label.id"
            :style="{ backgroundColor: `#${label.color}` }"
          >
            {{ label.name }}
          </span>
        </div>
      </div>
      
      <!-- 评论区域 -->
      <div class="comments-section">
        <h3>评论 ({{ issue.comments || 0 }})</h3>
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <div class="comment-header">
            <img :src="comment.user?.avatar_url || comment.avatar || '/images/user.png'" alt="头像" class="comment-avatar">
            <div class="comment-author-info">
              <div class="comment-author">{{ comment.user?.login || comment.author || '未知用户' }}</div>
              <div class="comment-date">{{ formatDate(comment.created_at || comment.date) }}</div>
            </div>
          </div>
          <div class="comment-body" v-html="commentBodyContent(comment)"></div>
        </div>
      </div>
    </div>
    
    <div class="loading" v-else>
      <p>正在加载 issue...</p>
    </div>
</template>

<script>
import { checkLoginStatus } from '@/script/login';
import { marked } from 'marked';

async function fetchIssueDetails(number, loginstatus) {
  try {
    let response;
    
    if (loginstatus) {
      // 使用本地 API
      response = await fetch(`/api/github/issues/${number}`);
    } else {
      // 使用 GitHub API
      response = await fetch(`https://api.github.com/repos/zitzhen/CoCo-Community/issues/${number}`);
    }
    
    if (!response.ok) {
      throw new Error('获取 issue 详情失败');
    }
    
    const issue = await response.json();
    
    // 将 GitHub API 数据结构映射为前端使用的格式
    return {
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      author: issue.user ? issue.user.login : 'unknown',
      avatar: issue.user ? issue.user.avatar_url : null,
      user: issue.user,
      state: issue.state,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      closed_at: issue.closed_at,
      labels: issue.labels || [],
      comments: issue.comments || 0
    };
  } catch (error) {
    console.error('获取 issue 详情失败:', error);
    return null;
  }
}

async function fetchIssueComments(number, loginstatus) {
  try {
    let response;
    
    if (loginstatus) {
      // 使用本地 API
      response = await fetch(`/api/github/issues/${number}/comments`);
    } else {
      // 使用 GitHub API
      response = await fetch(`https://api.github.com/repos/zitzhen/CoCo-Community/issues/${number}/comments`);
    }
    
    if (!response.ok) {
      throw new Error('获取评论失败');
    }
    
    const comments = await response.json();
    
    // 将 GitHub API 数据结构映射为前端使用的格式
    return comments.map(comment => ({
      id: comment.id,
      body: comment.body || '',
      author: comment.user ? comment.user.login : 'unknown',
      avatar: comment.user ? comment.user.avatar_url : null,
      user: comment.user,
      created_at: comment.created_at,
      updated_at: comment.updated_at
    }));
  } catch (error) {
    console.error('获取评论失败:', error);
    return [];
  }
}

export default {
  name: 'IssueDetail',
  data() {
    return {
      issue: null,
      comments: [],
      loginstatus: false
    };
  },
  computed: {
    issueBodyContent() {
      return this.issue?.body ? marked.parse(this.issue.body) : '';
    }
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
    goMe() {
      this.$router.push('/me');
    },
    
    commentBodyContent(comment) {
      return comment.body ? marked.parse(comment.body) : '';
    }
  },
  async mounted() {
    await this.updateLoginInfo();
    
    const issueNumber = this.$route.params.number;
    if (issueNumber) {
      this.issue = await fetchIssueDetails(issueNumber, this.loginstatus);
      if (this.issue && this.issue.comments > 0) {
        this.comments = await fetchIssueComments(issueNumber, this.loginstatus);
      }
    }
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
  --border-color: #e1e4e8;
  --open-color: #28a745;
  --closed-color: #cb2431;
}

#app {
  background-color: var(--background-color);
  min-height: 100vh;
}

.issue-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--card-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  margin-top: 1rem;
}

.issue-detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.issue-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.issue-state.open .state-icon {
  color: var(--open-color);
  font-size: 1.2rem;
}

.issue-state.closed .state-icon-closed {
  color: var(--closed-color);
  font-size: 1.2rem;
}

.issue-detail-info {
  flex: 1;
}

.issue-detail-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: var(--text-color);
}

.issue-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #586069;
}

.issue-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.issue-state-text {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.issue-state-text.open {
  background-color: #e6ffec;
  color: var(--open-color);
}

.issue-state-text.closed {
  background-color: #ffeef0;
  color: var(--closed-color);
}

.status-btn {
  background-color: #f6f8fa;
  border: 1px solid #d1d5da;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.status-btn:hover {
  background-color: #eaecef;
}

.issue-detail-content {
  padding: 1.5rem;
}

.issue-author-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.issue-author-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.issue-author-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.issue-author {
  font-weight: 600;
  color: var(--text-color);
}

.issue-created-date {
  color: #586069;
  font-size: 0.9rem;
}

.issue-body {
  line-height: 1.6;
  color: #333;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.issue-body h1,
.issue-body h2,
.issue-body h3,
.issue-body h4,
.issue-body h5,
.issue-body h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.issue-body h1 {
  font-size: 1.6rem;
}

.issue-body h2 {
  font-size: 1.4rem;
}

.issue-body h3 {
  font-size: 1.3rem;
}

.issue-body p {
  margin-bottom: 1rem;
}

.issue-body a {
  color: var(--primary-color);
}

.issue-body ul,
.issue-body ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.issue-body li {
  margin-bottom: 0.5rem;
}

.issue-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

.issue-labels {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.label-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: white;
  display: inline-block;
}

.comments-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.comments-section h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.comment {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.comment-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-author-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: var(--text-color);
}

.comment-date {
  color: #586069;
  font-size: 0.8rem;
}

.comment-body {
  line-height: 1.6;
  color: #333;
  font-size: 0.95rem;
}

.comment-body h1,
.comment-body h2,
.comment-body h3,
.comment-body h4,
.comment-body h5,
.comment-body h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.comment-body h1 {
  font-size: 1.4rem;
}

.comment-body h2 {
  font-size: 1.3rem;
}

.comment-body h3 {
  font-size: 1.2rem;
}

.comment-body p {
  margin-bottom: 1rem;
}

.comment-body a {
  color: var(--primary-color);
}

.comment-body ul,
.comment-body ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.comment-body li {
  margin-bottom: 0.5rem;
}

.comment-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #586069;
}
</style>