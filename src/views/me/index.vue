<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="logo">ZIT<span>-CoCo-Community</span></a>
        <div class="user-info">
          <img :src="avatar" alt="用户头像" class="user-avatar" />
          <div class="user-name">{{ username }}</div>
        </div>
      </div>
    </nav>
  </div>
  <div style="height: 90px;"></div>
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
            <i class="far fa-file-code"></i>
          </div>
          <div class="file-info-me">
            <div class="file-name-me">{{ control }}</div>
          </div>
          <div class="file-actions-me">
            <a :href="`https://cc.zitzhen.cn/control/${control}`">
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
      <p>个人信息首次将同步您的Github信息，Github头像会自动更新，我们支持自定义头像与昵称。自2025年11月10日以后，您可能需要自行同步或设置Github个人资料（头像自动同步，除非您自行更改了头像）</p>
      <p>更改此项目同步时间通常不超过168小时</p>
      
      <!-- 更改头像和昵称表单 -->
      <div class="profile-edit-section">
        <h3>更改头像和昵称</h3>
        <form class="profile-form">
          <div class="form-group">
            <label for="nickname">昵称</label>
            <input 
              type="text" 
              id="nickname" 
              v-model="editNickname" 
              placeholder="请输入新的昵称"
              class="form-control"
              disabled
            />
          </div>
          <button type="button" class="save-btn" @click="update_nickname">
              修改昵称
            </button>
          
            <div style="height: 20px;"></div>
          
          <div class="form-group">
            <label for="avatar">头像URL</label>
            <input 
              type="url" 
              id="avatar" 
              v-model="editAvatar" 
              placeholder="请输入头像图片URL"
              class="form-control"
              disabled
            />
            <div class="avatar-preview" v-if="editAvatar">
              <img :src="editAvatar" alt="头像预览" class="avatar-preview-img" />
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="save-btn" @click="update_avatar">
             修改头像
            </button>
          </div>
        </form>
      </div>
      
      <h2>账户及相关管理</h2>
      <button @click="openModal" class="logout-btn">退出登录</button>
    </div>
  </div>

  <!--不能修改头像弹窗-->
  <div class="modal-overlay" :class="{ active: isavatarOpen }" @click="closeavatarModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">抱歉暂时不能修改头像</h2>
        <button class="close-btn" @click="closeavatarModal">×</button>
      </div>
      <div class="modal-body">
        <p>抱歉，我们暂时无法修改您的头像</p>
        <p>这可能是此功能正在开发</p>
        <p>如果您想立即修改头像，CoCo-Community建议您联系Oliver强制修改</p>
        <p>发送电邮：<a href="https://live.com">avatar.coco-community@zit.email</a></p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="closeavatarModal">好的</button>
      </div>
    </div>
  </div>

  <!--不能修改昵称弹窗-->
  <div class="modal-overlay" :class="{ active: isnicknameOpen }" @click="closeNicknameModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">抱歉暂时不能修改昵称</h2>
        <button class="close-btn" @click="closeNicknameModal">×</button>
      </div>
      <div class="modal-body">
        <p>抱歉，我们暂时无法修改您的昵称</p>
        <p>这可能是此功能正在开发</p>
        <p>如果您想立即修改昵称，CoCo-Community建议您联系Oliver强制修改</p>
        <p>发送电邮：<a href="https://live.com">nickname.coco-community@zit.email</a></p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="closeNicknameModal">好的</button>
      </div>
    </div>
  </div>
  

  <!-- 退出登录弹窗 -->
  <div class="modal-overlay" :class="{ active: isModalOpen }" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">退出登录？</h2>
        <button class="close-btn" @click="closeModal">×</button>
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

  <footer>
    <div class="container-me">
      <p>© 2025 小圳社区 - CoCo-Community</p>
    </div>
  </footer>
</template>

<style>
@import url(@/assets/css/Navigation-bar.css);
@import url(@/assets/style/me/style.css);
@import url(@/assets/style/me/style2.css);
@import url(@/assets/css/popup.css);

