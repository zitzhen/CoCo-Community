<template>
  <div class="vulnerability-report-page">
    <header>
      <div>
        <h1 class="h1">ZIT-CoCo-Community 安全中心</h1>
      </div>
    </header>

    <div class="container_safe">
      <div class="page-header_safe">
        <div class="icon_safe">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h2>安全漏洞报告中心</h2>
        <p class="page-description_safe">
          我们非常重视产品的安全性。如果您发现了任何安全漏洞或潜在风险，请通过此页面提交报告。
          我们的安全团队会认真审查每一个提交，并在确认后尽快修复问题。
        </p>

        <div class="content-grid_safe">
          <div class="main-content_safe">
            <!-- 状态通知 -->
            <div class="status-notice">
              <div class="alert-error_safe">
                <strong><i class="fas fa-exclamation-triangle"></i> 通道临时关闭通知：</strong>
                漏洞提交通道暂时关闭，请通过右侧的联系方式报告安全问题。
              </div>

              <div class="alert-warning_safe">
                <strong><i class="fas fa-exclamation-triangle"></i> 重要提示：</strong>
                请不要在公开场合讨论未修复的安全漏洞。请通过安全渠道私下报告安全问题。
              </div>
            </div>

            <!-- 表单区域（已禁用） -->
            <div class="form-container disabled-form">
              <form id="vulnerabilityForm" @submit.prevent="handleSubmit">
                <div class="form-group_safe">
                  <label for="reporterName" class="form-label_safe">您的姓名/昵称</label>
                  <input type="text" id="reporterName" class="form-control_safe" required 
                         :disabled="isFormDisabled" v-model="formData.reporterName" />
                </div>

                <div class="form-group_safe">
                  <label for="reporterEmail" class="form-label_safe">联系邮箱</label>
                  <input type="email" id="reporterEmail" class="form-control_safe" required 
                         :disabled="isFormDisabled" v-model="formData.reporterEmail" />
                </div>

                <div class="form-group_safe">
                  <label for="affectedComponent" class="form-label_safe">受影响的组件/功能</label>
                  <input type="text" id="affectedComponent" class="form-control_safe" required
                         placeholder="例如: 文件上传功能、用户认证系统等" 
                         :disabled="isFormDisabled" v-model="formData.affectedComponent" />
                </div>

                <div class="form-group_safe">
                  <label class="form-label_safe">漏洞严重程度</label>
                  <div class="severity-select_safe">
                    <div class="severity-option_safe critical_safe" 
                         :class="{ 'selected': formData.severity === 'critical' }"
                         @click="selectSeverity('critical')">
                      <input type="radio" id="severity-critical" name="severity" value="critical" 
                             :disabled="isFormDisabled" v-model="formData.severity" />
                      <label for="severity-critical">严重</label>
                    </div>
                    <div class="severity-option_safe high_safe"
                         :class="{ 'selected': formData.severity === 'high' }"
                         @click="selectSeverity('high')">
                      <input type="radio" id="severity-high" name="severity" value="high" 
                             :disabled="isFormDisabled" v-model="formData.severity" />
                      <label for="severity-high">高危</label>
                    </div>
                    <div class="severity-option_safe medium_safe"
                         :class="{ 'selected': formData.severity === 'medium' }"
                         @click="selectSeverity('medium')">
                      <input type="radio" id="severity-medium" name="severity" value="medium" 
                             :disabled="isFormDisabled" v-model="formData.severity" />
                      <label for="severity-medium">中危</label>
                    </div>
                    <div class="severity-option_safe low_safe"
                         :class="{ 'selected': formData.severity === 'low' }"
                         @click="selectSeverity('low')">
                      <input type="radio" id="severity-low" name="severity" value="low" 
                             :disabled="isFormDisabled" v-model="formData.severity" />
                      <label for="severity-low">低危</label>
                    </div>
                  </div>
                </div>

                <div class="form-group_safe">
                  <label for="vulnerabilityDesc" class="form-label_safe">漏洞详细描述</label>
                  <textarea id="vulnerabilityDesc" class="form-control_safe" required
                            placeholder="请详细描述漏洞的发现过程、利用方式以及可能造成的影响"
                            :disabled="isFormDisabled" v-model="formData.vulnerabilityDesc"></textarea>
                </div>

                <div class="form-group_safe">
                  <label for="reproduceSteps" class="form-label_safe">重现步骤</label>
                  <textarea id="reproduceSteps" class="form-control_safe" required
                            placeholder="1. 第一步操作...
