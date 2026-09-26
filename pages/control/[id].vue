<template>
  <div class="control-detail-page">
    <!-- 顶部加载条 -->
    <div v-if="loading" class="detail-loading" aria-hidden="true">
      <div class="detail-loading-bar"></div>
    </div>

    <!-- 错误 toast -->
    <Transition name="toast">
      <div v-if="errorVisibleSmall" class="detail-toast" role="alert">
        <i class="fas fa-circle-exclamation" aria-hidden="true"></i>
        <span class="detail-toast-message">{{ errorMessage }}</span>
        <button
          type="button"
          class="detail-toast-close"
          aria-label="关闭错误提示"
          @click="offError"
        >
          <i class="fas fa-xmark" aria-hidden="true"></i>
        </button>
      </div>
    </Transition>

    <div v-if="metaReady" class="page-container detail-container">
      <!-- 面包屑 -->
      <nav class="breadcrumb" aria-label="面包屑导航">
        <ol>
          <li><NuxtLink to="/">首页</NuxtLink></li>
          <li><NuxtLink to="/#resources">资源</NuxtLink></li>
          <li aria-current="page">{{ filename }}</li>
        </ol>
      </nav>

      <!-- 资源头部 -->
      <header class="resource-header">
        <div class="resource-header-icon" aria-hidden="true">
          <i aria-hidden="true" class="fas fa-file-code"></i>
        </div>
        <div class="resource-header-main">
          <h1 class="resource-header-name">{{ filename }}</h1>
          <div class="resource-header-meta">
            <NuxtLink
              v-if="metaAuthor"
              :to="`/user/${encodeURIComponent(metaAuthor)}`"
              class="resource-header-author"
            >
              <i class="fas fa-user-pen" aria-hidden="true"></i>
              {{ metaAuthor }}
            </NuxtLink>
            <span v-else class="resource-header-author">
              <i class="fas fa-user-pen" aria-hidden="true"></i>未知作者
            </span>
            <span class="pill">JSX</span>
            <span v-if="currentVersion" class="pill">{{ currentVersion }}</span>
          </div>
        </div>
        <div class="resource-header-actions">
          <button type="button" class="btn btn-primary" @click="handleDownload">
            <i class="fas fa-download" aria-hidden="true"></i>
            <span>下载</span>
          </button>
          <a :href="sourceUrl" class="btn btn-outline">
            <i class="fas fa-code" aria-hidden="true"></i>
            <span>源代码</span>
          </a>
        </div>
      </header>

      <!-- 双栏 -->
      <div class="detail-layout">
        <div class="detail-content">
          <section class="detail-section">
            <h2 class="detail-section-title">README</h2>
            <MarkdownView v-if="readme" :content="readme" />
            <p v-else class="detail-empty-text">未能找到 README.md</p>
          </section>

          <section v-if="versions.length" class="detail-section">
            <h2 class="detail-section-title">
              <i class="fas fa-clock-rotate-left" aria-hidden="true"></i>
              历史版本
            </h2>
            <ul class="detail-versions">
              <li v-for="version in versions" :key="version" class="detail-version">
                <i class="fas fa-tag detail-version-icon" aria-hidden="true"></i>
                {{ version }}
              </li>
            </ul>
          </section>
        </div>

        <aside class="detail-sidebar" aria-label="资源信息">
          <div class="sidebar-card sidebar-author">
            <img :src="avatar" alt="" class="sidebar-author-avatar" />
            <div class="sidebar-author-meta">
              <div class="sidebar-author-name">{{ authorName }}</div>
              <NuxtLink
                v-if="metaAuthor"
                :to="`/user/${encodeURIComponent(metaAuthor)}`"
                class="sidebar-author-login"
              >
                @{{ metaAuthor }}
              </NuxtLink>
            </div>
          </div>

          <dl class="sidebar-card sidebar-info">
            <div class="sidebar-info-row">
              <dt>文件大小</dt>
              <dd>{{ fileSize }} KiB</dd>
            </div>
            <div class="sidebar-info-row">
              <dt>文件类型</dt>
              <dd>JSX</dd>
            </div>
            <div v-if="currentVersion" class="sidebar-info-row">
              <dt>版本</dt>
              <dd>{{ currentVersion }}</dd>
            </div>
            <div class="sidebar-info-row">
              <dt>下载次数</dt>
              <dd>{{ downloads }}</dd>
            </div>
            <div class="sidebar-info-row">
              <dt>浏览次数</dt>
              <dd>{{ Pageviews }}</dd>
            </div>
          </dl>

          <a :href="sourceUrl" class="btn btn-outline btn-block">
            <i class="fas fa-code" aria-hidden="true"></i>
            查看源代码
          </a>
        </aside>
      </div>

      <!-- 同作者更多资源 -->
      <section v-if="related.length" class="detail-related">
        <h2 class="detail-related-title">
          更多来自 @{{ metaAuthor }} 的资源
        </h2>
        <div class="resource-grid detail-related-grid">
          <ResourceCard
            v-for="item in related"
            :key="item.name"
            v-bind="item"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import MarkdownView from '@/components/MarkdownView.vue'
