<template>
  <div>
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
    <div class="card-agreement" id="content">
      <div class="progress-container" v-if="loading">
        <div class="progress-bar"></div>
      </div>
      <h2 v-if="loading" id="Loading_tip">请稍后，我们正在处理</h2>
      <div v-else>
        <div v-html="content" class="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { marked } from 'marked'
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'UserAgreement',
  data() {
    return {
      loading: true,
      content: '',
      avatar:"/images/user.png",
      username:"未登录用户"
    }
  },
  async mounted() {
    try {
      const response = await axios.get('https://cc.zitzhen.cn/agreement/useragreement/content.md')
      this.content = marked.parse(response.data)
      this.loading = false
    } catch (error) {
      console.error('请求出错:', error)
      this.loading = false
    }
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

<style scoped>
@import '../../../assets/style/agreement/style.css';
@import '../../../assets/style/home/Loading.css';
@import url(@/assets/css/Navigation-bar.css);
@media (prefers-color-scheme: dark){
  .content{
    color: black;
  }
}
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '用户协议|CoCo-Community|适用于CoCo-Community的用户协议条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的用户协议及条款。' }
  ]
})
</script>