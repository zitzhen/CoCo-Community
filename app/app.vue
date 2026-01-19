<template>
  <div>
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
        <div class="user-info" @click="gome">
          <img :src="avatar" alt="用户头像" class="user-avatar">
          <div class="user-name">{{ username }}</div>
        </div>
      </div>
    </nav>

    <!-- 导航间距线 -->
    <div style="height: 70px;"></div>

    <!-- Nuxt 页面内容 -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <!-- 主要链接区域 -->
        <div class="footer-main">
          <div class="footer-section">
            <h4 class="footer-section-title">CoCo-Community</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/issues">Issues</NuxtLink></li>
              <li><NuxtLink to="/safe">安全</NuxtLink></li>
              <li><NuxtLink to="/user">用户数据</NuxtLink></li>
              <li><NuxtLink to="/agreement/useragreement">用户协议</NuxtLink></li>
              <li><NuxtLink to="/agreement/privacypolicy">隐私政策</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-section-title">开源</h4>
            <ul class="footer-links">
              <li><a href="https://github.com/zitzhen/CoCo-Community">Github</a></li>
              <li><a href="https://gitee.com/zitzhen/CoCo-Community">Gitee</a></li>
              <li><a href="https://gitlab.com/zitzhen/CoCo-Community">GitLab</a></li>
              <li><a href="https://gitcode.com/zitzhen/CoCo-Community">Gitcode</a></li>
              <li><NuxtLink to="/agreement/license">开源协议</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-section-title">支持我们</h4>
            <ul class="footer-links">
              <li><NuxtLink to="/tipping/">打赏</NuxtLink></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-section-title">我们的社交频道</h4>
            <ul class="footer-links">
              <li><a href="https://qm.qq.com/cgi-bin/qm/qr?k=966509561">QQ(966509561)</a></li>
              <li><a href="https://discord.gg/ptcgnKJ6xN">Discord</a></li>
              <li><a href="https://t.me/+XykN0Q77R2dlZTc1">Telegram</a></li>
            </ul>
          </div>
        </div>

        <!-- 底部信息区域 -->
        <div class="footer-bottom">
          <!-- 版权信息 -->
          <div class="footer-copyright">
            &copy; 2025 CoCo-Community
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { checkLoginStatus } from '~src/script/login';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  data() {
    return {
      avatar: "/images/user.png",
      username: "未登录用户",
    }
  },
  methods: {
    gome() {
      this.$router.push('/me') // 跳转到我的
    }
  },
  mounted() {
    const domain = window.location.hostname;
    if (!domain.includes("test") && !domain.includes("127.0.0.1") && !domain.includes("localhost")) {
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
    } else {
      this.username = '开发环境';
      this.avatar = '/images/dev.png';
    }
  }
}
</script>

<style scoped>
/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #24292e;
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.logo span {
  color: #58a6ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #58a6ff;
}

.user-name {
  font-size: 14px;
  color: #f0f6fc;
}

/* 页脚样式 */
.footer {
  background-color: #24292e;
  color: #586069;
  padding: 40px 0 20px;
  margin-top: 60px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 主要链接区域 */
.footer-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #30363d;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #f0f6fc;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #8b949e;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #58a6ff;
}

/* 底部信息区域 */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
}

.footer-copyright {
  font-size: 14px;
  color: #8b949e;
  text-align: center;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-main {
    grid-template-columns: 1fr;
  }
}
</style>