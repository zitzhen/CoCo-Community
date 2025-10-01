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
  this.window;
  var _document = this.document;
  widget.config({
    name: "动画库",
    id: "QII_WIDGET_ANIM",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/ryCx59SKyx.image/svg+xml",
    isGlobal: true
  });
  widget.init((function() {
    this.animConfig = {};
    this.animList = {};
    this.resetAnim();
  }));
  widget.inMethod("resetAnim", (function() {
    this.animConfig = {
      size: [ 1, 1 ],
      rotate: [ 0, 0 ],
      opacity: [ 1, 1 ],
      blur: [ 0, 0 ],
      brightness: [ 1, 1 ],
      moveStart: [ 0, 0 ],
      moveEnd: [ 0, 0 ],
      positionStart: null,
      positionEnd: null,
      origin: "50% 50%"
    };
  }));
  widget.inMethod("getAnimKeyframes", (function(name) {
    const anim = this.animList[name] || this.animConfig;
    const keyframes = [ {
      transform: `scale(${anim.size[0]}) rotate(${anim.rotate[0]}deg) translate(${anim.moveStart[0]}, ${anim.moveStart[1]})`,
      left: this.animConfig.positionStart ? this.animConfig.positionStart[0] : "",
      top: this.animConfig.positionStart ? this.animConfig.positionStart[1] : "",
      opacity: anim.opacity[0],
      filter: `blur(${anim.blur[0]}px) brightness(${anim.brightness[0]})`,
      transformOrigin: anim.origin
    }, {
      transform: `scale(${anim.size[1]}) rotate(${anim.rotate[1]}deg) translate(${anim.moveEnd[0]}, ${anim.moveEnd[1]})`,
      left: this.animConfig.positionEnd ? this.animConfig.positionEnd[0] : "",
      top: this.animConfig.positionEnd ? this.animConfig.positionEnd[1] : "",
      opacity: anim.opacity[1],
      filter: `blur(${anim.blur[1]}px) brightness(${anim.brightness[1]})`,
      transformOrigin: anim.origin
    } ];
    return keyframes;
  }));
  widget.method("设置", "setAnim", {
    params: [ {
      key: "anim",
      valueType: "string",
      defaultValue: "size",
      dropdown: {
        大小: "size",
        旋转: "rotate",
        透明度: "opacity",
        模糊度: "blur",
        亮度: "brightness"
      }
    }, {
      key: "start",
      valueType: "number",
      defaultValue: 0
    }, {
      key: "end",
      label: "→",
      valueType: "number",
      defaultValue: 1
    } ],
    color: Color.blue_light,
    line: "设置动画"
  }, (function(anim, start, end) {
    this.animConfig[anim] = [ start, end ];
  }));
  widget.method("设置位置", "setAnimMove", {
    params: [ {
      key: "startX",
      valueType: "string",
      defaultValue: "0px"
    }, {
      key: "startY",
      valueType: "string",
      defaultValue: "0px"
    }, {
      key: "endX",
      label: "→",
      valueType: "string",
      defaultValue: "0px"
    }, {
      key: "endY",
      valueType: "string",
      defaultValue: "0px"
    }, {
      key: "type",
      valueType: "string",
      defaultValue: "widget",
      dropdown: {
        控件: "widget",
        屏幕: "screen"
      }
    } ],
    color: Color.blue_light
  }, (function(startX, startY, endX, endY, type) {
    if (type == "widget") {
      this.animConfig.moveStart = [ startX, startY ];
      this.animConfig.moveEnd = [ endX, endY ];
    }
    if (type == "screen") {
      this.animConfig.positionStart = [ startX, startY ];
      this.animConfig.positionEnd = [ endX, endY ];
    }
  }));
  widget.method("设置原点", "setAnimOrigin", {
    params: [ {
      key: "x",
      label: "横向",
      valueType: "string",
      defaultValue: "50%"
    }, {
      key: "y",
      label: "纵向",
      valueType: "string",
      defaultValue: "50%"
    } ],
    color: Color.blue_light
  }, (function(x, y) {
    this.animConfig.origin = `${x} ${y}`;
  }));
  widget.method("保存动画", "saveAnim", {
    params: [ {
      key: "name",
      label: "名称",
      valueType: "string",
      defaultValue: "动画 1"
    } ],
    color: Color.blue,
    line: "控制动画"
  }, (function(name) {
    this.animList[name] = this.animConfig;
    this.resetAnim();
  }));
  widget.method("播放动画", "playAnim", {
    params: [ {
      key: "ids",
      label: "控件ID",
      valueType: "string",
      defaultValue: ""
    }, {
      key: "name",
      label: "动画名",
      valueType: "string",
      defaultValue: ""
    }, {
      key: "time",
      label: "时间/秒",
      valueType: "number",
      defaultValue: .5
    }, {
      key: "cubic",
      valueType: "string",
      defaultValue: "silky",
      dropdown: {
        丝滑: "silky",
        回弹: "rebound",
        非线性: "ease",
        线性: "linear"
      }
    }, {
      key: "direction",
      valueType: "string",
      defaultValue: "normal",
      dropdown: {
        正向: "normal",
        反向: "reverse",
        交替: "alternate"
      }
    }, {
      key: "iteration",
      label: "重复",
      valueType: "string",
      defaultValue: "1"
    } ],
    color: Color.blue
  }, (function(ids, name, time, cubic, direction, iterations) {
    const idList = ids.split(",");
    for (let i = 0; i < idList.length; i++) {
      const widgetElement = _document.getElementById(idList[i]);
      if (widgetElement) {
        const cubicConfig = {
          silky: [ "cubic-bezier(.25, .92, .3, 1)", "cubic-bezier(.7, 0, .75, .08)" ],
          rebound: [ "cubic-bezier(.25, .92, .25, 1.1)", "cubic-bezier(.75, -0.1, .75, .08)" ],
          ease: [ "cubic-bezier(.25, .1, .25, 1)", "cubic-bezier(.75, 0, .75, 0.9)" ],
          linear: [ "linear", "linear" ]
        };
        const options = {
          fill: "both",
          easing: cubicConfig[cubic][direction == "reverse" ? 1 : 0],
          duration: time * 1e3,
          direction,
          iterations
        };
        widgetElement.animate(this.getAnimKeyframes(name), options);
      }
    }
    this.resetAnim();
  }));
  widget.method("清除动画", "clearAnim", {
    params: [ {
      key: "ids",
      label: "控件ID",
      valueType: "string",
      defaultValue: ""
    } ],
    color: Color.blue
  }, (function(ids) {
    const idList = ids.split(",");
    for (let i = 0; i < idList.length; i++) {
      const widgetElement = _document.getElementById(idList[i]);
      if (widgetElement) {
        const animations = widgetElement.getAnimations();
        animations.forEach((anim => {
          anim.cancel();
        }));
      }
    }
  }));
  widget.method("", "getAnim", {
    returnType: "object",
    params: [ {
      key: "name",
      valueType: "string",
      defaultValue: "动画 1"
    } ],
    color: Color.yellow,
    line: "获取动画",
    methodLabel: false
  }, (function(name) {
    return this.getAnimKeyframes(name);
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();