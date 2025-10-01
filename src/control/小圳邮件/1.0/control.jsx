const types = {
    isInvisibleWidget: true,
    type: "zit-mail",
    icon: "https://xiaozhenkaifa.com/icon/zit-email.svg",
    title: "小圳邮件",
    version: "1.0.0",
    isGlobalWidget: true,
    properties: [],
    methods: [],
    events: [],
};

class Widget extends InvisibleWidget {
    constructor(props) {
        super(props);

    }

}
const http = require('http');
const axios = require('axios');

types['properties'].push({
    key: 'to',
    label: '收件人',
    valueType: 'string',
    defaultValue: '2418587005@qq.com',
    blockOptions: {
    color: '#33ccff',
    icon: '无',
    generateBlock: true,
    inputsInline: true,
    space: 16,
},
})

types['properties'].push({
    key: 'topic',
    label: '主题',
    valueType: 'string',
    defaultValue: 'hi',
    blockOptions: {
    color: '#33ccff',
    icon: '无',
    generateBlock: true,
    inputsInline: true,
    space: 16,
},
})

types['properties'].push({
    key: 'message',
    label: '发送内容',
    valueType: 'string',
    editorType: 'TextArea',
    defaultValue: 'hi',
    blockOptions: {
    color: '#33ccff',
    icon: '无',
    generateBlock: true,
    inputsInline: true,
    space: 16,
},
})

types['events'].push({
    key: 'ok',
    label: '邮件发送成功',
    params: [],

})

types['events'].push({
    key: 'no',
    label: '邮件发送失败',
    params: [],

})

types['events'].push({
    key: 'keyno',
    label: 'key错误',
    params: [],

})

types['methods'].push({
    key: 'Send',
    label: '发送邮件',
    params: [],

    blockOptions: {
    color: '#000000',
    icon: '无',
    generateBlock: true,
    inputsInline: true,
    space: 16,
},
})
Widget.prototype.Send = function () {
      http.get(('https://xiaozhenkaifa.com/api/email/coco-email.php' + String('?to=' + String(String(this.to) + String('&subject=' + String(String(this.topic) + String('&message=' + String(String(this.message) + '&pin=the-coco-to-zit-email'))))))),{},{},
     (response) => {
          if (response.data) {
            try {
                console.log(response.data);
    this.emit("ok");
            } catch (e) {
                console.error('请求失败');
    this.emit("no");
            }
          }
        }
      );

}
exports.types = types;
exports.widget = Widget;
