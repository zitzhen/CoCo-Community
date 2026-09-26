<template>
  <div class="app-container">
    <Navigation />
    <main class="app-main">
      <NuxtPage />
    </main>
    <CommandPalette />
    <Footer />
  </div>
</template>

<script setup>
import CommandPalette from '@/components/CommandPalette.vue'
import Footer from '@/components/footer.vue'
import Navigation from '@/components/Navigation-bar.vue'

onMounted(async () => {
  const domain = window.location.hostname
  if (
    !domain.includes('test') &&
    !domain.includes('127.0.0.1') &&
    !domain.includes('localhost')
  ) {
    const apiUrl = `https://cc.zitzhen.cn/api/log?url=${window.location.href}`
    fetch(apiUrl, { method: 'GET' })
  }
})
</script>

<style>
@import '@/assets/css/tokens.css';
@import '@/assets/css/base.css';
@import '@/assets/css/prose.css';
</style>
