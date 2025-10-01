# 屏幕工具
<div style="background-color: rgb(180, 240, 255);">
必装控件
</div>

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>屏幕适配</h2>
</div>

>💡 让控件自动适配不同的屏幕。

### 1. 自动适配

![积木：调用(屏幕工具)让控件自动视频屏幕](https://cc.zitzhen.cn/control/%E5%B1%8F%E5%B9%95%E5%B7%A5%E5%85%B7-Qii/images/1.png)
<span>
在 <span style="color: rgb(77, 77, 251);">启动屏幕</span> 中调用一次该积木，即可让所有控件自动适配屏幕。
</span>

> <b>启动屏幕：</b>软件打开后的第一个屏幕，通常只用来显示软件 LOGO，推荐在这个屏幕中进行一些初始化操作，然后再切换到软件的首页。

<div style="background-color: rgb(180, 240, 255);">
Qii 控件库 2.0 内的所有可见控件都已内置 <span style="color: rgb(77, 77, 251);">屏幕适配</span> 属性，你可以方便的设置控件的对齐方式。
其他作者的控件需要适配该功能，才可以自动适配屏幕。
</div>

![菜单：选择屏幕对齐方式，顶部对齐或底部对齐](https://cc.zitzhen.cn/control/%E5%B1%8F%E5%B9%95%E5%B7%A5%E5%85%B7-Qii/images/2.png)

### 2. 手动适配
如果你正在使用的控件没有该功能，可以通过积木来手动适配控件。

![积木：当（全局广播）收到广播时(消息)（数据）](https://cc.zitzhen.cn/control/%E5%B1%8F%E5%B9%95%E5%B7%A5%E5%85%B7-Qii/images/3.png)

<span>
推荐搭配 <span style="color: rgb(77, 77, 251);">全局广播</span> 使用，防止控件被多次设置导致错位。
</span>

1. 在启动屏幕中广播一次 “屏幕适配”，接收广播后对需要的控件进行适配。
2. 把控件的 `Y坐标` 传给适配积木，然后把积木设置给控件的`Y坐标`

### 3. 加入控件生态
如果你正在制作控件，可以给你的控件加入屏幕适配功能。

```JavaScript
// CoCoKit
widget.prop('屏幕适配', 'screenAlign', 'top').dropdown({ 顶部对齐: 'top', 底部对齐: 'bottom' }).noBlock()

// 官方语法
{ 
    key: 'screenAlign', 
    label: '屏幕适配', 
    defaultValue: 'top',
    valueType: 'string', 
    dropdown: [
        { label: '顶部对齐', value: 'top' },
        { label: '底部对齐', value: 'bottom' },
    ],
    blockOptions: { generateBlock: false },
},
```
<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>屏幕切换</h2>
</div>

>💡 在屏幕切换时添加动画
### 1. 快速使用
<span>只需要在切换屏幕之前调用一次 <span style="color: rgb(77, 77, 251);">屏幕切换</span> 积木，就可以添加切换动画。</span>

![积木：当(按钮)被(点击)时](https://cc.zitzhen.cn/control/%E5%B1%8F%E5%B9%95%E5%B7%A5%E5%85%B7-Qii/images/4.png)
控件内置了多个常用的动画，在积木的下拉菜单中选择。
返回上一页时，可以把`打开`切换为`返回`。
### 2. 自定义动画
<span>支持使用 <span style="color: rgb(77, 77, 251);">动画库</span> 创建的动画当作屏幕切换动画。</span>

![积木：当(按钮)被(点击)时](https://cc.zitzhen.cn/control/%E5%B1%8F%E5%B9%95%E5%B7%A5%E5%85%B7-Qii/images/5.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2> 下载</h2>
</div>
请点击ZIT-CoCo-Community上方的下载按钮

---
文档作者：琦琦  
Markdown排版：小圳  
在排版时可能对内容进行了改动  