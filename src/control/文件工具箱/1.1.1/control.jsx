// 一些常量
const auther = "小宏XeLa"; // 作者
const version = "1.1.1"; // 版本号
const qq = 3174251894; // 作者QQ
const color = "#66ccff"; // 积木颜色
const icon = 'icon-widget-local-storage'; // 图标

// 一些变量
var window = this.window; // 获取window的调用权
var document = this.document; // 获取document的调用权限

var types = { // 自定义控件设置
    type: 'XH_COCOFILETOOL_WIDGET', // 控件编号
    icon, // 控件图标
    title: '文件工具箱', // 控件名称
    platforms: ['android', 'ios', 'web'], // 控件可用范围
    version, // 控件版本
    auther, // 控件作者
    docs: { // 帮助链接
        url: "https://btmu8uap4l.feishu.cn/wiki/wikcnDtLGOE3P4gzNSA00HdKbrQ"
    },
    isInvisibleWidget: true, // 是功能控件
    isGlobalWidget: true, // 是全局控件
    properties: [], // 属性
    methods: [ // 方法
        {
            key: "selectfile",
            label: "选择文件",
            params: [
                {
                    key: "accept",
                    label: "类型",
                    valueType: "string",
                    defaultValue: ".txt"
                },
                {
                    key: "multiple",
                    label: "可以多选",
                    valueType: "boolean",
                    defaultValue: false
                },
            ],
            blockOptions: {
                color,
                icon,
            }
        },
        {
            key: "getfilecfg",
            label: "获取文件列表的",
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    key: "id",
                    label: "第",
                    valueType: "number",
                    defaultValue: 1
                },
                {
                    label: "个文件",
                }
            ],
            valueType: "object",
            blockOptions: {
                color,
                icon,
                space: 50,
            }
        },
        {
            key: "readfilecfg",
            label: "读取文件",
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    key: "type",
                    label: "的",
                    valueType: "string",
                    dropdown: [
                        { label: '名称', value: 'name', },
                        { label: '文件名', value: 'filename', },
                        { label: '扩展名', value: 'houdname', },
                        { label: '类型', value: 'type', },
                    ]
                }
            ],
            valueType: "string",
            blockOptions: {
                color,
                icon,
            }
        },
        {
            key: "readfiledate",
            label: "读取文件",
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    key: "type",
                    label: "的修改日期，返回",
                    valueType: "string",
                    dropdown: [
                        { value: 'valueOf', label: '时间戳' },
                        { value: 'toISOString', label: 'ISO格式' },
                        { value: 'toGMTString', label: 'GMT格式' },
                        { value: 'getFullYear', label: '年份' },
                        { value: 'getMonth', label: '月份' },
                        { value: 'getDate', label: '日份' },
                        { value: 'getDay', label: '星期几（数字）' },
                        { value: 'getDayString', label: '星期几（文字）' },
                        { value: 'getHours', label: '小时' },
                        { value: 'getMinutes', label: '分钟' },
                        { value: 'getSeconds', label: '秒数' },
                        { value: 'getMilliseconds', label: '毫秒' },
                    ]
                }
            ],
            valueType: ["string", "number"],
            blockOptions: {
                color,
                icon,
            }
        },
        {
            key: "readfilesize",
            label: "读取文件",
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    key: "type",
                    label: "的大小，返回",
                    valueType: "string",
                    dropdown: [
                        { value: 'all', label: '储存单位数据' },
                        { value: 'simple', label: '储存单位数据（简写）' },
                        { value: 'data', label: '储存单位数据（值）' },
                        { value: 'unit', label: '储存单位数据（单位）' },
                        { value: 'unitsimple', label: '储存单位数据（单位+简写）' },
                        { value: 'number', label: '文件内容长度' },
                    ]
                }
            ],
            valueType: ["string", "number"],
            blockOptions: {
                color,
                icon,
            }
        },
        {
            key: "readfile",
            label: "读取文件",
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    key: "encode",
                    label: "的内容 读取编码",
                    valueType: "string",
                    dropdown: [
                        { label: 'UTF-8', value: 'UTF-8', },
                        { label: 'Unicode', value: 'Unicode', },
                        { label: 'Unicode big endian', value: 'Unicode big endian', },
                        { label: 'ANSI', value: 'ANSI', },
                    ]
                }
            ],
            valueType: "string",
            blockOptions: {
                color,
                icon,
                space: 50,
            }
        },
        {
            key: 'toBinaryString',
            label: '将文件',
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    label: "转换成二进制字串符数据",
                },
            ],
            valueType: "string",
            blockOptions: {
                color,
                icon,
            }
        },
        {
            key: 'toDataURL',
            label: '将文件',
            params: [
                {
                    key: "file",
                    label: "",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object'],
                    defaultValue: ""
                },
                {
                    label: "转换成Data数据链接",
                },
            ],
            valueType: "string",
            blockOptions: {
                color,
                icon,
                space: 50,
            }
        },
        {
            key: 'toStoreUnit',
            label: '将数字',
            params: [
                {
                    key: "number",
                    label: "",
                    valueType: 'number',
                    defaultValue: "0"
                },
                {
                    key: "type",
                    label: "转换成",
                    valueType: "string",
                    dropdown: [
                        { value: 'all', label: '储存单位数据' },
                        { value: 'simple', label: '储存单位数据（简写）' },
                        { value: 'data', label: '储存单位数据（值）' },
                        { value: 'unit', label: '储存单位数据（单位）' },
                        { value: 'unitsimple', label: '储存单位数据（单位+简写）' },
                    ]
                },
            ],
            valueType: "string",
            blockOptions: {
                color,
                icon,
                space: 50,
            }
        },
        {
            key: 'savefile',
            label: '保存文件',
            params: [
                {
                    key: "name",
                    label: "名称",
                    valueType: "string",
                    defaultValue: "coco.txt",
                },
                {
                    key: "content",
                    label: "内容",
                    valueType: 'multilineString',
                    checkType: 'string',
                    defaultValue: "CoCo，让世界没有难做的APP！",
                },
                {
                    key: "endings",
                    label: "行结束符写入方式",
                    valueType: 'string',
                    defaultValue: 'native',
                    dropdown: [
                        { label: '不显示', value: 'transparent' },
                        { label: '默认', value: 'native' },
                    ]
                },
            ],
            blockOptions: {
                color,
                icon,
                space: 50,
            }
        },
    ],
    events: [ // 事件
        {
            key: 'onselectfile',
            label: '当文件选择完成',
            params: [
                {
                    key: "files",
                    label: "文件列表",
                    valueType: ['string', 'number', 'boolean', 'color', 'array', 'object']
                },
            ],
            blockOptions: {
                icon: "https://creation.codemao.cn/coconut/web/1.15.0/static/media/cloud.af9d6145.svg",
            }
        },
    ],
};