import ResourceCard from '@/components/ResourceCard.vue'
import { checkLoginStatus } from '@/script/login'

// 控件资源存储在 Cloudflare R2，页面通过同源 /resource/ 路由由服务端读取
function resourceUrl(key) {
  return `/resource/${key.split('/').map(encodeURIComponent).join('/')}`
}

// -------- 响应式数据 --------
const loading = ref(true)
const metaReady = ref(false)
const errorVisibleSmall = ref(false)
const errorMessage = ref('')
const filename = ref('')
const fileSize = ref('—')
const versions = ref([])
const readme = ref('')
const avatar = ref('/images/user.png')
const authorName = ref('—')
const metaAuthor = ref('')
const currentVersion = ref('')
const downloads = ref(0)
const Pageviews = ref(0)
const downloadObjectUrl = ref('')
const sourceUrl = ref('')
let autoDownloadHandled = false

const route = useRoute()
const router = useRouter()

function applyMeta(meta) {
  metaAuthor.value = meta.author || ''
  currentVersion.value = meta.currentVersion || ''
  versions.value = Array.isArray(meta.versions) ? meta.versions : []
  fileSize.value = meta.size ? (meta.size / 1024).toFixed(2) : '未知'
  downloads.value = meta.downloads ?? 0
  Pageviews.value = meta.Pageviews ?? 0
  if (meta.author) authorName.value = meta.author
  sourceUrl.value = meta.controlKey ? resourceUrl(meta.controlKey) : ''
}

// -------- SSR：服务端获取控件元信息与 README，首屏 HTML 直接渲染 --------
const { data: ssrControl } = await useAsyncData(
  `control-${route.params.id}`,
  async () => {
    const id = route.params.id
    let meta
    try {
      meta = await $fetch('/api/control-meta', { query: { name: id } })
    } catch (err) {
      if (err?.statusCode === 404 || err?.status === 404) {
        return { notFound: true }
      }
      throw err
    }
    let readmeText = null
    try {
      readmeText = await $fetch(resourceUrl(`${id}/README.md`), {
        responseType: 'text',
      })
    } catch {}
    return { meta, readmeText }
  }
)

if (ssrControl.value?.notFound) {
  await navigateTo('/control/404', { replace: true })
} else if (ssrControl.value?.meta) {
  const meta = ssrControl.value.meta
  filename.value = route.params.id
  applyMeta(meta)
  readme.value = ssrControl.value.readmeText || ''
  metaReady.value = true
  loading.value = false
}

// -------- 同作者资源（共享 control-list 缓存） --------
const { data: controlData } = await useFetch('/api/control-list', {
  key: 'control-list',
})

const related = computed(() => {
  if (!metaAuthor.value) return []
  return (controlData.value?.list || [])
    .filter(
      (item) => item.author === metaAuthor.value && item.name !== filename.value
    )
    .slice(0, 4)
})

// -------- 方法 --------
function offError() {
  errorVisibleSmall.value = false
}

function throwError(msg) {
  errorMessage.value = msg
  errorVisibleSmall.value = true
  loading.value = false
}

