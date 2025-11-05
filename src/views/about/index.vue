<template>
<div id="app">
        <nav class="navbar">
            <div class="nav-container">
                <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
                <div class="user-info" @click="gome">
                    <img :src="avatar" alt="用户头像" class="user-avatar">
                    <div class="user-name">{{ username }}</div>
                </div>
            </div>
        </nav>
</div>
<div style="height: 65px;"></div>
    <div class="card-about">
        <h1 style="font-size: 35px;">关于我们</h1>
        <p>欢迎来到CoCo-Community，CoCo-Community是附属于ZIT小圳创科工作室的产品。旨在补充第三方社区的不足。</p>
    </div>
    <br></br>
    <div class="card-about" >
        <h2 style="font-size: 30px;">CoCo-Community开发者列表</h2>
        <a>- 刘小圳<img src="https://github-readme-stats.vercel.app/api?username=Iamliuxiaozhen" ></img></a>
    </div>
    <br></br>
    <div class="card-about">
        <h2 style="font-size: 30px;">我们的社交频道</h2>
        <a href="https://discord.gg/CvT5R8ew">Discord</a>
        <br></br>
        <a href="https://qm.qq.com/cgi-bin/qm/qr?k=966509561">QQ</a>
        <p></p>
    </div>
</template>

<style>
@import url(@/assets/css/Navigation-bar.css);

.card-about{
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    text-align: left;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    box-sizing: border-box;
}
</style>

<script>
import { checkLoginStatus } from '@/script/login';

export default {
  name: 'Home',
  data() {
    return {
      avatar:"/images/user.png",
      username:"未登录用户",
    }
  },methods:{
    gome() {
      this.$router.push('/me') // 跳转到我的页面
    }
  },mounted(){
    checkLoginStatus().then((logininformation) => {
    if (!logininformation || !logininformation.authenticated) {
      this.username = '未登录用户';
      this.avatar = '/images/user.png';
    } else {
      this.username = logininformation.user.name || logininformation.user.login;
      this.avatar = logininformation.user.avatar_url || '/images/user.png';
    }
  }).catch((err) => {isVisible
    console.error("登录检查失败：", err);
    this.username = '登录信息检查失败';
  });
  }}

</script>