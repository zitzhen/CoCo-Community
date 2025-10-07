<template>
  <div id="app">
    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
        </div>
    </nav>
<div style="height: 90px;"></div>
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
    },
    applyDarkMode(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    },
    checkSystemDarkMode() {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyDarkMode(isDark);
    }
  },
  mounted() {
    if (window.location.origin.includes("github.io")) {
      document.getElementById("github_error").style.display = 'block';
    }
    this.getSubDirs();
    
    // 检查系统深色模式偏好
    this.checkSystemDarkMode();
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      this.applyDarkMode(mediaQueryList.matches);
      
      mediaQueryList.addEventListener('change', (e) => {
        this.applyDarkMode(e.matches);
      });
    }
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



/* 导航栏样式 */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 0 20px;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: #cc00ff;
    text-decoration: none;
}

.logo span {
    color: #000000;
}

.nav-menu {
    display: flex;
    list-style: none;
}

.nav-item {
    margin-left: 30px;
}

.nav-link {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.3s ease;
    position: relative;
    padding: 5px 0;
}

.nav-link:hover {
    color: #3498db;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3498db;
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.hamburger {
    display: none;
    cursor: pointer;
}

.bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    background-color: #2c3e50;
    transition: all 0.3s ease;
}
@media screen and (max-width: 768px) {
  .hamburger {
      display: block;
  }
  
  .hamburger.active .bar:nth-child(2) {
      opacity: 0;
  }
  
  .hamburger.active .bar:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
  }
  
  .hamburger.active .bar:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
  }
  
  .nav-menu {
      position: fixed;
      left: -100%;
      top: 70px;
      flex-direction: column;
      background-color: white;
      width: 100%;
      text-align: center;
      transition: 0.3s;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
      padding: 20px 0;
  }
  
  .nav-menu.active {
      left: 0;
  }
  
  .nav-item {
      margin: 15px 0;
  }
}
</style>