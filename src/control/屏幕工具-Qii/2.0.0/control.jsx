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
 * @author: 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */
  const widget = new CoCoInvisibleWidget;
  var _window = this.window;
  var _document = this.document;
  widget.config({
    name: "屏幕工具",
    id: "QII_WIDGET_SCREEN_TOOLS",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/SktGTW8exe.image/svg+xml",
    isGlobal: true
  });
  widget.method("让控件自动适配屏幕", "onAutoAdapts", {
    tips: "在 <启动屏幕> 中调用一次，即可让控件自动适配屏幕（需要控件适配该功能）",
    color: Color.event,
    space: 20,
    line: "屏幕适配"
  }, (function() {
    if (this.isInit) return;
    this.isInit = true;
    const processWidget = item => {
      if (item.hasAttribute("data-is-adapts")) return;
      const targetItem = item.hasAttribute("id") ? item : item.children[0];
      let itemTop = parseInt(targetItem.style.top);
      let itemHeight = parseInt(targetItem.style.height);
      const targetItemChildren = targetItem.children[0];
      if (targetItemChildren.hasAttribute("data-screen-align")) {
        const align = targetItemChildren.getAttribute("data-screen-align");
        if (align === "top") targetItem.style.top = this.calcWidgetTop("top", itemTop) + "px";
        if (align === "bottom") targetItem.style.top = this.calcWidgetTop("bottom", itemTop) + "px";
      }
      if (itemHeight === 640) targetItem.style.height = _window.innerHeight + "px";
      targetItem.setAttribute("data-is-adapts", "true");
    };
    const observer = new MutationObserver(((mutationsList, observer) => {
      for (const mutation of mutationsList) if (mutation.attributeName == "data-screen-id") {
        const widgets = _document.querySelectorAll(".screen-view-inner > *");
        widgets.forEach((element => processWidget(element)));
        break;
      }
    }));
    const screenElement = _document.getElementById("rootPlayer");
    observer.observe(screenElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }));
  widget.method("", "calcWidgetTop", {
    params: [ {
      key: "position",
      valueType: "string",
      defaultValue: "top",
      dropdown: {
        顶部: "top",
        底部: "bottom"
      }
    }, {
      key: "widgetY",
      valueType: "number",
      defaultValue: 0
    } ],
    returnType: "number",
    tips: "传入控件的 <Y坐标>，然后把该积木设置给控件的 <Y坐标>\n功能：手动适配控件",
    color: Color.yellow,
    methodLabel: false
  }, (function(position, widgetY) {
    if (position === "top") {
      const topWidget = (_window.innerHeight - 640) / 2;
      return widgetY - topWidget;
    }
    if (position === "bottom") {
      const bottomWidget = (_window.innerHeight - 640) / 2 + 640;
      return bottomWidget - (640 - widgetY);
    }
    return widgetY;
  }));
  widget.method("适配高度", "calcWidgetHeight", {
    params: [ {
      key: "height",
      valueType: "number",
      defaultValue: 0
    }, {
      key: "widgetY",
      valueType: "number",
      defaultValue: 0
    } ],
    returnType: "number",
    tips: "传入控件的 <高度> <Y坐标>，然后把该积木设置给控件的 <高度>\n功能：适配屏幕时，让控件的底边保持不动",
    color: Color.yellow,
    methodLabel: false,
    space: 40
  }, (function(height, widgetY) {
    return _window.innerHeight - widgetY - (640 - (height + widgetY));
  }));
  widget.method("", "startSwitchScreen", {
    params: [ {
      key: "type",
      label: "切换屏幕",
      valueType: "string",
      dropdown: {
        右侧: "right",
        左侧: "left",
        底部: "bottom",
        淡化: "fade"
      }
    }, {
      key: "direction",
      valueType: "string",
      dropdown: {
        打开: "normal",
        返回: "reverse"
      }
    }, {
      key: "time",
      labelAfter: "秒",
      valueType: "number",
      defaultValue: .4
    } ],
    tips: "在 <切换屏幕> 之前调用一次，就可以播放屏幕切换动画",
    color: Color.event,
    line: "屏幕切换"
  }, (function(type, direction, time, config_1 = [], config_2 = []) {
    const screenView = _document.querySelector("#rootPlayer .screen-view");
    const tempScreen = screenView.cloneNode(true);
    tempScreen.id = "qii_temp_screen";
    Object.assign(tempScreen.style, {
      position: "fixed",
      top: "0",
      width: "360px",
      borderRadius: this.screenRadius + "px",
      pointerEvents: "none",
      zIndex: direction == "normal" ? 1 : 20
    });
    screenView.parentNode.insertBefore(tempScreen, screenView.nextSibling);
    _document.getElementById("rootPlayer").style.overflow = "hidden";
    screenView.style.pointerEvents = "none";
    screenView.style.borderRadius = this.screenRadius + "px";
    const animationTypes = {
      right: {
        screenView: [ {
          transform: "translateX(100%)"
        }, {
          transform: "translateX(0%)"
        } ],
        tempScreen: [ {
          transform: "translateX(0%)",
          filter: "brightness(1)"
        }, {
          transform: "translateX(-25%)",
          filter: "brightness(0.85)"
        } ]
      },
      left: {
        screenView: [ {
          transform: "translateX(-100%)"
        }, {
          transform: "translateX(0%)"
        } ],
        tempScreen: [ {
          filter: "brightness(1)"
        }, {
          filter: "brightness(0.85)"
        } ]
      },
      bottom: {
        screenView: [ {
          transform: "translateY(100%)"
        }, {
          transform: "translateY(0%)"
        } ],
        tempScreen: [ {
          filter: "brightness(1)"
        }, {
          filter: "brightness(0.85)"
        } ]
      },
      fade: {
        screenView: [ {
          opacity: "0"
        }, {
          opacity: "1"
        } ],
        tempScreen: [ {
          opacity: "1"
        }, {
          opacity: "0"
        } ]
      },
      custom: {
        screenView: [ config_1[0], config_1[1] ],
        tempScreen: [ config_2[0], config_2[1] ]
      }
    };
    const options = {
      fill: "both",
      duration: time * 1e3,
      direction,
      easing: direction == "normal" ? "cubic-bezier(.25,.65,.3,1)" : "cubic-bezier(.7,0,.75,.35)"
    };
    const tempScreen_Keyframes = animationTypes[type]?.tempScreen || [];
    const screenView_Keyframes = animationTypes[type]?.screenView || [];
    const screenViewAnimation = screenView.animate(direction == "normal" ? screenView_Keyframes : tempScreen_Keyframes, options);
    const tempScreenAnimation = tempScreen.animate(direction == "normal" ? tempScreen_Keyframes : screenView_Keyframes, options);
    screenViewAnimation.onfinish = () => {
      screenView.style.pointerEvents = "";
      screenView.style.borderRadius = "";
      screenView.getAnimations().forEach((anim => {
        anim.cancel();
      }));
      _document.getElementById("rootPlayer").style.overflow = "auto";
    };
    tempScreenAnimation.onfinish = () => {
      tempScreen.remove();
    };
  }));
  widget.method("自定义动画", "startCustomSwitchScreen", {
    params: [ {
      key: "config_1",
      label: "屏幕1",
      valueType: [ "string", "array" ],
      defaultValue: ""
    }, {
      key: "config_2",
      label: "屏幕2",
      valueType: [ "string", "array" ],
      defaultValue: ""
    }, {
      key: "direction",
      valueType: "string",
      dropdown: {
        打开: "normal",
        返回: "reverse"
      }
    }, {
      key: "time",
      labelAfter: "秒",
      valueType: "number",
      defaultValue: .4
    } ],
    tips: "传入使用 <动画库> 设置的动画，自定义你的切换动画",
    color: Color.event
  }, (function(config_1, config_2, direction, time) {
    this.startSwitchScreen("custom", direction, time, config_1, config_2);
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();