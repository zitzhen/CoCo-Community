<template>
  <div class="relative grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden px-4 py-20">
    <div class="soft-grid absolute inset-0" />
    <div class="absolute left-1/3 top-1/4 size-72 rounded-full bg-blue-500/15 blur-3xl" />
    <div class="absolute right-1/4 top-1/3 size-72 rounded-full bg-violet-500/15 blur-3xl" />

    <div class="surface relative w-full max-w-md rounded-3xl p-8 sm:p-10">
      <div class="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
        <UIcon name="i-simple-icons-github" class="size-7" />
      </div>
      <h1 class="mt-7 text-center text-2xl font-black tracking-tight">加入 CoCo-Community</h1>
      <p class="mt-3 text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
        使用 GitHub 开发者身份登录，发布控件、参与社区并管理你的作品。
      </p>
      <UButton :to="oauthUrl" external block size="xl" color="neutral" icon="i-simple-icons-github" class="mt-8">
        使用 GitHub 登录
      </UButton>
      <p class="mt-5 text-center text-xs leading-5 text-slate-400">
        登录即表示你同意
        <NuxtLink to="/agreement/useragreement" class="text-blue-500">用户协议</NuxtLink>
        与
        <NuxtLink to="/agreement/privacypolicy" class="text-blue-500">隐私政策</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const config = useRuntimeConfig()
const clientId = config.public.githubClientId || 'Ov23lii4E31EzV9VMW7B'
const redirectUri = `${config.public.siteUrl}/auth/github?client=web`
const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`

watchEffect(() => {
  if (auth.isAuthenticated) void navigateTo('/me')
})

useSeoMeta({ title: 'GitHub 登录', robots: 'noindex, nofollow' })
</script>
