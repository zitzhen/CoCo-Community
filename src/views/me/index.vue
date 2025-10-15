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
</template>

<style>
@import url(@/assets/css/Navigation-bar.css);
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
  },methods:{

  }}
</script>