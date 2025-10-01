//一些常量
const auther = "小宏XeLa"//作者
const version = "1.0.1"//版本号
const qq = 3174251894//作者QQ
const icon = 'icon-widget-audio';//图标
const color = "#66ccff"//积木颜色
const createKey = (a, b) => {
    var key = '';//乱码生成器
    for (var i = 0; i < a; i++) {
        var nKey = '';
        for (var j = 0; j < b; j++) {
            var k = Math.floor(Math.random() * 3);
            if (k == 0) {
                var u = 'qwertyuiopasdfghjklzxcvbnm'[Math.floor(Math.random() * 26)];
            } else if (k == 1) {
                var u = 'QWERTYUIOPASDFGHJKLZXCVBNM'[Math.floor(Math.random() * 26)];
            } else if (k == 2) {
                var u = '1234567890'[Math.floor(Math.random() * 10)];
            }
            nKey += u;
        }
        key += nKey
    } return key
}

//一些变量
var document = this.document;
var window = this.window;
var navigator = this.navigator;
var history = this.history;

var types = {//自定义控件设置
    type: 'XH_MUSIC_TOOL_WIDGET',//控件编号
    icon: icon,//控件图标
    title: '小宏播放器',//控件名称
    platforms: ['android', 'ios', 'web'],//控件可用范围
    version,//控件版本
    auther,//控件作者
    isInvisibleWidget: false,//不是功能控件
    isGlobalWidget: false,//不是全局控件
    docs: { // 帮助链接
        url: "https://btmu8uap4l.feishu.cn/wiki/wikcnTrZh1MwDk93f0Hnn5nzdab"
    },
    properties: [//属性
        {
            key: '__width',
            label: '长度', //属性名
            valueType: 'number',//属性类型
            defaultValue: 305,//默认值
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: '__height',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '高度', //属性名
            valueType: 'number',//属性类型
            defaultValue: 155,//默认值
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
            key: 'url',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '链接', //属性名
            valueType: 'string',//属性类型
            defaultValue: `https://static.box3.codemao.cn/block/QmdoY61Hh343qxgwqMrNREaS46SRoSh59i6PXkHCyxZLTA.mp3`,//默认值
        },
        {
            key: 'candowncop',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '允许下载', //属性名
            valueType: 'boolean',//属性类型
            defaultValue: false,//默认值
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: 'canquanping',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '允许全屏（仅在视频模式下生效）', //属性名
            valueType: 'boolean',//属性类型
            defaultValue: false,//默认值
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: 'isloop',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '洗脑循环', //属性名
            valueType: 'boolean',//属性类型
            defaultValue: true,//默认值
            blockOptions: {
                generateBlock: false,
            },
        },
        {
            key: 'controls',//属性变量名（该变量名设置后可以到控件函数代码里调用）
            label: '显示播放器默认控件', //属性名
            valueType: 'boolean',//属性类型
            defaultValue: true,//默认值
            blockOptions: {
                generateBlock: false,
            },
        },
    ],
    methods: [//方法
        {
            key: 'init',
            label: '初始化播放器（调用该控件方法前请先调用这个）',
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'setvolume',
            label: '设置音量',
            params: [
                {
                    key: "n",
                    label: "",
                    valueType: "number",
                    defaultValue: 100,
                },
            ],
            blockOptions: {
                color,
            }
        }, {
            key: 'novolume',
            label: '静音',
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'dangqianyingliang',
            label: '当前音量',
            params: [],
            valueType: "number",
            blockOptions: {
                color,
            }
        }, {
            key: 'setmultiple',
            label: '设置倍速',
            params: [
                {
                    key: "x",
                    label: "",
                    valueType: "number",
                    defaultValue: 1,
                    dropdown: [
                        { label: '0.25x', value: 0.25, },
                        { label: '0.5x', value: 0.5, },
                        { label: '0.75x', value: 0.75, },
                        { label: '1x（正常）', value: 1, },
                        { label: '1.25x', value: 1.25, },
                        { label: '1.5x', value: 1.5, },
                        { label: '1.75x', value: 1.75, },
                        { label: '2x', value: 2, },
                    ]
                },
            ],
            blockOptions: {
                color,
            }
        }, {
            key: 'dangqianbeisu',
            label: '当前倍速',
            params: [
                {
                    key: "t",
                    label: "",
                    valueType: "string",
                    defaultValue: "n",
                    dropdown: [
                        { label: '数字', value: "n", },
                        { label: '文本', value: "s", },
                    ]
                },
            ],
            valueType: ["number", "string"],
            blockOptions: {
                color,
            }
        }, {
            key: 'start',
            label: '开始播放',
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'stop',
            label: '暂停播放',
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'tiaozhaun',
            label: '跳转到进度',
            params: [
                {
                    key: "n",
                    label: "秒数",
                    valueType: "number",
                    defaultValue: 0,
                },
            ],
            blockOptions: {
                color,
            }
        }, {
            key: 'jingdunow',
            label: '当前播放进度',
            valueType: "number",
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'lengthsnow',
            label: '视频长度',
            valueType: "number",
            params: [],
            blockOptions: {
                color,
            }
        }, {
            key: 'loop',
            label: '设置洗脑循环为',
            params: [
                {
                    key: "n",
                    label: "",
                    valueType: "boolean",
                    defaultValue: true,
                    dropdown: [
                        { label: '开启', value: true, },
                        { label: '关闭', value: false, },
                    ]
                },
            ],
            blockOptions: {
                color,
            }
        }, {
            key: 'setsettings',
            label: '设置',
            params: [
                {
                    key: "m",
                    label: "",
                    valueType: "string",
                    defaultValue: true,
                    dropdown: [
                        { label: '允许下载', value: "d", },
                        { label: '允许全屏', value: "q", },
                    ]
                },
                {
                    key: "b",
                    label: "为",
                    valueType: "boolean",
                    defaultValue: true,
                    dropdown: [
                        { label: '开启', value: true, },
                        { label: '关闭', value: false, },
                    ]
                },
            ],
            blockOptions: {
                color,
            }
        },
    ],
    events: [//事件
        {
            key: 'onloadstart',
            label: '开始加载',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onloadedmetadata',
            label: '加载完成',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onerror',
            label: '加载出错',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onstalled',
            label: '数据不可用',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onprogress',
            label: '用户将该音频下载到该设备',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onwaiting',
            label: '开始缓冲',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onplaying',
            label: '缓冲结束',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onplay',
            label: '开始播放',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onpause',
            label: '暂停播放',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onseeked',
            label: '跳转到了新的进度',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onended',
            label: '播放完成',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onvolumechange',
            label: '音量被更改',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
        {
            key: 'onratechange',
            label: '倍速被更改',
            params: [],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
    ],
};

class Widget extends VisibleWidget {//控件外观/函数代码
    //构造器
    constructor(props) {
        super(props);
        this.url = props.url
        this.vkeyn = `CoCoAppWidget_XH_MUSIC_TOOL_WIDGET_VideoId_L100_S6_W600_K${createKey(100, 6)}_D${(new Date().valueOf())}_R${Math.random() * 1e16}_V${version}`
        this.videoHtmlE = null
        this.canqunaping = props.canquanping
        this.candowncop = props.candowncop
        this.isloop = props.isloop
        this.controls = props.controls
        this.inityes = false
        this.widgetLog(`制作者：小宏XeLa`);
    };
    //渲染函数
    render() {
        return (React.createElement("div", { dangerouslySetInnerHTML: { __html: `<video style="width:100%;height:100%" ${this.controls ? "controls" : ""} id="${this.vkeyn}" controlslist="${this.canqunaping ? "" : "nofullscreen"} ${this.candowncop ? "" : "nodownload"}" ${this.isloop ? "loop" : ""} oncontextmenu="return false;"><source src="${this.url}"></video>` } }, null));
    };
    init() { this.videoHtmlE = document.getElementById(this.vkeyn); this.inityes = true; this.initall() }
    setvolume(n) {
        this.isinited()
        this.videoHtmlE.volume = n / 100
    }
    novolume() {
        this.isinited()
        this.videoHtmlE.volume = 0
    }
    setmultiple(x) {
        this.isinited()
        this.videoHtmlE.playbackRate = x
    }
    start() {
        this.isinited()
        this.videoHtmlE.play()
    }
    stop() {
        this.isinited()
        this.videoHtmlE.pause()
    }
    tiaozhaun(n) {
        this.isinited()
        this.videoHtmlE.currentTime = n
    }
    jingdunow() {
        this.isinited()
        return this.videoHtmlE.currentTime
    }
    lengthsnow() {
        this.isinited()
        return this.videoHtmlE.duration
    }
    dangqianyingliang() {
        this.isinited()
        return this.videoHtmlE.volume * 100
    }
    dangqianbeisu(t) {
        this.isinited()
        return (t == "n" ? this.videoHtmlE.playbackRate : (this.videoHtmlE.playbackRate + ("x")))
    }
    loop(n) {
        this.isinited()
        this.videoHtmlE.loop = n
    }
    setsettings(m, b) {
        this.isinited()
        if (m == "d") { this.candowncop = b }; if (m == "q") { this.canqunaping = b }
        this.videoHtmlE.setAttribute("controlslist", `${this.canqunaping ? "" : "nofullscreen"} ${this.candowncop ? "" : "nodownload"}`)
    }
    isinited() {
        if (!this.inityes) { this.widgetError("请先初始化！") }
    }
    initall() {
        document.getElementById(this.vkeyn).onloadstart = (e) => { this.emit("onloadstart") }
        document.getElementById(this.vkeyn).onloadedmetadata = (e) => { this.emit("onloadedmetadata") }
        document.getElementById(this.vkeyn).onerror = (e) => { this.emit("onerror") }
        document.getElementById(this.vkeyn).onstalled = (e) => { this.emit("onstalled") }
        document.getElementById(this.vkeyn).onprogress = (e) => { this.emit("onprogress") }
        document.getElementById(this.vkeyn).onwaiting = (e) => { this.emit("onwaiting") }
        document.getElementById(this.vkeyn).onplaying = (e) => { this.emit("onplaying") }
        document.getElementById(this.vkeyn).onplay = (e) => { this.emit("onplay") }
        document.getElementById(this.vkeyn).onpause = (e) => { this.emit("onpause") }
        document.getElementById(this.vkeyn).onseeked = (e) => { this.emit("onseeked") }
        document.getElementById(this.vkeyn).onended = (e) => { this.emit("onended") }
        document.getElementById(this.vkeyn).onvolumechange = (e) => { this.emit("onvolumechange") }
        document.getElementById(this.vkeyn).onratechange = (e) => { this.emit("onratechange") }
    }
};

//导出控件
exports.types = types;
exports.widget = Widget;