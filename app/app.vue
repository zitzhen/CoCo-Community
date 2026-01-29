<template>
  <div>
    <!-- 导航栏组件 -->
    <NavigationBar />
    
    <!-- 导航间距线组件 -->
    <NavigationLines />
    
    <!-- Nuxt 页面内容 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- 页脚组件 -->
    <Footer />
  </div>
</template>

<script>
import NavigationBar from './components/Navigation-bar.vue';
import NavigationLines from './components/Navigation-lines.vue';
import Footer from './components/footer.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  components: {
    NavigationBar,
    NavigationLines,
    Footer
  }
}
</script>