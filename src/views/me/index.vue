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
</div>
<div style="height: 90px;"></div>
    <div class="container-me" id="avatar">
    <!-- 用户信息头部 -->
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
    
    <!-- 标签导航 -->
    <div class="tabs-me">
    <div :class="['tab-me', { 'active-me': activeTab === 'files' }]" data-tab="files" @click="switchTab('files')">控件</div>
    <div :class="['tab-me', { 'active-me': activeTab === 'articles' }]" data-tab="articles" @click="switchTab('articles')">文章</div>
    <div :class="['tab-me', { 'active-me': activeTab === 'github' }]" @click="switchTab('github')">Github</div>
    <div :class="['tab-me', { 'active-me': activeTab === 'settings' }]" @click="switchTab('settings')">设置</div>
    </div>
    
    <!-- 文件板块 -->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'files' }]" id="files">
        <h2 class="section-title-me">你的控件</h2>
        <div class="file-list-me" id="display_controls">
            <div class="file-card-me" v-for="(control, index) in controlList" :key="index">
                <div class="file-icon-me">
                    <i class="far fa-file-code"></i>
                </div>
                <div class="file-info-me">
                    <div class="file-name-me">{{ control }}</div>
                </div>
                <div class="file-actions-me">
                    <a :href="`https://cc.zitzhen.cn/control/${control}`">
                        <button class="download-btn-me">去详情</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 文章板块 -->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'articles' }]" id="articles">
        <h2 class="section-title-me">你的文章</h2>
        <div class="article-list-me">
            <!-- 文章卡片 -->
            <p>文章功能正在开发中</p>
        </div>
    </div>

    <!--Github-->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'github' }]" id="github">
      <h2 class="section-title-me">Github</h2>
    </div>
</div>

  <!--设置-->
  <div :class="['tab-content-me', { 'active-me': activeTab === 'settings' }]" id="settings">
    <h2 class="section-title-me">设置</h2>
  </div>
  

    <footer>
      <div class="container-me">
          <p>© 2025 小圳社区 - CoCo-Community</p>
      </div>
  </footer>
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