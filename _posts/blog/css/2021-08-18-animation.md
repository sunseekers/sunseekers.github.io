---
layout: post
title: css 实现烟花效果
categories: [CSS]
description: css 实现烟花效果
keywords: css 实现烟花效果
---

# 背景
前段时间同事遇到一个需求，就是实现烟花效果，一闪一闪的。他问我有什么好的实现方式吗？我想了想gif吧，gif没办法实现背景透明，显然这个方式行不通的。同事说APNG或许还行的通，我想了想还是有点麻烦，我说砍了吧。过了几天我发现同事实现了

## css 实现烟花效果
[css同事实现的效果](https://codepen.io/xboxyan/pen/mdmojmq)，自认为实现非常完美，代码也是通俗易懂，很自然。

## 实现原理：
你在mac上面打开gif，你会发现gif并不是一个动图，而是一帧一帧连在一起的。

![]({{ site.url }}/images/gif.png)

是不是发现了什么？

只要时间间隔合适，把图片一帧一帧的连接起来，就是一个动画，这个烟花效果就是这样实现的。

1. 让设计师出一张烟花分解的长图

2. 通过图片的位移和合适速度，就能实现连在一起了

3. 通过元素通过大小和位移的变化，就实现了大烟花，小烟花，在不同的位置展示


```
.fireworks {
    position: absolute;
    width: 150px;
    height: 150px;
    background: url('https://imgservices-1252317822.image.myqcloud.com/image/081320210201435/e9951400.png') right top no-repeat;
    background-size: auto 150px;
    animation: fireworks 2s steps(24) infinite, random 8s steps(1) infinite;
}
@keyframes fireworks {
    0% {
        background-position: 0%;
    }
    50%,
    100% {
        background-position: 100% 100%;
    }
}

@keyframes random {
    0% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(200%, 50%) scale(0.8);
    }
    50% {
        transform: translate(80%, 80%) scale(1.2);
    }
    75% {
        transform: translate(20%, 60%) scale(0.65);
    }
}
```

代码就是这么简单，看完我同事实现的之后，我说我学到了。

现在和他没有在一个项目组了，我搬到了我的项目组附近，两人交流会越来越少的。但是要继续保持学习新的知识和有意思的东西，我就和他说，以后有一个的东西发一个地方，方便我学习。哈哈，干这行的学习不能停止

## 思考
上面是利用了 background-position 实现的无损gif模拟技巧，那么除了background-position是不是还有类似的方式呢？

有的 object-opsition 他和background-position效果差不多，只不过他常常用在图片上面，这样使用的也算少，但是可以用

[心动的闪闪烁烁](https://demo.cssworld.cn/new/10/1-3.php)

这么说的话，很多类似的属性，都可以实现类似的功能，各有各存在的道理。用css去解决很多js的问题，或者说用css去实现一些技能或者动效的时候，需要我们发散的思维思考。css 真有趣
## 推荐资料
[CSS3 animation属性中的steps功能符深入介绍](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)

[APNG历史、特性简介以及APNG制作演示](https://www.zhangxinxu.com/wordpress/2014/09/apng-history-character-maker-editor/)