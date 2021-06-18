---
layout: post
title: addEventListener 事件监听
categories: [JavaScript]
description: addEventListener 事件监听
keywords: addEventListener 事件监听
---

# 事件监听执行的顺序

在元素或者浏览器上面添加事件监听，不知道你是否知道各种情况下面他们的执行顺序？如果对于事件流特别清楚，应该不难。对我来说有一点点的难道

## 一句话说事件流

从 `html` 元素到目标元素是捕获阶段，从目标元素到 `html` 是冒泡阶段。

## 事件监听直接绑定在目标元素上面

1. 目标元素上面绑定两个单击监听事件，问两个事件的执行先后顺序？

```
<html>
<body>
<div>
<button id='botton'>qqqq</button>
</div>
</body>
<script>
const botton = document.getElementById('botton')
botton.addEventListener('click',function(){
console.log('我是目标元素，不存在冒泡阶段或者捕获阶段，执行顺序是从上到下依次执行，谁先注册谁先执行');
})
botton.addEventListener('click',function(){
console.log('我是目标元素，不存在冒泡阶段或者捕获阶段，执行顺序是从上到下依次执行，谁先注册谁先执行');
},true)
</script>
</html>
```

在目标元素上添加事件监听事件，不管是捕获(`true`)还是冒泡(`false`),默认是 `false`，都是按照从上到下的执行顺序，谁先定义谁先执行。

原因很简单：对于事件目标上的事件监听器来说，事件会处于“目标阶段”，而不是冒泡阶段或者捕获阶段。在目标阶段的事件会触发该元素（即事件目标）上的所有监听器，而不在乎这个监听器到底在注册时 `useCapture` 参数值是 `true` 还是 `false`

## 事件监听直接绑定在 window 上面

如果默认都是触发类型事件冒泡，默认形式，就是从上往下执行，谁先定义，谁先执行

```
<html>
<body>
<div>
<button id='botton'>qqqq</button>
<span>hjhj</span>
</div>
</body>
<script>
const botton = document.getElementById('botton')
window.addEventListener('click',function(){
console.log('false 是冒泡事件');
})
window.addEventListener('click',function(){
console.log('true 是捕获事件');
})
</script>
</html>
```

如果默定义了某一个是触发类型捕获(`true`)，不管定义顺序的前后，都是先执行捕获事件，然后冒泡事件

```
<html>
<body>
<div>
<button id='botton'>qqqq</button>
</div>
</body>
<script>
const botton = document.getElementById('botton')


window.addEventListener('click',function(){
console.log('false 是冒泡事件');
})
window.addEventListener('click',function(){
console.log('true 是捕获事件');
},true)
</script>
</html>
```
因为事件流包括三个阶段：事件捕获阶段、处于目标阶段和事件冒泡阶段，所以只要定义了捕获阶段执行，那他就是先执行的，因为他在事件流的顶端

## 事件委托

利用的是事件冒泡机制，点击子元素的时候，一层一层往上找，找到上级元素的时候，发现她身上有事件，那就把事件给执行了。如果在父元素上面添加了 `e.stopPropagation()`（阻止冒泡）和 `addEventListener` 第三个参数是 `true` 则子元素绑定的事件失效，但是不影响父元素的事件，待讨论

```
  <ul>
    <li onclick="changeText(this)">1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
    <li>1</li>
  </ul>
  <script>
    const ul = document.getElementsByTagName("ul")[0]
    ul.addEventListener('click', (e) => {
     // e.stopPropagation();
      console.log(e.target, '事件对象');
    }, true)

    function changeText(id) {
      console.log('hhhhh');
      id.innerHTML = "Hello:)";
    }
  </script>
  ```

  ## CustomEvent自定义事件
  [CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent) 函数用来创建自定义函数，dispatchEvent触发自定义事件的执行(ps:第一次接触到CustomEvent事件和dispatchEvent方法)

  ```
   let index = document.querySelector('.index')

  1. 定义这个自定义的事件，传入参数
  let event = new CustomEvent('cat', {
    detail: {
      "hazcheeseburger": true
    }
  })

  2. 监听这个自定义的事件
  index.addEventListener('cat', (e) => {
    console.log('自定义事件', e);
  })

  3. 调用这个自定义事件
  index.addEventListener('click', () => {
    index.dispatchEvent(event, 'sunseekerxw')//点击的时候把自定义事件执行了
  })
  ```

[EventTarget.dispatchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent):向一个指定的目标派发一个事件,  并以合适的顺序同步调用目标元素相关的事件处理函数。


### js给input的value赋值，触发change事件

```
const props = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
Object.defineProperty(HTMLInputElement.prototype, 'value', {
    ...props,
    set (v) {
        let oldv = this.value;
        props.set.call(this, v);
        // 手动触发change事件
        if (oldv !== v) {
              input.dispatchEvent(new CustomEvent('change'));
        }
    }
});
```

[输入框value属性赋值触发js change事件的实现](https://www.zhangxinxu.com/wordpress/2021/05/js-value-change/)

### react 内部改写了.value的赋值操作，从 dom 上简单粗暴的修改肯定是不行的，因为 react 内部状态没有改过来，导致认为前后没有发生变化

```
const props = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

const input = document.querySelector('.chapter-name input');
Object.defineProperty(input, 'value', {
    ...props,
    set (v) {
        let oldv = this.value;
        props.set.call(this, v);
        // 手动触发change事件
        if (oldv !== v) {
              input.dispatchEvent(new Event('input', {bubbles: true}));
        }
    }
});
```
## addEventListener 其实支持第四个参数，可实现只点击一次事件

```
      var eleHistoryContent = document.querySelector("#JsHistoryContent")
      eleHistoryContent.addEventListener('scroll',()=>{
        console.log('发生滚动了');
        // 如果只有第一次发生滚动监听就传人{once:true}，如果一直滚动一直监听，就去掉{once:true}
      },{once:true})
```

## new Event 和  new CustomEvent 的区别
大概就是又没有可不可以传参数的区别吧

[Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)

CustomEvent 函数继承与[Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)接口

### 如果浏览器不支持CustomEvent，我们要怎么polyfill？？
自己写一个呗

```
  (function () {
    if (typeof window.CustomEvent === 'function') return false
    var CustomEvent = function (event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      }
      var evt = document.createEvent("CustomEvent")
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype=window.Event.prototype
    window.CustomEvent=CustomEvent
  })()
```


参考文章：[JS CustomEvent自定义事件传参小技巧](https://www.zhangxinxu.com/wordpress/2020/08/js-customevent-pass-param/)
