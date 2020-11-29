---
layout: post
title: transform
categories: [功能实现]
description: transform
keywords: transform
---

# transform 实现

transform 的原理是计算机图形学中 2D/3D 矩阵变换。他不是一个动画，他就是变形。我们的任何一个 html 元素渲染完成后可以得到一张位图，把这张位图上所有的点都做一次矩阵运算，将得到一张的新的位图，这就是 transform 的基本含义。（这是通过修改 CSS 视觉格式化模型的坐标空间来实现的）

transform=>变形
transition=>过渡
animation=>动画

## `transform` 元素

属性允许你旋转，缩放，倾斜或平移给定元素。这是通过修改CSS视觉格式化模型的坐标空间来实现的。

他的主要功能有: `transform:rotate(x)`-旋转, `transform:translate(x,y)` -平移, `transform:scale(x,y)`-缩放, `transform:skew(x,y)`-倾斜

目的是：改变元素的角度，位置，尺寸，形状（非动画）

只能转换由盒模型定位的元素。根据经验，如果元素具有display: block，则由盒模型定位元素。

transform提升元素的垂直地位

transform限制position:fixed的跟随效果，他们在一起表现就像是position：absolute

transform改变overflow对absolute元素的限制,如果父元素设置了overflow：hidden，子元素absolute，超出不会被隐藏。但是如果此时父元素再有trandform的画，子元素会被隐藏

以前，我们设置absolute元素宽度100%, 则都会参照第一个非static值的position祖先元素计算，没有就window. 现在，诸位，如果父元素是transform，所有绝对定位图片100%宽度，都是相对设置了transform的容器计算了

[CSS3 transform对普通元素的N多渲染影响](https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/)

## 参考文档

[transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

[CSS3:transform 与 transition 背后的数学原理](https://www.cnblogs.com/winter-cn/archive/2010/12/29/1919266.html)

[CSS3 Transitions, Transforms和Animation使用简介与应用展示](https://www.zhangxinxu.com/wordpress/2010/11/css3-transitions-transforms-animation-introduction/)

[好吧，CSS3 3D transform变换，不过如此！](https://www.zhangxinxu.com/wordpress/2012/09/css3-3d-transform-perspective-animate-transition/)

## animation
作用于元素本身而不是样式属性,属于关键帧动画的范畴，它本身被用来替代一些纯粹表现的javascript代码而实现动画,可以通过keyframe显式控制当前帧的属性值

animation 属性是 animation-name，animation-duration, animation-timing-function，animation-delay，animation-iteration-count，animation-direction，animation-fill-mode 和 animation-play-state 属性的一个简写属性形式。

[animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

## 点击涟漪效果
你是否又看到过，点击按钮的时候有一个白色圆圈在扩大，有种东西丢到水里涟漪的效果

我们就可以用他实现 transform 实现

实现思路：

1. 给点击的元素加一个伪元素，把它覆盖在点击元素上面

```
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
```

2. 最开始的时候这个元素完全透明，并且有一个很小的背景径向渐变，借助 transition 让元素慢慢的变大（背景的径向渐变也变大），慢慢的变透明

```
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .3s, opacity .5s;
```

3. 点击元素的，给他加一个:active类，点完了，这个类就消失了。在这个类里面，把之前透明的元素，透明度提高，元素变小到最开始的位置

```
  :active:after {
  transform: scale(0, 0);
  opacity: .3;
  /* //设置初始状态 */
  transition: 0s;
  }
```

4. 点击的时候元素由0开始的大小慢慢的变大，透明度由.3慢慢的变透明

5. 可以改变top和left的位置，实现已点击的位置为原点开始发生变化（不实现，要借助js）

```
<button class=" ripple ">Button</button>
.ripple {
      width: 100px;
      height: 100px;
      position: relative;
      overflow: hidden;
    }

    .ripple:after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      /* //设置径向渐变 */
      background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform .3s, opacity .5s;
    }

    .ripple:active:after {
      transform: scale(0, 0);
      opacity: .3;
      /* //设置初始状态 */
      transition: 0s;
    }
```