// 控件类型定义
const types = {
  type: 'LST_GSHTML_SC',
  title: '生成指定格式的html',
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z',
  isInvisibleWidget: true,
  isGlobalWidget: true,
  properties: [],
  methods: [
    {
      key: 'generateHtml',
      label: '生成指定格式的HTML',
      tooltip: '根据输入内容生成指定的格式化的HTML',
      params: [
        {
          key: 'inputContent',
          label: '输入内容',
          valueType: 'string',
          defaultValue: '',
        },
        {
          key: 'styleType',
          label: '选择风格',
          valueType: 'string',
          defaultValue: 'style1',
          dropdown: [
            { label: '简约风格', value: 'style1' },
            { label: '卡片风格', value: 'style2' }
          ]
        }
      ],
      valueType: 'string',
    },
    {
      key: 'getUsage',
      label: '获取使用方式',
      tooltip: '返回控件的使用说明',
      params: [],
      valueType: 'string',
    }
  ],
  events: [],
};

class GenerateHtmlWidget extends InvisibleWidget {
  constructor(props) {
    super(props);
    
    // 预定义两种风格模板
    this._templates = {
      style1: this._createStyle1Template(),
      style2: this._createStyle2Template()
    };
  }

  _createStyle1Template() {
    return {
      mainStart: `<div class="container" style="
        width:100%;
        height:100%;
        background:#f5f5f5;
        padding:12px;
        overflow-y: auto;
        scroll-behavior: smooth;
        scrollbar-width: thin;
        scrollbar-color: #c1c1c1 #f5f5f5;">
        <style>
          .container::-webkit-scrollbar { width: 8px; }
          .container::-webkit-scrollbar-track { background: #f5f5f5; }
          .container::-webkit-scrollbar-thumb { 
            background: #c1c1c1; 
            border-radius: 4px;
          }
        </style>`,
      itemTemplate: (index, parts) => {
        const itemId = index + 1;
        const [avatar, username, ip, title, titleColor, content, time] = parts;
        return `
          <div class="item" id="item${itemId}" style="margin-bottom:12px;background:white;padding:16px;scroll-margin:16px;">
            <div style="display:flex;">
              <img id="item${itemId}-avatar" src="${avatar}" 
                   style="width:40px;height:40px;border-radius:50%;margin-right:12px;"
                   onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCIgeT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+MToxPC90ZXh0Pjwvc3ZnPg'">
              <div style="flex:1;">
                <div style="display:flex;align-items:center;margin-bottom:6px;">
                  <span id="item${itemId}-username" style="font-weight:600;margin-right:8px;">${username}</span>
                  <span id="item${itemId}-ip" style="color:#666;font-size:12px;">${ip}</span>
                </div>
                ${title ? `<div id="item${itemId}-title" style="background:${titleColor};color:white;padding:2px 8px;border-radius:4px;display:inline-block;margin-bottom:8px;">${title}</div>` : ''}
                <div id="item${itemId}-content" style="color:#333;">${content}</div>
                <div id="item${itemId}-time" style="color:#999;font-size:12px;margin-top:8px;">${time}</div>
              </div>
            </div>
          </div>`
      },
      mainEnd: `</div>`
    };
  }

  _createStyle2Template() {
    return {
      mainStart: `<div class="container" style="
        width:100%;
        height:100%;
        background:linear-gradient(135deg,#f8f9fa,#e9ecef);
        padding:20px;
        border-radius:12px;
        overflow-y: auto;
        scroll-behavior: smooth;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;">
        <style>
          .container::-webkit-scrollbar { display: none; }
        </style>`,
      itemTemplate: (index, parts) => {
        const itemId = index + 1;
        const [avatar, username, ip, title, titleColor, content, time] = parts;
        return `
          <div class="item" id="item${itemId}" 
               style="margin-bottom:16px;background:white;border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s;scroll-margin:16px;">
            <div style="display:flex;align-items:flex-start;">
              <div style="position:relative;margin-right:16px;">
                <img id="item${itemId}-avatar" src="${avatar}" 
                     style="width:48px;height:48px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.1);"
                     onerror="this.style.opacity='0'">
              </div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <div>
                    <span id="item${itemId}-username" style="font-weight:600;font-size:16px;">${username}</span>
                    <span id="item${itemId}-ip" style="background:#f1f3f5;color:#6c757d;padding:2px 8px;border-radius:4px;margin-left:8px;font-size:12px;">${ip}</span>
                  </div>
                  <span id="item${itemId}-time" style="color:#adb5bd;font-size:12px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" style="display:inline-block;vertical-align:-2px;">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${time}
                  </span>
                </div>
                ${title ? `<div id="item${itemId}-title" style="background:${titleColor};color:white;padding:4px 12px;border-radius:20px;display:inline-block;margin-bottom:12px;font-size:14px;">${title}</div>` : ''}
                <div id="item${itemId}-content" style="color:#495057;line-height:1.5;">${content}</div>
              </div>
            </div>
          </div>`
      },
      mainEnd: `</div>`
    };
  }

  generateHtml(inputContent, styleType = 'style1') {
    const template = this._templates[styleType] || this._templates.style1;
    const items = inputContent.split('&&*&&').filter(Boolean);
    const buffer = [template.mainStart];
    
    items.forEach((item, index) => {
      const parts = item.split('&*&');
      if (parts.length >= 7) {
        buffer.push(template.itemTemplate(index, parts));
      }
    });
    
    buffer.push(template.mainEnd);
    return buffer.join('');
  }

  getUsage() {
    return `使用说明：
1. 数据格式：头像链接&*&用户名&*&IP地址&*&称号&*&称号颜色&*&评论内容&*&时间
2. 使用"&&*&&"分割不同条目
3. 自动生成带层级ID的结构（如item1-avatar、item1-title）
4. 可通过下拉选择简约风格/卡片风格
5. 技术支持：垃圾桶（575244421@qq.com）`;
  }
}

exports.types = types;
exports.widget = GenerateHtmlWidget;
console.log('作者：垃圾桶');