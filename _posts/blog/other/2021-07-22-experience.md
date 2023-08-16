---
layout: post
title: 提高用户体验的小细节
categories: [CSS]
description: 提高用户体验的小细节
keywords: 提高用户体验的小细节
---

# 背景
在做一个项目的时候，和团队的小伙伴做了一些了提高用户体验的探索，觉得非常不错

## 提高体验的操作
1. 解决白屏，实现成本低，自动识别是否有内容

```  
 #app:empty {
 height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 background: #f0f0f0;
 }

 #app:empty::before {
 content: '精彩内容即将呈现...';
 color: silver;
 font-size: 14px;
 text-shadow: 1px 1px #fff;
 }
 ```

原理： empty 自动识别是否有内容

2. 点击有反馈通用代码，约定连接跳转用a标签，其余情况用button

```
button:active,
a[href]:active,
input[type='radio']:active,
input[type='checkbox']:active {
 background-image: linear-gradient(to top, rgba(0, 0, 0, .05), rgba(0, 0, 0, .05));
}
```

原理： 点击伪类添加背景图片

点击父元素有点击区域反馈，但是点击父元素里面的某一个子元素没有点击反馈。子元素用有focus的元素，然后父元素上面加.active
```
.active:active:not(:focus) {
  background-image: none;
}
```
3. 如果button用的是图片 background-image 设置了一个背景，那么点击有反馈用上面的代码就会有问题，这种特殊情况用新的实现方式：box-shadow 设置点击时候的反馈区域

```
.search-delete-icon:active {
 box-shadow: inset 0 0 0 999px rgb(0 0 0 / 5%);
}
```


4. 扩大点击区域，但是用户无感

```
 border: 6px transparent solid;
 background-clip: padding-box;
```

原理： 背景切割

5. 原有布局上下或者左右边距不一样，如何扩大点击区域&&点击区域规则
可以用position:relative,进行稍微的调整，把位置移动到中心区域或者使用margin-right:-xxpx+padding-right: xxpx

某些情况下面使用margin-right:-xxpx，可以让右侧的空间充分利用

原理：位置互相抵，最后位置没有变化

6. loading 加载时间短不显示，一旦显示就显示200毫秒

```
 let promiseInfo = service(params);
 Promise.race([promiseInfo, timeout(200)]).then((display) => {
 if (!display) {
 showToast();
 Promise.all([promiseInfo, timeout(200)]).then((data) => {
 resolve(data[0])
 hideToast();
 });
 } else {
 resolve(display)
 }
 });
 ```

原理：对比两个请求谁先到，判断是否展示loading，如果定时器快，就展示loading，并且保证至少会有200ms

7. toast 加载时间长，由加载中文案变成仍在努力加载中文案实现

```
let showToast = function () {
 time = +new Date()
 toast.loading('加载中')
 timer && clearTimeout(timer);
 timer = setTimeout(() => {
 if (toast.isloading) {
 toast.loading('仍在努力加载中...')
 }
 }, 3000)
 console.log('show loading...');
}
```

原理：根据不同的时间显示不一样的文案

8. 选择状态的时候，添加突然加边框会抖动

没有选中也加一个透明的，切换的时候只是改变颜色而不是突然新加

9. 点击父元素有点击区域反馈，但是点击父元素里面的某一个子元素没有点击反馈。

子元素用有focus的元素，然后父元素上面加.active

```
.active:active:not(:focus) {
  background-image: none;
}
```

灵活变通，可以在父组件干活也可以在父的兄弟组件干活，有些情况可以加div或者减少div，解决某些问题


10. 审视到底哪些效果应该跟着字体一起放大，而哪些效果是保持不变的，影响到的用em单位，你的媒体查询中使用em单位取代像素单位。这能让文本缩放在必要时触发布局的变化

11. 颜色需要变化的使用继承或者currentColor,像border-color和outline-color，以及text-shadow和box-shadow，如果没有设置颜色，它就会自动地从文本颜色那里得到颜色

12. inherit可以用在任何CSS属性中，而且它总是绑定到父元素的计算值（对伪元素来说，则会取生成该伪元素的宿主元素，这个inherit关键字对于背景色同样非常有用它比currentColor 使用的范围更广

13. 代码中尽量不要有一行多余的css，width:100% or height:100%,这样写很多时候反而限制住了width，让他失去了流的特性

