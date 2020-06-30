---
layout: post
title: JavaScript 零碎知识点
catjavascriptegories: [JavaScript]
description: JavaScript
keywords: JavaScript
---

# JavaScript 基础知识

记录一些我不熟悉的 JavaScript 概念，帮助后面整理前端知识技能图谱


## 伪数组是怎么定义的

含有 length 属性的对象(但是有一个问题，这种length属性不是动态值，不会随着成员的变化而变化。)，这个对象就很像数组，语法上称为“类似数组的对象”（array-like object）它并不具有数组的一些方法，只能能通过 Array.prototype.slice 转换为真正的数组


例如： var obj = {0:'a',1:'b',name:'sunskkers',length:8}; // 伪数组,有length属性，可以用Array.from()转化为一个长度是8的数组

[第 55 题：某公司 1 到 12 月份的销售额存在一个对象里面，如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/96)

 `Array.from({length:12},(it,index)=>obj[index+1]||null)` 

Array.from() 方法有一个可选参数 mapFn，让你可以在最后生成的数组上再执行一次 map 方法后再返回。也就是说 Array.from(obj, mapFn, thisArg) 就相当于 Array.from(obj).map(mapFn, thisArg), 除非创建的不是可用的中间数组。 

[Array.from()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

Javascript 中所有的数字，无论整数还是小数，均为 Number 类型（实质是一个64位的浮点数

\u 约定是用来指定数字字符编码

return break 关键字表达式标签之间是不允许换行的，换行之后不会被解析
## 运算符的优先级
越在上面的优先级越高

. [] () => 提取属性与函数调用

delete new typeof  ！=> 一元运算符

* / % => 乘 除 取模

+ - => 
>= <= > < => 不等式运算

=== !== => 等式运算

&&

|| => 在es6 里面可以用于默认填充

?:

. 的优先级高于 = ，举个例子

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

## 装箱/拆箱操作
. 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法，所以我们在基础类型上面也能操作调用类的方法

a.x 或者 a['x']中“.”和“[]”操作符是专门获取引用类型属性的值操作。然而在 JS 中基本类型变量也是可以使用“点”的，这给初学者造成一定困惑，比如

var a = 1;
a.x = 2;
console.log(a);// 1
console.log(a.x);// undefined
其实，上述代码运行过程中发生了所谓的“装箱操作”

一些对性能要求较高的场景下，我们应该尽量避免对基本类型做装箱操作，耗时。非十进制的数字和字符串转换也会有各种问题

拆箱转换

在 `JavaScript` 标准中，规定了 `toPrimitive` 函数，他是对象类型到基本类型的转换（拆箱转换）

拆箱转换会尝试调用 `valueof` 和 `toString` 来获得拆箱后的基本类型，如果`valueOf`和`toString` 都不存在或者没有返回基本类型，就会产生类型错误

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


String(o)
// toString
// valueof
//Uncaught TypeError: Cannot convert object to primitive value
    at <anonymous>:6:2
```

在有运算操作符的情况下，valueOf 的优先级高于 toString,一般情况下对象的使用都是优先调用 toString 方法

```
let e2 = {
        n : 2,
        toString : function (){
            console.log('this is toString')
            return this.n
        },
        valueOf : function(){
            console.log('this is valueOf')
            return this.n*2
        }
    }
    alert(e2) //  2  this is toString
    alert(+e2) // 4 this is valueOf
```

## script 标签

`script` 标签存在两个属性 `defer` 和 `async` ，都是不堵塞后续文档的执行，我们在使用他的时候就分了三种情况

1. `<script src="example.js"></script>`
   没有 `defer` 或 `async` 属性，浏览器会立即加载并执行相应的脚本。也就是说在渲染 `script` 标签之后的文档之前，不等待后续加载的文档元素，读到就开始加载和执行，此举会阻塞后续文档的加载；

2. `<script async src="example.js"></script>`

有了 `async` 属性，表示后续文档的加载和渲染与 `js` 脚本的加载和执行是并行进行的，即异步执行；

3. `<script defer src="example.js"></script>`

有了 `defer` 属性，加载后续文档的过程和 `js` 脚本的加载(此时仅加载不执行)是并行进行的(异步)，`js` 脚本的执行需要等到文档所有元素解析完成之后，`DOMContentLoaded` 事件触发执行之前。
## 执行上下文

实际上变量和函数声明在代码里的位置是不会改变的，而是在编译阶段被 `javaScript` 引擎放入内存中

简单说一段 `javaScript` 代码可以被分为编译阶段和执行阶段；在编译阶段又可以分为变量提升部分代码（执行上下文）和执行部分代码

![](../../images/blog/3.png)

执行上下文是 `javaScript` 执行一段代码时的环境，在执行上下文本中存在一个变量环境的对象（保存变量提升的内容），完了之后`javaScript` 引擎开始执行可执行代码，一行一行的执行，执行的过程中先在变量环境中查找，找到就输出，找不到就输出 `undefined` 或者报错

所以说 `javaScript` 代码在执行前需要先编译，在编译阶段会出现变量提升

注意了： 函数内部通过 `var` 声明的变量，在编译阶段都被放到了变量环境里面了
通过 `let` 声明的变量，在编译阶段会被存放到词法环境中
在函数的作用域内部，通过 `let` 声明的变量会被存放到词法环境的一个单独区域中，这个区域中的变量并不影响作用域外面的变量

`class` 设计成了默认按 `strict` 模式执行。

```
var a = 1;
function fn(m) { console.log('fn'); }
function fn(m) { console.log('new_fn'); }
function a() { console.log('fn_a'); }
console.log(a);
fn(1);
var fn = 'var_fn';
console.log(fn);
// 真正执行
// 创建阶段
function fn(m) { console.log('fn'); }
function fn(m) { console.log('new_fn'); }
function a() { console.log('fn_a'); }
var a = undefined;
var fn = undefined;
//执行阶段
a = 1;
console.log(a);
fn();
fn = 'var_fn';
console.log(fn);
```
## 作用域链

每一个执行上下文的变量环境中都包含了一个外部引用，用来指向外部的执行上下文（`outer`）,如果一段代码使用了一个变量，`javaScript` 引擎首先会在“ 当前的执行上下文”中查找该变量，没有找到再继续在 `outer` 所指向的执行上下文中查找

词法作用域就是指作用域是由代码在函数声明的位置来决定，所以词法作用域是静态作用域，通过它能够预测代码在执行过程中如何查找标识（词法作用域，根据代码位置来决定的）

闭包：如果该闭包会一直使用，那么他可以作为全局变量而存在，如果使用频率不高，而且占用内存又比较大的话，那么就尽量让他成为一个局部变量

通过作用域查找变量的链条称为作用域链，作用域链是通过词法作用域来确定的，而词法作用域反映了代码的结构

作用域链和 `this` 是两套不同的系统，她们之间基本没有太多联系；`this` 是和执行上下文绑定的

![](../../images/blog/4.png)

`javaScript` 是动态语言，因为在声明变量之前并不需要确认其数据类型，也是弱类型语言，因为支持隐式类型转化

## `javaScript` 内存空间

`javaScript` 在执行过程中，主要有三种类型内存空间，代码空间，栈空间，堆空间；

> 1. 代码空间： 存储可执行代码的空间

> 2. 栈空间：存放原始类型的数据

> 3. 堆空间： 存放引用类型的数据

为什么要有栈空间和堆空间？
因为 `javaScript` 引擎需要用栈来维护程序执行期间的上下文状态，如果栈空间大了的话，所有数据都放在栈空间里面，那么会影响到上下文切换效率，从而影响整个程序的执行效率。所以栈空间都不会设置太大，主要用来放一些原始类型的小数据。er 引用类型的数据占用的空间都比较大，所以会被放到堆中。

原始类型的赋值会完整的复制变量值，而引用类型的赋值是复制引用地址。闭包是存储在堆内存中的

## 编译器和解释器

之所以存在是因为机器不能直接理解我们所写的代码，所以在执行程序之前，需要将我们所写的代码翻译成机器能读懂的机器语言，按照语言的执行流程可以划分为编译型语言和解释型语言。编译型语言：需要经过编译器的编译过程，编译后直接保留机器能够读懂的二进制文件；解释型语言：每一次运行都需要通过解释器对程序进行动态解释和执行

![](../../images/blog/5.png)

## 迭代器

模拟迭代器

```
function createIterator(items) {
    var i = 0;
    return {
        next: function() {
            var done = i >= item.length;
            var value = !done ? items[i++] : undefined;

            return {
                done: done,
                value: value
            };
        }
    };
}
```

在 set 和 map 中使用迭代器默认返回的东西

```
var colors = new Set(["red", "green", "blue"]);

for (let index of colors.keys()) {
    console.log(index);
}

// red
// green
// blue

for (let color of colors.values()) {
    console.log(color);
}

// red
// green
// blue

for (let item of colors.entries()) {
    console.log(item);
}

// [ "red", "red" ]
// [ "green", "green" ]
// [ "blue", "blue" ]
```

Set 类型的 keys() 和 values() 返回的是相同的迭代器，这也意味着在 Set 这种数据结构中键名与键值相同。( keys()、values()、entries() 返回的是遍历器)

数组和 Set 集合的默认迭代器是 values() 方法，Map 集合的默认迭代器是 entries() 方法。

```
const values = new Map([["key1", "value1"], ["key2", "value2"]]);
for (let value of values) {
    console.log(value);
}

// ["key1", "value1"]
// ["key2", "value2"]
```

遍历 Map 数据结构的时候可以顺便结合解构赋值：

```
const valuess = new Map([["key1", "value1"], ["key2", "value2"]]);

for (let [key, value] of valuess) {
    console.log(key + ":" + value);
}

// key1:value1
// key2:value2
```

[ES6 系列之迭代器与 for of](https://github.com/mqyqingfeng/Blog/issues/90)

## JavaScript

在 `JavaScript` 中，没有任何方法可以更改私有的`class` 属性，因此 `Object.prototype.toString()`是可以准确识别对象对应的基本类型的方法，比 `instanceof` 更加准确

在 `javascript` 中对象独有的特色是：对象具有高度的动态性，这是因为 `JavaScript` 赋予了使用者在运行时为对象添加状态和行为的能力

对 `javascript` 对象来说，属性并非只有简单的名称和值，`JavaScript` 用一组特征来描述属性，数据属性，`value`，`writable`，`enumerable`，`configurable` 访问器属性 `getter`，`setter`，`enumber`，`configurable`。定义属性的时候产生数据属性，代码执行的时候（访问器属性使得属性在读写时执行代码，视为函数的语法糖）（每一次访问属性都会执行 `getter` 和 `setter` 函数）。

对象是一个属性的索引结构（可以以比较快速用 `key` 来查找 `value` 的字典）

`Javascript` 原型系统的复制操作实现思路： 一个并不真的去复制一个原型对象，而是使的新对象持有一个原型的引用

`setTimeout` 支持第三个参数，一旦定时器到了，第三个参数会作为值传给第一个参数是 `function` 的里面

```
setTimeout((a)=>{
    console.log(a)
},100,'我是定时器的第三个参数')
```

一个 `JavaScript` 引擎会常驻于内存中，它等待着我们（宿主）把 `JavaScript` 代码或者函数传递给它执行

我们把宿主发起的任务称为宏观任务，把 `JavaScript` 引擎发起的任务称为微观任务

`Promise` 永远在队列尾部添加微观任务。`setTimeout` 等宿主 `API`，则会添加宏观任务()


