---
layout: post
title: 你不知道的哪些伪类用法
categories: [书籍推荐]
description: 伪类
keywords: 伪类
---

# 最近在看 《CSS 选择器世界》
伪类存在的意义是为了通过选择器找到那些不存在DOM树中的信息以及不能被常规CSS选择器获取到的信息。

获取不存在与DOM树中的信息。比如a标签的:link、visited等，这些信息不存在与DOM树结构中，只能通过CSS选择器来获取；
获取被常规CSS选择器获取的信息。比如：要获取第一个子元素，我们无法用常规的CSS选择器获取，但可以通过 :first-child 来获取到。

通过伪类能够做很多事情不用借助`js`，比如列表搜索过滤效果，表单验证必选提醒，表单选中状态特殊的样式， 空列表的占位符。这些都不需要借助 `js` ，开心，坚信每少一行代码，就少一点 `bug` 的出现率。


![]({{ site.url }}/images/css/0.png)

## `:empty`

`:empty` : `css` 伪类代表没有子元素的元素，子元素只可以是元素节点或者文本

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

注意： 注释，空格都没法匹配

利用场景：

请求接口，但是没有数据返回，利用 `:empty` 可以少写 `v-if` 进行数据判断。

![]({{ site.url }}/images/css/5.png)

## `:not`

匹配不符合一组选择器的元素

使用场景：

配合 `:first-child` 和 `:last-child` 可以简单实现首尾样式不一样

搜索过滤实例页面

![]({{ site.url }}/images/css/7.png)
![]({{ site.url }}/images/css/8.png)

没想到还能这么用吧，我也才发现，又可以少几行 `css` 代码了

## `:checked`

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
	background-color: #f90;
}
label {
	margin-right: 5px;
	padding: 2px;
	border: 1px solid #f90;
	border-radius: 100%;
	width: 18px;
	height: 18px;
	background-clip: content-box;
	cursor: pointer;
	transition: all 300ms;
	&:hover {
		border-color: #09f;
		background-color: #09f;
		box-shadow: 0 0 7px #09f;
	}
}
```

利用 `:checked` 可以对一些选中的项做样式处理，不用 `js` 直接 `css` 实现

![]({{ site.url }}/images/css/6.png)

## `:default`

默认状态

利用这个伪类可以帮我们记住默认状态，避免选择与默认混淆，当默认选项修改的时候，只要修改一处就好了，相对而言有利于项目维护

利用场景：

![]({{ site.url }}/images/css/4.png)

## `:required`

伪类用来匹配设置了 `required` 属性的表单元素，表示这个表单元素必填或者必写，`:optional`是他的对立面

![]({{ site.url }}/images/css/10.png)

## `:placeholder-shown`

占位符显示伪类

当输入框的 `placeholder` 内容显示的时候，匹配该输入框，这个现在有兼容性

![]({{ site.url }}/images/css/9.png)

[参考 demo](https://demo.cssworld.cn/selector/9/1-1.php)

## `::selection`

改变选中文本选择颜色

```
::selection{
		color:#37ca7c;
	}
```

可设置的颜色种类不多，[可参考文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::selection)
参考文章
[灵活运用 CSS 开发技巧](https://juejin.im/post/5d4d0ec651882549594e7293)

## `:indeterminate`

复选框是全选还是半选状态

[参考 demo](https://demo.cssworld.cn/selector/9/2-6.php)

## `:valid :invalid`

`pattern` 检查控件值的正则表达式

`:valid` 表单验证通过的样式

`:invalid` 表单未通过验证的样式

[参考链接](https://codepen.io/JowayYoung/pen/QemxKr)

`nth-child()` 适用于内容动态无法确认的匹配场景

选择器优化

`input[type="radio"] 简写 [type="radio"]`,因为 `radio` 类型的单选款一定是 `input` 标签

因为 `id` 选择器的优先级很高，一般不建议使用，因为后期维护成本很高

`transition` 属性对 `display` 没有过渡效果，但是对于 `visibility` 有过渡效果，有时候我们可以 `transition` 做一点动画，效果体验会更好，配合 `:hover`

不建议用 `span div` 模拟按钮 `ui` 效果，因为 `button` 原生支持表单提交，`enter` ，可以被键盘 `focus`

通过用 `display` 或者 `visibility` 隐藏的元素没办法通过键盘让隐藏的元素控件通过 `:focus` 聚焦，我们可以使用 `opcity` 做到

[截图代码链接](https://github.com/sunseekers/vue-compontent)

## 伪元素和伪类的区别
伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。常见的伪元素有：::before，::after，::first-line，::first-letter，::selection、::placeholder等

