(() => {
  "use strict";
  const EType = {
    TextArea: "TextArea",
    RichText: "RichTextEditor",
    OptionSwitch: "OptionSwitch",
    Slider: "NumberSlider",
    Align: "Align",
    HorAlign: "HorizontalAlign",
    VerAlign: "VerticalAlign",
    Direction: "SliderDirection",
    TextGroup: "TextWidgetTextGroup",
    ButtonGroup: "ButtonTextGroup",
    AudioVolume: "AudioVolume",
    AudioRate: "AudioRate",
    HttpHeader: "HttpHeader"
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
    name: "图片框",
    id: "QII_WIDGET_IMAGE",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/SJQ3xvF8Jl.image/png",
    width: 220,
    height: 140
  });
  widget.prop("图片", "imgUrl", "https://static.bcmcdn.com/coco/player/unstable/HJyfLwixlx.image/png").editor(EType.TextArea).line("图片").prop("显示模式", "imgMode", "cover").editor(EType.OptionSwitch).dropdown({
    完整: "contain",
    拉伸: "fill",
    裁剪: "cover"
  }).prop("背景颜色", "imgBg", "#00002010").prop("圆角", "imgRound", 10).unit("px").noGet().prop("旋转", "imgRotate", 0).unit("度").noGet().prop("缩放", "imgScale", 100).unit("%").noGet().prop("模糊", "imgBlur", 0).unit("px").noGet().line("滤镜").prop("亮度", "imgBrightness", 100).unit("%").noGet().prop("饱和度", "imgSaturate", 100).unit("%").noGet().prop("边框粗细", "borderSize", 0).unit("px").noGet().line("其他样式").prop("边框颜色", "borderColor", "#B7D4FB").noGet().prop("阴影颜色", "shadowColor", "transparent").noGet().prop("阴影样式", "shadowStyle", "0px 5px 20px 0px").noGet().prop("动画样式", "animStyle", "all 0.3s ease").noGet().prop("圆角样式", "customRound", "").noGet().prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("被点击时", "onClick");
  widget.event("图片加载失败时", "onLoadError");
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: this.__widgetId,
      onClick: () => this.emit("onClick"),
      "data-screen-align": this.screenAlign
    }, React.createElement("img", {
      src: this.imgUrl,
      draggable: "false",
      onError: () => this.imgUrl !== "" && this.emit("onLoadError")
    })), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%;\n            height: 100%;\n            background-color: ${this.imgBg};\n            border: ${this.borderSize}px solid ${this.borderColor};\n            border-radius: ${this.customRound == "" ? this.imgRound + "px" : this.customRound};\n            box-shadow: ${this.shadowStyle + " " + this.shadowColor};\n            filter: brightness(${this.imgBrightness}%) saturate(${this.imgSaturate}%);\n            transform: rotate(${this.imgRotate}deg);\n            transition: ${this.animStyle};\n            overflow: hidden;\n        }\n        .${this.__widgetId} img {\n            width: 100%;\n            height: 100%;\n            object-fit: ${this.imgMode};\n            filter: blur(${this.imgBlur}px);\n            transform: scale(${this.imgScale / 100});\n            transition: ${this.animStyle};\n        }\n        .${this.__widgetId} img[src=""] {\n            display: none;\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();