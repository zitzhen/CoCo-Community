// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_1', // 控件类型，全局唯一
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
  title: '文字处理工具1.1', // 控件的显示名称
  isInvisibleWidget: true, // 不可见控件
  isGlobalWidget: true, // 全局控件
  properties: [], // 不可见控件不需要定义属性
  methods: [
    {
      key: 'trimBeforeDelimiter',
      label: '删除分隔符前的内容',
      params: [
        { key: 'text', label: '原始文本', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符前的所有内容'
    },
    {
      key: 'trimAfterDelimiter',
      label: '删除分隔符后的内容',
      params: [
        { key: 'text', label: '原始文本', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符后的内容'
    },
    {
      key: 'replaceCharacters',
      label: '替换字符',
      params: [
        { key: 'originalText', label: '原始文本', valueType: 'string', defaultValue: '' },
        { key: 'searchChar', label: '要替换的字符', valueType: 'string', defaultValue: '' },
        { key: 'replacementChar', label: '替换为', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将指定字符替换为其他字符'
    },
    {
      key: 'detectIfContainsChinese',
      label: '检测是否包含汉字',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'boolean',
      tooltip: '检测文本中是否包含汉字'
    },
    {
      key: 'extractAllChinese',
      label: '提取所有汉字',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '从文本中提取所有汉字'
    },
    {
      key: 'toUpperCase',
      label: '转换为大写',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为大写'
    },
    {
      key: 'toLowerCase',
      label: '转换为小写',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为小写'
    },
    {
      key: 'reverseText',
      label: '反转文本',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本内容反转'
    },
    {
      key: 'countCharacters',
      label: '统计字符数量',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的字符数量'
    }
  ],
  events: [] // 不可见控件不需要定义事件
};

// 控件实体定义
class TextProcessingTool extends InvisibleWidget {
  constructor(props) {
    super(props);
  }

  // 删除分隔符前的内容
  trimBeforeDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    if (index === -1) {
      return text; // 如果没有找到分隔符，返回原始文本
    }
    return text.substring(index + delimiter.length);
  }

  // 删除分隔符后的内容
  trimAfterDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    if (index === -1) {
      return ''; // 如果没有找到分隔符，返回空字符串
    }
    return text.substring(0, index);
  }

  // 替换字符
  replaceCharacters(originalText, searchChar, replacementChar) {
    let regex = new RegExp(searchChar, 'g');
    return originalText.replace(regex, replacementChar);
  }

  // 检测是否包含汉字
  detectIfContainsChinese(inputText) {
    const cjkRanges = [
      [0x4E00, 0x9FFF],
      [0x3400, 0x4DBF],
      [0x20000, 0x2A6DF],
      [0xF900, 0xFAFF],
      [0xFF65, 0xFFDC],
      [0x3040, 0x309F],
      [0x30A0, 0x30FF],
      [0xAC00, 0xD7AF]
    ];
    return inputText.some(char => cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end));
  }

  // 提取所有汉字
  extractAllChinese(inputText) {
    const cjkRanges = [
      [0x4E00, 0x9FFF],
      [0x3400, 0x4DBF],
      [0x20000, 0x2A6DF],
      [0xF900, 0xFAFF],
      [0xFF65, 0xFFDC],
      [0x3040, 0x309F],
      [0x30A0, 0x30FF],
      [0xAC00, 0xD7AF]
    ];
    return Array.from(inputText).filter(char => cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end)).join('');
  }

  // 转换为大写
  toUpperCase(inputText) {
    return inputText.toUpperCase();
  }

  // 转换为小写
  toLowerCase(inputText) {
    return inputText.toLowerCase();
  }

  // 反转文本
  reverseText(inputText) {
    return inputText.split('').reverse().join('');
  }

  // 统计字符数量
  countCharacters(inputText) {
    return inputText.length;
  }
}

// 导出控件
exports.types = types;
exports.widget = TextProcessingTool;

// 标明作者
console.log('作者：垃圾桶');
