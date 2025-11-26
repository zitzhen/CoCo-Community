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

      <!-- 议题列表 -->
      <div class="issues-list">
        <div class="issue-card" v-for="issue in issues" :key="issue.id">
          <div class="issue-header">
            <h3 class="issue-title">{{ issue.title }}</h3>
            <div class="issue-meta">
              <span class="issue-author">由 {{ issue.author }} 提交</span>
              <span class="issue-date">{{ issue.date }}</span>
            </div>
          </div>
          <div class="issue-body" v-html="(issue.body)"></div>
          <div class="issue-footer">
            <span class="issue-comments">
              <i class="fas fa-comment"></i> {{ issue.comments }} 条评论
            </span>
            <span class="issue-status" :class="issue.status">{{ issue.status }}</span>
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
        let response;
        if(loginstatus){
            response = await fetch('/api/github/issues');
        }else{
            response = await fetch('https://api.github.com/repos/zitzhen/CoCo-Community/issues')
        }
        
        if (!response.ok) {
            throw new Error('网络响应失败');
        }
        const data = await response.json();
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
      avatar: "/images/user.png",
      username: "未登录用户",
      showNewIssueForm: false,
      newIssue: {
        title: '',
        body: ''
      },
      issues: [],
      loginstatus: false
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
  margin-bottom: 15px;
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

.issue-author {
  font-weight: 500;
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