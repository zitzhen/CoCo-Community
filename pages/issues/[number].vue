<template>
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

        <!-- 评论输入区 -->
        <div class="comment-composer" v-if="currentUser">
          <div class="composer-header">
            <img :src="currentUser.avatar_url || '/images/user.png'" alt="头像" class="comment-avatar">
            <span class="comment-author">{{ currentUser.login }}</span>
          </div>
          <textarea
            v-model="commentText"
            rows="4"
            maxlength="5000"
            placeholder="留下你的评论（支持 Markdown）……"
            :disabled="submittingComment"
          ></textarea>
          <p class="form-error" v-if="commentError">{{ commentError }}</p>
          <div class="composer-actions">
            <button
              type="button"
              class="comment-submit-btn"
              :disabled="submittingComment || !commentText.trim()"
              @click="submitComment"
            >
              {{ submittingComment ? '提交中…' : '发表评论' }}
            </button>
          </div>
        </div>
        <div class="comment-login-tip" v-else>
          <NuxtLink to="/login">登录 GitHub</NuxtLink> 后即可参与评论
        </div>

        <p class="no-comments" v-if="comments.length === 0">还没有评论，来抢沙发吧。</p>

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

    <div class="issue-error" v-else-if="loadError">
      <h2>无法加载该 Issue</h2>
      <p>它可能已被删除，或者编号是一个 Pull Request。</p>
      <NuxtLink to="/issues" class="back-to-list">← 返回 Issues 列表</NuxtLink>
    </div>

    <div class="loading" v-else>
      <p>正在加载 issue...</p>
    </div>
</template>

<script>
import { marked } from 'marked';
import { sanitizeHtmlOutput } from '@/utils/sanitize';
import { checkLoginStatus } from '@/script/login';

