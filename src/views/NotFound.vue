<template>
    <div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info" @click="gome">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
    </div>
<div style="height: 90px;"></div>
<div class="container">
        <div class="error-content">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="error-title">404 - 页面未找到</h2>
            <p class="error-message">
                抱歉，您访问的页面不存在或已被移除。<br>
                可能是URL地址输入错误，或者页面已被删除。
            </p>
        </div>
    </div>
    <footer>
        <div class="container">
            <p>© 2025 ZIT-CoCo-Community | 遇到问题请联系支持团队</p>
        </div>
    </footer>
</template>

<style>
@import url(@/assets/style/404/style.css);
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/css/dark.css);
</style>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: '404',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },methods: {
    gome() {
      this.$router.push('/me') // 跳转到我的页面
    }},
  mounted() {
    checkLoginStatus().then((logininformation) => {
    if (!logininformation || !logininformation.authenticated) {
      this.username = '未登录用户';
      this.avatar = '/images/user.png';
    } else {
      this.username = logininformation.user.name || logininformation.user.login;
      this.avatar = logininformation.user.avatar_url || '/images/user.png';
    }
  }).catch((err) => {
    console.error("登录检查失败：", err);
    this.username = '登录信息检查失败';
  });
  }
}
</script>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '404页面未找到|CoCo-Community',
  meta: [
    {content: '抱歉，您访问的页面不存在或已被移除。可能是URL地址输入错误，或者页面已被删除。' }
  ]
})
</script>