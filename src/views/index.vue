<template>
  <div id="app">
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