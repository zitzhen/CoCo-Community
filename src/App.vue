<template>
  <div class="app-container">
    <Navigation />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/footer.vue';
import Navigation from '@/components/Navigation-bar.vue';
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  components: {
    Footer,
    Navigation
  }
}

</script>
<script setup>
onMounted(async () => {
  //发送记录请求
  const domain = window.location.hostname;
  if (!domain.includes("test") && !domain.includes("127.0.0.1") && !domain.includes("localhost")){
  const apiUrl = `https://cc.zitzhen.cn/api/log?url=${window.location.href}`;
  fetch(apiUrl, { method: 'GET' });
  }
})
</script>

<style>
/*引入深色模式/*/
@import 'assets/css/dark.css';

/*强制修复h标签样式/*/
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