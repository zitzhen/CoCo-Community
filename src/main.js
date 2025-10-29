import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 @vueuse/head
import { createHead } from '@vueuse/head'

const app = createApp(App)

// 创建 head 实例
const head = createHead()

// 挂载插件
app.use(router)
app.use(head)

app.mount('#app')
