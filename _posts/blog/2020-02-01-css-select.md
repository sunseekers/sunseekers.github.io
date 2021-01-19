---
layout: post
title: 你不知道的哪些伪类用法 《CSS 选择器世界》
categories: [书籍推荐]
description: 伪类
keywords: 伪类
---

# 背景
第二次刷 《CSS 选择器世界》，二刷大概花了三个小时吧，翻开书的时候像新的一样。之前应该是快速浏览了，再次看收获很大。二刷是因为在工作中同事和我说了好几种css 选择器的写法，让我大开眼界了比如:`<input type="range" is="ui-range"/> ` 可以通过`[is=ui-range]` 这个选择器来选择这个元素，从而修改他的样式，再比如无效的css选择器和浏览器支持的选择器写在一起的时候，会导致整个样式失效。中间张老师还说了一句，是不是没看过我的 《CSS 选择器世界》 。没看过赶紧看看吧。其实我只是没有全部记住而已，我是看过的。所以我开始了二刷，去书中寻找答案
## 伪元素和伪类的区别

伪元素: 是为了创建一个新的DOM，但是不再DOM树里展示，通常是两个冒号`xx::before or xx:after`

伪类: 是为了通过选择器找到那些不存在DOM树中的信息以及不能被常规CSS选择器获取到的信息比如:link、:visited、:first-child 等，这些信息不存在与DOM树结构中，只能通过CSS选择器来获取；


通过伪类能够做很多事情不用借助`js`，比如列表搜索过滤效果，表单验证必选提醒，表单选中状态特殊的样式， 空列表的占位符。这些都不需要借助 `js` ，只要你的css基础好

## css 选择器
### css 选择器的优先级
0级： 通配选择器（*），选择符（+>~||)，逻辑组合类（:not(),is())这些伪类本身不影响css的优先级，最低的 => 0

1级：标签选择器 （div span p body） => 1

2级：类选择器(.title),属性选择器（[xxx],[xxx=x])伪类（:hover) => 10

3级：ID 选择器(#title) => 100

4级： style 属性内联

5级：!important

当计算出来的优先级一样的时候，采取后来者居上的原则，记住css选择器的优先级只和上面描述的哪些东西有关系，和DOM元素层级位置没有关系


### css 选择器的命名
这可真的是一个难题呀，每次命名的都是要想好久，在HTML中标签和属性是不区分大小写的，但是属性值是区分大小写的，相对于的在css选择器中也就是一样的，属性值选择器区分大小写，这个需要特别注意了

我们应该使用短的组合命名，没有层级，统一的前缀对于一些运营活动最好用统一的前缀，不要有功能性的命名，方便以后用。若是大的项目还可以采取面向属性的命名比如`tr{text-align:right}`,一句属性一个样式，可以看看这个[Facebook 重构：抛弃 Sass / Less ，迎接原子化 CSS 时代](https://juejin.cn/post/6917073600474415117)

命名的时候可以根据HTML标签去寻找灵感(.xx-li,.xx-nav)，可以从HTML属性值里面寻找灵感(.xx-radio)，伪类和布尔属性中寻找灵感（.xx-active,xx-disabled)

尽量不要嵌套选择器，因为这样会因为dom结构互相影响，日后多一个dom结构，选择器就失效了，需要重写

不要使用ID选择器，因为优先级太高了，日后不好控制

最好使用没有嵌套的纯类名选择器，有些css类名还能只控制交互，这个应该是项目中团队的约定

第一次写项目的时候张老师就和我说过一个这里做项目有一个不成文的规定，若是为js操作而存在的选择器前面加一个jsXXX，这个jsXXX只用作js逻辑处理，没有任何样式存在。这样别人一看就知道这是为js存在的选择器，里面没有任何样式。若是一个样式有css控制样式的功能又有js控制的逻辑，日后删除这个样式的时候就要小心了，这样反而不好，有点耦合。

## 选择器
子选择器（>)只会匹配第一代子元素，后代选择器（空格）匹配所有的子元素，相邻兄弟选择器（+）匹配后面的一个兄弟，随后兄弟选择器（～）匹配后面所有的兄弟元素。但是我都不建议使用子类似这样的，因为元素的层级关系就被绑定了，日后的维护变的复杂，对DOM的层级有了要求，高度耦合在一起。为啥都只能选择后面的元素呢？因为DOM的渲染机制，如果有需要我们可以使用一些方法来实现`flex-direction:row-reverse` 调换元素的水平呈现顺序

在css 项目中，最好不要直接把所有元素的默认样式都重置了，因为会引发别的问题。比如有一次我把表单元素默认的outline样式给设置没了，表面上是没有什么关系，但是无障碍访问失效了，本来tab聚焦的元素会高亮，因为我的reset重置不高亮了。无障碍访问失效了

[attr^='val'],[attr$='val'][attr*='val']分别前匹配，后匹配，任意匹配

:hover => 鼠标移上去产生的效果，目前可以用在所有html元素上

:active => 点击反馈的效果，目前可以用在所有的html元素上面

:focus => 元素获取到焦点的时候，产生的效果，可以提高用户的体验，只能是非disabled的表单元素和有href 的a元素，summary 元素。tabindex=-1，元素具有聚焦:focus伪类样式，但是不会被Tab 键索引到

不建议用span div 模拟 button 的原因是，失去了一些表单元素所有的特性，无障碍访问，:focus 伪类，回车键提交...等等一些特性

