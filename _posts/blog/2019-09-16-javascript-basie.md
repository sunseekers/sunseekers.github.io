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

. 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法，所以我们在基础类型上面也能操作调用类的方法

a.x 或者a['x']中“.”和“[]”操作符是专门获取引用类型属性的值操作。然而在 JS 中基本类型变量也是可以使用“点”的，这给初学者造成一定困惑，比如

var a = 1;
a.x = 2;
console.log(a);// 1
console.log(a.x);// undefined
其实，上述代码运行过程中发生了所谓的“装箱操作”

> 1. 使用"==="替换"==" ，避免隐式转化带来的不必要麻烦，但是要不要使用还是要更加实际情况来说，有时候没必要使用 === 进行判断

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


 let e3 = {
        n : 2,
        toString : function (){
            console.log('this is toString')
            return this.n
        }
    }
    alert(e3) //  2  this is toString
    alert(+e3)  // 2 this is toString

     Object.prototype.toString = null;
   let e4 = {
        n : 2,
        valueOf : function(){
            console.log('this is valueOf')
            return this.n*2
        }
    }
    alert(e4) //  4 this is valueOf
    alert(+e4)
```

在有运算操作符的情况下，valueOf 的优先级高于 toString,一般情况下对象的使用都是优先调用 toString 方法

> 2. 在 `JavaScript` 中，没有任何方法可以更改私有的`class` 属性，因此 `Object.prototype.toString()`是可以准确识别对象对应的基本类型的方法，比 `instanceof` 更加准确

> 3. `javascript` 具有高度动态性

在 `javascript` 中对象独有的特色是：对象具有高度的动态性，这是因为 `JavaScript` 赋予了使用者在运行时为对象添加状态和行为的能力

对 `javascript` 对象来说，属性并非只有简单的名称和值，`JavaScript` 用一组特征来描述属性，数据属性，`value`，`writable`，`enumerable`，`configurable` 访问器属性 `getter`，`setter`，`enumber`，`configurable`。定义属性的时候产生数据属性，代码执行的时候（访问器属性使得属性在读写时执行代码，视为函数的语法糖）（每一次访问属性都会执行 `getter` 和 `setter` 函数）。

对象是一个属性的索引结构（可以以比较快速用 `key` 来查找 `value` 的字典）

`Javascript` 原型系统的复制操作实现思路： 一个并不真的去复制一个原型对象，而是使的新对象持有一个原型的引用

`javascript` 对象可以分为宿主对象，有宿主环境所提供的（new Image),内置对象（固有的运行时创建而自动创建的对象实例，原生的对象可以由用户 array 内置构造器创建的，普通对象{},class 等关键字定义创建的对象它能够被原型继承

一个 JavaScript 引擎会常驻于内存中，它等待着我们（宿主）把 JavaScript 代码或者函数传递给它执行

我们把宿主发起的任务称为宏观任务，把 JavaScript 引擎发起的任务称为微观任务

Promise 永远在队列尾部添加微观任务。setTimeout 等宿主 API，则会添加宏观任务

Promise 是 JavaScript 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行 io、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”，函数的调用方可以在合适的时机，选择等待这个承诺兑现（通过 Promise 的 then 方法的回调 

首先我们分析有多少个宏任务；在每个宏任务中，分析有多少个微任务；根据调用次序，确定宏任务中的微任务执行次序；根据宏任务的触发规则和调用次序，确定宏任务的执行次序；确定整个顺序。

```
function sleep(duration) {
  console.log('c');
    return new Promise(function(resolve, reject) {
  console.log('d');
        setTimeout(resolve,duration);
    })
}
async function foo(){
    console.log("a")
    let res = await sleep(2000).then(res=>{
      console.log(6)

      setTimeout(()=>{
        console.log(7)
      }); 
      console.log(61)
    })
    console.log("b1")
    console.log("b2")
}

// 把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色，
async function changeColor(duration,color){
  console.log(color)
  await new Promise((resolve)=>{
    setTimeout(resolve,duration)
  })
}
async function main(duration,color){
  while(true){
    await changeColor(3000,'green')
    await changeColor(2000,'orang')
    await changeColor(1000,'red')

  }
}
```

上面已经说明了 async 会将其后的函数（函数表达式或 Lambda）的返回值封装成一个 Promise 对象，而 await 会等待这个 Promise 完成，并将其 resolve 的结果返回出来
闭包与普通函数的区别是，它携带了执行的环境，就像人在外星中需要自带吸氧的装备一样，这个函数也带有在程序中生存的环境。
## 执行上下文

以前我不懂，也不在乎什么是执行上下文，好像并没有什么用，现在我发现我错了。看到一句话 “只有理解了 `javaScript` 的执行上下文，才能更好的理解 `javaScript` 语言本身，比如变量提升，作用域，闭包”，关于这些概念不去仔细解释

实际上变量和函数声明在代码里的位置是不会改变的，而是在编译阶段被 `javaScript` 引擎放入内存中

简单说一段 `javaScript` 代码可以被分为编译阶段和执行阶段；在编译阶段又可以分为变量提升部分代码（执行上下文）和执行部分代码

![](../../images/blog/3.png)

执行上下文是 `javaScript` 执行一段代码时的环境，在执行上下文本中存在一个变量环境的对象（保存变量提升的内容），完了之后`javaScript` 引擎开始执行可执行代码，一行一行的执行，执行的过程中先在变量环境中查找，找到就输出，找不到就输出 `undefined` 或者报错

所以说 `javaScript` 代码在执行前需要先编译，在编译阶段会出现变量提升

注意了： 函数内部通过 `var` 声明的变量，在编译阶段都被放到了变量环境里面了
通过 `let` 声明的变量，在编译阶段会被存放到词法环境中
在函数的作用域内部，通过 `let` 声明的变量会被存放到词法环境的一个单独区域中，这个区域中的变量并不影响作用域外面的变量

class 设计成了默认按 strict 模式执行。

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
