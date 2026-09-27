<template>
    <!-- Issues 页面主体 -->
    <div class="issues-container">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>筛选选项</h3>
          <div class="filter-group">
            <div class="filter-item">
              <input type="radio" id="open-issues" name="filter" value="open" v-model="filterStatus" @change="filterIssues">
              <label for="open-issues">已打开</label>
            </div>
            <div class="filter-item">
              <input type="radio" id="closed-issues" name="filter" value="closed" v-model="filterStatus" @change="filterIssues">
              <label for="closed-issues">已关闭</label>
            </div>
            <div class="filter-item">
              <input type="radio" id="all-issues" name="filter" value="all" v-model="filterStatus" @change="filterIssues">
              <label for="all-issues">所有 issues</label>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>标签</h3>
          <div class="label-list">
            <span 
              class="label-badge"
              v-for="label in uniqueLabels"
              :key="label"
              :style="{ backgroundColor: getLabelColor(label) }"
            >
              {{ label }}
            </span>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <div class="issues-header">
          <div class="issues-title-section">
            <h1>Issues</h1>
            <span class="issues-count">{{ filteredIssues.length }}</span>
          </div>
          <div class="issues-actions">
            <NuxtLink to="/issues/new" class="new-issue-btn">
              <i aria-hidden="true" class="fas fa-plus"></i> 新建 Issue
            </NuxtLink>
          </div>
        </div>

        <div class="issues-list">
          <div 
            class="issue-item" 
            v-for="issue in filteredIssues" 
            :key="issue.id"
            @click="goToIssueDetail(issue.number)"
          >
            <div class="issue-left">
              <div class="issue-state" :class="issue.state">
                <span v-if="issue.state === 'open'" class="state-icon">●</span>
                <span v-else class="state-icon-closed">●</span>
              </div>
              <div class="issue-info">
                <h3 class="issue-title">{{ issue.title }}</h3>
                <div class="issue-meta">
                  <span class="issue-number">#{{ issue.number }}</span>
                  <span class="issue-author">由 {{ issue.user?.login || issue.author || '未知用户' }} 创建于 {{ formatDate(issue.created_at || issue.date) }}</span>
                  <span class="issue-comments" v-if="issue.comments > 0">
                    <i aria-hidden="true" class="fas fa-comment"></i> {{ issue.comments }}
                  </span>
                </div>
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
            </div>
            <div class="issue-right">
              <img :src="issue.user?.avatar_url || issue.avatar || '/images/user.png'" alt="头像" class="issue-author-avatar">
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { checkLoginStatus } from '@/script/login';

async function fetch_github_issues(loginstatus) {
    try{
      let rawIssues;

      if (loginstatus) {
          // 登录后走同源代理：服务端已聚合 open+closed 全量并过滤 PR
          const response = await fetch('/api/github/issues');
          if (!response.ok) throw new Error('代理接口请求失败');
          rawIssues = await response.json();
      } else {
          // 未登录走 GitHub 公共 API（SSR 首屏同样走这里）
          const [openRes, closedRes] = await Promise.all([
            fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=open'),
            fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=closed')
          ]);
          if (!openRes.ok || !closedRes.ok) throw new Error('网络响应失败');
          rawIssues = [].concat(await openRes.json(), await closedRes.json());
      }

      // 过滤掉 PR
      const pureIssues = rawIssues.filter(item => !item.pull_request);

      // 映射为前端使用的格式（保留 labels / user 原始对象用于徽章与头像）
      return pureIssues.map(issue => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        author: issue.user ? issue.user.login : 'unknown',
        date: issue.created_at,
        body: issue.body || '',
        comments: issue.comments || 0,
        state: issue.state,
        closed_at: issue.closed_at,
        labels: issue.labels || [],
        user: issue.user || null
      }));
    } catch (error) {
        console.error('获取 GitHub 议题失败:', error);
        return [];
    }
}


