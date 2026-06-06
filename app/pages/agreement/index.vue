<template>
<NuxtLink to="/agreement/useragreement" class="file-link">
    <span class="file-list">
        <span class="file-card doc">
            <span class="file-content">
                <span class="file-name">CoCo-Community用户协议</span>
            </span>
        </span>
    </span>
</NuxtLink>

<NuxtLink to="/agreement/privacypolicy" class="file-link">
     <span class="file-list">
    <span class="file-card doc">
        <span class="file-content">
            <span class="file-name">CoCo-Community隐私协议</span>
        </span>
    </span>
    </span>
</NuxtLink>
</template>

<script setup>
useHead({
  title: '协议公示|CoCo-Community|ZIT-CoCo-Community适用协议公示',
  meta: [
    {
      name: 'description',
      content: '这是ZIT-CoCo-Community的协议公示页面，公示了所有适用于CoCo-Community的协议及条款。'
    }
  ]
})
</script>

<style>
@import '@/assets/style/home/style.css';
@import url(@/assets/css/dark.css);
</style>
