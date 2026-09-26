<template>
    <header class="list-page-header">
      <h1 class="list-page-title">社区开发者</h1>
      <p class="list-page-subtitle">认识在 CoCo-Community 分享资源与工具的开发者</p>
    </header>

    <div v-if="userlist.length === 0" class="empty-tip">
      暂无用户数据，请稍后再试。
    </div>

    <div class="user-list">
      <div v-for="user in userlist" :key="user.username" class="user-card">
        <div class="user-header">
          <div class="user-avatar-container">
            <img :src="user.avatar" :alt="user.nickname + '的头像'" class="avatar-img">
          </div>
          <div class="user-meta">
            <div class="user-name">{{ user.nickname }}</div>
            <div class="user-role">{{ user.bio }}</div>
          </div>
        </div>

        <div class="user-stats">
          <div><i aria-hidden="true" class="fas fa-code"></i> 控件数量：{{ user.number_of_controls ?? '未统计' }}个</div>
          <div><i aria-hidden="true" class="fas fa-heart"></i> 点赞：{{ user.likes }}</div>
        </div>

        <div class="button-group">
          <a :href="user.home" class="icon-btn" title="查看主页">
            <i aria-hidden="true" class="fas fa-user"></i> 主页
          </a>
          <a :href="user.github" class="text-btn">
            <i aria-hidden="true" class="fab fa-github"></i> Github
          </a>
        </div>
      </div>
    </div>
</template>

<script setup>
// SSR：静态 JSON 在构建期打包进 bundle（服务端内部 fetch 静态文件会落到渲染层返回 HTML）
import userlistJson from '../../public/userlist.json'

const userlist = computed(() =>
  (userlistJson.list || []).map(user => ({
    ...user,
    nickname: user.nickname || user.username,
    avatar: user.avatar || `https://avatars.githubusercontent.com/u/${user.github_id || '149680880'}?v=4`,
    bio: user.bio || '此人很懒，什么都没有',
    likes: user.likes || '未统计',
    github: user.github || `https://github.com/${user.username}`,
    home: user.home || `/user/${user.username}`
  }))
);

useHead({
  title: '用户列表|CoCo-Community',
  meta: [
    {content: "这是注册了CoCo-Community的全部用户均在此处。" }
  ]
})
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
}

#app {
  background-color: var(--background-color);
  min-height: 100vh;
}

.avatar-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.nav-avatar {
  width: 40px;
  height: 40px;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
}

.user-card {
  background-color: var(--card-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  max-width: 420px;
  width: 100%;
}

.user-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar-container {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 0.3rem;
}

.user-role {
  font-size: 0.9rem;
  color: var(--muted);
  font-style: italic;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0.5rem 0 1rem;
}

.user-stats div {
  display: flex;
  align-items: center;
}

.user-stats i {
  margin-right: 0.4rem;
  color: var(--primary-color);
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.icon-btn, .text-btn {
  background-color: var(--primary-color);
  color: var(--primary-foreground);
  padding: 0.6rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.icon-btn:hover, .text-btn:hover {
  background-color: var(--secondary-color);
}

.empty-tip {
  text-align: center;
  color: var(--muted);
  font-size: 1rem;
  margin-top: 2rem;
}

.user-name-Nav {
    font-weight: 500;
    color: var(--foreground);
    font-size: 1rem;
}
.list-page-header {
  margin-bottom: var(--space-6);
}
.list-page-title {
  font-size: var(--font-size-h1);
  font-weight: 800;
  color: var(--foreground);
  margin: 0 0 var(--space-2);
  letter-spacing: -0.02em;
}
.list-page-subtitle {
  color: var(--muted);
  font-size: var(--font-size-body);
  margin: 0;
}
</style>
