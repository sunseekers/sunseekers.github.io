---
layout: post
title: 渐变文字
categories: [CSS]
description: 渐变文字
keywords: 渐变文字
---

# 背景
最近在张老师写的css新世界，内容写的很不错，推荐大家看一下。今天我看到了一个关于渐变文字小结，恰巧前段时间看同事在项目中实现了这个效果，当时就很好奇，但是当时在忙别的事，也就没有看了，今天看到了正好总结记录一下

## 渐变文字实现方案一:background-clip: text;
[background-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip): 设置背景是否延伸到盒子区域，他还有一个特殊的值，background-clip：text；背景被裁剪成文字的前景色，即实现文字渐变的方案

```
.content{
background:linear-gradient(60deg, red, yellow, red, yellow, red);
background-clip: text;
-webkit-background-clip:text;
width: 100px;
color: transparent;
}
  <div class="content">渐变文字</div>
```

这里注意了要设置文字的颜色为透明，否则会失效的。

简单的效果就实现了，如果设计师说想要这个文字的颜色有一个动画，比如说那种一闪一闪的或者流动，但是文字不能动。

我思考了一会，就现在这种实现方式好像是有点麻烦的，animation 不支持我们指定某一个属性进行动画，而且这里的文字颜色和背景是紧紧结合在一起的。暂时我想不到一个好的实现方式，等我想到了，或者有朋友和我说了，我再来更新

总的来说，实现静态效果没有任何问题，但是要实现动效就有点难了，因为background-cli 实现的本质是背景图填充文字

## 渐变文字实现方案二: mix-blend-mode:lighten
这也就是我在张老师的书里面看到的一种实现方式，利用的原理是文字和背景的一种混合。mix-blend-mode:lighten 混合的效果是变亮，只要设置文字为黑色，然后在文字上覆盖一层颜色，设置混合模式mix-blend-mode:lighten，因为任何颜色和黑色进行变亮之后都会保留当前的颜色。从而实现了文字渐变的效果

```
.content1{
  margin-top:40px;
  width: 100px;
  position: relative;
  font-size: 3rem;
  color: black;
  font-weight: bold;
  background-color: #fff;
  
}
.content1::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(to right, deepskyblue, deeppink);
    mix-blend-mode: lighten;
}
  <div class="content1">渐变文字</div>
```

[张老师的demo](https://demo.cssworld.cn/new/11/3-5.php)

到这里呢，我们就实现了文字渐变的效果了。如果你想要加动效也很简单了，就是伪元素上面加上就是了，具体的可以看张老师的代码。

这里要注意了，一定要设置父元素为白色，否者实现不了这个效果的，我当时没有设置，弄了好长一段时间才弄好。

## 总结
又学到了新的东西，开心，因为自己的博客，只是写给自己看的，记录自己的学习成长。也是一直以来想要坚持做的一件事，所以文字排版是的，就自己通俗易懂了。曾今有一段时间因为讨论内卷这个词，弄的自己心情比较沉重，还有些别的事。最终觉得做自己，做开心的自己，不管别的了。