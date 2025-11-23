<template>
<div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo" @click="gohome">ZIT<span>-CoCo-Community</span></div>
                <div class="user-info" @click="gome">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
        
        <div style="height: 90px;"></div>
        
        <div class="container">
            <div class="essays-intro">
                <h1>社区文章</h1>
                <p>探索CoCo社区的精彩文章和经验分享</p>
                <button class="view-all-btn" @click="goToAllEssays">查看所有文章</button>
            </div>
        </div>
        
        <footer>
            <div class="container">
                <p>© 2025 小圳社区 - CoCo-Community | 所有文章仅供学习交流使用</p>
            </div>
        </footer>
</div>
</template>

<script>
import { useHead } from '@vueuse/head'
import { checkLoginStatus } from '@/script/login'

useHead({
  title: () => `文章|ZIT-CoCo-Community`,
})

export default{
    name:'EssayIndex',
    data(){
        return{
            avatar:"/images/user.png",
            username: "未登录用户" 
        }
    },
    methods: {
        gome() {
            this.$router.push('/me');
        },
        gohome() {
            this.$router.push('/');
        },
        goToAllEssays() {
            this.$router.push('/essay/all');
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
        }
    }).catch((err) => {
        console.error("登录检查失败：", err);
        this.username = '登录信息检查失败'; 
    });
    }
}
</script>

<style scoped>
@import "@/assets/css/style.css";
@import "@/assets/css/Navigation-bar.css";

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.essays-intro h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 15px;
}

.essays-intro p {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 30px;
}

.view-all-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.view-all-btn:hover {
    background-color: var(--secondary-color);
}

footer {
    margin-top: 60px;
    padding: 20px 0;
    background-color: #f8f9fa;
    text-align: center;
    color: #7f8c8d;
}

@media screen and (max-width: 768px) {
    .essays-intro h1 {
        font-size: 2rem;
    }
    
    .essays-intro p {
        font-size: 1rem;
    }
}
</style>