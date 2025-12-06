<template>
<nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info" @click="gome">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
</template>

<style scoped>
@import url(@/assets/css/Navigation-bar.css);
</style>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },methods: {
    gome() {
      this.$router.push('/me') // 跳转到我的
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