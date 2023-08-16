---
layout: post
title: 某些面试知识点整理
categories: [文章推荐]
description: 前端知识点整理
keywords: 前端知识点整理
---

## 小程序（微信+支付宝的）相比h5有啥优点

优点：

小程序可以添加到桌面，打开速度比h5快，而且方便。可以使用设备底层的功能，摄像头，语音等等，有缓存，每次打开可以加载上一次，不必每次都重新加载。安全性相对而言比较高

缺点：开放性有限，受母体框架的限制，只能依赖某一个 `app` 打开，小程序的大小受限制

`h5` 的优点：
支持多种设备、跨平台使用，开发成本相对较低，对浏览器的适配较简单

缺点：
打开速度慢，费流量。每次打开页面，都得重新加载，获取数据。
只能使用有限的设备底层功能，体验效果待提升

### 为什么要有小程序或者H5

`App` 维护成本较高，需要专门的开发人员长期维护，发版比较麻烦，对于 `iOS` 来说还好因为只有 `App Store` 一个市场；但对于 `Android` 来说需要发布到不同的应用市场，需要通过打包不同的渠道包来发布和更新。
虽然现在已有许多一键发布的工具，但对 于产品或运营来说也是十分耗时间的工作。开发成本高，一般需要支持 `Android` 和`IOS` 两个版本，下载和转发推广难，推广成本高。

### 在h5页面如何调起app？
通过 `scheme` 机制实现页面唤起。（短链接

比如说：

```
<a href="weixin://">打开微信</a>

<a href="alipays://">打开支付宝</a>

<a href="alipays://platformapi/startapp?saId=10000007">打开支付宝的扫一扫功能</a>

<a href="alipays://platformapi/startapp?appId=60000002">打开支付宝的蚂蚁森林</a>

<!-- 拨号 -->
<a href="tel:10086">打电话给: 10086</a>

<!-- 发送短信 -->
<a href="sms:10086">发短信给: 10086</a>
```

### h5语义化标签的理解
从代码层面：

不同的语义化标签实际上为我们将网页划分了不同的模块，结构分明更利于分解模块，利于团队的合作和维护。

代码结构清晰，可读性高，减少差异化，便于团队开发和维护。

在页面没有加载CSS的情况下，也能呈现良好的内容结构，提升用户体验。

对搜索引擎友好，良好的结构和语义

浏览器解析层面：有利于浏览器解析

## vw和rem的局限性
什么是`rem`？

`REM` 是相对单位，是相对 `HTML` 根元素，`rem` 就是根元素 `html` 的字体大小，其他元素调用 `rem`，能统一根据这个适配比例进行调整。

什么是 `vw`? 

`vw` 是视窗宽度（`viewport width`），`100vw` 等于设备宽度，例如：设备宽度是 `375px`，那么 `1vw` 就等于`3.75px`

字体的问题，字体大小并不能使用 `rem`，字体的大小和字体宽度，并不成线性关系
根元素 `font-size` 值强耦合，系统字体放大或缩小时，会导致布局错乱；`px` 相对于显示器屏幕分辨率，无法用浏览器字体放大功能，弊端之二：`html` 文件头部需插入一段 `js` 代码

百分比`%`是根据父元素宽度或者高度进行计算，而`vw vh`固定按照 `viewport`（可视区域大小）来计算，不会受父元素宽高度影响。
`rem` 各家的实现方式个不一样，不统一，计算麻烦，一般 `ui` 设计都是给出 `xp`

`em` 是根据上一个元素的单位进行计算


`em `的计算值等于当前元素所在的 `font-size` 计算值，比如浏览器的默认字体是 `16px`，`font-size：2em`，那么内联元素的`height` 就是 `32px`

在移动端的开发过程中，我们通常会使用一个插件，自动计算 `px` 单位转化为 `rem` 单位的插件。`postcss-px-to-viewport` 这个插件有一个不好的地方就是直接写在 `dom` 上面的元素的px不会进行转化，所以我们不会动态在 `dom` 上面写 `px` 单位，但是如果借用第三方插件的时候，就不受我们控制了。这个要注意了

还有一种情况，有时候我们并不希望我们的 `px` 单位转化为 `rem` 这个时候怎么办呢？

