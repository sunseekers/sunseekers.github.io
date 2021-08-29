---
layout: post
title: font-family 字体文章介绍
categories: [CSS]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---

# 背景
在大多数写代码的时候都很少去设置这个字体，只有很少数的情况才会使用一些特色字体。关于设置字体的问题遇到的是少之又少，但是有一次我还是遇到了。某用户使用华为手机的一款花里胡哨的字体，最后导致这个页面字聚到一坨了，页面简直没法看。解决方法是，给页面设置了一款字体，而不是使用系统字体。

## 字体
local（）: 调用系统安装的字体

unicode-range： 决定自定义的字体用在哪些字符上，遇到中文排版问题，或者需要对某些字体进行精修的时候可以用他

字体文件可以用base64的形式将woff或者woff2字体嵌在css里面，加载体验比外链字体时加载体验要好很多

```
@font-face{
  font-family:sun;
  src:url("data:font/woff2....") format("woff2");
}
```

外链加载字体的时候会有一定的字体延迟，font-display 可以自定义字体加载堵塞时候的渲染规则

`<link rel="preload" href="myfont.woff2" as="font" type="font/woff2" crossorigin>`: 对字体进行预加载，从而提高字体的加载体验。

@font-face定义的字体只有在被调用的时候才会加载。如果页面上没有标签使用到该字，不会加载，可以使用隐藏元素或者  `document.fonts.load("12px Myfont").then(...)` 解决问题

`word-break:keep-all`:可以保护我们中文词组不被断开

`word-break:break-all`: 连续的英文或者数字换行

`word-break:break-word`: 表现为尽量不要断开单词，收益大于`word-break:break-all`

## 字母，数字并不是每一个字符都会占等宽
为了页面体验，看上去占用一样的宽度。特别是倒计时从0到1的时候，页面会有一个抖动。因为0占的宽度比1要宽。才有这样的情况。所以我们要设置等宽字体Consolas monospace -- 等宽字体

如果网页没有设置默认字体的话，移动端访问网页的时候，若用户使用一些花里胡哨的字体很容易导致整个页面字体布局混乱。

忘记具体问题了，反正就是字体问题。张老师说是因为字体库本身缺少一些字体行高字重等等的一些原因，出现的问题。

字体用的最频繁，但是对他的了解是最少的。于是在网上找了一些文字了解了解


## 参考文章

[你该知道的字体 font-family](https://github.com/chokcoco/iCSS/issues/6):设置元素的字体，可以同时指定多个，如果浏览器不支持第一个字体，则会尝试下一个，可以设置字体或字体系列。

[Web 字体 font-family 再探秘](https://github.com/chokcoco/iCSS/issues/69)

[Web 字体 font-family 浅谈](https://github.com/bailicangdu/blog/issues/5)：和上面那片文章差不多，多了一些具体网站使用的字体及简单点评

[字体，以及 font-family](https://keqingrong.cn/blog/2019-01-01-font-in-css)

[PingFang SC 不应该作为移动端网页字体的首选项](https://pudge1996.medium.com/pingfang-sc-%E6%88%96%E8%AE%B8%E4%B8%8D%E5%BA%94%E8%AF%A5%E4%BD%9C%E4%B8%BA%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E7%9A%84%E9%A6%96%E9%80%89%E9%A1%B9-70cc6d2258fa): 我觉得这篇文章写的很不错，里面谈到了app和web页面来回切换时应该要保持字体一致