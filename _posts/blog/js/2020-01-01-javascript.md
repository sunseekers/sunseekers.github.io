---
layout: post
title: JavaScript 零碎知识点
categories: [JavaScript]
description: JavaScript
keywords: JavaScript
---

# JavaScript 基础知识

记录一些我不熟悉的 JavaScript 概念，帮助后面整理前端知识技能图谱

## null 和 undefined 的区别？

Undefined表示未定义，指的是变量已声明但未赋值，或对象没有定义属性时的返回值

Null表示空值，它是JavaScript中的一个特殊值，表示一个空的或不存在的对象引用
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

`in` 运算符 如果指定的属性在指定的对象或其原型链中，则 in 运算符返回true （属性和对象的关系）

`instaceof` 运算符，判断实例是不是有构造函数构建出来的（实例是否在原型对象/原型链上面，实例和对象的关系）

```
const car = { make: 'Honda', model: 'Accord', year: 1998 };

console.log('make' in car);
// expected output: true

delete car.make;
if ('make' in car === false) {
  car.make = 'Suzuki';
}

console.log(car.make);
// expected output: "Suzuki"
```
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
toString()不可以转换null 和 undefined，因为null 和 undefined 没有自己的包装对象，不能访问对象的toString() 方法，包装对象的属性引用结束，这个新创建的临时对象就会被销毁了
## script 标签的执行顺序

`script` 标签存在两个属性 `defer` 和 `async` ，都是不堵塞后续文档的执行，我们在使用他的时候就分了三种情况

1. `<script src="example.js"></script>`
   没有 `defer` 或 `async` 属性，浏览器会立即加载并执行相应的脚本。也就是说在渲染 `script` 标签之后的文档之前，不等待后续加载的文档元素，读到就开始加载和执行，此举会阻塞后续文档的加载；

2. `<script async src="example.js"></script>`

有了 `async` 属性，表示后续文档的加载和渲染与 `js` 脚本的加载和执行是并行进行的，即异步执行；

3. `<script defer src="example.js"></script>`

有了 `defer` 属性，加载后续文档的过程和 `js` 脚本的加载(此时仅加载不执行)是并行进行的(异步)，`js` 脚本的执行需要等到文档所有元素解析完成之后，`DOMContentLoaded` 事件触发执行之前。

4. `<script type="module"  src="example.js"></script>`

加载模块，他和`defer` 属性差不多，但是要又优先于 `defer` 执行

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