```
  @media screen and (min-width: 500px) {
    .progress-content {
      font-size: 14px;
      .progress-number {
        font-size: 24px;
      }
    }
  }
```

用 `@media screen and ` 包裹的 `class` 的不会进行 `px` 单位的转化

`<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">`

## css 布局
`css` 选择器及优先级：内联 > ID选择器 > 类选择器（属性，伪类， > 标签选择器，通配符，关系运算符。衍生当在一个样式声明中使用一个 `!important` 规则时，此声明将覆盖任何其他声明。虽然，从技术上讲，!`important` 与优先级无关，但它与最终的结果直接相关，`min-width>max-width>important`

### 左边固定 右边适应几种方案(flex,calc，float，grid但不熟，和flex有些类似)

设计知识点： `flex` => `flex` 的各种布局 flex 和float在一起会怎么样，flex和z-index 在一起会怎么样

          float 高度坍塌 => BFC 

```
.wrapper{
  width: 100%;
  display:flex;
  border: 1px red solid;

}
.right,.left{
  height: 100px;
  border: 1px red solid;
}
.right{
width: 100px;
}
.left{
flex:1 ;相当于flex-grow: 1;flex-shrink: 1;flex-basis: 0%;
//flex设置的第一值是指flex-grow,第二个是指 flex-shrink
}

涉及flex的布局：
父元素设置子元素的对齐属性：
justify-content=>水平方向
align-items=> 垂直方向
flex-wrap=> 换行方式
flex-direction=>是水平方向还是垂直方向，他变了，  子元素的flex就可以实现剩余宽度/高度等分

// 方式二
.wrapper{
  width: 100%;
  font-size:0;// 为了解决换行出现空白换行
}
.right,.left{
  box-sizing:border-box;
  display:inline-block;
  height: 100px;
  font-size:14px;
}
.right{
width: 100px;
}
.left{
  width:calc(100% - 100px);
}

// 实现方式三
.right,.left{
  height: 100px;
  border: 1px red solid;
}
.right{
float:left;
width: 100px;
}
 => 问题会导致高度坍塌，解决方案 常用的父元素overflow:hidden
 原理是形成BFC（块级格式化上下文），内部元素再怎么翻江倒海，翻云覆雨都不会影响外面的元素；
 html,float的值不为none
overflow的值不为visible
display的值为inline-block、table-cell、table-caption
position的值为absolute、fixed

margin上下高度重合也可以用BFC解决

### 水平垂直居中（flex，position，grid）
// 方式一
.wrapper{
  width: 100%;
  border: 1px red solid;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items:center;
}

// 方式二
.wrapper{
  width: 100px;
  border: 1px red solid;
  height: 100px;
 position:relative;
}
.content{
  width: 100px;
  position:absolute;
  left: 50%;
  top: 50%;
  transform:translate(-50%,-50%);
  border:1px red solid;
}

// 方式三
.wrapper{
  width: 100px;
  border: 1px red solid;
  height: 100px;
   display: grid;
}
.content{
      justify-self: center;
    align-self: center;
}

// 方式四
.wrapper{
  width: 100px;
  border: 1px red solid;
  height: 100px;
   display: grid;
   justify-items: center;
    align-items: center;
}

```
### 如何设计一个浮层弹窗 居中 动画 性能  内容自动撑开 滚动的时候禁止滚动穿透


```
// 父元素用固定定位
position:fixed;
left:0;
right:0;
top:0;
bottom:0;

// 子元素：
position:absolute;l
etf:50%;bottom:50%;
transform:translate(-50%,-50%)
```

当元素有 `position:absolute` 的时候，如果只有 `position:absolute` 根据内容撑开宽高
=> `position:absolute` 有对立属性（ `left` 和 `right`，`top` 和 `bottom`）的时候，根据对立属性撑开的元素的宽/高度，根据最近不为 `static` 的元素撑开宽高（`div:{position:absolute;left: 20px;right:20px;}` 距离他最近具有定位特性的祖先元素宽度是 `100px` ;则这个 `div` 元素的宽度是 `60px`，高度同理（如果你给元素设定的宽高，则对立属性撑开的元素的宽/高度失效

