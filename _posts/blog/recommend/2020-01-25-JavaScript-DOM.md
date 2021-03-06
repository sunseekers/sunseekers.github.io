---
layout: post
title: 《javascript DOM 编程艺术》第二版
categories: [书籍推荐]
description: 发现，探索 web 书籍
keywords: javascript 
---

# 推荐原因
二零二零年读完这本11年出版的书，和现在的很多东西已经脱节了。感觉比较入行不久的前端工程师看吧，虽然现在是虚拟DOM横向天下的时代，仿佛不懂远古时代的DOM知识也能交付，但是缺少了这块知识的工程师就犹如无根之树，风大一点就倒。对于前端技术的理解最终都必须落到这样的实处，因为它才是最原始的载体。作者思路也很清晰的，举的例子也不错，不愧为经典。在读书的过程中好像看到了前辈们代码里面做各种浏览器兼容，实质性的业务代码很少。比较适合初入门的学习，认识和学习DOM操作，不借用库和插件，于我而言是对已有的知识做查漏补缺，对于 DOM 操作我已有的知识还是比较弱的

## 前言
易学易用的技术就像一把双刃剑。因为容易学习和掌握，它们往往会在很短的时间内就为人们广泛接受，但也往往意味着缺乏高水平的质量控制措施。

## 达成目标的过程与目标本身同样重要。

代码都是思想和概念的体现，看一个人呢的代码和代码风格能够知道这个人对知识的掌握程度。

什么是DOM？简单地说，DOM是一套对文档的内容进行抽象和概念化的方法。

javaScript 属于解释型程序，ts 出现的就是为了我们在编写代码的时候提醒我们，而不用等到运行的时候才发现

用编译型语言编写的代码有错误，这些错误在代码编译阶段就能被发现。而解释型语言代码中的错误只能等到解释器执行到有关代码时才能被发现。与解释型语言相比，编译型语言往往速度更快，可移植性更好，但它们的学习曲线也往往相当陡峭。

在JavaScript语言里，变量和其他语法元素的名字都是区分字母大小写的

通常驼峰格式是函数名、方法名和对象属性名命名的首选格式。

函数的真正价值体现在，我们还可以把它们当做一种数据类型来使用，这意味着可以把一个函数的调用结果赋给一个变量：

## DOM 的解析

文档：DOM中的“D”，如果没有document（文档）, DOM也就无从谈起

对象：DOM中的“O”，指的是对象，对象有三种形式

❑ 用户定义对象（user-defined object）：由程序员自行创建的对象。本书不讨论这种对象。

❑ 内建对象（native object）：内建在JavaScript语言里的对象，如Array、Math和Date等。

❑ 宿主对象（host object）：由浏览器提供的对象。即使是在JavaScript的最初版本里，对编写脚本来说非常重要的一些宿主对象就已经可用了，它们当中最基础的对象是window对象。

window对象对应着浏览器窗口本身，这个对象的属性和方法通常统称为BOM（浏览器对象模型）

DOM中的“M”代表着“Model”（模型），某种事物的表现形式，DOM代表着加载到浏览器窗口的当前网页。浏览器提供了网页的地图（或者说模型），而我们可以通过JavaScript去读取这张地图。DOM把文档表示为一棵家谱树

节点：它表示网络中的一个连接点，DOM文档是由节点构成的集合，节点是文档树上的树枝和树叶而已。包括三种节点元素节点、文本节点和属性节点。

![]({{ site.url }}/images/book/8.png)


事实上，文档中的每一个元素都是一个对象

❑ 一份文档就是一棵节点树。

❑ 节点分为不同的类型：元素节点、属性节点和文本节点等。

❑ getElementById将返回一个对象，该对象对应着文档里的一个特定的元素节点。

❑ getElementsByTagName和getElementsByClassName将返回一个对象数组，它们分别对应着文档里的一组特定的元素节点。

❑ 每个节点都是一个对象。

setAttribute做出的修改不会反映在文档本身的源代码里。这种“表里不一”的现象源自DOM的工作模式：先加载文档的静态内容，再动态刷新，动态刷新不影响文档的静态内容。这正是DOM的真正威力：对页面内容进行刷新却不需要在浏览器里刷新页面

DOM还提供了许多其他的属性和方法，如nodeName、nodeValue、childNodes、nextSibling和parentNode等，

onclick事件处理函数所触发的JavaScript代码里增加一条return false语句，就可以防止用户被带到目标链接窗口（return false来阻止提交表单或者继续执行下面的代码，通俗的来说就是阻止执行默认的行为

不管你想通过JavaScript改变哪个网页的行为，都必须三思而后行。首先要确认：为这个网页增加这种额外的行为是否确有必要？

访问DOM的方式对脚本性能会产生非常大的影响，只要是查询DOM中的某些元素，浏览器都会搜索整个DOM树，从中查找可能匹配的元素

如果在HTML文档完成加载之前执行脚本，此时DOM是不完整的。

函数应该只有一个入口和一个出口

把函数绑定到window.onload事件就非常易行了。

你的脚本不应该对HTML文档的内容和结构做太多的假设。

但createElement方法帮不上忙，它只能创建元素节点。你需要创建一个文本节点，你可以用createTextNode方法来实现它。

