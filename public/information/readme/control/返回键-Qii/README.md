# 返回键 ✨
<div style="background-color: rgb(180, 240, 255);">
 让你主动处理返回事件。
</div>

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>基础使用</h2>
</div>

### 1. 初始化

<span>
  返回键控件为 
  <span style="color: rgb(82, 82, 255);"><b>屏幕控件</b></span>
  ，需要在每个屏幕中都添加，并调用 
  <span style="color: purple;"><b>初始化积木。</b></span>
</span>


![初始化图片](https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/1.png)

初始化完成后，控件将会接管返回事件：如用户按下手机的返回按钮，或者全面屏手势的侧滑返回功能。

### 2. 切换屏幕

<span>
每次切换到下一个屏幕时，需要调用 
<span style="color: purple;"><b>保存当前屏幕</b></span> 
积木，用于记录屏幕切换的顺序。
</span>

输入框中填入的是 当前屏幕 的名称。
![积木2](https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/2.png)

>注意：第一次调用 <span style="color: rgb(255, 116, 255);">**保存当前屏幕**</span> 积木的屏幕会标记为 **首页**，进行返回时，最终都会返回到该屏幕。

### 3. 返回上一页

在按下手机的返回按钮后，会调用控件的 **返回事件**，在这里处理当前屏幕的返回逻辑。

<span>
把返回键的 <span style="color: purple;"><b>上一屏</b></span> 积木传给 <span style="color: rgb(82, 82, 255);"><b>切换屏幕</b></span> 积木，即可返回上一页。
</span>

<div style="display: flex; align-items: center;">
  <img src="https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/4.png" alt="积木3" >
  <img src="https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/4.png" alt="积木4" >
</div>

>可以在切换屏幕时进行一些判断，比如用户编辑的内容未保存，返回时可以显示提示信息，而不是直接返回。

### 4. 退出APP

可以主动调用该积木来退出 **APP**，或者在 **首页** 等屏幕中，按下返回键时直接退出。

![积木5](https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/5.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>其他功能</h2>
</div>

<span>
控件属性中可以开启 <span style="color: rgb(82, 82, 255);"><b>鼠标右键返回</b></span> 功能，在电脑中预览时，在屏幕任意位置右键即可调用返回事件。
方便软件的开发调试。如果没有关闭，打包后也会判断设备自动关闭该功能。
</span>

![开关](https://cc.zitzhen.cn/control/%E8%BF%94%E5%9B%9E%E9%94%AE-Qii/images/6.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2> 下载</h2>
</div>
请点击ZIT-CoCo-Community上方的下载按钮

---
文档作者：琦琦  
Markdown排版：小圳  
在排版时可能对内容进行了改动  