---
layout: post
title: css 实现环形百分比进度
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---

# 背景
接到一个需求，写一个音乐播放器的UI页面，里面有一个功能，播放环形进度。播放暂停的时候进度也暂停了。这个需求刚开始接触时候有点懵逼，就去张老师博客上面找找思路，他博客真的是一个好东西，啥都有，找一找就能找到解决问题的文章，看一看，需求就写出来了，知识点也学到了。文章主要内容参考[第五届CSS大会主题分享之CSS创意与视觉表现](https://www.zhangxinxu.com/wordpress/2019/06/cssconf-css-idea/)

## 需求
![]({{ site.url }}/images/percent.png)

第一次写出来是参考[CSS3实现鸡蛋饼饼图loading等待转转转](https://www.zhangxinxu.com/wordpress/2014/04/css3-pie-loading-waiting-animation/) 大概是14年的文章。根据这个文章效果是实现，但是很不友好，这个转圈的时间是固定的，很难中途给她暂停住。音频暂停住了，播放进度还在继续。所以舍弃这个

后来张老师指导了一下，换了一种很优雅的

[饼图图形与动画](https://www.zhangxinxu.com/study/201903/css-idea/animation-pie.php?aside=0) 仔细看了这个实现方式很nice

### 饼图图形与动画实现原理
1. 通过自定义属性实现，百分比控制显示区域（伪元素可以读取自定义属性数据


2. 正方形视区分左右两个半区，溢出隐藏（画一个圆

3. 进度前50%，主要是右边的旋转和透明，左边的旋转没有作用，左边的旋转只是为了后50%做准备

4. 进度后50%，主要是左边的旋转和透明，左边的旋转没有作用

5. 去掉demo 里面的 pie-left::before 就可以验证这个了

核心代码，看张老师的demo吧，反正这个我是实现不出来，看了demo的代码，也是看了很久，才看明白啥意思，这个实现真的很奇妙

## 继续读张老师的文章，后来发现了更多可学习到的东西

### 动画：打点
这个就是加载中的那种一个点，两个点，三个点的效果。

原理就是一个元素展示三行，第一行一个点，第二行两个点，第三行三个点。然后借助animation移动他们的上下移动点。主要借助伪元素的 content: '...\A..\A.';(\A 是一个换行符)

[CSS content换行实现字符点点点loading效果](https://www.zhangxinxu.com/wordpress/2016/11/css-content-pre-animation-character-loading/)

[张老师的demo](https://www.zhangxinxu.com/study/201611/animation-content-dot-dot-dot-wait.html)

[我自己的demo](https://codepen.io/qingchuang/pen/jOMovWm)

### CSS实现平行四边形布局效果

这也是一个很有意思的东西，虽然可以用transform 实现但是，内容会跟着变化，需要在内容再加一个反转。这个就显得不是那么优雅了

[CSS实现平行四边形布局效果](https://www.zhangxinxu.com/wordpress/2019/04/css-parallelogram-layout/)

这个实现就很完美，很有意思了；让我认识了一个新的，我没用接触过用过的css 属性，没想到，他居然这么好用。


[shape-outside](https://developer.mozilla.org/zh-CN/docs/Web/CSS/shape-outside):实现相邻元素围绕他转，他让相邻元素围绕他显示啥，就显示啥。什么圆呀，椭圆，都可以。文档里面有很不错的一个例子，我搬抄了一下


[shape-outside 的使用](https://codepen.io/qingchuang/pen/MWjdqoV)

这是一个很不错，很有意思的

### CSS创意与视觉表现
[外圆角选项卡](https://www.zhangxinxu.com/study/201903/css-idea/shape-hollow.php?aside=0&kind=3)


相见恨晚，因为在有一次需要开发的时候，有这个，那时候是我做不出来，用很low的方式解决了，还特别不好使，没有很好的还原设计。但是这种方式可以

原理就是，两边加伪元素，然后伪元素定位到旁边，利用层级关系，覆盖旁边的

### 行为：分栏宽度拉伸

实现原理是：CSS中有一个[resize](https://developer.mozilla.org/zh-CN/docs/Web/CSS/resize)属性，如果一个元素的overflow属性值不是visible，则通过设置resize属性可以拉伸这个元素尺寸。（把具有拉伸功能的元素覆盖上去，变成透明的就不可见了

[::-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar) : 可以改变拉伸样式


[纯CSS实现分栏宽度拉伸调整](https://www.zhangxinxu.com/study/201903/css-idea/behavior-stretch.php?aside=0)






