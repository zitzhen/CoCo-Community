// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_3', // 控件类型，全局唯一
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z', // 控件图标
  title: '文字处理工具1.3', // 控件的显示名称
  isInvisibleWidget: true, // 不可见控件
  isGlobalWidget: true, // 全局控件
  properties: [], // 不可见控件不需要定义属性
  methods: [
    {
      key: 'trimBeforeDelimiter',
      label: '删除分隔符前的内容',
      params: [
        { key: 'text', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符前的所有内容',
      blockOptions: { callMethodLabel: false }
    },
    {
      key: 'trimAfterDelimiter',
      label: '删除分隔符后的内容',
      params: [
        { key: 'text', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' }
      ],
      valueType: 'string',
      tooltip: '删除指定分隔符后的内容',
      blockOptions: { callMethodLabel: false }
    },
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
    {
      key: 'removeNonChineseDigits',
      label: '删除所有非汉字/数字的字符',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '删除文本中所有非汉字和数字的字符',
      blockOptions: { callMethodLabel: false }
    },
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
    {
      key: 'extractSubstring',
      label: '提取特定字符范围的文本',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' },
        { key: 'start', label: '起始位置', valueType: 'number', defaultValue: 0 },
        { key: 'end', label: '结束位置', valueType: 'number', defaultValue: 10 }
      ],
      valueType: 'string',
      tooltip: '提取从起始位置到结束位置的文本',
      blockOptions: { callMethodLabel: false }
    },
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
    {
      key: 'shuffleText',
      label: '随机打乱文本',
      params: [
        { key: 'inputText', label: '：', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '随机打乱字符串中的字符顺序',
      blockOptions: { callMethodLabel: false }
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
    return Array.from(inputText).some(char => 
      cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end)
    );
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
    return Array.from(inputText).filter(char => 
      cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end)
    ).join('');
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
    return Array.from(inputText).reduce((indexes, char, index) => {
      if (cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end)) {
        indexes.push(index);
      }
      return indexes;
    }, []);
  }

  // 获取汉字的数量
  getChineseCount(inputText) {
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
    return Array.from(inputText).reduce((count, char) => {
      return cjkRanges.some(([start, end]) => char.codePointAt(0) >= start && char.codePointAt(0) <= end) ? count + 1 : count;
    }, 0);
  }

    // 查找第一个汉字的索引
    findFirstChineseIndex(inputText) {
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
      for (let i = 0; i < inputText.length; i++) {
        if (cjkRanges.some(([start, end]) => inputText.codePointAt(i) >= start && inputText.codePointAt(i) <= end)) {
          return i;
        }
      }
      return -1;
    }
  
    // 查找最后一个汉字的索引
    findLastChineseIndex(inputText) {
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
      let lastIndex = -1;
      for (let i = 0; i < inputText.length; i++) {
        if (cjkRanges.some(([start, end]) => inputText.codePointAt(i) >= start && inputText.codePointAt(i) <= end)) {
          lastIndex = i;
        }
      }
      return lastIndex;
    }
  
    // 查找第一个非汉字的索引
    findFirstNonChineseIndex(inputText) {
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
      for (let i = 0; i < inputText.length; i++) {
        if (!cjkRanges.some(([start, end]) => inputText.codePointAt(i) >= start && inputText.codePointAt(i) <= end)) {
          return i;
        }
      }
      return -1;
    }
  
    // 查找最后一个非汉字的索引
    findLastNonChineseIndex(inputText) {
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
      let lastIndex = -1;
      for (let i = 0; i < inputText.length; i++) {
        if (!cjkRanges.some(([start, end]) => inputText.codePointAt(i) >= start && inputText.codePointAt(i) <= end)) {
          lastIndex = i;
        }
      }
      return lastIndex;
    }
  
    // 删除所有非汉字/数字的字符
    removeNonChineseDigits(inputText) {
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
      return Array.from(inputText).filter(char => {
        const codePoint = char.codePointAt(0);
        return (codePoint >= 0x30 && codePoint <= 0x39) || // 数字范围
               cjkRanges.some(([start, end]) => codePoint >= start && codePoint <= end); // 汉字范围
      }).join('');
    }
  
    // 统计标点符号数量
    countPunctuation(inputText) {
      const punctuationRegex = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
      const matches = inputText.match(punctuationRegex);
      return matches ? matches.length : 0;
    }
  
    // 提取特定字符范围的文本
    extractSubstring(inputText, start, end) {
      return inputText.substring(start, end);
    }
  
    // 统计数字数量
    countDigits(inputText) {
      const digitRegex = /\d/g;
      const matches = inputText.match(digitRegex);
      return matches ? matches.length : 0;
    }
  
    // 统计空格数量
    countSpaces(inputText) {
      const spaceRegex = /\s/g;
      const matches = inputText.match(spaceRegex);
      return matches ? matches.length : 0;
    }
  
    // 统计特定字符数量
    countSpecificChar(inputText, char) {
      const specificCharRegex = new RegExp(char, 'g');
      const matches = inputText.match(specificCharRegex);
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
      let array = inputText.split('');
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array.join('');
    }
  }
  
  // 导出控件
  exports.types = types;
  exports.widget = TextProcessingTool;
  
  // 标明作者
  console.log('作者：垃圾桶');
  