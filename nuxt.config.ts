import fs from 'fs'
import { resolve } from 'path'

const useHttps = process.env.NODE_ENV !== 'production'
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('useHttps:', useHttps)

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 路径别名
  alias: {
    '@': resolve(__dirname, 'app')
  },
  
  // Nuxt 4 开发服务器配置
  devServer: {
    host: 'coco-community.test',
    port: 5173,
    ...(useHttps ? {
      https: {
        key: fs.readFileSync(resolve(__dirname, './coco-community.test-key.pem'), 'utf8'),
        cert: fs.readFileSync(resolve(__dirname, './coco-community-test.pem'), 'utf8'),
      }
    } : {})
  },
  
  vite: {
    server: {
      hmr: {
        host: 'coco-community.test',
        port: 5173
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