export default {
  name: 'Issues',
  data() {
    return {
      issues: [],
      filteredIssues: [],
      filterStatus: "open",
      uniqueLabels: [],
      loginstatus: false
    };
  },
  async setup() {
    // SSR：服务端通过 GitHub 公共 API 获取议题，首屏 HTML 直接渲染
    const { data: ssrIssues } = await useAsyncData('github-issues', () => fetch_github_issues(false));
    const issues = ref(ssrIssues.value || []);
    // 默认档位为“已打开”，首屏 SSR 数据同样按此过滤
    const filteredIssues = ref(issues.value.filter(issue => issue.state !== 'closed'));
    const allLabels = issues.value.flatMap(issue => issue.labels || []);
    const uniqueLabels = ref([...new Set(allLabels.map(label => label.name))]);
    return { issues, filteredIssues, uniqueLabels };
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
    filterIssues() {
      switch (this.filterStatus) {
        case 'open':
          this.filteredIssues = this.issues.filter(issue => issue.state !== 'closed');
          break;
        case 'closed':
          this.filteredIssues = this.issues.filter(issue => issue.state === 'closed');
          break;
        default:
          this.filteredIssues = [...this.issues];
      }
    },
    extractUniqueLabels() {
      const allLabels = this.issues.flatMap(issue => issue.labels || []);
      this.uniqueLabels = [...new Set(allLabels.map(label => label.name))];
    },
    getLabelColor(labelName) {
      // 根据标签名称生成颜色 - 简单的哈希函数
      const colors = [
        "#e11d21", "#d93f0b", "#d1bcf9", "#5319e7",
        "#84b6eb", "#0052cc", "#2e7b32", "#a2eeef",
        "#c6c6c6", "#fbca04"
      ];

      let hash = 0;
      for (let i = 0; i < labelName.length; i++) {
        hash = labelName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    },
    goToIssueDetail(issueNumber) {
      this.$router.push(`/issues/${issueNumber}`);
    }
  },
  async mounted() {
    // 先确认登录态（旧实现从未更新该值，导致代理接口永远不会被调用）
    const loginInfo = await checkLoginStatus();
    this.loginstatus = !!(loginInfo?.authenticated);

    if (this.loginstatus) {
      // 登录后用代理重新拉取（额度更高）；SSR 公共 API 数据可被替换
      this.issues = await fetch_github_issues(true);
    } else if (this.issues.length === 0) {
      this.issues = await fetch_github_issues(false);
    }
    this.extractUniqueLabels();
    // 按默认档位（已打开）应用筛选，而不是重置为全部
    this.filterIssues();
  }
}
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
  --border-color: var(--border);
  --open-color: #22c55e;
  --closed-color: #ef4444;
}

#app {
  background-color: var(--background-color);
  min-height: 100vh;
}

.issues-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  gap: 2rem;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-section {
  background: var(--card-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow);
}

.sidebar-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-item input {
  margin-right: 0.5rem;
}

.filter-item label {
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--muted);
}

.label-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--primary-foreground);
  display: inline-block;
}

.main-content {
  flex: 1;
}

.issues-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
}

.issues-title-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.issues-title-section h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--text-color);
}

.issues-count {
  background-color: var(--muted-background);
  color: var(--muted);
  border-radius: 20px;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
}

.issues-actions {
  display: flex;
  gap: 1rem;
}

.new-issue-btn {
  background-color: #22c55e;
  color: var(--primary-foreground);
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.new-issue-btn:hover {
  background-color: #16a34a;
}

.issues-list {
  background: var(--card-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.issue-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.issue-item:last-child {
  border-bottom: none;
}

.issue-left {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 1rem;
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

.issue-info {
  flex: 1;
}

.issue-title {
  margin: 0 0 0.2rem 0;
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 600;
}

.issue-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--muted);
}

.issue-number {
  color: var(--muted);
}

.issue-author {
  color: var(--muted);
}

.issue-comments {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.issue-comments i {
  font-size: 0.9rem;
}

.issue-labels {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.issue-author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}


.issue-detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.issue-author-info {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.issue-author-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.issue-author {
  color: var(--muted);
  font-size: 0.9rem;
}

.issue-status-actions {
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
  background-color: color-mix(in srgb, #22c55e, 12%, var(--card));
  color: var(--open-color);
}

.issue-state-text.closed {
  background-color: color-mix(in srgb, #ef4444, 12%, var(--card));
  color: var(--closed-color);
}

.status-btn {
  background-color: var(--muted-background);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.status-btn:hover {
  background-color: var(--muted-background);
}

.issue-detail-content {
  line-height: 1.6;
  color: var(--foreground);
  font-size: 1rem;
}

.issue-detail-content h1,
.issue-detail-content h2,
.issue-detail-content h3,
.issue-detail-content h4,
.issue-detail-content h5,
.issue-detail-content h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.issue-detail-content h1 {
  font-size: 1.6rem;
}

.issue-detail-content h2 {
  font-size: 1.4rem;
}

.issue-detail-content h3 {
  font-size: 1.3rem;
}

.issue-detail-content p {
  margin-bottom: 1rem;
}

.issue-detail-content a {
  color: var(--primary-color);
}

.issue-detail-content ul,
.issue-detail-content ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.issue-detail-content li {
  margin-bottom: 0.5rem;
}

.issue-detail-content img {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

@media (max-width: 1024px) {
  .issues-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .sidebar-section {
    flex: 1;
    min-width: 200px;
  }
  
  .issue-author-info {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 768px) {
  .issues-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .issue-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .issue-right {
    align-self: flex-end;
  }
  
  .issue-meta {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  
  .close-btn {
    align-self: flex-end;
  }
  
  .issue-detail-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .issue-status-actions {
    align-self: flex-end;
  }
}
</style>