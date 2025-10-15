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
<div class="profile-header-me">
         <img :src="avatar" alt="用户头像" class="avatar-me" id="avatar_img">
        <div class="user-info-me">
            <h1 id="user_name">{{ Nickname }}</h1>
            <!--用户GitHub名称-->
            <p id="user_introduction">{{ bio }}</p>
            <!--用户GitHub介绍-->
            <div class="stats-me">
                <div class="stat-item-me">
                    <div class="stat-number-me" id="number_of_controls">{{ Control_number }}</div>
                    <div class="stat-label-me">控件</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/style/me/style.css);
@import url(@/assets/style/me/style2.css);
</style>

<script>
import axios from 'axios';
import { checkLoginStatus } from '@/script/login';

export default {
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },
  methods: {
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
}}
</script>