class Widget extends VisibleWidget { // 控件函数代码
    constructor(props) { // 构造器
        super(props);
        this.widgetLog(`制作者：小宏XeLa`);
        this.widgetLog(`编程猫个人主页：https://shequ.codemao.cn/user/9232151`);
    };
    selectfile(accept, multiple) { // 选择文件
        const error = "参数有误！";
        if (typeof accept != "string") return this.widgetError(error);
        if (typeof multiple != "boolean") return this.widgetError(error);
        if (typeof multiple != "boolean") return this.widgetError(error);
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.multiple = multiple;
        input.onchange = () => {
            this.emit("onselectfile", [].slice.call(input.files))
        }
        input.click();
    };
    getfilecfg(file, id) { // 获取文件
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (!Array.isArray(file)) return this.widgetError(error);
        if (typeof id != "number") return this.widgetError(error);
        if (String(id).includes(".")) return this.widgetError(error);
        if (id <= 0 || id > file.length) return this.widgetError(error);
        if (typeof file[id + 1] != "object") return this.widgetError(error);
        return file[id + 1];
    };
    readfilecfg(file, type) { // 获取文件基础信息
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        if (type == "houdname") return (/.+\.(.+)/.exec(file.name) || [0, null])[1];
        else if (type == "filename") return (/(.+)\..+/.exec(file.name) || [0, null])[1];
        else return file[type];
    };
    readfiledate(file, type) { // 获取文件基础信息
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        try {
            return (
                type == "getDayString"
                    ? ("星期" + [..."日一二三四五六"][new Date(file.lastModified).getDay()])
                    : (new Date(file.lastModified)[type]())
            );
        } catch (e) {
            return this.widgetError(error);
        }
    };
    readfilesize(file, type) { // 获取文件基础信息
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        var x = "";
        var y = "";
        var k = 1024
        var z = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        if (file.size === 0) {
            x = "0";
            y = "B";
        };
        x = (file.size / Math.pow(k, Math.floor(Math.log(file.size) / Math.log(k)))).toFixed(2);
        y = z[Math.floor(Math.log(file.size) / Math.log(k))];
        if (type == "simple") return x + (y.length == 1 ? y : y[0]);
        else if (type == "all") return x + y;
        else if (type == "data") return Number(x);
        else if (type == "unit") return y;
        else if (type == "unitsimple") return (y.length == 1 ? y : y[0]);
        else if (type == "number") return Number(file.size);
        else return this.widgetError(error);
    };
    toStoreUnit(number, type) { // 获取文件基础信息
        const error = "参数有误！";
        if (typeof number != "number") return this.widgetError(error);
        if (String(number).includes(".")) return this.widgetError(error);
        if (Number(number) < 0) return this.widgetError(error);
        var x = "";
        var y = "";
        var k = 1024
        var z = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        if (number === 0) {
            x = "0";
            y = "B";
        };
        x = (number / Math.pow(k, Math.floor(Math.log(number) / Math.log(k)))).toFixed(2);
        y = z[Math.floor(Math.log(number) / Math.log(k))];
        if (type == "simple") return x + (y.length == 1 ? y : y[0]);
        else if (type == "all") return x + y;
        else if (type == "data") return Number(x);
        else if (type == "unit") return y;
        else if (type == "unitsimple") return (y.length == 1 ? y : y[0]);
        else return this.widgetError(error);
    };
    readfile(file, type) {
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        var fileread = new FileReader();
        return new Promise((resolve) => {
            fileread.onload = () => {
                resolve(fileread.result);
            }
            fileread.readAsText(file, type);
        })
    };
    toBinaryString(file) {
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        var fileread = new FileReader();
        return new Promise((resolve) => {
            fileread.onload = () => {
                resolve(fileread.result);
            }
            fileread.readAsBinaryString(file);
        })
    };
    toDataURL(file) {
        const error = "参数有误！";
        if (typeof file != "object") return this.widgetError(error);
        if (Array.isArray(file)) return this.widgetError(error);
        var fileread = new FileReader();
        return new Promise((resolve) => {
            fileread.onload = () => {
                resolve(fileread.result);
            }
            fileread.readAsDataURL(file);
        });
    };
    savefile(name, content, endings) { // 保存文件
        const error = "你的浏览器不支持文件下载";
        if (!Blob) {
            this.widgetLog(error)
        }
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([content], { endings });
        if (!document.createElement) {
            this.widgetLog(error)
        }
        var save_link = document.createElement("a");
        if (!urlObject.createObjectURL) {
            this.widgetLog(error)
        }
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        if (!save_link.click) {
            this.widgetLog(error)
        }
        save_link.click();
    };
};

// 导出控件
exports.types = types;
exports.widget = Widget;