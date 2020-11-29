---
layout: post
title: 在MDN中学到的css属性
categories: [css]
description: 发现，探索 web 优质文章
keywords: css 
---

# 那些我没见过的css属性
在项目中时不时会看到同事用一些我没见过的css属性，说一些我不懂的东西。
感觉他们css好厉害，能解决很多问题，简单的一句css就搞定了。

我就问你们在哪学到看到这些我没见过的属性呢？有什么学习途径吗？

[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) 没事的时候看看这里，哪一个不认识不熟悉的，点击
进去学习就好了。你想知道的都在这里

## 我真的点进去看了
我看到了几个我不认识的，但是有时候被我遗忘了，并没有投入项目中。以后我决定了，我看一个我不认识的，我就记下来，我在
项目中看到我不认识的我也记下来。我也想成为css大佬呀

### css 表达式
[min](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min):两个值里面取最小值

[max](https://developer.mozilla.org/en-US/docs/Web/CSS/max):两个值里面最大的一个值

[clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()):（clamp(MIN, VAL, MAX) 其实就是表示 max(MIN, min(VAL, MAX))）

上面三个支持计算的单位有：长度，角度，时间单位，百分比值，数值


[attr](https://developer.mozilla.org/zh-CN/docs/Web/CSS/attr()):目前content支持，用来获取选择到的元素的某一HTML属性值，并用于其样式

[any-hover](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/any-hover):媒体查询特性

```
@media (any-hover: hover) {// 支持鼠标划过，并不准确
  a:hover {
    background: yellow;
  }
}
@media (any-hover: none) {// 不支持鼠标划过，并不准确
  a:hover {
    background: yellow;
  }
}
```

[CSS any-hover any-pointer media查询与交互体验提升](https://www.zhangxinxu.com/wordpress/2020/01/css-any-hover-media/)


[var()](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var()): css 支持变量

[小tips:了解CSS变量var](https://www.zhangxinxu.com/wordpress/2016/11/css-css3-variables-var/)


## 在博文里学到的属性

[如何让MP4 video视频背景色变成透明？](https://www.zhangxinxu.com/wordpress/2019/05/mp4-video-background-transparent/)

[background-blend-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-blend-mode):背景图片如何混合在一起，有点像ps的混合模式

[mix-blend-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode):和上面一样

