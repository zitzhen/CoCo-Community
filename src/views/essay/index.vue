<template>
<div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
        
        <div style="height: 90px;"></div>
</div>
</template>


<style>
@import url(@/assets/css/Navigation-bar.css);
</style>

<script>
import { useHead } from '@vueuse/head'
import { checkLoginStatus } from '@/script/login'

useHead({
  title: () => `登录|ZIT-CoCo-Community`,
})

export default{
    name:'login',
    data(){
        return{
            avatar:"/images/user.png",
            username: "未登录用户" 
        }
    },
    async mounted(){
        checkLoginStatus().then((logininformation) => {
        if (!logininformation || !logininformation.authenticated) {
        this.username = '未登录用户';
        this.avatar = '/images/user.png';
        } else {
        this.username = logininformation.user.name || logininformation.user.login;
        this.avatar = logininformation.user.avatar_url || '/images/user.png';
        this.$router.push({ path: '/me' });
        }
    }).catch((err) => {
        console.error("登录检查失败：", err);
        this.username = '登录信息检查失败'; 
    });
    }}
</script>