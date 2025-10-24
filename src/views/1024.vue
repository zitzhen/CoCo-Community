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

<div class="a1024card" v-show="a1024Banner">
  <div class="Positioning"></div>
  <h2 class="a1024title">🎉今天是我们的节日——1024🎉</h2>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>

<div class="a1024card" v-show="Next1024">
  <div class="Positioning"></div>
  <h2 class="a1024title">距离下一次1024还有</h2>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>
</template>

<style>
@import url(@/assets/style/404/style.css);
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/css/1024.css);
</style>

<script>
import { checkLoginStatus } from '@/script/login';

function isOctober24th() {
    const today = new Date();
    return today.getMonth() === 9 && today.getDate() === 24;
}

export default {
  name: '404',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
      a1024Banner:false,
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
  if (isOctober24th()){
    this.a1024Banner = true;
    }else{
    this.a1024Banner = false;
    }
  }
}
</script>