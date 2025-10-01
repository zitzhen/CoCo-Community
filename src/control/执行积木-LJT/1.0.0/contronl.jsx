// 控件类型定义
const types = {
    type: 'EXEC_INPUT_WIDGET', // 控件类型，全局唯一，使用大写字母加下划线
    title: '垃圾桶-执行输入的积木', // 控件的显示名称
    icon: 'https://www.helloimg.com/i/2025/02/14/67af668cb11ed.jpg', // 控件图标
    isInvisibleWidget: true, // 不可见控件
    isGlobalWidget: true, // 全局控件
    properties: [
        {
            key: 'code', // 输入框的代码
            label: '执行积木：', // 属性的显示名称
            valueType: 'string', // 属性的类型
            defaultValue: '' // 属性的默认值
        }
    ],
    methods: [
        {
            key: 'executeCode', // 方法名
            valueType: 'void', // 方法无返回值
            params: [
                {
                    key: 'code',
                    label: '执行积木：',
                    valueType: 'string',
                    defaultValue: ''
                }
            ],
            tooltip: '执行输入框中的积木' // 方法的提示信息
        }
    ],
    events: [] // 无事件
};

// 控件实体定义
class ExecInputWidget extends InvisibleWidget {
    constructor(props) {
        super(props);
        this.code = props.code || '';
    }

    // 执行输入框中的积木
    executeCode(code) {
        try {
            eval(code);
        } catch (error) {
            console.error('执行积木出错:', error);
        }
    }
}

// 导出控件
exports.types = types;
exports.widget = ExecInputWidget;