async function loadClientData() {
  try {
    const id = route.params.id
    if (!id) {
      throwError('未检测到参数')
      return
    }
    if (!filename.value) filename.value = id

    // 1) 元信息：SSR 已取到则复用，否则兜底请求
    let meta = ssrControl.value?.meta
    if (!meta) {
      const metaRes = await fetch(
        `/api/control-meta?name=${encodeURIComponent(id)}`
      )
      if (metaRes.status === 404) {
        console.error('此控件不存在')
        router.push('/control/404')
        return
      }
      if (!metaRes.ok) {
        throw new Error(`获取控件信息失败（HTTP ${metaRes.status}）`)
      }
      meta = await metaRes.json()
      applyMeta(meta)
      metaReady.value = true
    }
    if (!meta.controlKey) throw new Error('未能找到该控件的控件文件')
    const controlUrl = resourceUrl(meta.controlKey)
    sourceUrl.value = controlUrl

    // 2) 下载用 blob（仅客户端；失败不阻断页面展示）
    if (!downloadObjectUrl.value) {
      try {
        const controlRes = await fetch(controlUrl)
        if (controlRes.ok) {
          const controlBlob = await controlRes.blob()
          downloadObjectUrl.value = URL.createObjectURL(controlBlob)
          if (!meta.size) {
            fileSize.value = (controlBlob.size / 1024).toFixed(2)
          }
        }
      } catch {}
    }

    // 卡片下载入口：?action=download，blob 就绪后自动触发一次
    if (
      route.query.action === 'download' &&
      !autoDownloadHandled &&
      downloadObjectUrl.value
    ) {
      autoDownloadHandled = true
      handleDownload()
    }

    // 3) README 兜底（SSR 未取到时）
    if (!ssrControl.value?.readmeText) {
      try {
        const readmeText = await $fetch(resourceUrl(`${id}/README.md`), {
          responseType: 'text',
        })
        readme.value = String(readmeText)
      } catch {
        readme.value = ''
      }
    }

    // 4) Github 作者信息（依赖登录态，客户端执行）
    if (meta.author) {
      try {
        const loginStatus = await checkLoginStatus()
        let creatorRes

        if (loginStatus && loginStatus.authenticated) {
          creatorRes = await fetch(
            `/api/github/user/?username=${encodeURIComponent(meta.author)}`
          )
        } else {
          creatorRes = await fetch(
            `https://api.github.com/users/${encodeURIComponent(meta.author)}`
          )
        }

        if (creatorRes.ok) {
          const creator = await creatorRes.json()
          avatar.value = creator.avatar_url || avatar.value
          authorName.value = creator.name || meta.author
        } else {
          authorName.value = meta.author
        }
      } catch {
        authorName.value = meta.author
      }
    }

    // 动态更新 SEO 信息
    useHead({
      title: `${filename.value} 控件 - ${authorName.value}|ZIT-CoCo-Community`,
      meta: [
        {
          name: 'description',
          content: `由 ${metaAuthor.value} 发布的自定义控件 ${filename.value}`,
        },
        { property: 'og:title', content: `${filename.value} 控件` },
        {
          property: 'og:description',
          content: `由 ${metaAuthor.value} 发布的自定义控件 ${filename.value}`,
        },
        { property: 'og:image', content: avatar.value || '' },
      ],
    })
  } catch (e) {
    throwError(e.message || '未知错误')
  } finally {
    loading.value = false
  }
}

async function handleDownload() {
  // 统计下载次数（失败不应阻断实际下载）
  fetch(`/api/download?name=${encodeURIComponent(filename.value)}`).catch(
    () => {}
  )

  try {
    if (!downloadObjectUrl.value) throw new Error('文件尚未加载完成')
    const link = document.createElement('a')
    link.href = downloadObjectUrl.value
    link.download = `${filename.value}.jsx`
    link.click()
  } catch (error) {
    console.error('下载过程中出错:', error)
    throwError('下载失败: ' + (error.message || '未知错误'))
  }
}

onMounted(() => {
  loadClientData()
  // 发送页面浏览统计请求
  const apiUrl = `/api/pageviews?name=${encodeURIComponent(filename.value)}`
  fetch(apiUrl, { method: 'GET' }).catch(() => {})
})

onBeforeUnmount(() => {
  if (downloadObjectUrl.value) URL.revokeObjectURL(downloadObjectUrl.value)
})
</script>

<style>
@import '@/assets/css/control-detail.css';
</style>
