<template>
  <UApp>
    <AppHeader />
    <main class="min-h-[70vh]">
      <NuxtPage />
    </main>
    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
const auth = useAuthStore()

onMounted(() => {
  void auth.fetchMe()
})

useHead({
  titleTemplate: title => title ? `${title} · CoCo-Community` : 'CoCo-Community',
  meta: [
    {
      name: 'description',
      content: 'CoCo-Community 是一个面向 CoCo 开发者的开源控件社区。'
    }
  ]
})
</script>
