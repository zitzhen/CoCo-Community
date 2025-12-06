<template>
    <div style="height: 90px;"></div>

<router-link :to="{ name: 'UserAgreement'}" class="file-link">
    <span class="file-list">
        <span class="file-card doc">
            <span class="file-content">
                <span class="file-name">CoCo-Community用户协议</span>
            </span>
        </span>
    </span>
</router-link>

<router-link :to="{ name: 'PrivacyPolicy'}" class="file-link">
     <span class="file-list">
    <span class="file-card doc">
        <span class="file-content">
            <span class="file-name">CoCo-Community隐私协议</span>
        </span>
    </span>
    </span>
</router-link>
</template>

<script setup>
import { useHead } from '@vueuse/head'

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
</style>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: '404',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },
}
</script>