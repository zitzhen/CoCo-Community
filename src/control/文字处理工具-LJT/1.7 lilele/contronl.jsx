// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_7little',
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z',
  title: '文字处理工具1.7 little',
  isInvisibleWidget: true,
  isGlobalWidget: true,
  properties: [],
  methods: [
    {
      key: 'getSubstringByRange',
      label: '截取范围文本',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: 'aaabbbccc' },
        { key: 'start', label: '起始', valueType: 'number', defaultValue: 1 },
        { key: 'end', label: '结束', valueType: 'number', defaultValue: 3 }
      ],
      tooltip: '截取文本中指定范围的字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'getSubstring',
      label: '截取前N字符',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'length', label: '长度', valueType: 'number', defaultValue: 6 }
      ],
      tooltip: '截取文本前N个字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'trimBeforeDelimiter',
      label: '删除分隔符前',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      tooltip: '删除指定分隔符前的所有内容',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'trimAfterDelimiter',
      label: '删除分隔符后',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      tooltip: '删除指定分隔符后的所有内容',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'replaceCharacters',
      label: '替换字符',
      params: [
        { key: 'originalText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'searchChar', label: '查找', valueType: 'string', defaultValue: '' },
        { key: 'replacementChar', label: '替换为', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '替换文本中的指定字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'detectIfContainsChinese',
      label: '检测汉字',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '检测文本是否包含汉字',
      valueType: 'boolean',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'extractAllChinese',
      label: '提取汉字',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '提取文本中的所有汉字',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toUpperCase',
      label: '转大写',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为大写',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toLowerCase',
      label: '转小写',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为小写',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'reverseText',
      label: '反转文本',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本内容反转',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countCharacters',
      label: '统计字符数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的字符数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countWords',
      label: '统计单词数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的单词数量(以空格分隔)',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'removeDuplicates',
      label: '去重字符',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '去除文本中的重复字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'getAllChineseIndexes',
      label: '获取汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '获取文本中所有汉字的索引位置',
      valueType: 'array',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'getChineseCount',
      label: '统计汉字数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的汉字数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'findFirstChineseIndex',
      label: '首个汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '查找第一个汉字的索引位置',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'findLastChineseIndex',
      label: '末个汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '查找最后一个汉字的索引位置',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'findFirstNonChineseIndex',
      label: '首个非汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '查找第一个非汉字的索引位置',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'findLastNonChineseIndex',
      label: '末个非汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '查找最后一个非汉字的索引位置',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'removeNonChineseDigits',
      label: '保留汉字数字',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '删除所有非汉字和非数字字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countPunctuation',
      label: '统计标点数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的标点符号数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'extractSubstring',
      label: '截取范围文本',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'start', label: '起始', valueType: 'number', defaultValue: 0 },
        { key: 'end', label: '结束', valueType: 'number', defaultValue: 10 }
      ],
      tooltip: '截取从起始到结束位置的文本',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countDigits',
      label: '统计数字数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的数字数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countSpaces',
      label: '统计空格数',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中的空格数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'countSpecificChar',
      label: '统计指定字符',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'char', label: '字符', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '统计文本中指定字符的数量',
      valueType: 'number',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'capitalizeFirstLetter',
      label: '首字母大写',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本的首字母转换为大写',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'padStart',
      label: '前填充',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'targetLength', label: '长度', valueType: 'number', defaultValue: 10 },
        { key: 'padString', label: '填充符', valueType: 'string', defaultValue: ' ' }
      ],
      tooltip: '在文本前填充指定字符到目标长度',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'padEnd',
      label: '后填充',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'targetLength', label: '长度', valueType: 'number', defaultValue: 10 },
        { key: 'padString', label: '填充符', valueType: 'string', defaultValue: ' ' }
      ],
      tooltip: '在文本后填充指定字符到目标长度',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'repeatString',
      label: '重复文本',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'times', label: '次数', valueType: 'number', defaultValue: 2 }
      ],
      tooltip: '将文本重复指定次数',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'shuffleText',
      label: '随机打乱',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '随机打乱文本中的字符顺序',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'removePunctuation',
      label: '删除标点',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '删除文本中的所有标点符号',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toCamelCase',
      label: '转驼峰式',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为驼峰命名格式',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toKebabCase',
      label: '转短横线式',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为短横线命名格式',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toSnakeCase',
      label: '转蛇形式',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为蛇形命名格式',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'toTitleCase',
      label: '转标题式',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为标题格式',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'removeConsecutiveDuplicates',
      label: '去连续重复',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '删除文本中连续重复的字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'sortCharacters',
      label: '字符排序',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'order', label: '顺序', valueType: 'string', defaultValue: 'asc', dropdown: [{ label: '升序', value: 'asc' }, { label: '降序', value: 'desc' }] }
      ],
      tooltip: '对文本中的字符按指定顺序排序',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'convertToBase64',
      label: 'Base64编码',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将文本转换为Base64编码',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'convertFromBase64',
      label: 'Base64解码',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      tooltip: '将Base64编码解码为原始文本',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    }
  ],
  events: []
};

