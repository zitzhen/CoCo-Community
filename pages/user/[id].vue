<template>
<div id="app">
</div>
    <div class="container-user" id="avatar">
    <!-- 用户信息头部 -->
    <div class="profile-header-user">
         <img :src="avatar" alt="用户头像" class="avatar-user" id="avatar_img">
        <div class="user-info-user">
            <h1 id="user_name">{{ Nickname }}</h1>
            <!--用户GitHub名称-->
            <p id="user_introduction">{{ bio }}</p>
            <!--用户GitHub介绍-->
            <div class="stats-user">
                <div class="stat-item-user">
                    <div class="stat-number-user" id="number_of_controls">{{ Control_number }}</div>
                    <div class="stat-label-user">控件</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 标签导航 -->
    <div class="tabs-user">
        <div :class="['tab-user', { 'active-user': activeTab === 'files' }]" data-tab="files" @click="switchTab('files')">控件</div>
        <div :class="['tab-user', { 'active-user': activeTab === 'articles' }]" data-tab="articles" @click="switchTab('articles')">文章</div>
    </div>
    
    <!-- 文件板块 -->
    <div :class="['tab-content-user', { 'active-user': activeTab === 'files' }]" id="files">
        <h2 class="section-title-user">TA的控件</h2>
        <div class="file-list-user" id="display_controls">
            <div class="file-card-user" v-for="(control, index) in controlList" :key="index">
                <div class="file-icon-user">
                    <i aria-hidden="true" class="far fa-file-code"></i>
                </div>
                <div class="file-info-user">
                    <div class="file-name-user">{{ control }}</div>
                </div>
                <div class="file-actions-user">
                    <a :href="`/control/${control}`">
                        <button class="download-btn-user">去详情</button>
                    </a>
                </div>
            </div>
            <p v-if="controlList.length === 0 && !loading">暂无控件</p>
            <p v-if="loading">请稍后，我们正在处理数据……</p>
        </div>
    </div>
    
    <!-- 文章板块 -->
    <div :class="['tab-content-user', { 'active-user': activeTab === 'articles' }]" id="articles">
        <h2 class="section-title-user">TA的文章</h2>
        <div class="article-list-user">
            <!-- 文章卡片 -->
            <p>文章功能正在开发中</p>
        </div>
    </div>
</div>
</template>

<style>
@import url(@/assets/style/user/style.css);
@import url(@/assets/css/dark.css);

.container-user {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px;
}
.profile-header-user {
    display: flex;
    align-items: center;
    padding: 32px 0 24px 0;
    border-bottom: 1px solid var(--border);
}
.avatar-user {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    margin-right: 32px;
    object-fit: cover;
    border: 2px solid var(--primary);
}
.user-info-user {
    flex: 1;
}
.stats-user {
    display: flex;
    gap: 32px;
    margin-top: 16px;
}
.stat-item-user {
    text-align: center;
}
.stat-number-user {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary);
}
.stat-label-user {
    font-size: 0.95rem;
    color: var(--muted);
}
.tabs-user {
    display: flex;
    gap: 16px;
    margin: 32px 0 0 0;
    border-bottom: 1px solid var(--border);
}
.tab-user {
    padding: 12px 32px;
    cursor: pointer;
    font-size: 1.1rem;
    color: var(--muted);
    border-radius: 8px 8px 0 0;
    background: var(--muted-background);
    transition: background 0.2s, color 0.2s;
}
.tab-user.active-user {
    background: var(--primary);
    color: var(--primary-foreground);
    font-weight: bold;
}
.tab-content-user {
    display: none;
    padding: 24px 0;
}
.tab-content-user.active-user {
    display: block;
}
.section-title-user {
    font-size: 1.3rem;
    margin-bottom: 16px;
    color: var(--primary);
}
.file-list-user {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}
.file-card-user {
    background: var(--card);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.08);
    padding: 16px;
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.file-icon-user {
    font-size: 2rem;
    color: var(--primary);
    margin-bottom: 8px;
}
.file-info-user {
    flex: 1;
    margin-bottom: 8px;
}
.file-name-user {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--foreground);
}
.file-actions-user {
    margin-top: auto;
}
.download-btn-user {
    background: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: 4px;
    padding: 6px 16px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;
}
.download-btn-user:hover {
    background: var(--primary-hover);
}
.article-list-user {
    min-height: 80px;
    padding: 16px 0;
}
footer {
    margin-top: 48px;
    background: var(--muted-background);
    padding: 24px 0;
    text-align: center;
    color: var(--muted);
}
@media (max-width: 600px) {
    .profile-header-user {
        flex-direction: column;
        align-items: flex-start;
    }
    .avatar-user {
        margin-bottom: 16px;
        margin-right: 0;
    }
    .file-list-user {
        flex-direction: column;
        gap: 16px;
    }
    .file-card-user {
        width: 100%;
    }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'

const Nickname = ref('')
const bio = ref('加载中...')
const avatar = ref('')
const Control_number = ref('')
const controlList = ref([])
const loading = ref(true)
const activeTab = ref('files')

function switchTab(tab) {
  activeTab.value = tab
}

// 更新 head（响应式）
useHead({
  title: () => `${Nickname.value} 的主页|ZIT-CoCo-Community`,
  meta: [
    { name: 'description', content: () => bio.value }
  ]
})

const route = useRoute()
const username = route.params.id

function render_information(basicInformation) {
  Nickname.value = basicInformation?.nickname || basicInformation?.name || basicInformation?.username || '未知用户'
  bio.value = basicInformation?.bio || '此人很懒，什么都没有'
  avatar.value = basicInformation?.avatar || ''
}

// 控件清单改用实时 /api/control-list 按 author 过滤（与首页/搜索共享缓存 key，零额外请求）；
// 旧的静态 information/user/*.json 已无更新机制且数据腐烂（存在死链控件名）
const { data: controlData } = await useFetch('/api/control-list', { key: 'control-list' })
// GitHub 用户名不区分大小写；R2 旧数据的 author 可能与路由参数大小写不一致
const myControls = (controlData.value?.list || []).filter(
  (c) => c.author?.toLowerCase() === username.toLowerCase()
)

// SSR：服务端获取用户基本信息，首屏 HTML 直接渲染
const { data: userData } = await useAsyncData(`user-page-${username}`, async () => {
  const basic = await $fetch('/api/user-list')
    .then(r => (r.list || []).find(u => u.username === username))
    .catch(() => null)
  return { basic }
})

if (userData.value?.basic) {
  render_information(userData.value.basic)
  Control_number.value = String(myControls.length)
  controlList.value = myControls.map((c) => c.name)
} else {
  // 用户不存在于 userlist.json 中
  Nickname.value = username
  bio.value = '用户未找到'
  avatar.value = ''
  Control_number.value = '0'
}
loading.value = false

onMounted(() => {
  // 发送页面浏览统计请求
  const apiUrl = `/api/pageviews_user?username=${encodeURIComponent(username)}`;
  fetch(apiUrl, { method: 'GET' }).catch(() => {});
})
</script>

