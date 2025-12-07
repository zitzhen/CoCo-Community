<template>
    <!-- Issues 页面主体 -->
    <div class="issues-container">
      <!-- 左侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <h3>筛选选项</h3>
          <div class="filter-group">
            <div class="filter-item">
              <input type="radio" id="all-issues" name="filter" value="all" v-model="filterStatus" @change="filterIssues">
              <label for="all-issues">所有 issues</label>
            </div>
            <div class="filter-item">
              <input type="radio" id="open-issues" name="filter" value="open" v-model="filterStatus" @change="filterIssues">
              <label for="open-issues">开启</label>
            </div>
            <div class="filter-item">
              <input type="radio" id="closed-issues" name="filter" value="closed" v-model="filterStatus" @change="filterIssues">
              <label for="closed-issues">已关闭</label>
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
            <button class="new-issue-btn" @click="isnewissues = true">
              <i class="fas fa-plus"></i> 新建 Issue
            </button>
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
                    <i class="fas fa-comment"></i> {{ issue.comments }}
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

    
    
    <!--不能新建议题弹窗-->
    <div v-show="isnewissues" class="modal-overlay" :class="{ active: isnewissues }" @click="closenewissueModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">抱歉暂时不能新建议题</h2>
          <button class="close-btn" @click="closenewissueModal">×</button>
        </div>
        <div class="modal-body">
          <p>抱歉，我们暂时无法新建议题</p>
          <p>这可能是此功能正在开发</p>
          <p>如果您想立即新建议题，请通过Github创建议题</p>
          <p>打开Github:<a href="https://github.com/zitzhen/CoCo-Community/issues">https://github.com/zitzhen/CoCo-Community/issues</a></p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-cancel" @click="closenewissueModal">好的</button>
        </div>
      </div>
    </div>
</template>

<script>
import { marked } from 'marked';

async function fetch_github_issues(loginstatus) {
    try{
      let open_issues_response;
      let closed_issues_response;

      if (loginstatus) {
          open_issues_response = await fetch('/api/github/issues');
          closed_issues_response = { ok: true, json: async () => [] }; // 本地 API 不区分状态，直接空数组
      } else {
          open_issues_response = await fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=open');
          closed_issues_response = await fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=closed');
      }

      // 检查请求是否成功
      if (!open_issues_response.ok || !closed_issues_response.ok) {
          throw new Error('网络响应失败');
      }

      // 获取数据
      const openData = await open_issues_response.json();
      const closedData = await closed_issues_response.json();

      // 过滤掉 PR
      const pureOpen = openData.filter(item => !item.pull_request);
      const pureClosed = closedData.filter(item => !item.pull_request);

      // 将 GitHub API 数据结构映射为前端使用的格式
      const mapIssueData = (issue) => ({
        id: issue.id,
        number: issue.number,
        title: issue.title,
        author: issue.user ? issue.user.login : 'unknown',
        date: issue.created_at,
        body: issue.body || '',
        comments: issue.comments || 0,
        state: issue.state, // GitHub API 使用 state 字段
        closed_at: issue.closed_at
      });

      // 映射数据结构
      const mappedOpenIssues = pureOpen.map(mapIssueData);
      const mappedClosedIssues = pureClosed.map(mapIssueData);

      // 合并返回
      const data = mappedOpenIssues.concat(mappedClosedIssues);
      return data;

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
      filterStatus: "all",
      showIssueDetail: false,
      selectedIssue: null,
      selectedIssueContent: "",
      uniqueLabels: [],
      isnewissues: false,
      newIssue: {
        title: '',
        body: ''
      },
      loginstatus: false
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
      const labelNames = [...new Set(allLabels.map(label => label.name))];
      this.uniqueLabels = labelNames;
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
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    goToIssueDetail(issueNumber) {
      this.$router.push(`/issues/${issueNumber}`);
    },
    createNewIssue() {
      // 在实际应用中，这里应该跳转到创建新issue的页面
      alert('创建新 Issue 功能正在开发中');
    },
    closenewissueModal() {
      this.isnewissues = false;
    },
    cancelNewIssue() {
      this.newIssue.title = '';
      this.newIssue.body = '';
    },
    async submitIssue() {
      if (!this.newIssue.title.trim() || !this.newIssue.body.trim()) {
        alert('请填写标题和内容');
        return;
      }
      
      // 创建新议题
      const issue = {
        id: this.issues.length + 1,
        number: this.issues.length + 1,
        title: this.newIssue.title,
        author: this.username,
        date: new Date(),
        body: this.newIssue.body,
        comments: 0,
        state: "open"  // 修复：使用state而不是status
      };
      
      this.issues.unshift(issue);
      this.cancelNewIssue();
      // 更新过滤后的 issues
      this.filterIssues();
    },
  },
  async mounted() {
    await this.updateLoginInfo();
    this.issues = await fetch_github_issues(this.loginstatus);
    this.filteredIssues = [...this.issues];
    this.extractUniqueLabels();
    // 确保在页面加载时不会显示新建议题弹窗
    this.isnewissues = false;
  }
}
</script>

<style>
@import url(@/assets/css/popup.css);
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
  color: #586069;
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
  color: white;
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
  background-color: #eaecef;
  color: #586069;
  border-radius: 20px;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
}

.issues-actions {
  display: flex;
  gap: 1rem;
}

.new-issue-btn {
  background-color: #2ea44f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.new-issue-btn:hover {
  background-color: #2c834d;
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
  transition: background-color 0.2s;
}

.issue-item:hover {
  background-color: #f6f8fa;
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
  color: #586069;
}

.issue-number {
  color: #586069;
}

.issue-author {
  color: #586069;
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
  color: #586069;
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
  line-height: 1.6;
  color: #333;
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