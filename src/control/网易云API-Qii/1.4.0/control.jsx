/**
 * @author: 琦琦
 * 来自 Qii 组件库
 * 
 * 鸣谢：青柠、
 */

const axios = require('axios')

const methodBlockColor = ' #FC5862'
const createBlockColor = ' #62B7FF'
const returnBlockColor = ' #F4AE3B'

const blockIcon = 'https://static.bcmcdn.com/coco/player/unstable/B1R4phxK1l.image/svg+xml?hash=FkRn3pF-bVDoBBFdcmmSrCaRKx0v'
const cocoProxy = 'https://coco.codemao.cn/http-widget-proxy/'

var document = this.document
var window = this.window


const musicConfig = [
    { key: 'id', label: '音乐ID', valueType: 'string' },
    { key: 'name', label: '歌名', valueType: 'string' },
    { key: 'artists', label: '歌手', valueType: 'string' },
    { key: 'artistId', label: '歌手ID', valueType: 'string' },
    { key: 'album', label: '专辑', valueType: 'string' },
    { key: 'cover', label: '封面', valueType: 'string' },
]


const types = {
    title: "网易云API",
    type: "QII_WYYAPI_WIDGET",
    icon: "https://static.bcmcdn.com/coco/player/unstable/r1RHp5bF1e.image/svg+xml?hash=Flcy5XrFMT24Ul-muHn_rtzZ40Sg",
    docs: { url: 'https://www.yuque.com/yuqueyonghuslrsu6/qcqduw/xsz3g8nodpvqmmvv' },
    version: "1.4.0",
    isInvisibleWidget: true,
    isGlobalWidget: false,
    properties: [
        { key: 'musicCoverSize', label: '音乐信息的封面质量', valueType:'number', defaultValue: 800, unit: '宽高', blockOptions: { generateBlock: false } },
        { key: 'searchCoverSize', label: '列表数据中的封面质量', valueType:'number', defaultValue: 200, unit: '宽高', blockOptions: { generateBlock: false }},
    ],
    events: [],
    methods: [],
}


class Widget extends VisibleWidget {
    constructor(props) {
        super(props)
        Object.assign(this, props)
    }
}


