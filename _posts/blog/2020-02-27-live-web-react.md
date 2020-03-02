---
layout: post
title: 我在直播项目里学到的东西
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: web
---

# 第一次接触直播项目
第一次接触直播，也是第一次在工作中用 react 。从懵懵懂懂到懵懵懂懂，在里面还是学到了很多知识。记录

## 项目中学到的知识点

1. 根据条件是否有点击事件？
```
<div onClick={list.some(item => item.handsUp) ? cancelHands : null}>
```

2. 直播使用的是 `RTC` 和 `RTM`，监听到有用户加入/离开，开麦/关麦，举手/取消举手... 都是通过广播的告知其他用户。用户列表是从我们自己的服务拿的，而我们习惯性用的都是数组形式，一般情况是没有问题的，但是有时候使用 `Map` `Set` `List` 代码对于某些情况操作更加简单。

直播中使用场景：
  在大量的数据中修改某一个项的值，如果使用数组的话，要对数组进行遍历寻找，然后在修改。

  在大量的数据中查找某一个项的值，如果使用数组的话，要对数组进行遍历寻找，然后才能获取到值。

  在大量的数据中删除某一个项的值，如果使用数组的话，要对数组进行遍历寻找，然后才能删除。

都是要写循环遍历的，但是使用 `Map` 对象就不需要了， 可以像操作对象一样操作数组，特别是对于对性能要求比较高的在适合不过了。在大型的直播过程中，对于稳定性的要求特别高，数据也是实时变化和渲染的。在渲染的过程如果中间某一个计算耗时稍微比较长，或者说一直在计算，页面就会进入卡顿状态，严重一点的一个计算还没有计算完，下一个又进来了，最后导致内存溢出，页面崩溃。

使用 `immutable` 快速把数组转化为 `Map` 对象。

```
import { List, Set, Map } from 'immutable';
export interface map {
  name: string,
  id: string
}
    const arr = [{
      id: '0',
      name: 'sunseeker',// 名字
    }, {
      id: '70',
      name: 'sunseeker',// 名字
    }, {
      id: '17',
      name: 'sunseeker',// 名字
    }, {
      id: '72',
      name: 'sunseeker',// 名字
    }, {
      id: '73',
      name: 'sunseeker',// 名字
    }]
    const mapList = arr.reduce((acc: Map<string, map>, it: map) => {
      return acc.set(it.id, it);
    }, Map<string, map>())
```

上面的步骤我们完成了数组转化为 `Map` 对象，接下来的操作简单了

查找某一项 `mapList.get('73')`, 找到 `id` 是 73 的那一项

添加某一项 `id` 是 90 的一项 `mapList.set('90' ,{id:'90',name:"sunseekers"})`

是不想操作起来很简单了？我觉得对于大量的数据操作来说是的

[Map 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)


```
Map和object的区别：
* 一个Object的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值，包括函数、对象、基本类型。
* Map 中的键值是有序的，而添加到对象中的键则不是。因此，当对它进行遍历时，Map 对象是按插入的顺序返回键值。

* 你可以通过 size 属性直接获取一个 Map 的键值对个数，而 Object 的键值对个数只能手动计算。
* Map 可直接进行迭代，而 Object 的迭代需要先获取它的键数组，然后再进行迭代。
* Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。
* Map 在涉及频繁增删键值对的场景下会有些性能优势。

get() 方法返回某个 Map 对象中的一个指定元素。
set() 方法为 Map 对象添加或更新一个指定了键（key）和值（value）的（新）键值对
```

如果数据结构是简单的原始类型的值，那么我们可以使用 `Set` 对象，这个比较简单就不多介绍了，[Set 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

[immutable 文档](https://immutable-js.github.io/immutable-js/docs/#/)

第一次在项目中使用 `Map` , `Set` 对数据进行转化操作，原来这么好用，学习到了。

3. `useMemo`
如果我们有 `CPU` 密集型操作，我们可以通过将初始操作的结果存储在缓存中来优化使用。如果操作必然会再次执行，我们将不再麻烦再次使用我们的 `CPU` ，因为相同结果的结果存储在某个地方，我们只是简单地返回结果他通过内存来提升速度
是 `React.useMemo` , 我们这里说的是 `useMemo`，相信关注 `react` 动态的都知道 `useMemo` 是新出来的 `hooks api`，并且这个 `api` 是作用于 `function` 组件，官方文档写的是这个可以优化用以优化每次渲染的耗时工作

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算。如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值，你可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证，有时候数据没有变也会重新渲染数据

[useMemo 文档](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)

4. 直播退出
退出路由的优化

在直播过程中，有各种情况会退出直播间（观众主动退出，主播退出，主播关闭直播间），退出直播间我们一般是返回上级页面。在返回上级页面的时候如果带上退出直播间的类型，对于后期的排查问题，解决用户迷糊会更加清晰，路由类型在那里，这就是事实（`/#/message?__live_${type}`)

这个是我没有想到的在后期看到这段代码的时候，感叹细节处处理的特别好

[监控网页的浏览行为](https://www.cnblogs.com/goloving/p/10216071.html)

5. 学习了 `React Hooks` ，降低了 `React` 入门的门槛

闭包，是 `React Hooks` 的核心 ,现在的前端工程中（`ES6` 的模块语法规范），使用的模块，本质上都是函数或者自执行函数。`webpack` 等打包工具会帮助我们将其打包成为函数

快速分析一个函数的作用，一个思路是看它返回了什么，二个思路是看它改变了什么。

无论是在 `class` 中，还是 `hooks` 中，`state` 的改变，都是异步的。

首先我们要考虑的一个问题是，什么样的变量适合使用 `useState` 去定义？

当然是能够直接影响 `DOM` 的变量，这样我们才会将其称之为状态

我们知道，一个函数执行完毕之后，就会从函数调用栈中被弹出，里面的内存也会被回收。因此，即使在函数内部创建了多个函数，执行完毕之后，这些创建的函数也都会被释放掉。函数式组件的性能是非常快的。相比 `class`，函数更轻量，没有生命周期，也避免了使用高阶组件、`renderProps` 等会造成额外层级的技术。使用合理的情况下，性能几乎不会有什么问题。

钩子函数中，当我们使用 `useMemo/useCallback` 时，由于新增了对于闭包的使用，新增了对于依赖项的比较逻辑，因此，盲目使用它们，甚至可能会让你的组件变得更慢。

自定义 `hooks` 是对普通函数的一次增强。

顺便推荐几篇不错的文章

[超性感的React Hooks（二）再谈闭包](https://mp.weixin.qq.com/s/IMgHzeDXIbxMsVomnqx7AQ)
[超性感的React Hooks（五）：自定义hooks](https://mp.weixin.qq.com/s/L7pJWxX1ghkXkVZQBVguKA)

6. 值得学习的 `RxJS`


## 最后
接到需求之后多思考，先走一步。争取一次性把需求做好，到做的时候有疑问了再问，那时候沟通成本就大了，事后沟通成本往往高于事先成本。很多需求都是第一次做，都是再尝试中学习，多看多写多想，多思考。