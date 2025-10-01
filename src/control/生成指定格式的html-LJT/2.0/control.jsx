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

// 控件实体定义
class GenerateHtmlWidget extends InvisibleWidget {
  constructor(props) {
    super(props);
    
    // 预编译模板片段
    this._templates = {
      mainStart: `
        <div class="myDiv" style="width:100%;height:100%;overflow:hidden;position:relative;background-color:#f9f9f9;">
          <div class="list-scroll-container" 
               style="width:100%;
                      height:100%;
                      overflow-y:auto;
                      padding-right:8px;
                      --divider-width:1.5px;
                      --divider-color:#e0e0e0;">`,
      
      mainEnd: length => `
          </div>
          <div style="display:none">
            <div id="widget-width">300</div>
            <div id="widget-height">400</div>
            <div id="total-items">${length}</div>
            <div id="divider-config" 
                 style="--divider-width:1.5px;--divider-color:#e0e0e0;"></div>
          </div>
        </div>`,
      
      itemTemplate: (index, [avatarUrl, username, ip, content, time]) => `
        <div class="list-item-container" 
             style="padding:12px;border-bottom:var(--divider-width) solid var(--divider-color);">
          <div class="avatar-frame" 
               style="width:40px;height:40px;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.1);overflow:hidden;float:left;">
            <img id="item${index + 1}-avatar" 
                 src="${avatarUrl}"
                 style="width:100%;height:100%;object-fit:cover;border-radius:50%"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCIgeT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+MToxPC90ZXh0Pjwvc3ZnPg'">
          </div>
          <div class="content-wrapper" style="margin-left:52px;">
            <div class="user-info">
              <span id="item${index + 1}-username" style="font-weight:600;color:#333">${username}</span>
              <span id="item${index + 1}-ip" style="font-size:12px;color:#666;margin-left:8px;">${ip}</span>
            </div>
            <div id="item${index + 1}-content" style="color:#444;margin-top:4px;">${content}</div>
            <div class="meta-info" style="margin-top:6px;">
              <span id="item${index + 1}-time" style="font-size:12px;color:#999;">${time}</span>
            </div>
          </div>
        </div>`
    };
  }

  // HTML生成方法
  generateHtml(inputContent) {
    const items = inputContent.split('&&*&&').filter(Boolean);
    const buffer = [this._templates.mainStart];
    
    // 批量处理条目
    items.forEach((item, index) => {
      const parts = item.split('&*&');
      if (parts.length >= 5) {
        buffer.push(
          this._templates.itemTemplate(index, parts)
        );
      }
    });
    
    buffer.push(this._templates.mainEnd(items.length));
    return buffer.join('');
  }

  // 使用说明方法
  getUsage() {
    return `使用说明：
1. 使用"&&*&&"分割大项，"&*&"分割小项
2. 格式：头像链接&*&用户名&*&IP地址&*&评论内容&*&时间
3. 自动生成带层级ID的结构，点击元素可获取对应ID
4. 技术支持：垃圾桶（575244421@qq.com）
5.是否开源：开源，但修改后请在代码里标注原作者`;
  }
}

// 导出控件
exports.types = types;
exports.widget = GenerateHtmlWidget;

// 作者标识
console.log('作者：垃圾桶');