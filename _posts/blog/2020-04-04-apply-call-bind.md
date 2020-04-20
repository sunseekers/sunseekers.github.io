---
layout: post
title: call和apply,bind的模拟实现
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: web
---

# 如何模拟一个原生的call和apply,bind？
在你模拟一个原生的api 的时候，你要知道这个 api 实现了哪些功能，对他的用法概念熟练于心，然后你根据用法去想第一步做什么，接下来做什么，最后就是动手实现了。我来说说call和apply,bind的模拟实现

## `call` 模拟实现
[Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) 查看文档温习一下用法和概念

他主要有两个作用：第一是改变了 `this` 的指向，执行这个函数
他的参数：一个指定的 `this` 和单独给出的一个或多个参数
他的返回值：函数执行的结果

举个例子：

 ```
 var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

模拟实现:

1. 获取到 `this` 的指向，如果有传值，就是传入的值，否则就是 `window` => `foo`

2. 在我们获取到的 `this` 的指向中添加一个属性 `fn`，这个属性值就是我们这个函数的 `this`=>`foo.fn=bar`

3. 我们把剩余的参数传入到要执行的函数里面去，并执行 =>  `foo.fn(...rest)` 即 `bar(...rest)`

4. 函数执行完了之后，在我们获取到的 `this` 中我们多添加了一个属性 `fn`，现在删除他 => `delete ctx.fn` 用完即焚

5. 返回调用函数的结果

6. 模拟实现完成


```
Function.prototype.myCall=function(ctx){
  debugger // 查看函数的执行赋值
  ctx = ctx||window
  ctx.fn = this // this 就是调用这个方法的函数
  const rest = Array.from(arguments).slice(1)
  let result = ''
  result=ctx.fn(...rest)
  delete ctx.fn
  return result
}
```

函数模拟完了之后，测试用例测试

```
// 用例1 
 var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
bar.myCall(foo); // 1

// 用例2

function greet(name,address) {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
  return `${name}: ${reply} ,in ${address}`
  
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

greet.call(obj,'sunseekers','shanghai');
greet.myCall(obj,'sunseekers','shanghai');
```

到这里我们就完成了 `call` 的模拟了，里面用到的知识点： `this` 的指向，函数剩余参数，借用对象属性调用函数，调用完再删除（用完即焚）。原来迷迷糊糊的我，经过自己慢慢的分析 `debugger` 查看函数的执行顺序，执行之后的参数变量值，弄懂了，值得推荐尝试哟

## `apply` 模拟实现
[Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 查看文档温习一下用法和概念

细心的朋友就发现了， `apply` 和 `call` 文档里面都有一句这样的话 `Note: While the syntax of this function is almost identical to that of call(), the fundamental difference is that call() accepts an argument list, while apply() accepts a single array of arguments.`

大概意思就是说，这个函数的语法几乎与 `call()` 相同，但基本的区别是 `call()` 接受一个参数列表，而 `apply()` 接受一个参数数组。原来就是参数是列表还是数组的区别呀

说白了就是把原来第三步中用的 `foo.fn(...rest)` 换成  `foo.fn(rest)` 就好了，试一试

```
Function.prototype.myApply=function(ctx){
  debugger // 查看函数的执行赋值
  ctx = ctx||window
  ctx.fn = this // this 就是调用这个方法的函数
  const rest = Array.from(arguments).slice(1)
  let result = ''
  result=ctx.fn(rest)
  delete ctx.fn
  return result
}
```

函数模拟完了之后，测试用例测试，只写一个用例了

```
function greet(name,address) {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
  return `${name}: ${reply} ,in ${address}`
  
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

greet.apply(obj,['sunseekers','shanghai']);
greet.myApply(obj,['sunseekers','shanghai']);
```

 ## `bind` 模拟实现
[Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 查看文档温习一下用法和概念

他主要有两个作用：第一是改变了 `this` 的指向
他的参数：一个指定的 `this` 和单独给出的一个或多个参数
他的返回值：返回一个原函数的拷贝函数

```
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 

bindFoo(); // 1
```
模拟实现:

1. 获取当前函数的 `this` 的指向 `self=this`

2. 允许绑定函数使用 `new` 创建对象，把原函数当成构造器。提供的 `this` 值被忽略，同时调用时的参数被提供给模拟函数

3. 当前函数的 `this` 的指向传进来的 `this` （这一步相当于 `apply()` 的步骤）

5. 返回原函数的拷贝函数

6. 模拟实现完成

```
Function.prototype.myBind = function(ctx){
  let self = this
  let rest = Array.prototype.slice.call(arguments,1)
  let Fun = function(){} //
  let funBind = function(){
    let bindRest = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof Fun ? this : ctx , rest.concat(bindRest))
  }
  Fun.prototype = this.prototype // 指向原函数的原对象，确保在 new 的时候，传入的 this 失效，保持原有的this
  funBind.prototype = new Fun() // 原函数的拷贝函数可以使用 new 构造，如果使用 new 构造，传进来的 this 没有效果，反之成立
  return funBind
}
```

`myBind` 返回的函数，他的原型对象是用 `new` 出来的，也就是说它也可用 `new` 出来的，如果他是 `new` 出来的，那么绑定的 `this` 失效。 `Fun` 只是一个过渡，判断是否是 `new` 出来的，确定 `this` 范围

测试用例

```
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

const newBar = bar.bind(foo); 
newBar()// 1
const myNewBar = bar.myCall(foo); // 1
myNewBar()

// 用例2

function greet(name,address) {
  var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
  return `${name}: ${reply} ,in ${address}`
  
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
};

const newGreet = greet.bind(obj,['sunseekers']);
newGreet(['shanghai'])
const myNewGreet = greet.myBind(obj,['sunseekers']);
myNewGreet(['shanghai'])
```

## this 
`call` 在获取 `this` 的指向的时候，如果直接传入一个 `this` 那 `this` 的指向就不是固定的了，举一个列子

```
let obj = {
  name:"sunseekers",
  age: 18,
  info1(){
    info.call(this)//绑定this了，谁调用 this 就指向谁
  }
}
function info(){
  console.log(this,'this 是什么')
}
obj.info1()// 是在 obj 身上调用的所以this是obj

let newInfo = obj.info1
newInfo()// 在window上面调用的，this 是window
```

 ## 参考文章
 [JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

  [JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
