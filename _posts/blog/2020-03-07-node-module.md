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

`node` 内部是靠 `C++` 实现的，`js` 只是一层包装，内部都是调用 `C++` 的 `api`,因为 `js` 是没有办法去调用系统内部的方法和系统进行交互的

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

```
let fs = require('fs');
let path = require('path');
let b = req('./b.js');
function req(mod) {
    let filename = path.join(__dirname, mod); // 找到这个文件
    let content = fs.readFileSync(filename, 'utf8'); //读取此文件模块的内容
    let fn = new Function('exports', 'require', 'module', '__filename', '__dirname', content + '\n return module.exports;');
    let module = {
        exports: {}
    };

    return fn(module.exports, req, module, __filename, __dirname); //把它封装在一个函数里立刻执行,这里不明白
}


```

因为模块实现缓存，当第一次加载一个模块之后会缓存这个模块的 `exports` 对象，以后如果再次加载这个模块的话，直接从缓存中取，不需要再次加载了

缓存的 `key` 是，文件的绝对路径，所以多个不同的文件引用一个文件只会引入一次，多个文件可以公用一份 // `console.log(Object.keys(require.cache))`

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

## es5 的 `module` 和 `exports`

`module` 和 `exports` 是 `Node.js` 给每个 `js` 文件内置的两个对象

可以通过 `console.log(module)` 和 `console.log(exports)` 打印出来

`module.exports` 和 `exports` 一开始都是一个空对象`{}`，实际上，这两个对象指向同一块内存。这也就是说 `module.exports` 和 `exports` 是等价的（有个前提：不去改变它们指向的内存地址）

`require` 引入的对象本质上是 `module.exports`。这就产生了一个问题，当 `module.exports` 和`exports` 指向的不是同一块内存时，`exports` 的内容就会失效

## es6 的 `export` 和 `export default` 的区别

`export` 相当于把对象添加到 `module` 的 `exports` 中。
`export default` 相当于把对象添加到 `module` 的 `exports` 中，并且对象的 `key` 叫`default`。大部分采用 `import` 引入

## `require` 和 `import` 的区别

1. `CommonJS` 模块输出的是一个值的拷贝，`import` 模块输出的是值的引用

    CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

2. `CommonJS` 模块是运行时加载，ES6 模块是编译时输出接口。

运行时加载: `CommonJS` 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。


编译时加载: `ES6` 模块不是对象，而是通过 `export` 命令显式指定输出的代码，`import` 时采用静态命令的形式。即在 `import` 时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。


`import`是 `es6` 的一个语法标准,是编译时调用，所以必须放在文件开头，异步加载

所以我们在写异步加载路由/组件的时候基本都会用到  `import`

比如：` SearchBox: () => import('@/components/SearchBox')`

[前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.im/post/5aaa37c8f265da23945f365c#comment)
