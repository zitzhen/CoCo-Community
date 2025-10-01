/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const blockColor = '#1E90FF'
const backIcon = 'M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414l-5.657-5.657Z'


let types = {
    title: "导航栏",
    type: "QII_NAVBAR_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/SJhCAIY8Jg.image/png?hash=FqFFFGKJNoFDylmtbheepaHatE5h",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.1.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 360,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 50,
        },
        {
            key: 'bgColor',
            label: '背景颜色',
            valueType: 'color',
            defaultValue: '#FFFFFF',
        },
        {
            key: 'bgBlur',
            label: '背景模糊',
            unit: '像素',
            valueType: 'number',
            defaultValue: 0,
        },
        {
            key: 'navTitle',
            label: '标题文本',
            valueType: 'string',
            defaultValue: '标题文本',
        },
        {
            key: 'titleColor',
            label: '标题文本颜色',
            valueType: 'color',
            defaultValue: '#000000',
            blockOptions: { generateBlock: false },
        },
        {
            key: 'titleSize',
            label: '标题文本大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 16,
            blockOptions: { generateBlock: false },
        },
        {
            key: 'titleBold',
            label: '标题加粗',
            valueType: 'boolean',
            defaultValue: true,
            blockOptions: { generateBlock: false },
        },
        {
            key: 'navText',
            label: '标题底部文本',
            valueType: 'string',
            defaultValue: '',
        },
        {
            key: 'navTextColor',
            label: '标题底部文本颜色',
            valueType: 'color',
            defaultValue: '#A6A6A6',
            blockOptions: { generateBlock: false },
        },
        {
            key: 'navTextSize',
            label: '标题底部文本大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 12,
            blockOptions: { generateBlock: false },
        },
        {
            key: 'showBack',
            label: '显示返回按钮',
            valueType: 'boolean',
            defaultValue: true,
            blockOptions: { generateBlock: false },
        },
        {
            key: 'leftText',
            label: '左侧文本',
            valueType: 'string',
            defaultValue: '返回',
        },
        {
            key: 'leftTextColor',
            label: '左侧文本颜色',
            valueType: 'color',
            defaultValue: '#1E90FF',
        },
        {
            key: 'leftTextSize',
            label: '左侧文本大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 14,
        },
        {
            key: 'iconList',
            label: '右侧图标列表',
            valueType: 'string',
            editorType: 'TextArea',
            defaultValue: `
M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z,

M20 18a1 1 0 0 1 .117 1.993L20 20H4a1 1 0 0 1-.117-1.993L4 18zm0-7a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2zm0-7a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z
            `,
        },
        {
            key: 'iconColor',
            label: '右侧图标颜色',
            valueType: 'color',
            defaultValue: '#202020',
        },
        {
            key: 'iconSize',
            label: '右侧图标大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 20,
        },
        {
            key: 'borderSize',
            label: '分割线粗细',
            unit: '像素',
            valueType: 'number',
            defaultValue: 0,
            blockOptions: { generateBlock: false },
        },
        {
            key: 'borderColor',
            label: '分割线颜色',
            valueType: 'color',
            defaultValue: '#00000010',
            blockOptions: { generateBlock: false },
        },
    ],
    events: [
        { key: 'onClickBack', label: '点击返回按钮', params: [], },
        { key: 'onClickText', label: '点击左侧文本', params: [], },
        { key: 'onClickTitle', label: '点击标题',  params: [], },
        { key: 'onClickTitleText', label: '点击标题底部文本',  params: [], },
        { key: 'onClickIcon', label: '点击右侧图标', 
            params: [
                { key: 'number', label: '序号', valueType: 'number' },
            ], 
        },
    ],
    methods: [
        {
            key: "getWidgetId",
            label: '的 ID',
            valueType: 'string',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#1EBCFF' },
        },
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 获取控件的 ID
    getWidgetId() {
        return this.__widgetId
    }

    // 图标组件
    iconElement(iconCode, size, color, onClick) { return (
        <svg className="qii-icon" width={size} height={size} onClick={ onClick || null} viewBox="0 0 24 24">
            <path d={iconCode} fill={color}></path>
        </svg>
    )}

    // 渲染图标列表
    renderIconList() { 
        if (this.iconList !== '') {
            return this.iconList.split(',').map((icon, index) => (
                this.iconElement(icon, this.iconSize, this.iconColor, () => this.emit('onClickIcon', index + 1))
            ))
        }
    }

    // 渲染控件
    render() {
        return (
            <div className="Qii_Navbar_Widget" style={{ 
                padding: this.showBack ? '0 16px 0 8px' : '0 16px 0 18px',
                backgroundColor: this.bgColor,
                backdropFilter: `blur(${this.bgBlur}px)`,
                borderBottom: `${this.borderSize}px solid ${this.borderColor}`,
            }}>

                <div className="left_content">
                    { this.showBack && this.iconElement(backIcon, 28, this.leftTextColor, () => this.emit('onClickBack')) }
                    <p onClick={() => this.emit('onClickText')} style={{ color: this.leftTextColor, fontSize: this.leftTextSize, }}>{ this.leftText }</p>
                </div>

                <div className="right_content">
                    { this.renderIconList() }
                </div>

                <div className="center_content">
                    <p onClick={() => this.emit('onClickTitle')} style={{ 
                        color: this.titleColor, fontSize: this.titleSize, 
                        fontWeight: this.titleBold ? 'bold' : 'normal',
                    }}>{ this.navTitle }</p>
                    
                    { this.navText &&
                        <p onClick={() => this.emit('onClickTitleText')} style={{ 
                            color: this.navTextColor, fontSize: this.navTextSize,
                        }}>{ this.navText }</p> 
                    }
                </div>

                <style>
                    {` 
                        .Qii_Navbar_Widget {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: space-between;
                        }
                        .Qii_Navbar_Widget p {
                            margin: 0;
                        }

                        .Qii_Navbar_Widget .left_content {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                        }
                        

                        .Qii_Navbar_Widget .right_content {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                        }
                        .Qii_Navbar_Widget .right_content .qii-icon {
                            margin-left: 12px;
                        }

                        .Qii_Navbar_Widget .center_content {
                            position: absolute; left: 50%; top: 50%;
                            transform: translate(-50%, -50%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                        }
                    `}
                </style>
            </div>
        )
    }
}

exports.types = types
exports.widget = Widget