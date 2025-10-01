<template>
    <header>
        <div>
            <h1>ZIT-CoCo-Community</h1>
        </div>
    </header>
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
                    <i class="far fa-file-code"></i>
                </div>
                <div class="file-info-user">
                    <div class="file-name-user">{{ control }}</div>
                </div>
                <div class="file-actions-user">
                    <a :href="`https://cc.zitzhen.cn/control/${control}`">
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
    <footer>
      <div class="container-user">
          <p>© 2025 小圳社区 - CoCo自定义控件下载中心 | 所有文件仅供学习交流使用</p>
      </div>
  </footer>
</template>

<style>
.container-user {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 16px;
}
.profile-header-user {
    display: flex;
    align-items: center;
    padding: 32px 0 24px 0;
    border-bottom: 1px solid #eee;
}
.avatar-user {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    margin-right: 32px;
    object-fit: cover;
    border: 2px solid #3498db;
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
    color: #3498db;
}
.stat-label-user {
    font-size: 0.95rem;
    color: #666;
}
.tabs-user {
    display: flex;
    gap: 16px;
    margin: 32px 0 0 0;
    border-bottom: 1px solid #eee;
}
.tab-user {
    padding: 12px 32px;
    cursor: pointer;
    font-size: 1.1rem;
    color: #666;
    border-radius: 8px 8px 0 0;
    background: #f7f7f7;
    transition: background 0.2s, color 0.2s;
}
.tab-user.active-user {
    background: #3498db;
    color: #fff;
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
    color: #3498db;
}
.file-list-user {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}
.file-card-user {
    background: #fff;
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
    color: #3498db;
    margin-bottom: 8px;
}
.file-info-user {
    flex: 1;
    margin-bottom: 8px;
}
.file-name-user {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
}
.file-actions-user {
    margin-top: auto;
}
.download-btn-user {
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 16px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background 0.2s;
}
.download-btn-user:hover {
    background: #217dbb;
}
.article-list-user {
    min-height: 80px;
    padding: 16px 0;
}
footer {
    margin-top: 48px;
    background: #f7f7f7;
    padding: 24px 0;
    text-align: center;
    color: #888;
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { 
  getCurrentUrlLastSegment, 
  fetchGithubInformation, 
  fetchUserInformation, 
  renderInformation
} from './index.ts'
import { UserInfo, UserIntroduction } from '@types'

const Nickname = ref('')
const bio = ref('加载中...')
const avatar = ref('')
const Control_number = ref('')
const controlList = ref<string[]>([])
const loading = ref(true)
const activeTab = ref('files')

function switchTab(tab: string) {
  activeTab.value = tab
}

// 更新 head（响应式）
useHead({
  title: () => `${Nickname.value} 的主页|ZIT-CoCo-Community`,
  meta: [
    { name: 'description', content: () => bio.value }
  ]
})

onMounted(async () => {
  const username = getCurrentUrlLastSegment()
  const user_github_information: UserInfo | null = await fetchGithubInformation(username)
  const user_introduction: UserIntroduction | null = await fetchUserInformation(username)

  if (user_github_information) {
    renderInformation(user_github_information, 
      (name) => { Nickname.value = name }, 
      (bioText) => { bio.value = bioText }, 
      (avatarUrl) => { avatar.value = avatarUrl }
    )
  } else if (user_introduction && user_introduction.list_of_controls) {
    // 从用户介绍中获取信息
    Nickname.value = username
    bio.value = '此人很懒，什么都没有'
    avatar.value = ''
  }

  Control_number.value = user_introduction?.number_of_controls || 'Error'
  if (user_introduction?.list_of_controls) {
    controlList.value = user_introduction.list_of_controls
  }

  loading.value = false
})
</script>