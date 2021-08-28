---
layout: post
title: 响应式数据变化和DOM变化
categories: [JavaScript]
description: 发现，探索 web 优质文章
keywords: 正则表达式
---
# 背景
监听DOM的属性变化，不记得是否在项目中用过他了，也不记得是否在哪一个框架里有看到这个属性了，就是想学习了解一下。很偶然的在lulu ui的edge里面看到了，很巧妙。学习一下

## 监听 DOM 的变化 
[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver): 监听哪一部分的 DOM 以及要响应哪些更改

[聊聊JS DOM变化的监听检测与应用](https://www.zhangxinxu.com/wordpress/2019/08/js-dom-mutation-observer/)

[你不知道的 DOM 变动观察器：Mutation observer](https://mp.weixin.qq.com/s/_ovaLe4-THWwfEU3-ZCBfQ)

```
var dialogOpen = new MutationObserver(function(mutationList,observer){
  console.log('[observer]',observer)
  mutationList.forEach(mutation=>{
    console.log('[mutation]',mutation.target);
  })
})
```

mutationList 表示被触发改动的对象数组，observer 表示这个监听的这个对象

```
dialogOpen.observe(dialog,{
  attributes:true, // 设为 true 以观察受监视元素的属性值变更
  attributeFilter:['open','class'] // 要监视的要变化的特定属性名称的数组
})
```
 
其他的暂时不介绍，可以去看看文档[MutationObserverInit](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserverInit)


使用场景： 监听一个元素的都某个属性变化或者达到某一个特定的值的时候，联动其他元素发生变化

## 监听数据的变化
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy): 创建一个对象的代理，返回新的对象，操作新的对象，会劫持数据的改变，数据的改变会同步到原来的数据变化，形成数据的响应式变化

```
const p = new Proxy(target, {
  set: function(target, property, value) {
      // target 目标对象，和监听的变化的对象是一个
      // property 将被设置的属性名或 Symbol。
      // value 新属性值。
  }
});
```

[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty): 也是监听一个对象的变化，他没有返回新的对象，哪一个属性变化就监听哪一个

 乍一看，Proxy 和 Object.defineProperty 差不多，可是到底有哪里不一样呢？
Object.defineProperty 的set方法里面不能直接赋值给需要变化的对象，否则会进入死循环

```
Object.defineProperty(obj, "value", {
    get: function() {
        return value;
    },
    set: function(newValue) {
        value = newValue; // 如果直接obj.value = newValue 就会陷入无限的循环中，所以要借助另外一个变量，这样反而让代码变得更加复杂和麻烦了。而且只能重定义属性的读取（get）和设置（set）行为
        document.getElementById('container').innerHTML = newValue;
    }
});
```

proxy 可以重定义更多的行为，比如 in、delete、函数调用等更多行为 [Proxy() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)

```
var proxy = new Proxy({}, {
    get: function(obj, prop) {
        console.log('设置 get 操作')
        return obj[prop];
    },
    set: function(obj, prop, value) {
        console.log('设置 set 操作')
        obj[prop] = value;
    }
});


proxy.time = 35; // 设置 set 操作

console.log(proxy.time); // 设置 get 操作 // 35

```
不管你监听什么数据的变化，不同的只是handler参数的写法，在 handler 里面进行处理，就不需要单独的一个一个处理了proxy 可以拦截多达 13 种操作，比defineProperty更加丰富多彩

使用 defineProperty 和 proxy 的区别，当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截。

因为 Proxy 本质上是对某个对象的劫持，这样它不仅仅可以监听对象某个属性值的变化，还可以监听对象属性的新增和删除；而 Object.defineProperty 是给对象的某个已存在的属性添加对应的 getter 和 setter，所以它只能监听这个属性值的变化，而不能去监听对象属性的新增和删除。


[ES6 系列之 defineProperty 与 proxy](https://juejin.cn/post/6844903710410162183)

[Proxy 和 Reflect](https://juejin.cn/post/6844904090116292616)