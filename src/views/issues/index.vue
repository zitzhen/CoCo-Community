<template>
  <div id="issues-page">
    <nav class="navbar">
      <div class="nav-container">
        <a href="/" class="logo">ZIT<span>-CoCo-Community</span></a>
        <div class="user-info" @click="gome">
          <img :src="avatar" alt="用户头像" class="user-avatar">
          <div class="user-name">{{ username }}</div>
        </div>
      </div>
    </nav>
    <div style="height: 65px;"></div>

    <div class="issues-container">
      <div class="issues-header">
        <h1>问题反馈</h1>
        <button class="new-issue-btn" @click="showNewIssueForm = true">
          <i class="fas fa-plus"></i> 新建议题
        </button>
      </div>

      <!-- 新建议题表单 -->
      <div class="new-issue-form" v-if="showNewIssueForm">
        <h3>新建议题</h3>
        <div class="form-group">
          <label for="issue-title">标题</label>
          <input type="text" id="issue-title" v-model="newIssue.title" placeholder="输入议题标题">
        </div>
        <div class="form-group">
          <label for="issue-body">内容</label>
          <textarea id="issue-body" v-model="newIssue.body" placeholder="请详细描述您遇到的问题或建议..." rows="8"></textarea>
        </div>
        <div class="form-actions">
          <button class="cancel-btn" @click="cancelNewIssue">取消</button>
          <button class="submit-btn" @click="submitIssue">提交议题</button>
        </div>
      </div>

      <!-- 过滤器和分页控制 -->
      <div class="issues-controls">
        <div class="filters">
          <button 
            :class="['filter-btn', { active: selectedFilter === 'all' }]" 
            @click="selectedFilter = 'all'"
          >
            全部
          </button>
          <button 
            :class="['filter-btn', { active: selectedFilter === 'open' }]" 
            @click="selectedFilter = 'open'"
          >
            打开 {{ openIssuesCount }}
          </button>
          <button 
            :class="['filter-btn', { active: selectedFilter === 'closed' }]" 
            @click="selectedFilter = 'closed'"
          >
            已关闭 {{ closedIssuesCount }}
          </button>
        </div>
        
        <!-- 分页控制 -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)"
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button 
            :disabled="currentPage === totalPages" 
            @click="changePage(currentPage + 1)"
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- 议题列表 -->
      <div class="issues-list">
        <div class="issue-card" v-for="issue in paginatedIssues" :key="issue.id">
          <div class="issue-header">
            <div class="issue-main-info">
              <h3 class="issue-title">{{ issue.title }}</h3>
              <div class="issue-meta">
                <span class="issue-number">#{{ issue.number }}</span>
                <span class="issue-author">由 {{ issue.author }} 提交</span>
                <span class="issue-date">{{ formatDate(issue.date) }}</span>
              </div>
            </div>
            <div class="issue-actions">
            </div>
          </div>
          <div class="issue-footer">
            <span class="issue-comments">
              <i class="fas fa-comment"></i> {{ issue.comments }} 条评论
            </span>
            <!-- <span class="issue-status" :class="issue.status">{{ issue.status === 'open' ? '打开' : '已关闭' }}</span> -->
          </div>
        </div>
      </div>

      <!-- 分页控制（底部） -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          class="pagination-btn"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          class="pagination-btn"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { checkLoginStatus } from '@/script/login';

async function fetch_github_issues(loginstatus) {
    try{
        let response;
        if(loginstatus){
            response = await fetch('/api/github/issues');
        }else{
            response = await fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues?state=all')
        }
        
        if (!response.ok) {
            throw new Error('网络响应失败');
        }
        const data = await response.json();
        // 过滤掉PR类型的issues，只保留真正的issues
        const filteredData = data.filter(issue => !issue.pull_request);
        return filteredData;
    } catch (error) {
        console.error('获取 GitHub 议题失败:', error);
        return [];
    }
}


