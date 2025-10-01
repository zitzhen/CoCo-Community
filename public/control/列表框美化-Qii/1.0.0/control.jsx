/**
 * @author: 琦琦
 * 来自 Qii 组件库
 */

const blockColor = '#1E90FF'
var document = this.document
var window = this.window

let types = {
    title: "列表框美化",
    type: "QII_LIST_STYLE_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/ry8900mSJx.image/svg+xml?hash=FsYOLXpxnmH2losy47-80nFgg2Hn",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.0.0",
    isInvisibleWidget: false,
    isGlobalWidget: false,
    properties: [
        {
            key: '__width',
            label: '宽度',
            valueType: 'number',
            defaultValue: 100,
        },
        {
            key: '__height',
            label: '高度',
            valueType: 'number',
            defaultValue: 50,
        },
        { key: 'listId', label: '列表框 ID', valueType: 'string', defaultValue: '' },
        { key: 'cardNum', label: '双行卡片', valueType: 'boolean', defaultValue: false },
        { key: 'slideX', label: '横向滚动', valueType: 'boolean', defaultValue: false },
        { key: 'listPadding', label: '四周边距', valueType: 'number', defaultValue: 14, unit: '像素' },
        
        { key: 'cardColor', label: '卡片颜色', valueType: 'color', defaultValue: '#FFFFFF' },
        { key: 'cardWidth', label: '卡片宽度', valueType: 'number', defaultValue: 150, unit: '像素' },
        { key: 'cardPadding', label: '卡片间隔', valueType: 'number', defaultValue: 12, unit: '像素' },
        { key: 'cardInPadding', label: '卡片内部间距', valueType: 'number', defaultValue: 12, unit: '像素' },
        { key: 'cardRadius', label: '卡片圆角', valueType: 'number', defaultValue: 12, unit: '像素' },
        
        { key: 'imageHeight', label: '主图高度', valueType: 'number', defaultValue: 120, unit: '像素' },
        
        { key: 'avatarRadius', label: '头像圆角', valueType: 'number', defaultValue: 100, unit: '像素' },
        
        { key: 'titleColor', label: '标题颜色', valueType: 'color', defaultValue: '#202020' },
        { key: 'titleSize', label: '标题大小', valueType: 'number', defaultValue: 14, unit: '像素' },
        { key: 'titleBold', label: '标题加粗', valueType: 'boolean', defaultValue: true },
        
        { key: 'subtitleColor', label: '副标题颜色', valueType: 'color', defaultValue: '#606060' },
        { key: 'subtitleSize', label: '副标题大小', valueType: 'number', defaultValue: 14, unit: '像素' },
        
        { key: 'textColor', label: '说明文本颜色', valueType: 'color', defaultValue: '#202020' },
        { key: 'textSize', label: '说明文本大小', valueType: 'number', defaultValue: 14, unit: '像素'  },
        { key: 'textLines', label: '说明文本行数', valueType: 'number', defaultValue: 2, unit: '行'  },
        
        { key: 'showLine', label: '显示分割线', valueType: 'boolean', defaultValue: false },
        { key: 'lineSize', label: '分割线粗细', valueType: 'number', defaultValue: 1, unit: '像素' },
        { key: 'lineColor', label: '分割线颜色', valueType: 'color', defaultValue: '#00000010' },
    ],
    events: [],
    methods: [],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }

    // 渲染控件
    render() { return (
        <style>
            {`
                /* 列表 */
                #${this.listId}.style_listViewerBox__3BFis,
                #${this.listId} .style_listViewerBox__3BFis {
                    padding: ${this.listPadding}px;
                    height: 100%;
                    overflow-x: ${this.slideX ? 'none' : 'auto'};
                    overflow-y: ${this.slideX ? 'auto' : 'none'};
                    display: ${this.slideX ? 'flex' : 'grid'};
                    grid-template-columns: ${this.cardNum ? '1fr 1fr' : '1fr'};
                    gap: ${this.cardPadding}px;
                    align-content: start;
                }

                /* 卡片 */
                #${this.listId} .style_itemCard__1sNLY {
                    padding: ${this.cardInPadding}px !important;
                    margin: 0 !important;
                    width: ${this.slideX ? this.cardWidth + 'px' : '100%'};
                    height: 100%;
                    background-color: ${this.cardColor} !important;
                    border-radius: ${this.cardRadius}px !important;
                }
                #${this.listId} .style_listViewerBox__3BFis > div:not(:last-child) .style_itemCard__1sNLY {
                    border-bottom: ${this.showLine ? this.lineSize + 'px solid ' + this.lineColor : 'none'} !important;
                }

                /* 主图 */
                #${this.listId} .style_bannerImgBox__nIUOv .style_imageWidget__y1BJc {
                    height: ${this.imageHeight}px !important;
                    border-radius: ${this.cardRadius - 4}px !important;
                    background-size: cover !important;
                }

                /* 头像 */
                #${this.listId} .style_imageWidget__y1BJc {
                    border-radius: ${this.avatarRadius}px !important;
                }
                
                /* 标题文本 */
                #${this.listId} .style_avatarAndTitle__4TTHA .style_title__TlUlN .style_textWidget__3r2dO {
                    color: ${this.titleColor} !important;
                    font-size: ${this.titleSize}px !important;
                    font-weight: ${this.titleBold ? 'bold' : 'normal'} !important;
                }
                
                /* 副标题文本 */
                #${this.listId} .style_subTitle__3Yfxl .style_textWidget__3r2dO {
                    color: ${this.subtitleColor} !important;
                    font-size: ${this.subtitleSize}px !important;
                }
                
                /* 说明文本 */
                #${this.listId} .style_desc__19QH7 .style_textWidget__3r2dO {
                    color: ${this.textColor} !important;
                    font-size: ${this.textSize}px !important;
                }
                #${this.listId} .style_desc__19QH7 .style_textWidget__3r2dO .style_content__1QoMj {
                    -webkit-line-clamp: ${this.textLines} !important;
                }
            `}
        </style>
    )}
}

exports.types = types
exports.widget = Widget