---
layout: post
title: 命令行工具
categories: [功能实现]
description: node
keywords: node
---

# node 手写一个简单的命令行工具

简单的创建命令行工具 => 创建一个静态服务器 => 命令行工具启动项目

## node 写一个简单的命令行

`npm run serve` ,`npm install` 都是命令行，问题来了，我们自己如何实现一个命令行呢？借用 `node` 来实现其实很简单。写一个简单的，首先我们需要了解一下 [`Linux chmod`](https://www.runoob.com/linux/linux-comm-chmod.html) 他是系统调用文件的权限，先建一个文件不要指定他的后缀名，比如 `sunseekers`，在文件里面输入下面的内容(后面所有的 `sunseekers` 指的是这个文件的名字)

```
#! /usr/bin/env node

let yargs = require('yargs')// 这个是命令行解析工具

let argv = yargs.option('n', {
  alias: "name",
  demand: true, // 必填
  default: 'sunseekers',
  description: "请输入你的名字"
}).argv
console.log('hello sunseekers');
console.log('yargs 命令行工具接受到的参数',yargs.argv);

```

文件建好了之后，给这个文件一个权限执行命令 `chmod 755 sunseekers`

继续在当前目录创建一个 `package.json` 文件，目的是为了 `sunseekers` 的路径添加到环境变量去，以便后续可以直接使用变量
在 `package.json` 添加以下内容

```
{
    name:'hello',
    "bin":{
        "sunseekers":"sunseekers" //  { "命令行": "文件路径"}
    }
}
```

然后执行命令 `npm link`

这样我们的命令就构建好了，我们在终端输入 `sunseekers` ，就执行了 `node sunseekers`

[Node 进阶 ---- yargs](https://www.jianshu.com/p/7851001dd93b)

## node 创建静态服务器

这个代码太多了，就直接贴链接吧

[第一版代码地址](https://github.com/sunseekers/node/commit/c5c2f0aedbf1b110ec7bf6406fb92b20ce59e2d6)

在此利用可读流我们创建了一个简单静态服务器，我们在进一步优化代码，根据浏览器支持的压缩方式进行压缩，利用缓存缓存数据

[静态服务器的搭建](https://github.com/sunseekers/node/commit/ffeb837b5865fdb6c136f1611d952d51d4a5a4a4)

一个指定目录的静态服务器我们写好了，接下来我们要构建一个命令行工具，通过命令传参的方式，可以指定任何一个文件的任何一个目录
