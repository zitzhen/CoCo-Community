<template>
    <div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
            </div>
        </nav>
    </div>
<div style="height: 90px;"></div>
<div class="login-container">
  <div class="login-box">
    <h2 class="login-title">Hello,欢迎来到CoCo-Community，请使用Github登录</h2>
    <a
      href="https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID"
      class="github-button"
    >
      使用 GitHub 登录
    </a>
    <div style="height: 13px;"></div>

    <router-link to="/agreement/useragreement">《用户协议》</router-link> <router-link to="/agreement/privacypolicy">《隐私政策》</router-link>
  </div>
</div>
</template>

<style>
/* 导航栏样式 */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 0 20px;
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
    color: #cc00ff;
    text-decoration: none;
}

.logo span {
    color: #000000;
}

.nav-menu {
    display: flex;
    list-style: none;
}

.nav-item {
    margin-left: 30px;
}

.nav-link {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.3s ease;
    position: relative;
    padding: 5px 0;
}

.nav-link:hover {
    color: #3498db;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3498db;
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

.hamburger {
    display: none;
    cursor: pointer;
}

.bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    background-color: #2c3e50;
    transition: all 0.3s ease;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 90px);
}

.login-box {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
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
}

.github-button:hover {
    background-color: #444c56;
}
@media screen and (max-width: 768px) {
  .hamburger {
      display: block;
  }
  
  .hamburger.active .bar:nth-child(2) {
      opacity: 0;
  }
  
  .hamburger.active .bar:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
  }
  
  .hamburger.active .bar:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
  }
  
  .nav-menu {
      position: fixed;
      left: -100%;
      top: 70px;
      flex-direction: column;
      background-color: white;
      width: 100%;
      text-align: center;
      transition: 0.3s;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
      padding: 20px 0;
  }
  
  .nav-menu.active {
      left: 0;
  }
  
  .nav-item {
      margin: 15px 0;
  }
}
</style>