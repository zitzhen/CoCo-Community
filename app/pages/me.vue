<template>
  <div class="page-shell py-14 sm:py-20">
    <div v-if="auth.loading && !auth.initialized" class="mx-auto max-w-4xl">
      <USkeleton class="h-56 rounded-3xl" />
    </div>

    <div v-else-if="auth.user" class="mx-auto max-w-4xl">
      <section class="surface overflow-hidden rounded-3xl">
        <div class="h-32 bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500" />
        <div class="px-6 pb-8 sm:px-10">
          <UAvatar :src="auth.user.avatar_url" :alt="auth.user.login" class="-mt-14 size-28 ring-4 ring-white dark:ring-slate-900" />
          <div class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 class="text-3xl font-black">{{ auth.user.name || auth.user.login }}</h1>
              <p class="mt-1 text-slate-400">@{{ auth.user.login }}</p>
            </div>
            <div class="flex gap-3">
              <UButton :to="`/user/${auth.user.login}`" color="neutral" variant="outline">公开主页</UButton>
              <UButton to="/new-control" icon="i-lucide-package-plus">发布控件</UButton>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-8 grid gap-5 sm:grid-cols-3">
        <div v-for="item in quickLinks" :key="item.title" class="surface rounded-2xl p-5">
          <UIcon :name="item.icon" class="size-5 text-blue-500" />
          <h2 class="mt-4 font-bold">{{ item.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ item.description }}</p>
        </div>
      </section>

      <section class="surface mt-8 rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-bold">账户管理</h2>
            <p class="mt-1 text-sm text-slate-400">账户身份由 GitHub OAuth 提供。</p>
          </div>
          <UButton color="error" variant="soft" icon="i-lucide-log-out" @click="auth.logout()">退出登录</UButton>
        </div>
      </section>
    </div>

    <div v-else class="mx-auto max-w-lg rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
      <UIcon name="i-lucide-lock-keyhole" class="mx-auto size-9 text-slate-400" />
      <h1 class="mt-5 text-2xl font-bold">需要登录</h1>
      <p class="mt-3 text-slate-500">登录后管理你的控件与开发者资料。</p>
      <UButton to="/login" class="mt-7" icon="i-simple-icons-github">GitHub 登录</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()

onMounted(() => {
  if (!auth.initialized) void auth.fetchMe()
})

const quickLinks = [
  { title: '我的控件', description: '查看你已经发布到社区的全部控件。', icon: 'i-lucide-package' },
  { title: '发布中心', description: '按照贡献流程提交新控件或版本。', icon: 'i-lucide-upload-cloud' },
  { title: 'GitHub 资料', description: '头像和基础身份信息自动同步自 GitHub。', icon: 'i-simple-icons-github' }
]

useSeoMeta({ title: '个人中心', robots: 'noindex, nofollow' })
</script>