如果想要元素被隐藏，同时又能被tab键索引最好用opacity 设置透明度，如果用disable或者visibility的话，隐藏的元素就无法被tab聚焦

[:focus-within 元素获得焦点，他的父元素发生变化](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-within)

[:target URL 锚点和页面中的id匹配的元素进行锚时，页面的样式效果，浏览器默认的行为是滚动定位，同时进行进行这个伪类的匹配](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:target)，可以做一些展开收起的操作[:target伪类与显示全部文章内容实例页面](https://demo.cssworld.cn/selector/8/3-1.php#articleMore) ,[:target伪类实现选项卡切换效果实例页面](https://demo.cssworld.cn/selector/8/3-2.php#tabPanel1)

## 常用的选择器

[:empty](https://developer.mozilla.org/en-US/docs/Web/CSS/:empty):伪类代表没有子元素的元素， 注释，空格都没法匹配,他们都属于子元素里面的一种

举个例子

```
  <div class="empty1"></div>
	.empty1:empty {
    background: pink;
    height: 80px;
    width: 80px;
  }
	// 对比 下面的会失效
  <div class="empty1">有内容</div>
	.empty1:empty {
    background: pink;
    height: 80px;
    width: 80px;
  }
```

[在线demo](https://codepen.io/qingchuang/pen/NWRJNdZ)


利用场景：请求接口，但是没有数据返回，利用 `:empty` 可以少写 `v-if` 进行数据判断。

![]({{ site.url }}/images/css/5.png)

[:not](https://developer.mozilla.org/en-US/docs/Web/CSS/:not):匹配不符合一组选择器的元素


使用场景：

1. 配合 `:first-child` 和 `:last-child` 可以简单实现首尾样式不一样，替换原来的两行代码

```
li{margin-left: 10px;}

li:last-child{margin-left:0} 

// 替换代码
li:not(:last-child){margin-left:10px}
```

2. 搜索过滤实例页面

![]({{ site.url }}/images/css/7.png)
![]({{ site.url }}/images/css/8.png)

没想到还能这么用吧，我也才发现，又可以少几行 `css` 代码了

[代码参考](https://github.com/sunseekers/vue-compontent/blob/master/src/components/Search.vue)

[:checked](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)

场景：默认的选项框和设计稿不符合，样式太丑，没有引用第三方 `ui` 库，直接手写。

原理是把原有的选项框隐藏掉，文字用 `span` 包裹，设计稿需要的样式直接写在 `label` 标签上面。选中样式通过 `input:checked + label`

参考代码

```
<div>
	<input type="radio" name="radioName" id="fed-engineer" >
	<label for="fed-engineer"></label>
	<span>前端工程师</span>
</div>
input:checked + label {
		// 选后前的样式
}
label {
	// 选中前的样式
}
```

利用 `:checked` 可以对一些选中的项做样式处理，不用 `js` 直接 `css` 实现

![]({{ site.url }}/images/css/6.png)


[:default](https://developer.mozilla.org/en-US/docs/Web/CSS/:default)

默认状态

利用这个伪类可以帮我们记住默认状态，避免选择与默认混淆，当默认选项修改的时候，只要修改一处就好了，相对而言有利于项目维护

利用场景：

![]({{ site.url }}/images/css/4.png)

[:required](https://developer.mozilla.org/en-US/docs/Web/CSS/:required)

伪类用来匹配设置了 `required` 属性的表单元素，表示这个表单元素必填或者必写，`:optional`是他的对立面

![]({{ site.url }}/images/css/10.png)

[:placeholder-shown](https://developer.mozilla.org/en-US/docs/Web/CSS/:placeholder-shown):input 的value在为空的时候 placeholder会显示，这时候才会匹配 placeholder-shown 这个类

[placeholder-shown 的使用](https://codepen.io/qingchuang/pen/PoGLNdr)

[::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder):placeholder 文本的颜色

[:focus 和 ::placeholder :placeholder-shown 的使用，与占位符交互实](https://codepen.io/qingchuang/pen/MWjxyVj)

[:indeterminate]():radio 或者checkout 没有被匹配上时有的样式

[:indeterminate伪类与单选框组的选择提示实例页面](https://demo.cssworld.cn/selector/9/2-7.php)

[截图代码链接](https://github.com/sunseekers/vue-compontent)

## 伪元素和伪类的区别
伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。常见的伪元素有：::before，::after，::first-line，::first-letter，::selection、::placeholder等

ul > li + li: >表示 ul 的直系后代,+ 表示当前元素的下一个兄弟元素（就是第一个元素不用某种样式）

## 其他
`input[type="radio"] 简写 [type="radio"]`,因为 `radio` 类型的单选款一定是 `input` 标签

`transition` 属性对 `display` 没有过渡效果，但是对于 `visibility` 有过渡效果，有时候我们可以 `transition` 做一点动画，效果体验会更好，配合 `:hover`

不建议用 `span div` 模拟按钮 `ui` 效果，因为 `button` 原生支持表单提交，`enter` ，可以被键盘 `focus`

通过用 `display` 或者 `visibility` 隐藏的元素没办法通过键盘让隐藏的元素控件通过 `:focus` 聚焦，我们可以使用 `opcity` 做到



## 总结
亦如张老师说的：我们做技术的一定要保持理性，要有自己的思考，千万不要被迷惑，最适合的才是最好的

