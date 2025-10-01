/**
 * @author: 琦琦
 * 来自 Qii 控件库
 */

const blockColor = '#1E90FF'
var document = this.document
var window = this.window

let types = {
    title: "对话框",
    type: "QII_DIALOG_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/B1Q5UP19kg.image/svg+xml?hash=FlzrVxf2Hhk6g1HNMjcoQp2rLgpa",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.0.0",
    isInvisibleWidget: true,
    isGlobalWidget: true,
    properties: [
        { key: 'themeColor', label: '主题颜色', valueType: 'color', defaultValue: '#3080FF' },
        { key: 'cardColor', label: '对话框颜色', valueType: 'color', defaultValue: '#FFFFFF' },
        { key: 'textColor', label: '文字颜色', valueType: 'color', defaultValue: '#303032' },
        { key: 'placeColor', label: '提示文案颜色', valueType: 'color', defaultValue: '#A5A5A5' },
        { key: 'cardRadius', label: '对话框圆角', valueType: 'number', defaultValue: 12, unit: '像素' },
        { key: 'titleSize', label: '标题大小', valueType: 'number', defaultValue: 16, unit: '像素' },
        { key: 'textSize', label: '文本大小', valueType: 'number', defaultValue: 14, unit: '像素' },
        { key: 'itemSize', label: '选项文本大小', valueType: 'number', defaultValue: 14, unit: '像素' },
    ],
    events: [
        { key: 'onClickItem', label: '完成选择',
            params: [
                { key: 'text', label: '文本', valueType: 'string' },
                { key: 'index', label: '序号', valueType: 'string' },
                { key: 'id', label: '对话框ID', valueType: 'string' },
            ],
        },
        { key: 'onInputFinish', label: '输入完成',
            params: [
                { key: 'text', label: '输入内容', valueType: 'string' },
                { key: 'id', label: '对话框ID', valueType: 'string' },
            ],
        },
    ],
    methods: [
        {
            key: "showDialog",
            label: '弹出消息',
            params: [
                { key: "title", label: '标题', valueType: 'string', defaultValue: '对话框标题' },
                { key: "text", label: '文本', valueType: 'string', defaultValue: '对话框说明文本' },
                { key: "image", label: '图片', valueType: 'string', defaultValue: '' },
                { key: "items", label: '选项列表', valueType: 'string', defaultValue: '取消,确认' },
                { key: "lightItem", label: '高亮选项', valueType: 'string', defaultValue: '确认' },
                { key: "align", label: '文本对齐', valueType: 'string', defaultValue: '', 
                    dropdown: [
                        { label: '居中', value: 'center' },
                        { label: '左侧', value: 'left' },
                    ],
                },
                { key: "id", label: '对话框ID', valueType: 'string', defaultValue: '对话框1' },
            ],
            blockOptions: { color: blockColor, inputsInline: false },
        },
        {
            key: "showInputDialog",
            label: '进行输入',
            params: [
                { key: "title", label: '标题', valueType: 'string', defaultValue: '对话框标题' },
                { key: "text", label: '文本', valueType: 'string', defaultValue: '对话框说明文本' },
                { key: "image", label: '图片', valueType: 'string', defaultValue: '' },
                { key: "placeholder", label: '提示文案', valueType: 'string', defaultValue: '请输入..' },
                { key: "inputValue", label: '输入内容', valueType: 'string', defaultValue: '' },
                { key: "lightItem", label: '确认按钮', valueType: 'string', defaultValue: '确认' },
                { key: "align", label: '文本对齐', valueType: 'string', defaultValue: '', 
                    dropdown: [
                        { label: '居中', value: 'center' },
                        { label: '左侧', value: 'left' },
                    ],
                },
                { key: "id", label: '对话框ID', valueType: 'string', defaultValue: '对话框2' },
            ],
            blockOptions: { color: blockColor, inputsInline: false },
        },
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)

        this.inputValue = ''    // 输入内容
    }

    // 显示选择对话框
    showDialog(title, text, image, items, lightItem, align, dialogId) {
        this.renderDialog('select', title, text, image, items, lightItem, align, dialogId, null, null)
    }

    // 显示输入对话框
    showInputDialog(title, text, image, placeholder, inputValue, lightItem, align, dialogId) {
        this.renderDialog('input', title, text, image, null, lightItem, align, dialogId, placeholder, inputValue)
    }

    // 渲染对话框
    renderDialog(type, title, text, image, items, lightItem, align, dialogId, placeholder, inputValue) {
        // 检查是否已经存在对话框
        const hasDialog = document.querySelector(`.Qii_${this.__widgetId}`)
        if (hasDialog) this.hideDialog()

        // 对话框卡片
        const dialogCard = document.createElement('div')
        dialogCard.className = `card`
        dialogCard.addEventListener('click', (e) => {
            e.stopPropagation()
        })

        // 图片
        if (image) {
            const dialogImage = document.createElement('img')
            dialogImage.className = 'image'
            dialogImage.src = image
            dialogCard.appendChild(dialogImage)
        }

        // 标题
        if (title) {
            const dialogTitle = document.createElement('div')
            dialogTitle.className = 'title'
            dialogTitle.textContent = title
            dialogCard.appendChild(dialogTitle)
        }

        // 文本
        if (text) {
            const dialogText = document.createElement('div')
            dialogText.className = 'text'
            dialogText.innerHTML = text
            dialogCard.appendChild(dialogText)
        }
        
        // 输入框
        if (type === 'input') {
            items = '取消,' + lightItem
            const dialogInput = document.createElement('input')
            dialogInput.className = 'input'
            dialogInput.placeholder = placeholder
            dialogInput.value = inputValue
            this.inputValue = inputValue
            dialogInput.addEventListener('change', (e) => {
                this.inputValue = e.target.value
            })
            dialogCard.appendChild(dialogInput)
        }

        // 选项列表
        if (items) {
            const dialogItems = document.createElement('div')
            dialogItems.className = 'itemList'
            // 循环生成选项
            items = items.split(',')
            if (items.length > 2) {
                dialogItems.classList.add('vertical')
            }
            for (let index = 0; index < items.length; index++) {
                const item = document.createElement('div')
                item.className = 'item'
                item.textContent = items[index]
                if (items[index] === lightItem) {
                    item.classList.add('lightItem')
                }
                // 点击选项
                item.addEventListener('click', () => {
                    if (type === 'select') {
                        this.emit('onClickItem', items[index], index + 1, dialogId)
                    }
                    if (type === 'input' && items[index] === lightItem) {
                        this.emit('onInputFinish', this.inputValue, dialogId)
                        this.inputValue = ''
                    }
                    this.hideDialog()
                })
                dialogItems.appendChild(item)
            }
            dialogCard.appendChild(dialogItems)
        }

        // 对话框样式
        const style = document.createElement('style')
        style.textContent = `
            .Qii_${this.__widgetId} {
                position: fixed; left: 0; top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                z-index: 9999;
                animation: Qii_DIALOG_BG_SHOW 0.4s cubic-bezier(.3,.4,.5,1) both;
            }
            .Qii_${this.__widgetId}.hideDialog {
                pointer-events: none;
                animation: Qii_DIALOG_BG_HIDE 0.25s cubic-bezier(.3,.4,.5,1) both;
            }

            /* 卡片 */
            .Qii_${this.__widgetId} .card {
                width: 300px;
                margin-bottom: 20px;
                background: ${this.cardColor};
                border-radius: ${this.cardRadius}px;
                overflow: hidden;
                animation: Qii_DIALOG_CARD_SHOW 0.7s cubic-bezier(.35,.5,.15,1) both;
            }
            .Qii_${this.__widgetId}.hideDialog .card {
                animation: Qii_DIALOG_CARD_HIDE 0.25s cubic-bezier(.35,.5,.15,1) both;
            }

            /* 图片 */
            .Qii_${this.__widgetId} .card .image {
                margin: 10px 10px 0px 10px;
                width: calc(100% - 20px);
                max-height: 280px;
                border-radius: ${this.cardRadius - 4}px;
                object-fit: cover;
            }

            /* 标题 */
            .Qii_${this.__widgetId} .card .title {
                padding: 0 20px;
                margin-top: 20px;
                color: ${this.textColor};
                font-size: ${this.titleSize}px;
                font-weight: bold;
                text-align: center;
            }

            /* 文本 */
            .Qii_${this.__widgetId} .card .text {
                padding: 0 20px;
                margin-top: 12px;
                color: ${this.textColor};
                font-size: ${this.textSize}px;
                text-align: ${align};
                white-space: pre-line;
            }

            /* 输入框 */
            .Qii_${this.__widgetId} .card .input {
                border: none;
                outline: none;
                padding: 0 14px;
                margin: 16px 20px 0 20px;
                width: calc(100% - 40px);
                height: 42px;
                border-radius: 8px;
                background: rgba(0, 0, 20, 0.06);
                color: ${this.textColor};
                font-size: ${this.textSize}px;
            }
            .Qii_${this.__widgetId} .card .input::placeholder {
                color: ${this.placeColor};
            }

            /* 选项列表 */
            .Qii_${this.__widgetId} .itemList {
                margin-top: 20px;
                display: flex;
                border-top: 1px solid #00002008;
            }
            .Qii_${this.__widgetId} .itemList.vertical {
                flex-direction: column;
            }
            .Qii_${this.__widgetId} .itemList .item {
                width: 100%;
                height: 50px;
                line-height: 50px;
                color: ${this.textColor};
                font-size: ${this.itemSize}px;
                text-align: center;
                font-weight: bold;
                user-select: none;
                cursor: pointer;
            }
            .Qii_${this.__widgetId} .itemList .item:active {
                background: rgba(0, 0, 20, 0.06);
            }

            .Qii_${this.__widgetId} .itemList .lightItem {
                color: ${this.themeColor};
            }


            /* 背景动画 */
            @keyframes Qii_DIALOG_BG_SHOW {
                0% { background: rgba(0, 0, 0, 0.0) }
                100% { background: rgba(0, 0, 0, 0.4) }
            }
            @keyframes Qii_DIALOG_BG_HIDE {
                0% { background: rgba(0, 0, 0, 0.4) }
                100% { background: rgba(0, 0, 0, 0.0) }
            }

            /* 卡片动画 */
            @keyframes Qii_DIALOG_CARD_SHOW {
                0% {
                    transform: scale(0.5);
                    opacity: 0;
                }
                25% {
                    opacity: 1;
                }
                50% {
                    transform: scale(1.01);
                }
                100% {
                    transform: scale(1);
                }
            }
            @keyframes Qii_DIALOG_CARD_HIDE {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.5);
                    opacity: 0;
                }
            }
        `;

        // 对话框容器
        const dialogContainer = document.createElement('div')
        dialogContainer.className = `Qii_${this.__widgetId}`
        dialogContainer.appendChild(dialogCard)
        dialogContainer.appendChild(style)

        // 添加对话框到屏幕上
        document.body.appendChild(dialogContainer)
    }


    // 隐藏对话框
    hideDialog() {
        const dialogContainer = document.querySelectorAll(`.Qii_${this.__widgetId}`)
        if (dialogContainer) {
            // 添加类名，显示隐藏动画
            dialogContainer.forEach(element => {
                element.classList.add('hideDialog')
            })
            // 等待动画结束移除对话框
            setTimeout(() => {
                dialogContainer.forEach(element => {
                    element.remove()
                })
            }, 300)
        }
    }


}


exports.types = types
exports.widget = Widget