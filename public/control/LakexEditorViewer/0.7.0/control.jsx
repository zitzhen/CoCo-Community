/**
 * Copyright (c) 2023 xiaohong2022
 * 
 * 特别鸣谢：
 * LakexEditor 官方文档 https://www.yuque.com/yuque/developer/gfoax065u2v72isu
 * Waddle 编辑器
 * CoCo 中控台
 */

// 一些常量
const auther = "小宏XeLa" // 作者
const version = "0.7.0" // 版本号
const qq = 3174251894 // 作者QQ
const color = "#66ccff" // 积木颜色
const icon = 'icon-toolbox-feature'; // 图标

// 一些变量
var window = this.window;
var type = [
    { label: "自带格式", value: "text/lake" },
    { label: "HTML", value: "text/html" },
    { label: "MarkDown", value: "text/markdown" },
    { label: "纯文本", value: "text/plain" },
    { label: "字典", value: "json" },
];

var types = { // 自定义控件设置
    type: 'XH_Lakex_Editor_VIEWER_WIDGET', // 控件编号
    icon, // 控件图标
    title: 'LakexEditorViewer', // 控件名称
    platforms: ['android', 'ios', 'web'], // 控件可用范围
    version, // 控件版本
    auther, // 控件作者
    docs: { url: "https://btmu8uap4l.feishu.cn/wiki/TJvCwxPV1iwtZ3kMLVhcCwnonYb", }, // 帮助链接
    isInvisibleWidget: false, // 不是功能控件
    isGlobalWidget: false, // 不是全局控件
    properties: [ // 属性
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 200,
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 150,
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: '__size',
            label: '',
            valueType: 'number',
            defaultValue: 0,
            readonly: true,
            blockOptions: {
                setter: {
                    keys: ['__height', '__width'],
                },
                getter: {
                    keys: ['__height', '__width'],
                },
            },
        },
        {
            key: 'theme',
            label: '深色主题',
            valueType: 'boolean',
            defaultValue: false,
        },
    ],
    methods: [ // 方法
        {
            key: 'init',
            label: '初始化',
            params: [],
            blockOptions: { color, icon }
        },
        {
            key: 'reinitialize',
            label: '重新初始化',
            params: [],
            blockOptions: { color, icon }
        },
        {
            key: 'setDocument',
            label: '设置文档内容',
            params: [
                {
                    key: 'type',
                    label: '格式',
                    valueType: 'string',
                    dropdown: type,
                },
                {
                    key: 'content',
                    label: '内容',
                    valueType: ["string", "object"],
                    defaultValue: ""
                },
            ],
            blockOptions: { color, icon }
        },
    ],
    events: [],
};

const mnbloader = `
class LOADER {
    constructor() {}
    loadReact() {
        return new Promise((reu) => {
        fetch("https://static.bcmcdn.com/coco/player/unstable/By1YBkqoR.text/javascript?hash=Fqp3rkxJ9SW8Id4dBPCKXXOWLHzO").then(v => v.text()).then(code => {
            !(() => {
                new Function(
                    'exports',
                    'module',
                    'define',
                    'require',
                    'self',
                    'globalThis',
                    code
                ).apply(this, [undefined, undefined, undefined, undefined, this, this]);
                reu();
            })();
        })
    })
    }
    loadReactDOM() {
        return new Promise((reu) => {
        fetch("https://static.bcmcdn.com/coco/player/unstable/rkHiSJ5sC.text/javascript?hash=Fv643cnQVmpPoJcabhE4ZYYYzaz-").then(v => v.text()).then(code => {
            !(() => {
                new Function(
                    'exports',
                    'module',
                    'define',
                    'require',
                    'self',
                    'globalThis',
                    code
                ).apply(this, [undefined, undefined, undefined, undefined, this, this]);
                reu();
            })();
        })
    })
    }
    loadDOC() {
        return new Promise((reu) => {
            fetch("https://static.bcmcdn.com/coco/player/unstable/rkn3rJqsR.text/javascript?hash=FuDZFLyGHGnADJYMkJfM5mYXSmWY").then(v => v.text()).then(code => {
                !(() => {
                    new Function(
                        'exports',
                        'module',
                        'define',
                        'require',
                        'self',
                        'globalThis',
                        code
                    ).apply(this, [undefined, undefined, undefined, undefined, this, this]);
                    reu();
                })();
            })
        })
    }
}

var init_ = new LOADER();
return init_;
`;

class Widget extends VisibleWidget { // 控件函数代码
    // 构造器
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.init_ = null;
        this.core = null;
        this.theme = 'default'
    };
    init() {
        try {
            return new Promise((reu) => {
                if (this.init_) {
                    this.init_doc('');
                    return reu();
                };
                this.init_ = ((new Function(mnbloader))());
                this.init_.loadReact().then(() => {
                    this.init_.loadReactDOM().then(() => {
                        this.init_.loadDOC().then(() => {
                            var l = window.document.createElement("link");
                            l.type = "text/css";
                            l.rel = "stylesheet";
                            l.href = "https://static.bcmcdn.com/coco/player/unstable/HyD181ci0.text/css?hash=FrgIPfQifUGsiJzbRfqvfd-TP4sB";
                            var l2 = window.document.createElement("link");
                            l2.type = "text/css";
                            l2.rel = "stylesheet";
                            l2.href = "https://static.bcmcdn.com/coco/player/unstable/S1_eU1csA.text/css?hash=FmluqiM73hOEOsOlK8O59fKULwIo";
                            window.document.head.append(l, l2);
                            var loop = setInterval(() => {
                                if (this.init_.Doc) {
                                    if (this.init_.Doc.createOpenEditor) {
                                        this.init_doc('');
                                        reu();
                                        clearInterval(loop)
                                    }
                                }
                            }, 100);
                        })
                    })
                })
            })
        } catch (e) {
            this.widgetError("初始化出错！");
            this.widgetError(e.message);
        } finally {
            this.widgetLog("初始化完毕");
        }
    };
    isinit() {
        if (!this.core) {
            this.widgetError("请先初始化控件！");
        };
        return !!this.core;
    };
    init_doc(text) {
        if (this.core) {
            window.document.querySelector("#" + this.__widgetId).style.overflow = "auto";
            window.document.querySelector("#" + this.__widgetId).className = "ne-doc-major-viewer";
            window.document.querySelector("#" + this.__widgetId).append(this.core.domRootNode);
        } else {
            window.document.querySelector("#" + this.__widgetId).style.overflow = "auto";
            this.core = this.init_.Doc.createOpenViewer(window.document.querySelector("#" + this.__widgetId), {
                darkMode: this.theme,
            });
            this.core.setDocument('text/lake', text);
        };
    };
    reinitialize() {
        this.isinit();
        var text = this.core.getDocument("text/lake");
        this.core.destroy();
        this.core = null;
        this.init_doc(text);
    };
    setDocument(type, content) {
        if (this.isinit()) {
            try {
                var t = typeof content
                if ((t == "object" && !Array.isArray(content)) || t == "string") {
                    this.core.setDocument(type, content);
                } else {
                    this.widgetWarn("格式有误！");
                }
            } catch (e) {
                this.widgetError("设置内容出错！");
                this.widgetError(e.message);
            }
        }
    };
    render() {
        return React.createElement("div", {}, null);
    };
};

// 导出控件
exports.types = types;
exports.widget = Widget;
