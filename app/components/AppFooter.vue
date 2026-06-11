<template>
  <footer class="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div class="page-shell py-14">
      <div class="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <BrandLogo />
          <p class="mt-5 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            由开发者共同维护的 CoCo 开源控件生态。发现灵感，分享代码，让创作更简单。
          </p>
          <div class="mt-5 flex gap-2">
            <UButton
              v-for="social in socials"
              :key="social.label"
              :to="social.to"
              target="_blank"
              color="neutral"
              variant="soft"
              :icon="social.icon"
              :aria-label="social.label"
            />
          </div>
        </div>
        <div v-for="group in linkGroups" :key="group.label">
          <h2 class="text-sm font-semibold text-slate-950 dark:text-white">{{ group.label }}</h2>
          <ul class="mt-4 space-y-3">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink :to="link.to" class="text-sm text-slate-500 transition hover:text-blue-500 dark:text-slate-400">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-12 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <span>© {{ new Date().getFullYear() }} CoCo-Community. Open source with care.</span>
        <span>Powered by Nuxt and Cloudflare</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  { label: 'GitHub', to: 'https://github.com/zitzhen/CoCo-Community', icon: 'i-simple-icons-github' },
  { label: 'Discord', to: 'https://discord.gg/ptcgnKJ6xN', icon: 'i-simple-icons-discord' },
  { label: 'Telegram', to: 'https://t.me/+XykN0Q77R2dlZTc1', icon: 'i-simple-icons-telegram' }
]

const linkGroups = [
  {
    label: '探索',
    links: [
      { label: '全部控件', to: '/controls' },
      { label: '开发者', to: '/users' },
      { label: '发布控件', to: '/new-control' }
    ]
  },
  {
    label: '资源',
    links: [
      { label: '文档', to: '/about' },
      { label: '安全中心', to: '/safe' },
      { label: 'GitHub Issues', to: 'https://github.com/zitzhen/CoCo-Community/issues' }
    ]
  },
  {
    label: '条款',
    links: [
      { label: '隐私政策', to: '/agreement/privacypolicy' },
      { label: '用户协议', to: '/agreement/useragreement' },
      { label: '开源协议', to: '/agreement/license' }
    ]
  }
]
</script>
