import fs from 'node:fs'
import { resolve } from 'node:path'

const isDevelopment = process.env.NODE_ENV !== 'production'
const keyPath = resolve('./coco-community.test-key.pem')
const certPath = resolve('./coco-community-test.pem')
const hasDevelopmentCertificate = fs.existsSync(keyPath) && fs.existsSync(certPath)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: isDevelopment },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },

  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
    '~/assets/css/dark.css'
  ],

  alias: {
    '~src': resolve('./app')
  },

  devServer: {
    host: process.env.NUXT_HOST || 'coco-community.test',
    port: Number(process.env.NUXT_PORT || 5173),
    ...(isDevelopment && hasDevelopmentCertificate
      ? {
          https: {
            key: fs.readFileSync(keyPath, 'utf8'),
            cert: fs.readFileSync(certPath, 'utf8')
          }
        }
      : {})
  },

  vite: {
    ssr: {
      noExternal: ['marked']
    },
    server: {
      hmr: {
        host: process.env.NUXT_HMR_HOST || 'coco-community.test',
        port: Number(process.env.NUXT_HMR_PORT || 5173)
      }
    },
    build: {
      assetsDir: 'assets',
      rollupOptions: {
        output: { manualChunks: undefined }
      }
    }
  }
})
