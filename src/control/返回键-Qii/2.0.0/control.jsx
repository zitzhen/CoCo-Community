(() => {
  "use strict";
  var __webpack_modules__ = {
    37: module => {
      module.exports = require("utils");
    }
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== void 0) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
      exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
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
  class CoCoInvisibleWidget extends BaseWidget {
    constructor() {
      super();
    }
    config(options) {
      const {name, id, version, icon = "", eventIcon = "", docs = "", isGlobal = true} = options;
      Object.assign(widgetConfig, {
        title: name,
        type: id,
        version,
        icon,
        eventIcon,
        docs: {
          url: docs
        },
        isInvisibleWidget: true,
        isGlobalWidget: isGlobal
      });
    }
    build() {
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
  const widget = new CoCoInvisibleWidget;
  const utils = __webpack_require__(37);
  var _window = this.window;
  var _document = this.document;
  widget.config({
    name: "返回键",
    id: "QII_WIDGET_BACK_BUTTON",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/Hke_4Pfxll.image/svg+xml",
    eventIcon: "https://static.bcmcdn.com/coco/player/unstable/S1JGrwGxll.image/svg+xml",
    isGlobal: false
  });
  widget.prop("鼠标右键返回（开发时使用，打包请关闭）", "mouseBack", false).noBlock();
  widget.event("按下返回键时", "onClickBackbutton");
  widget.init((function() {
    this.init = false;
  }));
  widget.inMethod("isInit", (function() {
    if (this.init) return true; else {
      this.widgetError("请先初始化返回键");
      return false;
    }
  }));
  widget.method("初始化返回键", "initBackbutton", {
    tips: "在每个屏幕打开时调用一次，初始化返回监听器",
    color: Color.object
  }, (function() {
    if (this.init) return;
    this.init = true;
    if (_window.qii_back_screen_list == void 0) _window.qii_back_screen_list = [];
    this.screenId = _document.querySelector("#rootPlayer > .screen-view").id;
    const handleBackButton = event => {
      event.preventDefault();
      if (_document.querySelector("#rootPlayer > .screen-view").id == this.screenId) this.emit("onClickBackbutton");
    };
    _document.addEventListener("backbutton", handleBackButton);
    if (this.mouseBack && !utils.isNative()) _document.addEventListener("contextmenu", handleBackButton);
  }));
  widget.method("保存当前屏幕", "saveScreen", {
    params: [ {
      key: "name",
      valueType: "string",
      defaultValue: "屏幕1"
    } ],
    tips: "每次切换到下一个屏幕时调用，并传入 <当前屏幕> 的名称",
    color: Color.object
  }, (function(name) {
    if (!this.isInit()) return;
    _window.qii_back_screen_list.push(name);
  }));
  widget.method("退出 APP", "exitApp", {
    tips: "调用后会退出 APP",
    color: Color.object,
    space: 40
  }, (function() {
    if (_window.navigator.app && _window.navigator.app.exitApp) _window.navigator.app.exitApp();
  }));
  widget.method("上一屏", "getLastScreen", {
    returnType: "string",
    tips: "返回上一屏的名称，放在 <切换到屏幕> 积木中使用。返回空字符串表示位于首页",
    color: Color.object,
    methodLabel: false
  }, (function() {
    if (!this.isInit()) return "";
    if (_window.qii_back_screen_list.length > 0) {
      let name = _window.qii_back_screen_list.slice(-1)[0];
      _window.qii_back_screen_list.pop();
      return name;
    } else return "";
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();