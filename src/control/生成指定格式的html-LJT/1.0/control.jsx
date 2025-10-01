// 控件类型定义
const types = {
  type: 'LST_GSHTML_SC', // 控件类型，全局唯一
  title: '生成指定格式的html', // 控件名称
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
  isInvisibleWidget: true, // 不可见控件
  isGlobalWidget: true, // 全局控件
  properties: [], // 属性列表，本控件无需额外属性
  methods: [ // 方法列表
    {
      key: 'generateHtml', // 方法名
      label: '生成指定格式的HTML', // 方法显示名称
      tooltip: '根据输入内容生成指定的格式化的HTML', // 方法描述
      params: [ // 方法参数
        {
          key: 'inputContent', // 参数名
          label: '输入内容', // 参数显示名称
          valueType: 'string', // 参数类型
          defaultValue: '', // 默认值
        }
      ],
      valueType: 'string', // 返回值类型
    },
    {
      key: 'getUsage', // 方法名
      label: '获取使用方式', // 方法显示名称
      tooltip: '返回控件的使用说明', // 方法描述
      params: [], // 无参数
      valueType: 'string', // 返回值类型
    }
  ],
  events: [], // 事件列表，本控件无需事件
};

// 控件实体定义
class GenerateHtmlWidget extends InvisibleWidget {
  constructor(props) {
    super(props);
  }

  // 方法实现：生成HTML
  generateHtml(inputContent) {
    // 分割输入内容为大项和小项
    const items = inputContent.split('&&*&&').filter(Boolean); // 按大项分割符分割
    let html = '';

    // 主容器
    html += `
      <!-- 主容器：承载整个列表控件的根元素，始终填满父容器 -->
      <div class="myDiv" style="width:100%;height:100%;overflow:hidden;position:relative;background-color:#f9f9f9;">
        <!-- 滚动容器：实现垂直滚动功能 -->
        <div class="list-scroll-container" 
             style="width:100%;
                    height:100%;
                    overflow-y:auto;  /* 启用垂直滚动条 */
                    padding-right:8px;  /* 避免滚动条遮挡内容 */
                    --divider-width:1.5px;  /* 自定义分割线粗细变量 */
                    --divider-color:#e0e0e0;">  <!-- 自定义分割线颜色变量 -->
    `;

    // 遍历每个大项
    items.forEach((item, index) => {
      const parts = item.split('&*&').filter(Boolean); // 按小项分割符分割
      const avatarUrl = parts[0]; // 头像URL
      const username = parts[1]; // 用户名
      const ip = parts[2]; // IP信息
      const content = parts[3]; // 评论内容
      const time = parts[4]; // 时间

      // 条目容器
      html += `
        <!-- 条目${index + 1}容器：单条消息的完整包裹元素 -->
        <div class="list-item-container" 
             style="padding:12px;
                    border-bottom:var(--divider-width) solid var(--divider-color);  /* 使用CSS变量控制分割线 */">
          <!-- 头像容器：实现双层边框特效 -->
          <div class="avatar-frame" 
               style="width:40px;
                      height:40px;
                      border:2px solid #fff;  /* 外层白色边框 */
                      border-radius:50%;  /* 圆形效果 */
                      box-shadow:0 2px 6px rgba(0,0,0,0.1);  /* 立体阴影 */
                      overflow:hidden;  /* 内容裁剪 */
                      float:left;">  <!-- 左浮动实现文字环绕 -->
            <!-- 头像图片：支持动态URL和错误回退 -->
            <img id="item${index + 1}-avatar" 
                 src="${avatarUrl}" 
                 style="width:100%;  /* 充满容器 */
                        height:100%;
                        object-fit:cover;  /* 保持比例裁剪 */
                        border-radius:50%"  /* 圆形裁剪 */
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCIgeT0iMTgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSI+MToxPC90ZXh0Pjwvc3ZnPg'">  <!-- 错误时显示SVG占位 -->
          </div>

          <!-- 内容区：头像右侧所有文字内容的容器 -->
          <div class="content-wrapper" 
               style="margin-left:52px;  /* 留出头像空间 */">
            <!-- 用户信息行：用户名+IP的组合显示 -->
            <div class="user-info">
              <span id="item${index + 1}-username" 
                    style="font-weight:600;
                           color:#333">${username}</span>  <!-- 用户名加粗显示 -->
              <span id="item${index + 1}-ip" 
                    style="font-size:12px;
                           color:#666;
                           margin-left:8px;">${ip}</span>  <!-- IP信息灰色显示 -->
            </div>
            
            <!-- 消息内容：主要文字区域 -->
            <div id="item${index + 1}-content" 
                 style="color:#444;  /* 深灰色正文 */
                        margin-top:4px;">${content}</div>
            
            <!-- 元信息：时间等辅助信息 -->
            <div class="meta-info" 
                 style="margin-top:6px;">  <!-- 与正文保持间距 -->
              <span id="item${index + 1}-time" 
                    style="font-size:12px;
                           color:#999;">${time}</span>  <!-- 浅灰色时间戳 -->
            </div>
          </div>
        </div>
      `;
    });

    // 关闭主容器
    html += `
        <!-- 属性同步容器：存储控件状态参数 -->
        <div style="display:none">  <!-- 隐藏不可见 -->
          <div id="widget-width">300</div>  <!-- 记录控件宽度 -->
          <div id="widget-height">400</div>  <!-- 记录控件高度 -->
          <div id="total-items">${items.length}</div>  <!-- 记录条目总数 -->
          <div id="divider-config" 
               style="--divider-width:1.5px;--divider-color:#e0e0e0;"></div>  <!-- 分割线样式配置 -->
        </div>
      </div>
    </div>
    `;

    return html;
  }

  // 方法实现：获取使用方式
  getUsage() {
    return `这是一个搭配html控件使用的用于输出可滑动评论区的html控件。其中字符串“&*&”为小项分割符，以“&&*&&”为大项分割符。使用格式为“（用户头像链接）&*&（用户昵称）&*&（用户IP地址）&*&（当前评论内容）&*&（评论时间）&&*&&”且每个不同的部分都会自动生成个ID，你可以通过用户所点击的元素ID来判断用户点击了什么内容。控件作者：@垃圾桶 ，控件免费开源；可随意修改+自定义；（注：控件作者邮箱：“575244421@qq.com”）`;
  }
}

// 导出控件
exports.types = types;
exports.widget = GenerateHtmlWidget;

// 标记作者信息
console.log('作者：垃圾桶');
