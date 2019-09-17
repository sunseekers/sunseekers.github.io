---
layout: post
title: javaScript 基础
categories: [javaScript]
description: javaScript 基础
keywords: web
---

# 每一次看 `javaScript` 都发现有了新的收获

是之前拉下的知识点？是压根就没有看过的？还是知道但是在业务开发的过程中总是忽视忘记了？都有原因吧

## 哪些我所忽视的 `javaScript` 基础

> 1. 使用"==="替换"==" ，避免隐式转化带来的不必要麻烦，（我以前知道，但是懒得写，以后要这样写了）

每一种基本类型 `Number`，`String`，`Boolean`，`Symbol` 在对象中都有对应的类，所谓的装箱转换就是把基本类型转换为对应的对象类型
一些对性能要求较高的场景下，我们应该尽量避免对基本类型做装箱操作，耗时。非十进制的数字和字符串转换也会有各种问题

拆箱转换
在 `JavaScript` 标准中，规定了 `toPrimitive` 函数，他是对象类型到基本类型的转换（拆箱转换）
拆箱转换会尝试调用 `valueof` 和 `toString` 来获得拆箱后的基本类型，如果``valueOf`和`toString` 都不存在或者没有返回基本类型，就会产生类型错误

```
var o = {
    valueOf:()=>{console.log("valueof");return {}},
    toString:()=>{console.log("toString");return {}}

}
o*2
// valueof
// toString
//Uncaught TypeError: Cannot convert object to primitive value
    at <anonymous>:6:2

String(0)
// toString
// valueof
//Uncaught TypeError: Cannot convert object to primitive value
    at <anonymous>:6:2
```

> 2. 在 `JavaScript` 中，没有任何方法可以更改私有的`class` 属性，因此 `Object.prototype.toString()`是可以准确识别对象对应的基本类型的方法，比 `instanceof` 更加准确

> 3. `javascript` 具有高度动态性
>    在 `javascript` 中对象独有的特色是：对象具有高度的动态性，这是因为 `JavaScript` 赋予了使用者在运行时为对象添加状态和行为的能力

对 `javascript` 对象来说，属性并非只有简单的名称和值，`JavaScript` 用一组特征来描述属性，数据属性，`value`，`writable`，`enumerable`，`configurable` 访问器属性 `getter`，`setter`，`enumber`，`configurable`。定义属性的时候产生数据属性，代码执行的时候（访问器属性使得属性在读写时执行代码，视为函数的语法糖）（每一次访问属性都会执行 `getter` 和 `setter` 函数）。

对象是一个属性的索引结构（可以以比较快速用 `key` 来查找 `value` 的字典）

`Javascript` 原型系统的复制操作实现思路： 一个并不真的去复制一个原型对象，而是使的新对象持有一个原型的引用
