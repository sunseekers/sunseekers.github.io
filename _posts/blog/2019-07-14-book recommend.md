---
layout: post
title: 推荐一本书《javascript 忍者秘籍2》
categories: [书籍推荐]
description: 发现，探索 web 优质文章
keywords: javascript 
---

![]({{ site.url }}/images/pages/003.jpeg)

# 为什么要推荐《javascript 忍者秘籍2》
是本好书，必须推荐。本文写于2019年01月30日，从我的掘金迁移过来


我要推荐一本书，《javascript 忍者秘籍2》，每次阅读都有不一样的收获。之前推荐这本书，只是简单的介绍了里面大概的目录结构。这一次我想对于每一个章节里我不懂的地方，或者说我认为重要的地方说一说。

关于这些知识点网上百度搜一大堆，比我写的好的多了去了，但是我还是要写，别人写的终究是别人的，我自己写了，记住了才是我的。同时也是自己对知识的二次记忆。

首先声明，文章里面所有的图片内容都来自书籍中，一千个读者就有一千个哈利波特，每个人的理解都不一样。我建议你去读读这本书，如果有不对的地方请指出

`JavaScript` 应用能在很多环境中执行。但是 `JavaScript` 最初的运行环境是浏览器环境，而其他运行环境也是借鉴于浏览器环境。