async function fetchIssueDetails(number, loginstatus) {
  try {
    let response;

    if (loginstatus) {
      // 使用本地代理
      response = await fetch(`/api/github/issues/${number}`);
    } else {
      // 使用 GitHub 公共 API
      response = await fetch(`https://api.github.com/repos/zitzhen/CoCo-Community/issues/${number}`);
    }

    if (!response.ok) {
      throw new Error('获取 issue 详情失败');
    }

    const issue = await response.json();

    // 代理对 PR 编号返回 404
    if (issue.pull_request) return null;

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

// 评论列表与发表评论的返回体同为 GitHub 原始评论对象，统一在此映射
function mapComment(comment) {
  return {
    id: comment.id,
    body: comment.body || '',
    author: comment.user ? comment.user.login : 'unknown',
    avatar: comment.user ? comment.user.avatar_url : null,
    user: comment.user,
    created_at: comment.created_at,
    updated_at: comment.updated_at
  };
}

async function fetchIssueComments(number, loginstatus) {
  try {
    let response;

    if (loginstatus) {
      response = await fetch(`/api/github/issues/${number}/comments`);
    } else {
      response = await fetch(`https://api.github.com/repos/zitzhen/CoCo-Community/issues/${number}/comments`);
    }

    if (!response.ok) {
      throw new Error('获取评论失败');
    }

    const comments = await response.json();
    return comments.map(mapComment);
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
      currentUser: null,
      loginstatus: false,
      loadError: false,
      commentText: '',
      submittingComment: false,
      commentError: ''
    };
  },
  async setup() {
    const route = useRoute();
    const issueNumber = route.params.number;

    // SSR：服务端通过 GitHub 公共 API 获取议题详情与评论
    const { data: ssrData } = await useAsyncData(`github-issue-${issueNumber}`, async () => {
      if (!issueNumber) return null;
      const issue = await fetchIssueDetails(issueNumber, false);
      const comments = issue && issue.comments > 0 ? await fetchIssueComments(issueNumber, false) : [];
      return { issue, comments };
    });

    const issue = ref(ssrData.value?.issue ?? null);
    const comments = ref(ssrData.value?.comments ?? []);

    // 浏览器标签页标题：<issue 标题> #<编号> | Issues | CoCo-Community
    useHead({
      titleTemplate: null,
      title: () =>
        issue.value
          ? `${issue.value.title} #${issue.value.number} | Issues | CoCo-Community`
          : 'Issues | CoCo-Community',
    });

    return { issue, comments };
  },
  computed: {
    issueBodyContent() {
      // GitHub issue 正文是任意用户可写内容，必须消毒后才能 v-html
      return this.issue?.body ? sanitizeHtmlOutput(marked.parse(this.issue.body)) : '';
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
    commentBodyContent(comment) {
      // GitHub 评论同样是任意用户可写内容
      return comment.body ? sanitizeHtmlOutput(marked.parse(comment.body)) : '';
    },
    async submitComment() {
      const content = this.commentText.trim();
      if (!content || this.submittingComment) return;

      this.submittingComment = true;
      this.commentError = '';
      try {
        const res = await fetch(`/api/github/issues/${this.issue.number}/comments`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: content })
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 401) {
            this.currentUser = null;
            this.loginstatus = false;
            this.commentError = '登录已失效，请重新登录';
          } else {
            this.commentError = data?.detail || data?.error || '评论发表失败，请稍后再试';
          }
          return;
        }

        // GitHub 返回新建评论原始对象，映射后追加并更新计数
        this.comments.push(mapComment(data));
        if (this.issue) this.issue.comments = (this.issue.comments || 0) + 1;
        this.commentText = '';
      } catch (err) {
        console.error('发表评论失败:', err);
        this.commentError = '网络错误，请稍后再试';
      } finally {
        this.submittingComment = false;
      }
    }
  },
  async mounted() {
    // 无论是否有 SSR 数据都需要确认登录态（决定是否显示评论框）
    const loginInfo = await checkLoginStatus();
    this.currentUser = loginInfo?.authenticated ? loginInfo.user : null;
    this.loginstatus = !!this.currentUser;

    // SSR 已取到议题则直接返回；否则客户端补拉
    if (this.issue) return;

    const issueNumber = this.$route.params.number;
    if (!issueNumber) {
      this.loadError = true;
      return;
    }

    this.issue = await fetchIssueDetails(issueNumber, this.loginstatus);
    if (!this.issue) {
      this.loadError = true;
      return;
    }
    if (this.issue.comments > 0) {
      this.comments = await fetchIssueComments(issueNumber, this.loginstatus);
    }
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
  color: var(--muted);
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
  color: var(--muted);
  font-size: 0.9rem;
}

.issue-body {
  line-height: 1.6;
  color: var(--foreground);
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
  color: var(--primary-foreground);
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
  color: var(--muted);
  font-size: 0.8rem;
}

.comment-body {
  line-height: 1.6;
  color: var(--foreground);
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
  color: var(--muted);
}

/* ---------- 评论输入区 ---------- */
.comment-composer {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  background: var(--background-color);
}

.composer-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.comment-composer textarea {
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-color);
  color: var(--foreground);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.comment-composer textarea:focus {
  outline: 2px solid color-mix(in srgb, var(--primary) 35%, transparent);
  border-color: var(--primary);
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.6rem;
}

.comment-submit-btn {
  background-color: #22c55e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.1rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.comment-submit-btn:hover:not(:disabled) {
  background-color: #16a34a;
}

.comment-submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.comment-login-tip {
  padding: 0.9rem 1rem;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.comment-login-tip a {
  color: var(--primary);
  font-weight: 600;
}

.no-comments {
  color: var(--muted);
  font-size: 0.9rem;
}

.form-error {
  color: #ef4444;
  font-size: 0.85rem;
  margin: 0.5rem 0 0;
}

.issue-error {
  max-width: 1000px;
  margin: 3rem auto;
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: var(--card-color);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.issue-error h2 {
  margin: 0 0 0.75rem;
  color: var(--foreground);
}

.issue-error p {
  color: var(--muted);
  margin: 0 0 1.25rem;
}

.back-to-list {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
</style>