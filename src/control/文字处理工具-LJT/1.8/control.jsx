// 控件类型定义
const types = {
  type: 'TEXT_PROCESSING_TOOL_1_8',
  icon: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z',
  title: '文字处理工具1.8',
  isInvisibleWidget: true,
  isGlobalWidget: true,
  properties: [],
  methods: [
    // 字符串操作功能 (#FFBB55)
    {
      key: 'getSubstring',
      label: '取子串',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'mode', 
          label: '模式', 
          valueType: 'string', 
          defaultValue: '前N个',
          dropdown: [
            { label: '前N个', value: '前N个' },
            { label: '后N个', value: '后N个' },
            { label: '指定范围', value: '指定范围' }
          ]
        },
        { key: 'length', label: '字符数', valueType: 'number', defaultValue: 6, visibleWhen: { mode: ['前N个', '后N个'] } },
        { key: 'start', label: '起始位', valueType: 'number', defaultValue: 1, visibleWhen: { mode: '指定范围' } },
        { key: 'end', label: '结束位', valueType: 'number', defaultValue: 3, visibleWhen: { mode: '指定范围' } }
      ],
      valueType: 'string',
      tooltip: '获取文本的子串',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55' // 数据处理颜色
      }
    },
    {
      key: 'trimDelimiter',
      label: '删分隔内容',
      params: [
        { key: 'text', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'delimiter', label: '分隔符', valueType: 'string', defaultValue: 'aaa' },
        { 
          key: 'mode', 
          label: '删除位置', 
          valueType: 'string', 
          defaultValue: '前内容',
          dropdown: [
            { label: '前内容', value: '前内容' },
            { label: '后内容', value: '后内容' }
          ]
        }
      ],
      valueType: 'string',
      tooltip: '删除分隔符前/后的内容',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'replaceCharacters',
      label: '替换字符',
      params: [
        { key: 'originalText', label: '原文本', valueType: 'string', defaultValue: '' },
        { key: 'searchChar', label: '查找字符', valueType: 'string', defaultValue: '' },
        { key: 'replacementChar', label: '替换字符', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '替换文本中的指定字符',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'repeatString',
      label: '重复字符串',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { key: 'times', label: '重复次数', valueType: 'number', defaultValue: 2 }
      ],
      valueType: 'string',
      tooltip: '将字符串重复指定次数',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },

    // 汉字处理功能 (#FFBB55)
    {
      key: 'detectIfContainsChinese',
      label: '含汉字？',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'boolean',
      tooltip: '检测文本中是否包含汉字',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'extractAllChinese',
      label: '提取汉字',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'string',
      tooltip: '从文本中提取所有汉字',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'findChineseIndex',
      label: '汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'mode', 
          label: '位置', 
          valueType: 'string', 
          defaultValue: '第一个',
          dropdown: [
            { label: '第一个', value: '第一个' },
            { label: '最后一个', value: '最后一个' },
            { label: '所有索引', value: '所有索引' }
          ]
        }
      ],
      valueType: 'array',
      tooltip: '查找汉字的位置索引',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'findNonChineseIndex',
      label: '非汉字索引',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'mode', 
          label: '位置', 
          valueType: 'string', 
          defaultValue: '第一个',
          dropdown: [
            { label: '第一个', value: '第一个' },
            { label: '最后一个', value: '最后一个' }
          ]
        }
      ],
      valueType: 'number',
      tooltip: '查找非汉字的位置索引',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'getChineseCount',
      label: '汉字数量',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' }
      ],
      valueType: 'number',
      tooltip: '统计文本中的汉字数量',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },

    // 大小写转换功能 (#FFBB55)
    {
      key: 'changeCase',
      label: '转换大小写',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'caseType', 
          label: '转换类型', 
          valueType: 'string', 
          defaultValue: '大写',
          dropdown: [
            { label: '大写', value: '大写' },
            { label: '小写', value: '小写' },
            { label: '首字母大写', value: '首字母大写' }
          ]
        }
      ],
      valueType: 'string',
      tooltip: '转换文本大小写格式',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },

    // 文本统计功能 (#FFBB55)
    {
      key: 'countStatistics',
      label: '文本统计',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'countType', 
          label: '统计类型', 
          valueType: 'string', 
          defaultValue: '字符数',
          dropdown: [
            { label: '字符数', value: '字符数' },
            { label: '单词数', value: '单词数' },
            { label: '汉字数', value: '汉字数' },
            { label: '数字数', value: '数字数' },
            { label: '空格数', value: '空格数' },
            { label: '英文标点数', value: '英文标点数' },
            { label: '特定字符', value: '特定字符' }
          ]
        },
        { 
          key: 'specificChar', 
          label: '特定字符', 
          valueType: 'string', 
          defaultValue: '',
          visibleWhen: { countType: '特定字符' }
        }
      ],
      valueType: 'number',
      tooltip: '统计文本中的各种元素数量',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },

    // 高级格式转换 (#FFBB55)
    {
      key: 'formatConversion',
      label: '格式转换',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'formatType', 
          label: '转换格式', 
          valueType: 'string', 
          defaultValue: '驼峰命名',
          dropdown: [
            { label: '驼峰命名', value: '驼峰命名' },
            { label: '短横线命名', value: '短横线命名' },
            { label: '蛇形命名', value: '蛇形命名' },
            { label: '标题格式', value: '标题格式' }
          ]
        }
      ],
      valueType: 'string',
      tooltip: '将文本转换为不同命名格式',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'base64Conversion',
      label: 'Base64转换',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'operation', 
          label: '操作', 
          valueType: 'string', 
          defaultValue: '编码',
          dropdown: [
            { label: '编码', value: '编码' },
            { label: '解码', value: '解码' }
          ]
        }
      ],
      valueType: 'string',
      tooltip: 'Base64编码/解码',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },

    // 文本操作功能 (#FFBB55)
    {
      key: 'textManipulation',
      label: '文本操作',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'operation', 
          label: '操作类型', 
          valueType: 'string', 
          defaultValue: '反转',
          dropdown: [
            { label: '反转', value: '反转' },
            { label: '随机打乱', value: '随机打乱' },
            { label: '去重复', value: '去重复' },
            { label: '去连续重复', value: '去连续重复' },
            { label: '去英文标点', value: '去英文标点' },
            { label: '去非汉字数字', value: '去非汉字数字' },
            { label: '排序字符', value: '排序字符' }
          ]
        },
        { 
          key: 'sortOrder', 
          label: '排序顺序', 
          valueType: 'string', 
          defaultValue: '升序',
          dropdown: [
            { label: '升序', value: 'asc' },
            { label: '降序', value: 'desc' }
          ],
          visibleWhen: { operation: '排序字符' }
        }
      ],
      valueType: 'string',
      tooltip: '执行各种文本操作',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    },
    {
      key: 'stringPadding',
      label: '填充文本',
      params: [
        { key: 'inputText', label: '文本', valueType: 'string', defaultValue: '' },
        { 
          key: 'position', 
          label: '填充位置', 
          valueType: 'string', 
          defaultValue: '前填充',
          dropdown: [
            { label: '前填充', value: '前填充' },
            { label: '后填充', value: '后填充' }
          ]
        },
        { key: 'targetLength', label: '目标长度', valueType: 'number', defaultValue: 10 },
        { key: 'padString', label: '填充字符', valueType: 'string', defaultValue: ' ' }
      ],
      valueType: 'string',
      tooltip: '在文本前后填充字符',
      blockOptions: { 
        callMethodLabel: false,
        color: '#FFBB55'
      }
    }
  ],
  events: []
};

