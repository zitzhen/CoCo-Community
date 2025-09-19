<template>
  <div>
    <header>
      <div class="container">
        <h1>ZIT-CoCo-Community隐私政策</h1>
        <p>请仔细阅读此隐私政策</p>
      </div>
    </header>

    <br />
    <div class="card-agreement" id="content">
      <div class="progress-container" v-if="loading">
        <div class="progress-bar"></div>
      </div>
      <h2 v-if="loading" id="Loading_tip">请稍后，我们正在处理</h2>
      <div v-else>
        <div v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchPrivacyPolicyContent } from './index.ts';
import { PrivacyPolicyData } from '@types';

export default defineComponent({
  name: 'PrivacyPolicy',
  data(): PrivacyPolicyData {
    return {
      loading: true,
      content: ''
    }
  },
  async mounted() {
    try {
      this.content = await fetchPrivacyPolicyContent();
      this.loading = false;
    } catch (error: any) {
      console.error('请求出错:', error);
      this.loading = false;
    }
  }
});
</script>

<style scoped>
@import '../../../assets/style/agreement/style.css';
@import '../../../assets/style/home/Loading.css';
</style>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: '隐私政策|CoCo-Community|适用于CoCo-Community的隐私政策条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的隐私政策及条款。' }
  ]
})
</script>