/**
 * @author: 琦琦
 * 来自 Qii 组件库
 */

const blockColor = '#1E90FF'
var document = this.document
var window = this.window

let types = {
    title: "歌词展示",
    type: "QII_LYRICS_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/BkvQnTHKkx.image/png?hash=FsgRlkT4R3M5R6RXUM_I_EDT9PWv",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.0.0",
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
        { key: 'lyricsString', label: '歌词', valueType: 'string', defaultValue: '' },
        { key: 'lyricsTString', label: '翻译', valueType: 'string', defaultValue: '' },
        { key: 'lyricActiveColor', label: '当前歌词颜色', valueType: 'color', defaultValue: '#FFFFFFE0' },
        { key: 'lyricColor', label: '未播放歌词颜色', valueType: 'color', defaultValue: '#FFFFFF' },
        { key: 'lyricTActiveColor', label: '当前歌词翻译颜色', valueType: 'color', defaultValue: '#FFFFFFB0' },
        { key: 'lyricTColor', label: '未播放歌词翻译颜色', valueType: 'color', defaultValue: '#FFFFFFB0' },
        { key: 'lyricSize', label: '歌词文本大小', valueType: 'number', defaultValue: 20, unit: '像素' },
        { key: 'lyricTSize', label: '歌词翻译文本大小', valueType: 'number', defaultValue: 18, unit: '像素' },
        { key: 'lyricActiveScale', label: '当前歌词大小', valueType: 'number', defaultValue: 100, unit: '%' },
        { key: 'lyricScale', label: '未播放歌词大小', valueType: 'number', defaultValue: 80, unit: '%' },
        { key: 'lyricActiveOpacity', label: '当前歌词透明度', valueType: 'number', defaultValue: 100, unit: '%' },
        { key: 'lyricOpacity', label: '未播放歌词透明度', valueType: 'number', defaultValue: 50, unit: '%' },
        { key: 'lyricPadding', label: '歌词间距', valueType: 'number', defaultValue: 20, unit: '像素' },
        { key: 'listPadding', label: '两侧间距', valueType: 'number', defaultValue: 26, unit: '像素' },
        { key: 'lyricTop', label: '当前歌词距离顶部的位置', valueType: 'number', defaultValue: 150, unit: '像素' },
        { key: 'lyricSpeed', label: '歌词滚动速度', valueType: 'number', defaultValue: 800, unit: '毫秒' },
        { key: 'topPadding', label: '顶部留白', valueType: 'number', defaultValue: 200, unit: '像素' },
        { key: 'lyricBold', label: '歌词加粗', valueType: 'boolean', defaultValue: true },
        { key: 'lyricTBold', label: '歌词翻译加粗', valueType: 'boolean', defaultValue: false },
        { key: 'lyricBlur', label: '模糊效果', valueType: 'boolean', defaultValue: true },
        { key: 'lyricCenter', label: '居中模式', valueType: 'boolean', defaultValue: false },
        { key: 'noScroll', label: '禁止用户操作', valueType: 'boolean', defaultValue: false },
        { key: 'lyricShadow', label: '歌词高亮样式', valueType: 'string', defaultValue: '0 0 16px #FFFFFF80' },
    ],
    events: [
        {
            key: 'onClickLyric',
            label: '歌词被点击',
            params: [
                { key: 'time', label: '秒数', valueType: 'number' }, 
            ],
        },
    ],
    methods: [
        {
            key: "setLyricsString",
            label: '设置',
            params: [
                { key: "lyrics", label: '歌词', valueType: 'string', defaultValue: '' },
                { key: "lyricsT", label: '翻译', valueType: 'string', defaultValue: '' },
            ],
            blockOptions: { color: blockColor },
        },
        {
            key: "setMusicTime",
            label: '设置当前秒数',
            params: [
                { key: "lyrics", valueType: 'number', defaultValue: 0 },
            ],
            blockOptions: { color: blockColor, space: 40 },
        },
        {
            key: "getWidgetId",
            label: '的 ID',
            valueType: 'string',
            params: [],
            blockOptions: { callMethodLabel: false, color: '#1EBCFF' },
        },
    ],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)

        this.lyricsMap = {}
        this.currentLyric = 0
        this.touchTimer = null
        this.scrolling = false
    }

    // 获取控件的 ID
    getWidgetId() {
        return this.__widgetId
    }

    // 设置歌词
    setLyricsString(lyrics, lyricsT) {
        this.setProps({
            lyricsString: lyrics,
            lyricsTString: lyricsT,
        })
        // 解析歌词
        this.lyricsMap = this.parseLyrics()
    }

    // 设置音乐时间
    setMusicTime(currentTime) {
        // 获取当前歌词的索引
        let currentLyricIndex = Object.keys(this.lyricsMap).findIndex(key => {
            return currentTime < convertToSeconds(key)
        })
        // 如果找不到对应的歌词，则使用最后一句歌词
        if (currentLyricIndex === -1) {
            currentLyricIndex = Object.keys(this.lyricsMap).length;
        }
        
        // 移除之前添加的类名
        document.querySelectorAll(`.Qii_${this.__widgetId} .lyric-item.active`).forEach(line => {
            line.classList.remove('active')
        })

        // 获取歌词控件
        const lyricWidget = document.querySelector(`.Qii_${this.__widgetId}`)
        
        // 如果用户正在滚动，给所有歌词都添加类名，并添加滑动中标记
        if (this.scrolling) {
            lyricWidget.classList.add('scrolling')
            document.querySelectorAll(`.Qii_${this.__widgetId} .lyric-item`).forEach(line => {
                if (!line.classList.contains('active')) {
                    line.classList.add('active')
                }
            })
            return
        } else {
            lyricWidget.classList.remove('scrolling')
        }

        // 给当前歌词添加类名
        if (currentLyricIndex >= 0) {
            const currentLyricElement = document.querySelector(`.Qii_${this.__widgetId} .lyric-item:nth-child(${currentLyricIndex})`)
            if (currentLyricElement) {
                currentLyricElement.classList.add('active')
            }

            // 如果当前歌词是第一句，不执行滚动
            if (currentLyricIndex <= 1) return

            // 如果当前歌词索引还是本句歌词，不执行滚动
            if (currentLyricIndex === this.currentLyric) return
            this.currentLyric = currentLyricIndex

            // 滚动到当前歌词的位置
            const lyricList = document.querySelector(`.lyric-list`)
            const targetPosition = currentLyricElement.offsetTop - lyricList.offsetTop - this.lyricTop;
            smoothScrollTo(lyricWidget, targetPosition, this.lyricSpeed)
        }
    }


    // 解析歌词
    parseLyrics() {
        if (this.lyricsString == '') return {}
        try {
            // 替换换行符
            const newLyrics = this.lyricsString.replace(/\\n/g, '\n')
            const newLyricsT = this.lyricsTString.replace(/\\n/g, '\n')
            // 匹配歌词和翻译
            const regex = /\[(\d{2}:\d{2}\.\d{2,3})\](.*)/g;
            return [...newLyrics.matchAll(regex), ...newLyricsT.matchAll(regex)]
                .reduce((acc, [match, timestemp, text]) => {
                    if (acc[timestemp]) {
                        // 如果时间戳已经存在，添加翻译
                        acc[timestemp].trans = text
                    } else {
                        // 否则创建新的映射
                        acc[timestemp] = { time: timestemp, text, trans: '' }
                    }
                    return acc;
                }, {})
        } catch (error) {
            this.widgetError('解析歌词出错: ', error)
            console.error('解析歌词出错: ', error)
        }
    }


    // 当歌词被用户主动滑动，停止创建类名
    pauseScrolling() {
        clearTimeout(this.touchTimer)
        this.scrolling = true
        this.touchTimer = setTimeout(() => {
            this.scrolling = false
        }, 3000)
    }


    // 渲染歌词
    renderLyrics() {
        if (this.lyricsString == '') return
        try {
            const resultList = []
            const lyricsMap = this.parseLyrics()
            Object.values(lyricsMap).forEach(item => {
                resultList.push(
                    <div className="lyric-item" onClick={() => this.clickLyric(item.time) } >
                        <div className="text">{item.text}</div>
                        <div className="trans">{item.trans}</div>
                    </div>
                )
            })
            return resultList;
        } catch (error) {
            this.widgetError('渲染歌词出错: ', error)
            console.error('渲染歌词出错: ', error)
        }
    }

    // 处理点击歌词
    clickLyric(time) {
        this.emit('onClickLyric', convertToSeconds(time))
        this.scrolling = false
    }



    // 渲染控件
    render() {
        return (
            <div 
                className={`Qii_${this.__widgetId} ${this.lyricsString != '' ? 'show' : ''} ${this.lyricBlur ? 'blur' : ''}`}
                onTouchStart={() => this.pauseScrolling()}
                onTouchEnd={() => this.pauseScrolling()}
                onTouchMove={() => this.pauseScrolling()}
                onWheel={() => this.pauseScrolling()}
                >

                <div className="lyric-list">
                    {this.renderLyrics()}
                </div>

                <style>
                    {`
                    .Qii_${this.__widgetId} {
                        width: 100%;
                        height: 100%;
                        overflow-y: auto;
                        transition: all 0.6s cubic-bezier(.25, .90, .35, 1);
                        transform: translateY(50px);
                        opacity: 0;
                        pointer-events: ${this.noScroll ? 'none' : 'auto'};
                    }
                    /* 隐藏滚动条 */
                    .Qii_${this.__widgetId}::-webkit-scrollbar {
                        display: none !important;
                    }
                    /* 添加歌词后显示上移动画 */
                    .Qii_${this.__widgetId}.show {
                        transform: translateY(0);
                        opacity: 1;
                    }

                    .Qii_${this.__widgetId} .lyric-list {
                        padding: ${this.topPadding}px ${this.listPadding}px 500px ${this.listPadding}px;
                    }
                    
                    /* 歌词 */
                    .Qii_${this.__widgetId} .lyric-item {
                        margin-bottom: ${this.lyricPadding}px;
                        transition: all ${this.lyricSpeed}ms cubic-bezier(.25, .90, .35, 1);
                        transform-origin: ${this.lyricCenter ? '50% 50%' : '0% 50%'};
                        transform: scale(${this.lyricScale / 100});
                        opacity: ${this.lyricOpacity / 100};
                        text-align: ${this.lyricCenter ? 'center' : 'left'};
                    }
                    .Qii_${this.__widgetId} .lyric-item .text {
                        color: ${this.lyricColor};
                        font-size: ${this.lyricSize}px;
                        font-weight: ${this.lyricBold ? 'bold' : 'normal'};
                        transition: all ${this.lyricSpeed}ms cubic-bezier(.25, .90, .35, 1);
                    }
                    .Qii_${this.__widgetId} .lyric-item .trans {
                        color: ${this.lyricTColor};
                        font-size: ${this.lyricTSize}px;
                        font-weight: ${this.lyricTBold ? 'bold' : 'normal'};
                        transition: all ${this.lyricSpeed}ms cubic-bezier(.25, .90, .35, 1);
                    }

                    /* 歌词高亮样式 */
                    .Qii_${this.__widgetId} .lyric-item.active {
                        transform: scale(${this.lyricActiveScale / 100});
                        opacity: ${this.lyricActiveOpacity / 100};
                    }
                    .Qii_${this.__widgetId} .lyric-item.active .text {
                        color: ${this.lyricActiveColor};
                        text-shadow: ${this.lyricShadow};
                    }
                    .Qii_${this.__widgetId} .lyric-item.active .trans {
                        color: ${this.lyricTActiveColor};
                    }

                    /* 给后面的歌词添加模糊效果 */
                    .Qii_${this.__widgetId}.blur:not(.scrolling) .lyric-item.active + .lyric-item {
                        filter: blur(1px);
                    }
                    .Qii_${this.__widgetId}.blur:not(.scrolling) .lyric-item.active + .lyric-item + .lyric-item {
                        filter: blur(1.5px);
                        opacity: 0.5 !important;
                    }
                    .Qii_${this.__widgetId}.blur:not(.scrolling) .lyric-item.active + .lyric-item + .lyric-item + .lyric-item {
                        filter: blur(2.2px);
                        opacity: 0.4 !important;
                    }
                    .Qii_${this.__widgetId}.blur:not(.scrolling) .lyric-item.active + .lyric-item + .lyric-item + .lyric-item + .lyric-item {
                        filter: blur(3px);
                        opacity: 0.3 !important;
                    }
                    .Qii_${this.__widgetId}.blur:not(.scrolling) .lyric-item.active  + .lyric-item + .lyric-item + .lyric-item + .lyric-item ~ .lyric-item:nth-child(n+5) {
                        filter: blur(4px);
                        opacity: 0.2 !important;
                    }
                    

                `}
                </style>
            </div>
        )
    }
}


// 平滑滚动
function smoothScrollTo(element, targetPosition, duration) {
    const startTime = performance.now();
    const startPosition = element.scrollTop;
    const distance = targetPosition - startPosition;

    function animateScroll(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuint(progress);
        element.scrollTop = startPosition + distance * easedProgress;

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        } else {
            element.scrollTop = targetPosition;
        }
    }
    requestAnimationFrame(animateScroll);
}

// 缓动函数
function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}


// 把 00:00 转换为 秒 格式
function convertToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':')
    return parseInt(minutes) * 60 + parseInt(seconds)
}

exports.types = types
exports.widget = Widget