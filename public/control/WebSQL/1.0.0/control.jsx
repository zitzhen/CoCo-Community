
// 一些常量
const auther = "小宏XeLa" // 作者
const version = "1.0.0" // 版本号
const qq = 3174251894 // 作者QQ
const icon = 'icon-widget-local-storage'; // 图标
// 一些变量
var window = this.window; // window

var types = { // 自定义控件设置
    type: 'XH_WEBSQLDB_WIDGET', // 控件编号
    icon, // 控件图标
    title: 'WebSQL', // 控件名称
    platforms: ['android', 'web'], // 控件可用范围
    version, // 控件版本
    auther, // 控件作者
    docs: { url: "https://btmu8uap4l.feishu.cn/wiki/Hy3EwUckPiWAIvkuMxJc55jCn3b", }, // 帮助链接
    isInvisibleWidget: true, // 是功能控件
    isGlobalWidget: true, // 是全局控件
    properties: [], // 属性
    methods: [],// 方法
    events: [], // 事件   
};

class Widget extends VisibleWidget { // 控件函数代码
    // 构造器
    constructor(props) {
        super(props);
        Object.assign(this, props);
        this.widgetLog(`制作者：小宏XeLa`);
        this.widgetLog(`编程猫个人主页：https://shequ.codemao.cn/user/9232151`);
    };
};

types['properties'].push({
    key: 'name',
    label: '数据库名',
    valueType: 'string',
    defaultValue: "new-database",
});

types['properties'].push({
    key: 'version',
    label: '数据库版本号',
    valueType: 'string',
    defaultValue: "1.0",
});

types['properties'].push({
    key: 'displayName',
    label: '数据库展示名',
    valueType: 'string',
    defaultValue: "新数据库",
});

types['properties'].push({
    key: 'dbsize',
    label: '数据库大小',
    valueType: 'number',
    defaultValue: 1048576,
    unit: '字节',
});

types['events'].push({
    key: 'onSuccess',
    label: '执行成功',
    params: [
        {
            key: 'insertId',
            label: '(仅插入)最新行数',
            valueType: ['number', 'object'],
            defaultValue: null,
        },
        {
            key: 'rows',
            label: '查询结果',
            valueType: ['string', 'number', 'boolean', 'array', 'object'],
            defaultValue: "",
        },
        {
            key: 'rowsAffected',
            label: '影响行数',
            valueType: 'number',
            defaultValue: 0,
        },
    ],
});

types['events'].push({
    key: 'onError',
    label: '执行失败',
    params: [
        {
            key: 'code',
            label: '错误码',
            valueType: 'number',
            defaultValue: 0,
        },
        {
            key: 'message',
            label: '错误消息',
            valueType: 'string',
            defaultValue: "",
        },
    ],
});

types['methods'].push({
    key: 'executeSql',
    label: '执行任务',
    params: [
        {
            key: 'sql',
            label: 'SQL语句',
            valueType: 'string',
            defaultValue: "SELECT 1",
        },
        {
            key: 'param',
            label: '嵌入参数',
            valueType: ['string', 'array'],
            defaultValue: "",
        },
    ],
    blockOptions: {
        inputsInline: false,
    },
});

Widget.prototype.executeSql = function (sql, param) {
    if (!('openDatabase' in window && window.openDatabase)) return this.emit("onError", 0, "浏览器不支持 WebSQL");
    if (!param) param = [];
    if (!(typeof param == "object" && Array.isArray(param))) return this.widgetError("嵌入参数 必须是个列表");

    var db = window.openDatabase(this.name, this.version, this.displayName, this.dbsize);

    db.transaction(tran => {
        tran.executeSql(sql, param, (tran, result) => {
            var insertId = null;
            try {
                insertId = result.insertId;
            } catch (err) {
                insertId = null;
            };

            this.emit("onSuccess", insertId, [].slice.call(result.rows), result.rowsAffected);
        });
    }, error => {
        this.emit("onError", error.code, error.message);
    });
};


types['methods'].push({
    key: 'executeSqlOnlyRead',
    label: '执行只读任务',
    params: [
        {
            key: 'sql',
            label: 'SQL语句',
            valueType: 'string',
            defaultValue: "SELECT 1",
        },
        {
            key: 'param',
            label: '嵌入参数',
            valueType: ['string', 'array'],
            defaultValue: "",
        },
    ],
    blockOptions: {
        inputsInline: false,
    },
});

Widget.prototype.executeSqlOnlyRead = function (sql, param) {
    if (!('openDatabase' in window && window.openDatabase)) return this.emit("onError", 0, "浏览器不支持 WebSQL");
    if (!param) param = [];
    if (!(typeof param == "object" && Array.isArray(param))) return this.emit("onError", 0, "参数必须是列表");

    var db = window.openDatabase(this.name, this.version, this.displayName, this.dbsize);

    db.readTransaction(tran => {
        tran.executeSql(sql, param, (tran, result) => {
            var insertId = null;
            try {
                insertId = result.insertId;
            } catch (err) {
                insertId = null;
            };

            this.emit("onSuccess", insertId, [].slice.call(result.rows), result.rowsAffected);
        });
    }, error => {
        this.emit("onError", error.code, error.message);
    });
};

// 导出控件
exports.types = types;
exports.widget = Widget;