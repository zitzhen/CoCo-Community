# HTML 框 ✨

<div style="background-color: rgb(180, 240, 255);">
 渲染自定义的 HTML 内容，并且可以快速更改数据。
</div>

![HTML框说明](https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii/images/1.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>基本用法</h2>
</div>

在控件属性中，可以设置 HTML 的 ***内容*** 和 ***样式***。

<span>
  <img src="https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii//images/2.png" alt="HTML内容" style="display:inline-block; vertical-align:middle;"/>
  <img src="https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii//images/3.png" alt="HTML样式" style="display:inline-block; vertical-align:middle;"/>
</span>

>设置的样式会在整个屏幕生效，也就是会影响到其他控件的样式，因此编辑时确保给每个HTML框的样式设置不同的 class 或 id。
当然也可以利用这个特性，覆盖掉其他控件的样式。

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>修改数据</h2>
</div>

![表格](https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii/images/4.png)

HTML 框使用 ***键值编辑器*** 来设置数据。
在 HTML 内容中，通过 `{{ Name }}`双花括号的方式来设置需要显示的数据。
例如设置`{{ 标题 }}`，渲染后就会显示为`HTML 框`。

`{{  }}`不止可以放在`<></>`标签中，在`class`或`id`内也可以使用。

当然也可以通过积木来动态设置数据，只需要传入***字典数据***，就可以快速设置，无需重新更改 HTML 结构。

![字典](https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii/images/5.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2>点击事件</h2>
</div>

当控件被点击时，可以通过 ***元素ID*** 来判断点击了哪个元素，需要给元素设置`id=""`属性。
如果点击的元素没有设置ID，默认输出 HTML框 这个控件的ID。

![点击事件](https://cc.zitzhen.cn/control/HTML%E6%A1%86-Qii/images/6.png)

<div style="border-left: 5px solid rgb(0, 225, 255); padding-left: 10px;">
<h2> 下载</h2>
</div>
请点击ZIT-CoCo-Community上方的下载按钮

---
文档作者：琦琦  
Markdown排版：小圳  
在排版时可能对内容进行了改动  
