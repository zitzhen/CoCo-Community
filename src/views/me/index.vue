<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
        <div class="user-info">
          <img :src="avatar" alt="用户头像" class="user-avatar" />
          <div class="user-name">{{ username }}</div>
        </div>
      </div>
    </nav>

    <!-- 顶部间距 -->
    <div style="height: 90px;"></div>

    <!-- 用户信息 -->
    <div class="profile-header-me">
      <img :src="avatar" alt="用户头像" class="avatar-me" id="avatar_img" />
      <div class="user-info-me">
        <h1 id="user_name">{{ Nickname }}</h1>
        <p id="user_introduction">{{ bio }}</p>
        <div class="stats-me">
          <div class="stat-item-me">
            <div class="stat-number-me" id="number_of_controls">{{ Control_number }}</div>
            <div class="stat-label-me">控件</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单导航 -->
    <div class="tabs-me">
      <div :class="['tab-me', { 'active-me': activeTab === 'files' }]" @click="switchTab('files')">控件</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'articles' }]" @click="switchTab('articles')">文章</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'github' }]" @click="switchTab('github')">Github</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'settings' }]" @click="switchTab('settings')">设置</div>
    </div>

    <!-- 控件板块 -->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'files' }]" id="files">
      <h2 class="section-title-me">你的控件</h2>
    </div>

    <!-- 文章板块 -->
    <div :class="['tab-content-user', { 'active-user': activeTab === 'articles' }]" id="articles">
      <h2>你的文章</h2>
      <p>请勿着急，文章功能尚未发布。</p>
    </div>

    <!-- Github板块 -->
    <div :class="['tab-content-user', { 'active-user': activeTab === 'github' }]" id="github">
      <p>以下是您的Github账户信息</p>
      <p>{{ url }}</p>
    </div>

    <!-- 设置板块 -->
    <div :class="['tab-content-user', { 'active-user': activeTab === 'settings' }]" id="settings">
      <p>暂无可设置项目</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { checkLoginStatus } from '@/script/login';

export default {
  data() {
    return {
      avatar: "/images/user.png",
      username: "未登录用户",
      Nickname: "",
      bio: "",
      Control_number: 0,
      url: "",
      activeTab: "files"
    };
  },
  methods: {
    switchTab(tabName) {
      this.activeTab = tabName;
    }
  },
  mounted() {
    checkLoginStatus()
      .then((logininformation) => {
        if (!logininformation || !logininformation.authenticated) {
          this.username = "未登录用户";
          this.avatar = "/images/user.png";
        } else {
          this.username = logininformation.user.name || logininformation.user.login;
          this.avatar = logininformation.user.avatar_url || "/images/user.png";
          this.Nickname = logininformation.user.name || "";
          this.bio = logininformation.user.bio || "";
          this.url = logininformation.user.html_url || "";
          this.Control_number = logininformation.user.controls || 0;
        }
      })
      .catch((err) => {
        console.error("登录检查失败：", err);
        this.username = "登录信息检查失败";
      });
  }
};
</script>

<style>
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/style/me/style.css);
@import url(@/assets/style/me/style2.css);
</style>