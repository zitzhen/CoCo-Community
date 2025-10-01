/**
 * @author: 琦琦
 * 来自 Qii-UI 组件库
 */

// 更新：新增两侧留白参数

const blockColor = '#1E90FF'
var document = this.document

let types = {
    title: "聊天框",
    type: "QII_CHAT_BOX_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/Hyu5RLKI1e.image/png?hash=FjQnwvVW8GPSjKmsp58K-6l6U6SR",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.1.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 360,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 640,
        },
        {
            key: 'msgData',
            label: '聊天数据',
            valueType: 'string',
            editorType: 'TextArea',
            defaultValue: `[
    {
        "id": "001",
        "type": "text",
        "position": "left",
        "name": "组件库",
        "avatar": "https://img.picgo.net/2025/01/04/-2023-11-29-1453small5e6a2609de01ed01.png",
        "msg": "你好，有什么事吗？",
        "image": "",
        "file": "",
        "level": "Qii",
        "levelType": "blue",
        "tag": ""
    },
    {
        "id": "002",
        "type": "text",
        "position": "right",
        "name": "琦琦",
        "avatar": "https://img.picgo.net/2024/12/14/2921809d8ae9b27884.jpeg",
        "msg": "这是一条测试消息，纯文本类型，显示在右侧。",
        "image": "",
        "file": "",
        "level": "至高无上",
        "levelType": "gold",
        "tag": ""
    },
    {
        "id": "003",
        "type": "tips",
        "position": "",
        "avatar": "",
        "name": "",
        "msg": "12:30",
        "image": "",
        "file": "",
        "level": "",
        "levelType": "",
        "tag": ""
    },
    {
        "id": "004",
        "type": "textImage",
        "position": "left",
        "name": "不知名群友",
        "avatar": "https://img.picgo.net/2025/01/04/-2023-11-30-211709565d5471c24518fb.png",
        "msg": "可以发送图片、视频、音频消息，也支持图片和文字混合发送。",
        "image": "https://img.picgo.net/2025/01/04/20FE37D7BFF2D55628B4CD816DBAF82F212d0326161cd39c.jpg",
        "file": "",
        "level": "LV100",
        "levelType": "grey",
        "tag": ""
    },
    {
        "id": "005",
        "type": "audio",
        "position": "right",
        "name": "琦琦",
        "avatar": "https://img.picgo.net/2024/12/14/2921809d8ae9b27884.jpeg",
        "msg": "",
        "image": "",
        "file": "http://m701.music.126.net/20250206090312/2f0052919a6945a49da6d07b5abbf56c/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/45416588313/3f07/0eb2/b810/a9dd28895837e0425e0b2ef215f30207.mp3?vuutv=MTR4235NygyrjXsMILvl0+zFervbEp5Z2VBC60oO0vGkvhKwr83oETayoa4K5iblQ6TWx8kaPTBAqD/EhcNeFQn9OUk0CVZTEbNsqya+288=",
        "level": "至高无上",
        "levelType": "gold",
        "tag": ""
    },
    {
        "id": "006",
        "type": "video",
        "position": "left",
        "name": "不知名群友",
        "avatar": "https://img.picgo.net/2025/01/04/-2023-11-30-211709565d5471c24518fb.png",
        "msg": "",
        "image": "https://p1.music.126.net/p35Nj1sTP8eDXbNHJQY5Pw==/3411784582361783.jpg?imageView&quality=75",
        "file": "http://vodkgeyttp8.vod.126.net/cloudmusic/OCFgJDQgIDAxNiAgNSE5IA==/mv/503273/5c827eeb595bde8d3a41b1bd9399552d.mp4?wsSecret=7b71b6cdbd27c54dc17b9e9ac7447a96&wsTime=1738802845",
        "level": "LV100",
        "levelType": "grey",
        "tag": ""
    }
]`,
        },
        {
            key: 'showLeftAvatar',
            label: '显示左侧头像',
            valueType: 'boolean',
            defaultValue: true,
        },
        {
            key: 'showRightAvatar',
            label: '显示右侧头像',
            valueType: 'boolean',
            defaultValue: true,
        },
        {
            key: 'showLeftName',
            label: '显示左侧昵称',
            valueType: 'boolean',
            defaultValue: true,
        },
        {
            key: 'showRightName',
            label: '显示右侧昵称',
            valueType: 'boolean',
            defaultValue: true,
        },
        {
            key: 'avatarRadius',
            label: '头像圆角大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 10,
        },
        {
            key: 'msgSize',
            label: '气泡文本大小',
            unit: '像素',
            valueType: 'number',
            defaultValue: 14,
        },
        {
            key: 'leftMsgColor',
            label: '左侧文本颜色',
            valueType: 'color',
            defaultValue: '#101010',
        },
        {
            key: 'rightMsgColor',
            label: '右侧文本颜色',
            valueType: 'color',
            defaultValue: '#FFFFFF',
        },
        {
            key: 'nameColor',
            label: '昵称颜色',
            valueType: 'color',
            defaultValue: '#6F6F6F',
        },
        {
            key: 'leftBubbleColor',
            label: '左侧气泡颜色',
            valueType: 'color',
            defaultValue: '#F2F2F5',
        },
        {
            key: 'rightBubbleColor1',
            label: '右侧气泡颜色 - 右上渐变',
            valueType: 'color',
            defaultValue: '#1E90FF',
        },
        {
            key: 'rightBubbleColor2',
            label: '右侧气泡颜色 - 左下渐变',
            valueType: 'color',
            defaultValue: '#58CDFF',
        },
        {
            key: 'bubbleStyle',
            label: '气泡样式',
            valueType: 'string',
            defaultValue: 'three',
            dropdown: [
                { label: '圆角矩形', value: 'all', },
                { label: '有小啾啾', value: 'three', },
            ],
        },
        {
            key: 'bubbleRadius',
            label: '气泡圆角',
            unit: '像素',
            valueType: 'number',
            defaultValue: 8,
        },
        {
            key: 'tipsTextColor',
            label: '提示消息文字颜色',
            valueType: 'color',
            defaultValue: '#A0A0A0',
        },
        {
            key: 'topBlank',
            label: '顶部留白',
            valueType: 'number',
            unit: '像素',
            defaultValue: 10,
        },
        {
            key: 'bottomBlank',
            label: '底部留白',
            valueType: 'number',
            unit: '像素',
            defaultValue: 10,
        },
        {
            key: 'leftBlank',
            label: '两侧留白',
            valueType: 'number',
            unit: '像素',
            defaultValue: 50,
        },
        {
            key: 'autoScroll',
            label: '自动滚动到底部',
            valueType: 'boolean',
            defaultValue: true,
        },
    ],
    events: [
        {
            key: 'onClickMessage',
            label: '被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
        // {
        //     key: 'onLongPressMessage',
        //     label: '被长按',
        //     params: [
        //         { key: 'number', label: '行数', valueType: 'number', }, 
        //         { key: 'data', label: '数据', valueType: 'string', }, 
        //         { key: 'x', label: 'X', valueType: 'number', },
        //         { key: 'y', label: 'Y', valueType: 'number', },
        //     ],
        // },
        {
            key: 'onClickBubble',
            label: '气泡被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
        {
            key: 'onClickTips',
            label: '提示被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
        {
            key: 'onClickAvatar',
            label: '头像被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
        {
            key: 'onClickName',
            label: '昵称被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
        {
            key: 'onClickLevel',
            label: '头衔被点击',
            params: [
                { key: 'number', label: '行数', valueType: 'number', }, 
                { key: 'data', label: '数据', valueType: 'string', } 
            ],
        },
    ],
    methods: [
        {
            key: 'createMessage',
            label: '创建消息',
            valueType: 'string',
            params: [
                { 
                    key: "type", valueType: 'string', defaultValue: 'text', 
                    dropdown: [
                        { label: '纯文本', value: 'text', },
                        { label: '富文本', value: 'rich', },
                        { label: '文本+图片', value: 'textImage', },
                        { label: '图片', value: 'image', },
                        { label: '视频', value: 'video', },
                        { label: '音频', value: 'audio', },
                    ], 
                },
                { key: "position", valueType: 'string', defaultValue: 'right', 
                    dropdown: [
                        { label: '右侧', value: 'right', },
                        { label: '左侧', value: 'left', },
                    ], 
                },
                { key: "name", label: '昵称', valueType: 'string', defaultValue: '', },
                { key: "avatar", label: '头像', valueType: 'string', defaultValue: '', },
                { key: "msg", label: '内容', valueType: 'string', defaultValue: '', },
                { key: "image", label: '图片链接', valueType: 'string', defaultValue: '', },
                { key: "file", label: '文件链接', valueType: 'string', defaultValue: '', },
                { key: "level", label: '头衔', valueType: 'string', defaultValue: '', },
                { key: "levelType", valueType: 'string', defaultValue: 'gold', 
                    dropdown: [
                        { label: '金色', value: 'gold', },
                        { label: '青色', value: 'cyan', },
                        { label: '蓝色', value: 'blue', },
                        { label: '灰色', value: 'grey', },
                    ], 
                },
                { key: "tag", label: '备注', valueType: 'string', defaultValue: '', },
                { key: "id", label: 'ID', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { callMethodLabel: false, line: '创建消息', color: '#1EBCFF' },
        },

        {
            key: 'createTips',
            label: '创建提示',
            valueType: 'string',
            params: [
                { key: "text", valueType: 'string', defaultValue: '', },
                { key: "tag", label: '备注', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { callMethodLabel: false, color: '#1EBCFF' },
        },
        {
            key: 'addMessage',
            label: '添加',
            params: [
                { key: "data", label: '消息', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { line: '编辑数据', color: blockColor },
        },
        {
            key: 'addMsgData',
            label: '添加',
            params: [
                { key: "data", label: '聊天数据', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { color: blockColor },
        },
        {
            key: 'insertMsg',
            label: '插入',
            params: [
                { key: "line", label: '在第', labelAfter: '行之后', valueType: 'number', defaultValue: 1, },
                { key: "data", label: '消息', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { color: blockColor },
        },
        {
            key: 'replaceMsg',
            label: '替换',
            params: [
                { key: "line", label: '第', labelAfter: '行的消息', valueType: 'number', defaultValue: 1, },
                { key: "data", label: '为', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { color: blockColor },
        },
        {
            key: 'deleteMsg',
            label: '删除',
            params: [
                { key: "line", label: '第', labelAfter: '行的消息', valueType: 'number', defaultValue: 1, },
            ],
            blockOptions: { color: blockColor },
        },
        {
            key: 'deleteEndMsg',
            label: '删除最后一行的消息',
            params: [],
            blockOptions: { color: blockColor },
        },
        {
            key: 'emptyMsg',
            label: '清空所有消息',
            params: [],
            blockOptions: { color: blockColor },
        },

        {
            key: 'getLineMsg',
            label: '读取',
            valueType: 'string',
            params: [
                { key: "line", label: '第', labelAfter: '行的消息', valueType: 'number', defaultValue: 1, },
            ],
            blockOptions: { callMethodLabel: false, line: '读取数据', color: '#F8B93A' },
        },
        {
            key: 'getTargetMsg',
            label: '获取',
            valueType: 'number',
            params: [
                { key: "key", valueType: 'string', defaultValue: 'tag',
                    dropdown: [
                        { label: '备注', value: 'tag', },
                        { label: 'ID', value: 'id', },
                    ], 
                },
                { key: "value", label: '为', labelAfter: '的消息所在行数', valueType: 'string', defaultValue: '', },
            ],
            blockOptions: { callMethodLabel: false , color: '#F8B93A' },
        },
        {
            key: 'getMsgLength',
            label: '消息数量',
            valueType: 'number',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#F8B93A' },
        },
        {
            key: 'getJsonData',
            label: '聊天数据',
            valueType: ['string', 'array', 'object'],
            params: [],
            blockOptions: { callMethodLabel: false, color: '#F8B93A' },
        },

        {
            key: 'scrollToLine',
            label: '滚动到',
            params: [
                { key: "line", label: '第', labelAfter: '行', valueType: 'number', defaultValue: 1, },
                { key: "anim", label: '动画', valueType: 'boolean', defaultValue: true, },
            ],
            blockOptions: { line: '滚动', color: '#08C2D6' },
        },
        {
            key: 'scrollToBottom',
            label: '滚动到底部',
            params: [
                { key: "anim", label: '动画', valueType: 'boolean', defaultValue: true, },
            ],
            blockOptions: { color: '#08C2D6' },
        },
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 创建消息
    createMessage(type, position, name, avatar, msg, image, file, level, levelType, id, tag) {
        return { type, position, name, avatar, msg, image, file, level, levelType, id, tag }
    }
    createTips(text, tag) {
        return { type: 'tips', msg: text, tag: tag }
    }

    
    // JSON 格式校验
    isJsonString(str) {
        if (!str) {
            this.widgetError('数据不能为空。')
            return false
        }
        try {
            const obj = JSON.parse(str)
            if (typeof obj === 'object' && obj) {
                return true
            } else {
                this.widgetError('请传入正确的 JSON 格式数据。')
                return false
            }
        } catch (e) {
            this.widgetError('请传入正确的 JSON 格式数据。')
            return false
        }
    } 


    // 添加消息
    addMessage(data) {
        if (!this.isJsonString(data)) return
        this.setProps({
            msgData: JSON.stringify([...JSON.parse(this.msgData), JSON.parse(data)])
        })
        this.__autoScrollToBottom(data)
    }

    // 添加聊天数据
    addMsgData(data) {
        if (data === '') {
            this.widgetError('聊天数据不能为空。')
            return
        }
        if (Array.isArray(JSON.parse(data))) {
            this.setProps({
                msgData: JSON.stringify([...JSON.parse(this.msgData), ...JSON.parse(data)])
            })
        } else {
            this.widgetError('聊天数据需要数组格式。')
        }
    }

    // 插入消息
    insertMsg(line, data) {
        if (!this.isJsonString(data)) return
        const msgData = JSON.parse(this.msgData)
        msgData.splice(line, 0, JSON.parse(data))
        this.setProps({
            msgData: JSON.stringify(msgData)
        })
    }

    // 替换消息
    replaceMsg(line, data) {
        if (!this.isJsonString(data)) return
        const msgData = JSON.parse(this.msgData)
        msgData.splice(line - 1, 0, JSON.parse(data))
        this.setProps({
            msgData: JSON.stringify(msgData)
        })
    }

    // 删除消息
    deleteMsg(line) {
        const msgData = JSON.parse(this.msgData)
        msgData.splice(line - 1, 1)
        this.setProps({
            msgData: JSON.stringify(msgData)
        })
    }

    // 删除最后一行的消息
    deleteEndMsg() {
        const msgData = JSON.parse(this.msgData)
        msgData.pop()
        this.setProps({
            msgData: JSON.stringify(msgData)
        })
    }

    // 清空所有消息
    emptyMsg() {
        this.setProps({
            msgData: '[]'
        })
    }

    // 读取指定行的消息
    getLineMsg(line) {
        return JSON.parse(this.msgData)[line - 1]
    }

    // 获取指定参数所匹配的消息行数
    getTargetMsg(key, value) {
        const msgData = JSON.parse(this.msgData)
        for (let i = 0; i < msgData.length; i++) {
            if (msgData[i][key] === value) {
                return i + 1
            }
        }
        return false
    }

    // 获取消息数量
    getMsgLength() {
        return JSON.parse(this.msgData).length
    }

    // 获取聊天数据
    getJsonData() {
        return JSON.parse(this.msgData)
    }


    // 滚动到指定行
    scrollToLine(line, anim) {
        const childElement = document.querySelector(`.Qii_ChatBox_Widget .msg_list > div:nth-child(${line})`)
        if (childElement) {
            childElement.scrollIntoView({ behavior: anim ? 'smooth' : 'auto', block: 'center' })
        }
    }

    // 滚动到底部
    scrollToBottom(anim) {
        const list = document.querySelector(`.Qii_ChatBox_Widget .msg_list`)
        if (anim) {
            list.classList.add('scrollAnim')
        } else {
            list.classList.remove('scrollAnim')
        }
        list.scrollTop = list.scrollHeight
    }

    // 判断是否自动滚动到底部
    __autoScrollToBottom(data) {
        const jsonData = JSON.parse(data)
        const list = document.querySelector(`.Qii_ChatBox_Widget .msg_list`)
        const isBottom = list.scrollHeight - (list.scrollTop + list.clientHeight) <= 500;

        // 左侧消息，并且已滚动到底部，才会自动滚动。右侧消息始终自动滚动
        if (this.autoScroll && jsonData.position == 'left' && isBottom) {
            this.scrollToBottom(false)
        } else if (this.autoScroll && jsonData.position == 'right') {
            this.scrollToBottom(false)
        }
    }


    // 头像
    avatarElement(data, index) { return (
        <div className="avatar">
            <img 
                src={data.avatar} alt="" 
                onClick={() => this.emit('onClickAvatar', index, data)}
                style={{ borderRadius: this.avatarRadius + 'px' }} 
            />
        </div>
    )}

    // 昵称和头衔
    nameElement(data, index) { return (
        <div className="user_info">
            { data.level && <div className={`level ${data.levelType}`} onClick={() => this.emit('onClickLevel', index, data)}>{data.level}</div> }
            <p className="name" style={{ color: this.nameColor }} onClick={() => this.emit('onClickName', index, data)}>{data.name}</p>
        </div>
    )}

    // 气泡
    bubbleElement(data, index) { return (
        <div 
            className={`bubble ${data.position}`} 
            onClick={() => this.emit('onClickBubble', index, data)}
            style={{ 
                background: data.position === 'left' ? this.leftBubbleColor : `linear-gradient(225deg, ${this.rightBubbleColor1}, ${this.rightBubbleColor2})` ,
                borderRadius: this.radiusStyle(data),
                color: data.position === 'left' ? this.leftMsgColor : this.rightMsgColor 
            }}
        >
            { data.type === 'text' && <p style={{ fontSize: this.msgSize + 'px' }}>{data.msg}</p> }
            { data.type === 'rich' && <div dangerouslySetInnerHTML={{ __html: data.msg }}></div> }
            
            { data.type === 'textImage' && <p style={{ fontSize: this.msgSize + 'px' }}>{ data.msg }</p> }
            { data.type === 'textImage' && <img className="image" src={data.image} alt="" style={{ borderRadius: this.bubbleRadius - 2 + 'px' }}/> }
            
        </div>
    )}

    // 圆角样式
    radiusStyle(data) {
        const radius = this.bubbleRadius
        if (this.bubbleStyle === 'three') {
            return data.position === 'left' ? `2px ${radius}px ${radius}px ${radius}px` : `${radius}px 2px ${radius}px ${radius}px`
        } else {
            return `${radius}px`
        }
    }

    // 图片消息
    imageMsgElement(data, index) { return (
        <div className={`image_msg`}>
            <img 
                src={data.image} alt="" 
                onClick={() => this.emit('onClickBubble', index, data)}
                style={{ borderRadius: this.radiusStyle(data), }} 
            />
        </div>
    )}

    // 视频消息
    videoMsgElement(data, index) { return (
        <div className={`video_msg`}>
            <video
                poster={data.image}
                controls 
                onClick={() => this.emit('onClickBubble', index, data)}
                style={{ borderRadius: this.radiusStyle(data), }} 
            >
                <source src={data.file} type="video/mp4"></source>
                浏览器不支持播放视频
            </video>
        </div>
    )}

    // 音频消息
    audioMsgElement(data, index) { return (
        <div className={`audio_msg`}>
            <audio
                controls 
                onClick={() => this.emit('onClickBubble', index, data)}
                style={{ borderRadius: this.radiusStyle(data), }} 
            >
                <source src={data.file} type="audio/mpeg"></source>
                浏览器不支持播放音频
            </audio>
        </div>
    )}


    // 消息结构
    messageElement(data, index) { return (
        <div className={`msg_item ${data.position}`} onClick={() => this.emit('onClickMessage', index, data)}>
            { this.showLeftAvatar && data.position === 'left' && this.avatarElement(data, index) }
            <div className={`content`}>
                { this.showLeftName && data.position === 'left' && this.nameElement(data, index) }
                { this.showRightName && data.position === 'right' && this.nameElement(data, index) }
                { data.type === 'text' && this.bubbleElement(data, index) }
                { data.type === 'rich' && this.bubbleElement(data, index) }
                { data.type === 'textImage' && this.bubbleElement(data, index) }
                { data.type === 'image' && this.imageMsgElement(data, index) }
                { data.type === 'video' && this.videoMsgElement(data, index) }
                { data.type === 'audio' && this.audioMsgElement(data, index) }
            </div>
            { this.showRightAvatar && data.position === 'right' && this.avatarElement(data, index) }
        </div>
    )}

    // 提示类型消息结构
    tipsElement(data, index) { return (
        <div className={`tips_item`} onClick={() => this.emit('onClickTips', index, data)}>
            <div className="content">
                <p className="text" style={{ color: this.tipsTextColor }}>{data.msg}</p>
            </div>
        </div>
    )}


    // 遍历聊天数据，渲染消息
    renderMsg() {
        try {
            const data = JSON.parse(this.msgData || '[]')
            const resultList = []
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                if (item.type === 'tips') {
                    resultList.push(this.tipsElement(item, i + 1))
                } else {
                    resultList.push(this.messageElement(item, i + 1))
                }
            }
            return resultList
        } catch (error) {
            if (this.msgData === '') {
                console.warn('请添加聊天数据。')
            } else {
                this.widgetError('聊天数据解析失败，请检查格式是否正确。')
                console.error('聊天数据解析失败，请检查格式是否正确', error)
            }
            return null
        }
    }

    // 渲染控件
    render() {
        return (
            <div className="Qii_ChatBox_Widget">

                <div 
                    className="msg_list" 
                    style={{ paddingTop: this.topBlank + 'px', paddingBottom: this.bottomBlank + 'px' }}
                >
                    { this.renderMsg() }
                </div>

                <style>
                    {` 
                        .Qii_ChatBox_Widget {
                            width: 100%;
                            height: 100%;
                        }
                        .Qii_ChatBox_Widget p {
                            margin: 0;
                            padding: 0;
                        }
                        .Qii_ChatBox_Widget .msg_list {
                            padding: 60px 10px;
                            width: 100%;
                            height: 100%;
                            overflow-y: auto;
                            scrollbar-width: none;
                        }
                        .Qii_ChatBox_Widget .msg_list.scrollAnim {
                            scroll-behavior: smooth;
                        }
                        .Qii_ChatBox_Widget .msg_list::-webkit-scrollbar {
                            display: none !important;
                        }
                        
                        /* 消息项 */
                        .Qii_ChatBox_Widget .msg_item {
                            padding-top: 5px;
                            margin-bottom: 10px;
                            display: flex;
                            align-items: flex-start;
                        }
                        .Qii_ChatBox_Widget .msg_item.left {
                            padding-right: ${this.leftBlank}px;
                            justify-content: flex-start;
                        }
                        .Qii_ChatBox_Widget .msg_item.right {
                            padding-left: ${this.leftBlank}px;
                            justify-content: flex-end;
                        }
                        .Qii_ChatBox_Widget .msg_item.left .content {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                        }
                        .Qii_ChatBox_Widget .msg_item.right .content {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                        }

                        /* 最后一项添加动画 */
                        /* .Qii_ChatBox_Widget .msg_item:last-child {
                            animation: Qii_ChatBox_Widget_msg_anim 0.3s ease;
                        }

                        @keyframes Qii_ChatBox_Widget_msg_anim {
                            0% {
                                opacity: 0;
                                transform: translateY(15px);
                            }
                            100% {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        } */


                        /* 头像 */
                        .Qii_ChatBox_Widget .avatar {
                            width: 36px;
                            height: 36px;
                            object-fit: cover;
                            overflow: hidden;
                            flex-shrink: 0;
                        }
                        .Qii_ChatBox_Widget .avatar img {
                            width: 100%;
                            height: 100%;
                        }
                        .Qii_ChatBox_Widget .msg_item.left .avatar {
                            margin-right: 10px;
                        }
                        .Qii_ChatBox_Widget .msg_item.right .avatar {
                            margin-left: 10px;
                        }

                        /* 头衔和昵称区域 */
                        .Qii_ChatBox_Widget .user_info {
                            margin-bottom: 4px;
                            display: flex;
                            align-items: center;
                        }
                        .Qii_ChatBox_Widget .msg_item.left .user_info {
                            justify-content: flex-start;
                        }
                        .Qii_ChatBox_Widget .msg_item.right .user_info {
                            justify-content: flex-end;
                        }
                        
                        /* 头衔 */
                        .Qii_ChatBox_Widget .user_info .level {
                            padding: 1px 4px 0 4px;
                            margin-right: 5px;
                            height: 18px;
                            border-radius: 4px;
                            color: #FFFFFF;
                            font-size: 12px;
                            font-weight: bold;
                            transform: scale(0.9);
                        }
                        .Qii_ChatBox_Widget .user_info .level.gold {
                            background: linear-gradient(225deg, #FFC73E, #FFC636);
                        }
                        .Qii_ChatBox_Widget .user_info .level.cyan {
                            background: linear-gradient(225deg, #36DACC, #44E9DB);
                        }
                        .Qii_ChatBox_Widget .user_info .level.blue {
                            background: linear-gradient(225deg, #1E90FF, #1EB2FF);
                        }
                        .Qii_ChatBox_Widget .user_info .level.grey {
                            background: linear-gradient(225deg, #A8B0C5, #A8B0C5);
                        }

                        /* 昵称 */
                        .Qii_ChatBox_Widget .user_info .name {
                            font-size: 12px;
                        }

                        /* 气泡 */
                        .Qii_ChatBox_Widget .bubble {
                            padding: 8px 12px 7px 12px;
                            margin-top: 0px;
                            white-space: pre-line;
                        }

                        /* 气泡内的图片 */
                        .Qii_ChatBox_Widget .bubble .image {
                            width: auto;
                            height: auto;
                            max-width: 160px;
                            max-height: 300px;
                            margin: 5px 0;
                        }

                        
                        /* 图片消息 */
                        .Qii_ChatBox_Widget .msg_item .image_msg img {
                            margin-top: 2px;
                            width: auto;
                            height: auto;
                            max-width: 160px;
                            max-height: 300px;
                        }

                        /* 视频消息 */
                        .Qii_ChatBox_Widget .msg_item .video_msg video {
                            margin-top: 2px;
                            width: auto;
                            height: auto;
                            max-width: 220px;
                            max-height: 300px;
                        }

                        /* 音频消息 */
                        .Qii_ChatBox_Widget .msg_item .audio_msg audio {
                            margin-top: 2px;
                            width: 240px;
                            height: 42px;
                        }
                        .Qii_ChatBox_Widget .msg_item.left .audio_msg audio {
                            color-scheme: light;
                        }
                        .Qii_ChatBox_Widget .msg_item.left .audio_msg audio::-webkit-media-controls-panel {
                            background-color: #FFFFFF;
                        }
                        .Qii_ChatBox_Widget .msg_item.right .audio_msg audio {
                            color-scheme: dark;
                        }
                        .Qii_ChatBox_Widget .msg_item.right .audio_msg audio::-webkit-media-controls-panel {
                            background-color: #1E90FF;
                        }
                        
                        
                        /* 提示类型消息 */
                        .Qii_ChatBox_Widget .tips_item {
                            margin: 10px 0;
                            display: flex;
                            justify-content: center;
                        }
                        .Qii_ChatBox_Widget .tips_item .content {
                            padding: 3px 6px;
                            background: #00000000;
                            border-radius: 8px;
                            font-size: 12px;
                        }
                    `}
                </style>
            </div>
        )
    }
}


// HTML 转义，防止恶意代码注入
// function htmlEscape(htmlData) {
//     const newHtml = (htmlData.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'))
//     return newHtml
// }

exports.types = types
exports.widget = Widget