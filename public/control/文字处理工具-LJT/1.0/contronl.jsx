// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_0', // 控件类型，全局唯一
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
  title: '文字处理工具1.0', // 控件的显示名称
  isInvisibleWidget: false, // 可见控件
  isGlobalWidget: true, // 全局控件
  properties: [
    {
      key: 'inputText',
      label: '输入文本',
      valueType: 'string',
      defaultValue: '请输入文本...'
    },
    {
      key: 'outputText',
      label: '输出文本',
      valueType: 'string',
      defaultValue: ''
    },
    {
      key: 'operationType',
      label: '操作类型',
      valueType: 'string',
      defaultValue: 'trim',
      dropdown: [
        { label: '删除分隔符前内容', value: 'trimBefore' },
        { label: '删除分隔符后内容', value: 'trimAfter' },
        { label: '替换字符', value: 'replace' },
        { label: '检测是否包含汉字', value: 'detectChinese' },
        { label: '提取所有汉字', value: 'extractChinese' },
        { label: '转换为大写', value: 'toUpperCase' },
        { label: '转换为小写', value: 'toLowerCase' }
      ]
    },
    {
      key: 'delimiter',
      label: '分隔符',
      valueType: 'string',
      defaultValue: 'aaa'
    },
    {
      key: 'searchChar',
      label: '要替换的字符',
      valueType: 'string',
      defaultValue: ''
    },
    {
      key: 'replacementChar',
      label: '替换为',
      valueType: 'string',
      defaultValue: ''
    }
  ],
  methods: [
    {
      key: 'processText',
      label: '处理文本',
      params: [
        { key: 'inputText', label: '输入文本', valueType: 'string', defaultValue: '' },
        { key: 'operationType', label: '操作类型', valueType: 'string', defaultValue: 'trim' }
      ],
      valueType: 'string'
    }
  ],
  events: [
    {
      key: 'onProcessComplete',
      label: '处理完成',
      params: [
        { key: 'result', label: '处理后的文本', valueType: 'string' }
      ]
    }
  ]
};

// 控件实体定义
class TextProcessingTool extends VisibleWidget {
  constructor(props) {
    super(props);
    this.inputText = props.inputText || '';
    this.outputText = props.outputText || '';
    this.operationType = props.operationType || 'trim';
    this.delimiter = props.delimiter || 'aaa';
    this.searchChar = props.searchChar || '';
    this.replacementChar = props.replacementChar || '';
  }

  // 处理文本
  processText(inputText, operationType) {
    let result = inputText;
    switch (operationType) {
      case 'trimBefore':
        result = this.trimBeforeDelimiter(inputText, this.delimiter);
        break;
      case 'trimAfter':
        result = this.trimAfterDelimiter(inputText, this.delimiter);
        break;
      case 'replace':
        result = this.replaceCharacters(inputText, this.searchChar, this.replacementChar);
        break;
      case 'detectChinese':
        result = this.detectIfContainsChinese(inputText);
        break;
      case 'extractChinese':
        result = this.extractAllChinese(inputText);
        break;
      case 'toUpperCase':
        result = inputText.toUpperCase();
        break;
      case 'toLowerCase':
        result = inputText.toLowerCase();
        break;
      default:
        result = inputText;
    }
    this.outputText = result;
    this.emit('onProcessComplete', result);
    return result;
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
    return text.substring(0, index + delimiter.length);
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
}

// 导出控件
exports.types = types;
exports.widget = TextProcessingTool;
