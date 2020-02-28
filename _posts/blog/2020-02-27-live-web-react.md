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

都是要写循环遍历的，但是使用 `Map` 对象就不需要了， 可以像操作对象一样操作数组

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


## 最后
接到需求之后多思考，先走一步。争取一次性把需求做好，到做的时候有疑问了再问，那时候沟通成本就大了，事后沟通成本往往高于事先成本。很多需求都是第一次做，都是再尝试中学习，多看多写多想，多思考。