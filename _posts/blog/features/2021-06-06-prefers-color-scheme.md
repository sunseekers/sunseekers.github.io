---
layout: post
title: 前端深色模式的探索
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---

# 前言
你是否遇到过一个需求，网页随着系统模式变化，如果系统是黑夜模式，网页也就 变成黑夜模式。我虽然没有实现过，但是未来或许我就有需求了，于是很好奇，想知道这个是怎么弄的。为此我特意把手机切换到了黑夜模式，我发现很多网页都不支持，哎

## web如何实现呢？
我一个同事曾和我说，我就直接把字体换成白色，背景换成黑色。没有任何问题，就是两行代码的事，简单方便

如果是纯 Web，则在现代浏览器下，可以使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme">prefers-color-scheme</a> 查询语句检测,是否有将系统的主题色设置为亮色或者暗色

举一个简单的例子吧<a href="phttps://codepen.io/qingchuang/pen/abJGPGz">prefers-color-scheme 手机切换模式可见效果</a>

这个效果和我之前写的的换肤好像差不多，换肤就是js去控制加载渲染的样式，而这个这个是通过css的查询变量去控制样式。最后结果都是差不多的，只是实现方式不一样

<a href="https://mp.weixin.qq.com/s/WVqu_gmW9c5YLZPCGukWdg">H5 项目如何适配暗黑模式</a> 可以参考参考

## 有没有更加简单的方式呢？
之前有某种重大事件的时候，很多网页都会变成灰色，曾有人用调试工具看，就是加了一个css控制了全局 

```
// 所有的都变成灰色
*{
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
}

// 只有图片变成灰色
img{
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
}
```

是很简单，轻轻松松一行搞定。解放了我们的双手。

那么这个暗黑模式，我们是不是有什么快捷的方式呢？最好也是这种几行css代码就能解决的。

emmm，张老师的文章里面说到了，利用反相

filter:invert(1)或者mix-blend-mode:difference实现的颜色反相效果

黑白变的问题解决了，但是如果有彩色，也会变，这就很尴尬了，后来在张老师的问题里面也提到了解决方案，但是也指出其他的问题。

## 总结
这个具体要怎么做看产品需求，还有设计商量来吧，实现就是两种思路，换css样式或者用prefers-color-scheme 查询，为了代码最少原则可以需要变得地方可以使用css变量去控制，那么只需要在源头文件修改css变量的值就好了

```
// 页面里面不需要修改
.mode   { background: var(--bg); 
  width: 400px;
  height: 400px;
  border:1px currentColor solid;
  color: var(--color); }

// 这里控制颜色就好了
@media (prefers-color-scheme: dark) {
  :root { 
    --bg:black;
    --color:#fff
  }

}
@media (prefers-color-scheme: light) {
  :root {
    --bg:#fff;
    --color:black
  }

}

```
