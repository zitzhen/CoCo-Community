/**
 * @author: 琦琦
 * 来自 Qii 组件库
 */

const methodBlockColor = ' #2C9AFF'
const createBlockColor = ' #62B7FF'
const returnBlockColor = ' #F4AE3B'

var document = this.document
var window = this.window

let types = {
    title: "滑动条",
    type: "QII_SLIDER_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/Hk-zWUEKJg.image/png?hash=FprI2PPUo_iuqRwpFfscpz29p_NN",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.2.0",
    isInvisibleWidget: false, // 是否为不可见控件
    isGlobalWidget: false,    // 是否为全局控件
    hasAnyWidget: true,       // 是否开启任意控件功能
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 280,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 30,
        },
        { key: 'inputDisabled', label: '禁用状态', valueType: 'boolean', defaultValue: false },
        { key: 'inputValue', label: '当前值', unit: '数值', valueType: 'number', defaultValue: 50 },
        { key: 'inputMin', label: '最小值', unit: '数值', valueType: 'number', defaultValue: 0 },
        { key: 'inputMax', label: '最大值', unit: '数值', valueType: 'number', defaultValue: 100 },
        { key: 'inputStep', label: '间隔', unit: '数值', valueType: 'number', defaultValue: 1 },
        { key: 'inputHeight', label: '滑条高度', unit: '像素', valueType: 'number', defaultValue: 10 },
        { key: 'inputRadius', label: '滑条圆角', unit: '像素', valueType: 'number', defaultValue: 10 },
        { key: 'showThumb', label: '显示滑块', valueType: 'boolean', defaultValue: true },
        { key: 'thumbSize', label: '滑块大小', unit: '像素', valueType: 'number', defaultValue: 14 },
        { key: 'thumbRadius', label: '滑块圆角', unit: '像素', valueType: 'number', defaultValue: 10 },
        { key: 'thumbBorder', label: '滑块边框粗细', unit: '像素', valueType: 'number', defaultValue: 2 },
        { key: 'inputBg', label: '未滑过颜色', valueType: 'color', defaultValue: '#EDEDF0' },
        { key: 'inputFg', label: '已滑过颜色', valueType: 'color', defaultValue: '#3280FF' },
        { key: 'thumbColor', label: '滑块颜色', valueType: 'color', defaultValue: '#3280FF' },
        { key: 'thumbBorderColor', label: '滑块边框颜色', valueType: 'color', defaultValue: '#FFFFFF' },
        { key: 'disabledColor', label: '禁用状态颜色', valueType: 'color', defaultValue: '#000000' },
    ],
    events: [
        {
            key: 'inputStart',
            label: '开始滑动',
            params: [
                { key: 'value', label: '滑条值', valueType: 'number', }
            ],
        },
        {
            key: 'inputEnd',
            label: '结束滑动',
            params: [
                { key: 'value', label: '滑条值', valueType: 'number', }
            ],
        },
        {
            key: 'inputUpdate',
            label: '值改变',
            params: [
                { key: 'value', label: '滑条值', valueType: 'number', }
            ],
        },
    ],
    methods: [
        {
            key: "setValue",
            label: '设置滑块位置',
            params: [
                {
                    key: "value",
                    valueType: 'number',
                    defaultValue: 0,
                },
            ],
            blockOptions: { color: methodBlockColor, space: 40 },
        },
        {
            key: "getIsSliding",
            label: '正在滑动',
            valueType: 'boolean',
            params: [],
            blockOptions: { color: returnBlockColor, callMethodLabel: false },
        },
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

        this.isSliding = false
    }

    // 获取控件的 ID
    getWidgetId() {
        return this.__widgetId
    }
    
    // 滑条值改变
    handleInput = (event) => {
        if (this.inputDisabled) return
        const value = parseInt(event.target.value, 10)
        this.setProps({
            inputValue: value
        })
        this.emit('inputUpdate', value)
    }

    // 按下滑条
    handleInputDown = () => {
        if (this.inputDisabled) return
        this.isSliding = true
        this.emit('inputStart', this.inputValue)
    }

    // 松开滑条
    handleInputUp = () => {
        if (this.inputDisabled) return
        this.isSliding = false
        this.emit('inputEnd', this.inputValue)
    }

    // 设置滑块位置
    setValue(value) {
        this.setProps({
            inputValue: value
        })
        this.emit('inputUpdate', value)
    }

    // 是否正在滑动
    getIsSliding() {
        return this.isSliding
    }


    // 渲染控件
    render() { return (
        <div className={`Qii_${this.__widgetId}`}>
            
            <input 
                type="range" 
                min={this.inputMin} 
                max={this.inputMax} 
                step={this.inputStep}
                value={this.inputValue}
                disabled={this.inputDisabled}
                onInput={(e) => this.handleInput(e)}
                onMouseDown={() => this.handleInputDown()}
                onMouseUp={() => this.handleInputUp()}
                onTouchStart={() => this.handleInputDown()}
                onTouchEnd={() => this.handleInputUp()}
                />

            <style>
                {`
                    .Qii_${this.__widgetId} {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                    }
                    .Qii_${this.__widgetId} input {
                        width: 100%;
                        height: 100%;
                        -webkit-appearance: none;
                        appearance: none;
                        width: 100%;
                        height: ${this.inputHeight}px;
                        border-radius: ${this.inputRadius}px;
                        background: -webkit-linear-gradient(${this.inputDisabled ? `${this.disabledColor}, ${this.disabledColor}` : `${this.inputFg}, ${this.inputFg}` }) no-repeat ${this.inputBg}; 
                        background-size: ${mapRange(this.inputValue, this.inputMin, this.inputMax, 0, 100)}% 100%;
                        cursor: pointer;
                    }
                    .Qii_${this.__widgetId} input::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        opacity: ${this.showThumb ? '1' : '0'};
                        height: ${this.thumbSize}px;
                        width: ${this.thumbSize}px;
                        border-radius: ${this.thumbRadius}px;
                        background: ${this.inputDisabled ? this.disabledColor : this.thumbColor};
                        box-shadow: 0 0 0 ${this.thumbBorder}px ${this.thumbBorderColor};
                        user-select: none;
                    }
                `}
            </style>
        </div>
    )}
}

// 映射数值范围
function mapRange(value, inMin, inMax, outMin, outMax) {
    const ratio = (value - inMin) / (inMax - inMin)
    const mapped = outMin + ratio * (outMax - outMin)
    return Math.min(outMax, Math.max(outMin, mapped))
}

exports.types = types
exports.widget = Widget