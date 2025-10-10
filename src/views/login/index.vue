<template>
    <div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info">
                    <img src="s.githubusercontent.com/u/149680880?v=4" alt="用户头像" class="user-avatar">
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
export default{
    name:'login',
    data(){
        return{
            Welcome_text:"Hello,欢迎来到CoCo-Community，请使用GitHub登录",
            username: "未登录用户" 
        }
    },
    async mounted(){
        // 这里可以添加获取用户信息的逻辑
    }
}
</script>

<style>
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

/* 导航栏样式 */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 0 20px;
    transition: all 0.3s ease;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    text-decoration: none;
}

.logo span {
    color: #3498db;
}

/* 用户信息样式 */
.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px 15px;
    border-radius: 30px;
    transition: all 0.3s ease;
}

.user-info:hover {
    background-color: rgba(52, 152, 219, 0.1);
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #3498db;
    margin-right: 12px;
    transition: all 0.3s ease;
}

.user-info:hover .user-avatar {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.4);
}

.user-name {
    font-weight: 500;
    color: #2c3e50;
    font-size: 1rem;
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
    .nav-container {
        height: 60px;
    }
    
    .logo {
        font-size: 1.5rem;
    }
    
    .user-name {
        display: none;
    }
    
    .user-avatar {
        margin-right: 0;
        width: 35px;
        height: 35px;
    }
    
    .navbar {
        padding: 0 15px;
    }
    
    .login-box {
        padding: 30px 20px;
        margin: 0 10px;
    }
    
    .login-title {
        font-size: 1.3rem;
    }
}

/* 滚动效果 */
.navbar.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    height: 60px;
}

.navbar.scrolled .nav-container {
    height: 60px;
}
</style>