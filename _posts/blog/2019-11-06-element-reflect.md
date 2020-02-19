---
layout: post
title: Reflect 对象
categories: [Reflect]
description: Reflect 对象
keywords: Reflect 对象
---

# Reflect 是什么
很在之前看到过这个东西，大脑自动过滤掉了。半个月之前据说 vue 3.0 用到了这个属性，然后仔细看了看文档，替换了很多之前用 object 的方法。未来是否会大面积的取代，不知道

## Reflect 怎么用
他并不是一个函数对象，因此不可构造。[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 结合 [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/reflect) 大概就知道这是做什么的。有什么用了

一圈看下来，大部分操作都是和对象的方法差不多，好像都在哪见过

```
Reflect.get()
Reflect.set()
Reflect.has()
Reflect.deleteProperty()
```
相当于原来对象的方法的 `get set in delect` 方法，相对比之前更加像函数，灵活性也得到了扩充

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

