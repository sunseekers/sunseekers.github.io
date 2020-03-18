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

含有 length 属性的 json 对象，它并不具有数组的一些方法，只能能通过 Array.prototype.slice 转换为真正的数组

```
例如： var obj = {0:'a',1:'b',name:'sunskkers',length:8}; // 伪数组,有length属性，可以用Array.from()转化为一个长度是8的数组

var obj1 = {0:'a',1:'b',name:'sunskkers'}; //伪数组,对象的原型上有length属性，可以用Array.from()转化为一个空数组
```

[第 55 题：某公司 1 到 12 月份的销售额存在一个对象里面，如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/96)
里面不理解为啥要给对象加一个 length 属性，原来是为了转化为一个长度为 12 的数组

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

之前看到过这样的问题，绕了半天，勉强理解了，一段时间之后就忘了。直到看到有朋友解释：".的优先级比=要高，所以这里首先执行 a.x，相当于为 a（或者 b）所指向的{n:1}对象新增了一个属性 x，即此时对象将变为{n:1;x:undefined}。之后按正常情况，从右到左进行赋值，此时执行 a ={n:2}的时候，a 的引用改变，指向了新对象{n：2},而 b 依然指向的是旧对象"。
我才恍然大悟。原来我的问题在我忽略了 _. 的优先级高于 =_，然后才一直不理解
[原文地址](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/93)

## [async await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

长得像同步函数的异步函数，返回一个 promise 对象；当调用一个  async  函数时，会返回一个  Promise  对象。当这个  async  函数返回一个值时，Promise  的 resolve 方法会负责传递这个值；当  async  函数抛出异常时，Promise  的 reject 方法也会传递这个异常值。
async  函数中可能会有  await  表达式，这会使  async  函数暂停执行，等待  Promise  的结果出来，然后恢复 async 函数的执行并返回解析值（resolved）。
    注意， await  关键字仅仅在  async function 中有效。如果在  async function 函数体外使用  await ，你只会得到一个语法错误（SyntaxError）

_在没有 await 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。_

[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)

## Array

`Array.from(obj,mapFn,thisArg)` 相当于 `Array.from(obj).map(mapFn,thisArg)`

> `flat()`按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新的数组返回（我理解就是数组扁平化，过滤掉空项）

```
var arr3 = [1, 2, [3, 4, [5, [6,[9,[0]]]]]];
arr3.flat(5);//[1, 2, 3, 4, 5, 6, 9, 0]
```

`reduce` 和 `concat` 结合在一起可以替换

```
var arr1 = [1,2,3,[1,2,3,4, [2,3,4]]];
function flattenDeep(arr1) {
    return arr1.reduce((acc,val)=>{Array.isArray(val)?acc.concat(flattenDeep(val)) : acc.concat(val), []);
}
```

> `flatMap()` 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 和 深度值 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。

var names = ['alice','Bol','tiff','Bruce','alice']
var countedNames = names.reduce((allNames,name)=>{
if(name in allNames){
allNames[name]++
}else{
allNames[name]=1
}
return allNames
},{})

判断类型

```
function isType(type){
    return (obj)=>{
        return Object.prototype.toString.call(obj)===`[object ${type}]`
    }
}
相当于
const isType = type => obj => Object.prototype.toString.call(obj)===`[object ${type}]`
```

`class` 里面的 `static` 静态方法

`static`  关键字用来定义一个类的一个静态方法。调用静态方法不需要实例化该类，但不能通过一个类实例调用静态方法。静态方法通常用于为一个应用程序创建工具函数。

```
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
    }
}

const p1 = new Point(5, 5);
const p2 = new Point(10, 10);

console.log(Point.distance(p1, p2));
```

`p1` 实例上面没有 `distance` 这个方法

一组连续的存储空间，相同数据类型，线性表数据结构（最多只有两个方向，一个向前，一个向后

链表想要随机访问第 k 个元素，就没有数组那么高效了，因为链表中的数据并非连续存储的，不能根据寻址计算出，而是要根据指针一个结点的依次遍历。想象成一个队伍，只知道后面一个人，并不知道前面的人

不管是指针还是引用，都是存储所指对象的内存地址

```

function Person(name, age) {
  this.name = name;
  this.age = age;
  // 构造函数方法，每声明一个实例，都会重新创建一次，属于实例独有
  this.getName = function() {
    return this.name;
  }
}

// 原型方法，仅在原型创建时声明一次，属于所有实例共享
Person.prototype.getAge = function() {
  return this.age;
}

// 工具方法，直接挂载在构造函数名上，仅声明一次，无法直接访问实例内部属性与方法
Person.each = function() {}
```

`if([]||{}||function(){}) // 返回true`

重写原来的方法，只需要在原型写一个重名的函数就可以覆盖

## script 标签

`script` 标签存在两个属性 `defer` 和 `async` ，我们在使用他的时候就分了三种情况

1. `<script src="example.js"></script>`
   没有 `defer` 或 `async` 属性，浏览器会立即加载并执行相应的脚本。也就是说在渲染 `script` 标签之后的文档之前，不等待后续加载的文档元素，读到就开始加载和执行，此举会阻塞后续文档的加载；

2. `<script async src="example.js"></script>`

有了 `async` 属性，表示后续文档的加载和渲染与 `js` 脚本的加载和执行是并行进行的，即异步执行；

3. `<script defer src="example.js"></script>`

有了 `defer` 属性，加载后续文档的过程和 `js` 脚本的加载(此时仅加载不执行)是并行进行的(异步)，`js` 脚本的执行需要等到文档所有元素解析完成之后，`DOMContentLoaded` 事件触发执行之前。
