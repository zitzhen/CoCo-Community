//一些常量
const auther = "小宏XeLa"//作者
const version = "1.2.7"//版本号
const qq = 3174251894//作者QQ
const color = "#66ccff"//积木颜色
const icon = 'icon-toolbox-feature';//图标
//一些变量
var document = this.document;//获取document的调用权限
var s = this.navigator;

var types = {//自定义控件设置
    type: 'XH_CLIPBOARD_WIDGET',//控件编号
    icon,//控件图标
    title: '剪切板',//控件名称
    platforms: ['android', 'ios', 'web'],//控件可用范围
    version,//控件版本
    auther,//控件作者
    docs: { url: "https://btmu8uap4l.feishu.cn/wiki/wikcnCLgVaiBD7aE5yKL59TTSNd", },//帮助链接
    isInvisibleWidget: true,//是功能控件
    isGlobalWidget: true,//是全局控件
    properties: [],//属性
    methods: [//方法
        {
            key: 'copy',
            label: '复制文本',
            params: [
                {
                    key: "text",
                    label: "",
                    valueType: "string",
                    defaultValue: "Hello~",
                },
            ],
            blockOptions: {
                color,
                icon,
            }
        }, {
            key: 'readcopy',
            label: '读取你复制的文本',
            params: [],
            valueType: "string",
            blockOptions: {
                color,
                icon,
            }

        }
    ],
    events: [//事件 
        {
            key: 'onsuccess',
            label: '成功',
            params: [],
        },
        {
            key: 'onerror',
            label: '发生错误',
            params: [
                {
                    key: "error",
                    label: "错误信息",
                    valueType: "string",
                },
            ],
        }
    ],
};

class Widget extends VisibleWidget {//控件函数代码
    //构造器
    constructor(props) {
        super(props);
        this.widgetLog(`制作者：小宏XeLa`);
        this.widgetLog(`编程猫个人主页：https://shequ.codemao.cn/user/9232151`)
    };
    async copy(text) {
        try {
            await s.clipboard.writeText(text);
            this.emit("onsuccess");
        } catch (e) {
            var i = document.createElement("textarea");
            i.style.fontSize = "12pt";
            i.style.border = "0";
            i.style.padding = "0";
            i.style.margin = "0";
            i.style.position = "absolute";
            i.style.left = "-9999px";
            i.value = text;
            document.body.appendChild(i);
            i.setAttribute("readonly", "");
            if (i.focus) i.focus();
            i.select();
            i.setSelectionRange(0, text.length);
            try {
                document.execCommand('copy');
                document.body.removeChild(i);
                this.emit("onsuccess");
            } catch (e) {
                document.body.removeChild(i);
                this.emit("onerror", e.toString());
                this.widgetError("复制失败！");
                this.widgetError(e);
            }
        }
    };
    readcopy = async () => {
        try {
            var t = await s.clipboard.readText();
            this.emit("onsuccess");
            return t;
        } catch (e) {
            this.emit("onerror", e.toString());
            this.widgetError("读取失败！");
            this.widgetError(e);
            return null;
        }
    };
};

//导出控件
exports.types = types;
exports.widget = Widget;