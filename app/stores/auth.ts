import type { AuthResponse, AuthUser } from '~/types/community'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(user.value))

  async function fetchMe() {
    if (loading.value) return
    loading.value = true
    try {
      const response = await $fetch<AuthResponse>('/api/me')
      user.value = response.authenticated ? response.user ?? null : null
    }
    catch {
      user.value = null
    }
    finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function logout() {
    await $fetch('/api/logout')
    user.value = null
    await navigateTo('/')
  }

  return { user, loading, initialized, isAuthenticated, fetchMe, logout }
})
