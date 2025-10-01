# 聊天框
<div style="background-color: rgb(180, 240, 255);">
  一个超高自定义程度的聊天气泡控件。
  使用 React 节点渲染，内置支持多种类型的消息。
</div>

![示例：聊天框效果](https://cc.zitzhen.cn/control/聊天框-Qii/images/1.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>使用方法</h2>
</div>

### 1. 发生一条文本消息
使用聊天框的`创建消息`积木创建一条消息，然后放在`添加消息`积木里面，执行后就可以看到聊天框中多了一条消息。

![积木：添加消息](https://cc.zitzhen.cn/control/聊天框-Qii/images/2.png)
![效果：这是CoCo](https://cc.zitzhen.cn/control/聊天框-Qii/images/3.png)
>可以选择消息的类型，比如`富文本` `图片` `视频`等，控件会自动生成对应的消息。
通过`位置`参数，可以设置消息显示在左侧（其他人的消息）或显示在右侧（自己发送的消息）。

### 2. 发送图片/视频/音频消息
与文本消息一样，只需要把类型改成需要的即可。

### 3. 发送一个提示消息
你可以在需要的时候添加一个提示消息。
![积木：创建提示](https://cc.zitzhen.cn/control/聊天框-Qii/images/4.png)
![效果：这是一个提示](https://cc.zitzhen.cn/control/聊天框-Qii/images/5.png)

### 4. 渲染聊天数据
![积木：渲染聊天数据](https://cc.zitzhen.cn/control/聊天框-Qii/images/6.png)
当你保存聊天数据后，可以直接把保存的数据渲染出来。
需要确保数据格式为数组类型，否则控件会报错。

### 5. 滚动聊天框
![积木：滚动聊天框](https://cc.zitzhen.cn/control/聊天框-Qii/images/7.png)
发送消息时，可以调用积木滚动到底部，也可以滚动到指定消息的位置。

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>消息参数</h2>
</div>

|参数|值|说明|
|--|--|--|
|id|`any`|`可选`,消息的唯一ID，方便快速查找消息。|
|type|`text`纯文本 `rich` 富文本 `textImage` 文本+图片 `images`图片 `video` 视频`sudio` 音频|传入的任何内容都会被渲染为字符串。<br>可以渲染 HTML 内容。<br>同时含有文本和图片的消息。<br>单独发送一个图片。<br>在`文件链接`中填入视频链接，在`图片链接`中填入视频封面链接。<br>在`文件链接`中填入音频链接。|
|position|`left`左侧、`right`右侧|消息的位置，当前用户发送的消息通常都设置为右侧。|
|name|`string`|昵称|
|avatar|`string`|头像链接|
|msg|`string`|消息内容，当类型为富文本时，可以渲染 HTML 内容。|
|image|`string`|图片链接，当类型为视频时，图片为视频封面。|
|file|`string`|文件链接，可以传入视频或音频链接。|
|level|`string`|头衔文本|
|levelType|`gold`金色、`cyan`青色<br>`blue`蓝色、`grey`灰色|头衔类型，用来设置头衔背景的颜色。|
|tag|`string`|消息的标签，不会被渲染，你可以自由使用。|

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>待开发</h2>
</div>

- 发送动画
- 双击头像
- @ 操作

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>更新说明</h2>
</div>

**版本：1.3.2**
- 修复滚动积木失效的问题

**版本：1.3.1**
- 修复添加数组类型数据无效

**版本：1.3.0**
- 修复部分数据的返回格式
- 新增气泡和头像的长按事件
- 新增两侧留白参数

**版本：1.2.0**
- 新增 获取控件ID 积木，调用后返回当前控件的 ID。

**版本：1.1.0**
- 新增两侧留白参数，优化参数文本和数值。

**版本：1.0.1**
- 新增一个方法，可以快速通过指定备注或ID获取数据。

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2> 下载</h2>
</div>
请点击ZIT-CoCo-Community上方的下载按钮

---
文档作者：琦琦  
Markdown排版：小圳  
在排版时可能对内容进行了改动  