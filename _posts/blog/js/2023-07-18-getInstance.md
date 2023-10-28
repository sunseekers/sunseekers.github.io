---
layout: post
title: JS 单例模式
categories: [JavaScript]
description: 发现，探索 web 优质文章
keywords: JS 单例模式
---

## 概念
单例模式：保证一个类只有一个实例，并提供一个访问它的全局访问点。无论创建多少次，都只返回第一次所创建的那唯一的一个实例。



```
class SingleLoading {
  show () {
    console.log('这是一个单例Loading')
  }
}

let loading1 = new SingleLoading()
let loading2 = new SingleLoading()
console.log(loading1 === loading2) // false
```

这种情况下 loading1和loading2 是两个实例对象，两者互相独立的对象，各自占一块空间，显然不是我们要的单例模式。

单例模式想要做的，是不论我们创建多少次，它都只返回第一次创建的那唯一一个实例给你。

## 实现方式
静态方法实现

```
// 静态方法的实现
class SingleLoading {
  show () {
    console.log('这是一个单例Loading')
  }
  static getInstance(){
    console.log(90909,SingleLoading)
    // 判断是否已经创建过实例
    if (!SingleLoading.instance) {
      // 将创建的实例对象保持下来
      SingleLoading.instance = new SingleLoading()
    }
    return SingleLoading.instance
  }
}
const loading1 = SingleLoading.getInstance()
const loading2 = SingleLoading.getInstance()
console.log(loading1 === loading2) // true
```
上面代码中有一个static关键字，在getInstance方法前加上static，表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

闭包

```
class SingleLoading {
  show () {
    console.log('这是一个单例Loading')
  }
}
SingleLoading.getInstance = (function(){
  // 定义自由变量instance，模拟私有变量
  let instance = null

  return function(){
    if(!instance) {
       // 如果为null则new出唯一实例
      instance = new SingleLoading()
    }
    return instance
  }
})();
const loading3 = new SingleLoading().getInstance()
const loading4 = new SingleLoading().getInstance()
console.log(loading3 === loading4)
```