// 控件类型定义
const types = {
    type: 'TEXT_TO_DATA_URL_WIDGET', // 控件类型，使用全大写和下划线连接
    icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
    title: '文本转Data URL工具', // 控件名称
    isInvisibleWidget: true, // 不可见控件
    isGlobalWidget: true, // 全局控件
    platforms: ['web', 'android', 'ios'], // 支持的平台
    properties: [], // 无属性
    methods: [ // 定义方法
      {
        key: 'convertToDataUrl', // 方法名
        label: '将文本转换为Data URL', // 方法显示名称
        params: [ // 方法参数
          {
            key: 'text', // 参数名
            label: '输入文本', // 参数显示名称
            valueType: 'string', // 参数类型
            defaultValue: 'Hello, World!', // 默认值
          }
        ],
        tooltip: '将输入的文本内容转换为Data URL', // 方法描述
        valueType: 'string' // 返回值类型
      }
    ],
    events: [] // 无事件
  };
  
  // 控件实体定义
  class TextToDataUrlWidget extends InvisibleWidget {
    // 初始化方法
    constructor(props) {
      super(props);
    }
  
    // 将文本转换为Data URL的方法
    convertToDataUrl(text) {
      // 将文本内容编码为Data URL
      const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
      return dataUrl;
    }
  }
  
  // 导出控件类型和实体
  exports.types = types;
  exports.widget = TextToDataUrlWidget;
  
  // 标注作者
  console.log('作者：垃圾桶');
  