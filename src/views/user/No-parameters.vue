<template>

<div style="height: 90px;"></div>
    <div class="container-error-card">
        <div class="error-content">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="error-title">请检查路径</h2>
            <p class="error-message">
                抱歉，您访问的是根路径。不能使用路径访问。
            </p>
        </div>
    </div>
</template>
<style>
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/css/dark.css);

    :root {
    --primary-color: #3498db;
    --secondary-color: #2980b9;
    --background-color: #f5f7fa;
    --card-color: #ffffff;
    --text-color: #333333;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.container-error-card{
    display: flex;
    justify-content: center;
    align-items: center;
}

.error-content {
    background-color: var(--card-color);
    border-radius: 8px;
    padding: 2rem;
    box-shadow: var(--shadow);
    text-align: center;
}

.error-icon {
    font-size: 5rem;
    color: #e74c3c;
    margin-bottom: 1.5rem;
}


.error-message {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.7;
}


@media (max-width: 600px) {
    .container {
        padding: 1rem;
    }
    
    .error-icon {
        font-size: 4rem;
    }
    
    .error-title {
        font-size: 1.5rem;
    }
}
</style>

<script>
import axios from 'axios';
import { checkLoginStatus } from '@/script/login';

export default {
  data() {
    return {
      username: "未登录用户",
      avatar: "/images/user.png"
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
    }
  },
  mounted() {
    this.updateLoginInfo(); // 页面加载时调用
  }
};
</script>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '请勿使用根路径访问|CoCo-Community',
  meta: [{
    name: 'robots',
    content: 'noindex, nofollow',
  }]
})
</script>