/*!
 * Copyright (c) 2023-2024 xiaohong2022
 */

// 一些常量
const auther = "小宏XeLa" // 作者
const version = "1.0.0" // 版本号
const qq = 3174251894 // 作者QQ
const color = "#66ccff" // 积木颜色
const icon = 'icon-toolbox-feature'; // 图标

var types = {//自定义控件设置
    type: 'XH_COCO_MACHINE_UNITS_WIDGET', // 控件编号
    icon, // 控件图标
    title: '计算机单位工具', // 控件名称
    platforms: ['android', 'ios', 'web'], // 控件可用范围
    version, // 控件版本
    auther, // 控件作者
    docs: { url: "https://btmu8uap4l.feishu.cn/wiki/TmI2wFZMnifC5BkS8SRc58CEnPI", }, // 帮助链接
    isInvisibleWidget: true, // 是功能控件
    isGlobalWidget: true, // 是全局控件
    properties: [], // 属性
    methods: [ // 方法
        {
            key: 'allto',
            label: '将',
            valueType: ['number', "string"],
            params: [
                {
                    key: 'a',
                    label: '',
                    valueType: 'number',
                    defaultValue: 1024,
                },
                {
                    key: "b",
                    label: "",
                    valueType: 'string',
                    defaultValue: "KB",
                    dropdown: [
                        { label: 'B', value: 'B' },
                        { label: 'KB', value: 'KB' },
                        { label: 'MB', value: 'MB' },
                        { label: 'GB', value: 'GB' },
                        { label: 'TB', value: 'TB' },
                        { label: 'PB', value: 'PB' },
                        { label: 'EB', value: 'EB' },
                        { label: 'ZB', value: 'ZB' },
                        { label: 'YB', value: 'YB' },
                    ]
                },
                {
                    key: "c",
                    label: "转换为",
                    valueType: 'string',
                    defaultValue: "MB",
                    dropdown: [
                        { label: 'B', value: 'B' },
                        { label: 'KB', value: 'KB' },
                        { label: 'MB', value: 'MB' },
                        { label: 'GB', value: 'GB' },
                        { label: 'TB', value: 'TB' },
                        { label: 'PB', value: 'PB' },
                        { label: 'EB', value: 'EB' },
                        { label: 'ZB', value: 'ZB' },
                        { label: 'YB', value: 'YB' },
                        { label: '自动', value: 'auto' },
                    ]
                },
                {
                    key: "d",
                    label: "单位 返回",
                    valueType: 'string',
                    dropdown: [
                        { label: '完整内容', value: 'all' },
                        { label: '值', value: 'data' },
                        { label: '单位', value: 'unit' },
                    ]
                },
            ],
            blockOptions: {
                color,
                icon,
            }
        },
    ],
    events: [],
};

class Widget extends VisibleWidget {// 控件函数代码
    // 构造器
    constructor(props) {
        super(props);
        this.widgetLog(`制作者：小宏XeLa`);
        this.widgetLog(`编程猫个人主页：https://shequ.codemao.cn/user/9232151`);
    };
    end(a) {
        if (0 === a) return "0B";
        var b = Math.floor(Math.log(a) / Math.log(1024));
        return [
            Number((a / Math.pow(1024, b)).toFixed(2)),
            "B KB MB GB TB PB EB ZB YB".split(" ")[b]
        ];
    };
    start(a, b) {
        a = parseFloat(a);
        var c = "B KB MB GB TB PB EB ZB YB".split(" ").indexOf(b);
        if (-1 === c) throw Error("Invalid unit: " + b);
        return Math.round(a * Math.pow(1024, c));
    };
    customize(c, a) {
        if (0 === c) return "0" + a;
        var d = "B KB MB GB TB PB EB ZB YB".split(" "),
            b = d.indexOf(a.toUpperCase());
        if (-1 === b) throw Error("Invalid unit: " + a);
        return [Number((c / Math.pow(1024, b)).toFixed(2)), d[b]];
    };
    toMode(b, c, a) {
        return "all" == a
            ? "" + b.toFixed(2) + c
            : "data" == a
                ? b
                : "unit" == a
                    ? c
                    : NaN;
    }
    allto(a, b, c, d) {
        try {
            a = parseFloat(a);
            if (isNaN(a)) throw Error("Error");
            var s = "B KB MB GB TB PB EB ZB YB".split(" ");
            if (!s.includes(b)) throw Error("Error");
            if (c != "auto") if (!s.includes(c)) throw Error("Error");
            var l;
            if (c != "auto") {
                l = this.customize(this.start(a, b), c);
            } else {
                l = this.end(this.start(a, b));
            };
            if (d) return this.toMode(l[0], l[1], d);
            else throw Error("Error")
        } catch (e) {
            this.widgetError("转换出错！请检查参数是否正确！");
            return this.toMode(NaN, "");
        }
    }
};

// 导出控件
exports.types = types;
exports.widget = Widget;
