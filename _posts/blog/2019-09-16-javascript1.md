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
x s
> 3. `javascript` 具有高度动态性
>    在 `javascript` 中对象独有的特色是：对象具有高度的动态性，这是因为 `JavaScript` 赋予了使用者在运行时为对象添加状态和行为的能力

对 `javascript` 对象来说，属性并非只有简单的名称和值，`JavaScript` 用一组特征来描述属性，数据属性，`value`，`writable`，`enumerable`，`configurable` 访问器属性 `getter`，`setter`，`enumber`，`configurable`。定义属性的时候产生数据属性，代码执行的时候（访问器属性使得属性在读写时执行代码，视为函数的语法糖）（每一次访问属性都会执行 `getter` 和 `setter` 函数）。

对象是一个属性的索引结构（可以以比较快速用 `key` 来查找 `value` 的字典）

`Javascript` 原型系统的复制操作实现思路： 一个并不真的去复制一个原型对象，而是使的新对象持有一个原型的引用


## 执行上下文

以前我不懂，也不在乎什么是执行上下文，好像并没有什么用，现在我发现我错了。看到一句话 “只有理解了 `javaScript` 的执行上下文，才能更好的理解 `javaScript` 语言本身，比如变量提升，作用域，闭包”，关于这些概念不去仔细解释

实际上变量和函数声明在代码里的位置是不会改变的，而是在编译阶段被 `javaScript` 引擎放入内存中

简单说一段 `javaScript` 代码可以被分为编译阶段和执行阶段；在编译阶段又可以分为变量提升部分代码（执行上下文）和执行部分代码

![](../../images/blog/3.png)

执行上下文是 `javaScript` 执行一段代码时的环境，在执行上下文本中存在一个变量环境的对象（保存变量提升的内容），完了之后`javaScript` 引擎开始执行可执行代码，一行一行的执行，执行的过程中先在变量环境中查找，找到就输出，找不到就输出 `undefined` 或者报错

所以说 `javaScript` 代码在执行前需要先编译，在编译阶段会出现变量提升

注意了： 函数内部通过 `var` 声明的变量，在编译阶段都被放到了变量环境里面了
        通过 `let` 声明的变量，在编译阶段会被存放到词法环境中
        在函数的作用域内部，通过 `let` 声明的变量并没有放到词法环境中