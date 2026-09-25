<template>
  <div>
    <div class="card-agreement" id="content">
      <div v-html="content" class="content"></div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

// SSR：协议内容在构建期打包进 bundle（服务端内部 fetch 静态文件会落到渲染层返回 HTML）
import markdownRaw from '../../../public/agreement/useragreement/content.md?raw'

const content = marked.parse(markdownRaw)

useHead({
  title: '用户协议|CoCo-Community|适用于CoCo-Community的用户协议条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的用户协议及条款。' }
  ]
})
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

