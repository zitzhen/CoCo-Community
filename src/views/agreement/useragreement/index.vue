<template>
  <div>
    <header>
      <div class="container">
        <h1>ZIT-CoCo-Community用户协议</h1>
        <p>请仔细阅读此用户协议</p>
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
import { fetchUserAgreementContent } from './index.ts';
import { AgreementData } from '@types';

export default defineComponent({
  name: 'UserAgreement',
  data(): AgreementData {
    return {
      loading: true,
      content: ''
    }
  },
  async mounted() {
    try {
      this.content = await fetchUserAgreementContent();
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
  title: '用户协议|CoCo-Community|适用于CoCo-Community的用户协议条款',
  meta: [
    {content: '这是适用于ZIT-CoCo-Community的用户协议及条款。' }
  ]
})
</script>