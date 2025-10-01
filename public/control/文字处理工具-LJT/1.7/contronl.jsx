// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_7', // 控件类型，全局唯一
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
  title: '文字处理工具1.7', // 控件的显示名称
  isInvisibleWidget: true, // 不可见控件
  isGlobalWidget: true, // 全局控件
  properties: [], // 不可见控件不需要定义属性
  methods: [
    // 获取字符串的指定范围字符
    {
      key: 'getSubstringByRange',
      label: '获取字符串的指定范围字符',
      params: [
        { key: 'text', label: '输入的字符串', valueType: 'string', defaultValue: 'aaabbbccc' },
        { key: 'start', label: '起始位置', valueType: 'number', defaultValue: 1 },
        { key: 'end', label: '结束位置', valueType: 'number', defaultValue: 3 }
      ],
      tooltip: '获取字符串的第b到c个字符',
      valueType: 'string',
      blockOptions: { callMethodLabel: false }
    },
    // 获取字符串的前几个字符
    {
      key: 'getSubstring',
      label: '获取字符串的前几个字符',
      params: [
        { key: 'text', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'length', label: '字符数', valueType: 'number', defaultValue: 6 }
      ],
      valueType: 'string',
      tooltip: '获取字符串的前几个字符',
      blockOptions: { callMethodLabel: false }
    },
    // 删除分隔符前的内容
    {
      key: 'trimBeforeDelimiter',
      label: '删除分隔符前内容',
      params: [
        { key: 'text', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符前的所有内容',
      blockOptions: { callMethodLabel: false }
    },
    // 删除分隔符后的内容
    {
      key: 'trimAfterDelimiter',
      label: '删除分隔符后内容',
      params: [
        { key: 'text', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符后的内容',
      blockOptions: { callMethodLabel: false }
    },
    // 替换字符
    {
      key: 'replaceCharacters',
      label: '替换字符',
      params: [
        { key: 'originalText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'searchChar', label: '要替换的字符', valueType: 'string', defaultValue: '' },
        { key: 'replacementChar', label: '替换为', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将指定字符替换为其他字符',
      blockOptions: { callMethodLabel: false }
    },
    // 检测是否包含汉字
    {
      key: 'detectIfContainsChinese',
      label: '检测是否包含汉字',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'boolean',
      tooltip: '检测文本中是否包含汉字',
      blockOptions: { callMethodLabel: false }
    },
    // 提取所有汉字
    {
      key: 'extractAllChinese',
      label: '提取所有汉字',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '从文本中提取所有汉字',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为大写
    {
      key: 'toUpperCase',
      label: '转换为大写',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为大写',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为小写
    {
      key: 'toLowerCase',
      label: '转换为小写',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为小写',
      blockOptions: { callMethodLabel: false }
    },
    // 反转文本
    {
      key: 'reverseText',
      label: '反转文本',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本内容反转',
      blockOptions: { callMethodLabel: false }
    },
    // 统计字符数量
    {
      key: 'countCharacters',
      label: '统计字符数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的字符数量',
      blockOptions: { callMethodLabel: false }
    },
    // 统计单词数量
    {
      key: 'countWords',
      label: '统计单词数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的单词数量（以空格分隔）',
      blockOptions: { callMethodLabel: false }
    },
    // 去除重复字符
    {
      key: 'removeDuplicates',
      label: '去除重复字符',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '去除文本中的重复字符，仅保留第一次出现的字符',
      blockOptions: { callMethodLabel: false }
    },
    // 获取所有汉字的索引
    {
      key: 'getAllChineseIndexes',
      label: '获取所有汉字的索引',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'array',
      tooltip: '获取文本中所有汉字的索引',
      blockOptions: { callMethodLabel: false }
    },
    // 获取汉字的数量
    {
      key: 'getChineseCount',
      label: '获取汉字的数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的汉字数量',
      blockOptions: { callMethodLabel: false }
    },
    // 查找第一个汉字的索引
    {
      key: 'findFirstChineseIndex',
      label: '查找第一个汉字的索引',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '查找文本中第一个汉字的索引',
      blockOptions: { callMethodLabel: false }
    },
    // 查找最后一个汉字的索引
    {
      key: 'findLastChineseIndex',
      label: '查找最后一个汉字的索引',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '查找文本中最后一个汉字的索引',
      blockOptions: { callMethodLabel: false }
    },
    // 查找第一个非汉字的索引
    {
      key: 'findFirstNonChineseIndex',
      label: '查找第一个非汉字的索引',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '查找文本中第一个非汉字的索引',
      blockOptions: { callMethodLabel: false }
    },
    // 查找最后一个非汉字的索引
    {
      key: 'findLastNonChineseIndex',
      label: '查找最后一个非汉字的索引',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '查找文本中最后一个非汉字的索引',
      blockOptions: { callMethodLabel: false }
    },
    // 删除所有非汉字/数字的字符
    {
      key: 'removeNonChineseDigits',
      label: '删除非汉字/数字字符',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '删除文本中所有非汉字和数字的字符',
      blockOptions: { callMethodLabel: false }
    },
    // 统计标点符号数量
    {
      key: 'countPunctuation',
      label: '统计标点符号数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的标点符号数量',
      blockOptions: { callMethodLabel: false }
    },
    // 提取特定字符范围的文本
    {
      key: 'extractSubstring',
      label: '提取特定范围文本',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'start', label: '起始位置', valueType: 'number', defaultValue: 0 },
        { key: 'end', label: '结束位置', valueType: 'number', defaultValue: 10 }
      ],
      valueType: 'string',
      tooltip: '提取从起始位置到结束位置的文本',
      blockOptions: { callMethodLabel: false }
    },
    // 统计数字数量
    {
      key: 'countDigits',
      label: '统计数字数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的数字数量',
      blockOptions: { callMethodLabel: false }
    },
    // 统计空格数量
    {
      key: 'countSpaces',
      label: '统计空格数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的空格数量',
      blockOptions: { callMethodLabel: false }
    },
    // 统计特定字符数量
    {
      key: 'countSpecificChar',
      label: '统计特定字符数量',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'char', label: '特定字符', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中特定字符的数量',
      blockOptions: { callMethodLabel: false }
    },
    // 首字母大写
    {
      key: 'capitalizeFirstLetter',
      label: '首字母大写',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本的首字母转换为大写',
      blockOptions: { callMethodLabel: false }
    },
    // 字符串前填充
    {
      key: 'padStart',
      label: '字符串前填充',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'targetLength', label: '目标长度', valueType: 'number', defaultValue: 10 },
        { key: 'padString', label: '填充字符', valueType: 'string', defaultValue: ' ' }
      ],
      valueType: 'string',
      tooltip: '在字符串前填充指定字符，直到达到目标长度',
      blockOptions: { callMethodLabel: false }
    },
    // 字符串后填充
    {
      key: 'padEnd',
      label: '字符串后填充',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'targetLength', label: '目标长度', valueType: 'number', defaultValue: 10 },
        { key: 'padString', label: '填充字符', valueType: 'string', defaultValue: ' ' }
      ],
      valueType: 'string',
      tooltip: '在字符串后填充指定字符，直到达到目标长度',
      blockOptions: { callMethodLabel: false }
    },
    // 重复字符串
    {
      key: 'repeatString',
      label: '重复字符串',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'times', label: '重复次数', valueType: 'number', defaultValue: 2 }
      ],
      valueType: 'string',
      tooltip: '将字符串重复指定次数',
      blockOptions: { callMethodLabel: false }
    },
    // 随机打乱文本
    {
      key: 'shuffleText',
      label: '随机打乱文本',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '随机打乱字符串中的字符顺序',
      blockOptions: { callMethodLabel: false }
    },
    // 删除标点符号
    {
      key: 'removePunctuation',
      label: '删除标点符号',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '删除文本中的所有标点符号',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为驼峰命名
    {
      key: 'toCamelCase',
      label: '转换为驼峰命名',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为驼峰命名格式',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为短横线命名
    {
      key: 'toKebabCase',
      label: '转换为短横线命名',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为短横线命名格式',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为蛇形命名
    {
      key: 'toSnakeCase',
      label: '转换为蛇形命名',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为蛇形命名格式',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为标题格式
    {
      key: 'toTitleCase',
      label: '转换为标题格式',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为标题格式',
      blockOptions: { callMethodLabel: false }
    },
    // 删除连续重复字符
    {
      key: 'removeConsecutiveDuplicates',
      label: '删除连续重复字符',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '删除文本中连续重复的字符',
      blockOptions: { callMethodLabel: false }
    },
    // 按字符排序
    {
      key: 'sortCharacters',
      label: '按字符排序',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'order', label: '排序顺序', valueType: 'string', defaultValue: 'asc', dropdown: [{ label: '升序', value: 'asc' }, { label: '降序', value: 'desc' }] }
      ],
      valueType: 'string',
      tooltip: '对文本中的字符进行排序',
      blockOptions: { callMethodLabel: false }
    },
    // 转换为Base64编码
    {
      key: 'convertToBase64',
      label: '转换为Base64编码',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将文本转换为Base64编码',
      blockOptions: { callMethodLabel: false }
    },
    // 从Base64解码
    {
      key: 'convertFromBase64',
      label: '从Base64解码',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '将Base64编码的文本解码为原始文本',
      blockOptions: { callMethodLabel: false }
    }
  ],
  events: [] // 不可见控件不需要定义事件
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

  // 获取字符串的指定范围字符
  getSubstringByRange(text, start, end) {
    if (typeof text !== 'string') throw new Error('输入的字符串必须是字符串类型');
    if (typeof start !== 'number' || typeof end !== 'number' || start < 1 || end < 1 || start > end) {
      throw new Error('起始位置和结束位置必须是正整数，且起始位置不能大于结束位置');
    }

    const adjustedStart = start - 1;
    if (adjustedStart < 0 || adjustedStart >= text.length || end > text.length) {
      throw new Error('起始位置或结束位置超出字符串范围');
    }

    return text.substring(adjustedStart, end);
  }

  // 获取字符串的前几个字符
  getSubstring(text, length) {
    if (typeof text !== 'string') throw new Error('输入的字符串必须是字符串类型');
    if (typeof length !== 'number' || length < 0) throw new Error('获取的字符数必须是非负整数');
    return text.substring(0, length);
  }

  // 删除分隔符前的内容
  trimBeforeDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    return index === -1 ? text : text.substring(index + delimiter.length);
  }

  // 删除分隔符后的内容
  trimAfterDelimiter(text, delimiter) {
    const index = text.indexOf(delimiter);
    return index === -1 ? '' : text.substring(0, index);
  }

  // 替换字符
  replaceCharacters(originalText, searchChar, replacementChar) {
    return originalText.replace(new RegExp(searchChar, 'g'), replacementChar);
  }

  // 检测是否包含汉字
  detectIfContainsChinese(inputText) {
    return Array.from(inputText).some(char => this.isChineseChar(char));
  }

  // 提取所有汉字
  extractAllChinese(inputText) {
    return Array.from(inputText).filter(char => this.isChineseChar(char)).join('');
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

  // 统计单词数量
  countWords(inputText) {
    const words = inputText.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }

  // 去除重复字符
  removeDuplicates(inputText) {
    return Array.from(new Set(inputText)).join('');
  }

  // 获取所有汉字的索引
  getAllChineseIndexes(inputText) {
    return Array.from(inputText).reduce((indexes, char, index) => {
      if (this.isChineseChar(char)) indexes.push(index);
      return indexes;
    }, []);
  }

  // 获取汉字的数量
  getChineseCount(inputText) {
    return Array.from(inputText).reduce((count, char) => 
      this.isChineseChar(char) ? count + 1 : count, 0);
  }

  // 查找第一个汉字的索引
  findFirstChineseIndex(inputText) {
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 查找最后一个汉字的索引
  findLastChineseIndex(inputText) {
    let lastIndex = -1;
    for (let i = 0; i < inputText.length; i++) {
      if (this.isChineseChar(inputText[i])) lastIndex = i;
    }
    return lastIndex;
  }

  // 查找第一个非汉字的索引
  findFirstNonChineseIndex(inputText) {
    for (let i = 0; i < inputText.length; i++) {
      if (!this.isChineseChar(inputText[i])) return i;
    }
    return -1;
  }

  // 查找最后一个非汉字的索引
  findLastNonChineseIndex(inputText) {
    let lastIndex = -1;
    for (let i = 0; i < inputText.length; i++) {
      if (!this.isChineseChar(inputText[i])) lastIndex = i;
    }
    return lastIndex;
  }

  // 删除所有非汉字/数字的字符
  removeNonChineseDigits(inputText) {
    return Array.from(inputText).filter(char => {
      const codePoint = char.codePointAt(0);
      return (codePoint >= 0x30 && codePoint <= 0x39) || this.isChineseChar(char);
    }).join('');
  }

  // 统计标点符号数量
  countPunctuation(inputText) {
    const matches = inputText.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
    return matches ? matches.length : 0;
  }

  // 提取特定字符范围的文本
  extractSubstring(inputText, start, end) {
    return inputText.substring(start, end);
  }

  // 统计数字数量
  countDigits(inputText) {
    const matches = inputText.match(/\d/g);
    return matches ? matches.length : 0;
  }

  // 统计空格数量
  countSpaces(inputText) {
    const matches = inputText.match(/\s/g);
    return matches ? matches.length : 0;
  }

  // 统计特定字符数量
  countSpecificChar(inputText, char) {
    const matches = inputText.match(new RegExp(char, 'g'));
    return matches ? matches.length : 0;
  }

  // 首字母大写
  capitalizeFirstLetter(inputText) {
    return inputText.charAt(0).toUpperCase() + inputText.slice(1);
  }

  // 字符串前填充
  padStart(inputText, targetLength, padString) {
    return inputText.padStart(targetLength, padString);
  }

  // 字符串后填充
  padEnd(inputText, targetLength, padString) {
    return inputText.padEnd(targetLength, padString);
  }

  // 重复字符串
  repeatString(inputText, times) {
    return inputText.repeat(times);
  }

  // 随机打乱文本
  shuffleText(inputText) {
    const array = inputText.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  // 删除标点符号
  removePunctuation(inputText) {
    return inputText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  }

  // 转换为驼峰命名
  toCamelCase(inputText) {
    return inputText
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  // 转换为短横线命名
  toKebabCase(inputText) {
    return inputText.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // 转换为蛇形命名
  toSnakeCase(inputText) {
    return inputText.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  }

  // 转换为标题格式
  toTitleCase(inputText) {
    return inputText
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // 删除连续重复字符
  removeConsecutiveDuplicates(inputText) {
    return inputText.replace(/(.)\1+/g, '$1');
  }

  // 按字符排序
  sortCharacters(inputText, order) {
    const sorted = inputText.split('').sort();
    return order === 'desc' ? sorted.reverse().join('') : sorted.join('');
  }

  // 转换为Base64编码
  convertToBase64(inputText) {
    return btoa(unescape(encodeURIComponent(inputText)));
  }

  // 从Base64解码
  convertFromBase64(inputText) {
    return decodeURIComponent(escape(atob(inputText)));
  }
}

// 导出控件
exports.types = types;
exports.widget = TextProcessingTool;

// 标明作者
console.log('作者：垃圾桶');