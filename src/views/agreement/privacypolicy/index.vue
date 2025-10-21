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
    <br />
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

export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      loading: true,
      content: ''
    }
  },
  async mounted() {
    try {
      const response = await axios.get('https://cc.zitzhen.cn/agreement/privacypolicy/content.md')
      this.content = marked.parse(response.data)
      this.loading = false
    } catch (error) {
      console.error('请求出错:', error)
      this.loading = false
    }
  }
}
</script>

<style scoped>
@import '../../../assets/style/agreement/style.css';
@import '../../../assets/style/home/Loading.css';
@media (prefers-color-scheme: dark){
  .content{
    color: black;
  }
}
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '隐私政策|CoCo-Community|适用于CoCo-Community的隐私政策条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的隐私政策及条款。' }
  ]
})
</script>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'privacypolicy',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },
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