// 控件实体定义
class TextProcessingTool extends InvisibleWidget {
  constructor(props) {
    super(props);
    // 定义CJK字符范围，用于汉字检测
    this.cjkRanges = [
      [0x4E00, 0x9FFF],   // 基本汉字
      [0x3400, 0x4DBF],   // 扩展A
      [0x20000, 0x2A6DF], // 扩展B
      [0xF900, 0xFAFF],   // 兼容汉字
      [0xFF65, 0xFFDC],   // 半角/全角形式
      [0x3040, 0x309F],   // 日文平假名
      [0x30A0, 0x30FF],   // 日文片假名
      [0xAC00, 0xD7AF]    // 韩文字母
    ];
  }

  // 检查字符是否是汉字
  isChineseChar(char) {
    const codePoint = char.codePointAt(0);
    return this.cjkRanges.some(([start, end]) => codePoint >= start && codePoint <= end);
  }

  // 截取范围文本
  getSubstringByRange(text, start, end) {
    if (typeof text !== 'string') throw new Error('输入必须是字符串');
    if (typeof start !== 'number' || typeof end !== 'number' || start < 1 || end < 1 || start > end) {
      throw new Error('起始和结束必须是正整数且起始≤结束');
    }

    const adjustedStart = start - 1;
    if (adjustedStart >= text.length || end > text.length) {
      throw new Error('起始或结束超出文本范围');
    }

    return text.substring(adjustedStart, end);
  }

  // 截取前N字符
  getSubstring(text, length) {
    if (typeof text !== 'string') throw new Error('输入必须是字符串');
    if (typeof length !== 'number' || length < 0) throw new Error('长度必须是非负整数');
    return text.substring(0, length);
  }

