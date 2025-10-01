(() => {
  "use strict";
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
  function IconLoading({show = true, size = 20, ...props}) {
    if (!show) return null;
    return [ React.createElement("svg", {
      className: "qii-icon loading",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      ...props
    }, [ React.createElement("path", {
      key: "path1",
      fill: "currentColor",
      d: "m1.9 12c0 3.6 1.9 6.2 3 7.2 0.1 0.1 0.8 0.5 1.5 0 0.6-0.7 0.2-1.4 0-1.7-1.3-1.2-2.3-3.1-2.3-5.5 0-2.4 1-4.3 2.2-5.5 0.2-0.1 0.8-0.9 0.1-1.7-0.7-0.5-1.3-0.2-1.5 0-1 1-3 3.6-3 7.2z"
    }), React.createElement("path", {
      key: "path2",
      fill: "currentColor",
      opacity: "0.2",
      d: "m12 1.9c5.6 0 10.1 4.5 10.1 10.1 0 5.6-4.5 10.1-10.1 10.1-5.6 0-10.1-4.5-10.1-10.1 0-5.6 4.5-10.1 10.1-10.1zm-7.9 10.1c0 4.3 3.6 7.9 7.9 7.9 4.3 0 7.9-3.6 7.9-7.9 0-4.3-3.6-7.9-7.9-7.9-4.3 0-7.9 3.6-7.9 7.9zz"
    }) ]), React.createElement("style", {
      key: "style",
      dangerouslySetInnerHTML: {
        __html: `\n                .qii-icon.loading {\n                    animation: icon-spin 0.8s infinite linear;\n                }\n                @keyframes icon-spin {\n                    0% { transform: rotate(0deg) }\n                    100% { transform: rotate(360deg) }\n                }\n            `
      }
    }) ];
  }
  /**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */
  const widget = new CoCoWidget;
  var _window = this.window;
  this.document;
  widget.config({
    name: "按钮",
    id: "QII_WIDGET_BUTTON",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/HyDgABNleg.image/png",
    width: 90,
    height: 35
  });
  widget.prop("文本配置", "ButtonTextGroup", "").editor("ButtonTextGroup").noBlock().prop("文本", "textVisible", true).hide().noGet().dropdown({
    显示: true,
    隐藏: false
  }).line("文本").prop("文本内容", "text", "按钮").hide().prop("文本字体", "fontFamily", "sans-serif").hide().noBlock().prop("文本字号", "maxFontSize", 14).hide().noBlock().prop("文本颜色", "textColor", "#FFFFFF").hide().noBlock().prop("文本对齐", "textAlign", "center").hide().noGet().dropdown({
    左侧: "left",
    居中: "center",
    右侧: "right"
  }).prop("自定义字体", "customFontFamily", "").noGet().prop("文本加粗", "textBlod", false).noGet().prop("按钮圆角", "buttonRound", 20).unit("px").noGet().line("按钮").prop("按钮颜色", "buttonColor", "#3080FF").noGet().prop("按钮颜色-渐变", "buttonColor2", "transparent").noGet().prop("渐变角度", "colorAngle", 160).unit("度").noGet().prop("背景模糊", "bgBlur", 0).unit("px").noGet().prop("字距", "letterSpacing", 0).unit("px").noGet().prop("点击变暗", "animDark", true).noGet().prop("点击缩小", "animSize", true).noGet().prop("加载", "loading", false).prop("禁用", "disabled", false).prop("边框粗细", "borderWidth", 0).unit("px").noGet().line("边框").prop("边框颜色", "borderColor", "#303032").noGet().prop("图标", "icon", "").noGet().line("图标").prop("图标大小", "iconSize", 18).unit("px").noGet().prop("覆盖图标颜色", "coverIconColor", true).noGet().prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("被", "on", {
    dropdown: [ {
      "点击 时": "Click",
      "按下 时": "Down",
      "松开 时": "Up",
      "长按 时": "Long"
    } ]
  });
  widget.inMethod("onEvent", (function(event, name) {
    if (this.loading || this.disabled) return;
    event.persist();
    _window.qii_click_position = event.currentTarget.getBoundingClientRect();
    this.emit("on" + name);
  }));
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("button", {
      className: this.__widgetId,
      disabled: this.disabled,
      onClick: e => this.onEvent(e, "Click"),
      onMouseDown: e => this.onEvent(e, "Down"),
      onTouchStart: e => this.onEvent(e, "Down"),
      onMouseUp: e => this.onEvent(e, "Up"),
      onTouchEnd: e => this.onEvent(e, "Up"),
      onContextMenu: e => {
        e.preventDefault();
        this.onEvent(e, "Long");
      },
      "data-screen-align": this.screenAlign
    }, React.createElement(Icon, {
      show: this.icon && !this.loading,
      size: this.iconSize,
      code: this.icon,
      color: this.coverIconColor ? this.textColor : ""
    }), React.createElement(IconLoading, {
      show: this.loading,
      size: this.iconSize
    }), this.textVisible && this.text != "" && React.createElement("span", null, this.text)), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%;\n            height: 100%;\n            padding: 0 ${this.textAlign !== "center" ? "14px" : "0"};\n            display: flex;\n            align-items: center;\n            justify-content: ${this.textAlign};\n            background: transparent;\n            border: none;\n            color: ${this.textColor};\n            font-size: ${this.maxFontSize}px;\n            font-weight: ${this.textBlod ? "bold" : "normal"};\n            font-family: ${this.customFontFamily};\n            text-indent: ${this.letterSpacing}px;\n            letter-spacing: ${this.letterSpacing}px;\n            transition: transform 0.15s, opacity 0.15s;\n            cursor: pointer;\n        }\n        \n        /* 使用伪元素当作背景，单独对背景设置滤镜 */\n        .${this.__widgetId}::before {\n            content: '';\n            position: absolute; top: 0; left: 0;\n            width: 100%;\n            height: 100%;\n            background: ${this.buttonColor2 == "transparent" ? this.buttonColor : `linear-gradient(${this.colorAngle}deg, ${this.buttonColor}, ${this.buttonColor2})`};\n            border-radius: ${this.buttonRound}px;\n            border: ${this.borderWidth}px solid ${this.borderColor};\n            backdrop-filter: ${this.bgBlur ? `blur(${this.bgBlur}px)` : ""};\n            transition: filter 0.1s;\n        }\n        \n        .${this.__widgetId} > * {\n            z-index: 2;\n        }\n        .${this.__widgetId} > span {\n            margin-top: 1.5px;\n        }\n        .${this.__widgetId} .qii-icon {\n            margin-top: 1px;\n            margin-right: ${this.textVisible && this.text != "" ? 5 : 0}px;\n        }\n\n        .${this.__widgetId}:disabled {\n            opacity: 0.55;\n        }\n        .${this.__widgetId}:not([disabled]):active {\n            transform: scale(${this.animSize ? .96 : 1});\n        }\n        .${this.__widgetId}:not([disabled]):active::before {\n            filter: brightness(${this.animDark ? .86 : 1});\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();