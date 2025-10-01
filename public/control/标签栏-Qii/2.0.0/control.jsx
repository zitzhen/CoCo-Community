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
  /**
 * @author 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */
  const widget = new CoCoWidget;
  widget.config({
    name: "标签栏",
    id: "QII_WIDGET_TAB_BAR",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/HJwYTUFIJl.image/png",
    width: 360,
    height: 50
  });
  const defaultTabberItems = [ {
    key: "首页",
    badge: "",
    value: "<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M10.8 2.65a2 2 0 0 1 2.4 0l7 5.25a2 2 0 0 1 .8 1.6V19a2 2 0 0 1-2 2h-4.9a1.1 1.1 0 0 1-1.1-1.1V14a1 1 0 1 0-2 0v5.9A1.1 1.1 0 0 1 9.9 21H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 .8-1.6zm1.2 1.6L5 9.5V19h4v-5a3 3 0 1 1 6 0v5h4V9.5z'/></svg>,<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M13.2 2.65a2 2 0 0 0-2.4 0l-7 5.25A2 2 0 0 0 3 9.5V19a2 2 0 0 0 2 2h3.9a1.1 1.1 0 0 0 1.1-1.1V15a2 2 0 1 1 4 0v4.9a1.1 1.1 0 0 0 1.1 1.1H19a2 2 0 0 0 2-2V9.5a2 2 0 0 0-.8-1.6z'/></svg>"
  }, {
    key: "发现",
    badge: "",
    value: "<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M10.5 2c.58 0 1.15.058 1.699.17a1 1 0 1 1-.398 1.96 6.5 6.5 0 1 0 5.069 7.671 1 1 0 1 1 1.96.398 8.463 8.463 0 0 1-1.457 3.303l-.197.26 3.652 3.652a1 1 0 0 1-1.32 1.498l-.094-.084-3.652-3.652A8.5 8.5 0 1 1 10.5 2M19 1a1 1 0 0 1 .898.56l.048.117.13.378a3 3 0 0 0 1.684 1.8l.185.07.378.129a1 1 0 0 1 .118 1.844l-.118.048-.378.13a3 3 0 0 0-1.8 1.684l-.07.185-.129.378a1 1 0 0 1-1.844.117l-.048-.117-.13-.378a3 3 0 0 0-1.684-1.8l-.185-.07-.378-.129a1 1 0 0 1-.118-1.844l.118-.048.378-.13a3 3 0 0 0 1.8-1.684l.07-.185.129-.378A1 1 0 0 1 19 1m0 3.196a5.006 5.006 0 0 1-.804.804c.298.236.567.506.804.804.236-.298.506-.568.804-.804A5.006 5.006 0 0 1 19 4.196'/></svg>,<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M10.5 2c1.251 0 2.44.27 3.509.756a3.001 3.001 0 0 0-.97 1.759A6.5 6.5 0 1 0 17 10.5l-.005-.269c.536.48 1.239.765 1.991.769a8.46 8.46 0 0 1-1.809 4.762l3.652 3.652a1 1 0 0 1-1.414 1.414l-3.652-3.652A8.5 8.5 0 1 1 10.5 2m0 3c.927 0 1.801.23 2.568.635a3 3 0 0 0 1.963 2.204l.348.119A5.5 5.5 0 1 1 10.5 5M19 1a1 1 0 0 1 .898.56l.048.117.13.378a3 3 0 0 0 1.684 1.8l.185.07.378.129a1 1 0 0 1 .118 1.844l-.118.048-.378.13a3 3 0 0 0-1.8 1.684l-.07.185-.129.378a1 1 0 0 1-1.844.117l-.048-.117-.13-.378a3 3 0 0 0-1.684-1.8l-.185-.07-.378-.129a1 1 0 0 1-.118-1.844l.118-.048.378-.13a3 3 0 0 0 1.8-1.684l.07-.185.129-.378A1 1 0 0 1 19 1'/></svg>"
  }, {
    key: "动态",
    badge: "",
    value: "<svg viewBox='0 0 24 24'><path fill='#09244BFF' fill-rule='evenodd' d='M12 3c2.225 0 4.263.808 5.833 2.146.931-.22 1.785-.322 2.507-.26.76.064 1.603.337 2.052 1.114.407.704.352 1.49.076 2.204-.272.702-.787 1.427-1.481 2.163l-.114.12a9 9 0 0 1-14.62 8.44l-.16.04c-.985.233-1.87.317-2.615.2-.757-.118-1.465-.465-1.87-1.167-.45-.777-.264-1.644.06-2.334.308-.655.823-1.344 1.479-2.04A9 9 0 0 1 12 3M3.345 17.009c-.143-.709 1-1.75 1.406-2.167a1.53 1.53 0 0 0 .4-1.386 7 7 0 0 1 11.531-6.66 1.53 1.53 0 0 0 1.402.348c.563-.144 2.039-.613 2.581-.135.336.704-.971 1.832-1.38 2.239a4.684 4.684 0 0 0-.01.01c-1.236 1.23-3.281 2.746-6.275 4.474-2.992 1.728-5.326 2.74-7.01 3.197l-.015.004c-.527.143-2.209.689-2.63.076m5.288 1.13c1.538-.614 3.33-1.499 5.367-2.675 2.036-1.175 3.698-2.284 4.998-3.31A7 7 0 0 1 8.633 18.14Z'/></svg>,<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M20.989 12.446a9 9 0 0 1-13.1 7.563 27.86 27.86 0 0 0 2.813-1.129 49.768 49.768 0 0 0 4.048-2.117 49.8 49.8 0 0 0 3.858-2.448 27.897 27.897 0 0 0 2.381-1.869M11.999 3c2.226 0 4.263.808 5.834 2.146l.317-.072.167-.034.346-.064.359-.054c1.275-.167 2.706-.072 3.37 1.078.762 1.32-.058 2.784-.957 3.862l-.225.262-.223.243c-1.394 1.478-3.703 3.201-6.987 5.097-3.284 1.896-5.93 3.034-7.908 3.503l-.159.036-.331.069-.346.06c-1.347.205-2.918.133-3.649-1.132-.663-1.15-.03-2.436.751-3.457l.226-.284.115-.136.227-.258.22-.24A9 9 0 0 1 12 3ZM3.872 15.869l-.154.213c-.165.235-.347.525-.374.788v.128c.14.25.637.252 1.002.225l.304-.03a8.995 8.995 0 0 1-.778-1.325Zm16.785-8.867c-.202-.15-.533-.164-.834-.145l-.285.025c-.044.005-.085.01-.124.013.29.42.545.866.761 1.334l.161-.225c.189-.273.42-.662.357-.922L20.66 7l-.004.002Z'/></svg>"
  }, {
    key: "我的",
    badge: "",
    value: "<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M16 14a5 5 0 0 1 4.995 4.783L21 19v2a1 1 0 0 1-1.993.117L19 21v-2a3 3 0 0 0-2.824-2.995L16 16H8a3 3 0 0 0-2.995 2.824L5 19v2a1 1 0 0 1-1.993.117L3 21v-2a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6'/></svg>,<svg viewBox='0 0 24 24'><path fill='#09244BFF' d='M16 14a5 5 0 0 1 4.995 4.783L21 19v1a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20v-1a5 5 0 0 1 4.783-4.995L8 14zM12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10'/></svg>"
  } ];
  widget.prop("标签列表", "tabberItems", defaultTabberItems).editor(EType.HttpHeader).noBlock().prop("当前选项", "activeItem", 1).unit("序号").prop("显示图标", "showIcon", true).noBlock().prop("显示文本", "showText", true).noBlock().prop("文本加粗", "textBold", false).noBlock().prop("横向排列", "horizontal", false).noBlock().prop("文字大小", "textSize", 12).unit("px").noBlock().prop("图标大小", "iconSize", 20).unit("px").noBlock().prop("覆盖图标颜色", "coverIconColor", true).noBlock().prop("背景模糊", "bgBlur", 0).unit("px").noBlock().prop("背景颜色", "bgColor", "#FFFFFF").prop("选中颜色", "activeColor", "#262628").prop("未选颜色", "inactiveColor", "#0102044F").prop("添加空选项", "emptyItem", false).prop("空选项位置", "emptyItemIndex", 3).unit("序号").noBlock().prop("空选项宽度", "emptyItemWidth", 70).unit("px").noBlock().prop("屏幕适配", "screenAlign", "top").dropdown({
    顶部对齐: "top",
    底部对齐: "bottom"
  }).noBlock();
  widget.event("选项被点击时", "onClickItem", {
    params: [ {
      key: "text",
      label: "文本",
      valueType: "string"
    }, {
      key: "index",
      label: "序号",
      valueType: "number"
    } ]
  });
  widget.method("红点提示", "setBadgeText", {
    params: [ {
      key: "text",
      label: "选项",
      valueType: "string",
      defaultValue: "首页"
    }, {
      key: "badge",
      label: "提示",
      valueType: "string",
      defaultValue: ""
    } ],
    color: Color.blue,
    space: 40
  }, (function(text, badge) {
    this.setProps({
      tabberItems: this.tabberItems.map(((item, index) => {
        if (item.key === text) item.badge = badge;
        return item;
      }))
    });
  }));
  widget.inMethod("renderItems", (function() {
    const itemList = this.tabberItems.map(((item, index) => {
      const isActive = index === this.activeItem - 1;
      const isDot = item.badge && item.badge == ".";
      return React.createElement(React.Fragment, null, this.emptyItem && index + 1 === this.emptyItemIndex && React.createElement("div", {
        className: "empty",
        style: {
          width: this.emptyItemWidth
        }
      }), React.createElement("div", {
        className: "item",
        key: index,
        onClick: () => this.emit("onClickItem", item.key, index + 1)
      }, React.createElement(Icon, {
        show: this.showIcon && !isActive,
        size: this.iconSize,
        color: this.coverIconColor ? this.inactiveColor : "",
        code: item.value.split(",")[0]
      }), React.createElement(Icon, {
        show: this.showIcon && isActive,
        size: this.iconSize,
        color: this.coverIconColor ? this.activeColor : "",
        code: item.value.split(",")[1] || item.value.split(",")[0]
      }), this.showText && React.createElement("span", {
        className: "text",
        style: {
          color: isActive ? this.activeColor : this.inactiveColor,
          fontWeight: this.textBold && isActive ? "bold" : "normal"
        }
      }, item.key), item.badge && !isDot && React.createElement("div", {
        className: "badge"
      }, React.createElement("span", null, item.badge)), item.badge && isDot && React.createElement("div", {
        className: "badge dot"
      })));
    }));
    return itemList;
  }));
  widget.render((function() {
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: this.__widgetId,
      "data-screen-align": this.screenAlign
    }, this.renderItems()), React.createElement("style", null, `\n        .${this.__widgetId} {\n            width: 100%; \n            height: 100%;\n            padding: 5px;\n            display: flex;\n            align-items: center;\n            background-color: ${this.bgColor};\n            backdrop-filter: ${this.bgBlur ? `blur(${this.bgBlur}px)` : ""};\n        }\n        .${this.__widgetId} .item {\n            flex: 1;\n            position: relative;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            flex-direction: ${this.horizontal ? "row" : "column"};\n            border-radius: 4px;\n            transition: background-color 0.2s;\n        }\n        .${this.__widgetId} .item .qii-icon {\n            margin-top: ${!this.horizontal && this.showText ? 4 : 0}px;\n        }\n        .${this.__widgetId} .item .text {\n            transform: scale(0.8);\n            font-size: ${this.textSize}px;\n        }\n        .${this.__widgetId} .item .badge {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            position: absolute; left: 50%; top: 40%;\n            transform: translate(-50%, -50%) scale(0.8);\n            padding: 1px 6px 0 6px;\n            margin: -11px 0 0 11px;\n            height: 18px;\n            background: #F74C31;\n            border-radius: 100px;\n            color: #FFFFFF;\n            font-size: 12px;\n        }\n        .${this.__widgetId} .item .badge.dot {\n            padding: 0;\n            width: 8px;\n            height: 8px;\n            border-radius: 100px;\n        }\n        .${this.__widgetId} .item .badge span {\n            transform: translateY(0.5px);\n            text-wrap: nowrap;\n        }\n    `));
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();