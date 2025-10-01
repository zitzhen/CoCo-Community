// 控件类型定义
const types = {
    type: 'NETEASE_RANDOM_MUSIC_WIDGET', // 控件类型，全局唯一
    title: '垃圾桶-随机获取网易云音乐ID', // 控件的显示名称
    icon: 'https://www.helloimg.com/i/2025/02/14/67af668cb11ed.jpg', // 控件图标
    isInvisibleWidget: true, // 不可见控件
    isGlobalWidget: true, // 全局控件
    properties: [], // 不需要额外属性
    methods: [
        {
            key: 'getRandomMusicId', // 方法名
            label: '从网易云音乐库中随机获取一首歌曲的ID', // 方法显示名称
            params: [], // 不需要参数
            tooltip: '从网易云音乐库中获取随机一首歌曲的ID', // 方法描述
            valueType: 'number' // 返回值类型为数字
        }
    ],
    events: [
        {
            key: 'onMusicIdReceived', // 事件名
            label: '音乐ID获取成功', // 事件显示名称
            params: [
                {
                    key: 'musicId', // 参数名
                    label: '音乐ID', // 参数显示名称
                    valueType: 'number' // 参数类型为数字
                }
            ]
        },
        {
            key: 'onMusicError', // 事件名
            label: '音乐ID获取失败', // 事件显示名称
            params: [
                {
                    key: 'error', // 参数名
                    label: '错误信息', // 参数显示名称
                    valueType: 'string' // 参数类型为字符串
                }
            ]
        }
    ]
};

// 控件实体定义
class NeteaseRandomMusicWidget extends InvisibleWidget {
    constructor(props) {
        super(props);
    }

    // 方法定义：获取随机音乐ID
    getRandomMusicId() {
        const apiURL = 'https://node.api.xfabe.com/api/wangyi/randomMusic?type=json'; // 小枫公益API接口

        // 使用 axios 发起请求
        const axios = require('axios');

        axios.get(apiURL)
            .then(response => {
                if (response.data.code === 200) {
                    const musicId = response.data.data.id; // 获取音乐ID
                    this.emit('onMusicIdReceived', musicId); // 触发音乐ID获取成功的事件
                } else {
                    this.emit('onMusicError', '获取音乐ID失败，API返回错误'); // 触发获取失败的事件
                }
            })
            .catch(error => {
                this.emit('onMusicError', `获取音乐ID失败，错误信息：${error.message}`); // 触发获取失败的事件
            });
    }
}

// 导出控件
exports.types = types;
exports.widget = NeteaseRandomMusicWidget;
