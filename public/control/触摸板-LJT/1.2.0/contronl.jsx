var document = this.document
var window = this.window

let types = {
    title: "触摸板",
    type: "LJT CMK",
    icon: "https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z",
    docs: { url: 'https://docs.qq.com/doc/p/0841f75d233f9ceb949817fe3dc7ec23866d9d78' },
    version: "1.2.0",
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
            label: '旋转角度',
            valueType: 'number',
            defaultValue: 0,
            unit: '度'
        },
        // 新增功能
        {
            key: 'showPosition',
            label: '显示坐标值',
            valueType: 'boolean',
            defaultValue: false
        },
        {
            key: 'positionColor',
            label: '坐标文字颜色',
            valueType: 'color',
            defaultValue: '#333333'
        },
        {
            key: 'positionSize',
            label: '坐标文字大小',
            valueType: 'number',
            defaultValue: 14,
            unit: 'px'
        },
        {
            key: 'borderWidth',
            label: '边框宽度',
            valueType: 'number',
            defaultValue: 1,
            unit: 'px'
        },
        {
            key: 'borderColor',
            label: '边框颜色',
            valueType: 'color',
            defaultValue: '#cccccc'
        },
        {
            key: 'smoothMove',
            label: '平滑移动（新版本开关）',
            valueType: 'boolean',
            defaultValue: true,
            tooltip: '开启后使用新版的移动和坐标逻辑，关闭后使用旧版的移动和坐标逻辑'
        },
        {
            key: 'sensitivity',
            label: '灵敏度',
            valueType: 'number',
            tooltip: '需开启“平滑移动”后使用',
            defaultValue: 1.0,
            min: 0.1,
            max: 2.0,
            step: 0.1
        },
        {
            key: 'resetOnRelease',
            label: '释放后归位',
            valueType: 'boolean',
            defaultValue: false
        },
        {
            key: 'maxPosition',
            label: '最大坐标值',
            tooltip: '需开启“平滑移动”后使用',
            valueType: 'number',
            defaultValue: 100,
            min: 10,
            max: 1000
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
        },
        // 新增事件
        {
            key: 'onTouchStart',
            label: '触摸开始',
            params: []
        },
        {
            key: 'onTouchEnd',
            label: '触摸结束',
            params: []
        },
        {
            key: 'onCenterReached',
            label: '到达中心点',
            params: []
        }
    ],
    methods: [
        {
            key: "getCurrentPosition",
            label: '获取当前坐标',
            valueType: 'object',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#2C9AFF' }
        },
        // 新增的功能
        {
            key: "resetToCenter",
            label: '重置到中心',
            params: [],
            blockOptions: { callMethodLabel: true, color: '#F4AE3B' }
        },
        {
            key: "setCircleColor",
            label: '设置圆圈颜色',
            params: [
                { key: "color", label: '颜色值', valueType: 'color' }
            ],
            blockOptions: { space: 40, color: '#FF6B6B' }
        },
        {
            key: "setAreaColor",
            label: '设置区域颜色',
            params: [
                { key: "color", label: '颜色值', valueType: 'color' }
            ],
            blockOptions: { space: 40, color: '#4ECDC4' }
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
        this.centerPosition = { x: 150, y: 150 } // 记录中心点位置
        this.centerReached = false // 记录是否到达过中心点
    }

    isValidTouch = (clientX, clientY) => {
        const rect = this.container.getBoundingClientRect()
        const maxRadius = Math.min(rect.width, rect.height) / 2
        const br = Math.min(this.borderRadius, maxRadius)
        
        const x = clientX - rect.left
        const y = clientY - rect.top
        
        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return false
        
        const inHorizontal = x >= br && x <= rect.width - br
        const inVertical = y >= br && y <= rect.height - br
        if (inHorizontal || inVertical) return true
        
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

    // 带灵敏度调整的移动逻辑 (新版本的逻辑)
    calculatePositionWithSensitivity = (clientX, clientY) => {
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

        // 应用灵敏度
        if (this.sensitivity !== 1.0) {
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            x = centerX + (x - centerX) * this.sensitivity
            y = centerY + (y - centerY) * this.sensitivity
        }

        x = Math.max(radius, Math.min(x, rect.width - radius))
        y = Math.max(radius, Math.min(y, rect.height - radius))

        return {
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100
        }
    }

    // 原始移动逻辑 (旧版本的逻辑)
    calculatePositionWithoutSensitivity = (clientX, clientY) => {
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
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100
        }
    }

    handleResize = (entries) => {
        const entry = entries[0]
        const newWidth = entry.contentRect.width
        const newHeight = entry.contentRect.height
        
        // 更新中心点位置
        this.centerPosition = {
            x: Math.round((newWidth / 2) * 100) / 100,
            y: Math.round((newHeight / 2) * 100) / 100
        }
        
        // 如果没有触摸中，使用中心点位置
        if (!this.isTouching || this.resetOnRelease) {
            this.currentPos = {
                x: this.centerPosition.x,
                y: this.centerPosition.y
            }
        }
        
        this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
        this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
        this.lastRect = entry.contentRect
        
        // 更新位置文本
        if (this.showPosition) {
            this.updatePositionText();
        }
    }

    handleTouchMove = (e) => {
        if (!this.isTouching) return
        
        const touch = e.touches?.[0] || e
        if (!this.isValidTouch(touch.clientX, touch.clientY)) {
            this.isTouching = false
            return
        }

        // 根据smoothMove状态选择不同的移动逻辑
        let newPos;
        if (this.smoothMove) {
            // 使用新版的移动逻辑（带灵敏度调整）
            newPos = this.calculatePositionWithSensitivity(touch.clientX, touch.clientY)
        } else {
            // 使用旧版的的移动逻辑（不带灵敏度调整）
            newPos = this.calculatePositionWithoutSensitivity(touch.clientX, touch.clientY)
        }
        
        if (newPos.x < 0 || newPos.y < 0 || 
            newPos.x > this.lastRect.width || 
            newPos.y > this.lastRect.height) {
            this.isTouching = false
            return
        }

        this.currentPos = newPos
        
        // 检测是否到达中心点
        const distanceToCenter = Math.sqrt(
            Math.pow(newPos.x - this.centerPosition.x, 2) + 
            Math.pow(newPos.y - this.centerPosition.y, 2)
        )
        
        if (distanceToCenter < 5 && !this.centerReached) {
            this.centerReached = true
            this.emit('onCenterReached')
        } else if (distanceToCenter >= 5) {
            this.centerReached = false
        }
        
        // 应用平滑移动
        if (this.smoothMove) {
            this.circle.style.transition = 'left 0.1s, top 0.1s';
        } else {
            this.circle.style.transition = 'none';
        }
        
        this.circle.style.left = `${newPos.x.toFixed(2)}px`
        this.circle.style.top = `${newPos.y.toFixed(2)}px`
        
        // 根据smoothMove状态决定输出坐标类型
        if (this.smoothMove) {
            // 使用最大坐标值进行标准化
            const normalizedX = (newPos.x / this.lastRect.width) * this.maxPosition
            const normalizedY = (newPos.y / this.lastRect.height) * this.maxPosition
            this.emit('onPositionChange', normalizedX, normalizedY)
        } else {
            // 输出实际像素坐标
            this.emit('onPositionChange', newPos.x, newPos.y)
        }
        
        // 更新位置文本
        if (this.showPosition) {
            this.updatePositionText();
        }
    }

    handleTouchEnd = () => {
        this.isTouching = false
        this.emit('onTouchEnd')
        
        if (this.resetOnRelease) {
            this.resetToCenter();
        } else {
            this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
            this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
        }
    }

    updatePositionText = () => {
        if (!this.positionText) return;
        
        if (this.smoothMove) {
            // 显示标准化坐标
            const normalizedX = (this.currentPos.x / this.lastRect.width) * this.maxPosition
            const normalizedY = (this.currentPos.y / this.lastRect.height) * this.maxPosition
            this.positionText.innerText = `X: ${normalizedX.toFixed(1)}, Y: ${normalizedY.toFixed(1)}`;
        } else {
            // 显示实际像素坐标
            this.positionText.innerText = `X: ${this.currentPos.x.toFixed(1)}, Y: ${this.currentPos.y.toFixed(1)}`;
        }
    }

    resetToCenter = () => {
        this.currentPos = {
            x: this.centerPosition.x,
            y: this.centerPosition.y
        }
        
        this.circle.style.left = `${this.centerPosition.x.toFixed(2)}px`
        this.circle.style.top = `${this.centerPosition.y.toFixed(2)}px`
        
        // 更新位置文本
        if (this.showPosition) {
            this.updatePositionText();
        }
        
        // 根据smoothMove状态决定输出坐标类型
        if (this.smoothMove) {
            // 触发标准化坐标变化事件
            this.emit('onPositionChange', 
                (this.centerPosition.x / this.lastRect.width) * this.maxPosition, 
                (this.centerPosition.y / this.lastRect.height) * this.maxPosition
            );
        } else {
            // 触发实际像素坐标变化事件
            this.emit('onPositionChange', 
                this.centerPosition.x, 
                this.centerPosition.y
            );
        }
    }

    setCircleColor = (color) => {
        this.setProps({
            circleColor: color
        })
        this.circle.style.background = color;
    }

    setAreaColor = (color) => {
        this.setProps({
            areaColor: color
        })
        this.container.style.background = color;
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
                border: ${this.borderWidth}px solid ${this.borderColor};
                touch-action: none;
                transform: rotate(${this.rotation}deg);
                transform-origin: center;
                overflow: hidden;
            }
            .control-circle {
                position: absolute;
                width: ${this.circleSize}px;
                height: ${this.circleSize}px;
                background: ${this.circleColor};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: ${this.smoothMove ? 'left 0.1s, top 0.1s' : 'none'};
                left: ${this.currentPos.x.toFixed(2)}px;
                top: ${this.currentPos.y.toFixed(2)}px;
                z-index: 10;
            }
            .position-text {
                position: absolute;
                bottom: 10px;
                left: 0;
                right: 0;
                text-align: center;
                color: ${this.positionColor};
                font-size: ${this.positionSize}px;
                font-family: Arial, sans-serif;
                z-index: 5;
                pointer-events: none;
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
                    this.emit('onTouchStart')
                    this.handleTouchMove(e.touches[0])
                }}
                onTouchMove={(e) => this.handleTouchMove(e.touches[0])}
                onTouchEnd={this.handleTouchEnd}
                onMouseDown={(e) => {
                    if (!this.isValidTouch(e.clientX, e.clientY)) return
                    this.isTouching = true
                    this.emit('onTouchStart')
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
                {this.showPosition && (
                    <div 
                        className="position-text" 
                        ref={el => this.positionText = el}
                    >
                        X: 0.0, Y: 0.0
                    </div>
                )}
            </div>
        )
    }

    getCurrentPosition() {
        if (this.smoothMove) {
            // 返回标准化坐标 (0-100)
            return {
                x: (this.currentPos.x / this.lastRect.width) * this.maxPosition,
                y: (this.currentPos.y / this.lastRect.height) * this.maxPosition
            }
        } else {
            // 返回实际像素坐标
            return {
                x: this.currentPos.x,
                y: this.currentPos.y
            }
        }
    }
}

exports.types = types
exports.widget = Widget

/*
*作者：垃圾桶
*版本：1.2.0
*/