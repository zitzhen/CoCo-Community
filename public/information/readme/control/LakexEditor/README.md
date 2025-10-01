# LakexEditor
## 控件更新
<div style="border-left: 5px solid rgb(208, 0, 255); padding-left: 10px;">
<h3>v0.4.0 2024-06-26（beta，最新）</h3>
</div>

1. 上线深色主题
2. 支持markdown
<div style="border-left: 5px solid rgb(208, 0, 255); padding-left: 10px;">
<h3>v0.3.8 2024-06-10（beta）</h3>
</div>

1. 修复 coco自定义控件的防护机制 导致初始化不了的问题
<div style="border-left: 5px solid rgb(208, 0, 255); padding-left: 10px;">
 <h3>v0.3.7 2023-09-30（beta）</h3>
</div>

1. 使用编程猫对象储存存放 LakexEditor 资源文件
2. 修复了切换屏幕重新初始化后内容会全部没的bug
3. 代码优化
4. 修复其他bug
<div style="border-left: 5px solid rgb(208, 0, 255); padding-left: 10px;">
<h3>v0.2.0 2023-09-24（beta）<h3>
</div>
1. 发布beta版

## 使用说明
> LakexEditor 官方文档：https://www.yuque.com/yuque/developer/gfoax065u2v72isu

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>1.内容变化<h3>
</div>

