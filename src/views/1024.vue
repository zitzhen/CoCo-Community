<template>
<div class="a1024card" v-show="a1024Banner">
  <div class="Positioning"></div>
  <h2 class="a1024title">🎉今天是我们的节日——1024🎉</h2>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>

<div class="a1024card" v-show="Next1024">
  <div class="Positioning"></div>
  <h2 class="a1024title">距离下一次1024还有</h2>
  <div class="countdown-wrapper">
    <div class="countdown-container">
      <div class="countdown-item">
        <span class="countdown-number">{{ days }}</span>
        <span class="countdown-label">天</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ hours }}</span>
        <span class="countdown-label">时</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ minutes }}</span>
        <span class="countdown-label">分</span>
      </div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item">
        <span class="countdown-number">{{ seconds }}</span>
        <span class="countdown-label">秒</span>
      </div>
    </div>
  </div>
  <p class="a1024text">快来同我们一起庆祝我们的程序员节</p>
</div>

<div class="card-1024">
<h1>1024 的起源：从二进制到程序员的节日</h1>

<p>在计算机世界中，<strong>1024</strong> 这个数字有着特殊的意义。它不仅仅是一个普通的整数，更代表了计算机文化、技术逻辑与程序员精神的结合。许多人在每年的 <strong>10 月 24 日（10·24）</strong> 都会庆祝"程序员节"，但这个节日的背后，其实源自一个简单却深刻的数学关系。</p>

<hr>

<h2>一、从二进制说起</h2>

<p>计算机是以 <strong>二进制（Binary）</strong> 方式工作的世界。与人类使用的十进制不同，计算机中的一切信息都用 0 和 1 表示。</p>

<p>在这种体系下，单位换算也变得不同：</p>

<pre>
1KB = 1024B
1MB = 1024KB
1GB = 1024MB
</pre>

<p>为什么不是整整 1000？<br>
因为计算机的世界以 2 为底，而 <strong>1024 = 2¹⁰</strong>。<br>
也就是说，1024 代表了 <strong>"一千"在二进制世界中的近似值</strong>。这个数字的存在，是计算机科学中最经典的符号之一。</p>

<hr>

<h2>二、程序员节的由来</h2>

<p>2000 年代初期，随着程序员文化在互联网传播，人们逐渐希望有一个属于自己的节日。有人提出用"<strong>1024</strong>"来代表这一群体：</p>

<ul>
  <li>因为 1024 是 <strong>2 的整数次幂</strong>，象征着计算机的底层逻辑。</li>
  <li>而日期 <strong>10 月 24 日（10.24）</strong> 与这个数字完美契合。</li>
</ul>

<p>于是，"<strong>1024 程序员节</strong>"就这样在开发者社区中诞生。<br>
这个节日没有官方的设立，却凭借程序员的自发传播成为全球性的文化象征。</p>

<hr>

<h2>三、属于技术人的浪漫</h2>

<p>每年的 10 月 24 日，许多互联网公司会推出庆祝活动、发放纪念礼物或举办技术分享。<br>
而在开发者心中，1024 代表的不仅是一个数字，更是一种精神——</p>

<blockquote>
<strong>对逻辑的热爱、对代码的坚持、对世界的改变。</strong>
</blockquote>

<p>正如许多程序员喜欢开玩笑说的那样：</p>
<blockquote>"我们的浪漫，不是玫瑰和烛光，而是 0 与 1、bug 与 commit。"</blockquote>

<hr>

<h2>四、结语</h2>

<p>1024 是计算机世界的基石，也是程序员们共同的信仰符号。<br>
它连接了数学、科技与人文精神，提醒我们：<br>
无论技术如何发展，背后的逻辑与热爱从未改变。</p>

<p>在这个数字的背后，藏着的是整个互联网时代的灵魂。<br>
<strong>祝所有热爱代码的人，1024 快乐！</strong></p>
</div>
</template>

<style>
@import url(@/assets/style/1024/style.css);
@import url(@/assets/css/1024.css);
@import url(@/assets/css/dark.css);
</style>

<script>

function isOctober24th() {
    const today = new Date();
    return today.getMonth() === 9 && today.getDate() === 24;
}

function getNextOctober24th() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextOctober24th = new Date(currentYear, 9, 24); // 10月是索引9
    
    // 如果今年的10月24日已经过了，就计算明年的
    if (now > nextOctober24th) {
        return new Date(currentYear + 1, 9, 24);
    }
    return nextOctober24th;
}

export default {
  name: '404',
  data() {
    return {
      a1024Banner:false,
      Next1024:false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      countdownInterval: null
    }
  },
  mounted() {
  if (isOctober24th()){
    this.a1024Banner = true;
    this.Next1024 = false;
    }else{
    this.a1024Banner = false;
    this.Next1024 = true;
    this.startCountdown();
    }
  },
  methods: {
    startCountdown() {
      this.updateCountdown();
      this.countdownInterval = setInterval(this.updateCountdown, 1000);
    },
    updateCountdown() {
      const now = new Date();
      
      // 检查是否已经进入10月24日
      if (isOctober24th()) {
        // 如果是10月24日，停止倒计时并显示节日页面
        this.stopCountdown();
        this.a1024Banner = true;
        this.Next1024 = false;
        return;
      }
      
      const nextOctober24th = getNextOctober24th();
      const diff = nextOctober24th - now;
      
      // 计算天、小时、分钟、秒
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    },
    stopCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }
  },
  beforeDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
</script>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: '欢庆1024',
  meta: [
    {content: `1024是程序员节，让我们一起欢快程序员节。1024 是计算机世界的基石，也是程序员们共同的信仰符号。
它连接了数学、科技与人文精神，提醒我们：
无论技术如何发展，背后的逻辑与热爱从未改变。在这个数字的背后，藏着的是整个互联网时代的灵魂。
祝所有热爱代码的人，1024 快乐！` }
  ]
})
</script>