<template>
  <div id="app">
    <header>
      <div class="container">
        <h1>ZIT-CoCo-Community CoCo编辑器的小圳社区 自定义控件下载中心</h1>
        <p>本服务由小圳社区提供</p>
        <p>ZIT-CoCo-Community</p>
      </div>
    </header>

    <br style="display: none;" id="error_br">
    <!-- From Uiverse.io by kennyotsu --> 
    <div class="notifications-container" id="github_error" style="display: none;">
      <div class="error-alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="error-svg">
              <path clip-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" fill-rule="evenodd"></path>
            </svg>
          </div>
          <div class="error-prompt-container">
            <p class="error-prompt-heading">我们发现您正在使用GitHub Pages链接访问ZIT-CoCo-Community
            </p>
            <div class="error-prompt-wrap">
              <ul class="error-prompt-list" role="list">
                <li>经过我们的测试通过Github Pages链接访问ZIT-CoCo-Community的错误率会比<a href="https://cc.zitzhen.cn">ZIT-CoCo-Community官方链接</a>高，为了统一性，我们不再处理Github Pages访问出错的错误，建议您使用<a href="https://cc.zitzhen.cn">ZIT-CoCo-Community</a>官方链接访问我们的网站</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
        <input type="text" id="searchInput" placeholder="搜索文件..." v-model="searchTerm" @keyup.enter="searchFiles">
        <button id="searchBtn" @click="searchFiles"><i class="fas fa-search"></i> 搜索</button>
      </div>
      <h2 style="text-align: center;" id="Loading_text" v-show="loading">请稍后，正在加载</h2>
      <div class="file-list" id="fileList">
        <div class="file-card" v-for="file in filteredFiles" :key="file.name">
          <div class="file-icon">
            <i class="fas" :class="getFileIconClass(file.type)"></i>
          </div>
          <div class="file-name">{{ file.name }}</div>
          <a :href="file.url" class="download-btn">
            <i class="fas fa-download"></i> 去详情页面
          </a>
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
          <a href="https://gitee.com/hello-oliver/CoCo-Community" target="_blank">
            <button class="btn">
              <svg width="40" height="40" fill="#c71d23" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="gitee">
                <image href="/src/assets/images/icon/gitee.svg" width="24" height="24" x="0" y="0"/>
              </svg>
            </button>
          </a>
          <a href="https://jihulab.com/zitzhen/CoCo-Community">
            <button class="btn bins">
              <svg width="40" height="40" fill="#FC6D26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="gitlab">
                <image href="/src/assets/images/icon/gitlab.svg" width="24" height="24" x="0" y="0"/>
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

export default {
  name: 'Home',
  data() {
    return {
      loading: true,
      searchTerm: '',
      files: [],
      filteredFiles: [],
      // 文件类型对应的图标
      fileIcons: {
        pdf: "fa-file-pdf",
        exe: "fa-file-code",
        zip: "fa-file-archive",
        word: "fa-file-word",
        video: "fa-file-video",
        code: "fa-file-code",
        default: "fa-file"
      }
    }
  },
  methods: {
    getFileIconClass(fileType) {
      return this.fileIcons[fileType] || this.fileIcons.default;
    },
    searchFiles() {
      const term = this.searchTerm.toLowerCase();
      this.filteredFiles = this.files.filter(file => 
        file.name.toLowerCase().includes(term)
      );
    },
    async getSubDirs() {
      try {
        // 使用本地 list.json 文件获取控件列表
        const { data } = await axios.get('/list.json');
        const dirs = data.list || [];
        console.log("Directories:", dirs);
        
        const fileObjs = dirs.map(name => ({
          name: name,
          type: "code",
          size: "未知",
          date: "未知",
          downloads: "未知",
          url: `${window.location.origin}/control/${name}`
        }));
        
        this.files = fileObjs;
        this.filteredFiles = fileObjs;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching directories:", error.response?.status || error.message);
        document.getElementById("no_fetch").style.display = 'block';
        this.loading = false;
      }
    }
  },
  mounted() {
    if (window.location.origin.includes("github.io")) {
      document.getElementById("github_error").style.display = 'block';
    }
    this.getSubDirs();
  }
}
</script>

<style>
@import '../../src/assets/style/home/style.css';
@import '../../src/assets/style/home/Custom_button.css';
@import '../../src/assets/style/home/Loading.css';
@import '../../src/assets/style/control/error.css';
@import '../../src/assets/style/home/pay_button.css';
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

<style scoped>
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