![当内容发送变化时](https://cc.zitzhen.cn/control/LakexEditor/images/1.png)

当 文档内容 变化时 触发。

|属性|类型|说明|
|---|---|---|
|操作类型|<a>操作类型</a>|是因什么而导致文档内容变化的。|

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>2.焦点获得<h3>
</div>

![获得焦点时](https://cc.zitzhen.cn/control/LakexEditor/images/2.png)

当 文档 获得 输入焦点时 触发。

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>3.焦点失去<h3>
</div>

![失去焦点时](https://cc.zitzhen.cn/control/LakexEditor/images/3.png)

当 文档 选区变化时 触发。

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>4.选区变化<h3>
</div>

![选区变化](https://cc.zitzhen.cn/control/LakexEditor/images/4.png)

当 文档 选区变化时 触发。

<div style="background-color: orange;border-radius: 5px;">
📌来自 LakexEditor 官方文档：内容变化的选区变化事件不包含在内。
</div>

|属性|类型|说明|
|---|---|---|
|内容|字符串|当前选择了的内容|
|SelectionOBJ|Selection|Selection 容器，参见 https://www.w3cschool.cn/qoyhx/qoyhx-go4m3q7p.html|

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>5.图片视频文件上传<h3>
</div>

![当图片视频文件上传时](https://cc.zitzhen.cn/control/LakexEditor/images/5.png)

因 LakexEditor 需要 自定义 图片视频文件上传 才能正常使用 图片/视频/文件 插入功能，
所以就提供了这么一个事件。

当 用户要插入图片/视频/文件 并 已经选择好文件 时触发。
因原方法需异步，所以要配合 <a>图片视频文件上传异步返回</a> 方法使用。

|属性|类型|说明|
|---|---|---|
|UUID|字符串|用于区分其他文件上传的唯一UUID。|
|FileOBJ|File|File容器，里面有该文件的一些信息，也可以通过该容器获取文件内容等信息。|
|ObjectURL|字符串|ObjectURL临时本地链接，可用于上传至编程猫的对象储存。|
|上传类型|<a>上传类型</a>|通过什么方式上传的，例如：我要导入图片就先要上传图片，这个值对应的就是图片。|

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>6.初始化<h3>
</div>

![初始化](https://cc.zitzhen.cn/control/LakexEditor/images/6.png)

<div style="background-color: rgb(255, 161, 161);border-radius: 5px;">
❗如果你想 <b>屏幕一打开就初始化</b> 的话，

记得 <b>每次打开屏幕 都要 调用这块积木一遍，</b>
不然 <b>一切换屏幕 原有就会被 coco 覆盖。</b>
</div>

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>7.重新初始化<h3>
</div>

![重新初始化](https://cc.zitzhen.cn/control/LakexEditor/images/7.png)

将 原有的 LakexEditor 销毁 并 按照配置 重新初始化 LakexEditor。

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>8.设置文档内容<h3>
</div>

![设置格式](https://cc.zitzhen.cn/control/LakexEditor/images/8.png)

将传入的内容 按照 内容格式 设置文档内容。

|属性|类型|说明|
|---|---|---|
|格式|<a>格式</a>|传入的内容的格式，用于渲染。|
|内容|字符串|格式为“参数格式”的内容。|

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>9. 获取文档内容<h3>
</div>

![获取文档内容](https://cc.zitzhen.cn/control/LakexEditor/images/9.png)

将文档 按照 特定的格式 输出。

|属性|类型|说明|
|---|---|---|
|格式|格式|输出内容的格式。|


<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>10.操作类型</h3>
</div>

![调用操作类型](https://cc.zitzhen.cn/control/LakexEditor/images/10.png)

用于 当内容更变 事件。
- 用户手动：用户自己编辑 触发的。
- 系统设置：调用 设置文档内容 方法 触发的。

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>11.上传类型</h3>
</div>

![调用上传图片](https://cc.zitzhen.cn/control/LakexEditor/images/11.png)

用于 图片视频文件上传 事件。
- 图片。
- 视频。
- 文件。

<div style="border-left: 5px solid rgb(0, 132, 255); padding-left: 10px;">
<h3>12. 图片视频文件上传异步返回</h3>
</div>

![图片视频文件上传异步](https://cc.zitzhen.cn/control/LakexEditor/images/12.png)

请与 <a>当图片视频文件上传时</a> 共同使用！

|属性|类型|说明|
|---|---|---|
|UUID|字符串|用于区分其他文件上传的唯一UUID。|
|链接|字符串|文件上传后的链接。|
|封面（链接）|字符串|上传视频的话，显示视频封面的链接。|

<div style="border-left: 5px solid rgb(255, 208, 0); padding-left: 10px;">
<h3>13. 工具栏默认编辑配置</h3>
</div>

`属性`  ***类型:*** `字符串` ***默认值:*** <a style="color: green;">看下面的示例</a>
在非表格编辑的时候，在工具栏中显示的按钮。
***示例：***

```Plain Text
cardSelect,|,undo,redo,formatPainter,clearFormat,|,style,fontsize,bold,italic,strikethrough,underline,mixedTextStyle,|,color,bgColor,|,alignment,unorderedList,orderedList,indent,lineHeight,|,taskList,link,quote,hr
```

<div style="border-left: 5px solid rgb(255, 208, 0); padding-left: 10px;">
<h3> 14. 工具栏表格编辑配置</h3>
</div>

`属性`  ***类型:*** `字符串` ***默认值:*** <a style="color: green;">看下面的示例</a>
在表格编辑的时候，在工具栏中显示的按钮。
***示例：***
```Bash
cardSelect,|,undo,redo,formatPainter,clearFormat,|,style,fontsize,bold,italic,strikethrough,underline,mixedTextStyle,|,color,bgColor,tableCellBgColor,tableBorderVisible,|,alignment,tableVerticalAlign,tableMergeCell,|,unorderedList,orderedList,indent,lineHeight,|,taskList,link,quote,hr
```

<div style="border-left: 5px solid rgb(255, 208, 0); padding-left: 10px;">
<h3> 15.深色主题</h3>
</div>

`属性`  ***类型:*** `布尔值` ***默认值:*** `false`
采用深色主题初始化界面


### 工具栏配置字符串格式
>格式：将所有项使用 , 隔开。
> —— 来自于 LakexEditor 官方文档

- |：分隔线

- cardSelect：插入面板
- undo：撤销
- redo：重做
- formatPainter：格式刷
- clearFormat：清除格式
- style：设置标题和正文
- fontsize：字号
- bold：加粗
- italic：斜体
- strikethrough：删除线
- underline：下划线
- mixedTextStyle：更多文本样式
- color：字体颜色
- bgColor：背景颜色
- alignment：对齐样式
- unorderedList：无序列表
- orderedList：有序列表
- indent：缩进调整
- lineHeight：行高
- taskList：任务列表
- link：超链接
- quote：引用
- hr：分割线

- tableCellBgColor：单元格背景颜色（表格专用）
- tableBorderVisible：单元格是否显示边框（表格专用）
- tableVerticalAlign：垂直对齐（表格专用）
- tableMergeCell：合并单元格（表格专用）

### 格式
- 自带格式
- HTML
- 纯文本
- 字典

### 小“寄”巧
#### 图片视频文件都上传到编程猫对象储存
>“微数据库” 是 本地储存 中的 “微数据库” 控件。
>官方文档：https://codemao.yuque.com/kzbwh0/coco_guide/local-storage

![积木](https://cc.zitzhen.cn/control/LakexEditor/images/13.png)

#### 不同情况下使用内容格式
- 自带格式：适用于转到 <a>LakexEditorViewer</a> 查看
- HTML：适用于 另存为网页文件
- 纯文本：适用于 判断文档内字数
- 字典：适用于 储存 编辑器 里的文档，方便下次打开继续编辑

---
控件文档作者：小宏  
Markdown排版：小圳  
>在排版过程中，部分文字有做改动，部分超链接未完全可用。