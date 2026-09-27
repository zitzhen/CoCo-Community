<template>
  <div class="new-issue-container">
    <NuxtLink to="/issues" class="back-link">← 返回 Issues 列表</NuxtLink>

    <div class="new-issue-card">
      <header class="new-issue-header">
        <h1>新建 Issue</h1>
        <p>提交到 GitHub 仓库 <code>zitzhen/CoCo-Community</code>，所有访客均可见</p>
      </header>

      <!-- 未登录 -->
      <div v-if="checkedLogin && !currentUser" class="login-required">
        <i aria-hidden="true" class="fab fa-github"></i>
        <p>需要先使用 GitHub 账号登录。</p>
        <p class="alt-tip">也可以直接在 GitHub 上创建：
          <a href="https://github.com/zitzhen/CoCo-Community/issues" target="_blank" rel="noopener noreferrer">
            github.com/zitzhen/CoCo-Community/issues
          </a>
        </p>
        <NuxtLink to="/login" class="btn-primary">去登录</NuxtLink>
      </div>

      <!-- 登录态检查中 -->
      <div v-else-if="!checkedLogin" class="loading">
        <p>正在确认登录状态…</p>
      </div>

      <!-- 已登录：创建表单 -->
      <form v-else class="new-issue-form" @submit.prevent="submitIssue">
        <div class="form-group">
          <label for="issue-title">标题</label>
          <input
            id="issue-title"
            v-model="form.title"
            type="text"
            maxlength="256"
            placeholder="简要描述问题或建议"
            :disabled="creating"
            autofocus
          >
        </div>
        <div class="form-group">
          <label for="issue-body">正文（支持 Markdown，可选）</label>
          <textarea
            id="issue-body"
            v-model="form.body"
            rows="14"
            maxlength="10000"
            placeholder="复现步骤、期望行为、实际行为、环境信息……"
            :disabled="creating"
          ></textarea>
        </div>

        <p class="form-error" v-if="errorMsg">{{ errorMsg }}</p>

        <div class="form-actions">
          <NuxtLink to="/issues" class="btn-cancel">取消</NuxtLink>
          <button type="submit" class="btn-primary" :disabled="creating || !form.title.trim()">
            {{ creating ? '提交中…' : '提交 Issue' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'NewIssue',
  data() {
    return {
      checkedLogin: false,
      currentUser: null,
      form: {
        title: '',
        body: ''
      },
      creating: false,
      errorMsg: ''
    };
  },
  setup() {
    // 浏览器标签页标题
    useHead({ title: '新建 Issue | Issues | CoCo-Community' });
    return {};
  },
  methods: {
    async submitIssue() {
      const title = this.form.title.trim();
      if (!title || this.creating) return;

      this.creating = true;
      this.errorMsg = '';
      try {
        const res = await fetch('/api/github/issues', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            body: this.form.body.trim()
          })
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 401) {
            this.currentUser = null;
            this.errorMsg = '登录已失效，请重新登录';
          } else if (res.status === 403) {
            this.errorMsg = '请求来源不被允许';
          } else if (data?.error === 'GitHub API create issue failed') {
            this.errorMsg = 'GitHub 拒绝了创建请求（可能是令牌权限不足或触发了频率限制），请重新登录后再试';
          } else {
            this.errorMsg = data?.detail || data?.error || '提交失败，请稍后再试';
          }
          return;
        }

        // 创建成功：跳转到新议题详情页
        this.$router.push(`/issues/${data.number}`);
      } catch (err) {
        console.error('创建 Issue 失败:', err);
        this.errorMsg = '网络错误，请稍后再试';
      } finally {
        this.creating = false;
      }
    }
  },
  async mounted() {
    const loginInfo = await checkLoginStatus();
    this.currentUser = loginInfo?.authenticated ? loginInfo.user : null;
    this.checkedLogin = true;
  }
};
</script>

<style>
@import url(@/assets/css/dark.css);

.new-issue-container {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--primary);
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.new-issue-card {
  background: var(--card);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 1.75rem;
}

.new-issue-header h1 {
  margin: 0 0 0.4rem;
  font-size: 1.5rem;
  color: var(--foreground);
}

.new-issue-header p {
  margin: 0 0 1.5rem;
  color: var(--muted);
  font-size: 0.88rem;
}

.new-issue-header code {
  background: var(--muted-background, rgba(128, 128, 128, 0.12));
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  font-size: 0.85em;
}

.form-group {
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--foreground);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--background);
  color: var(--foreground);
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.form-group textarea {
  line-height: 1.6;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: 2px solid color-mix(in srgb, var(--primary) 35%, transparent);
  border-color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.btn-primary,
.btn-cancel {
  border-radius: 6px;
  padding: 0.55rem 1.25rem;
  font-size: 0.92rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: #22c55e;
  color: #fff;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: var(--muted);
  border-color: var(--border);
}

.btn-cancel:hover {
  background: var(--muted-background, rgba(128, 128, 128, 0.08));
}

.form-error {
  color: #ef4444;
  font-size: 0.88rem;
  margin: 0.25rem 0 0;
}

/* 未登录提示 */
.login-required {
  text-align: center;
  padding: 2rem 1rem 1rem;
  color: var(--foreground);
}

.login-required .fab {
  font-size: 2.2rem;
  color: var(--muted);
}

.login-required p {
  margin: 0.75rem 0 0.25rem;
}

.login-required .alt-tip {
  color: var(--muted);
  font-size: 0.88rem;
}

.login-required .alt-tip a {
  color: var(--primary);
}

.login-required .btn-primary {
  margin-top: 1.25rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: var(--muted);
}

@media (max-width: 640px) {
  .new-issue-card {
    padding: 1.2rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-cancel {
    justify-content: center;
  }
}
</style>
