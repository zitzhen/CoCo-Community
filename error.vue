<template>
  <NuxtLayout>
    <div class="a_404_container">
      <div class="a_404_error-content">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle" />
        </div>
        <h2 class="error-title">{{ error?.statusCode || 404 }} - 页面未找到</h2>
        <p class="a_404_error-message">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <button type="button" class="error-home-button" @click="handleError">
          返回首页
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  title: '页面未找到 | CoCo-Community',
  meta: [
    {
      name: 'description',
      content: '抱歉，您访问的页面不存在或已被移除。'
    }
  ]
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style>
@import url('~/assets/style/404/style.css');

.error-home-button {
  border: 0;
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  background: #3498db;
  color: #fff;
  cursor: pointer;
}
</style>