types.methods.push({
    key: "getMusicInfo",
    label: '获取音乐信息',
    params: [
        { key: "musicId", label: '音乐ID', valueType: 'string', defaultValue: '2619647261' },
    ],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.getMusicInfo = async function (musicId) {
    try {
        const urls = [
            `${cocoProxy}https://music.163.com/api/song/detail?ids=[${musicId}]`,
            `https://www.lihouse.xyz/coco_widget/music_resource/id/${musicId}`,
            `${cocoProxy}https://music.163.com/api/song/lyric?id=${musicId}&lv=-1&yv=-1&tv=-1`,
        ]
        async function fetchResource(urls) {
            const requests = urls.map(url => axios.get(url))  
            const results = await Promise.all(requests)
            return results.map(result => result.data)
        }
        fetchResource(urls).then(responses => {
            console.log(responses[0].songs[0])
            const music_data = [
                musicId,
                responses[0].songs[0].name,
                responses[0].songs[0].artists.map(artist => artist.name).join(','),
                responses[0].songs[0].artists[0].id,
                responses[0].songs[0].album.name,
                responses[0].songs[0].album.picUrl + `?param=${this.musicCoverSize}y${this.musicCoverSize}`,
                responses[1].song_data.url,
                responses[2].lrc?.lyric || '',
                responses[2].tlyric?.lyric || '',
                responses[2].yrc?.lyric || '',
            ]
            this.emit('getMusicInfoSuccess', ...music_data)
        }).catch(error => {
            throw new Error(error)
        })
    } catch (error) {
        this.emit('onError', '获取音乐信息出错', error.message)
    }
}
types.events.push({
    key: 'getMusicInfoSuccess',
    label: '获取到音乐信息',
    params: [
        ...musicConfig,
        { key: 'url', label: '链接', valueType: 'string' },
        { key: 'lyric', label: '歌词', valueType: 'string' },
        { key: 'fanyi', label: '翻译', valueType: 'string' },
        { key: 'zhuzi', label: '逐字', valueType: 'string' },
    ],
    blockOptions: { icon: blockIcon },
})


types.methods.push({
    key: "getMusicListInfo",
    label: '获取音乐列表',
    params: [
        { key: "musicIdList", label: '音乐ID列表', valueType: 'string', defaultValue: '2619647261,1976514505' },
    ],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.getMusicListInfo = async function (musicIdList) {
    try {
        const musicListResource = await axios.get(`${cocoProxy}https://music.163.com/api/song/detail?ids=[${musicIdList}]`)
        const musicList = musicListResource.data.songs;
        musicList.forEach(item => {
            this.emit('getMusicListInfoSuccess',
                item.id,
                item.name,
                item.artists.map(artist => artist.name).join(','),
                item.artists[0].id,
                item.album.name,
                item.album.picUrl + `?param=${this.searchCoverSize}y${this.searchCoverSize}`,
            )
        })
        this.emit('getMusicFinish')
    } catch (error) {
        this.emit('onError', '获取音乐列表出错', error.message)
    }
}
types.events.push({
    key: 'getMusicListInfoSuccess',
    label: '获取到音乐列表',
    params: musicConfig,
    blockOptions: { icon: blockIcon },
})


types.methods.push({
    key: "searchMusic",
    label: '搜索音乐',
    params: [
        { key: "name", valueType: 'string', defaultValue: '来自天堂的魔鬼' },
        { key: "page", valueType: 'number', label: '页数', defaultValue: 1 },
        { key: "count", valueType: 'number', label: '数量',  defaultValue: 5 },
    ],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.searchMusic = async function (musicName, page, count) {
    try {
        const searchResource = await axios.get(`${cocoProxy}https://music.163.com/api/search/get/web?s=${musicName}&type=1&offset=${page-1}&limit=${count}`)
        const musicList = searchResource.data.result.songs;

        const ids = musicList.map(song => song.id).join(',')
        const coverResource = await axios.get(`${cocoProxy}https://music.163.com/api/song/detail?ids=[${ids}]`)
        const coverList = coverResource.data.songs;

        musicList.forEach((item, index) => {
            this.emit('searchMusicSuccess',
                item.id,
                item.name,
                item.artists.map(artist => artist.name).join(','),
                item.artists[0].id,
                item.album.name,
                coverList[index].album.picUrl + `?param=${this.searchCoverSize}y${this.searchCoverSize}`,
            )
        })
        this.emit('getMusicFinish')
    } catch (error) {
        this.emit('onError', '获取音乐列表信息出错', error.message)
    }
}
types.events.push({
    key: 'searchMusicSuccess',
    label: '搜索到音乐',
    params: musicConfig,
    blockOptions: { icon: blockIcon },
})


types.methods.push({
    key: "getRecommendList",
    label: '获取推荐歌单',
    params: [
        { key: "limit", label: '数量', valueType: 'number', defaultValue: 10 },
    ],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.getRecommendList = async function (limit) {
    try {
        const searchResource = await axios.get(`https://163api.qijieya.cn/personalized?limit=${limit}`)
        const musicList = searchResource.data.result
        musicList.forEach((item, index) => {
            this.emit('getRecommendListSuccess', 
                item.id, 
                item.name,
                item.picUrl + `?param=${this.searchCoverSize}y${this.searchCoverSize}`,
                item.trackCount,
                item.playCount,
            )
        })
        this.emit('getMusicFinish')
    } catch (error) {
        this.emit('onError', '获取推荐歌单出错', error.message)
    }
}
types.events.push({
    key: 'getRecommendListSuccess',
    label: '获取到推荐歌单',
    params: [
        { key: 'id', label: '歌单ID', valueType: 'string' },
        { key: 'title', label: '歌单标题', valueType: 'string' },
        { key: 'img', label: '歌单封面', valueType: 'string' },
        { key: 'musicCount', label: '音乐数量', valueType: 'number' },
        { key: 'playCount', label: '播放量', valueType: 'number' },
    ],
    blockOptions: { icon: blockIcon },
})


types.methods.push({
    key: "getPlaylistMusic",
    label: '获取歌单中的音乐',
    params: [
        { key: "playlistId", label: '歌单ID', valueType: 'string', defaultValue: '6845402595' },
        { key: "page", valueType: 'number', label: '页数', defaultValue: 1 },
        { key: "count", valueType: 'number', label: '数量',  defaultValue: 5 },
    ],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.getPlaylistMusic = async function (playlistId, page, count) {
    try {
        const playListResource = await axios.get(`https://163api.qijieya.cn/playlist/track/all?id=${playlistId}&offset=${(page-1) * count}&limit=${count}`)
        const playList = playListResource.data.songs;
        playList.forEach((item, index) => {
            this.emit('getPlaylistMusicSuccess',
                item.id,
                item.name,
                item.ar.map(artist => artist.name).join(','),
                item.ar[0].id,
                item.al.name,
                item.al.picUrl + `?param=${this.searchCoverSize}y${this.searchCoverSize}`,
            )
        })
        this.emit('getMusicFinish')
    } catch (error) {
        this.emit('onError', '获取歌单中的音乐出错', error.message)
    }
}
types.events.push({
    key: 'getPlaylistMusicSuccess',
    label: '获取到歌单中的音乐',
    params: musicConfig,
    blockOptions: { icon: blockIcon },
})


types.methods.push({
    key: "getHotSearch",
    label: '获取热门搜索',
    params: [],
    blockOptions: { color: methodBlockColor },
})
Widget.prototype.getHotSearch = async function () {
    try {
        const searchResource = await axios.get(`https://163api.qijieya.cn/search/hot/detail`)
        const musicList = searchResource.data.data
        musicList.forEach((item, index) => {
            this.emit('getHotSearchSuccess', 
                item.searchWord,
                index + 1, 
                item.content,
                item.score,
            )
        })
        this.emit('getMusicFinish')
    } catch (error) {
        this.emit('onError', '获取热门搜索出错', error.message)
    }
}
types.events.push({
    key: 'getHotSearchSuccess',
    label: '获取到热门搜索',
    params: [
        { key: 'text', label: '热搜文本', valueType: 'string' },
        { key: 'index', label: '排名', valueType: 'string' },
        { key: 'content', label: '描述', valueType: 'string' },
        { key: 'count', label: '搜索量', valueType: 'string' },
    ],
    blockOptions: { icon: blockIcon },
})



types.events.push({
    key: 'getMusicFinish',
    label: '获取音乐数据完成',
    params: [],
    blockOptions: { icon: blockIcon },
})


types.events.push({
    key: 'onError',
    label: '出错',
    params: [
        { key: 'msg', label: '错误信息', valueType: 'string' },
        { key: 'log', label: '详细内容', valueType: 'string' },
    ],
    blockOptions: { icon: blockIcon },
})

exports.types = types
exports.widget = Widget