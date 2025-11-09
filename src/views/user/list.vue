<template>
<div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
</div>

<div style="height: 90px;"></div>

<div v-for="user in userlist" :key="user.username">
  <div class="user-card">
    <div class="user-header">
      <div class="user-avatar">
        <img :src="user.avatar || 'https://avatars.githubusercontent.com/u/149680880?v=4'" width="50px" height="50px" :alt="user.nickname + '的头像'">
      </div>
      <div class="user-meta">
        <div class="user-name">{{ user.nickname || user.username }}</div>
        <div class="user-role">{{ user.bio || '此人很懒，什么都没有' }}</div>
      </div>
    </div>

    <div class="user-stats">
      <div><i class="fas fa-code"></i> 控件数量：{{ user.number_of_controls }}个</div>
      <div><i class="fas fa-heart"></i> 点赞：{{ user.likes || '未统计' }}</div>
    </div>

    <div class="button-group">
      <a :href="'/user/' + user.username" class="icon-btn" title="查看主页">
        <i class="fas fa-user"></i> 主页
      </a>
      <a :href="'https://github.com/' + user.username" class="text-btn">
        <i class="fab fa-github"></i> Github
      </a>
    </div>
  </div>
</div>
</template>



<script>
import { checkLoginStatus } from '@/script/login';
import axios from 'axios';

export default {
  data() {
    return {
      username: "未登录用户",
      avatar: "/images/user.png",
      userlist: []
    };
  },
  methods: {
    async updateLoginInfo() {
      try {
        const logininformation = await checkLoginStatus();
        if (!logininformation || !logininformation.authenticated) {
          this.username = '未登录用户';
          this.avatar = '/images/user.png';
        } else {
          this.username = logininformation.user.name || logininformation.user.login;
          this.avatar = logininformation.user.avatar_url || '/images/user.png';
        }
      } catch (err) {
        console.error("登录检查失败：", err);
        this.username = '登录信息检查失败';
      }
    },
    gome() {
      this.$router.push('/me') // 跳转到我的页面
    },
    async fetchuserlist() {
        try {
            const response = await axios.get('/userlist.json');
            // 处理用户数据，添加默认值
            this.userlist = (response.data.list || []).map(user => ({
                ...user,
                avatar: user.avatar || `https://avatars.githubusercontent.com/u/${user.github_id || '149680880'}?v=4`,
                bio: user.bio || '暂无个人简介',
                likes: user.likes || '未统计',
                github: user.github || `https://github.com/${user.username}`,
                home: user.home || `/user/${user.username}`
            }));
            console.log("用户列表:", this.userlist);
        } catch (error) {
            console.error("获取用户列表失败：", error);
        }
    },
  },
  mounted() {
    this.updateLoginInfo(); // 页面加载时调用
    this.fetchuserlist(); // 获取用户列表
  }
};
</script>

<style>
@import url(@/assets/css/Navigation-bar.css);
:root {
    --primary-color: #2ecc71;
    --secondary-color: #27ae60;
    --background-color: #f0f4f8;
    --card-color: #ffffff;
    --text-color: #2c3e50;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.user-avatar {
    font-size: 2.8rem;
    color: var(--primary-color);
    margin-right: 1rem;
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
    color: #666;
}

.user-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem 1rem;
    font-size: 0.85rem;
    color: #555;
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
    color: white;
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
</style>