Ajax技术的核心就是XMLHttpRequest对象。这个对象充当着浏览器中的脚本（客户端）与服务器之间的中间人的角色。以往的请求都由浏览器发出，而JavaScript通过这个对象可以自己发送请求，同时也自己处理响应。

服务器在向XMLHttpRequest对象发回响应时，该对象有许多属性可用，浏览器会在不同阶段更新readyState属性的值，它有5个可能的值：
❑ 0表示未初始化

❑ 1表示正在加载

❑ 2表示加载完毕

❑ 3表示正在交互

❑ 4表示完成

只要readyState属性的值变成了4，就可以访问服务器发送回来的数据了。

访问服务器发送回来的数据要通过两个属性完成。一个是responseText属性，这个属性用于保存文本字符串形式的数据。另一个属性是responseXML属性，用于保存Content-Type头部中指定为"text/xml"的数据，其实是一个DocumentFragment对象。你可使用各种DOM方法来处理这个对象。而这也正是XMLHttpRequest这个名称里有XML的原因。

DOM方法来动态创建标记的例子。

❑ createElement方法
❑ createTextNode方法
❑ appendChild方法
❑ insertBefore方法

使用这些方法的关键是将Web文档视为节点树

行为层（behavior layer）负责内容应该如何响应事件这一问题。这是JavaScript语言和DOM主宰的领域

❑ 使用(X)HTML去搭建文档的结构；

❑ 使用CSS去设置文档的呈现效果；

❑ 使用DOM脚本去实现文档的行为。

不过，在这三种技术之间存在着一些潜在的重叠区域，你也已见过这样的例子。用DOM可以改变网页的结构，诸如createElement和appendChild之类的DOM方法允许你动态地创建和添加标记。在CSS上也有这种技术相互重叠的例子。诸如：hover和：focus之类的伪类允许你根据用户触发事件改变元素的呈现效果。

改变元素的呈现效果当然是表示层的“势力范围”，但响应用户触发的事件却是行为层的领地。表示层和行为层的这种重叠形成了一个灰色地带。

档中的每个元素都是一个对象，每个对象又有着各种各样的属性。有一些属性告诉我们元素在节点树上的位置信息。比如说，parentNode、nextSibling、previousSibling、childNodes、firstChild和lastChild这些属性，就告诉了我们文档中各节点之间关系信息。

来自外部文件styles.css的样式已经不能再用DOM style属性检索出来了。`<head>部分的<style>`标签里的样式也是不能检测出来

style对象只包含在HTML代码里用style属性声明的样式。但这几乎没有实用价值，因为样式应该与标记分离开来。因为有了class，只要有可能，就应选择更新className属性，而不是去直接更新style对象的有关属性

让“行为层”干“表示层”的活，并不是理想的工作方式

但是如果你不能理解它们背后的工作机制，对你和你的程序都不能算是什么好事。如果你对某个库理解不透，而这个库又假设你知道相关细节，那你就很可能被一些琐碎的问题绊住脚。

$$('*')和document.all是一样的效果，返回当前页面所有的html标签

## javaScript 框架设计
在最初的javascript书籍中它们都会教导我们把JavaScript逻辑写在window.onload回调中，以防DOM树还没有建完就开始对节点进行操作,导致出错

（1）取得依赖列表的第一个 ID，转换为 URL。无论是通过basePath+ID+".js"，还是以映射的方式直接得到。

（2）检测此模块有没有加载过，或正在被加载。因此我们需要一个对象来保持所有模块的加载情况。当用户从来没有加载过此节点时，就进入加载流程

（3）创建script节点，绑定onerror、onload、onreadychange等事件判定加载成功与否，然后添加href并插入DOM树，开始加载。

（4）将模块的 URL，依赖列表等构建成一个对象，放到检测队列中，在上面的事件触发时进行检测。

库是解决某个问题而拼凑出来的一大堆函数与类的集合

contains方法：判定一个字符串是否包含另一个字符串。常规思维，使用正则，但每次都要用new RegExp来构造，性能太差，转而使用原生字符串方法，如，ndexOf、lastIndexOf、 search。

```
function contains(target,it){
  return target.indexOf(it)!=-1
}
```

startsWith方法：判定目标字符串是否位于原字符串的开始之处，可以说是contains方法的变种。

```
function startsWith(targe,str,ignorecase){ // ignorecase是否要忽略大小写
  let start_str=target.substr(0,str.length)
  return ignorease?start_str.toLowerCase()===str.toLowerCase():start_str===str
}
```

创建一个对象，拥有length属性，然后利用call方法去调用数组原型的join方法，省去创建数组这一步，性能大为提高。重复次数越多，两者对比越明显。另，之所以要创建一个带length属性的对象，是因为要调用数组的原型方法，需要指定call的第一个参数为类数组对象。而类数组对象的必要条件是其length属性的值为非负整数。利用闭包将类数组对象与数组原型的jion方法缓存起来，省得每次都重复创建与寻找方法。

```
let repeat=(function(){
  let join=Array.prototype.join
  let obj={}
  return (target,n)=>{
    obj.length=n+1
    return join.call(obj,target)
  }
})
```

random 方法，从数组中随机抽选一个元素出来

```
function random(target){
  return target[Math.floor(Math.random()*target.length)]
}
```

接口就是一个空心化的方法，用于提供一个语义化且便捷的名字而已，实现全部转至内部去。