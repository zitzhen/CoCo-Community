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

    <div style="height: 65px;"></div>
<div class="a1024card" v-show="a1024Banner">
  <div class="Positioning"></div>
  <h2 class="a1024title">🎉今天是我们的节日——1024🎉</h2>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>

<div class="a1024card" v-show="Next1024">
  <div class="Positioning"></div>
  <h2 class="a1024title">距离下一次1024还有</h2>
  <div class="countdown-wrapper">
    <div class="countdown-container">
      <div class="countdown-item">
        <span class="countdown-number">{{ days }}</span>
        <span class="countdown-label">天</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ hours }}</span>
        <span class="countdown-label">时</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ minutes }}</span>
        <span class="countdown-label">分</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ seconds }}</span>
        <span class="countdown-label">秒</span>
      </div>
    </div>
  </div>
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

function getNextOctober24th() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextOctober24th = new Date(currentYear, 9, 24); // 10月是索引9
    
    // 如果今年的10月24日已经过了，就计算明年的
    if (now > nextOctober24th) {
        return new Date(currentYear + 1, 9, 24);
    }
    return nextOctober24th;
}

export default {
  name: '404',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
      a1024Banner:false,
      Next1024:false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      countdownInterval: null
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
    this.Next1024 = false;
    }else{
    this.a1024Banner = false;
    this.Next1024 = true;
    this.startCountdown();
    }
  },
  methods: {
    startCountdown() {
      this.updateCountdown();
      this.countdownInterval = setInterval(this.updateCountdown, 1000);
    },
    updateCountdown() {
      const now = new Date();
      
      // 检查是否已经进入10月24日
      if (isOctober24th()) {
        // 如果是10月24日，停止倒计时并显示节日页面
        this.stopCountdown();
        this.a1024Banner = true;
        this.Next1024 = false;
        return;
      }
      
      const nextOctober24th = getNextOctober24th();
      const diff = nextOctober24th - now;
      
      // 计算天、小时、分钟、秒
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    },
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }
  },
  beforeDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
</script>