.github-content {
  padding: 20px 0;
}

.github-link {
  color: #3498db;
  text-decoration: none;
  word-break: break-all;
}

.github-link:hover {
  text-decoration: underline;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
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
  border: 1px solid #ddd;
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
  border: 2px solid #ddd;
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
  background: #3498db;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #2980b9;
}

.reset-btn {
  background: #95a5a6;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: #7f8c8d;
}

.save-btn:disabled {
  background: #bdc3c7;
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
    border: 1px solid #ddd;
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
    border: 2px solid #ddd;
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
    background: #3498db;
    color: white;
  }
  
  .save-btn:hover:not(:disabled) {
    background: #2980b9;
  }
  
  .reset-btn {
    background: #95a5a6;
    color: white;
  }
  
  .reset-btn:hover:not(:disabled) {
    background: #7f8c8d;
  }
  
  .save-btn:disabled {
    background: #bdc3c7;
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
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head'

useHead({
  title: () => `账户设置|ZIT-CoCo-Community`,
})

export default {
  setup() {
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
    const isnicknameOpen = ref(false);
    const isavatarOpen = ref(false);
    
    // 编辑用户资料相关状态
    const editNickname = ref("");
    const editAvatar = ref("");
    const isUpdating = ref(false);
    
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
      if (event.key === 'Escape' && isnicknameOpen.value) {
        closeNicknameModal();
      }
      if (event.key === 'Escape' && isavatarOpen.value) {
        closeavatarModal();
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
          console.log("用户未登录，跳转到登录页面");
          // router.push({ path: '/login' });
          return;
        } else {
          console.log("用户已登录", logininformation);
          username_github.value = "@" + (logininformation.user.login || "");
          username.value = logininformation.user.name || logininformation.user.login || "未知用户";
          avatar.value = logininformation.user.avatar_url || "/images/user.png";
          Nickname.value = logininformation.user.name || logininformation.user.login || "";
          bio.value = logininformation.user.bio || "";
          githubUrl.value = logininformation.user.html_url || "";
          
          // 初始化编辑表单
          editNickname.value = logininformation.user.name || logininformation.user.login || "";
          editAvatar.value = logininformation.user.avatar_url || "/images/user.png";
          
          // 获取用户的控件信息
          if (logininformation.user.login) {
            await fetch_user_information(logininformation.user.login);
          }
        }
      } catch (err) {
        console.error("登录检查失败：", err);
        router.push({ path: '/login' });
      }
    };
    
    
    // 获取用户控件信息
    async function fetch_user_information(username_github) {
      console.log(username_github);
      try {
        const url = `https://${window.location.host}/information/user/${username_github}.json`;
        console.log(url);
        const res = await fetch(url);
        if (res.ok) {
          const user_introduction = await res.json();
          Control_number.value =  user_introduction.number_of_controls;
          if (user_introduction?.list_of_controls) {
            controlList.value = user_introduction.list_of_controls;
          }
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
    
    // 显示昵称修改弹窗
    const update_nickname = () => {
      isnicknameOpen.value = true;
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    };

    // 显示头像修改弹窗
    const update_avatar = () => {
      isavatarOpen.value = true;
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    };
    
    // 关闭昵称修改弹窗
    const closeNicknameModal = () => {
      isnicknameOpen.value = false;
      // 恢复背景滚动
      document.body.style.overflow = '';
    };
    
    // 关闭头像修改弹窗
    const closeavatarModal = () => {
      isavatarOpen.value = false;
      // 恢复背景滚动
      document.body.style.overflow = '';
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
      isnicknameOpen,
      isavatarOpen,
      
      // 编辑用户资料相关状态
      editNickname,
      editAvatar,
      isUpdating,
      
      // 方法
      switchTab,
      openModal,
      closeModal,
      confirmLogout,
      update_nickname,
      update_avatar,
      closeNicknameModal,
      closeavatarModal
    };
  }
};

</script>