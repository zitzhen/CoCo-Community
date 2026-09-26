<template>
  <footer class="site-footer">
    <div class="page-container site-footer-inner">
      <div class="footer-grid">
        <!-- 品牌简介 -->
        <div class="footer-brand">
          <div class="footer-brand-name">
            <span class="footer-brand-zit">ZIT</span><span>-CoCo-Community</span>
          </div>
          <p class="footer-brand-desc">
            面向开发者的开源资源与工具社区，浏览、搜索、下载控件并获取源码。
          </p>
        </div>

        <!-- 社区 -->
        <nav class="footer-col" aria-label="社区链接">
          <h2 class="footer-col-title">社区</h2>
          <ul>
            <li><NuxtLink to="/issues">Issues</NuxtLink></li>
            <li><NuxtLink to="/safe">安全</NuxtLink></li>
            <li><NuxtLink to="/user">用户数据</NuxtLink></li>
            <li><NuxtLink to="/agreement/useragreement">用户协议</NuxtLink></li>
            <li><NuxtLink to="/agreement/privacypolicy">隐私政策</NuxtLink></li>
          </ul>
        </nav>

        <!-- 开源 -->
        <nav class="footer-col" aria-label="开源链接">
          <h2 class="footer-col-title">开源</h2>
          <ul>
            <li><a href="https://github.com/zitzhen/CoCo-Community" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://gitee.com/zitzhen/CoCo-Community" target="_blank" rel="noopener noreferrer">Gitee</a></li>
            <li><a href="https://gitlab.com/zitzhen/CoCo-Community" target="_blank" rel="noopener noreferrer">GitLab</a></li>
            <li><a href="https://gitcode.com/zitzhen/CoCo-Community" target="_blank" rel="noopener noreferrer">Gitcode</a></li>
            <li><NuxtLink to="/agreement/license">开源协议</NuxtLink></li>
          </ul>
        </nav>

        <!-- 支持与社交 -->
        <nav class="footer-col" aria-label="支持与社交">
          <h2 class="footer-col-title">支持与社交</h2>
          <ul>
            <li><NuxtLink to="/tipping/">打赏支持</NuxtLink></li>
            <li><a href="https://qm.qq.com/cgi-bin/qm/qr?k=966509561" target="_blank" rel="noopener noreferrer">QQ 群（966509561）</a></li>
            <li><a href="https://discord.gg/ptcgnKJ6xN" target="_blank" rel="noopener noreferrer">Discord</a></li>
            <li><a href="https://t.me/+XykN0Q77R2dlZTc1" target="_blank" rel="noopener noreferrer">Telegram</a></li>
          </ul>
        </nav>
      </div>

      <div class="footer-bottom">
        <span>&copy; 2025 ZIT-CoCo-Community</span>
      </div>
    </div>
  </footer>
</template>

<style>
@import '@/assets/css/site-footer.css';
</style>
