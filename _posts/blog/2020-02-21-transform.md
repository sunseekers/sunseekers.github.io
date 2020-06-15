---
layout: post
title: transform
categories: [功能实现]
description: transform
keywords: transform
---

# transform 实现

transform 的原理是计算机图形学中 2D/3D 矩阵变换。他不是一个动画，他就是变形。我们的任何一个 html 元素渲染完成后可以得到一张位图，把这张位图上所有的点都做一次矩阵运算，将得到一张的新的位图，这就是 transform 的基本含义。（这是通过修改 CSS 视觉格式化模型的坐标空间来实现的）

## `transform` 元素

属性允许你旋转，缩放，倾斜或平移给定元素。这是通过修改CSS视觉格式化模型的坐标空间来实现的。

他的主要功能有: `transform:rotate(x)`-旋转, `transform:translate(x,y)` -平移, `transform:scale(x,y)`-缩放, `transform:skew(x,y)`-倾斜

目的是：改变元素的角度，位置，尺寸，形状（非动画）

只能转换由盒模型定位的元素。根据经验，如果元素具有display: block，则由盒模型定位元素。

## 参考文档

[transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
[CSS3:transform 与 transition 背后的数学原理](https://www.cnblogs.com/winter-cn/archive/2010/12/29/1919266.html)


## animation
作用于元素本身而不是样式属性,属于关键帧动画的范畴，它本身被用来替代一些纯粹表现的javascript代码而实现动画,可以通过keyframe显式控制当前帧的属性值

animation 属性是 animation-name，animation-duration, animation-timing-function，animation-delay，animation-iteration-count，animation-direction，animation-fill-mode 和 animation-play-state 属性的一个简写属性形式。

[animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

