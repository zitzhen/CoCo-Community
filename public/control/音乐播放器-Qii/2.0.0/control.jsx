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
 * @author: 琦琦
 * 来自 Qii 控件库，使用 CoCoKit 开发。
 */
  const widget = new CoCoInvisibleWidget;
  widget.config({
    name: "音乐播放器",
    id: "QII_WIDGET_MUSIC_PLAYER",
    version: "2.0.0",
    icon: "https://static.bcmcdn.com/coco/player/unstable/Sk3PjGGYJg.image/svg+xml",
    eventIcon: "https://static.bcmcdn.com/coco/player/unstable/BkilsfMtkg.image/svg+xml"
  });
  widget.prop("音源", "audioUrl", "").noBlock().prop("音量", "audioVolume", 100).editor("AudioVolume").noBlock().prop("音速", "audioRate", 100).editor("AudioRate").noBlock().prop("秒数更新速度", "secondSpeed", "default").editor("OptionSwitch").noBlock().dropdown({
    正常: "default",
    快速: "fast"
  });
  widget.event("音源加载完成", "onReady");
  widget.event("播放", "on", {
    dropdown: [ {
      "开始 时": "Play",
      "暂停 时": "Pause",
      "结束 时": "End"
    } ]
  });
  widget.event("秒数更新时", "onUpdate", {
    params: [ {
      key: "seconds",
      label: "秒数",
      valueType: "number"
    } ]
  });
  widget.event("出错时", "onError", {
    params: [ {
      key: "msg",
      label: "错误信息",
      valueType: "string"
    } ]
  });
  widget.init((function() {
    this.timerInterval = null;
    this.audio = new Audio;
    this.audio.oncanplay = () => {
      if (this.audioUrl !== "") this.emit("onReady");
    };
    this.audio.onplay = () => {
      this.emit("onPlay");
      if (this.secondSpeed == "fast") this.timerInterval = setInterval((() => {
        this.emit("onUpdate", this.audio.currentTime);
      }), 5);
    };
    this.audio.ontimeupdate = () => {
      if (this.secondSpeed == "default") this.emit("onUpdate", this.audio.currentTime);
    };
    this.audio.onpause = () => {
      this.emit("onPause");
      clearInterval(this.timerInterval);
    };
    this.audio.onended = () => {
      this.emit("onEnd");
      clearInterval(this.timerInterval);
    };
    this.audio.onerror = () => {
      if (this.audioUrl !== "") this.emit("onError", "音源加载失败");
      clearInterval(this.timerInterval);
    };
  }));
  widget.inMethod("checkAudio", (function() {
    if (this.audio.src == "") {
      this.emit("onError", "未设置音源");
      return false;
    }
    return true;
  }));
  widget.method("的音源为", "setAudioUrl", {
    params: [ {
      key: "url",
      valueType: "string",
      defaultValue: ""
    } ],
    color: Color.pink,
    methodLabel: "设置"
  }, (function(url) {
    this.setProps({
      audioUrl: url
    });
    this.audio.pause();
    this.audio.src = url;
    this.audio.currentTime = 0;
  }));
  widget.method("", "setAudioStatus", {
    params: [ {
      key: "status",
      valueType: "string",
      defaultValue: "play",
      dropdown: {
        开始播放: "play",
        暂停播放: "pause"
      }
    } ],
    color: Color.pink,
    methodLabel: "设置"
  }, (function(status) {
    if (status == "play") this.audio.play();
    if (status == "pause") this.audio.pause();
  }));
  widget.method("跳转到第", "setAudioSeconds", {
    params: [ {
      key: "seconds",
      labelAfter: "秒",
      valueType: "number",
      defaultValue: 0
    } ],
    color: Color.pink,
    methodLabel: "设置"
  }, (function(seconds) {
    if (!this.checkAudio()) return;
    seconds = Math.min(seconds, this.audio.duration);
    this.audio.currentTime = seconds;
  }));
  widget.method("", "setAudioVolume", {
    params: [ {
      key: "type",
      valueType: "string",
      defaultValue: "volume",
      dropdown: {
        音量: "volume",
        音速: "rate"
      }
    }, {
      key: "value",
      label: "为",
      valueType: "number",
      defaultValue: 100
    } ],
    color: Color.pink,
    methodLabel: "设置",
    space: 40
  }, (function(type, value) {
    if (type == "volume") this.audio.volume = value / 100;
    if (type == "rate") this.audio.playbackRate = value / 100;
  }));
  widget.method("的音源", "getAudioUrl", {
    returnType: "string",
    color: Color.pink,
    methodLabel: false
  }, (function() {
    return this.audioUrl;
  }));
  widget.method("", "getAudioSeconds", {
    params: [ {
      key: "type",
      label: "的",
      valueType: "string",
      defaultValue: "current",
      dropdown: {
        秒数: "current",
        "秒数(时间)": "current_time",
        总时长: "duration",
        "总时长(时间)": "duration_time"
      }
    } ],
    returnType: [ "string", "number" ],
    color: Color.pink,
    methodLabel: false
  }, (function(type) {
    if (type == "current") return this.audio.currentTime;
    if (type == "current_time") return formatSeconds(this.audio.currentTime);
    if (type == "duration") return this.audio.duration;
    if (type == "duration_time") return formatSeconds(this.audio.duration);
  }));
  function formatSeconds(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, "0");
    let sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  }
  widget.method("正在播放", "getAudioPlaying", {
    returnType: "boolean",
    color: Color.pink,
    methodLabel: false
  }, (function() {
    return !this.audio.paused;
  }));
  exports.types = widget.types();
  exports.widget = widget.build();
})();