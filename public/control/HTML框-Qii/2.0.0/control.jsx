(() => {
  "use strict";
  const Color = {
    blue: " #4A9AFA",
    blue_light: " #62B7FF",
    green: " #07AFC1",
    yellow: " #F0AF3F",
    pink: " #FF74B7",
    event: " #608FEE",
    control: " #68CDFF",
    feature: " #00AFC3",
    calc: " #FEAE8A",
    variable: " #FFBB55",
    array: " #F9CC37",
    object: " #A073FF",
    function: " #F88767",
    props: " #E76CEA"
  };
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
  this.window;
  this.document;
  widget.config({
    name: "HTML框",
    id: "QII_WIDGET_HTML",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/Bk6G9lRllx.image/png",
    width: 300,
    height: 125
  });
  const defaultData = [ {
    key: "标题",
    value: "HTML 框"
  }, {
    key: "描述",
    value: "这是 HTML 框，可以渲染自定义的 HTML 内容，修改数据也很方便。"
  }, {
    key: "按钮",
    value: "好的"
  } ];
  const defaultHtml = `<div class="custom_card">\n\n  <div class="card_header">\n    <p class="title">{{ 标题 }}</p>\n    <button id="card-button">{{ 按钮 }}</button>\n  </div>\n  \n  <div class="card_content">\n    <p>{{ 描述 }}</p>\n  </div>\n\n</div>`;
  const defaultStyle = `.custom_card {\n  width: 100%;\n  height: 100%;\n  padding: 16px 18px;\n  background: #FFFFFF;\n  border-radius: 10px;\n  border: 1px solid #00002020;\n}\n\n.custom_card .card_header {\n  margin-bottom: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.custom_card .title {\n  font-size: 18px;\n  font-weight: bold;\n}\n\n#card-button {\n  background: #3080FF20;\n  color: #3080FF;\n  border: none;\n  height: 28px;\n  padding: 0.5px 16px 0 16px;\n  border-radius: 20px;\n}\n`;
  widget.prop("数据", "htmlData", defaultData).editor("HttpHeader").noBlock().prop("内容", "htmlContent", defaultHtml).editor("TextArea").line("设置 HTML").prop("样式", "styleContent", defaultStyle).editor("TextArea").prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("被点击时", "onClick", {
    params: [ {
      key: "itemId",
      label: "元素ID",
      valueType: "string"
    } ]
  });
  widget.inMethod("onClickItem", (function(event) {
    let target = event.target;
    while (target && !target.id) target = target.parentElement;
    this.emit("onClick", target.id);
  }));
  widget.inMethod("replaceHtmlData", (function(htmlStr) {
    const newData = this.htmlData.reduce(((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }), {});
    return htmlStr.replace(/\{\{\s*([^{}]+)\s*\}\}/g, ((match, key) => newData[key.trim()] ?? match));
  }));
  widget.method("设置", "setHtmlData", {
    params: [ {
      key: "data",
      label: "数据",
      defaultValue: "",
      valueType: VType.object
    } ],
    tips: "传入 <字典> 积木配置的数据",
    color: Color.blue,
    space: 40
  }, (function(data) {
    const newData = Object.keys(data).map((key => ({
      key,
      value: data[key]
    })));
    this.setProps({
      htmlData: newData
    });
  }));
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: this.__widgetId,
      onClick: e => this.onClickItem(e),
      dangerouslySetInnerHTML: {
        __html: this.replaceHtmlData(this.htmlContent)
      },
      "data-screen-align": this.screenAlign
    }), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%;\n            height: 100%;\n            scrollbar-width: none;\n        }\n        .${this.__widgetId} p {\n            margin: 0;\n        }\n        ${this.styleContent}\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();