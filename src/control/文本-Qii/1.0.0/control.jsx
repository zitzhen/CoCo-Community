(() => {
  "use strict";
  const VType = {
    string: "string",
    multilineString: "multilineString",
    number: "number",
    boolean: "boolean",
    color: "color",
    array: [ "array", "string" ],
    object: [ "object", "string" ],
    any: [ "string", "number", "boolean", "color", "array", "object" ]
  };
  function getType(value) {
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "boolean";
    if (isColor(value)) return "color";
    if (Array.isArray(value)) return [ "array", "string" ];
    return "string";
  }
  const COLOR_REGEX = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$|^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/;
  function isColor(string) {
    return COLOR_REGEX.test(string) || string === "transparent";
  }
  function replaceNewline(content) {
    return content.replace(/\\n/g, "\n");
  }
  /**
 * CoCoKit 控件开发包
 * @author 琦琦
 */
  class widgetInstance extends VisibleWidget {
    constructor(props) {
      super(props);
      Object.assign(this, props);
      this.init();
    }
    init() {}
    render() {}
  }
  const widgetConfig = {
    title: "",
    type: "",
    version: "",
    icon: "",
    docs: {
      url: ""
    },
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: false,
    properties: [],
    events: [],
    methods: [],
    size: {
      width: 0,
      height: 0
    },
    eventIcon: "",
    returnId: true
  };
  class BaseWidget {
    constructor() {
      this.currentProp = {};
    }
    prop(label, key, value) {
      const prop = {
        key,
        label,
        defaultValue: value,
        valueType: getType(value),
        blockOptions: {
          setter: {},
          getter: {}
        }
      };
      widgetConfig.properties.push(prop);
      this.currentProp = prop;
      return this;
    }
    type(type) {
      this.currentProp.valueType = type;
      return this;
    }
    check(type) {
      this.currentProp.checkType = type;
      return this;
    }
    editor(type) {
      this.currentProp.editorType = type;
      return this;
    }
    unit(text) {
      this.currentProp.unit = text;
      return this;
    }
    dropdown(menu) {
      this.currentProp.dropdown = dropdownToArray(menu);
      return this;
    }
    hide() {
      this.currentProp.hidePropertyEditor = true;
      return this;
    }
    readonly() {
      this.currentProp.readonly = true;
      return this;
    }
    tips(text) {
      this.currentProp.tooltip = text;
      return this;
    }
    noBlock() {
      this.currentProp.blockOptions.generateBlock = false;
      this.noSet().noGet();
      return this;
    }
    noSet() {
      this.currentProp.blockOptions.setter.generateBlock = false;
      return this;
    }
    noGet() {
      this.currentProp.blockOptions.getter.generateBlock = false;
      return this;
    }
    space(value) {
      this.currentProp.blockOptions.setter.space = value;
      return this;
    }
    line(text) {
      this.currentProp.blockOptions.setter.line = text;
      return this;
    }
    lineGet(text) {
      this.currentProp.blockOptions.getter.line = text;
      return this;
    }
    keys(array) {
      this.currentProp.blockOptions.setter.keys = array;
      this.currentProp.blockOptions.getter.keys = array;
      return this;
    }
    init(func) {
      widgetInstance.prototype.init = func;
    }
    event(label, key, options = {}) {
      const event = {
        key,
        label,
        params: options.params || [],
        subTypes: eventDropdownToArray(options.dropdown),
        tooltip: options.tips || "",
        blockOptions: {
          line: options.line || "",
          space: options.space ?? null,
          order: options.order ?? null,
          icon: options.icon || widgetConfig.eventIcon || ""
        }
      };
      widgetConfig.events.push(event);
    }
    method(label, key, options = {}, func) {
      const method = {
        key,
        label,
        params: methodDropdownToArray(options.params),
        valueType: options.returnType || null,
        tooltip: options.tips || "",
        blockOptions: {
          color: options.color || null,
          line: options.line || "",
          space: options.space ?? null,
          callMethodLabel: options.methodLabel ?? null,
          inputsInline: options.inline ?? true,
          order: options.order ?? null,
          icon: options.icon || null
        }
      };
      widgetConfig.methods.push(method);
      widgetInstance.prototype[key] = func;
    }
    inMethod(key, func) {
      widgetInstance.prototype[key] = func;
    }
    types() {
      return widgetConfig;
    }
  }
  class CoCoWidget extends BaseWidget {
    constructor() {
      super();
    }
    config(options) {
      const {name, id, version, icon = "", eventIcon = "", docs = "", anyWidget = true, width, height, returnId = true} = options;
      Object.assign(widgetConfig, {
        title: name,
        type: id,
        version,
        icon,
        eventIcon,
        docs: {
          url: docs
        },
        hasAnyWidget: anyWidget,
        size: {
          width,
          height
        },
        returnId
      });
    }
    render(element) {
      widgetInstance.prototype.render = element;
    }
    build() {
      if (widgetConfig.returnId) this.method("的 ID", "getWidgetId", {
        returnType: "string",
        color: " #F0AF3F",
        methodLabel: false
      }, (function() {
        return this.__widgetId;
      }));
      this.prop("宽度", "__width", widgetConfig.size.width).noBlock();
      this.prop("高度", "__height", widgetConfig.size.height).noBlock();
      this.prop("", "__size", 100).readonly().keys([ "__height", "__width" ]).line("通用");
      return widgetInstance;
    }
  }
  function dropdownToArray(dropdown) {
    if (!dropdown) return null;
    return Object.entries(dropdown).map((([label, value]) => ({
      label,
      value
    })));
  }
  function eventDropdownToArray(dropdown) {
    if (!dropdown) return [];
    return dropdown.map(((item, index) => ({
      key: index,
      dropdown: dropdownToArray(item)
    })));
  }
  function methodDropdownToArray(dropdown) {
    if (!dropdown) return [];
    return dropdown.map((item => ({
      ...item,
      dropdown: dropdownToArray(item.dropdown)
    })));
  }
  new DOMParser;
  /**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */
  const widget = new CoCoWidget;
  widget.config({
    name: "文本",
    id: "QII_WIDGET_TEXT",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/r1EZhl6egg.image/png",
    width: 240,
    height: 50
  });
  widget.prop("文本配置", "textGroup", "").editor("TextWidgetTextGroup").noBlock().prop("文本", "content", "这是一段文本").type(VType.multilineString).check("string").hide().prop("字体", "fontFamily", "sans-serif").hide().noBlock().prop("字号", "fontSize", 14).hide().prop("颜色", "color", "#202022").hide().prop("自定义字体", "customFontFamily", "").noGet().space(40).prop("对齐方式", "Align", "").editor("Align").noBlock().prop("水平对齐", "textAlign", "center").hide().noGet().dropdown({
    左侧: "left",
    居中: "center",
    右侧: "right"
  }).prop("垂直对齐", "justifyContent", "center").hide().noGet().dropdown({
    左侧: "flex-start",
    居中: "center",
    右侧: "flex-end"
  }).prop("换行方式", "whiteSpace", "break-spaces").noGet().dropdown({
    禁止换行: "nowrap",
    默认样式: "normal",
    允许换行: "break-spaces"
  }).prop("文本加粗", "textBlod", false).noGet().prop("斜体样式", "textStyle", false).noGet().prop("溢出隐藏", "overflow", false).noGet().prop("迷你文本", "miniText", false).noGet().space(40).prop("首行缩进", "textIndent", 0).unit("字符").noGet().prop("行高", "lineHeight", 0).unit("像素").noGet().prop("字距", "letterSpacing", 0).unit("像素").noGet().prop("旋转", "rotate", 0).unit("度").noGet().prop("背景颜色", "bgColor", "transparent").noGet().prop("背景圆角", "bgRound", 6).unit("px").noGet().prop("阴影颜色", "shadowColor", "transparent").noGet().prop("阴影样式", "shadowStyle", "2px 4px 8px").noGet().prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("被点击时", "onClick");
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: this.__widgetId,
      "data-screen-align": this.screenAlign
    }, React.createElement("span", {
      onClick: () => this.emit("onClick")
    }, replaceNewline(this.content))), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%;\n            height: 100%;\n            display: flex;\n            align-items: ${this.justifyContent};\n            justify-content: ${this.textAlign};\n            overflow: ${this.overflow ? "hidden" : "visible"};\n            transform: rotate(${this.rotate}deg) scale(${this.miniText ? .5 : 1});\n            background-color: ${this.bgColor};\n            border-radius: ${this.bgRound}px;\n        }\n        .${this.__widgetId} span {\n            color: ${this.color};\n            font-size: ${this.fontSize}px;\n            text-align: ${this.textAlign};\n            font-family: ${this.customFontFamily};\n            white-space: ${this.whiteSpace};\n            font-weight: ${this.textBlod ? "bold" : "normal"};\n            font-style: ${this.textStyle ? "italic" : "none"};\n            text-indent: ${this.textIndent}em;\n            line-height: ${this.lineHeight <= 0 ? "normal" : this.lineHeight + "px"};\n            letter-spacing: ${this.letterSpacing}px;\n            text-shadow: ${this.shadowStyle} ${this.shadowColor};\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();