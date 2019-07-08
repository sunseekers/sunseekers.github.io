---
layout: post
title: JavaScript 知识点概念
catjavascriptegories: [JavaScript]
description: JavaScript
keywords: JavaScript 
---

# JavaScript 中一些名词或者概念的解释
有些词语知道是什么意思，但是只停留在表面的，并未深入了解或者扩展之后就不知道怎么用了。大部分是自己的理解，或许有不对不全理解不深入的地方。

## 伪数组是怎么定义的
含有 length 属性的 json 对象，它并不具有数组的一些方法，只能能通过Array.prototype.slice转换为真正的数组


```
例如： var obj = {0:'a',1:'b',name:'sunskkers',length:8}; // 伪数组,有length属性，可以用Array.from()转化为一个长度是8的数组

var obj1 = {0:'a',1:'b',name:'sunskkers'}; //伪数组,对象的原型上有length属性，可以用Array.from()转化为一个空数组
```

[第 55 题：某公司 1 到 12 月份的销售额存在一个对象里面，如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/96)
里面不理解为啥要给对象加一个 length 属性，原来是为了转化为一个长度为12的数组

疑问： `Array.from({length:12})` 为啥有人喜欢这样创建一个数组？是有什么优化还是？

## 运算符的优先级
. 的优先级高于 = ；单独的这样一句话，想必大部分人都知道吧，但是放到代码场景中我就不知道了。

```
var a = {n: 1};
var b = a;
a.x = a = {n: 2};

console.log(a.x) 	
console.log(b.x)
```

之前看到过这样的问题，绕了半天，勉强理解了，一段时间之后就忘了。直到看到有朋友解释：".的优先级比=要高，所以这里首先执行a.x，相当于为a（或者b）所指向的{n:1}对象新增了一个属性x，即此时对象将变为{n:1;x:undefined}。之后按正常情况，从右到左进行赋值，此时执行a ={n:2}的时候，a的引用改变，指向了新对象{n：2},而b依然指向的是旧对象"。
我才恍然大悟。原来我的问题在我忽略了 *. 的优先级高于 =*，然后才一直不理解
[原文地址](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/93)
