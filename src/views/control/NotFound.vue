<template>
<div style="height: 90px;"></div>
<div class="a_404_container">
        <div class="a_404_error-content">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="error-title">404 - 控件未找到</h2>
            <p class="a_404_error-message">
                抱歉，您访问的控件不存在或已被移除。<br>
                可能是URL地址输入错误，或者控件已被删除。
            </p>
        </div>
    </div>
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

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '404控件未找到|CoCo-Community',
  meta: [
    {content: '抱歉，您访问的控件不存在或已被移除。可能是URL地址输入错误，或者控件已被删除。' }
  ]
})
</script>