<template>
  <div class="container-me" id="avatar">
    <!-- 用户信息头部 -->
    <div class="profile-header-me">
      <img :src="avatar" alt="用户头像" class="avatar-me" id="avatar_img">
      <div class="user-info-me">
        <h1 id="user_name">{{ Nickname }}</h1>
        <!--用户GitHub名称-->
        <p>{{ username_github }}</p>
        <p id="user_introduction">{{ bio }}</p>
        <!--用户GitHub介绍-->
        <div class="stats-me">
          <div class="stat-item-me">
            <div class="stat-number-me" id="number_of_controls">{{ Control_number }}</div>
            <div class="stat-label-me">控件</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签导航 -->
    <div class="tabs-me">
      <div :class="['tab-me', { 'active-me': activeTab === 'files' }]" data-tab="files" @click="switchTab('files')">
        控件</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'articles' }]" data-tab="articles"
        @click="switchTab('articles')">文章</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'github' }]" @click="switchTab('github')">Github</div>
      <div :class="['tab-me', { 'active-me': activeTab === 'settings' }]" @click="switchTab('settings')">设置</div>
    </div>

    <!-- 文件板块 -->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'files' }]" id="files">
      <h2 class="section-title-me">你的控件</h2>
      <div class="file-list-me" id="display_controls">
        <div class="file-card-me" v-for="(control, index) in controlList" :key="index">
          <div class="file-icon-me">
            <i aria-hidden="true" class="far fa-file-code"></i>
          </div>
          <div class="file-info-me">
            <div class="file-name-me">{{ control }}</div>
          </div>
          <div class="file-actions-me">
            <a :href="`/control/${control}`">
              <button class="download-btn-me">去详情</button>
            </a>
          </div>
        </div>
        <p v-if="controlList.length === 0 && !loading">暂无控件</p>
        <p v-if="loading">请稍后，我们正在处理数据……</p>
      </div>
    </div>

    <!-- 文章板块 -->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'articles' }]" id="articles">
      <h2 class="section-title-me">你的文章</h2>
      <div class="article-list-me">
        <!-- 文章卡片 -->
        <p>文章功能正在开发中</p>
      </div>
    </div>

    <!--Github-->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'github' }]" id="github">
      <h2 class="section-title-me">Github</h2>
      <div class="github-content">
        <div v-if="githubUrl">
          <p>访问我的 GitHub 主页:</p>
          <a :href="githubUrl" target="_blank" class="github-link">{{ githubUrl }}</a>
        </div>
        <div v-else>
          <p>GitHub 信息不可用</p>
        </div>
      </div>
    </div>

    <!--设置-->
    <div :class="['tab-content-me', { 'active-me': activeTab === 'settings' }]" id="settings">
      <h2 class="section-title-me">设置</h2>
      <h2 class="section-title">个人信息</h2>
      
      <!-- 更改昵称 -->
      <div class="profile-edit-section">
        <h3>更改昵称</h3>
        <form class="profile-form" @submit.prevent="saveNickname">
          <div class="form-group">
            <label for="nicknameInput">昵称</label>
            <input 
              type="text" 
              id="nicknameInput" 
              v-model="editNickname" 
              placeholder="请输入新的昵称"
              class="form-control"
              maxlength="32"
            />
          </div>
          <button type="submit" class="save-btn" :disabled="nicknameSaving">
            {{ nicknameSaving ? '保存中…' : '修改昵称' }}
          </button>
          <p v-if="nicknameMessage" class="profile-message" :class="nicknameMessageType" role="status">
            {{ nicknameMessage }}
          </p>
        </form>
      </div>

      <!-- 更改头像 -->
      <div class="profile-edit-section">
        <h3>更改头像</h3>
        <form class="profile-form" @submit.prevent="saveAvatar">
          <div class="form-group">
            <label for="avatarInput">头像URL</label>
            <div class="avatar-url-row">
              <input 
                type="url" 
                id="avatarInput" 
                v-model="editAvatar" 
                placeholder="请输入头像图片URL"
                class="form-control"
              />
              <button type="button" class="save-btn github-avatar-btn" @click="fillGithubAvatar">
                <i class="fab fa-github" aria-hidden="true"></i>
                获取 GitHub 头像 URL
              </button>
            </div>
            <div class="avatar-preview" v-if="editAvatar">
              <img :src="editAvatar" alt="头像预览" class="avatar-preview-img" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="avatarSaving">
              {{ avatarSaving ? '保存中…' : '保存头像URL' }}
            </button>
          </div>
          <p v-if="avatarMessage" class="profile-message" :class="avatarMessageType" role="status">
            {{ avatarMessage }}
          </p>

          <!-- 手动上传：文件存入 R2 的 avatar 文件夹，D1 记录 avatar/文件名 -->
          <div class="form-group avatar-upload-group">
            <label for="avatarFileInput">或上传本地头像</label>
            <div class="avatar-upload-row">
              <input
                ref="avatarFileRef"
                type="file"
                id="avatarFileInput"
                accept="image/png,image/jpeg,image/gif,image/webp"
                class="avatar-file-input"
                @change="onAvatarFileChange"
              />
              <button type="button" class="save-btn" :disabled="avatarUploading || !avatarFile" @click="uploadAvatar">
                {{ avatarUploading ? '上传中…' : '上传头像' }}
              </button>
            </div>
            <p class="form-hint">支持 PNG / JPG / GIF / WebP，大小不超过 2 MiB；上传成功后立即生效</p>
            <p v-if="avatarFileError" class="profile-message error" role="alert">{{ avatarFileError }}</p>
          </div>
        </form>
      </div>
      
      <!-- Git 仓库同步 -->
      <div class="profile-edit-section">
        <h3>Git 仓库同步</h3>
        <p style="color: var(--muted-foreground); font-size: 14px;">
          将基于 control-template 模板的 GitHub 仓库绑定到控件，push 后自动增量同步新版本。
          <NuxtLink to="/new-control/repo" style="color: var(--primary);">去绑定仓库 →</NuxtLink>
        </p>
        <div v-if="syncBindings.length > 0" style="margin-top: 12px;">
          <div
            v-for="b in syncBindings"
            :key="b.controlName"
            style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); flex-wrap: wrap;"
          >
            <div style="flex: 1; min-width: 200px;">
              <div style="font-weight: 600;">{{ b.controlName }}</div>
              <div style="font-size: 13px; color: var(--muted-foreground);">
                <a :href="`https://github.com/${b.repo}`" target="_blank" rel="noopener noreferrer" style="color: var(--primary);">{{ b.repo }}</a>
                · 分支 {{ b.branch }}
                <span v-if="b.lastSyncedAt"> · 最近同步 {{ formatSyncTime(b.lastSyncedAt) }}（{{ syncStatusText(b.lastSyncStatus) }}）</span>
                <span v-else> · 尚未同步</span>
              </div>
            </div>
            <button type="button" class="save-btn" :disabled="b._syncing" @click="syncBinding(b)">
              {{ b._syncing ? '同步中…' : '立即同步' }}
            </button>
            <button type="button" class="save-btn" style="background:#ef4444;" @click="unbindControl(b.controlName)">
              解绑
            </button>
          </div>
          <p v-if="syncMessage" style="margin-top: 10px; font-size: 14px;" :style="{ color: syncMessageType === 'error' ? '#ef4444' : 'var(--muted-foreground)' }">{{ syncMessage }}</p>
        </div>
        <p v-else style="margin-top: 12px; color: var(--muted-foreground); font-size: 14px;">暂无绑定的仓库</p>
      </div>

      <h2>账户及相关管理</h2>
      <button @click="openModal" class="logout-btn">退出登录</button>
    </div>
  </div>

  <!-- 退出登录弹窗 -->
  <div class="modal-overlay" :class="{ active: isModalOpen }" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">退出登录？</h2>
        <button class="close-btn" aria-label="关闭" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <p>您确定要退出登录吗？</p>
        <p>我们将让CoCo-Community在本网站保存的Cookie立即过期</p>
        <p>如果您要撤销对CoCo-Community的令牌，请自行到Github撤销</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="closeModal">取消</button>
        <button class="modal-btn modal-btn-confirm" @click="confirmLogout">确定</button>
      </div>
    </div>
  </div>
