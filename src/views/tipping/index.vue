<template>
    <h1 style="text-align: center;">欢迎您支持ZIT-CoCo-Community</h1>
    <div class="container">
        <header>
            <h2>感谢您支持ZIT-CoCo-Community</h2>
            <div class="subtitle">您的每一份打赏都是ZIT-CoCo-Community前进的动力</div>
        </header>
        
    <div class="content">
        <div class="intro">
            <p>如果您喜欢ZIT-CoCo-Community，可以通过下方方式打赏支持</p>
            <p>感谢您的慷慨！</p>
        </div>
            
        <div class="payment-methods">
            <div class="method" :class="{ active: activeMethod === 'wechat' }" data-method="wechat" @click="setActiveMethod('wechat')">
                <div class="method-icon">
                    <img src="../../assets/images/tipping/WechatPaylogo.png" alt="微信支付">
                </div>
                <div class="method-name">微信支付</div>
                <div class="method-desc">扫码打赏</div>
            </div>
            
            <div class="method" :class="{ active: activeMethod === 'alipay' }" data-method="alipay" @click="setActiveMethod('alipay')">
                <div class="method-icon">
                    <img src="../../assets/images/tipping/Alipaylogo.png" alt="支付宝">
                </div>
                <div class="method-name">支付宝</div>
                <div class="method-desc">扫码打赏</div>
            </div>
            
            <div class="method" :class="{ active: activeMethod === 'qq' }" data-method="qq" @click="setActiveMethod('qq')">
                <div class="method-icon">
                    <img src="../../assets/images/tipping/QQlogo.png" alt="QQ钱包">
                </div>
                <div class="method-name">QQ钱包</div>
                <div class="method-desc">扫码打赏</div>
            </div>
        </div>
        
        <div id="wechat-qr" class="qr-container" :class="{ active: activeMethod === 'wechat' }">
            <div class="qr-code">
                <img src="../../assets/images/tipping/Wechatpay.png" alt="微信收款码">
            </div>
            <div class="hint">打开微信扫一扫，向我们打赏</div>
        </div>
        
        <div id="alipay-qr" class="qr-container" :class="{ active: activeMethod === 'alipay' }">
            <div class="qr-code">
                <img src="../../assets/images/tipping/Alipay.png" alt="支付宝收款码">
            </div>
            <div class="hint">打开支付宝扫一扫，向我们打赏</div>
        </div>
        
        <div id="qq-qr" class="qr-container" :class="{ active: activeMethod === 'qq' }">
            <div class="qr-code">
                <img src="../../assets/images/tipping/QQpay.png" alt="QQ收款码">
            </div>
            <div class="hint">打开QQ扫一扫，向我们打赏</div>
        </div>
    </div>
        <div class="footer">
            <p>感谢您的支持与鼓励！</p>
        </div>
    </div>
</template>

<style scoped>
@import '../../assets/style/tipping/style.css';
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'

// 响应式数据
const activeMethod = ref('wechat')

// 设置激活的支付方式
const setActiveMethod = (method) => {
    activeMethod.value = method
}

// 默认设置微信支付为激活状态
onMounted(() => {
    activeMethod.value = 'wechat'
})

useHead({
  title: '打赏|CoCo-Community|欢迎向ZIT-CoCo-Community打赏',
  meta: [
    {content: '欢迎您支持ZIT-CoCo-Community，为我们的开发人员点上一杯咖啡吧~' }
  ]
})
</script>
