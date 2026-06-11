export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint'
  ],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'theme-color', content: '#0f172a' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://avatars.githubusercontent.com' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://cc.zitzhen.cn',
      githubClientId: ''
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/controls': { prerender: true },
    '/control/**': { isr: 3600 },
    '/user/**': { ssr: true },
    '/users': { ssr: true },
    '/me': { ssr: false },
    '/new-control': { ssr: false },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true }
  },
  compatibilityDate: '2026-01-01',
  nitro: {
    preset: 'cloudflare-pages'
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  eslint: {
    config: {
      stylistic: true
    }
  },
})
