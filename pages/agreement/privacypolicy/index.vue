<template>
  <div>
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
import { marked } from 'marked'

export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      loading: true,
      content: '',
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
        
        // 直接从本地 public 目录获取
        try {
          const markdown = await $fetch('/agreement/privacypolicy/content.md', { responseType: 'text' })
          this.content = marked.parse(markdown)
        } catch (localError) {
          console.error('本地内容获取失败:', localError)
          this.content = '<p>内容加载失败，请稍后重试。</p>'
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
@import '@/assets/style/agreement/style.css';
@import '@/assets/style/home/Loading.css';
@import url(@/assets/css/dark.css);
@media (prefers-color-scheme: dark){
  .content{
    color: black;
  }
}
</style>

<script setup>

useHead({
  title: '隐私政策|CoCo-Community|适用于CoCo-Community的隐私政策条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的隐私政策及条款。' }
  ]
})
</script>
