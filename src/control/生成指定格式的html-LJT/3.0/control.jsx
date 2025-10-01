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
    
    // 仅保留极简质感风格模板
    this._templates = {
      style1: this._createMaterialDesignTemplate()
    };
  }

  _createMaterialDesignTemplate() {
    return {
      mainStart: `<div class="material-container" style="
        width:100%;
        height:100%;
        background:#fafafa;
        padding:16px;
        overflow-y: auto;
        scroll-behavior: smooth;
        scrollbar-width: thin;
        scrollbar-color: #90a4ae #f5f5f5;
        position:relative;">
        <style>
          .material-container {
            --primary-color: #2196f3;
            --surface-color: #ffffff;
            --text-primary: #212121;
            --text-secondary: #757575;
          }
          .material-container::-webkit-scrollbar { 
            width: 6px; 
            height: 6px;
          }
          .material-container::-webkit-scrollbar-thumb {
            background: #90a4ae;
            border-radius: 4px;
          }
          .material-container::-webkit-scrollbar-track {
            background: #f5f5f5;
          }
        </style>`,
      itemTemplate: (index, parts) => {
        const itemId = index + 1;
        const [avatar, username, ip, title, titleColor, content, time] = parts;
        return `
          <div class="material-card" id="item${itemId}" style="
            margin-bottom:16px;
            background:var(--surface-color);
            border-radius:16px;
            padding:24px;
            box-shadow:0 4px 12px rgba(0,0,0,0.08);
            transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);
            scroll-margin:16px;
            &:hover {
              transform:translateY(-2px);
            }">
            <div style="display:flex;gap:16px;">
              <div style="position:relative;">
                <div style="
                  width:56px;
                  height:56px;
                  border-radius:50%;
                  background:linear-gradient(45deg,#e3f2fd,#bbdefb);
                  overflow:hidden;
                  position:relative;">
                  <img id="item${itemId}-avatar" 
                       src="${avatar}"
                       style="
                         width:100%;
                         height:100%;
                         object-fit:cover;
                         border-radius:50%;
                         position:relative;
                         z-index:1;"
                       onerror="this.style.opacity='0'">
                </div>
                ${title ? `<div id="item${itemId}-title" style="
                  position:absolute;
                  bottom:-8px;
                  left:50%;
                  transform:translateX(-50%);
                  background:${titleColor};
                  color:white;
                  padding:4px 12px;
                  border-radius:20px;
                  font-size:12px;
                  font-weight:500;
                  box-shadow:0 2px 6px rgba(0,0,0,0.1);
                  white-space:nowrap;">
                  ${title}
                </div>` : ''}
              </div>
              
              <div style="flex:1;min-width:0;">
                <div style="display:flex;gap:8px;align-items:baseline;margin-bottom:12px;">
                  <h3 id="item${itemId}-username" style="
                    font-size:16px;
                    font-weight:600;
                    color:var(--text-primary);
                    margin:0;">
                    ${username}
                  </h3>
                  <span id="item${itemId}-ip" style="
                    font-size:12px;
                    color:var(--text-secondary);
                    background:#eceff1;
                    padding:4px 8px;
                    border-radius:4px;">
                    ${ip}
                  </span>
                </div>
                
                <p id="item${itemId}-content" style="
                  color:var(--text-primary);
                  font-size:14px;
                  line-height:1.6;
                  margin:0 0 12px 0;">
                  ${content}
                </p>
                
                <div style="display:flex;align-items:center;gap:6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="
                    color:var(--text-secondary);
                    flex-shrink:0;">
                    <circle cx="12" cy="12" r="10" stroke-width="1.5"/>
                    <polyline points="12 6 12 12 16 14" stroke-width="1.5"/>
                  </svg>
                  <time id="item${itemId}-time" style="
                    font-size:12px;
                    color:var(--text-secondary);">
                    ${time}
                  </time>
                </div>
              </div>
            </div>
          </div>`
      },
      mainEnd: `</div>`
    };
  }

  generateHtml(inputContent) {
    const template = this._templates.style1;
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
1. 数据格式：头像&*&用户&*&IP&*&称号&*&颜色&*&内容&*&时间
2. 使用"&&*&&"分割不同条目
3. 采用极简质感风格（Material Design）
4. 自动生成层级ID系统
5. 技术支持：垃圾桶（575244421@qq.com）`;
  }
}

exports.types = types;
exports.widget = GenerateHtmlWidget;
console.log('作者：垃圾桶');