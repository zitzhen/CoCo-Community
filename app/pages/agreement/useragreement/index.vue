<template>
  <div>
    <div class="card-agreement" id="content">
      <div v-html="fullContent" class="content"></div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

// 直接嵌入完整的用户协议内容
// 只能先这样，其他方法调不好:(
const fullContent = `
<h1>CoCo-Community用户协议</h1>
<p><strong>最后更新日期：2025年11月22日</strong></p>

<h2>总则</h2>
<p>CoCo-Community（以下简称“本社区”）是由小圳工作室开发的编程猫CoCo编辑器第三方开源社区，旨在弥补官方及其他第三方社区的不足。为保障社区安全及规范用户行为，<strong>请务必仔细阅读本协议</strong>。<strong>未满14周岁的未成年人</strong>应在监护人陪同下阅读，并在监护人明确同意后使用服务。</p>

<h3>第一章 用户身份验证与使用</h3>
<ol>
  <li><strong>登录方式</strong>：本社区<strong>不提供独立账号注册系统</strong>，您必须使用<strong>GitHub账户</strong>登录，否则您不能使用除发表和评论的功能。此操作代表您：
    <ul>
      <li>同意遵守 [GitHub服务条款](https://docs.github.com/zh/site-policy/github-terms/github-terms-of-service) 及 [GitHub隐私声明](https://docs.github.com/zh/site-policy/privacy-policies/github-privacy-statement)；</li>
      <li>确认具备使用GitHub的法定资格（通常需年满13周岁）。</li>
    </ul>
  </li>
  <li><strong>信息获取范围</strong>：通过GitHub OAuth授权，本社区仅获取您<strong>公开的基础信息</strong>（用户名、头像）。<strong>我们不会存储您的GitHub密码或私有数据</strong>。</li>
  <li><strong>用户义务</strong>：
    <table>
      <tr><th>行为要求</th><th>禁止事项</th></tr>
      <tr><td>保管好GitHub账户安全</td><td>发布违法、暴力、欺诈、侵权内容</td></tr>
      <tr><td>遵守中国法律法规及“七条底线”</td><td>破坏社区运行（如黑客攻击、刷屏）</td></tr>
      <tr><td>尊重他人，文明交流</td><td>将社区用于商业盈利活动</td></tr>
      <tr><td><strong>未成年人需监护人指导使用</strong></td><td>上传未授权版权内容</td></tr>
    </table>
  </li>
  <li><strong>责任声明</strong>：
    <ul>
      <li>通过您GitHub账户进行的所有操作视为本人行为；</li>
      <li>如发现账户异常，请立即联系GitHub并修改凭证。</li>
    </ul>
  </li>
</ol>

<h3>第二章 内容发布与知识产权</h3>
<h4>一、社区开源协议</h4>
<p>本社区平台代码遵循<strong>AGPL-3.0许可证</strong></p>

<h4>二、用户内容许可规则</h4>
<ol>
  <li><strong>代码/项目类内容</strong>：
    <ul>
      <li>✅ <strong>强烈建议</strong> 上传时声明开源许可证（如MIT、GPL等）；</li>
      <li>⚠️ <strong>未声明许可证</strong> 的内容，我们视为保留所有权利；</li>
      <li>其他用户可在遵守对应许可证前提下<strong>学习、修改、分发</strong>您的代码。</li>
    </ul>
  </li>
  <li><strong>非代码类内容</strong>（教程/评论/图片等）：您授予社区<strong>非独占、全球性、免费的许可</strong>，允许：
    <ul>
      <li>存储、展示、适配性修改；</li>
      <li>出于社区运营目的的传播。</li>
    </ul>
  </li>
  <li><strong>商业禁令重申</strong>：<strong>禁止将以下内容用于商业目的</strong>：
    <ul>
      <li>其他用户上传无许可证的作品或用户声明严禁用于商业用途的作品。</li>
    </ul>
  </li>
</ol>

<h3>第三章 社区管理</h3>
<ol>
  <li><strong>内容管理权</strong>：小圳工作室有权<strong>无需通知</strong>删除或屏蔽以下内容：
    <ul>
      <li>违反法律法规或本协议；</li>
      <li>危害未成年人身心健康；</li>
      <li>破坏社区秩序（如垃圾广告、恶意代码）。</li>
    </ul>
  </li>
  <li><strong>违规处理</strong>：违规用户将面临：→ 警告 → 功能限制 → 永久封禁（保留追究法律责任的权利）</li>
  <li><strong>免责声明</strong>：
    <table>
      <tr><th>社区不承担责任的情形</th></tr>
      <tr><td>因不可抗力/黑客攻击导致的服务中断</td></tr>
      <tr><td>用户依赖社区内容造成的损失</td></tr>
      <tr><td>第三方链接的内容或风险</td></tr>
      <tr><td><strong>服务按“现状”提供，不承诺无缺陷</strong></td></tr>
    </table>
  </li>
</ol>

<h3>第四章 协议修改与终止</h3>
<ol>
  <li><strong>修改协议</strong>：修改后的协议将通过<strong>社区公告</strong>发布。若您继续使用服务，视为接受新条款。</li>
  <li><strong>终止权利</strong>：
    <ul>
      <li>您可随时停止使用服务；</li>
      <li>小圳工作室有权因业务调整或用户违规终止服务。</li>
    </ul>
  </li>
</ol>

<h3>第五章 法律与其他</h3>
<ol>
  <li><strong>管辖法律</strong>：本协议适用<strong>中华人民共和国法律</strong>。争议由小圳工作室所在地法院管辖。</li>
  <li><strong>协议独立性</strong>：部分条款无效不影响其余条款效力。</li>
  <li><strong>完整协议</strong>：本协议取代过往所有口头或书面约定。</li>
</ol>

<h2>重要确认</h2>
<p><strong>使用本社区即表示您确认</strong>：</p>
<ol>
  <li>理解登录需绑定GitHub账户并遵守其协议；</li>
  <li>已知晓社区采用AGPL-3.0；</li>
  <li>已知晓本社区每个作品都有许可证。</li>
  <li><strong>未成年人已获监护人同意</strong>。</li>
</ol>

<p><strong>⚠️ 如您不同意以上任何条款，请勿使用GitHub账户登录或浏览本社区。</strong></p>
<p><strong>小圳工作室 保留最终解释权</strong></p>
`

useHead({
  title: '用户协议|CoCo-Community|适用于CoCo-Community的用户协议条款',
  meta: [
    { content: '这是适用于ZIT-CoCo-Community的用户协议及条款。' }
  ]
})
</script>

<style scoped>
@import '../../../assets/style/agreement/style.css';
@import '../../../assets/style/home/Loading.css';
@import url(@/assets/css/dark.css);

@media (prefers-color-scheme: dark) {
  .content {
    color: black;
  }
}
</style>