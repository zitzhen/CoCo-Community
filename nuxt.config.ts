import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-12',
  nitro: {
    preset: 'cloudflare_pages',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: 'ZIT-CoCo-Community|CoCo编辑器的小圳社区|自定义控件下载中心',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'baidu-site-verification', content: 'codeva-Nc3ckBEoE0' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.png' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
        },
      ],
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7240019936857616',
          crossorigin: 'anonymous',
        },
        {
          innerHTML: `
(function() {
  const hostname = window.location.hostname;
  const isDev =
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.endsWith('.test') ||
    /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(hostname);

  if (isDev) {
    console.log("开发环境 - 统计已禁用");
    window.dataLayer = window.dataLayer || [];
    window._hmt = window._hmt || [];
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };
    window.clarity = window.clarity || function() {};
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-0WPS98EZ34');

  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-0WPS98EZ34';
  document.head.appendChild(ga);

  window._hmt = window._hmt || [];
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?ae1ade4c15fc8aa67d79f24de0ce05e3";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);

  var cf = document.createElement('script');
  cf.defer = true;
  cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cf.setAttribute('data-cf-beacon', '{"token": "d8055c442d5e48bf8f293ff8554998f9"}');
  document.head.appendChild(cf);

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "uhjtx2ek1y");
})();
          `,
        },
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
