/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

const blockColor = '#1E90FF'

let types = {
    title: "五彩纸屑",
    type: "QII_CONFETTI_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/SymG4DKIye.image/svg+xml?hash=FkT5onK7sE4U_rtDMr2mumN-680U",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.0.0",
    isInvisibleWidget: true,
    isGlobalWidget: true,
    properties: [
        {
            key: 'gravity',
            label: '重力',
            valueType: 'number',
            defaultValue: 1,
        },
        {
            key: 'drift',
            label: '扩散',
            valueType: 'number',
            defaultValue: 1,
        },
        {
            key: 'spread',
            label: '扩散范围',
            valueType: 'number',
            defaultValue: 50,
        },
    ],
    events: [],
    methods: [
        {
            key: "onConfetti",
            blockOptions: {
                color: blockColor,
            },
            params: [
                {
                    key: "count",
                    label: '粒子数量',
                    valueType: 'number',
                    defaultValue: 100,
                },
                {
                    key: "angle",
                    label: '角度',
                    valueType: 'number',
                    defaultValue: 90,
                },
                {
                    key: 'velocity',
                    label: '初速度',
                    valueType: 'number',
                    defaultValue: 40,
                },
                {
                    key: "originX",
                    label: 'X轴',
                    valueType: 'number',
                    defaultValue: 0.5,
                },
                {
                    key: "originY",
                    label: 'Y轴',
                    valueType: 'number',
                    defaultValue: 0.5,
                },
            ],
        }
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
        // 缓存纸屑函数
        this.confettiFunction = null
    }

    onConfetti(count, angle, velocity, originX, originY) {
        if (this.confettiFunction) {
            this.__startConfetti(count, angle, velocity, originX, originY)
        } else {
            import('https://cdn.jsdelivr.net/npm/tsparticles-confetti/+esm').then((module) => {
                this.confettiFunction = module.confetti
                this.__startConfetti(count, angle, velocity, originX, originY)
            }).catch(() => {
                this.widgetError('加载粒子动画失败')
            })
        }
    }

    __startConfetti(count, angle, velocity, originX, originY) {
        this.confettiFunction({
            particleCount: count,
            angle: angle,
            origin: { x: originX, y: originY },
            startVelocity: velocity,
            gravity: this.gravity,
            drift: this.drift,
            spread: this.spread,
        })
    }
}


exports.types = types
exports.widget = Widget