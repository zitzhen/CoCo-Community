var document = this.document
var window = this.window

let types = {
    title: "触摸板",
    type: "LJT CMK",
    icon: "https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z",
    docs: { url: 'https://docs.qq.com/doc/p/0841f75d233f9ceb949817fe3dc7ec23866d9d78' },
    version: "1.1.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: true,
    properties: [
        {
            key: 'areaColor',
            label: '区域颜色',
            valueType: 'color',
            defaultValue: '#f0f0f0'
        },
        {
            key: 'circleColor',
            label: '圆圈颜色',
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
            key: 'borderRadius',
            label: '圆角半径',
            valueType: 'number',
            defaultValue: 0,
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
            label: '旋转角度（beta）',
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
        this.currentPos = { x: 150.00, y: 150.00 }
        this.isTouching = false
        this.rotation = 0
        this.resizeObserver = null
        this.lastRect = null
    }

    isValidTouch = (clientX, clientY) => {
        const rect = this.container.getBoundingClientRect()
        const maxRadius = Math.min(rect.width, rect.height) / 2
        const br = Math.min(this.borderRadius, maxRadius)
        
        // 转换为本地坐标
        const x = clientX - rect.left
        const y = clientY - rect.top
        
        // 边界检查
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return false
        
        // 中央矩形区域检测
        const inHorizontal = x >= br && x <= rect.width - br
        const inVertical = y >= br && y <= rect.height - br
        if (inHorizontal || inVertical) return true
        
        // 圆角区域检测
        const checkCorner = (cx, cy) => {
            const dx = x - cx
            const dy = y - cy
            return dx * dx + dy * dy <= br * br
        }
        
        return (
            checkCorner(br, br) || 
            checkCorner(rect.width - br, br) ||
            checkCorner(br, rect.height - br) ||
            checkCorner(rect.width - br, rect.height - br)
        )
    }

    calculatePosition = (clientX, clientY) => {
        const rect = this.container.getBoundingClientRect()
        const radius = this.circleSize / 2
        
        const localX = clientX - rect.left
        const localY = clientY - rect.top
        
        const angle = this.rotation * Math.PI / 180
        const dx = localX - rect.width/2
        const dy = localY - rect.height/2
        
        const rotatedX = dx * Math.cos(angle) + dy * Math.sin(angle)
        const rotatedY = -dx * Math.sin(angle) + dy * Math.cos(angle)
        
        let x = rotatedX + rect.width/2
        let y = rotatedY + rect.height/2

        x = Math.max(radius, Math.min(x, rect.width - radius))
        y = Math.max(radius, Math.min(y, rect.height - radius))

        return {
            x: Math.round(x * 100) / 100, // 保留两位小数
            y: Math.round(y * 100) / 100
        }
    }

    handleResize = (entries) => {
        const entry = entries[0]
        const newWidth = entry.contentRect.width
        const newHeight = entry.contentRect.height
        
        this.currentPos = {
            x: Math.round((newWidth / 2) * 100) / 100, // 保留两位小数
            y: Math.round((newHeight / 2) * 100) / 100
        }
        
        this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
        this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
        this.lastRect = entry.contentRect
    }

    handleTouchMove = (e) => {
        if (!this.isTouching) return
        
        const touch = e.touches?.[0] || e
        if (!this.isValidTouch(touch.clientX, touch.clientY)) {
            this.isTouching = false
            return
        }

        const newPos = this.calculatePosition(touch.clientX, touch.clientY)
        
        if (newPos.x < 0 || newPos.y < 0 || 
            newPos.x > this.lastRect.width || 
            newPos.y > this.lastRect.height) {
            this.isTouching = false
            return
        }

        this.currentPos = newPos
        this.circle.style.left = `${newPos.x.toFixed(2)}px`
        this.circle.style.top = `${newPos.y.toFixed(2)}px`
        this.emit('onPositionChange', newPos.x, newPos.y)
    }

    handleTouchEnd = () => {
        this.isTouching = false
        this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
        this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
    }

    render() {
        this.rotation = this.rotationAngle % 360
        
        const dynamicStyle = `
            .touch-area {
                width: 100%;
                height: 100%;
                position: relative;
                background: ${this.areaColor};
                border-radius: ${this.borderRadius}px;
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
                left: ${this.currentPos.x.toFixed(2)}px;
                top: ${this.currentPos.y.toFixed(2)}px;
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
                    if (!this.isValidTouch(e.touches[0].clientX, e.touches[0].clientY)) return
                    this.isTouching = true
                    this.handleTouchMove(e.touches[0])
                }}
                onTouchMove={(e) => this.handleTouchMove(e.touches[0])}
                onTouchEnd={this.handleTouchEnd}
                onMouseDown={(e) => {
                    if (!this.isValidTouch(e.clientX, e.clientY)) return
                    this.isTouching = true
                    this.handleTouchMove(e)
                }}
                onMouseMove={(e) => this.handleTouchMove(e)}
                onMouseUp={this.handleTouchEnd}
                onMouseLeave={this.handleTouchEnd}
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
            x: Number(this.currentPos.x.toFixed(2)),
            y: Number(this.currentPos.y.toFixed(2))
        }
    }
}

exports.types = types
exports.widget = Widget

/*
*作者：垃圾桶
*版本：1.1.0
*/