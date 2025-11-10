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
        
        <div class="login-container">
            <div class="login-box">
                <h2 class="login-title">{{ Welcome_text }}</h2>
                <a
                    href="https://github.com/login/oauth/authorize?client_id=Ov23lii4E31EzV9VMW7B&redirect_uri=https://cc.zitzhen.cn/auth/github"
                    class="github-button"
                >
                    使用 GitHub 登录
                </a>
                <div style="height: 13px;"></div>

                <router-link to="/agreement/useragreement">《用户协议》</router-link> 
                <router-link to="/agreement/privacypolicy">《隐私政策》</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { useHead } from '@vueuse/head'

useHead({
  title: () => `登录|ZIT-CoCo-Community`,
})

export default{
    name:'login',
    data(){
        return{
            avatar:"/images/user.png",
            Welcome_text:"Hello,欢迎来到CoCo-Community，请使用GitHub登录",
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
    }
}
</script>

<style>
@import url(@/assets/css/Navigation-bar.css);
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
}


/* 登录容器样式 */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 90px);
    padding: 20px;
}

.login-box {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.login-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
}

.github-button {
    display: inline-block;
    background-color: #24292e;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s ease;
    width: 100%;
    margin-bottom: 10px;
}

.github-button:hover {
    background-color: #444c56;
}

/* 协议链接样式 */
.login-box a {
    color: #3498db;
    text-decoration: none;
    margin: 0 5px;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.login-box a:hover {
    color: #2980b9;
    text-decoration: underline;
}
</style>