滚动的时候禁止滚动穿透(消除滚动条，`position：fixed` 和 `overflow` 都可以，但都要记住滚动到的位置)

在弹窗打开的时候给 `body` 的全局滚动设置 `position:fixed` 属性，并设置 `top` 值；由于设置了 `fixed` 属性，那在弹窗的时候 `body` 就没有滚动条了。此时如果这么设置会发现 `body` 虽然没有了滚动穿透，但是原来的位置丢失了。所以再给 `body` 设置 `fixed` 属性的时候，要把当前的滚动位置赋值给 `css` 的  `top` 属性，那在视觉上就没有任何变化了。

```
fixedBody () {
  let scrollTop = document.scrollingElement
  document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
}
```
##  git的使用
[git](https://sunseekers.github.io/2020/03/26/git/)

## 项目优化
### 在实际项目中的http的性能优化 
`webpack` 的分包加载  第三方依赖打成一个文件 + 额外的性能优化  

减少请求次数：下拉框或者选择某一项，前后两次点击数据一样不请求接口。新增数据成功，本地做数据更新，不请求接口。

截流=>一段时间内只执行一次操作

防抖=>多次操作合并成一次事件执行

[函数截流和防抖](https://sunseekers.github.io/2020/01/10/throttle/)

减少单次请求所花费的时间，`webpack` 分包加载，懒加载，Gzip压缩

`webpack` 优化方案：单一原则不要让 `loader` 做太多事情，减少没必要的 `loader` 解析（`include，exclude`


`Gzip` 压缩原理：是对字符串的重复利用，用某一种方式压缩你的文本长度。去掉空格，代码紧凑（不仅适用于文件，图片也可以，但是压缩在解析耗时，图片一般尽可能用 `base 64`（https://segmentfault.com/a/1190000020386580

`webpack` 的分包加载 ：`splitChunks`

### 代码层面的页面性能优化 
合理的页面布局，`dom` 节点生成，减少没必要的 `dom` 节点

` css` 理解成浏览器能够理解的结构 `styleSheets`，不要使用太多需要计算的属性，`css` 不要嵌套太深

 减少重排和重绘

 [从浏览器工作原理出发，进行性能优化](https://sunseekers.github.io/2020/03/20/computer-browser/)

 ### 项目的动态表单渲染介绍 遇到的问题

 当数据量大的时候，页面渲染会很慢，首次渲染只渲染用户看得到的数据区域，滚动的时候加载其他的

遇到的问题：用户快速滑动，滚动的时候数据还没有在页面渲染完，此时已经滚动已经在最底部了，导致多次请求接口
解决方案，加锁，只有当数据请求成功之后，在请求下一次


### webpack 里面 sass 打包机制需要配置那些工作
```
// 将 JS 字符串生成为 style 节点
'style-loader',
// 将 CSS 转化成 CommonJS 模块
'css-loader',
// 将 Sass 编译成 CSS
'sass-loader',
而 sass-loader 需要以来node-sass或者 Dart Sass
```

`weback` 的 `loader` 怎么写?

`weback` 的 `plugin` 怎么写?

`emmm`,太长了，自己看文章吧  [webpack 的简单介绍(待完善)](https://sunseekers.github.io/2020/03/06/webpack/)

## JavaScript 

### call、apply、bind的异同以及内部实现
[如何模拟一个原生的 call 和 apply,bind？](https://sunseekers.github.io/2020/01/08/apply-call-bind/#%E5%A6%82%E4%BD%95%E6%A8%A1%E6%8B%9F%E4%B8%80%E4%B8%AA%E5%8E%9F%E7%94%9F%E7%9A%84-call-%E5%92%8C-applybind)

### new的模拟实现
[new 构造函数都做了一些什么？](https://sunseekers.github.io/2020/01/04/new-class/)

### 模拟 Promise API
[模拟 Promise API](https://sunseekers.github.io/2020/01/20/promise-API/)

### 作用域提升
```
var a = 1;
var c = 10 ;
function  b() {
	c = 100;//全局赋值
	a = 10;
	return;
	var a  = 1000;// 变量会提升到函数最前面
}
b();
console.log(a,c);// 1 100
```