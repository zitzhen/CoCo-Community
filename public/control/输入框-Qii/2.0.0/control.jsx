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
  function isUrl(string) {
    return /^https?:\/\/.+/.test(string);
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
  function Icon({show = true, size, color, code, ...otherProps}) {
    if (!show || !code) return null;
    if (isUrl(code)) return React.createElement("img", {
      className: "qii-icon",
      src: code,
      style: {
        width: size,
        height: size
      },
      ...otherProps
    });
    const svgData = parseSvg(code);
    return React.createElement("svg", {
      className: "qii-icon",
      width: size,
      height: size,
      viewBox: svgData.viewBox,
      xmlns: "http://www.w3.org/2000/svg",
      ...otherProps
    }, svgData.paths.map(((path, index) => React.createElement("path", {
      key: index,
      d: path.d,
      fill: path.fill !== "none" && color !== "" ? color : path.fill,
      opacity: path.opacity,
      fillRule: path.fillRule
    }))));
  }
  const ERROR_ICON = {
    viewBox: "0 0 24 24",
    paths: [ {
      d: "m12 13.414 5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z",
      fill: "#FF6252",
      opacity: "1",
      fillRule: ""
    } ]
  };
  const domParser = new DOMParser;
  function parseSvg(svg) {
    try {
      const svgElement = domParser.parseFromString(svg, "image/svg+xml").querySelector("svg");
      if (!svgElement) return ERROR_ICON;
      const gElement = svgElement.querySelector("g");
      const paths = Array.from(svgElement.querySelectorAll("path")).map((path => ({
        d: path.getAttribute("d") || "",
        fill: path.getAttribute("fill") || "none",
        opacity: path.getAttribute("opacity") || "1",
        fillRule: gElement?.getAttribute("fill-rule") || path.getAttribute("fill-rule") || ""
      })));
      return {
        viewBox: svgElement.getAttribute("viewBox") || "",
        paths: paths.length ? paths : ERROR_ICON.paths
      };
    } catch {
      return ERROR_ICON;
    }
  }
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments)
    /**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */;
  }
  const widget = new CoCoWidget;
  this.window;
  var _document = this.document;
  widget.config({
    name: "输入框",
    id: "QII_WIDGET_INPUT",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/rk6YJwFUyl.image/png",
    width: 270,
    height: 40
  });
  widget.prop("输入框配置", "InputTextGroup", "").editor("InputTextGroup").noBlock().prop("提示文案", "placeholder", "请输入内容").hide().noBlock().prop("输入文案", "value", "").hide().noBlock().prop("", "__content", "文本内容").readonly().keys([ "value", "placeholder" ]).line("文案").prop("提示文案", "placeholderColor", "#00000050").hide().noBlock().prop("输入文案", "valueColor", "#202022").hide().noBlock().prop("", "__color", "#202022").readonly().keys([ "value", "placeholder" ]).noGet().prop("对齐方式", "textAlign", "left").editor("HorizontalAlign").dropdown({
    左侧: "left",
    居中: "center",
    右侧: "right"
  }).prop("背景颜色", "bgColor", "#00002010").noGet().line("样式").prop("类型", "inputType", "text").dropdown({
    文本: "text",
    多行: "textarea",
    数字: "number",
    密码: "password",
    邮箱: "email"
  }).prop("字号", "fontSize", 14).unit("px").noGet().prop("圆角", "inputRound", 8).unit("px").noGet().prop("边距", "inputPadding", 14).unit("px").noGet().prop("输入长度", "maxLength", 200).unit("字符").noGet().prop("禁用", "disabled", false).prop("边框粗细", "borderWidth", 2).unit("px").noGet().line("边框").prop("边框颜色", "borderColor", "transparent").noGet().prop("边框颜色-焦点", "borderColorFocus", "#3080FF").noGet().prop("图标", "icon", "").noGet().line("图标").prop("图标大小", "iconSize", 18).unit("px").noGet().prop("覆盖图标颜色", "coverIconColor", true).noGet().prop("显示报错", "__showError", false).hide().noBlock().prop("报错文本", "__errorText", "").hide().noBlock().prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("内容改变时", "onChange", {
    params: [ {
      key: "value",
      label: "文案",
      valueType: "string"
    } ]
  });
  widget.event("在", "on", {
    dropdown: [ {
      "获得焦点 时": "Focus",
      "失去焦点 时": "Blur",
      "点击 时": "Click",
      "提交 时": "Enter"
    } ]
  });
  widget.method("报错", "showErrorMessage", {
    params: [ {
      key: "message",
      valueType: "string",
      defaultValue: "输入错误"
    } ],
    color: Color.blue
  }, (function(message) {
    this.setProps({
      __showError: true,
      __errorText: message
    });
  }));
  widget.method("关闭报错", "hideErrorMessage", {
    color: Color.blue,
    space: 40
  }, (function() {
    this.setProps({
      __showError: false,
      __errorText: ""
    });
  }));
  widget.inMethod("onChange", (function(e) {
    let newValue = e.target.value.slice(0, this.maxLength);
    this.setProps({
      value: newValue
    });
    this.emit("onChange", newValue);
  }));
  widget.inMethod("onClick", (function() {
    this.emit("onClick");
    const input = _document.querySelector(`.Qii_${this.__this.__widgetId} input`);
    if (input) input.focus();
    const textarea = _document.querySelector(`.Qii_${this.__this.__widgetId} textarea`);
    if (textarea) textarea.focus();
  }));
  widget.inMethod("renderInput", (function() {
    const inputProps = {
      value: this.value,
      placeholder: this.placeholder,
      maxLength: this.maxLength,
      disabled: this.disabled,
      onChange: e => this.onChange(e),
      onFocus: () => this.emit("onFocus"),
      onBlur: () => this.emit("onBlur"),
      onKeyDown: e => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.emit("onEnter");
        }
      }
    };
    if (this.inputType == "textarea") return React.createElement("textarea", inputProps); else return React.createElement("input", _extends({}, inputProps, {
      type: this.inputType
    }));
  }));
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: `${this.__widgetId} ${this.__showError ? "error" : ""}`,
      onClick: () => this.onClick(),
      "data-screen-align": this.screenAlign
    }, React.createElement(Icon, {
      show: this.icon !== "",
      size: this.iconSize,
      code: this.icon,
      color: this.coverIconColor ? this.valueColor : ""
    }), this.renderInput(), this.__showError && React.createElement("div", {
      className: "error-text"
    }, this.__errorText)), React.createElement("style", null, `\n        .${this.__widgetId} { \n            width: 100%; \n            height: 100%; \n            position: relative;\n            display: flex;\n            align-items: center;\n            padding: 0px ${this.inputPadding}px;\n            background-color: ${this.bgColor};\n            border-radius: ${this.inputRound}px;\n            border: ${this.borderWidth}px solid ${this.borderColor};\n            transition: all 0.15s;\n            cursor: text;\n        }\n        .${this.__widgetId}.error {\n            border: ${this.borderWidth}px solid #FC2A27;\n        }\n        \n        .${this.__widgetId} input,\n        .${this.__widgetId} textarea {\n            width: 100%;\n            height: 100%;\n            border: none; \n            outline: none;\n            padding: ${this.inputType == "textarea" ? `${this.inputPadding - 4}px 0px` : `0px`};\n            background: transparent;\n            color: ${this.valueColor};\n            font-size: ${this.fontSize}px;\n            text-align: ${this.textAlign};\n            resize: none;\n            scrollbar-width: none;\n        }\n        .${this.__widgetId} input::placeholder,\n        .${this.__widgetId} textarea::placeholder {\n            color: ${this.placeholderColor};\n        }\n        .${this.__widgetId}:has(input:focus),\n        .${this.__widgetId}:has(textarea:focus) {\n            border: ${this.borderWidth}px solid ${this.borderColorFocus};\n        }\n        .${this.__widgetId}:has(input:disabled),\n        .${this.__widgetId}:has(textarea:disabled) {\n            opacity: 0.55;\n        }\n\n        .${this.__widgetId} .qii-icon {\n            margin-right: 5px;\n            pointer-events: none;\n            opacity: ${this.coverIconColor ? .7 : 1};\n        }\n\n        .${this.__widgetId} .error-text {\n            position: absolute;\n            left: 12px;\n            bottom: -25px;\n            color: #FC2A27;\n            font-size: 12px;\n            animation: error-text 0.3s ease both;\n        }\n\n        @keyframes error-text {\n            0% { opacity: 0; transform: translateY(-6px) }\n            100% { opacity: 1; transform: translateY(0px) }\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();