import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/index.vue') },
  { path: '/agreement/useragreement', name: 'UserAgreement', component: () => import('@/views/agreement/useragreement/index.vue') },
  { path: '/agreement/privacypolicy', name: 'PrivacyPolicy', component: () => import('@/views/agreement/privacypolicy/index.vue') },
  { path: '/agreement', name: 'Agreement', component: () => import('@/views/agreement/index.vue') },
  { path: '/tipping', name: 'Tipping', component: () => import('@/views/tipping/index.vue') },
  { path: '/user/:id', name: 'User', component: () => import('@/views/user/index.vue') },
  { path: '/user', name: 'UserError', component: () => import('@/views/user/No-parameters.vue') },
  { path: '/control/:id', name: 'Control', component: () => import('@/views/control/index.vue') },
  { path: '/control', name: 'ControlError', component: () => import('@/views/user/No-parameters.vue') },
  { path: '/essay/all/:id', name: 'DevEssay', component: () => import('@/views/essay/all/dev.vue') },
  { path: '/essay/all', name: 'ErrorEssay', component: () => import('@/views/user/No-parameters.vue') },
  { path: '/essay', name: 'Essay', component: () => import('@/views/essay/index.vue') },
  { path: '/safe', name: 'Safe', component: () => import('@/views/safe/index.vue') },
  { path: '/new-control', name: 'NewControl', component: () => import('@/views/essay/all/dev.vue') }
];

// 在 Cloudflare Pages 环境中使用正确的 base
const base = '/';

const router = createRouter({
  history: createWebHistory(base),
  routes
});

// 添加路由守卫处理 Cloudflare Pages SPA 回退
router.beforeEach((to, from, next) => {
  // 如果是根路径，直接通过
  if (to.path === '/') {
    next();
    return;
  }

  // 检查目标路由是否存在
  const matched = router.resolve(to.path);

  if (matched.matched.length > 0) {
    next();
  } else {
    // 如果路由不存在，重定向到首页
    next({ name: 'Home' });
  }
});

// 添加全局后置钩子，用于处理页面标题和SEO
router.afterEach((to, from) => {
  // 设置默认标题
  document.title = 'ZIT-CoCo-Community';
  
  // 移除可能存在的错误SEO标签
  const existingMeta = document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]');
  existingMeta.forEach(meta => meta.remove());
});

export default router;