</template>

<style>
@import url(@/assets/style/me/style.css);
@import url(@/assets/style/me/style2.css);
@import url(@/assets/css/popup.css);
@import url(@/assets/css/dark.css);

.github-content {
  padding: 20px 0;
}

.github-link {
  color: var(--primary);
  text-decoration: none;
  word-break: break-all;
}

.github-link:hover {
  text-decoration: underline;
}

.logout-btn {
  background: #ef4444;
  color: var(--primary-foreground);
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--muted);
}

/* 个人资料编辑表单样式 */
.profile-edit-section {
  margin-bottom: 30px;
}

.profile-form {
  margin-top: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
}

.avatar-preview {
  margin-top: 10px;
  text-align: center;
}

.avatar-preview-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
}

.avatar-url-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar-url-row .form-control {
  flex: 1;
  min-width: 220px;
}

.github-avatar-btn {
  white-space: nowrap;
  background: #24292f;
}

.github-avatar-btn:hover:not(:disabled) {
  background: #1b1f23;
}

.avatar-upload-group {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.avatar-upload-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.avatar-file-input {
  flex: 1;
  min-width: 200px;
  font-size: 13px;
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.profile-message {
  margin-top: 10px;
  font-size: 13px;
}

.profile-message.success {
  color: #16a34a;
}

.profile-message.error {
  color: #ef4444;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn {
  background: var(--primary);
  color: var(--primary-foreground);
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-hover);
}

.reset-btn {
  background: var(--muted);
  color: var(--muted-foreground);
}

.reset-btn:hover:not(:disabled) {
  background: var(--muted);
}

.save-btn:disabled {
  background: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .profile-header-me {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-me {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .tabs-me {
    flex-wrap: wrap;
  }
  
  .tab-me {
    flex: 1 0 auto;
    text-align: center;
    min-width: 100px;
  }
  
  .file-list-me {
    grid-template-columns: 1fr;
  }
  
  .file-card-me {
    width: 100%;
  }
  
  .modal {
    width: 95%;
    max-width: none;
    margin: 0 10px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .modal-btn:last-child {
    margin-bottom: 0;
  }
  
  .profile-edit-section {
    margin-bottom: 30px;
  }
  
  .profile-form {
    margin-top: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
  }
  
  .avatar-preview {
    margin-top: 10px;
    text-align: center;
  }
  
  .avatar-preview-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
  }
  
  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .save-btn, .reset-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .save-btn {
    background: var(--primary);
    color: var(--primary-foreground);
  }
  
  .save-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }
  
  .reset-btn {
    background: var(--muted);
    color: var(--muted-foreground);
  }
  
  .reset-btn:hover:not(:disabled) {
    background: var(--muted);
  }
  
  .save-btn:disabled {
    background: var(--muted);
    color: var(--muted-foreground);
    cursor: not-allowed;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 10px;
  }
  
  .logo {
    font-size: 1.4rem;
  }
  
  .user-name {
    display: none;
  }
  
  .avatar-me {
    width: 80px;
    height: 80px;
  }
  
  .tabs-me {
    gap: 5px;
  }
  
  .tab-me {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
  
  .stat-item-me {
    min-width: 80px;
  }
  
  .stat-number-me {
    font-size: 1.2rem;
  }
}
</style>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { checkLoginStatus } from '@/script/login';

export default {
  setup() {
    useHead({
      title: () => `账户设置|ZIT-CoCo-Community`,
    })
    const router = useRouter();
    
    // 用户信息
    const avatar = ref("/images/user.png");
    const username = ref("未登录用户");
    const username_github = ref("@");
    const Nickname = ref("");
    const bio = ref("");
    const Control_number = ref('');
    const githubUrl = ref("");
    
    // 控件列表
    const controls = ref([]);
    const controlList = ref([]);
    const loading = ref(true);
    
    // 标签页状态
    const activeTab = ref("files");
    
    // 弹窗状态
    const isModalOpen = ref(false);
    
    // 编辑用户资料相关状态
    const editNickname = ref("");
    const editAvatar = ref("");
    const githubAvatarUrl = ref("");
    const isUpdating = ref(false);

    // 昵称 / 头像保存反馈
    const nicknameSaving = ref(false);
    const nicknameMessage = ref("");
    const nicknameMessageType = ref("success");
    const avatarSaving = ref(false);
    const avatarMessage = ref("");
    const avatarMessageType = ref("success");

    // 本地上传头像
    const avatarFileRef = ref(null);
    const avatarFile = ref(null);
    const avatarFileError = ref("");
    const avatarUploading = ref(false);
    const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MiB

    // Git 仓库同步绑定列表
    const syncBindings = ref([]);
    const syncMessage = ref("");
    const syncMessageType = ref("info");

    async function fetchSyncBindings() {
      try {
        const data = await $fetch('/api/github-sync/list');
        syncBindings.value = (data?.list || []).map((b) => ({ ...b, _syncing: false }));
      } catch {
        syncBindings.value = [];
      }
    }

    function formatSyncTime(iso) {
      try {
        return new Date(iso).toLocaleString('zh-CN', { hour12: false });
      } catch {
        return iso;
      }
    }

    function syncStatusText(status) {
      const map = { ok: '成功', partial: '部分成功', failed: '失败', never: '未同步' };
      return map[status] || status || '未同步';
    }

    async function syncBinding(b) {
      b._syncing = true;
      syncMessage.value = '';
      try {
        const res = await $fetch('/api/github-sync/sync', {
          method: 'POST',
          body: { controlName: b.controlName },
        });
        const synced = res?.filesSynced?.length || 0
        const removed = res?.deleted?.length || 0
        syncMessageType.value = 'info'
        syncMessage.value = `「${b.controlName}」同步完成：新增/更新 ${synced} 个文件，删除 ${removed} 个文件，未变 ${res?.unchanged || 0} 个`
        await fetchSyncBindings();
      } catch (err) {
        syncMessageType.value = 'error';
        const code = err?.data?.error;
        syncMessage.value = code === 'sync_too_frequent'
          ? '同步过于频繁，请稍后再试'
          : `「${b.controlName}」同步失败，请稍后重试`;
      } finally {
        b._syncing = false;
      }
    }

    async function unbindControl(controlName) {
      try {
        await $fetch('/api/github-sync/unbind', {
          method: 'POST',
          body: { controlName },
        });
        syncBindings.value = syncBindings.value.filter((x) => x.controlName !== controlName);
        syncMessageType.value = 'info';
        syncMessage.value = `「${controlName}」已解绑`;
      } catch {
        syncMessageType.value = 'error';
        syncMessage.value = '解绑失败，请稍后重试';
      }
    }
    
    // 切换标签页
    const switchTab = (tabName) => {
      activeTab.value = tabName;
    };
    
    // 打开弹窗
    const openModal = () => {
      isModalOpen.value = true;
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    };
    
    // 关闭弹窗
    const closeModal = () => {
      isModalOpen.value = false;
      // 恢复背景滚动
      document.body.style.overflow = '';
    };
    
    // 按ESC键关闭弹窗
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && isModalOpen.value) {
        closeModal();
      }
    };
    
    // 确认退出登录
    const confirmLogout = async () => {
      try {
        // 调用退出登录API
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.ok) {
          // 退出成功，跳转到首页
          window.location.href = '/';
        } else {
          console.error('退出登录失败');
        }
      } catch (error) {
        console.error('退出登录出错:', error);
      } finally {
        closeModal();
      }
    };
    
    // 检查登录状态
    const checkLogin = async () => {
      try {
        const logininformation = await checkLoginStatus();
        if (!logininformation || !logininformation.authenticated) {
          // 确保在非登录状态时跳转到登录页面
          // console.log("用户未登录，跳转到登录页面");
          router.push({ path: '/login' });
          return;
        } else {
          // console.log("用户已登录", logininformation);
          username_github.value = "@" + (logininformation.user.login || "");
          username.value = logininformation.user.name || logininformation.user.login || "未知用户";
          avatar.value = logininformation.user.avatar_url || "/images/user.png";
          Nickname.value = logininformation.user.name || logininformation.user.login || "";
          bio.value = logininformation.user.bio || "";
          githubUrl.value = logininformation.user.html_url || "";
          
          // 初始化编辑表单（avatar_url 已由 /api/me 解析为可访问 URL）
          editNickname.value = logininformation.user.name || logininformation.user.login || "";
          editAvatar.value = logininformation.user.avatar_url || "/images/user.png";
          githubAvatarUrl.value = logininformation.user.github_avatar_url || "";
          
          // 获取用户的控件信息
          if (logininformation.user.login) {
            await fetch_user_information(logininformation.user.login);
          }
          await fetchSyncBindings();
        }
      } catch (err) {
        console.error("登录检查失败：", err);
        router.push({ path: '/login' });
      }
    };
    
    
    // 获取用户控件信息（实时数据：/api/control-list 枚举 R2，按 author 过滤）
    // 旧的 /information/user/<login>.json 是旧工作流生成的静态快照，本分支已无更新机制
    async function fetch_user_information(username_github) {
      try {
        const res = await fetch('/api/control-list');
        if (res.ok) {
          const data = await res.json();
          // GitHub 用户名不区分大小写；R2 旧数据的 author 可能与登录名大小写不一致
          const mine = (data?.list || []).filter(
            (c) => c.author?.toLowerCase() === username_github.toLowerCase()
          );
          controlList.value = mine.map((c) => c.name);
          Control_number.value = String(mine.length);
        } else {
          console.error('无法获取用户控件信息');
          Control_number.value = '0';
          controlList.value = [];
        }
      } catch (error) {
        console.error('获取用户控件信息出错:', error);
        Control_number.value = '0';
        controlList.value = [];
      } finally {
        loading.value = false;
      }
    }
    
    // 添加键盘事件监听
    onMounted(() => {
      checkLogin();
      document.addEventListener('keydown', handleKeydown);
    });
    
    // 清理事件监听
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeydown);
      // 确保恢复滚动
      document.body.style.overflow = '';
    });
    
    // 资料更新错误码 → 中文提示
    const profileErrorMessage = (err, fallback) => {
      const code = err?.data?.error;
      const map = {
        unauthenticated: '登录已失效，请重新登录',
        invalid_session: '登录已失效，请重新登录',
        invalid_github_token: '登录已失效，请重新登录',
        username_mismatch: '登录状态异常，请重新登录',
        invalid_nickname: err?.data?.detail || '昵称长度需为 1-32 个字符',
        invalid_avatar: err?.data?.detail || '头像地址不合法',
        invalid_file_type: err?.data?.detail || '仅支持 PNG / JPG / GIF / WebP 图片',
        file_too_large: '图片大小不能超过 2 MiB',
        missing_file: '请先选择头像文件',
        invalid_form: '表单数据无效，请重试',
        database_error: '保存失败，请稍后重试',
        storage_error: '文件存储失败，请稍后重试',
      };
      return map[code] || fallback;
    };

    // ---------- 修改昵称 ----------
    const saveNickname = async () => {
      const nickname = editNickname.value.trim();
      nicknameMessage.value = '';
      if (nickname.length < 1 || nickname.length > 32) {
        nicknameMessageType.value = 'error';
        nicknameMessage.value = '昵称长度需为 1-32 个字符';
        return;
      }
      nicknameSaving.value = true;
      try {
        const res = await $fetch('/api/update_nickname', {
          method: 'POST',
          body: { nickname },
        });
        Nickname.value = res?.data?.nickname || nickname;
        nicknameMessageType.value = 'success';
        nicknameMessage.value = '昵称已更新';
      } catch (err) {
        nicknameMessageType.value = 'error';
        nicknameMessage.value = profileErrorMessage(err, '昵称更新失败，请稍后重试');
      } finally {
        nicknameSaving.value = false;
      }
    };

    // ---------- 头像 ----------
    // 一键回填 GitHub 头像 URL（github_avatar_url 由 /api/me 附带）
    const fillGithubAvatar = () => {
      avatarMessage.value = '';
      if (githubAvatarUrl.value) {
        editAvatar.value = githubAvatarUrl.value;
      } else {
        avatarMessageType.value = 'error';
        avatarMessage.value = '暂时无法获取 GitHub 头像，请重新登录后重试或手动粘贴 URL';
      }
    };

    // 保存头像 URL（GitHub 头像等外链 https URL）
    const saveAvatar = async () => {
      const url = editAvatar.value.trim();
      avatarMessage.value = '';
      if (!/^https:\/\//i.test(url) && !/^\/resource\//.test(url)) {
        avatarMessageType.value = 'error';
        avatarMessage.value = '请输入以 https:// 开头的图片 URL，或点击"获取 GitHub 头像 URL"';
        return;
      }
      avatarSaving.value = true;
      try {
        const res = await $fetch('/api/update_nickname', {
          method: 'POST',
          body: { avatar: url },
        });
        // 服务端回传 D1 实际存储值：avatar/<文件名> 需转回 /resource/ 路径
        const stored = res?.data?.avatar || '';
        const resolved = /^avatar\//i.test(stored) ? `/resource/${stored}` : stored || url;
        avatar.value = resolved;
        editAvatar.value = resolved;
        avatarMessageType.value = 'success';
        avatarMessage.value = '头像已更新';
      } catch (err) {
        avatarMessageType.value = 'error';
        avatarMessage.value = profileErrorMessage(err, '头像更新失败，请稍后重试');
      } finally {
        avatarSaving.value = false;
      }
    };

    // 选择本地头像：客户端先做类型 / 大小校验
    const onAvatarFileChange = (event) => {
      avatarFileError.value = '';
      avatarMessage.value = '';
      const selected = event.target.files?.[0] || null;
      if (!selected) {
        avatarFile.value = null;
        return;
      }
      if (!/^image\/(png|jpeg|gif|webp)$/.test(selected.type)) {
        avatarFileError.value = '仅支持 PNG / JPG / GIF / WebP 图片';
        avatarFile.value = null;
        if (avatarFileRef.value) avatarFileRef.value.value = '';
        return;
      }
      if (selected.size > MAX_AVATAR_SIZE) {
        avatarFileError.value = `图片大小不能超过 2 MiB（当前 ${(selected.size / 1024 / 1024).toFixed(2)} MiB）`;
        avatarFile.value = null;
        if (avatarFileRef.value) avatarFileRef.value.value = '';
        return;
      }
      avatarFile.value = selected;
    };

    // 上传头像：文件存入 R2 avatar/ 文件夹，成功后 D1 已写入 avatar/<文件名>
    const uploadAvatar = async () => {
      if (!avatarFile.value) return;
      avatarUploading.value = true;
      avatarMessage.value = '';
      avatarFileError.value = '';
      try {
        const form = new FormData();
        form.append('file', avatarFile.value);
        const res = await $fetch('/api/avatar/upload', { method: 'POST', body: form });
        avatar.value = res.url;
        editAvatar.value = res.url;
        avatarFile.value = null;
        if (avatarFileRef.value) avatarFileRef.value.value = '';
        avatarMessageType.value = 'success';
        avatarMessage.value = '头像上传成功，已立即生效';
      } catch (err) {
        avatarMessageType.value = 'error';
        avatarMessage.value = profileErrorMessage(err, '头像上传失败，请稍后重试');
      } finally {
        avatarUploading.value = false;
      }
    };
        
    
    return {
      // 用户信息
      avatar,
      username,
      username_github,
      Nickname,
      bio,
      Control_number,
      githubUrl,
      
      // 控件列表
      controls,
      controlList,
      loading,
      
      // 标签页状态
      activeTab,
      
      // 弹窗状态
      isModalOpen,
      
      // 编辑用户资料相关状态
      editNickname,
      editAvatar,
      isUpdating,

      // 昵称 / 头像编辑
      nicknameSaving,
      nicknameMessage,
      nicknameMessageType,
      avatarSaving,
      avatarMessage,
      avatarMessageType,
      avatarFileRef,
      avatarFile,
      avatarFileError,
      avatarUploading,
      saveNickname,
      fillGithubAvatar,
      saveAvatar,
      onAvatarFileChange,
      uploadAvatar,

      // Git 仓库同步
      syncBindings,
      syncMessage,
      syncMessageType,
      fetchSyncBindings,
      formatSyncTime,
      syncStatusText,
      syncBinding,
      unbindControl,
      
      // 方法
      switchTab,
      openModal,
      closeModal,
      confirmLogout
    };
  }
};

</script>