# LakexEditorViewer
## 控件更新
<div style="border-left: 5px solid rgb(242, 0, 255); padding-left: 10px;">
<h3>v0.7.0 2024-06-26（beta，最新）</h3>
</div>

1. 上线深色主题
2. 支持markdown
<div style="border-left: 5px solid rgb(242, 0, 255); padding-left: 10px;">
<h3>v0.6.7 2024-06-10（beta）</h3>
</div>

1. 修复 coco自定义控件的防护机制 导致初始化不了的问题
<div style="border-left: 5px solid rgb(242, 0, 255); padding-left: 10px;">
<h3>v0.6.6 2023-10-03（beta）</h3>
</div>

1. 修复 重新初始化 后，内容滚动不了的Bug
<div style="border-left: 5px solid rgb(242, 0, 255); padding-left: 10px;">
<h3>v0.6.5 2023-09-30（beta）</h3>
</div>

1. 使用编程猫对象储存存放 LakexEditor 资源文件
2. 修复了切换屏幕重新初始化后内容会全部没的bug
3. 代码优化
4. 修复其他bug

<div style="border-left: 5px solid rgb(242, 0, 255); padding-left: 10px;">
<h3>v0.5.0 2023-09-24（beta）</h3>
</div>

发布beta版
## 使用说明
>LakexEditor 官方文档：https://www.yuque.com/yuque/developer/gfoax065u2v72isu

<div style="border-left: 5px solid rgb(150, 227, 255); padding-left: 10px;">
<h4>1.初始化</h4>
</div>

![初始化积木](https://cc.zitzhen.cn/control/LakexEditorViewer/images/1.png)

按照配置 初始化 LakexEditorViewer。

<div style="border-left: 5px solid rgb(150, 227, 255); padding-left: 10px;">
<h4>2.设置文档内容</h4>
</div>

![设置文档内容](https://cc.zitzhen.cn/control/LakexEditorViewer/images/2.png)

将传入的内容 按照 内容格式 设置文档内容。

|属性|类型|说明|
|---|---|---|
|格式|<a>格式</a>|传入的内容的格式，用于渲染。|
|内容|字符串|格式为“参数格式”的内容。|

<div style="border-left: 5px solid rgb(255, 200, 0); padding-left: 10px;">
<h4>3.重新初始化</h4>
</div>

`属性`  ***类型:*** `布尔值` ***默认值:*** `false`
采用深色主题初始化界面

<div style="background-color: orange;border-radius: 10px;">
❗更改主题时，需重新初始化！</div>

---
控件文档作者：小宏  
Markdown排版：小圳  
>在排版过程中，部分文字有做改动，部分超链接未完全可用。