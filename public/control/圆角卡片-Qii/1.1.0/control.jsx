/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const blockColor = '#1E90FF'

let types = {
    title: "圆角卡片",
    type: "QII_CARD_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/r1QUSPFI1g.image/png?hash=FuDa4IyqSEtDn6MlC3eu1VhCCJbk",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.1.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 240,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 150,
        },
        {
            key: 'cardColor1',
            label: '卡片颜色 1',
            valueType: 'color',
            defaultValue: '#1E90FF',
            blockOptions: { generateBlock: false },
        },
        {
            key: 'cardColor2',
            label: '卡片颜色 2',
            valueType: 'color',
            defaultValue: '#58CDFF',
            blockOptions: { generateBlock: false },
        },
        { 
            key: 'colorAngle', 
            label: '渐变角度',
            unit: '角度', 
            valueType: 'number', 
            defaultValue: 225,
        },
        { 
            key: 'cardRadius', 
            label: '圆角大小',
            unit: '像素', 
            valueType: 'number', 
            defaultValue: 16,
        },
        { 
            key: 'cardBlur', 
            label: '卡片模糊',
            unit: '强度', 
            valueType: 'number', 
            defaultValue: 0,
        },
        { 
            key: 'bgBlur', 
            label: '背景模糊',
            unit: '强度', 
            valueType: 'number', 
            defaultValue: 10,
        },
        {
            key: 'rotate',
            label: '旋转角度',
            unit: '度',
            valueType: 'number',
            defaultValue: 0,
        },
        { 
            key: 'shadowColor',
            label: '阴影颜色', 
            valueType: 'color', 
            defaultValue: '#E5EAEF',
        },
        { 
            key: 'shadowStyle', 
            label: '阴影样式', 
            valueType: 'string', 
            defaultValue: '0px 5px 20px 0px',
        },
        { 
            key: 'borderSize',
            label: '边框粗细', 
            unit: '像素', 
            valueType: 'number', 
            defaultValue: 0,
        },
        { 
            key: 'borderColor',
            label: '边框颜色', 
            valueType: 'color', 
            defaultValue: '#000000',
        },
    ],
    events: [
        { key: 'onClick', label: '被点击', params: [], },
    ],
    methods: [],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 渲染函数
    render() {
        return (
            <div 
                className="Qii_Card_Widget" 
                onClick={() => this.emit('onClick')}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(' + this.colorAngle + 'deg, ' + this.cardColor1 + ', ' + this.cardColor2 + ')',
                    borderRadius: this.cardRadius + 'px',
                    filter: 'blur(' + this.cardBlur + 'px)',
                    backdropFilter: 'blur(' + this.bgBlur + 'px)',
                    boxShadow: this.shadowStyle + ' ' + this.shadowColor,
                    border: this.borderSize + 'px solid ' + this.borderColor,
                    transform: `rotate(${this.rotate}deg)`,
                }}>
            </div>
        )
    }
}

exports.types = types
exports.widget = Widget