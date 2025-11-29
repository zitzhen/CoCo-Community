<template>
  <div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info" @click="gome">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
<div style="height: 65px;"></div>
<div class="a1024card" v-show="a1024Banner">
  <div class="Positioning"></div>
  <h2 class="a1024title">🎉今天是我们的节日——1024🎉</h2>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>
    <div class="notifications-container" id="no_fetch" style="display: none;">
      <div class="error-alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="error-svg">
              <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
            </svg>
          </div>
          <div class="error-prompt-container">
            <p class="error-prompt-heading">很抱歉，请求无法完成
            </p>
            <div class="error-prompt-wrap">
              <ul class="error-prompt-list" role="list">
                <li>请检查您的网络连接</li>
                <li>错误：网络不可达或服务器宕机，或者IP限制。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="search-bar">
        <input type="text" id="searchInput" placeholder="搜索文件..." v-model="searchTerm" @keyup.enter="goToGlobalSearch">
        <button id="searchBtn" @click="goToGlobalSearch"><i class="fas fa-search"></i> 全局搜索</button>
      </div>
      <h2 style="text-align: center;" id="Loading_text" v-show="loading">请稍后，正在加载</h2>
      <div class="home-control-list" id="fileList">
        <div class="home-control-card" v-for="file in filteredFiles" :key="file.name">
          <div class="home-control-header">
            <div class="home-control-icon">
              <i class="fas" :class="getFileIconClass(file.type)"></i>
            </div>
            <div class="home-control-meta">
              <div class="home-control-name">{{ file.name }}</div>
              <div class="home-control-author">作者：{{ file.Author }}</div>
            </div>
          </div>

          <div class="home-control-stats">
            <div><i class="fas fa-file"></i> {{ file.size }}</div>
            <div><i class="fas fa-download"></i> {{ file.downloads }}</div>
            <div><i class="fas fa-thumbs-up"></i> 0</div>
            <div><i class="fas fa-star"></i> 0</div>
            <div><i class="fas fa-eye"></i>{{ file.Pageviews }}</div>
          </div>

          <div class="button-group">
            <a :href="file.url" class="icon-btn" title="下载">
              <i class="fas fa-download"></i>
            </a>
            <a :href="file.url" class="text-btn">
              <i class="fas fa-eye"></i> 去详情页面
            </a>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="container">
        <p>© 2025 小圳社区 - CoCo自定义控件下载中心 | 所有文件仅供学习交流使用</p>
        <div class="bottom-button">
          <a href="https://github.com/zitzhen/CoCo-Community" target="_blank">
            <button class="btn">
              <svg width="40" height="40" fill="#0092E4" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="github">
                <image href="/src/assets/images/icon/github.svg" width="24" height="24" x="0" y="0"/>
              </svg>
            </button>
          </a>
          <a href="https://gitee.com/zitzhen/CoCo-Community" target="_blank">
            <button class="btn">
              <svg width="40" height="40" fill="#c71d23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="gitee">
                <image href="/src/assets/images/icon/gitee.svg" width="24" height="24" x="0" y="0"/>
              </svg>
            </button>
          </a>
          <a href="https://gitlab.com/zitzhen/CoCo-Community">
            <button class="btn bins">
          <svg width="40" height="40" fill="#FC6D26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="gitlab">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
          </svg>
        </button>
        </a>
        <a href="https://gitcode.com/zitzhen/CoCo-Community">
            <button class="btn bins">
            <svg width="40" height="40" fill="#c71d23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="gitee">
                <image href="/src/assets/images/icon/gitcode.svg" width="24" height="24" x="0" y="0"/>
              </svg>
        </button>
        </a>
        </div>
        <br>
        <div style="margin: 0 auto;">
          <a href="tipping/" style="margin: 0 auto;">
            <button class="Btn" style="margin: 0 auto;">
              向我们打赏
              <svg class="svgIcon" viewBox="0 0 576 512">
                <path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path>
              </svg>
            </button>
          </a>
        </div>
        <p>请优先使用GitHub查看ZIT-CoCo-Community的开源项目</p>
        <router-link to="/agreement/useragreement"><button class="button-book">用户协议</button></router-link>
        <router-link to="/agreement/privacypolicy"><button class="button-book">隐私协议</button></router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import { checkLoginStatus } from '@/script/login';

function isOctober24th() {
    const today = new Date();
    return today.getMonth() === 9 && today.getDate() === 24;
}

export default {
  name: 'Home',
  data() {
    return {
      a1024Banner: false,
      avatar:"/images/user.png",
      username:"未登录用户",
      loading: true,
      searchTerm: '',
      files: [],
      filteredFiles: [],
      // 文件类型对应的图标
      fileIcons: {
        code: "fa-file-code"
      }
    }
  },
  methods: {
    getFileIconClass(fileType) {
      return this.fileIcons[fileType] || this.fileIcons.default;
    },
    goToGlobalSearch() {
      if (this.searchTerm.trim()) {
        // 跳转到全局搜索页面并传递搜索词
        this.$router.push(`/search?q=${encodeURIComponent(this.searchTerm.trim())}`);
      }
    },
    gome() {
      this.$router.push('/me') // 跳转到我的页面
    },
    async getSubDirs() {
      try {
        // 使用本地 list.json 文件获取控件列表
        const { data } = await axios.get('/control/list.json');
        const dirs = data.list || [];
        console.log("Directories:", dirs);
        
        const fileObjs = dirs.map(information => ({
          name: information.name,
          Author: information.author || "未知",
          type: "code",
          size: information.size || "未知",
          date: "未知",
          downloads: information.downloads || 0,
          Pageviews: information.Pageviews || 0,
          url: `${window.location.origin}/control/${information.name}`
        }));
        
        this.files = fileObjs;
        this.filteredFiles = fileObjs;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching directories:", error.response?.status || error.message);
        document.getElementById("no_fetch").style.display = 'block';
        this.loading = false;
      }
    },
    },
  mounted() {
    this.getSubDirs();
    checkLoginStatus().then((logininformation) => {
    if (!logininformation || !logininformation.authenticated) {
      this.username = '未登录用户';
      this.avatar = '/images/user.png';
    } else {
      this.username = logininformation.user.name || logininformation.user.login;
      this.avatar = logininformation.user.avatar_url || '/images/user.png';
    }
  }).catch((err) => {isVisible
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

<style>
@import '../../src/assets/style/home/style.css';
@import '../../src/assets/css/card.css';
@import '../../src/assets/style/home/Custom_button.css';
@import '../../src/assets/style/home/Loading.css';
@import '../../src/assets/style/control/error.css';
@import '../../src/assets/style/home/pay_button.css';
@import '@/assets/css/1024.css';
@import '@/assets/css/dark.css';
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'ZIT-CoCo-Community|CoCo编辑器的小圳社区|自定义控件下载中心',
  meta: [
    {content: 'CoCo-Community，全称为ZIT-CoCo-Community。这是由于ZIT小圳创科工作室的创造的编程猫CoCo编辑器社区，目前提供自定义控件下载服务，后续会支持论坛的交流。' }
  ]
})
</script>


<style>
@import url(@/assets/css/Navigation-bar.css);
/*协议/**/ 
    .button-book {
    font-size: 17px;
    padding: 0.5em 2em;
    border: transparent;
    box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
    background: dodgerblue;
    color: white;
    border-radius: 4px;
}

.button-book:hover {
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(30,144,255,1) 0%, rgba(0,212,255,1) 100%);
}

.button-book:active {
    transform: translate(0em, 0.2em);
}

</style>