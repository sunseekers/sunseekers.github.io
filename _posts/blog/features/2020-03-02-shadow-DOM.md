---
layout: post
title: shadow DOM 实现自定义组件
categories: [功能实现]
description: shadow DOM 
keywords: shadow DOM 
---


# shadow DOM 怎么就可以实现自定义组件？
背景：同事写的一个[xy-ui](https://github.com/XboxYan/xy-ui)，在看源码的时候看到了我不熟悉，没有见过的的 `const shadowRoot = this.attachShadow({ mode: 'open' }); shadowRoot.innerHTML`。抱着好奇学了一下他是谁

## video 元素只是简单的一个元素吗？
`video` 标签我想大部分的前端小伙伴都用过的，可是 `video` 真的只是一个简简单单的标签，所见非所的。

![]({{ site.url }}/images/blog/video.png)

惊奇的发现原来video 元素里面是包含了其他的元素的，只是平常的时候我们见不着，他是被隐藏起来，并不是没有。那我们怎么让他显示出来。
让我们看见呢

![]({{ site.url }}/images/blog/video1.png)

我们做的一个小小的设置就是把shaow DOM 显示出来，心细的小伙伴发现video标签下面有一个 shadow-root  节点。节点里面就有很多的dom节点，播放的时间，控制条
等等东西都可以定位到他的dom。证实了video并不是一个标签，而是一个组件，只是组件内的东西，不允许我们改变，我们不容易看见。我们给他取一个名字，影子节点

##  video 元素本质是啥
可以称之为组件，Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。video 就是一个 web components 。shadow DOM 里面的内容不被我们所见

[ shadow DOM ](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM):用法很简单

1. Element.attachShadow() 方法来将一个 shadow root 附加到任何一个元素上

```
const notificatonNew = document.getElementById('notificatonNew');
const shadowroot = notificatonNew.attachShadow({
mode: 'open'
});
```

2. 创建 shadow 内容，之后就
```
shadowRoot.innerHTML = `
<style>
    .wrapper {
    color: red;
    border: 1px red solid
    }
</style>
<p>这里是一个shadow dom节点</p>
`
```

3. 一个组件就这样完成渲染在页面上了，这只是一个简简单单的dom

[Element.attachShadow()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow):法给指定的元素挂载一个Shadow DOM，并且返回对 ShadowRoot 的引用。

## 我们如何实现一个类似 video 
如何像 video 一样全局任意使用呢？

页面中所有的元素都继承于 [HTMLElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement) 接口，在自定义元素的时候，我们让我们自定义的元素也继承
与他就好了

```
class XyButton extends HTMLElement{}
```

用 [window.customElements](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/customElements) 方法注册一个全局的元素，接下来就是你想在哪使用就在哪用

```
if(!customElements.get('xy-button')){
    customElements.define('xy-button', XyButton);
}
```

把上面的代码整合一下就是

```
export default class XyButton extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `<style>
    .wrapper {
    color: red;
    border: 1px red solid
    }
</style>
<p>这里是一个shadow dom节点</p>
`
}
```

由于是继承于HTMLElement接口，所以HTMLElement有的方法和属性，我们自定义的元素都有。像什么各种事件

## 参考文章
[shadow dom的作用和用法详解(createShadowRoot, attachShadow)](https://blog.csdn.net/qdmoment/article/details/102782378)

[浅谈 shadow dom 中的 template 和 slot](https://www.jianshu.com/p/9293cac60920)

[什么是shadowDOM](https://blog.csdn.net/Aijn_faluts/article/details/88658884)