<template>
  <UApp>
    <div class="grid min-h-screen place-items-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div>
        <p class="font-mono text-sm text-blue-500">{{ error.statusCode }}</p>
        <h1 class="mt-4 text-4xl font-black tracking-tight">{{ error.statusCode === 404 ? '页面未找到' : '页面暂时不可用' }}</h1>
        <p class="mt-4 text-slate-500">{{ error.statusMessage || '请稍后重试。' }}</p>
        <UButton class="mt-8" @click="handleError">返回首页</UButton>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const handleError = () => clearError({ redirect: '/' })
</script>
