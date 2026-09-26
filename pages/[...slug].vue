<template>
  <div class="a_404_container">
    <div class="a_404_error-content">
      <div class="error-icon">
        <i class="fas fa-compass" aria-hidden="true"></i>
      </div>
      <h1 class="error-title">404 · 页面未找到</h1>
      <p class="a_404_error-message">
        抱歉，您访问的页面不存在或已被移除。<br />
        请检查 URL 地址，或返回首页继续浏览资源。
      </p>
      <NuxtLink to="/" class="btn btn-primary">
        <i class="fas fa-house" aria-hidden="true"></i>
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '404页面未找到|CoCo-Community',
  meta: [
    {
      name: 'description',
      content:
        '抱歉，您访问的页面不存在或已被移除。可能是URL地址输入错误，或者页面已被删除。',
    },
  ],
})
</script>

<style scoped>
.a_404_container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56vh;
  padding: var(--space-8) var(--space-4);
}

.a_404_error-content {
  width: 100%;
  max-width: 440px;
  padding: var(--space-7) var(--space-6);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background-color: var(--card);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.error-icon {
  font-size: 38px;
  color: #ef4444;
}

.error-title {
  margin-top: var(--space-4);
  font-size: var(--font-h2);
  font-weight: 700;
  letter-spacing: -0.3px;
}

.a_404_error-message {
  margin: var(--space-3) 0 var(--space-5);
  color: var(--muted);
  font-size: var(--font-body);
  line-height: 1.7;
}
</style>
