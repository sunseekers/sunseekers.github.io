---
layout: post
title: node 基础
categories: [node]
description: node 的一些基础知识
keywords: node 基础
---

# 关于 `node`

`node` 他没有之前那么火热了，我依旧想去学习，因为前端的很多东西都是基于 `node` 写的。借助 `node` 也可以了解一些关于服务器的东西

## 概念

进程是操作系统分配资源和调度任务的基本单位

进程里面可以放很多线程

在浏览器里面，`ui` 线程和 `js` 线程共用一个线程，为了防止同时操作一个 `dom` 带来的麻烦

`node` 模块加载

异步是有回调函数的，同步是没有回调函数的

在 `node` 中通过 `require` 方法加载其他的模块，这个加载是同步的，动态加载

1. 找到这个文件
2. 读取此文件模块的内容
3. 把它封装在一个函数里立刻执行
4. 执行后把模块的 `module.exports` 对象赋给 `school`

因为模块实现缓存，当第一次加载一个模块之后会缓存这个模块的 `exports` 对象，以后如果再次加载这个模块的话，直接从缓存中取，不需要再次加载了

缓存的 `key` 是，文件的绝对路径，所以多个不同的文件引用一个文件只会引入一次 // `console.log(Object.keys(require.cache))`

`require` 对象里面有哪些属性 // `console.log(require)`

```
resolve,main,extensions,cache

// 想知道模块的路径，但又不想加载这个模块
console.log(require.resolve('./school')

// main 主要的，其实指的就是入口模块
console.log(require.main)

// 在node里模块的类型有三种
   1. js 模块
   2. json模块 先找文件，读取文件内容，JSON.parse 转成对象返回
   3. node C++ 扩展二进制模块
```

在模块内部打印 `console.log(this === module.exports) //true` 说明 `this` 指向当前模块

`node`亲生的模块，内置的模块放在 `node.exe` 里，他的加载速度是最快的，因为不用东奔西跑，自己身上取就可以了

文件模块，分为三种 `js`，`json`，`node`，存放和加载位置又分为两种，第一种自己写的，要通过相对路径或绝对路径加载，第二种，别人写的，通过名字调用，
回去 `node_modules` 里面找

如何把任意进制转成十进制 `parseInt("ox10",16)`
如何把十进制转成任意进制

异步函数没有返回值，但是有回调函数

在 `linux` 输入和输出都对应一个文件描述符，他是一个数字，0 标准输入，1 标准输出，2，错误输出

当我们调用 `write` 方法写入文件的时候，并不会直接写入物理文件，而是会先写入缓存区，在批量写入物理文件

`fs.stat()` 获取文件的详细信息，是一个异步回调函数

`fs.rename()` 在原来的基础上重命名文件，很少用

`truncate` 截断文件

`path.delimiter` 环境变量路径分割符

`path.sep` 文件路径分割符

`path.relative` 获取两个路径之间的相对路径

`path.basename` 获取的是文件名，第二个参数可以让他只截取文件名

`path.extname` 获取的是文件扩展名

`IP` 地址是有层次的，可以查看到具体位置的

缓存的作用：
减少冗余的数据传输，节省网费，减少服务器的负担，大大提高网站的性能，加快客户端加载网页的速度

流有两种模式，一种是二进制，一种是对象模式