// 控件实体定义 - 文字处理工具 v1.8
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

  // === 合并后的核心方法 ===
  
  // 获取子串 (合并多个方法)
  getSubstring(text, mode, length = 0, start = 1, end = 3) {
    if (typeof text !== 'string') throw new Error('输入的字符串必须是字符串类型');
    
    switch(mode) {
      case '前N个':
        if (typeof length !== 'number' || length < 0) 
          throw new Error('字符数必须是非负整数');
        return text.substring(0, length);
      
      case '后N个':
        if (typeof length !== 'number' || length < 0) 
          throw new Error('字符数必须是非负整数');
        return length > text.length ? text : text.substring(text.length - length);
      
      case '指定范围':
        if (typeof start !== 'number' || typeof end !== 'number' || start < 1 || end < 1 || start > end)
          throw new Error('起始位置和结束位置必须是正整数，且起始位置不能大于结束位置');
        
        const adjustedStart = start - 1;
        if (adjustedStart < 0 || adjustedStart >= text.length || end > text.length)
          throw new Error('起始位置或结束位置超出字符串范围');
        
        return text.substring(adjustedStart, end);
      
      default:
        return text;
    }
  }

  // 删除分隔符内容 (合并删除前/后)
  trimDelimiter(text, delimiter, mode) {
    const index = text.indexOf(delimiter);
    
    if (index === -1) return mode === '前内容' ? text : '';
    
    return mode === '前内容' 
      ? text.substring(index + delimiter.length) 
      : text.substring(0, index);
  }

  // 大小写转换 (合并多个方法)
  changeCase(inputText, caseType) {
    switch(caseType) {
      case '大写':
        return inputText.toUpperCase();
      case '小写':
        return inputText.toLowerCase();
      case '首字母大写':
        return inputText.charAt(0).toUpperCase() + inputText.slice(1);
      default:
        return inputText;
    }
  }

  // 文本统计 (合并多个统计方法)
  countStatistics(inputText, countType, specificChar = '') {
    switch(countType) {
      case '字符数':
        return inputText.length;
      
      case '单词数':
        const words = inputText.match(/\b\w+\b/g);
        return words ? words.length : 0;
      
      case '汉字数':
        return Array.from(inputText).reduce((count, char) => 
          this.isChineseChar(char) ? count + 1 : count, 0);
      
      case '数字数':
        const digitMatches = inputText.match(/\d/g);
        return digitMatches ? digitMatches.length : 0;
      
      case '空格数':
        const spaceMatches = inputText.match(/\s/g);
        return spaceMatches ? spaceMatches.length : 0;
      
      case '英文标点数':
        const punctMatches = inputText.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
        return punctMatches ? punctMatches.length : 0;
      
      case '特定字符':
        if (!specificChar) return 0;
        const regex = new RegExp(specificChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const charMatches = inputText.match(regex);
        return charMatches ? charMatches.length : 0;
      
      default:
        return 0;
    }
  }

  // 格式转换 (合并多个命名格式)
  formatConversion(inputText, formatType) {
    switch(formatType) {
      case '驼峰命名':
        return inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      
      case '短横线命名':
        return inputText.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      
      case '蛇形命名':
        return inputText.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
      
      case '标题格式':
        return inputText
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      
      default:
        return inputText;
    }
  }

  // Base64转换 (合并编码/解码)
  base64Conversion(inputText, operation) {
    try {
      return operation === '编码'
        ? btoa(unescape(encodeURIComponent(inputText)))
        : decodeURIComponent(escape(atob(inputText)));
    } catch (e) {
      console.error('Base64转换错误:', e);
      return operation === '编码' ? '' : inputText;
    }
  }

  // 文本操作 (合并多个操作)
  textManipulation(inputText, operation, sortOrder = 'asc') {
    switch(operation) {
      case '反转':
        return inputText.split('').reverse().join('');
      
      case '随机打乱':
        const array = inputText.split('');
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
      
      case '去重复':
        return Array.from(new Set(inputText)).join('');
      
      case '去连续重复':
        return inputText.replace(/(.)\1+/g, '$1');
      
      case '去英文标点':
        return inputText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      
      case '去非汉字数字':
        return Array.from(inputText).filter(char => {
          const codePoint = char.codePointAt(0);
          return (codePoint >= 0x30 && codePoint <= 0x39) || this.isChineseChar(char);
        }).join('');
      
      case '排序字符':
        const sorted = inputText.split('').sort();
        return sortOrder === 'desc' ? sorted.reverse().join('') : sorted.join('');
      
      default:
        return inputText;
    }
  }

  // 字符串填充 (合并前后填充)
  stringPadding(inputText, position, targetLength, padString) {
    return position === '前填充'
      ? inputText.padStart(targetLength, padString)
      : inputText.padEnd(targetLength, padString);
  }

  // === 保留的独立方法 ===
  
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

  // 查找汉字索引
  findChineseIndex(inputText, mode) {
    if (mode === '第一个') {
      for (let i = 0; i < inputText.length; i++) {
        if (this.isChineseChar(inputText[i])) return i;
      }
      return -1;
    } 
    else if (mode === '最后一个') {
      let lastIndex = -1;
      for (let i = 0; i < inputText.length; i++) {
        if (this.isChineseChar(inputText[i])) lastIndex = i;
      }
      return lastIndex;
    }
    else if (mode === '所有索引') {
      return Array.from(inputText).reduce((indexes, char, index) => {
        if (this.isChineseChar(char)) indexes.push(index);
        return indexes;
      }, []);
    }
    return -1;
  }

  // 查找非汉字索引
  findNonChineseIndex(inputText, mode) {
    if (mode === '第一个') {
      for (let i = 0; i < inputText.length; i++) {
        if (!this.isChineseChar(inputText[i])) return i;
      }
      return -1;
    } 
    else if (mode === '最后一个') {
      let lastIndex = -1;
      for (let i = 0; i < inputText.length; i++) {
        if (!this.isChineseChar(inputText[i])) lastIndex = i;
      }
      return lastIndex;
    }
    return -1;
  }

  // 获取汉字数量
  getChineseCount(inputText) {
    return Array.from(inputText).reduce((count, char) => 
      this.isChineseChar(char) ? count + 1 : count, 0);
  }

  // 重复字符串
  repeatString(inputText, times) {
    return inputText.repeat(times);
  }
}

// 导出控件
exports.types = types;
exports.widget = TextProcessingTool;

// 标明作者
console.log('作者：垃圾桶');