14. 尽可能的使用关键字，减少代码重复，语义化强的写法，为了灵活扩展 `color: #f4f0ea; border: 1px solid currentColor;border-left-color: inherit;`

15. 页面用到了 img 元素的时候要做懒加载和图片错误异常处理

```
img.error {
  display: inline-block;
  content: '暂无图片';
  color: transparent;
}

img.error::before {
  content: '暂无图片';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: inherit;
  border-radius: calc(8rem / 16);
  background: #f5f5f5 url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z' fill='%23e6e6e6'/%3E%3Cpath d='M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z' fill='%23e6e6e6'/%3E%3C/svg%3E") no-repeat center / 50% 50%;
}
```

页面中有不少 `<img src="?.jpg">` 元素，由于网络等原因，这些图片可能加载失败。
请实现，如果图片加载失败，点击这些图片触发图片重载，如果图片加载正常，不做任何处理。

```
img.addEventListener('click', function(){
  this.decode().catch(err => {
    this.src= this.src + '?t='+Date.now()
  })
})

生产环境使用的代码

document.addEventListener('click', function (event) {
  var ele = event.target;
  if (ele.nodeName == 'IMG' && !ele.naturalWidth) {
    ele.src = ele.src;
  }
});
```

16. 3D环绕使用，当文字要穿过图片的时候

父元素使用 transform-style: preserve-3d;
子元素使用 transform: rotateY(-1deg); 

## PC端
1. 如果是可操作的，鼠标移动上去要有反馈，通常添加:hover{}

2. 表单元素，键盘回车的时候能够提交表单通常`<button type="submit" hidden></button>` 有输入框的情况，清除按钮清除内容后，输入框要聚焦

3. 访问过的链接，根据具体的需求，可以加:visited

## 代码易维护和代码量少不可兼得

使用百分比长度来取代固定长度。如果实在做不到这一点，也应该尝试使用与视口相关的单位（vw、vh、vmin和vmax），它们的值解析为视口宽度或高度的百分比

当你需要在较大分辨率下得到固定宽度时，使用max-width而不是width，因为它可以适应较小的分辨率，而无需使用媒体查询。

不要忘记为替换元素（比如img、object、video、iframe等）设置一个max-width，值为100%。

实现弹性可伸缩的布局，并在媒体查询的各个断点区间内指定相应的尺寸

这些原生特性通常比预处理器提供的版本要强大得多，因为它们是动态的，举个例子，预处理器完全不知道如何完成100% - 50px这样的计算，因为在页面真正被渲染之前，百分比值是无法解析的。但是，原生CSS的calc()在计算这样的表达式时没有任何压力

var 变量也可以经常使用。

```
ul{--accent-color:purple}
ol{--accent-color:rebeccapurple}
li{background:var(--accent-color)}
```

在有序列表中，列表项的背景色将是rebeccapurple；但在无序列表中，列表项的背景色将是purple

如果一个样式需要两层div混合在一起，那么就会出现一个问题，结构和表现混合在一个，如果可以的话，尽量分开实现一个div就能满足样式的需求

[例如 demo](https://codepen.io/qingchuang/pen/ZEBgjxa)

[伪元素的使用](https://codepen.io/qingchuang/pen/bGBXxNW)


## 实现指定功能
1. 背景无缝平滑效果 利用 `animation-timing-function` 让其一直重复运动，=>原理:重复运动
[在线demo](https://codepen.io/qingchuang/pen/bGwggLg)


2. 延轨迹平滑效果=>原理是，前后运动的时间差
[在线demo](https://codepen.io/qingchuang/pen/oNzBBpR)

3. 评分组件=>原理是：鼠标移动上去可以判断其鼠标的位置
[原生评分预览](https://codepen.io/qingchuang/pen/dypNyLP)

4. 梯形tab=>原理是：平行四边形和正方形叠加

[在线demo](https://codepen.io/qingchuang/pen/yLaVoVw)

## 优秀文章推荐
<a href="https://www.zhangxinxu.com/wordpress/2018/07/why-dialog-panel-need-close-button/">实力科普：为什么浮层或弹框一定要有叉叉关闭按钮？</a>

<a href="https://www.zhangxinxu.com/wordpress/2016/11/css-unicode-range-character-font-face/">CSS unicode-range特定字符使用font-face自定义字体</a>
## 总结
多尝试，多看张老师的书，或者看看我简陋的文章，欢迎补充