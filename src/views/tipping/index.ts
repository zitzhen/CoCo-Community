// 定义支付方式类型
export type PaymentMethod = 'wechat' | 'alipay' | 'qq';

// 定义支付方式容器接口
export interface PaymentMethodContainers {
  [key: string]: HTMLElement | null;
  wechat: HTMLElement | null;
  alipay: HTMLElement | null;
  qq: HTMLElement | null;
}

// 初始化支付方式切换功能
export function initializePaymentMethods(): void {
  document.addEventListener('DOMContentLoaded', function() {
    const methods = document.querySelectorAll('.method');
    const qrContainers: PaymentMethodContainers = {
      'wechat': document.getElementById('wechat-qr'),
      'alipay': document.getElementById('alipay-qr'),
      'qq': document.getElementById('qq-qr')
    };
    
    // 默认显示微信支付
    if (methods.length > 0 && qrContainers.wechat) {
      methods[0].classList.add('active');
      qrContainers.wechat.classList.add('active');
    }
    
    methods.forEach(method => {
      method.addEventListener('click', function() {
        // 移除所有active类
        methods.forEach(m => m.classList.remove('active'));
        Object.values(qrContainers).forEach(qr => {
          if (qr) qr.classList.remove('active');
        });
        
        // 添加当前active类
        const methodType = this.getAttribute('data-method') as PaymentMethod;
        this.classList.add('active');
        if (qrContainers[methodType]) {
          qrContainers[methodType].classList.add('active');
        }
      });
    });
  });
}