原始数据类型：直接存储在栈（stack）中，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。（null ,undefined,boolean,number,string,symbol(es6),BigInt(BigInt 是一种内置对象，它提供了一种方法来表示大于 2^53 - 1 的整数。这原本是 Javascript中可以用 Number 表示的最大数字

引用数据类型：同时存储在栈（stack）和堆（heap）中，占据空间大、大小不固定。引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。Object（Object本质上是由一组无序的名值对组成的）。里面包含 function、Array、Date等

因为引用类型在离开当前作用域之前，是存在内存中的，而包装类型的对象，只存在代码执行期间,执行完立即被销毁。所以，我们不能在运行时为基本类型的数据添加属性和方法。
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

## JS 中Object.prototype.toString.call()判断数据类型

```
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
```

typeof 操作符不能准确区分出 null 和 object，因此可以使用 Object.prototype.toString.call() 来判断一个变量是否为 null，以及区分出 Array 和 Object 等类型。

## var let const区别
var定义的变量会挂在windows对象上，会存在污染全局，重复声明
块级作用域，暂时性死区

函数提升要比变量提升的优先级要高一些，且不会被变量声明覆盖，但是会被变量赋值之后覆盖。
var的创建和初始化被提升，赋值不会被提升。

let的创建被提升，初始化和赋值不会被提升。

function的创建、初始化和赋值均会被提升。

## 箭头函数和普通函数的区别
箭头函数是匿名函数，不能像普通函数那样定义具名函数。

箭头函数没有自己的this，它的this继承于上下文环境。

箭头函数没有自己的arguments对象，它的arguments对象继承于上下文环境。

箭头函数没有prototype属性，不能作为构造函数使用。

箭头函数不能使用yield关键字来定义生成器函数。

箭头函数在函数体内不能使用super、new.target、this以外的arguments和new关键字。

箭头函数不能被用于定义对象的方法，因为this的指向是固定的，无法改变。
总的来说，箭头函数主要适用于简单的函数，减少代码量，提高可读性，但在一些复杂的场景中，使用普通函数更为便捷。
## for-in 和 for-of的区别
for...of语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等 常用于遍历数组，for-of遍历的是对象的属性值=>可迭代对象必须实现了 iterator 和 next 方法

for...in 语句以任意顺序迭代一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。常用于遍历对象，for-in遍历的是对象的属性名

for await...of 语句创建一个循环，该循环遍历异步可迭代对象以及同步可迭代对象

for-in循环性能比较低，因为它需要遍历对象的原型链来找到所有的可枚举属性。而for-of循环性能较高，因为它不需要遍历原型链，只需要遍历可迭代对象的值。
因此，当需要遍历对象属性名时，使用for-in循环；当需要遍历可迭代对象的值时，使用for-of循环。需要注意的是，在使用for-in循环时，为了避免遍历到原型链上的属性，应该使用hasOwnProperty方法来判断该属性是否为对象自身属性。
## Object.keys和 Object.getOwnPropertyNames的区别
Object.keys(obj):返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名

Object.getOwnPropertyNames: 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

Object.keys()返回可枚举的，Object.getOwnPropertyNames()返回所有的。

## Object.create 和直接声明一个对象的区别
Object.create 用于创建一个新对象并将其原型设置为传入的参数，如果不传入，就是一个干净的空对象不会有原型，也不会有Object 原型对象的任何属性（例如toString，hasOwnProperty等）

{}直接定义新对象的自有属性和方法，它们会继承其他的原型对象上的属性和方法。字面量创建对象更简单，方便阅读,不需要作用域解析，速度更快

## {}和 [] 的 valueOf 和 toString 的结果是什么？
{}: 它的 valueOf 返回的是对象本身，toString 返回的是 "[object Object]"。

[]，它的 valueOf 返回的是数组本身，toString 返回的是由所有数组项组成的字符串

## toString() && valueOf() toPrimtive()
toString()方法用于将对象转换为字符串,可用于类型判断，null和undefined不能调用toString

valueOf()方法用于将对象转换为其原始值

toPrimitive()方法用于将对象强制转换为原始值

## ES6迭代器
ES6引入的迭代器是一种新的数据类型处理方式，可以用于遍历各种数据结构，如数组、对象、Set集合等。迭代器提供了一种通用的遍历数据结构的方法，而不需要知道数据结构内部的实现细节。

迭代器有两个部分组成：一个是迭代器对象，它包含一个next()方法，并返回一个包含value和done属性的对象；另一个是要遍历的数据结构，这个数据结构必须具有[Symbol.iterator]属性，并返回一个迭代器对象。

## 深浅复制
浅复制是指将一个对象的属性值简单地复制到另一个对象中，而对于属性值为引用类型的属性，只复制其引用地址，因此，如果原对象中的这些引用类型的属性发生变化，则新对象中的这些属性也会发生变化。Object.assign，扩展运算符（...）,

深复制是指将一个对象及其属性递归地复制到另一个对象中，包括所有的引用类型属性。因此，这种复制方式能够完全独立地复制一个对象和其属性，与原对象完全隔离。for...in循环进行属性复制,JSON.parse(JSON.stringify(obj))，需要注意的是：该方法容易出现循环引用和函数丢失的问题。

## JavaScript有哪些数据类型？如何判断这些类型。
原始值： null undefined string number boolean symbol bigInt

引用类型：object,Array,function 

判断这些类型：

typeof 操作符 但它不能检测 Null 和 其他任何对象类型，所有使用 new 调用的构造函数都将返回非基本类型（"object" 或 "function"）。大多数返回对象，但值得注意的例外是 Function，它返回一个函数。

Object.prototype.toString.call()

判断数据类型是否为数组：Array.isArray()

in 操作符用于判断一个对象或其原型链中是否包含某个属性

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

严格运算符:   === 和 Object.is()

## prototype和Object.getPrototypeOf()都可以用于访问对象的原型
prototype属性是一个函数特有的属性，它用于创建对象实例时继承的属性和方法。

Object.getPrototypeOf()是一个静态方法，用于获取对象的实际原型对象。

__proto__是一个非标准的属性，它指向对象的原型。不建议在代码中使用。

推荐使用Object.getPrototypeOf()方法访问对象的原型，而不是直接使用__proto__属性。同时，prototype属性是函数特有的，应该只在函数中使用。

## 普通数据类型存储在哪里？堆还是栈
简单数据类型（原始类型数据）（例如数字、布尔值等）是存储在栈内存中的，因为它们的值大小固定，没有办法动态进行分配和回收

引用数据类型（例如对象、数组等）是存储在堆内存中的，因为它们的大小不固定，在运行过程中需要动态地分配和回收内存空间
## symbol了解吗 说说他的使用场景
Symbol是ES6引入的一种新的基本数据类型，是表示唯一标识的数据类型，它的出现主要是为了解决对象属性名冲突的问题。

使用Symbol来作为对象属性名

使用Symbol来替代常量

使用Symbol定义类的私有属性/方法

## 什么是闭包，为什么要用它？
闭包是指有权访问另一个函数作用域中变量的函数

创建私有变量，减少全局变量，防止变量名污染。可以操作外部作用域的变量，变量不会被浏览器回收，保存变量的值
## 你能说一下闭包的优缺点吗？
优点：
保护私有变量：闭包可以用于创建私有变量和私有函数，因为它们只能在闭包内部访问，而外部无法访问此变量和函数，以此保护这些变量和函数不被外部修改和污染。

延迟执行：通过闭包可以实现函数和变量的延迟执行，即只有在闭包内部被调用时才执行。

可以使得函数参数保持在内存中：在 JavaScript 中，如果一个函数返回了一个内部函数或者将该函数作为参数传递给其他函数，那么这个函数中的变量就被保留在内存中，因为这个内部函数一直存在于内存中。

闭包的缺点：

空间浪费：闭包会使得函数中的变量一直存在于内存中，因此在使用闭包时，需要注意内存的使用情况。

滥用闭包会导致性能问题：闭包的使用必须谨慎，不当使用闭包容易造成性能问题，在频繁调用涉及闭包的函数时，会占用大量内存和计算资源。

掌握难度大：闭包的使用需要掌握一定的理论和实践知识，必须清楚地知道何时使用闭包以及如何正确地使用。

##  js 延迟加载的方式有哪些
通过推迟部分或者全部JavaScript资源的加载和执行，来提升页面的加载速度和用户的体验。

defer属性：使用defer属性在浏览器下载HTML时异步地下载JS文件，并在页面下载完成后执行。有多个JS文件时，按顺序依次异步下载和脚本之间没有依赖关系时，这种方式非常适合。

```
<script src="app.js" defer></script>
```

async属性：使用async属性异步地下载JS文件，文件下载完成后立即执行，适用于不依赖其他脚本的情况。与使用defer不同，它不会保证脚本的执行顺序。如果有多个脚本必须按特定顺序执行，则不应该使用async。

```
<script src="app.js" async></script>
```

动态加载：在页面完成其他加载工作后，使用JavaScript运行时动态地创建和下载JS文件，并在下载完成后立即执行它们。这种方式可以控制文件下载的顺序并选择什么时候下载。下面是使用动态加载延迟加载JS文件：

```
<script>
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.body.appendChild(script);
  }
  loadScript('app.js', function() {
    // JS文件成功加载后的回调函数
  });
</script>
```

懒加载： 懒加载是指在某些条件下才开始加载JavaScript文件，例如滚动到页面底部、进入页面显示某一区域等等。懒加载有助于减少初始页面的下载量，并允许后续下载文件以响应用户的交互而进行，从而更好地使用用户的带宽。

## 前端内存处理
变量声明和使用：在声明变量时需要选择合适的数据类型和变量名，以及避免定义全局变量，同时也需要及时释放变量所占用的内存。

内存泄漏：内存泄漏是指在程序中申请的内存没有被及时释放，导致该内存空间一直被占用，直至程序结束。为避免内存泄漏，可以使用垃圾回收机制或手动释放内存。

缓存管理：缓存是一种优化前端性能的方法，但是需要谨慎使用，避免缓存占用过多内存或造成数据不一致。

优化内存使用：可以使用一些前端框架或库来优化内存使用，如使用虚拟 DOM 来减少 DOM 操作，使用对象池来复用对象等。

## ES6有哪些新特性
let和const关键字
扩展运算符
箭头函数
函数的默认参数值
解构赋值
类和继承
模块化
模板字符串

## ES7有哪些新特性
Array.prototype.includes()

指数运算符**

## ES8新特性
async/await
Object.values()
Object.entries()
String padding: padStart()和padEnd()，填充字符串达到当前长度
函数参数列表结尾允许逗号
Object.getOwnPropertyDescriptors()
ShareArrayBuffer和Atomics对象，用于从共享内存位置读取和写入
## 懒加载的实现原理是怎样的
它可以在一个网页被加载时仅仅加载视口中可见的部分，剩下的可见部分则按需加载。懒加载主要应用于网页中的图片、音频、视频等资源，以提升页面的加载速度和用户体验。

利用 JavaScript（IntersectionObserver，MutationObserver） 获取需要进行懒加载的图片、音频、视频等资源的位置以及其他相关信息，同时获取视口的大小和位置。出现时加载，不出现时，不加载


## axios二次封装的好处
统一管理请求：通过二次封装，可以统一管理请求，便于代码维护和更新。

增加请求拦截器：通过二次封装，可以为请求增加拦截器，对请求进行预处理，如添加请求头、验证登录状态等。

错误处理统一：通过二次封装，可以统一处理请求的错误，避免代码冗杂。

扩展性强：通过二次封装，可以根据不同的需求扩展请求的功能，便于扩展和升级。
## Javascript 的作用域和作用域链
作用域说的是变量的可访问性和可见性（函数作用域/全局作用域/作用域嵌套

作用域链：当前作用域下去寻找该变量，如果没找到，再到它的上层作用域寻找，以此类推直到找到该变量或是已经到了全局作用域，所形成的链条

## 虚拟dom是什么? 原理? 优缺点?
虚拟 DOM： 它是一个 JavaScript 对象树，它模拟了一个真实的 DOM 树，通过这个虚拟 DOM 树来操作页面中的元素（用来描述页面上各个元素之间的关系和属性）

基本原理是，在浏览器端创建一个 JavaScript 对象来模拟真实的 DOM 结构，并不断监控数据的变化。当数据变化时，不是直接操作页面上的 DOM 元素，而是先在 JavaScript 对象上操作数据，然后通过比较虚拟 DOM 上的变化，将变化的部分重新渲染到页面上。这样就避免了每次数据变化都要操作真实 DOM 的开销，提高了系统性能。

虚拟 DOM 的优势在于进行局部更新，减少了渲染和页面重排的次数，提高了页面渲染的效率，而且可以实现跨平台、跨框架的共用组件，提高了组件复用

## 宏任务 和微任务
宏任务：setTimeout, setInterval, I/O 操作, UI渲染, setImmediate, requestAnimationFrame

微任务: Promise.then, MutationObserver, Process.nextTick

## 伪数组转化成数组？
arr = [].slice.call(pagis)
Array.protoType.slice.call(arr)
Array.from(arr)
[...arr]

## 把一个url拆解成origin、文件名、hash拆解成示例的格式。
new URL() : 解析路由

URL.searchParams: 返回一个 URLSearchParams 对象,可用get(name)获取属性值

## async/await, generator, promise这三者的关联和区别是什么?

Promise是ES6引入的一种异步编程的解决方案，它可以处理异步操作并返回结果，可以通过链式调用then()和catch()方法来处理异步操作的结果。Promise是一个对象，它有三种状态：pending（进行中）、fulfilled（已完成）和rejected（已拒绝）。

Generator是ES6引入的一种函数类型，它可以在执行过程中暂停和恢复，这使得它非常适合处理异步操作。Generator函数使用function*声明，它通过yield语句将控制权传递给调用方，并通过yield表达式返回值。当Generator函数被调用时，它返回一个迭代器对象，该对象可以使用next()方法来恢复执行。

async/await是ES8引入的一种异步编程解决方案，它使异步代码看起来像同步代码，使代码更易于理解和维护。async函数返回一个Promise对象，并使用await表达式来等待异步操作的结果。当await表达式被执行时，它会暂停async函数的执行，并等待异步操作完成。一旦异步操作完成，await表达式将返回异步操作的结果，并使async函数继续执行。

总的来说，Promise是一种异步编程的基础模型，而Generator和async/await是建立在Promise之上的高级模型。Generator函数和async/await语法都是为了使异步编程更具可读性和可维护性

## 事件循环的机制了解吗？
事件循环是JavaScript实现异步编程的一个核心机制。当JavaScript代码遇到异步任务处理函数（比如定时器、AJAX请求等）时，代码不会同步执行该函数，而是将该函数挂起，等待异步任务返回结果。而这时，JavaScript引擎会继续执行下一行代码，当执行栈中的所有任务全部执行完毕后，事件循环机制就会开始执行挂起的异步任务。

事件循环的核心机制是先进先出（FIFO）的队列，即事件队列。JavaScript引擎会不停地从事件队列中取出事件并执行，当队列为空时就会一直等待直到有新的事件加入再继续执行。

事件循环可以分为两个阶段：宏任务和微任务。每当JavaScript引擎执行栈中的任务执行完毕之后，就会按照以下流程执行事件队列中的任务。

## 宏任务和微任务的执行顺序是怎样的？
宏任务：通常是由浏览器API触发的，比如setTimeout、setInterval、DOM事件、Ajax请求等。宏任务会被加入到宏任务队列中等待执行。

微任务：通常是由JavaScript代码触发的，比如Promise、Object.observe、MutationObserver等。微任务会被加入到微任务队列中等待执行。

在事件循环中，每次执行一个宏任务之后，都会将当前宏任务中产生的所有微任务依次执行完毕，然后再执行下一个宏任务。也就是说，微任务的执行优先级高于宏任务。

## 简述事件循环原理
事件循环(Event Loop)是JavaScript实现异步编程的核心机制之一，它是一种循环运行的机制，用于监听并执行队列中的任务。
事件循环的执行过程如下：

首先，JavaScript引擎执行所有的同步任务，这些任务在主线程中执行，等待执行的异步任务被放置在任务队列中。

当异步任务（例如setTimeout、DOM事件等）被触发时，会被放入任务队列中。

异步任务在任务队列中等待，直到主线程中的同步任务全部执行完毕。

当同步任务执行完毕之后，JavaScript引擎开始执行任务队列中的异步任务。

当事件循环在执行异步任务时，如果发现异步任务中存在回调函数，如Ajax请求，则将其放入回调函数队列中等待执行。

异步任务执行完成之后，JavaScript引擎会检查回调函数队列中是否存在需要执行的任务，并执行任务队列中的回调函数。

JavaScript引擎在主线程和任务队列中不断循环执行同步任务和异步任务，并且在执行异步任务时，也会检查是否需要执行回调函数队列中的任务。
通过事件循环机制，JavaScript实现了异步编程，避免了同步代码阻塞的问题，提高了程序的性能。

## Event Loop事件轮询机制
事件轮询(Event Loop)是JavaScript中非常重要的一个概念。

在JavaScript中，执行环境分为两类：执行堆栈和消息队列。执行堆栈是一个数据结构，用来存储所有被执行的代码；消息队列则是一个列表，用来存储由Web API异步执行结束后需要执行的回调函数（比如setTimeout、AJAX等）。
当执行一个任务时，这个任务可能执行完毕，也可能分为两类：同步任务和异步任务。对于同步任务，JavaScript引擎会在执行堆栈中依次执行，直到任务执行完毕；对于异步任务，JavaScript引擎会把这个任务挂起，继续执行堆栈中的任务，待异步任务完成后，将回调函数推入消息队列中。

事件轮询(Event Loop)就是负责监听执行堆栈和消息队列并依次将消息队列中的回调函数推入执行堆栈中执行的过程。当执行堆栈为空时，JavaScript引擎会去检查消息队列中是否有任务需要执行，若有则将队列中的第一个任务推入堆栈中执行，否则继续等待消息队列中有新的任务。这样就实现了JavaScript中的异步编程，避免了阻塞线程的情况发生。

## JS 的运行机制
分为两个阶段： 编译阶段和执行阶段

编译阶段：在该阶段，JavaScript引擎会扫描整个JavaScript代码，并进行词法分析和语法分析，生成执行上下文（Execution Context）和可执行代码。此外，JavaScript引擎还会建立作用域链，将变量和函数等标识符与所在的作用域（Scope）相关联。

执行阶段：在该阶段，JavaScript引擎会将编译生成的可执行代码逐行执行，顺序执行。当执行到某一行代码时，JavaScript引擎会首先在当前上下文中查找该变量或函数，如果找到则使用该标识符对应的值或函数体，否则将沿着作用域链向上查找，直到找到全局上下文为止。

JavaScript的执行过程是单线程的，也即一次只能执行一个任务。当函数执行时，会创建一个新的执行上下文，并加入到执行栈（Execution Stack）中，当函数执行完毕后，将执行上下文从执行栈中弹出，JavaScript引擎继续执行执行栈中下一个上下文。

在执行过程中，JavaScript引擎还会处理事件队列中的事件，如果事件队列中有多个任务等待执行，那么JavaScript引擎会按照队列的先进先出（FIFO）的顺序逐个执行这些任务。
需要注意的是，JavaScript是一门单线程语言，如果某个任务占用了大量的时间，那么会导致其他任务得不到执行。因此，在编写JavaScript代码时，需要注意避免长时间的占用线程，对于较长时间的操作，可以采用异步回调和定时器等方式来实现。

## 渲染进程
渲染进程是指Chrome浏览器中负责将网页渲染到屏幕上的进程。每个标签页都有一个独立的渲染进程，用来处理该标签页中的所有内容。通常情况下，渲染进程中包含以下几个主要组成部分：

浏览器内核：渲染引擎、JavaScript引擎等。

GUI渲染线程：用于将页面渲染成图像，包括布局计算、样式计算等。

JavaScript引擎线程：用于执行JavaScript代码。

事件触发线程：用于处理事件，包括用户交互事件、定时器事件等。

定时器线程：用于处理setTimeout、setInterval等定时器事件。

异步HTTP请求线程：用于处理异步请求，包括Ajax请求等。

渲染进程的设计是为了提高浏览器的安全性和稳定性。由于每个标签页都有独立的渲染进程，当其中一个标签页出现问题时，不会影响到其他标签页和浏览器的正常运行。同时，渲染进程还可以利用多核CPU的优势，提高网页的渲染性能和响应速度。

## 渲染过程
解析html => 解析css => 构建渲染树 => 布局计算 => 绘制 => 重排/回流

在渲染过程中，JavaScript也会对渲染的过程产生影响。如果JavaScript代码会修改DOM树或者CSS样式，就会触发渲染树的重构和绘制，影响渲染性能。因此，在编写JavaScript代码时需要注意尽量减少对DOM树和样式的频繁操作，以提高页面的渲染效率。

## 垃圾回收（新生代 老生代）
垃圾回收是指在程序运行过程中，自动识别并回收不再使用的内存空间的一种技术。在JavaScript中，新生代和老生代是指内存中存放不同类型对象的区域。

新生代是指存放新创建的变量、临时变量和短周期变量的内存空间区域。JavaScript引擎在这个区域内实现了称为Scavenge的垃圾回收算法，它会监视这个区域中的对象，当某个对象不再被引用，即没有任何变量指向它时，认为该对象是垃圾，将其回收。

老生代是指存放长周期变量、闭包和函数的内存空间区域。由于这个区域内的变量和对象通常比较大、复杂，因此采取了不同于新生代的垃圾回收算法，称为标记-清除算法。这个算法会在程序运行时，检查老生代中的对象是否被引用，如果没有引用，则将其回收。

## 函数柯里化的实现
函数柯里化（Currying）是一种将多参函数转化成一连串单参函数的特定方式
```
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      // 如果传入的参数数目达到或超过所需参数数目，则执行原函数。
      return fn.apply(this, args);
    } else {
      // 如果传入的参数数目不足，则返回一个新函数，等待接收更多参数。
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}
```
函数的 length 属性是一个只读的整数，表示函数有多少个形参,它不会计算使用默认值、剩余参数、扩展参数等特殊语法声明的参数。所以一般我们不会用

## js 继承
原型链继承
原型式继承
借用构造函数继承

## js中sort原理
当数组长度小于等于10的时候，采用插入排序，大于10的时候，采用快排。

v8的sort对于长度大于1000的数组，采用的是快排与插入排序混合的方式进行排序的，

当数组元素都是字符串时，sort()会直接按照字典序进行升序排序，也可以传入一个比较函数作为参数，来指定排序规则。比较函数接收两个参数，代表两个被比较的元素，返回负数表示第一个元素在前，返回正数表示第二个元素在前，返回0表示两个元素相等。

当数组元素是数字时，sort()默认按照字符串排序。需要传入一个比较函数来将其转化为数字。比较函数可以通过比较a - b, 返回小于0表示a在b前，返回大于0表示a在b后，返回0表示a,b相同。
需要注意的是，快速排序算法是属于不稳定排序的，它的性能优于归并排序但可能不能保证相同元素之间的顺序不发生变化。
## fetch 分片下载

fetch() API 还提供了一个 Response 对象上的 body 属性，该属性可以返回一个可读流（ReadableStream），并提供了 getReader() 方法。通过 getReader() 方法可以创建一个读取器流（ReadableStreamDefaultReader），并通过该流来获取分片数据
利用headers的 Range 每次去读一段流，全部去读完了，就可以下载

```
const url = 'https://imgservices-1252317822.image.myqcloud.com/coco/s04272023/1697e5ee.pkp3zt.zip'
const CHUNK_SIZE = 10
fetch(url).then(response=>{
  debugger
  const totalSize = +response.headers.get("Content-Length");
  let downloaded = 0
  const chunks = []
  // 分多少段去下载
  while(downloaded<totalSize){
    const from = downloaded
    const to = Math.min(from+CHUNK_SIZE,totalSize-1)
    chunks.push({from,to})
    downloaded=to+1
  }
  // 请求一小段流
  const fetchChunk = async (chunk)=>{
    const range = `bytes=${chunk.from}-${chunk.to}`;
    const response = await fetch(url,{headers:{Range:range}})
    const reader = response.body.getReader()
    const data = await readAllChunks(reader)
    return data
  }
  // 流读取
  const readAllChunks = async (reader)=>{
    let chunks = []
    while(true){
      const {done,value} = await reader.read()
      if(done) break
      chunks.push(value)
    }
    return chunks
  }
  // 所有的段都开始请求
  const promises = chunks.map((chunk)=>fetchChunk(chunk))
  return Promise.all(promises)
}).then((chunks)=>{
  // 流数据全部读取完了
  const blob = new Blob(chunks)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download='large-file.zip'
  link.click()
})
```

## requestIdleCallback
requestIdleCallback() 是一个浏览器 API，用于在浏览器空闲时执行任务，以提高性能和用户体验。
传递给 requestIdleCallback() 的函数会在浏览器空闲时调用，而不是立即执行。这个函数接受一个 IdleDeadline 参数，在函数中可以检查 IdleDeadline 中的 timeRemaining() 方法来确定当前浏览器空闲时间的长度。由于该函数的执行不会影响当前页面的渲染和用户交互，因此可以在空闲时间执行一些长时间运行的任务

## 怎么理解 JS 的异步？
异步指的是某些代码在运行时，不会立即执行完毕并返回结果，而是会先挂起自己，等待某些其他的操作完成后再继续执行，这些操作可以是定时器、DOM 事件、 Ajax 请求、服务器的响应等等。
## 观察者模式和发布订阅模式
观察者模式是一种对象间的一对多的依赖关系，当被观察者对象的状态发生改变时，它会自动通知所有的观察者对象并且通常会调用观察者对象定义的回调函数。典型的实现包括了 addEventListener，其中一个参数就是回调函数，当事件被触发时，所添加的回调函数将被执行。

例如，当用户单击一个按钮时，我们希望在页面上做不同的事情。在这种情况下，观察者模式是一个合适的设计模式。我们可以使用 addEventListener 方法来注册不同的回调函数，一旦事件被触发，所注册的回调函数将被调用。

```
button.addEventListener('click', function () {
  // Do something.
});
button.addEventListener('click', function () {
  // Do something else.
});
```
发布订阅模式也是一种对象间的一对多的依赖关系，但是发布者和订阅者之间有一个消息队列来实现消息的发布和订阅。订阅者需要向消息队列订阅消息，一旦发布者发布了一个消息，消息队列会将这个消息推送给订阅者，订阅者可以在收到消息之后执行相关的操作。

```
class EventChannel {
  constructor(){
    this.topics = {}
  }
  // 发送消息
  publish(topic,data){
    if(!this.topics[topic]) return
    this.topics[topic].forEach((callback)=>{
      callback(data)
    })
  }
  // 订阅消息
  subscribe(topic,callback){
    if(!this.topics[topic]){
      this.topics[topic] = []
    }
    this.topics[topic].push(callback)
  }
  // 取消订阅
  unsubscribe(topic, callback) {
    if (!this.topics[topic]) {
      return;
    }
    const index = this.topics[topic].indexOf(callback);
    if (index > -1) {
      this.topics[topic].splice(index, 1);
    }
  }
}

const eventChannel = new EventChannel()
eventChannel.subscribe('message',(data)=>{
  console.log(`Received message: ${data}`);
})
eventChannel.publish('message','Hello, world!')
```
## compose 函数
接收多个独立的函数作为参数，然后将这些函数进行组合串联，最终返回一个“组合函数”
```
function compose(...fn){
  if(fn.length===0){
    return arguments=>arguments
  }else if(fn.length===1){
    return fu[0]
  }
  return fn.reduce((a,b)=>(...args)=>a(b(...args)))
}
```




## Js的几种模块规范
[CommonJS、AMD、CMD、UMD、ES6 Module](https://juejin.cn/post/6994814324548091940#heading-25)

CommonJS ：定义模块 module.exports是对外的接口；引入模块require方法用于加载模块。

所有代码都运行在模块作用域，不会污染全局作用域。
模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
模块加载是一项阻塞操作，也就是同步加载。模块加载的顺序，按照其在代码中出现的顺序。



## 映射
Map，Object，WeakMap 他们的区别

Object 的键只能是string类型或者symbol类型或者number

Map的键可以是任意类型


Object的大小需要手动计算，map很容易

map遍历顺序遵循插入顺序，对象被实现为哈希表，因此属性的顺序是不确定的，并且它们不一定按照它们添加到对象中的顺序排列

Object有原型，所以映射中有一些缺省的键

这三条提示可以帮你决定用Map还是Object：

如果键在运行时才能知道，或者所有的键类型相同，所有的值类型相同，那就使用Map。

如果需要将原始值存储为键，则使用Map，因为Object将每个键视为字符串，不管它是一个数字值、布尔值还是任何其他原始值。

如果需要对个别元素进行操作，使用Object。

WeakMap 的键必须是对象类型,键是不可枚举的(weakMap值可以是任意类型，键是弱保持，没有引用就会被垃圾站收走）

### 集合
Array和set的区别

set不允许重复的值，数组的indexOf方法不能找到NaN的值，

set允许根据值删除元素，而数组必须使用基于下标的splice方法

数组用于判断元素是否存在的indexOf函数效率低下

WeakSet 中的值必须是对象类型，不能是别的类型，如果不存在其他引用，那么该对象将可被垃圾回收

## 对象的一些其他知识
一个对象在什么情况下才能作为函数调用呢？答案是，通过内部方法和内部槽来区分对象，例如函数对象会部署内部方法 [[Call]]，而普通对象则不会。

一个普通对象的所有可能的读取操作

访问属性：obj.foo。

判断对象或原型上是否存在给定的 key：key in obj。

使用 for...in 循环遍历对象：for (const key in obj){}。


一个对象能否被迭代，取决于该对象或者该对象的原型是否实现了@@iterator 方法。这里的 @@[name] 标志在 ECMAScript 规范里用来代指 JavaScript 内建的 symbols 值，例如@@iterator 指的就是 Symbol.iterator 这个值。如果一个对象实现了 Symbol.iterator 方法，那么这个对象就是可以迭代的.对象是不可迭代的，所以不能用 for...of循环

对象迭代器模拟实现
```
const myIterableObj = {}
myIterableObj[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
for (const val of myIterableObj) {
  console.log(val);
}
```

可以看到数组迭代器执行会读取数组的length属性

Array.prototype.values === Array.prototype[Symbol.iterator],可见数组的values方法返回的值实际就是数组内建的迭代器.