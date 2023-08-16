---
layout: post
title: call和apply,bind的模拟实现
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: web
---


# 如何模拟一个原生的 call 和 apply,bind？

在你模拟一个原生的 api 的时候，你要知道这个 api 实现了哪些功能，对他的用法概念熟练于心，然后你根据用法去想第一步做什么，接下来做什么，最后就是动手实现了。我来说说 call 和 apply,bind 的模拟实现
##  this、call、apply 和 bind 的理解
this ，函数执行的上下文，总是指向函数的直接调用者（而非间接调用者），可以通过 apply ， call ， bind 改变 this 的指向。

apply：第一个参数：传入 this 需要指向的对象，即函数中的 this 指向谁，就传谁进来；第二个参数：传入一个数组，数组中包含了函数需要的实参。传入参数后立即调用执行该函数

call：第一个参数：传入 this 需要指向的对象，即函数中的 this 指向谁，就传谁进来；第二个参数：除了第一个参数，其他的参数需要传入几个，就一个一个传递进来即可传入参数后立即调用执行该函数

bind：第一个参数：传入 this 需要指向的对象，即函数中的 this 指向谁，就传谁进来；第二个参数： 除了第一个参数，其他参数的传递可以像 apply 一样的数组类型，也可以像 call 一样的逐个传入；但需注意的是后面需要加个小括号进行其余参数的传递。并传入参数后返回一个新的函数，不会立即调用执行
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

3. 我们把剩余的参数传入到要执行的函数里面去，并执行 => `foo.fn(...rest)` 即 `bar(...rest)`

4. 函数执行完了之后，在我们获取到的 `this` 中我们多添加了一个属性 `fn`，现在删除他 => `delete ctx.fn` 用完即焚

5. 返回调用函数的结果

6. 模拟实现完成

```
Function.prototype.myCall=function(ctx,...args){
  ctx = ctx||window
  ctx.fn = this // this 就是调用这个方法的函数
  const key = Symbol()
  ctx[key] = this
  const result = ctx[key](...args)
  delete ctx[key]
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

说白了就是把原来第三步中用的 `foo.fn(...rest)` 换成 `foo.fn(rest)` 就好了，试一试

```
Function.prototype.myApply=function(ctx){
  debugger // 查看函数的执行赋值
  ctx = ctx||window
  ctx.fn = this // this 就是调用这个方法的函数
  const rest = Array.from(arguments).slice(1)
  const key = Symbol()
  const result = ctx[key](...args)
  delete ctx[key]
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
无论使用哪种方法调用，bind方法创建的新函数与原始函数的函数体相同，新函数被绑定到指定的对象上

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

4. 返回原函数的拷贝函数

5. 模拟实现完成

```
Function.prototype.myBind = function(context){
  const fn = this
  const args = Array.from(arguments).slice(1)
  return function newFn(...newFnArgs){
    if(this instanceof newFn){
      // 如果是new 出来的话 instanceof返回false
      return new fn(...args,...newFnArgs)
    }
    return fn.apply(context,[...args,...newFnArgs])
  }
}
```

`myBind` 返回的函数，他的实例原型是用 `new` 出来的，也就是说它也可用 `new` 出来的，如果他是 `new` 出来的，this instanceof Fun 为true ，绑定的 `this` 失效。 `Fun` 只是一个过渡，判断是否是 `new` 出来的，确定 `this` 范围

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

[JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)

[JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
