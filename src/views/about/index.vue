<template>
<div style="height: 90px;"></div>

    <div class="card-about">
        <h1>关于我们</h1>
        <p>欢迎来到CoCo-Community，CoCo-Community是附属于ZIT小圳创科工作室的产品。旨在补充第三方社区的不足。</p>
    </div>
      
      <div style="height: 20px;"></div>

    <div class="card-about" >
        <h2>CoCo-Community开发者列表</h2>
        <a>- 刘小圳<img src="https://github-readme-stats.vercel.app/api?username=Iamliuxiaozhen" ></img></a>
    </div>

      <div style="height: 20px;"></div>

      <div class="card-about">
          <h2>我们的社交频道</h2>
        <a href="https://discord.gg/CvT5R8ew">Discord</a>
        <br></br>
        <a href="https://qm.qq.com/cgi-bin/qm/qr?k=966509561">QQ</a>
        <p></p>
    </div>
</template>

<style scoped>
@import url(@/assets/style/about/style.css);
@import url(@/assets/css/dark.css);
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '关于我们|ZIT-CoCo-Community',
  meta: [
    {content: '欢迎来到CoCo-Community，CoCo-Community是附属于ZIT小圳创科工作室的产品。旨在补充第三方社区的不足。' }
  ]
})
</script>