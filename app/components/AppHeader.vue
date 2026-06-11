<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/72">
    <div class="page-shell flex h-16 items-center justify-between gap-4">
      <BrandLogo />

      <nav class="hidden items-center gap-1 md:flex" aria-label="主导航">
        <UButton
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          color="neutral"
          variant="ghost"
          size="sm"
        >
          {{ item.label }}
        </UButton>
      </nav>

      <div class="flex items-center gap-1.5">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-search"
          aria-label="搜索控件"
          to="/controls"
        />
        <UButton
          color="neutral"
          variant="ghost"
          :icon="colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          aria-label="切换配色模式"
          @click="toggleColorMode"
        />

        <UDropdownMenu v-if="auth.user" :items="userMenu">
          <UButton color="neutral" variant="ghost" class="ml-1 rounded-full p-1">
            <UAvatar :src="auth.user.avatar_url" :alt="auth.user.login" size="sm" />
          </UButton>
        </UDropdownMenu>
        <UButton
          v-else
          to="/login"
          icon="i-simple-icons-github"
          color="neutral"
          variant="solid"
          size="sm"
          class="ml-1"
        >
          <span class="hidden sm:inline">GitHub 登录</span>
        </UButton>

        <UDropdownMenu :items="mobileMenu" class="md:hidden">
          <UButton color="neutral" variant="ghost" icon="i-lucide-menu" aria-label="打开菜单" />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const auth = useAuthStore()

const navigation = [
  { label: '发现控件', to: '/controls' },
  { label: '开发者', to: '/users' },
  { label: '社区', to: '/about' },
  { label: '安全', to: '/safe' }
]

const mobileMenu = computed(() => navigation.map(item => ({
  label: item.label,
  icon: 'i-lucide-arrow-up-right',
  to: item.to
})))

const userMenu = computed(() => [[
  { label: auth.user?.login ?? '个人中心', icon: 'i-lucide-user', to: '/me' },
  { label: '发布控件', icon: 'i-lucide-package-plus', to: '/new-control' }
], [
  { label: '退出登录', icon: 'i-lucide-log-out', onSelect: () => auth.logout() }
]])

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