  // 删除分隔符前
  trimBeforeDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    return index === -1 ? text : text.slice(index + delimiter.length);
  }

  // 删除分隔符后
  trimAfterDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    return index === -1 ? '' : text.slice(0, index);
  }

  // 替换字符
  replaceCharacters(originalText, searchChar, replacementChar) {
    return originalText.replace(new RegExp(searchChar, 'g'), replacementChar);
  }

  // 检测汉字
  detectIfContainsChinese(inputText) {
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) return true;
    }
    return false;
  }

  // 提取汉字
  extractAllChinese(inputText) {
    let result = '';
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) result += inputText[i];
    }
    return result;
  }

  // 转大写
  toUpperCase(inputText) {
    return inputText.toUpperCase();
  }

  // 转小写
  toLowerCase(inputText) {
    return inputText.toLowerCase();
  }

  // 反转文本
  reverseText(inputText) {
    let result = '';
    for (let i = inputText.length - 1; i >= 0; i--) {
      result += inputText[i];
    }
    return result;
  }

  // 统计字符数
  countCharacters(inputText) {
    return inputText.length;
  }

  // 统计单词数
  countWords(inputText) {
    const words = inputText.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }

  // 去重字符
  removeDuplicates(inputText) {
    const seen = new Set();
    let result = '';
    for (const char of inputText) {
      if (!seen.has(char)) {
        seen.add(char);
        result += char;
      }
    }
    return result;
  }

  // 获取汉字索引
  getAllChineseIndexes(inputText) {
    const indexes = [];
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) indexes.push(i);
    }
    return indexes;
  }

  // 统计汉字数
  getChineseCount(inputText) {
    let count = 0;
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) count++;
    }
    return count;
  }

  // 首个汉字索引
  findFirstChineseIndex(inputText) {
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 末个汉字索引
  findLastChineseIndex(inputText) {
    for (let i = inputText.length - 1; i >= 0; i--) {
      if (this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 首个非汉字索引
  findFirstNonChineseIndex(inputText) {
    for (let i = 0; i < inputText.length; i++) {
      if (!this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 末个非汉字索引
  findLastNonChineseIndex(inputText) {
    for (let i = inputText.length - 1; i >= 0; i--) {
      if (!this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 保留汉字数字
  removeNonChineseDigits(inputText) {
    let result = '';
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      const codePoint = char.codePointAt(0);
      if ((codePoint >= 0x30 && codePoint <= 0x39) || this.isChineseChar(char)) {
        result += char;
      }
    }
    return result;
  }

  // 统计标点数
  countPunctuation(inputText) {
    const matches = inputText.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
    return matches ? matches.length : 0;
  }

  // 截取范围文本
  extractSubstring(inputText, start, end) {
    return inputText.substring(start, end);
  }

  // 统计数字数
  countDigits(inputText) {
    const matches = inputText.match(/\d/g);
    return matches ? matches.length : 0;
  }

  // 统计空格数
  countSpaces(inputText) {
    const matches = inputText.match(/\s/g);
    return matches ? matches.length : 0;
  }

  // 统计指定字符
  countSpecificChar(inputText, char) {
    let count = 0;
    for (let i = 0; i < inputText.length; i++) {
      if (inputText[i] === char) count++;
    }
    return count;
  }

  // 首字母大写
  capitalizeFirstLetter(inputText) {
    return inputText.charAt(0).toUpperCase() + inputText.slice(1);
  }

  // 前填充
  padStart(inputText, targetLength, padString) {
    return inputText.padStart(targetLength, padString);
  }

  // 后填充
  padEnd(inputText, targetLength, padString) {
    return inputText.padEnd(targetLength, padString);
  }

  // 重复文本
  repeatString(inputText, times) {
    return inputText.repeat(times);
  }

  // 随机打乱
  shuffleText(inputText) {
    const array = inputText.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  // 删除标点
  removePunctuation(inputText) {
    return inputText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  }

  // 转驼峰式
  toCamelCase(inputText) {
    return inputText.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  // 转短横线式
  toKebabCase(inputText) {
    return inputText.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // 转蛇形式
  toSnakeCase(inputText) {
    return inputText.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }

  // 转标题式
  toTitleCase(inputText) {
    return inputText
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // 去连续重复
  removeConsecutiveDuplicates(inputText) {
    return inputText.replace(/(.)\1+/g, '$1');
  }

  // 字符排序
  sortCharacters(inputText, order) {
    const sorted = inputText.split('').sort();
    return order === 'desc' ? sorted.reverse().join('') : sorted.join('');
  }

  // Base64编码
  convertToBase64(inputText) {
    return btoa(unescape(encodeURIComponent(inputText)));
  }

  // Base64解码
  convertFromBase64(inputText) {
    return decodeURIComponent(escape(atob(inputText)));
  }
}

// 导出控件
exports.types = types;
exports.widget = TextProcessingTool;

// 标明作者
console.log('作者：垃圾桶');