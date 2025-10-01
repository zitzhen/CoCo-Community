/**
 * Copyright (c) 2023 xiaohong2022
 * Made with Waddle
 */
var document = this.document;
var window = this.window;
exports.types = {
  isInvisibleWidget: true,
  type: "XH_COCO_TOOLS",
  icon: "https://coco.codemao.cn/favicon.ico",
  title: "COCO扩展工具",
  version: "1.0.0",
  isGlobalWidget: true,
  properties: [],
  methods: [],
  events: []
};
exports.types.platforms = ["android", "ios", "web"];
exports.types.docs = {
  url: "https://btmu8uap4l.feishu.cn/wiki/wikcnYnxLbycZEUrJaosl0n72Tf"
};
exports.types.events.push({
  key: "s1",
  label: "预览屏幕全屏状态更变",
  params: []
});
exports.types.events.push({
  key: "s2",
  label: "网页全屏状态更变",
  params: []
});
exports.types.events.push({
  key: "err",
  label: "网页全屏出错",
  params: []
});
exports.types.events.push({
  key: "backbutton",
  label: "【移动端功能】当按下返回键",
  params: []
});
exports.types.methods.push({
  key: "exit",
  label: "退出APP",
  params: [],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "移动端功能"
  }
});
exports.types.methods.push({
  key: "getwidth",
  label: "获取屏幕",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      dropdown: [
        {
          label: "宽度",
          value: "宽度"
        },
        {
          label: "高度",
          value: "高度"
        }
      ]
    }
  ],
  valueType: "number",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "自适应"
  }
});
exports.types.methods.push({
  key: "setwidget",
  label: "设置ID为",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "请开F12获取控件ID！"
    },
    {
      key: "y",
      label: "的控件",
      valueType: "string",
      dropdown: [
        {
          label: "宽度",
          value: "宽度"
        },
        {
          label: "高度",
          value: "高度"
        }
      ]
    },
    {
      key: "z",
      label: "为",
      valueType: "number",
      defaultValue: 100
    }
  ],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "getwidget",
  label: "获取ID为",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "请开F12获取控件ID！"
    },
    {
      key: "y",
      label: "的控件",
      valueType: "string",
      dropdown: [
        {
          label: "宽度",
          value: "宽度"
        },
        {
          label: "高度",
          value: "高度"
        }
      ]
    }
  ],
  valueType: "number",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "getwidgetid",
  label: "获取屏幕控件第",
  params: [
    {
      key: "x",
      label: "",
      valueType: "number",
      defaultValue: 1
    },
    {
      label: "个的控件ID"
    }
  ],
  valueType: "string",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "clickwidget",
  label: "硬核点击ID为",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "请开F12获取控件ID！"
    },
    {
      label: "的控件"
    }
  ],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "点击"
  }
});
exports.types.methods.push({
  key: "fullscreen",
  label: "预览屏幕全屏",
  params: [],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "预览屏幕全屏"
  }
});
exports.types.methods.push({
  key: "exitfullscreen",
  label: "预览屏幕全屏取消",
  params: [],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "isfullscreen",
  label: "获取预览屏幕全屏状态",
  params: [],
  valueType: "boolean",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "webfullscreen",
  label: "网页全屏",
  params: [],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "网页全屏"
  }
});
exports.types.methods.push({
  key: "nowebfullscreen",
  label: "退出网页全屏",
  params: [],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "iswebfullscreen",
  label: "获取网页全屏状态",
  params: [],
  valueType: "boolean",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "settitle",
  label: "设置标签页标题",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "CoCo"
    }
  ],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "标签页"
  }
});
exports.types.methods.push({
  key: "gettitle",
  label: "获取标签页标题",
  params: [],
  valueType: "string",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "setlogo",
  label: "设置标签页图标",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "https://coco.codemao.cn/favicon.ico"
    }
  ],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "getlogo",
  label: "获取标签页图标链接",
  params: [],
  valueType: "string",
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16
  }
});
exports.types.methods.push({
  key: "setUrl",
  label: "硬核更改链接",
  params: [
    {
      key: "x",
      label: "",
      valueType: "string",
      defaultValue: "./114514"
    }
  ],
  blockOptions: {
    color: "#66ccff",
    icon: "",
    generateBlock: true,
    inputsInline: true,
    space: 16,
    line: "链接"
  }
});
exports.widget = class extends InvisibleWidget {
  constructor(props) {
    super(props);
    document.addEventListener("fullscreenchange", () => {
      this.emit("s2");
    });
    document.addEventListener("webkitfullscreenchange", () => {
      this.emit("s2");
    });
    document.addEventListener("mozfullscreenchange", () => {
      this.emit("s2");
    });
    document.addEventListener("MSFullscreenChange", () => {
      this.emit("s2");
    });
    document.addEventListener("fullscreenerror", () => {
      this.emit("err");
    });
    document.addEventListener("webkitfullscreenerror", () => {
      this.emit("err");
    });
    document.addEventListener("mozfullscreenerror", () => {
      this.emit("err");
    });
    document.addEventListener("MSFullscreenError", () => {
      this.emit("err");
    });
    document.addEventListener("backbutton", (e) => {
      e.preventDefault();
      this.emit("backbutton");
    });
  }
};
exports.widget.prototype.exit = function () {
  if (typeof window.navigator.app.exitApp === [][0] + []) {
    window.close();
  } else {
    window.navigator.app.exitApp();
  }
};
exports.widget.prototype.getwidth = function (x) {
  if (document.querySelector(`*[class*="styles_playerWrapper"]`)) {
    return x == "高度"
      ? document.querySelector(`*[class*="styles_playerWrapper"]`).offsetHeight
      : document.querySelector(`*[class*="styles_playerWrapper"]`).offsetWidth;
  } else {
    return x == "高度"
      ? window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight
      : window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
  }
};
exports.widget.prototype.setwidget = function (x, y, z) {
  const ssss =
    document.getElementById(x) != null
      ? () => {
          document.getElementById(x).style.cssText +=
            "max-width:unset;max-height:unset;min-height:unset;min-width:unset;" +
            ("宽度" == y ? "width" : "height") +
            ":" +
            (z + "px");
        }
      : (() => {
          this.widgetError("请开F12获取控件ID！");
        })();
};
exports.widget.prototype.getwidget = function (x, y) {
  var www = document.getElementById(x);
  if (!www) {
    return (() => {
      this.widgetError("请开F12获取控件ID！");
    })();
  }
  return y == "高度" ? www.offsetHeight : www.offsetWidth;
};
exports.widget.prototype.getwidgetid = function (x) {
  var www = document.querySelector(".screen-view-inner");
  if (!www) {
    return (() => {
      this.widgetError("发生错误！");
    })();
  }
  var q = [].slice.call(www.children).reverse()[(Number(x) || 0) - 1];
  if (!q) {
    return (() => {
      this.widgetError("找不到该控件或参数有误！");
    })();
  }
  while (1) {
    if (!q.id) {
      if (q.children) {
        if (q.children.length) {
          q = q.children[0];
        } else {
          return (() => {
            this.widgetError("找不到该控件或参数有误！");
          })();
        }
      } else {
        return (() => {
          this.widgetError("找不到该控件或参数有误！");
        })();
      }
    }
    if (!q) {
      return (() => {
        this.widgetError("找不到该控件或参数有误！");
      })();
    } else {
      return q.id;
    }
  }
};
exports.widget.prototype.clickwidget = function (x) {
  const ssss =
    document.getElementById(x) != null
      ? document.getElementById(x).click()
      : (() => {
          this.widgetError("请开F12获取控件ID！");
        })();
};
exports.widget.prototype.fullscreen = function () {
  if (document.getElementById("XH_COCO_TOOLS_CSS")) return;
  var s = document.createElement("style");
  s.innerHTML = `#rootPlayer,#webPlayer,.screen-view,.screen-view-inner,[class*=styles_community],[class*=styles_main],[class*=styles_playerWrapper]{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;transform:none!important}`;
  s.id = "XH_COCO_TOOLS_CSS";
  document.body.append(s);
  (document.querySelector(`*[class*="styles_deviceFrame"]`) || {}).style =
    "background-image: url()!important;";
  (document.querySelector(`*[class*="styles_emulatorWrapper"]`) || {}).style =
    "display:none!important";
  (document.querySelector(`*[class*="styles_deviceFrame"]`) || {}).style =
    "display:none!important";
  (document.querySelector(`*[class*="styles_appUrlBtn"]`) || {}).style =
    "display:none!important";
  this.emit("s1");
};
exports.widget.prototype.exitfullscreen = function () {
  if (!document.getElementById("XH_COCO_TOOLS_CSS")) return;
  document.getElementById("XH_COCO_TOOLS_CSS").remove();
  (document.querySelector(`*[class*="styles_deviceFrame"]`) || {}).style = "";
  (document.querySelector(`*[class*="styles_emulatorWrapper"]`) || {}).style =
    "";
  (document.querySelector(`*[class*="styles_deviceFrame"]`) || {}).style = "";
  (document.querySelector(`*[class*="styles_appUrlBtn"]`) || {}).style = "";
  this.emit("e1");
};
exports.widget.prototype.isfullscreen = function () {
  if (document.getElementById("XH_COCO_TOOLS_CSS")) return false;
  return true;
};
exports.widget.prototype.webfullscreen = function () {
  if (document.documentElement.RequestFullScreen) {
    document.documentElement.RequestFullScreen();
  }
  if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
  if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  }
  if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
};
exports.widget.prototype.nowebfullscreen = function () {
  if (document.exitFullScreen) {
    document.exitFullscreen();
  }
  if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};
exports.widget.prototype.iswebfullscreen = function () {
  const screen = window.screen;
  const body = document.body.getBoundingClientRect();
  return screen.height === body.height && screen.width === body.width;
};
exports.widget.prototype.settitle = function (x) {
  document.title = x;
};
exports.widget.prototype.gettitle = function () {
  return document.title;
};
exports.widget.prototype.setlogo = function (x) {
  var a = [].slice
    .call(document.querySelectorAll(`link`))
    .find((v) => v.rel.split(" ").includes("icon"));
  if (a) {
    a.href = x;
  } else {
    var b = document.createElement("link");
    b.rel = "icon";
    b.href = x;
    document.head.append(b);
  }
};
exports.widget.prototype.getlogo = function () {
  var a = [].slice
    .call(document.querySelectorAll(`link`))
    .find((v) => v.rel.split(" ").includes("icon"));
  if (a) {
    return a.href;
  } else {
    return "https://coco.codemao.cn/favicon.ico";
  }
};
exports.widget.prototype.setUrl = function (x) {
  history.pushState("", {}, x);
};
