<template>
  <div class="app-container">
    <NavigationBar />
    <NavigationLines />
    <NuxtPage />
    <Footer />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    if (!import.meta.client) return

    const hostname = window.location.hostname
    const isLocal = ['127.0.0.1', 'localhost'].includes(hostname) || hostname.includes('test')
    if (!isLocal) {
      void fetch(`https://cc.zitzhen.cn/api/log?url=${encodeURIComponent(window.location.href)}`)
    }
    window.scrollTo({ top: 0 })
  },
  { immediate: true }
)
</script>

<style>
h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

h4 {
  font-size: 1em;
  font-weight: bold;
  margin: 1.12em 0;
}

h5 {
  font-size: 0.83em;
  font-weight: bold;
  margin: 1.5em 0;
}

h6 {
  font-size: 0.75em;
  font-weight: bold;
  margin: 1.67em 0;
}
</style>