2. 第二步操作...
3. 观察到的结果..."
                            :disabled="isFormDisabled" v-model="formData.reproduceSteps"></textarea>
                </div>

                <div class="form-group_safe">
                  <label for="additionalInfo" class="form-label_safe">附加信息</label>
                  <textarea id="additionalInfo" class="form-control_safe"
                            placeholder="任何其他有助于我们理解问题的信息（可选）"
                            :disabled="isFormDisabled" v-model="formData.additionalInfo"></textarea>
                </div>

                <div class="form-group_safe">
                  <button type="submit" class="btn_safe btn-block_safe" :disabled="isFormDisabled">
                    <i class="fas fa-paper-plane"></i> 提交漏洞报告
                  </button>
                  <p class="form-closed-notice">
                    <i class="fas fa-info-circle"></i> 此提交通道暂时关闭，请通过右侧联系方式提交报告
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div class="sidebar_safe">
            <!-- 安全公告 -->
            <div class="card_safe">
              <h3 class="section-title_safe">
                <i class="fas fa-bullhorn"></i> 安全公告
              </h3>
              <ul class="disclosure-list_safe">
                <li class="disclosure-item_safe" v-for="(announcement, index) in announcements" :key="index">
                  <div class="disclosure-title_safe">
                    <i :class="announcement.icon" :style="{ color: announcement.color }"></i>
                    {{ announcement.title }}
                    <span class="disclosure-date_safe">{{ announcement.date }}</span>
                  </div>
                  <div class="disclosure-description_safe">
                    {{ announcement.description }}
                  </div>
                </li>
              </ul>
            </div>

            <!-- 漏洞奖励计划 -->
            <div class="card_safe">
              <h3 class="section-title_safe">
                <i class="fas fa-gift"></i> 漏洞奖励计划
              </h3>
              <div class="alert-info_safe">
                <strong><i class="fas fa-award"></i> 我们感谢您的贡献！</strong>
                对于高质量的安全漏洞报告，我们可能会提供奖励或公开致谢。
              </div>
              <p>奖励标准包括但不限于：</p>
              <ul>
                <li v-for="(criterion, index) in rewardCriteria" :key="index">{{ criterion }}</li>
              </ul>
            </div>

            <!-- 联系我们 -->
            <div class="card_safe">
              <h3 class="section-title_safe">
                <i class="fas fa-envelope"></i> 联系我们
              </h3>
              <div class="contact-info_safe">
                <div class="contact-method_safe" v-for="(contact, index) in contactMethods" :key="index">
                  <i :class="contact.icon"></i>
                  <span>{{ contact.details }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer>
      <div>
        <p>&copy; 2025 ZIT-CoCo-Community | 安全部门</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'VulnerabilityReport',
  data() {
    return {
      // 表单是否禁用（保持关闭状态）
      isFormDisabled: true,
      
      // 表单数据
      formData: {
        reporterName: '',
        reporterEmail: '',
        affectedComponent: '',
        severity: '',
        vulnerabilityDesc: '',
        reproduceSteps: '',
        additionalInfo: ''
      },
      
      // 安全公告数据
      announcements: [
        {
          title: 'Github',
          date: '2025-05-19',
          description: '修复了一个意外通过Github无法访问作品的BUG',
          icon: 'fas fa-check-circle',
          color: '#2ecc71'
        },
        {
          title: '无法访问',
          date: '2025-09-24',
          description: '我们正在调查一个可能影响用户访问的问题。更多信息将在确认后公布。',
          icon: 'fas fa-exclamation-triangle',
          color: '#e74c3c'
        }
      ],
      
      // 奖励标准
      rewardCriteria: [
        '漏洞的严重程度',
        '报告的清晰度和完整性',
        '漏洞的潜在影响范围'
      ],
      
      // 联系方式
      contactMethods: [
        {
          icon: 'fas fa-envelope',
          details: 'coco-community-security-center@zit.email'
        },
        {
          icon: 'fas fa-comment-alt',
          details: 'Signal: +86 181 3824 7313'
        },
        {
          icon: 'fas fa-comment-alt',
          details: 'Wechat: hi_liu-xiaozhen'
        },
        {
          icon: 'fas fa-comment-alt',
          details: 'QQ:1967237096'
        }
      ]
    }
  },
  methods: {
    // 选择漏洞严重程度
    selectSeverity(level) {
      if (!this.isFormDisabled) {
        this.formData.severity = level;
      }
    },
    
    // 处理表单提交
    handleSubmit() {
      // 表单提交处理逻辑（当前已禁用）
      if (this.isFormDisabled) {
        this.showNotification('提交通道暂时关闭，请通过右侧联系方式报告安全问题。', 'warning');
        return;
      }
      
      // 验证表单
      if (!this.validateForm()) {
        this.showNotification('请填写所有必填字段。', 'error');
        return;
      }
      
      // 模拟提交过程
      this.showNotification('正在提交报告，请稍候...', 'info');
      
      // 实际应用中这里应该是API调用
      setTimeout(() => {
        this.showNotification('报告提交成功！我们的安全团队会尽快处理。', 'success');
        this.resetForm();
      }, 2000);
    },
    
    // 验证表单
    validateForm() {
      const { reporterName, reporterEmail, affectedComponent, severity, vulnerabilityDesc, reproduceSteps } = this.formData;
      
      if (!reporterName.trim() || !reporterEmail.trim() || !affectedComponent.trim() || 
          !severity || !vulnerabilityDesc.trim() || !reproduceSteps.trim()) {
        return false;
      }
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reporterEmail)) {
        return false;
      }
      
      return true;
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        reporterName: '',
        reporterEmail: '',
        affectedComponent: '',
        severity: '',
        vulnerabilityDesc: '',
        reproduceSteps: '',
        additionalInfo: ''
      };
    },
    
    // 显示通知
    showNotification(message, type = 'info') {
      // 在实际应用中，这里可以使用更复杂的通知系统
      alert(`${type.toUpperCase()}: ${message}`);
    },
    
    // 检查表单状态（用于未来可能重新开放表单）
    checkFormStatus() {
      // 在实际应用中，这里可以调用API检查表单是否开放
      // 目前保持关闭状态
      this.isFormDisabled = true;
    }
  },
  mounted() {
    // 组件加载时检查表单状态
    this.checkFormStatus();
  }
}
</script>

<style>
@import '@/assets/style/safe/style.css';
</style>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '紧急安全报告中心|ZIT-CoCo-Community',
  meta: [
    {content: '这是CoCo-Community的紧急报告中心，如果有任何紧急事故，请向我们报告。' }
  ]
})
</script>