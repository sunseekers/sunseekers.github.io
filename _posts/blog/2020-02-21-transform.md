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

他的主要功能有: `transform:rotate(x)`-旋转, `transform:translate(x,y)` -平移, `transform:scale(x,y)`-缩放, `transform:skew(x,y)`-倾斜

目的是：改变元素的角度，位置，尺寸，形状

## 参考文档

[transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)
[CSS3:transform 与 transition 背后的数学原理](https://www.cnblogs.com/winter-cn/archive/2010/12/29/1919266.html)
