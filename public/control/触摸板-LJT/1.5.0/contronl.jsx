var document = this.document
var window = this.window

let types = {
    title: "触摸板",
    type: "LJT CMK",
    icon: "https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z",
    docs: { url: 'https://docs.qq.com/doc/p/0841f75d233f9ceb949817fe3dc7ec23866d9d78' },
    version: "1.5.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    hasAnyWidget: true,
    properties: [
        // 区域样式设置
        {
            key: 'areaStyle',
            label: '区域样式',
            valueType: 'dropdown',
            defaultValue: 'color',
            dropdown: [
                { label: '纯色', value: 'color' },
                { label: '图片', value: 'image' }
            ]
        },
        {
            key: 'areaImage',
            label: '区域图片',
            valueType: 'string',
            defaultValue: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z',
            tooltip: '当区域样式为图片时生效',
            visibleIf: { areaStyle: 'image' }
        },
        {
            key: 'areaColor',
            label: '区域颜色',
            valueType: 'color',
            defaultValue: '#f0f0f0',
            visibleIf: { areaStyle: 'color' }
        },
        {
            key: 'borderRadius',
            label: '圆角半径',
            valueType: 'number',
            defaultValue: 0,
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
        
        // 圆圈样式设置
        {
            key: 'circleStyle',
            label: '圆圈样式',
            valueType: 'dropdown',
            defaultValue: 'color',
            dropdown: [
                { label: '纯色', value: 'color' },
                { label: '图片', value: 'image' }
            ]
        },
        {
            key: 'circleImage',
            label: '圆圈图片',
            valueType: 'string',
            defaultValue: 'https://static.codemao.cn/pickduck/Ske7sfwh1e.jpg?hash=FnCUftqh6CYvWkr4OifRR_uE2e9Z',
            tooltip: '当圆圈样式为图片时生效',
            visibleIf: { circleStyle: 'image' }
        },
        {
            key: 'circleColor',
            label: '圆圈颜色',
            valueType: 'color',
            defaultValue: 'transparent',
            visibleIf: { circleStyle: 'color' }
        },
        {
            key: 'circleSize',
            label: '圆圈尺寸',
            valueType: 'number',
            defaultValue: 5,
            unit: 'px'
        },
        
        // 基本设置
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
        
        // 坐标显示
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
        
        // 移动设置
        {
            key: 'smoothMove',
            label: '平滑移动',
            valueType: 'boolean',
            defaultValue: true,
            tooltip: '开启后使用平滑移动效果'
        },
        {
            key: 'sensitivity',
            label: '灵敏度',
            valueType: 'number',
            tooltip: '需开启"平滑移动"后使用',
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
            tooltip: '需开启"平滑移动"后使用',
            valueType: 'number',
            defaultValue: 100,
            min: 10,
            max: 1000
        },
        {
            key: 'useMaxPosition',
            label: '使用最大坐标值',
            valueType: 'boolean',
            defaultValue: true,
            tooltip: '需开启"平滑移动"后使用'
        },
        {
            key: 'useSensitivity',
            label: '使用灵敏度调整',
            valueType: 'boolean',
            defaultValue: true,
            tooltip: '需开启"平滑移动"后使用'
        },
        
        // 轨迹设置
        {
            key: 'showTrail',
            label: '显示移动轨迹',
            valueType: 'boolean',
            defaultValue: false
        },
        {
            key: 'trailWidth',
            label: '轨迹宽度',
            valueType: 'number',
            defaultValue: 2,
            unit: 'px',
            min: 1,
            max: 10,
            visibleIf: { showTrail: true }
        },
        {
            key: 'trailFadeTime',
            label: '轨迹淡出时间',
            valueType: 'number',
            defaultValue: 3000,
            unit: 'ms',
            min: 500,
            max: 10000,
            visibleIf: { showTrail: true }
        },
        {
            key: 'trailMaxPoints',
            label: '最大轨迹点数',
            valueType: 'number',
            defaultValue: 100,
            min: 10,
            max: 500,
            visibleIf: { showTrail: true }
        },
        {
            key: 'trailStyle',
            label: '轨迹样式',
            valueType: 'dropdown',
            defaultValue: 'solid',
            dropdown: [
                { label: '实线', value: 'solid' },
                { label: '虚线', value: 'dashed' },
                { label: '点线', value: 'dotted' }
            ],
            visibleIf: { showTrail: true }
        },
        
        // 双击设置
        {
            key: 'doubleTapReset',
            label: '双击归位',
            valueType: 'boolean',
            defaultValue: false
        },
        {
            key: 'doubleTapThreshold',
            label: '双击时间间隔',
            valueType: 'number',
            defaultValue: 300,
            unit: 'ms',
            min: 100,
            max: 1000,
            visibleIf: { doubleTapReset: true }
        },
        
        // 方向锁定模式
        {
            key: 'directionLock',
            label: '方向锁定',
            valueType: 'dropdown',
            defaultValue: 'none',
            dropdown: [
                { label: '无', value: 'none' },
                { label: '水平', value: 'horizontal' },
                { label: '垂直', value: 'vertical' }
            ]
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
        },
        {
            key: 'onDoubleTap',
            label: '双击触摸板',
            params: []
        },
        {
            key: 'onDirectionChange',
            label: '方向变化',
            params: [
                { key: 'angle', label: '角度(0-360)', valueType: 'number' }
            ]
        },
        {
            key: 'onDirectionLocked',
            label: '方向锁定',
            params: [
                { key: 'direction', label: '方向', valueType: 'string' }
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
        },
        {
            key: "resetToCenter",
            label: '圆圈重置到中心',
            params: [],
            blockOptions: { callMethodLabel: true, color: '#F4AE3B' }
        },
        {
            key: "clearTrail",
            label: '清除移动轨迹',
            params: [],
            blockOptions: { callMethodLabel: true, color: '#9B59B6' }
        },
        {
            key: "setCircleImage",
            label: '设置圆圈图片',
            params: [
                { key: 'url', label: '图片地址', valueType: 'string' }
            ]
        },
        {
            key: "setAreaImage",
            label: '设置区域图片',
            params: [
                { key: 'url', label: '图片地址', valueType: 'string' }
            ]
        },
        {
            key: "getCurrentDirection",
            label: '获取当前方向角度',
            valueType: 'number',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#3498DB' }
        },
        {
            key: "setDirectionLock",
            label: '设置方向锁定',
            params: [
                { key: 'mode', label: '模式', valueType: 'string', 
                  dropdown: [
                    { label: '无', value: 'none' },
                    { label: '水平', value: 'horizontal' },
                    { label: '垂直', value: 'vertical' }
                  ]
                }
            ],
            blockOptions: { callMethodLabel: true, color: '#1ABC9C' }
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
        this.centerPosition = { x: 150, y: 150 }
        this.centerReached = false
        
        // 轨迹相关状态
        this.trailPoints = []
        this.lastTapTime = 0
        this.currentAngle = 0
        this.trailCanvas = null
        this.trailCtx = null
        
        // 方向锁定状态
        this.lockedDirection = null;
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

        if (this.useSensitivity && this.sensitivity !== 1.0) {
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

    // 方向锁定计算
    applyDirectionLock = (pos) => {
        const dx = pos.x - this.centerPosition.x;
        const dy = pos.y - this.centerPosition.y;
        
        if (this.directionLock === 'horizontal') {
            // 水平锁定 - 只保留X轴移动
            return { 
                x: pos.x, 
                y: this.centerPosition.y 
            };
        } else if (this.directionLock === 'vertical') {
            // 垂直锁定 - 只保留Y轴移动
            return { 
                x: this.centerPosition.x, 
                y: pos.y 
            };
        }
        
        return pos;
    }

    handleResize = (entries) => {
        const entry = entries[0]
        const newWidth = entry.contentRect.width
        const newHeight = entry.contentRect.height
        
        this.centerPosition = {
            x: Math.round((newWidth / 2) * 100) / 100,
            y: Math.round((newHeight / 2) * 100) / 100
        }
        
        if (!this.isTouching || this.resetOnRelease) {
            this.currentPos = {
                x: this.centerPosition.x,
                y: this.centerPosition.y
            }
        }
        
        if (this.circle) {
            this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
            this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
        }
        
        this.lastRect = entry.contentRect
        
        if (this.showPosition && this.positionText) {
            this.updatePositionText();
        }
        
        // 更新轨迹画布大小
        if (this.trailCanvas) {
            this.trailCanvas.width = newWidth
            this.trailCanvas.height = newHeight
        }
    }

    // 计算移动角度（0-360度）
    calculateAngle(dx, dy) {
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        return Math.round(angle);
    }

    handleTouchStart = (e) => {
        const touch = e.touches?.[0] || e
        if (!this.isValidTouch(touch.clientX, touch.clientY)) return
        
        // 双击检测
        const currentTime = new Date().getTime();
        const tapThreshold = this.doubleTapThreshold || 300;
        
        if (this.doubleTapReset && (currentTime - this.lastTapTime) < tapThreshold) {
            this.resetToCenter();
            this.emit('onDoubleTap');
            this.lastTapTime = 0;
            return;
        }
        this.lastTapTime = currentTime;
        
        this.isTouching = true
        this.emit('onTouchStart')
        this.handleTouchMove(touch)
    }

    handleTouchMove = (e) => {
        if (!this.isTouching) return
        
        const touch = e.touches?.[0] || e
        if (!this.isValidTouch(touch.clientX, touch.clientY)) {
            this.isTouching = false
            return
        }

        let newPos;
        if (this.smoothMove) {
            newPos = this.calculatePositionWithSensitivity(touch.clientX, touch.clientY)
        } else {
            newPos = this.calculatePositionWithoutSensitivity(touch.clientX, touch.clientY)
        }
        
        if (!this.lastRect || 
            newPos.x < 0 || newPos.y < 0 || 
            newPos.x > this.lastRect.width || 
            newPos.y > this.lastRect.height) {
            this.isTouching = false
            return
        }

        // 应用方向锁定
        newPos = this.applyDirectionLock(newPos);
        
        this.currentPos = newPos
        
        // 计算移动角度
        const dx = newPos.x - this.centerPosition.x;
        const dy = newPos.y - this.centerPosition.y;
        const newAngle = this.calculateAngle(dx, dy);
        
        // 角度变化触发事件
        if (this.currentAngle !== newAngle) {
            this.currentAngle = newAngle;
            this.emit('onDirectionChange', newAngle);
        }
        
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
        
        if (this.smoothMove) {
            this.circle.style.transition = 'left 0.1s, top 0.1s';
        } else {
            this.circle.style.transition = 'none';
        }
        
        if (this.circle) {
            this.circle.style.left = `${newPos.x.toFixed(2)}px`
            this.circle.style.top = `${newPos.y.toFixed(2)}px`
        }
        
        if (this.smoothMove) {
            if (this.useMaxPosition) {
                const normalizedX = (newPos.x / this.lastRect.width) * this.maxPosition
                const normalizedY = (newPos.y / this.lastRect.height) * this.maxPosition
                this.emit('onPositionChange', normalizedX, normalizedY)
            } else {
                this.emit('onPositionChange', newPos.x, newPos.y)
            }
        } else {
            this.emit('onPositionChange', newPos.x, newPos.y)
        }
        
        if (this.showPosition && this.positionText) {
            this.updatePositionText();
        }
        
        // 记录轨迹点
        if (this.showTrail) {
            this.trailPoints.push({
                x: newPos.x,
                y: newPos.y,
                timestamp: Date.now()
            });
            
            // 限制轨迹点数量
            const maxPoints = this.trailMaxPoints || 100;
            if (this.trailPoints.length > maxPoints) {
                this.trailPoints.shift();
            }
            
            // 更新轨迹
            this.updateTrail();
        }
    }

    handleTouchEnd = () => {
        if (!this.isTouching) return;
        
        this.isTouching = false
        this.emit('onTouchEnd')
        
        if (this.resetOnRelease) {
            this.resetToCenter();
        } else if (this.circle) {
            this.circle.style.left = `${this.currentPos.x.toFixed(2)}px`
            this.circle.style.top = `${this.currentPos.y.toFixed(2)}px`
        }
    }

    updatePositionText = () => {
        if (!this.positionText) return;
        
        if (this.smoothMove && this.useMaxPosition) {
            const normalizedX = (this.currentPos.x / this.lastRect.width) * this.maxPosition
            const normalizedY = (this.currentPos.y / this.lastRect.height) * this.maxPosition
            this.positionText.innerText = `X: ${normalizedX.toFixed(1)}, Y: ${normalizedY.toFixed(1)}`;
        } else {
            this.positionText.innerText = `X: ${this.currentPos.x.toFixed(1)}, Y: ${this.currentPos.y.toFixed(1)}`;
        }
        
        // 添加方向锁定指示
        if (this.directionLock !== 'none') {
            this.positionText.innerText += ` [${this.directionLock === 'horizontal' ? '水平' : '垂直'}]`;
        }
    }

    resetToCenter = () => {
        this.currentPos = {
            x: this.centerPosition.x,
            y: this.centerPosition.y
        }
        
        if (this.circle) {
            this.circle.style.left = `${this.centerPosition.x.toFixed(2)}px`
            this.circle.style.top = `${this.centerPosition.y.toFixed(2)}px`
        }
        
        if (this.showPosition && this.positionText) {
            this.updatePositionText();
        }
        
        if (this.smoothMove) {
            if (this.useMaxPosition) {
                this.emit('onPositionChange', 
                    (this.centerPosition.x / this.lastRect.width) * this.maxPosition, 
                    (this.centerPosition.y / this.lastRect.height) * this.maxPosition
                );
            } else {
                this.emit('onPositionChange', 
                    this.centerPosition.x, 
                    this.centerPosition.y
                );
            }
        } else {
            this.emit('onPositionChange', 
                this.centerPosition.x, 
                this.centerPosition.y
            );
        }
    }

    // 清除轨迹
    clearTrail = () => {
        this.trailPoints = [];
        if (this.trailCanvas && this.trailCtx) {
            this.trailCtx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
        }
    }

    // 设置圆圈图片
    setCircleImage = (url) => {
        this.setProps({ circleImage: url });
        this.updateCircleStyle();
    }
    
    // 设置区域图片
    setAreaImage = (url) => {
        this.setProps({ areaImage: url });
        this.updateAreaStyle();
    }
    
    // 设置方向锁定
    setDirectionLock = (mode) => {
        this.setProps({ directionLock: mode });
        this.lockedDirection = mode;
        if (mode !== 'none') {
            this.emit('onDirectionLocked', mode);
        }
    }

    // 更新圆圈样式
    updateCircleStyle = () => {
        if (!this.circle) return;
        
        if (this.circleStyle === 'image' && this.circleImage) {
            this.circle.style.backgroundImage = `url('${this.circleImage}')`;
            this.circle.style.backgroundSize = 'cover';
            this.circle.style.backgroundPosition = 'center';
            this.circle.style.backgroundColor = 'transparent';
        } else {
            this.circle.style.backgroundImage = 'none';
            this.circle.style.backgroundColor = this.circleColor;
        }
    }
    
    // 更新区域样式
    updateAreaStyle = () => {
        if (!this.container) return;
        
        if (this.areaStyle === 'image' && this.areaImage) {
            this.container.style.backgroundImage = `url('${this.areaImage}')`;
            this.container.style.backgroundSize = 'cover';
            this.container.style.backgroundPosition = 'center';
            this.container.style.backgroundColor = 'transparent';
        } else {
            this.container.style.backgroundImage = 'none';
            this.container.style.backgroundColor = this.areaColor;
        }
    }

    // 更新轨迹绘制
    updateTrail = () => {
        if (!this.showTrail || !this.trailCtx || this.trailPoints.length < 2) return;
        
        const ctx = this.trailCtx;
        ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
        
        // 设置轨迹样式
        const trailWidth = this.trailWidth || 2;
        ctx.lineWidth = trailWidth;
        ctx.lineCap = 'round';
        
        // 设置线条样式
        if (this.trailStyle === 'dashed') {
            ctx.setLineDash([5, 3]);
        } else if (this.trailStyle === 'dotted') {
            ctx.setLineDash([2, 3]);
        } else {
            ctx.setLineDash([]);
        }
        
        // 绘制轨迹路径
        for (let i = 1; i < this.trailPoints.length; i++) {
            const p1 = this.trailPoints[i - 1];
            const p2 = this.trailPoints[i];
            
            // 计算透明度（随时间衰减）
            const fadeTime = this.trailFadeTime || 3000;
            const age = Date.now() - p1.timestamp;
            const alpha = Math.max(0, 1 - age / fadeTime);
            
            // 应用颜色和透明度
            ctx.strokeStyle = this.hexToRgba('#3498db', alpha);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
    }

    // 辅助函数：十六进制颜色转RGBA
    hexToRgba = (hex, alpha) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgba(0, 0, 0, ${alpha})`;
    }

    render() {
        this.rotation = this.rotationAngle % 360
        
        // 确保中心点位置更新
        if (this.container) {
            const rect = this.container.getBoundingClientRect();
            if (rect.width && rect.height) {
                this.centerPosition = {
                    x: rect.width / 2,
                    y: rect.height / 2
                };
            }
        }
        
        const dynamicStyle = `
            .touch-area {
                width: 100%;
                height: 100%;
                position: relative;
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
                    this.updateAreaStyle();
                }}
                className="touch-area"
                onTouchStart={this.handleTouchStart}
                onTouchMove={(e) => this.handleTouchMove(e.touches[0])}
                onTouchEnd={this.handleTouchEnd}
                onMouseDown={this.handleTouchStart}
                onMouseMove={this.handleTouchMove}
                onMouseUp={this.handleTouchEnd}
                onMouseLeave={this.handleTouchEnd}
            >
                <style>{dynamicStyle}</style>
                
                {/* 轨迹画布 */}
                {this.showTrail && (
                    <canvas 
                        ref={el => {
                            if (el && !this.trailCanvas) {
                                this.trailCanvas = el;
                                this.trailCtx = el.getContext('2d');
                            }
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 1
                        }}
                        width={this.lastRect?.width || 300}
                        height={this.lastRect?.height || 300}
                    />
                )}
                
                <div 
                    className="control-circle" 
                    ref={el => {
                        this.circle = el;
                        this.updateCircleStyle();
                    }}
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
        if (!this.lastRect) {
            return { x: 0, y: 0 };
        }
        
        if (this.smoothMove && this.useMaxPosition) {
            return {
                x: (this.currentPos.x / this.lastRect.width) * this.maxPosition,
                y: (this.currentPos.y / this.lastRect.height) * this.maxPosition
            }
        } else {
            return {
                x: this.currentPos.x,
                y: this.currentPos.y
            }
        }
    }
    
    getCurrentDirection() {
        return this.currentAngle;
    }
}

exports.types = types
exports.widget = Widget

/*
* 作者：垃圾桶
* 版本：1.5.0
*/