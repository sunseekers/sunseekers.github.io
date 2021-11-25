---
layout: post
title: 提高用户体验的小细节
categories: [css]
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


## 总结
多尝试，多看张老师的书，或者看看我简陋的文章，欢迎补充