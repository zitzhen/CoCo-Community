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
    name: "开关",
    id: "QII_WIDGET_SWITCH",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/HJ_XUmnGel.image/png",
    width: 42,
    height: 30
  });
  widget.prop("状态", "status", false).dropdown({
    关闭: false,
    开启: true
  }).editor(EType.OptionSwitch).noSet().prop("背景色_关闭", "track_off", "#D8DBDF").noGet().prop("背景色_开启", "track_on", "#3080FF").noGet().prop("滑块色_关闭", "thumb_off", "#FFFFFF").noGet().prop("滑块色_开启", "thumb_on", "#FFFFFF").noGet().prop("圆角大小", "rounded", 500).unit("px").noGet().prop("边框颜色", "borderColor", "#3080FF").noGet().prop("边框粗细", "borderSize", 0).unit("px").noGet().prop("禁用", "disabled", false).prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("状态改变时", "onChange", {
    params: [ {
      key: "status",
      label: "状态",
      valueType: "boolean",
      defaultValue: false
    } ]
  });
  widget.method("的 状态 为", "setSwitchStatus", {
    params: [ {
      key: "status",
      defaultValue: true,
      valueType: "boolean",
      dropdown: {
        开启: true,
        关闭: false
      }
    } ],
    color: Color.props,
    order: 30001,
    methodLabel: "设置"
  }, (function(status) {
    if (this.disabled) return;
    this.setProps({
      status
    });
    this.emit("onChange", this.status);
  }));
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("label", {
      className: this.__widgetId,
      "data-screen-align": this.screenAlign
    }, React.createElement("input", {
      type: "checkbox",
      checked: this.status,
      onChange: () => this.setSwitchStatus(!this.status),
      disabled: this.disabled
    }), React.createElement("div", {
      className: "track"
    }, React.createElement("div", {
      className: "thumb"
    }))), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%;\n            height: 100%;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            user-select: none;\n        }\n        .${this.__widgetId} input {\n            display: none;\n        }\n        .${this.__widgetId} .track {\n            position: relative;\n            width: 100%;\n            height: auto;\n            aspect-ratio: 16/9;\n            background-color: ${this.track_off};\n            border-radius: ${this.rounded}px;\n            border: ${this.borderSize}px solid ${this.borderColor};\n            transition: all 0.2s;\n            cursor: pointer;\n        }\n        .${this.__widgetId} .thumb {\n            position: absolute; top: 50%; left: 0%;\n            transform: translateY(-50%);\n            height: 100%;\n            aspect-ratio: 1;\n            transition: all 0.2s cubic-bezier(.5,.3,.1,1);\n        }\n        .${this.__widgetId} .thumb::after {\n            content: '';\n            position: absolute; top: 50%; left: 50%;\n            transform: translate(-50%, -50%);\n            width: 64%;\n            height: 64%;\n            background-color: ${this.thumb_off};\n            border-radius: ${this.rounded - 2}px;\n            transition: all 0.2s;\n        }\n        .${this.__widgetId} input:checked+.track {\n            background-color: ${this.track_on};\n        }\n        .${this.__widgetId} input:checked+.track .thumb {\n            left: 44%;\n        }\n        .${this.__widgetId} input:checked+.track .thumb::after {\n            background-color: ${this.thumb_on};            \n        }\n            \n        .${this.__widgetId} input:disabled + .track {\n            opacity: 0.55;\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();