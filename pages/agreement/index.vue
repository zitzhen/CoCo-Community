<template>
<header class="list-page-header">
  <h1 class="list-page-title">协议公示</h1>
  <p class="list-page-subtitle">适用于 ZIT-CoCo-Community 的协议与条款</p>
</header>

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
    {content: '这是Zit-CoCo-Community的协议公示页面，公示了所有适用于CoCo-Community的协议及条款，这包括《用户协议》和《隐私政策》' }
  ]
})
</script>

<style>
@import '@/assets/style/home/style.css';
@import url(@/assets/css/dark.css);

.list-page-header {
  margin-bottom: var(--space-6);
}
.list-page-title {
  font-size: var(--font-size-h1);
  font-weight: 800;
  color: var(--foreground);
  margin: 0 0 var(--space-2);
  letter-spacing: -0.02em;
}
.list-page-subtitle {
  color: var(--muted);
  font-size: var(--font-size-body);
  margin: 0;
}
</style>