export default {
  name: 'Issues',
  data() {
    return {
      avatar: "/images/user.png",
      username: "未登录用户",
      showNewIssueForm: false,
      newIssue: {
        title: '',
        body: ''
      },
      issues: [],
      loginstatus: false,
      selectedFilter: 'open',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    filteredIssues() {
      if (this.selectedFilter === 'all') {
        return this.issues;
      } else if (this.selectedFilter === 'open') {
        return this.issues.filter(issue => issue.status !== 'closed');
      } else {
        return this.issues.filter(issue => issue.status === 'closed');
      }
    },
    paginatedIssues() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredIssues.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredIssues.length / this.itemsPerPage);
    },
    openIssuesCount() {
      return this.issues.filter(issue => issue.status !== 'closed').length;
    },
    closedIssuesCount() {
      return this.issues.filter(issue => issue.status === 'closed').length;
    }
  },
  methods: {
    gome() {
      this.$router.push('/me');
    },
    cancelNewIssue() {
      this.showNewIssueForm = false;
      this.newIssue.title = '';
      this.newIssue.body = '';
    },
    submitIssue() {
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
        status: "open"
      };
      
      this.issues.unshift(issue);
      this.cancelNewIssue();
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    closeIssue(issue) {
      issue.status = 'closed';
      // 更新issue的closed_at时间
      issue.closed_at = new Date();
    },
    openIssue(issue) {
      issue.status = 'open';
      // 移除closed_at时间
      delete issue.closed_at;
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('zh-CN');
    }
  },
  async mounted() {
    await checkLoginStatus().then((logininformation) => {
      if (!logininformation || !logininformation.authenticated) {
        this.username = '未登录用户';
        this.avatar = '/images/user.png';
        this.loginstatus = false;
      } else {
        this.username = logininformation.user.name || logininformation.user.login;
        this.avatar = logininformation.user.avatar_url || '/images/user.png';
        this.loginstatus = true;
      }
    }).catch((err) => {
      console.error("登录检查失败：", err);
      this.username = '登录信息检查失败';
      this.loginstatus = false;
    });
    
    console.log(this.loginstatus);
    this.issues = await fetch_github_issues(this.loginstatus);
    console.log(this.issues);
  }
}
</script>

<style scoped>
@import url(@/assets/css/Navigation-bar.css);
.issues-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.issues-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.issues-header h1 {
  font-size: 2rem;
  color: #333;
  margin: 0;
}

.new-issue-btn {
  background-color: #238636;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.new-issue-btn:hover {
  background-color: #2ea043;
}

.new-issue-form {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 30px;
}

.new-issue-form h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn {
  background-color: #e7e7e7;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #dcdcdc;
}

.submit-btn {
  background-color: #238636;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #2ea043;
}

.issues-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.filters {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: #f6f8fa;
  color: #24292f;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.filter-btn:hover {
  background-color: #eaecef;
}

.filter-btn.active {
  background-color: #0969da;
  color: white;
  border-color: #0969da;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: #f6f8fa;
  color: #24292f;
  border-radius: 6px;
  cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #eaecef;
}

.pagination-btn:disabled {
  color: #888;
  cursor: not-allowed;
  opacity: 0.5;
}

.page-info {
  font-size: 14px;
  color: #57606a;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.issue-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.issue-main-info {
  flex: 1;
}

.issue-title {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: #0969da;
}

.issue-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #57606a;
}

.issue-number {
  font-weight: 600;
}

.issue-author {
  font-weight: 500;
}

.issue-actions {
  display: flex;
  gap: 5px;
}

.issue-action-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
}

.close-btn {
  background-color: #da3633;
  color: white;
  border-color: #b62324;
}

.close-btn:hover {
  background-color: #b62324;
}

.open-btn {
  background-color: #238636;
  color: white;
  border-color: #196c2e;
}

.open-btn:hover {
  background-color: #196c2e;
}

.issue-body {
  margin-bottom: 15px;
  line-height: 1.5;
  color: #24292f;
}

.issue-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  padding-top: 15px;
  color: #57606a;
  font-size: 13px;
}

.issue-comments {
  display: flex;
  align-items: center;
  gap: 5px;
}

.issue-status {
  padding: 4px 10px;
  border-radius: 2em;
  font-size: 12px;
  font-weight: 500;
}

.issue-status.open {
  background-color: #e5f2ff;
  color: #0969da;
}

.issue-status.closed {
  background-color: #dcffe4;
  color: #2da44e;
}
</style>