var document = this.document
var window = this.window

let types = {
    title: "触摸板",
    type: "LJT CMK",
    icon: "https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z",
    docs: { url: 'https://docs.qq.com/doc/p/0841f75d233f9ceb949817fe3dc7ec23866d9d78' },
    version: "1.0.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: true,
    properties: [
        {
            key: 'areaColor',
            label: '区域颜色（可通过属性面板、积木修改）',
            valueType: 'color',
            defaultValue: '#f0f0f0'
        },
        {
            key: 'circleColor',
            label: '圆圈颜色（仅可通过属性面板修改）',
            valueType: 'color',
            defaultValue: 'transparent'
        },
        {
            key: 'circleSize',
            label: '圆圈尺寸',
            valueType: 'number',
            defaultValue: 5,
            unit: 'px'
        },
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 300,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 300,
        },
        {
            key: 'rotationAngle',
            label: '旋转角度',
            valueType: 'number',
            defaultValue: 0,
            unit: '度'
        }
    ],
    events: [
        {
            key: 'onPositionChange',
            label: '坐标变化',
            params: [
                { key: 'x', label: 'X坐标', valueType: 'number' },
                { key: 'y', label: 'Y坐标', valueType: 'number' }
            ]
        }
    ],
    methods: [
        {
            key: "getCurrentPosition",
            label: '获取当前坐标',
            valueType: 'object',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#2C9AFF' }
        }
    ]
}

class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
        this.currentPos = { x: 150, y: 150 }
        this.isTouching = false
        this.rotation = 0
        this.resizeObserver = null
        this.lastRect = null
    }

    calculatePosition = (clientX, clientY) => {
        const rect = this.container.getBoundingClientRect()
        const radius = this.circleSize / 2
        
        const angle = -this.rotation * Math.PI / 180
        const dx = clientX - (rect.left + rect.width/2)
        const dy = clientY - (rect.top + rect.height/2)
        
        let x = dx * Math.cos(angle) - dy * Math.sin(angle) + rect.width/2
        let y = dx * Math.sin(angle) + dy * Math.cos(angle) + rect.height/2

        x = Math.max(radius, Math.min(x, rect.width - radius))
        y = Math.max(radius, Math.min(y, rect.height - radius))

        return {
            x: Math.round(x),
            y: Math.round(y)
        }
    }

    handleResize = (entries) => {
        const entry = entries[0]
        if (!this.lastRect) {
            this.lastRect = entry.contentRect
            return
        }
        
        const widthRatio = entry.contentRect.width / this.lastRect.width
        const heightRatio = entry.contentRect.height / this.lastRect.height
        
        this.currentPos = {
            x: Math.round(this.currentPos.x * widthRatio),
            y: Math.round(this.currentPos.y * heightRatio)
        }
        
        this.circle.style.left = `${this.currentPos.x}px`
        this.circle.style.top = `${this.currentPos.y}px`
        this.lastRect = entry.contentRect
    }

    handleTouchMove = (e) => {
        if (!this.isTouching) return
        
        const touch = e.touches?.[0] || e
        const newPos = this.calculatePosition(touch.clientX, touch.clientY)
        
        this.currentPos = newPos
        this.circle.style.left = `${newPos.x}px`
        this.circle.style.top = `${newPos.y}px`
        this.emit('onPositionChange', newPos.x, newPos.y)
    }

    render() {
        this.rotation = this.rotationAngle % 360
        
        const dynamicStyle = `
            .touch-area {
                width: 100%;
                height: 100%;
                position: relative;
                background: ${this.areaColor};
                touch-action: none;
                transform: rotate(${this.rotation}deg);
                transform-origin: center;
            }
            .control-circle {
                position: absolute;
                width: ${this.circleSize}px;
                height: ${this.circleSize}px;
                background: ${this.circleColor};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s;
                left: ${this.currentPos.x}px;
                top: ${this.currentPos.y}px;
            }
        `

        return (
            <div 
                ref={el => {
                    this.container = el
                    if (!this.resizeObserver && el) {
                        this.resizeObserver = new ResizeObserver(this.handleResize)
                        this.resizeObserver.observe(el)
                    }
                }}
                className="touch-area"
                onTouchStart={(e) => {
                    this.isTouching = true
                    this.handleTouchMove(e.touches[0])
                }}
                onTouchMove={(e) => this.handleTouchMove(e.touches[0])}
                onTouchEnd={() => this.isTouching = false}
                onMouseDown={(e) => {
                    this.isTouching = true
                    this.handleTouchMove(e)
                }}
                onMouseMove={(e) => this.handleTouchMove(e)}
                onMouseUp={() => this.isTouching = false}
            >
                <style>{dynamicStyle}</style>
                <div 
                    className="control-circle" 
                    ref={el => this.circle = el}
                />
            </div>
        )
    }

    getCurrentPosition() {
        return {
            x: this.currentPos.x,
            y: this.currentPos.y
        }
    }
}

exports.types = types
exports.widget = Widget

/*
*作者：垃圾桶
*版本：1.0
*/