![](https://user-gold-cdn.xitu.io/2019/1/30/1689ee984fdc8773?w=1434&h=836&f=png&s=273452)

我们需要了解`javaScript` 工作核心原理和浏览器提供的核心 `api` 

我们所接触的大部分东西都有他的生命周期，比我们前端三大框架中 `vue` 和 `react`

![](https://user-gold-cdn.xitu.io/2019/1/30/1689ee9b82e50920?w=1200&h=3039&f=png&s=50021)


![](https://user-gold-cdn.xitu.io/2019/1/30/1689ee9e6ea450c3?w=801&h=611&f=png&s=15113)
还一个我没有接触过，就不说了，逃

都有一个从开始到结束的过程。我们的前端页面也是一样的，只是我们平时忽略他罢了。当我们在浏览器地址栏里面输入一串 `url` 开始他的生命周期就已经开始了，当我们关闭网页的时候他的生命周期就结束了。如图所示

![](https://user-gold-cdn.xitu.io/2019/1/30/1689eea1d752c805?w=1216&h=1238&f=png&s=462263)

作为用户我们所关注的是页面的构建和事件的处理

页面构建又可以分为解析 `HTML` 代码并且构建文档对象模型 `DOM` 和执行 `JavaScript` 代码

![](https://user-gold-cdn.xitu.io/2019/1/30/1689eea53a4c697a?w=1300&h=1196&f=png&s=411131)
注意了 `DOM` 是根据 `HTML` 代码来创建的，但是两者并不是相同的。我们可以把 `HTML` 代码看作浏览器页面 `UI` 构建初始 `DOM` 的蓝图。为了正确构建每个 `DOM`，浏览器还会修复它在蓝图中发现的问题。比如在 `p` 元素里面包裹 `div` 元素，最终渲染的并不是父子关系，而是兄弟关系。

当解析到脚本元素时，浏览器就会停止从 `HTML` 构建 `DOM`，并开始执行 `JavaScript` 代码。为了避免解析 `JavaScript` 代码花费太长时间，而阻塞页面渲染。我们都是建议把`JavaScript` 代码放到 `body` 元素后面.

浏览器暴露给 `JavaScript` 引擎的主要全局对象是 `window` 对象，它代表了包含着一个页面的窗口。 `window` 对象是获取所有其他全局对象、全局变量（甚至包含用户定义对象）和浏览器 `API` 的访问途径。全局 `window` 对象最重要的属性是 `document`，它代表了当前页面的 `DOM`。

包含在函数内的代码叫作函数代码，而在所有函数以外的代码叫作全局代码。
执行上下文也分两种 全局执行上下文和函数执行上下文；当 `JavaScript` 程序开始执行时就已经创建了全局上下文；而函数执行上下文是在每次调用函数时，就会创建一个新的
                         
页面构建完了之后变进入第二个阶段，事件处理

浏览器执行环境的核心思想基于：同一时刻只能执行一个代码片段，即所谓的单线程执行模型。采用事件队列来跟踪发生但是尚未执行的事件

![](https://user-gold-cdn.xitu.io/2019/1/30/1689eea8fcc94ad3?w=1784&h=1648&f=png&s=665011)
                       
 [函数具体介绍请看这](https://juejin.im/post/5aadbc31f265da239530c3c1)

![](https://user-gold-cdn.xitu.io/2019/1/30/1689eeac74324ea8?w=1208&h=580&f=png&s=148718)
 `JavaScript` 解析器必须能够轻易区分函数声明和函数表达式之间的区别。如果去掉包裹函数表达式的括号，把立即调用作为一个独立语句 `function() {}(3)`，`JavaScript` 开始解析时便会结束，因为这个独立语句以 `function` 开头，那么解析器就会认为它在处理一个函数声明。每个函数声明必须有一个名字（然而这里并没有指定名字），所以程序执行到这里会报错
 
 问： `var samurai = (() => "Tomoe")();` 和 `var ninja = (() => {"Yoshi"})();` 分别返回什么？
  
![](https://user-gold-cdn.xitu.io/2019/1/30/1689eeafe7a60eb2?w=1392&h=626&f=png&s=203344)
  
 函数具有属性，而且这些属性能够被存储任何信息，我们可以利用这个特性来做很多事情；例如：
  
  ```
  //储存函数,利用函数具有属性，而且这些属性能够被存储任何信息
  let store = {
    nextId:1,
    cache:{},
    add(fn){
      if(!fn.id && typeof fn =='function'){
        fn.id=this.nextId++
        this.cache[fn.id]=fn
        return true
      }
    }
  }
  //记忆函数
  function isPrime(value){
    if(!isPrime.answers){
      isPrime.answers = {}
    }
    if(!isPrime.answers[value]){
      console.log(1)
      return isPrime.answers[value] = value
    }
    console.log(3)
    return isPrime.answers[value]
  }
  isPrime(2)
```
Number、String 和 Boolean，三个构造器是两用的，当跟 new 搭配时，它们产生对象，当直接调用时，它们表示强制类型转换。

parseInt 和 parseFloat 精致转化

我们在给函数传参数的时候，除了有我们显示传入的实参之外，其实还包含了两个隐士参数 `this` 和 `arguments`。`this` 表示被调用函数的上下文(在什么环境下调用，就指向什么）。`arguments` 表示函数调用过程中传递的所有参数

`arguments` 是伪数组，在 `es6` 中有一个剩余参数的概念，剩余参数是一个真正的数组

特例： 箭头函数的 `this` 与声明所在的上下文的相同，无论何时在哪调用，只和声明的地方有关系（定义时的函数继承上下文）

闭包：允许函数访问并操作函数外部的变量，`windows` 就是一个最大的闭包（回调函数是另一种常见的使用闭包的情景）

`promise`  模拟一个请求， `axios` 实现原理，应该就是用他，我并没有阅读过源码我猜测的。

```
function getJSON(url){
    return new Promise((resolve,reject)=>{//创建并返回一个新的promise对象
        const request = new XMLHttpRequest()//创建一个XMLHttprequest对象
        request.open('GET',url)//初始化请求
        request.onload=function(){//“注册一个onload方法，当服务端的响应后会被调用”
                try{
                if(this.status==200){//“即使服务端正常响应也并不意味着一切如期发生，只有当服务端返回的状态码为200（一切正常）时，再使用服务端的返回结果”
                  resolve(JSON.parse(this.request))//“尝试解析JSON字符串，倘若解析成功则执行resolve,并将解析后的对象作为参数传入”
                }else{
                    reject(this.status+' '+ this.statusText)
                }
            }catch(e){
                reject(e.message)//“如果服务器返回了不同的状态码，或者如果在解析JSON字符串时发生了异常，则对该promise执行reject方法”
                }
        }
        request.onerror=function(){//“如果和服务器端通信过程中发生了错误，则对该promise执行reject方法”
          reject(this.status+' '+ this.statusText)
        }
        request.send()//发送请求
    })
}
getJSON("data/ninjas.json").then(ninjas => {

}).catch(e => fail("Shouldn't be here:" + e)); 　　//←---　使用由getJSON函数创建的promise来注册resolve和reject回调函数”

```                               
   


    
