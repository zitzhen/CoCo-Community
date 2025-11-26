import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { resolve } from 'path'

const useHttps = process.env.NODE_ENV !== 'production'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: useHttps
    ? {
        https: {
          key: fs.readFileSync('./coco-community.test-key.pem'),
          cert: fs.readFileSync('./coco-community-test.pem'),
        },
        host: 'coco-community.test', 
        port: 5173,
        open: true, //自动打开浏览器
      }
    : {
        host: 'coco-community.test',
        port: 5173,
      },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})