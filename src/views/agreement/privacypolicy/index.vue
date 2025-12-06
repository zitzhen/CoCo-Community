<template>
  <div>
  <div style="height: 90px;"></div>
    <br />
    <div class="card-agreement" id="content">
      <div class="progress-container" v-if="loading">
        <div class="progress-bar"></div>
      </div>
      <h2 v-if="loading" id="Loading_tip">请稍后，我们正在处理</h2>
      <div v-else>
        <div v-html="content" class="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { marked } from 'marked'
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      loading: true,
      content: '',
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },
  methods: {
    async loadContent() {
      try {
        // 确保marked已经正确加载
        if (typeof marked === 'undefined') {
          console.error('Marked library not loaded')
          this.loading = false
          return
        }
        
        // 首先尝试从远程获取
        try {
          const response = await axios.get('https://cc.zitzhen.cn/agreement/privacypolicy/content.md')
          this.content = marked.parse(response.data)
        } catch (remoteError) {
          console.warn('远程内容获取失败，尝试使用本地内容:', remoteError)
          // 如果远程获取失败，尝试从本地获取
          try {
            const localResponse = await axios.get('/agreement/privacypolicy/content.md')
            this.content = marked.parse(localResponse.data)
          } catch (localError) {
            console.error('本地内容获取也失败:', localError)
            this.content = '<p>内容加载失败，请稍后重试。</p>'
          }
        }
      } catch (error) {
        console.error('内容加载出错:', error)
        this.content = '<p>内容加载失败，请稍后重试。</p>'
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    // 确保在mounted之后再加载内容
    this.$nextTick(() => {
      this.loadContent()
    })
    
 }
}
</script>

<style scoped>
@import '../../../assets/style/agreement/style.css';
@import '../../../assets/style/home/Loading.css';
@import url(@/assets/css/dark.css);
@media (prefers-color-scheme: dark){
  .content{
    color: black;
  }
}
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '隐私政策|CoCo-Community|适用于CoCo-Community的隐私政策条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的隐私政策及条款。' }
  ]
})
</script>