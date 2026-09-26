<template>
  <header class="site-header">
    <div class="site-header-inner page-container">
      <!-- 左：品牌 -->
      <NuxtLink to="/" class="brand" aria-label="ZIT-CoCo-Community 首页">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5 7L4 12l4.5 5M15.5 7L20 12l-4.5 5M13.5 5l-3 14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="brand-name">ZIT<span class="brand-name-accent">-CoCo-Community</span></span>
      </NuxtLink>

      <!-- 中：导航 -->
      <nav class="site-nav" aria-label="主导航">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to + item.hash"
          :to="item.hash ? `${item.to}${item.hash}` : item.to"
          class="site-nav-link"
          :class="{ active: isActive(item) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- 右：操作 -->
      <div class="site-actions">
        <button
          ref="searchTriggerRef"
          type="button"
          class="search-trigger"
          @click="openPalette"
          aria-label="搜索资源，快捷键 Ctrl K"
        >
          <i class="fas fa-search" aria-hidden="true"></i>
          <span class="search-trigger-text">搜索资源…</span>
          <kbd class="kbd search-trigger-kbd">⌃K</kbd>
        </button>

        <a
          class="btn btn-icon btn-ghost"
          href="https://github.com/zitzhen/CoCo-Community"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub 仓库（新窗口打开）"
        >
          <i class="fab fa-github" aria-hidden="true"></i>
        </a>

        <button
          type="button"
          class="user-chip"
          @click="gome"
          :aria-label="`用户：${username}，进入个人中心`"
        >
          <img :src="avatar" alt="" class="user-chip-avatar" />
        </button>

        <button
          type="button"
          class="btn btn-icon btn-ghost menu-toggle"
          @click="toggleMobile"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          :aria-label="mobileOpen ? '关闭导航菜单' : '打开导航菜单'"
        >
          <i :class="mobileOpen ? 'fas fa-times' : 'fas fa-bars'" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" id="mobile-menu" v-show="mobileOpen">
      <div class="page-container mobile-menu-inner">
        <nav aria-label="移动端主导航">
          <NuxtLink
            v-for="item in navItems"
            :key="`m-${item.to}${item.hash}`"
            :to="item.hash ? `${item.to}${item.hash}` : item.to"
            class="mobile-nav-link"
            :class="{ active: isActive(item) }"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <button type="button" class="mobile-user" @click="gome">
          <img :src="avatar" alt="" class="mobile-user-avatar" />
          <span>{{ username }}</span>
          <i class="fas fa-chevron-right mobile-user-arrow" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { checkLoginStatus } from '@/script/login'

const navItems = [
  { label: '首页', to: '/', hash: '', match: 'home' },
  { label: '资源', to: '/', hash: '#resources', match: 'resources' },
  { label: '文章', to: '/essay', hash: '', match: 'prefix' },
  { label: '社区', to: '/issues', hash: '', match: 'prefix' },
  { label: '关于', to: '/about', hash: '', match: 'exact' },
]

const route = useRoute()
const router = useRouter()

function isActive(item) {
  const path = route.path
  if (item.match === 'home') return path === '/' && !route.hash
  if (item.match === 'resources') return path === '/' && route.hash === '#resources'
  if (item.match === 'exact') return path === item.to
  return path.startsWith(item.to)
}

// -------- 用户信息 --------
const avatar = ref('/images/user.png')
const username = ref('未登录用户')

// -------- Command Palette 共享开关 --------
const paletteOpen = useState('palette-open', () => false)
const searchTriggerRef = ref(null)
let lastTrigger = null

function openPalette(event) {
  lastTrigger = event?.currentTarget || searchTriggerRef.value
  paletteOpen.value = true
}

// Palette 关闭后归还焦点（由 Palette 组件设置 palette-open=false 后触发）
watch(paletteOpen, (open) => {
  if (!open && lastTrigger) {
    lastTrigger.focus?.()
    lastTrigger = null
  }
})

function gome() {
  mobileOpen.value = false
  router.push('/me')
}

// -------- 移动端菜单 --------
const mobileOpen = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function onKeydown(event) {
  if (event.key === 'Escape' && mobileOpen.value) mobileOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)

  const domain = window.location.hostname
  if (
    !domain.includes('test') &&
    !domain.includes('127.0.0.1') &&
    !domain.includes('localhost')
  ) {
    checkLoginStatus()
      .then((logininformation) => {
        if (!logininformation || !logininformation.authenticated) {
          username.value = '未登录用户'
          avatar.value = '/images/user.png'
        } else {
          username.value = logininformation.user.name || logininformation.user.login
          avatar.value = logininformation.user.avatar_url || '/images/user.png'
        }
      })
      .catch(() => {
        username.value = '未登录用户'
      })
  } else {
    username.value = '开发环境'
    avatar.value = '/images/dev.png'
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})

// 路由变化后关闭移动菜单
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)
</script>

<style>
@import '@/assets/css/app-header.css';
</style>
