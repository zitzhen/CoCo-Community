/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const methodBlockColor = ' #2C9AFF'
const createBlockColor = ' #62B7FF'
const returnBlockColor = ' #F4AE3B'

var document = this.document
var window = this.window

let confetti = null
import('https://fastly.jsdelivr.net/npm/tsparticles-confetti/+esm').then(module => {
    confetti = module.confetti
})


let types = {
    title: "五彩纸屑",
    type: "QII_CONFETTI_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/SymG4DKIye.image/svg+xml?hash=FkT5onK7sE4U_rtDMr2mumN-680U",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.1.0",
    isInvisibleWidget: true,
    isGlobalWidget: true,
    properties: [
        { key: 'gravity', label: '重力', valueType: 'number', defaultValue: 1 },
        { key: 'drift', label: '扩散', valueType: 'number', defaultValue: 1 },
        { key: 'spread', label: '扩散范围', valueType: 'number', defaultValue: 50 },
    ],
    events: [],
    methods: [
        {
            key: "onConfetti",
            blockOptions: { color: methodBlockColor },
            params: [
                { key: "count", label: '粒子数量', valueType: 'number', defaultValue: 100 },
                { key: "angle", label: '角度', valueType: 'number', defaultValue: 90 },
                { key: 'velocity', label: '初速度', valueType: 'number', defaultValue: 40 },
                { key: "originX", label: 'X轴', valueType: 'number', defaultValue: 0.5 },
                { key: "originY", label: 'Y轴', valueType: 'number', defaultValue: 0.5 },
            ],
        }
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    async onConfetti(count, angle, velocity, originX, originY) {
        try {
            confetti({
                particleCount: count,
                angle: angle,
                origin: { x: originX, y: originY },
                startVelocity: velocity,
                gravity: this.gravity,
                drift: this.drift,
                spread: this.spread,
            })
        } catch (error) {
            this.widgetError('执行纸屑动画失败: ' + error.message)
        }
    }
}


exports.types = types
exports.widget = Widget