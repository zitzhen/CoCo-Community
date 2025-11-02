<template>
  <div>
    <!-- 加载动画 -->
    <div class="progress-container" v-if="loading">
      <div class="progress-bar"></div>
    </div>
    </div>

    <!-- 顶部导航栏 -->
  <div id="app">
          <nav class="navbar">
              <div class="nav-container">
                  <div class="logo" @click="gohome">ZIT<span>-CoCo-Community</span></div>
                  <div class="user-info" @click="gome">
                      <img :src="avatar_ber" alt="用户头像" class="user-avatar">
                      <div class="user-name">{{ username }}</div>
                  </div>
              </div>
          </nav>
  <div style="height: 65px;"></div>


    <!-- 错误提示悬浮窗 -->
    <div v-if="errorVisibleSmall" class="card">
      <div class="icon-container">
        <svg viewBox="0 0 512 512" class="icon">
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4 9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
        </svg>
      </div>
      <div class="message-text-container">
        <p class="message-text">发生错误</p>
        <p class="sub-text">{{ errorMessage }}</p>
      </div>
      <svg viewBox="0 0 15 15" class="cross-icon" @click="offError">
        <path fill="currentColor" d="M11.78 4.03c.22-.22.22-.58 0-.8a.57.57 0 0 0-.81 0L7.5 6.69 4.03 3.22a.57.57 0 0 0-.81 0c-.22.22-.22.58 0 .8L6.69 7.5l-3.47 3.47c-.22.22-.22.58 0 .8.22.22.58.22.81 0L7.5 8.31l3.47 3.47c.22.22.58.22.81 0 .22-.22.22-.58 0-.8L8.31 7.5l3.47-3.47z"/>
      </svg>
    </div>

    <!-- 错误提示窗口 -->
    <div class="notifications-container" v-if="errorVisible">
      <div class="error-alert">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="error-svg" viewBox="0 0 20 20">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.7 7.3a1 1 0 00-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 101.4 1.4L10 11.4l1.3 1.3a1 1 0 001.4-1.4L11.4 10l1.3-1.3a1 1 0 00-1.4-1.4L10 8.6 8.7 7.3z"/>
            </svg>
          </div>
          <div class="error-prompt-container">
            <p class="error-prompt-heading">发生错误</p>
            <ul class="error-prompt-list">
              <li>{{ errorMessage }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件信息 -->
    <div class="container" v-if="!errorVisible && !loading">
      <div class="file-detail-container">
        <div class="main-content">
          <div class="file-header">
            <div class="file-icon"><i class="fas fa-file-code"></i></div>
            <div class="file-title">
              <h2 class="file-name">{{ filename }}</h2>
              <div class="file-meta"><span>大小: {{ fileSize }} KiB</span></div>
            </div>
            <a :href="downloadUrl" download>
              <button class="download-btn"><i class="fas fa-download"></i> 下载</button>
            </a>
            <a :href="sourceUrl">
              <button class="download-btn"><i class="fas fa-file-code"></i> 源代码</button>
            </a>
          </div>

          <div class="section">
            <h3 class="section-title"><i class="fas fa-info-circle"></i> 文件介绍</h3>
            <div class="file-description" v-html="introduceHtml"></div>
          </div>

          <div class="section">
            <h3 class="section-title"><i class="fas fa-history"></i> 历史版本</h3>
            <ul class="version-list">
              <li class="version-item" v-for="v in versions" :key="v">
                <div class="version-info"><div class="version-number">{{ v }}</div></div>
              </li>
            </ul>
          </div>
        </div>

        <div class="sidebar">
          <div class="creator-card">
            <h3 class="section-title"><i class="fas fa-user"></i> 创作者</h3>
            <div class="creator-info">
              <img :src="avatar" alt="创作者头像" class="creator-avatar" />
              <div><h4 class="creator-name">{{ authorName }}</h4></div>
            </div>
            <div class="creator-bio"><p>{{ authorBio }}</p></div>
          </div>
          <div class="stats-card">
            <h3 class="section-title"><i class="fas fa-chart-bar"></i> 统计信息</h3>
            <div class="stat-item"><span class="stat-label">文件大小</span><span class="stat-value">{{ fileSize }} KiB</span></div>
            <div class="stat-item"><span class="stat-label">文件类型</span><span class="stat-value">JSX</span></div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div class="container"><p>© 2025 小圳社区 - CoCo-Community | 所有文件仅供学习交流使用</p></div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { marked } from "marked"
import { useHead } from "@vueuse/head"

// -------- 响应式数据 --------
const loading = ref(true)
const errorVisible = ref(false)
const errorVisibleSmall = ref(false)
const errorMessage = ref("")
const filename = ref("")
const fileSize = ref("正在加载")
const versions = ref([])
const introduceHtml = ref("<p>正在处理</p>")
const avatar = ref("")
const authorName = ref("正在加载")
const authorBio = ref("正在加载")
const downloadUrl = ref("")
const sourceUrl = ref("")

const route = useRoute()

// -------- 方法 --------
function offError() {
  errorVisibleSmall.value = false
}

async function fetchData() {
  try {
    const { id } = route.params
    if (!id) {
      throwError("未检测到参数")
      return
    }
    filename.value = id

    // 1) 获取信息文件
    const infoUrl = `/control/${id}/information.json`
    const infoRes = await fetch(infoUrl)
    if (!infoRes.ok) throw new Error(`未找到 information.json：${infoUrl} （HTTP ${infoRes.status}）`)
    const jsonData = await infoRes.json()

    // 2) 控件文件（根据最新版本号）
    const latestVersion = jsonData.Current_version
    const controlUrl = `/control/${id}/${latestVersion}/control.jsx`
    const controlRes = await fetch(controlUrl)
    if (!controlRes.ok) throw new Error(`未找到控件文件：${controlUrl} （HTTP ${controlRes.status}）`)
    const controlBlob = await controlRes.blob()
    fileSize.value = (controlBlob.size / 1024).toFixed(2)

    // 3) README
    const readmeUrl = `/control/${id}/README.md`
    const readmeRes = await fetch(readmeUrl)
    if (readmeRes.ok) {
      const text = await readmeRes.text()
      introduceHtml.value = marked.parse(text || "")
    } else {
      introduceHtml.value = `<p style="color:#b33">未能找到 README.md（HTTP ${readmeRes.status}）</p>`
    }

    // 4) Github 作者信息
    if (jsonData.author) {
      try {
        const creatorRes = await fetch(`https://api.github.com/users/${jsonData.author}`)
        if (creatorRes.ok) {
          const creator = await creatorRes.json()
          avatar.value = creator.avatar_url
          authorName.value = creator.name || jsonData.author
          authorBio.value = creator.bio
        } else {
          authorName.value = jsonData.author
        }
      } catch {
        authorName.value = jsonData.author
      }
    }

    downloadUrl.value = controlUrl
    sourceUrl.value = controlUrl
    versions.value = Array.isArray(jsonData.Version_number_list) ? jsonData.Version_number_list : []

    // ✅ 动态更新 SEO 信息
    useHead({
      title: `${filename.value} 控件 - ${authorName.value}|ZIT-CoCo-Community`,
      meta: [
        { name: "description", content: authorBio.value || "一个自定义控件" },
        { property: "og:title", content: `${filename.value} 控件` },
        { property: "og:description", content: authorBio.value || "一个自定义控件" },
        { property: "og:image", content: avatar.value || "" }
      ]
    })
  } catch (e) {
    throwError(e.message || "未知错误")
  } finally {
    loading.value = false
  }
}

function throwError(msg) {
  errorMessage.value = msg
  errorVisible.value = true
  errorVisibleSmall.value = true
  loading.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<style>
@import "@/assets/css/style.css";
@import "@/assets/css/error.css";
@import "@/assets/css/Navigation-bar.css";
</style>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'user',
  data() {
    return {
      avatar_ber:"/images/user.png",
      username:"未登录用户",
    }
  },
  methods: {
    gome() {
      this.$router.push('/me') // 跳转到我的页面
    }},
    gohome(){
      this.$router.push('/Home')
    },
  mounted() {
    checkLoginStatus().then((logininformation) => {
    if (!logininformation || !logininformation.authenticated) {
      this.username = '未登录用户';
      this.avatar_ber = '/images/user.png';
    } else {
      this.username = logininformation.user.name || logininformation.user.login;
      this.avatar_ber = logininformation.user.avatar_url || '/images/user.png';
    }
  }).catch((err) => {
    console.error("登录检查失败：", err);
    this.username = '登录信息检查失败';
  });
  }
}
</script>