<template>
  <Teleport to="body">
    <Transition name="palette">
      <div
        v-if="open"
        class="palette-overlay"
        @click.self="close"
      >
        <div
          ref="panelRef"
          class="palette"
          role="dialog"
          aria-modal="true"
          aria-label="资源搜索命令面板"
        >
          <div class="palette-input-wrap">
            <i class="fas fa-search palette-input-icon" aria-hidden="true"></i>
            <label for="palette-input" class="sr-only">搜索资源</label>
            <input
              id="palette-input"
              ref="inputRef"
              v-model="query"
              type="text"
              class="palette-input"
              placeholder="搜索资源、控件、工具…"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
          </div>

          <div class="palette-body">
            <div class="palette-group" v-if="!query && recent.length">
              <div class="palette-group-label">最近打开</div>
              <button
                v-for="item in recent"
                :key="item.name"
                type="button"
                class="palette-item"
                @click="go(item)"
                @mousemove="activeIndex = -1"
              >
                <span class="palette-item-icon" aria-hidden="true">
                  <i aria-hidden="true" class="fas fa-clock"></i>
                </span>
                <span class="palette-item-name">{{ item.name }}</span>
                <span class="palette-item-author">@{{ item.author }}</span>
              </button>
            </div>

            <div
              class="palette-group"
              v-if="results.length"
            >
              <div class="palette-group-label">
                {{ query ? '资源结果' : '全部资源' }}
              </div>
              <button
                v-for="(item, index) in results"
                :key="item.name"
                type="button"
                class="palette-item"
                :class="{ selected: index === activeIndex }"
                @click="go(item)"
                @mousemove="activeIndex = index"
              >
                <span class="palette-item-icon" aria-hidden="true">
                  <i aria-hidden="true" class="fas fa-file-code"></i>
                </span>
                <span class="palette-item-name">{{ item.name }}</span>
                <span class="palette-item-author">@{{ item.author || '未知' }}</span>
                <i class="fas fa-arrow-turn-up palette-item-enter" aria-hidden="true"></i>
              </button>
            </div>

            <div class="palette-empty" v-if="query && !results.length">
              <i class="fas fa-box-open palette-empty-icon" aria-hidden="true"></i>
              <p>未找到匹配的资源</p>
            </div>
          </div>

          <div class="palette-footer">
            <span><kbd class="kbd">↑↓</kbd> 选择</span>
            <span><kbd class="kbd">↵</kbd> 打开</span>
            <span><kbd class="kbd">esc</kbd> 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const RECENT_KEY = 'coco-palette-recent'
const RESULT_LIMIT = 8

// 控件全量数据（与首页同 key 共享缓存）
const { data: controlData } = await useFetch('/api/control-list', {
  key: 'control-list',
})

const open = useState('palette-open', () => false)
const query = ref('')
const activeIndex = ref(0)
const recent = ref([])
const inputRef = ref(null)
const panelRef = ref(null)

const controls = computed(() => controlData.value?.list || [])

const results = computed(() => {
  const term = query.value.trim().toLowerCase()
  const source = term
    ? controls.value.filter(
        (item) =>
          item.name?.toLowerCase().includes(term) ||
          item.author?.toLowerCase().includes(term)
      )
    : controls.value
  return source.slice(0, RESULT_LIMIT)
})

// 结果变化后高亮复位
watch(results, () => {
  activeIndex.value = 0
})

function isTypingTarget(target) {
  if (!target) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

function onGlobalKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openPalette()
    return
  }
  if (event.key === '/' && !isTypingTarget(event.target)) {
    event.preventDefault()
    openPalette()
    return
  }
  if (event.key === 'Escape' && open.value) {
    close()
  }
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (results.value.length) {
      activeIndex.value = (activeIndex.value + 1) % results.value.length
      scrollSelectedIntoView()
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (results.value.length) {
      activeIndex.value =
        (activeIndex.value - 1 + results.value.length) % results.value.length
      scrollSelectedIntoView()
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const target = results.value[activeIndex.value]
    if (target) go(target)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

function scrollSelectedIntoView() {
  nextTick(() => {
    panelRef.value
      ?.querySelector('.palette-item.selected')
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function openPalette() {
  query.value = ''
  activeIndex.value = 0
  loadRecent()
  open.value = true
  document.documentElement.style.overflow = 'hidden'
  nextTick(() => inputRef.value?.focus())
}

function close() {
  open.value = false
  document.documentElement.style.overflow = ''
}

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    recent.value = raw ? JSON.parse(raw) : []
  } catch {
    recent.value = []
  }
}

function saveRecent(item) {
  const entry = { name: item.name, author: item.author }
  const next = [
    entry,
    ...recent.value.filter((saved) => saved.name !== entry.name),
  ].slice(0, 3)
  recent.value = next
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {}
}

function go(item) {
  saveRecent(item)
  close()
  navigateTo(`/control/${encodeURIComponent(item.name)}`)
}

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
  document.documentElement.style.overflow = ''
})
</script>

<style>
@import '@/assets/css/command-palette.css';
</style>
