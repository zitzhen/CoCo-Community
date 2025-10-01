/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const blockColor = '#1E90FF'
var document = this.document
var window = this.window

let types = {
    title: "流彩背景",
    type: "QII_FLOW_COLOR_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/ry8900mSJx.image/svg+xml?hash=FsYOLXpxnmH2losy47-80nFgg2Hn",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.0.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    properties: [
        { key: '__width', label: '宽度', valueType: 'number', defaultValue: 360 },
        { key: '__height', label: '高度', valueType: 'number', defaultValue: 640 },
        { key: 'c1', label: '背景颜色', valueType: 'color', defaultValue: '#E8E8EC', blockOptions: { generateBlock: false } },
        { key: 'c2', label: '渐变色 1', valueType: 'color', defaultValue: '#FF00FF', blockOptions: { generateBlock: false } },
        { key: 'c3', label: '渐变色 2', valueType: 'color', defaultValue: '#FFFF00', blockOptions: { generateBlock: false } },
        { key: 'c4', label: '渐变色 3', valueType: 'color', defaultValue: '#00FFFF', blockOptions: { generateBlock: false } },
        { key: 'blur', label: '模糊效果', unit: '强度', valueType: 'number', defaultValue: 50 },
    ],
    events: [],
    methods: [
        {
            key: "setColor",
            label: '设置颜色',
            params: [
                { key: "c1", valueType: 'color', defaultValue: '#E8E8EC' },
                { key: "c2", valueType: 'color', defaultValue: '#FF00FF' },
                { key: "c3", valueType: 'color', defaultValue: '#FFFF00' },
                { key: "c4", valueType: 'color', defaultValue: '#00FFFF' },
            ],
            blockOptions: { color: blockColor },
        }
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 设置颜色
    setColor(c1, c2, c3, c4) {
        this.setProps({ c1, c2, c3, c4 })
    }

    // 渲染控件
    render() { return (
        <div className={`Qii_${this.__widgetId}`}>
            
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <radialGradient id="Gradient1" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
                        <animate attributeName="fx" dur="34s" values="0%;1%;0%" repeatCount="indefinite" />
                        <stop offset="0%" stop-color={`rgba(${hexToRgb(this.c2)}, 1)`} />
                        <stop offset="100%" stop-color={`rgba(${hexToRgb(this.c2)}, 0)`} />
                    </radialGradient>
                    <radialGradient id="Gradient2" cx="50%" cy="50%" fx="10%" fy="50%" r=".5">
                        <animate attributeName="fx" dur="23.5s" values="0%;1%;0%" repeatCount="indefinite" />
                        <stop offset="0%" stop-color={`rgba(${hexToRgb(this.c3)}, 1)`} />
                        <stop offset="100%" stop-color={`rgba(${hexToRgb(this.c3)}, 0)`} />
                    </radialGradient>
                    <radialGradient id="Gradient3" cx="50%" cy="50%" fx="50%" fy="50%" r=".5">
                        <animate attributeName="fx" dur="21.5s" values="0%;1%;0%" repeatCount="indefinite" />
                        <stop offset="0%" stop-color={`rgba(${hexToRgb(this.c4)}, 1)`} />
                        <stop offset="100%" stop-color={`rgba(${hexToRgb(this.c4)}, 0)`} />
                    </radialGradient>
                </defs>

                <rect x="0" y="0" width="200%" height="200%" fill="url(#Gradient1)">
                    <animate attributeName="x" dur="20s" values="0%;50%;0%" repeatCount="indefinite" />
                    <animate attributeName="y" dur="21s" values="0%;50%;0%" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="17s" repeatCount="indefinite"/>
                </rect>
                <rect x="0" y="0" width="100%" height="200%" fill="url(#Gradient2)">
                    <animate attributeName="x" dur="23s" values="50%;-25%;50%" repeatCount="indefinite" />
                    <animate attributeName="y" dur="24s" values="50%;-25%;50%" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="18s" repeatCount="indefinite"/>
                </rect>
                <rect x="0" y="0" width="100%" height="200%" fill="url(#Gradient3)">
                    <animate attributeName="x" dur="25s" values="0%;75%;0%" repeatCount="indefinite" />
                    <animate attributeName="y" dur="26s" values="0%;25%;0%" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="19s" repeatCount="indefinite"/>
                </rect>
            </svg>

            <style>
                {`
                    .Qii_${this.__widgetId} {
                        width: 100%;
                        height: 100%;
                        background-color: ${this.c1};
                        transition: all 1s ease;
                        overflow: hidden;
                    }
                    .Qii_${this.__widgetId} svg {
                        width: 100%;
                        height: 100%;
                        transform: scale(1.5);
                        filter: blur(${this.blur}px);
                    }
                `}
            </style>
        </div>
    )}
}

// 把十六进制颜色转换为 RGB 颜色
function hexToRgb(hex) {
    const color = hex.replace('#', '')
    let r = parseInt(color.substr(0, 2), 16)
    let g = parseInt(color.substr(2, 2), 16)
    let b = parseInt(color.substr(4, 2), 16)
    return `${r}, ${g}, ${b}`
}

exports.types = types
exports.widget = Widget