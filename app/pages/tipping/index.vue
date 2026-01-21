<template>
    <div class="tipping-page">
        <div class="hero-section">
            <h1 class="hero-title">欢迎您支持 ZIT-CoCo-Community</h1>
            <p class="hero-subtitle">您的每一份打赏都是我们前进的动力 💝</p>
        </div>
        
        <div class="container">
            <header class="page-header">
                <h2>感谢您支持 ZIT-CoCo-Community</h2>
                <div class="subtitle">为我们的开发人员点上一杯咖啡吧~ ☕</div>
            </header>
            
            <div class="tipping_content">
                <div class="tipping_intro">
                    <p>如果您喜欢 ZIT-CoCo-Community，可以通过下方方式打赏支持</p>
                    <p class="highlight">感谢您的慷慨支持！ 🙏</p>
                </div>
                    
                <div class="payment-methods">
                    <div class="method" :class="{ active: activeMethod === 'wechat' }" @click="setActiveMethod('wechat')">
                        <div class="method-icon wechat">
                            <img src="~/assets/images/tipping/WechatPaylogo.png" alt="微信支付" loading="lazy">
                        </div>
                        <div class="method-name">微信支付</div>
                        <div class="method-desc">扫码打赏</div>
                        <div class="method-badge" v-if="activeMethod === 'wechat'">✓ 已选择</div>
                    </div>
                    
                    <div class="method" :class="{ active: activeMethod === 'alipay' }" @click="setActiveMethod('alipay')">
                        <div class="method-icon alipay">
                            <img src="~/assets/images/tipping/Alipaylogo.png" alt="支付宝" loading="lazy">
                        </div>
                        <div class="method-name">支付宝</div>
                        <div class="method-desc">扫码打赏</div>
                        <div class="method-badge" v-if="activeMethod === 'alipay'">✓ 已选择</div>
                    </div>
                    
                    <div class="method" :class="{ active: activeMethod === 'qq' }" @click="setActiveMethod('qq')">
                        <div class="method-icon qq">
                            <img src="~/assets/images/tipping/QQlogo.png" alt="QQ钱包" loading="lazy">
                        </div>
                        <div class="method-name">QQ钱包</div>
                        <div class="method-desc">扫码打赏</div>
                        <div class="method-badge" v-if="activeMethod === 'qq'">✓ 已选择</div>
                    </div>
                </div>
                
                <div class="qr-section">
                    <div id="wechat-qr" class="qr-container" :class="{ active: activeMethod === 'wechat' }">
                        <div class="qr-header">
                            <h3>微信支付二维码</h3>
                            <div class="qr-hint">打开微信扫一扫</div>
                        </div>
                        <div class="qr-code">
                            <img src="~/assets/images/tipping/Wechatpay.png" alt="微信收款码" loading="lazy">
                        </div>
                        <div class="qr-instruction">
                            <p>1. 打开微信扫一扫</p>
                            <p>2. 扫描上方二维码</p>
                            <p>3. 输入打赏金额</p>
                        </div>
                    </div>
                    
                    <div id="alipay-qr" class="qr-container" :class="{ active: activeMethod === 'alipay' }">
                        <div class="qr-header">
                            <h3>支付宝二维码</h3>
                            <div class="qr-hint">打开支付宝扫一扫</div>
                        </div>
                        <div class="qr-code">
                            <img src="~/assets/images/tipping/Alipay.png" alt="支付宝收款码" loading="lazy">
                        </div>
                        <div class="qr-instruction">
                            <p>1. 打开支付宝扫一扫</p>
                            <p>2. 扫描上方二维码</p>
                            <p>3. 输入打赏金额</p>
                        </div>
                    </div>
                    
                    <div id="qq-qr" class="qr-container" :class="{ active: activeMethod === 'qq' }">
                        <div class="qr-header">
                            <h3>QQ钱包二维码</h3>
                            <div class="qr-hint">打开QQ扫一扫</div>
                        </div>
                        <div class="qr-code">
                            <img src="~/assets/images/tipping/QQpay.png" alt="QQ收款码" loading="lazy">
                        </div>
                        <div class="qr-instruction">
                            <p>1. 打开QQ扫一扫</p>
                            <p>2. 扫描上方二维码</p>
                            <p>3. 输入打赏金额</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="tipping_footer">
                <div class="thank-you">
                    <div class="heart">❤️</div>
                    <p>感谢您的支持与鼓励！</p>
                    <p class="footer-note">您的支持将帮助我们持续改进和开发更多功能</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '~/assets/style/tipping/style.css';
@import url(~/assets/css/dark.css);
</style>

<script setup>
// 响应式数据
const activeMethod = ref('wechat')

// 设置激活的支付方式
const setActiveMethod = (method) => {
    activeMethod.value = method
}

// SEO配置
useSeoMeta({
  title: '打赏 | ZIT-CoCo-Community | 欢迎支持我们的开发',
  description: '欢迎您支持ZIT-CoCo-Community，为我们的开发人员点上一杯咖啡吧~ 您的每一份打赏都是我们前进的动力。',
  ogTitle: '支持 ZIT-CoCo-Community 开发',
  ogDescription: '通过微信支付、支付宝或QQ钱包支持我们的开源项目开发',
  ogImage: '~/assets/images/tipping/icon.png',
  twitterCard: 'summary_large_image'
})
</script>