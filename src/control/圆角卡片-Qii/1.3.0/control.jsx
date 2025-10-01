/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const methodBlockColor = ' #2C9AFF'
const createBlockColor = ' #62B7FF'
const returnBlockColor = ' #F4AE3B'

let types = {
    title: "圆角卡片",
    type: "QII_CARD_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/r1QUSPFI1g.image/png?hash=FuDa4IyqSEtDn6MlC3eu1VhCCJbk",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.3.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: true,
    properties: [
        { key: '__width', label: '宽度', valueType: 'number', defaultValue: 240 },
        { key: '__height', label: '高度', valueType: 'number', defaultValue: 150 },
        { key: 'cardColor1', label: '卡片颜色 1', valueType: 'color', defaultValue: '#1E90FF' },
        { key: 'cardColor2', label: '卡片颜色 2', valueType: 'color', defaultValue: '#58CDFF' },
        { key: 'colorAngle', label: '渐变角度', unit: '角',  valueType: 'number', defaultValue: 180 },
        { key: 'cardRadius', label: '圆角大小', unit: '像素', valueType: 'number', defaultValue: 14 },
        { key: 'cardBlur', label: '卡片模糊', unit: '强度', valueType: 'number', defaultValue: 0 },
        { key: 'bgBlur', label: '背景模糊', unit: '强度', valueType: 'number', defaultValue: 10 },
        { key: 'rotate', label: '旋转角度', unit: '度', valueType: 'number', defaultValue: 0 },
        { key: 'borderSize', label: '边框粗细', unit: '像素', valueType: 'number', defaultValue: 0 },
        { key: 'borderColor', label: '边框颜色', valueType: 'color', defaultValue: '#000000' },
        { key: 'shadowColor', label: '阴影颜色', valueType: 'color', defaultValue: '#00002020' },
        { key: 'shadowStyle', label: '阴影样式', valueType: 'string', defaultValue: '' },
    ],
    events: [
        { key: 'onClick', label: '被点击', params: [], },
    ],
    methods: [
        {
            key: "getWidgetId",
            label: '的 ID',
            valueType: 'string',
            params: [],
            blockOptions: { color: returnBlockColor, callMethodLabel: false },
        },
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 渲染函数
    render() { return (
        <div className={`Qii_${this.__widgetId}`} onClick={() => this.emit('onClick')}>
            <style>
                {`
                    .Qii_${this.__widgetId} {
                        width: 100%;
                        height: 100%;
                        border-radius: ${this.cardRadius}px;
                        filter: blur(${this.cardBlur}px);
                        backdrop-filter: blur(${this.bgBlur}px);
                        background: linear-gradient(${this.colorAngle}deg, ${this.cardColor1}, ${this.cardColor2});
                        border: ${this.borderSize}px solid ${this.borderColor};
                        box-shadow: ${this.shadowStyle} ${this.shadowColor};
                        transform: rotate(${this.rotate}deg);
                    }
                `}
            </style>
        </div>
    )}

    // 返回控件的 ID
    getWidgetId() { return this.__widgetId }
}

exports.types = types
exports.widget = Widget