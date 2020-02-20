---
layout: post
title: javaScript API
categories: [JavaScript]
description: javaScript API
keywords: javaScript API
---

# 可互替的  `API`
如果遇到兼容性的问题，我们可以尝试用多个 `api` 改写，最后写出我们要的结果

## 举个例子

场景：在一次开发的过程中遇到了 `includes` 方法不兼容，后来用 `indexOf` 替换
//判断一个字符串是否包含另一个字符串
console.log(content.includes('b'));
console.log(content.indexOf('b')!=-1);

## 简化版 `filter` 方法

```
Array.prototype.filter = function(fn){
    let newArr = []
    console.log(this)
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        flag&&newArr.push(this[i])
    }
    return newArr
}
```

## 简化版 `every` 方法

```
//要求每一个元素都要符合条件，只要有一个不符合就退出
Array.prototype.every = function(fn){
    let flag = true
    for(let i = 0 ; i<this.length;i++){
         flag = fn(this[i])
        if(!flag){
          return false
        }
    }
    return flag
}
```

## 简化版 `some` 方法

```
//要求只要有一个元素都要符合条件
Array.prototype.some = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return flag
        }
    }
    return false
}
```


## 简化版 `find` 方法

```
//要求只要有一个元素都要符合条件,就返回这个元素
Array.prototype.find = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return this[i]
        }
    }
}
```
## 简化版 `findIndex` 方法

```
//要求只要有一个元素都要符合条件,就返回这个元素
Array.prototype.findIndex = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return i
        }
    }
}
```

## 模拟 `call` 方法
```
// 基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。 装箱转换
Function.prototype.selfCall = function(context) {
  let func = this //this 在哪调用指向哪，这里是在一个函数里面调用，所以指向调用他的函数
  console.log(this)
  context || (context = window)
  if (typeof func !== 'function') throw new TypeError('this is not function')
  context.fn = func //这里会产生装箱操
  let args = [...arguments].slice(1)
  let res = context.fn(args)
  delete context.fn
  return res
}
```

## 模仿 `apply` 方法
```
Function.prototype.selfApply = function(context) {
  let func = this //this 在哪调用指向哪，这里是在一个函数里面调用，所以指向调用他的函数
  context || (context = window)
  if (typeof func !== 'function') throw new TypeError('this is not function')
  context.fn = func //这里会产生装箱操
  let args = [...arguments][1]
  if (!args) {
    return context.fn()
  }
  let res = context.fn(args)
  delete context.fn
  return res
}
```

箭头函数里面的 `this` 是在写的时候定死的，指向外层的的 `this`

```
let obj = {
  name:'sunseekers',
  getName:()=>{
    console.log(this.name)
    }
  }
obj.getName() // 什么也没有



let obj1 = {
  name:'sunseekers',
  getName1:obj.getName()
  }
obj1.getName1() // 什么也没有
```

```
class Parent{
  constructor(name){
    this.name = name;//实例的私有属性
  }
  //静态属性是类的属性
  static hello(){
    console.log('hello');
  }
  //属于实例的公有属性，也就是相当于原型上的属性
  getName(){
    console.log(this.name);
  }
}
class Child extends Parent{
  constructor(name,age){
    //super指的是父类的构造函数
    super(name);
    this.age = age;
  }
  getAge(){
    console.log(this.age);
  }
}
```

类 和类的实例
一个属性如果放在原型上的话，是可能通过实例来调用的
但是放在类上的，不能通过实例来调用，只能用过类名来调用


正则表达式是匹配模式，要么匹配字符，要么匹配位置

正则里面 \ 可以表示转译

| 管道符 匹配的时候是惰性匹配，匹配上了前面的后面就不再尝试了

```
  var regex = /good|goodbye/g;
  var string = "goodbye";
  console.log( string.match(regex) );
  // => ["good"]
```

字符组  []
量词 {},+?*
多选分支|

匹配字符，无非就是字符组，量词，分支结构的组合使用罢了

/^([01][0-9]|[2][0-3]):[0-5][0-9]$/



