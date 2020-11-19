---
layout: post
title: document 属性和方法
categories: [文章推荐]
description: 发现，探索 HTML 优质文章
keywords: HTML
---

# 补充一些被遗忘的document属性
如果用纯js写页面交互的时候，就可以用了，一直用框架的话，就很少会用到 [Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)

## importNode 节点拷贝
[document.importNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/importNode):
将外部文档的一个节点拷贝一份,然后可以把这个拷贝的节点插入到当前文档中.
源节点不会从外部文档中删除,被导入的节点是源节点的一个拷贝.

[node.cloneNode](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/cloneNode)=>也是节点的复制

## template 内容模板元素
[template](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template):该内容在加载页面时不会呈现，但随后可以(原文为 may be)在运行时使用JavaScript实例化。

```
  <div id="app">
    <template id="template" >
      <h2 >${title}</h2>
    </template>
  </div>
    <script>
    String.prototype.interpolate = function (params) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        return new Function(...names, `return \`${this}\`;`)(...vals);
    };;
        
    let title={title:'Tierertle'}
    let template = document.querySelector('#template').innerHTML

    document.querySelector('#app').innerHTML=template.interpolate(title)
    </script>
```
## 复制粘贴剪贴 事件
背景：当我们百度一个东西的时候，找到了之后想要复制出来，为我们自己所用。但是有时候复制的时候网站会提示你，让你登录他们的网站。
这个是怎么做到的呢？

监听元素的 [`copy`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/copy_event) 事件
```
document.addEventListener('copy', (event) => {
    console.log('copy action initiated')
});

```
同理还有剪切和粘贴事件，代码一样的只是替换一下元素 [cut event](https://developer.mozilla.org/en-US/docs/Web/API/Document/cut_event)

[paste event](https://developer.mozilla.org/en-US/docs/Web/API/Document/paste_event)

## scrollingElement
[scrollingElement](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/scrollingElement):可以自动识别不同平台上的滚动容器

[使用document.scrollingElement控制窗体滚动高度](https://www.zhangxinxu.com/wordpress/2019/02/document-scrollingelement/)

## querySelectorAll
[querySelectorAll](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelectorAll):获取指定属性的元素

此示例返回文档中所有`<div>`元素的列表，其中`class`包含"`note`"或"`alert`"：
`var matches = document.querySelectorAll("div.note, div.alert");`

此示例使用属性选择器返回文档中属性名为"data-src"的div元素列表：
`var matches = document.querySelectorAll(“div[data-src]");`

此示例使用自定义属性选择器返回文档中属性名为"`is-name`和`is-age`的元素列表：
`var matches = document.querySelectorAll('[is-name],[is-age]')`


## Element.innerHTML 和 Node.textContent(innerText)  的区别
### Element.innerHTML
Element.innerHTML 属性设置或获取HTML语法表示的元素的后代。

Note: 如果一个 `<div>`, `<span>`, 或` <noembed> `节点有一个文本子节点，该节点包含字符 (&), (<),  或(>), `innerHTML` 将这些字符分别返回为&amp;, &lt; 和 &gt; 。使用Node.textContent  可获取一个这些文本节点内容的正确副本。

[element.innerHTML](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/innerHTML)

```
document.getElementsByTagName('a')[49].innerText
"<div>"
document.getElementsByTagName('a')[49].textContent
"<div>"
document.getElementsByTagName('a')[49].innerHTML
"<code>&lt;div&gt;</code>"
```

设置的时候可能会有潜在安全性问题存在

### Node.textContent
`Node` 接口的 `textContent` 属性表示一个节点及其后代的文本内容。

与 `innerText` 的区别

不要被 `Node.textContent` 和 `HTMLElement.innerText` 的区别搞混了。虽然名字看起来很相似，但有重要的不同之处：

`textContent` 会获取所有元素的内容，包括 `<script>` 和 `<style>` 元素，然而 `innerText` 只展示给人看的元素。

`textContent` 会返回节点中的每一个元素。相反，innerText 受 CSS 样式的影响，并且不会返回隐藏元素的文本，
此外，由于 innerText 受 CSS 样式的影响，它会触发回流（ reflow ）去确保是最新的计算样式。（回流在计算上可能会非常昂贵，因此应尽可能避免。）

与 `textContent` 不同的是, 在 Internet Explorer (小于和等于 11 的版本) 中对 innerText 进行修改， 不仅会移除当前元素的子节点，而且还会永久性地破坏所有后代文本节点。在之后不可能再次将节点再次插入到任何其他元素或同一元素中。

与 `innerHTML` 的区别
正如其名称，Element.innerHTML 返回 HTML。通常，为了在元素中检索或写入文本，人们使用 innerHTML。但是，textContent 通常具有更好的性能，因为文本不会被解析为HTML。

此外，使用 textContent 可以防止 XSS 攻击。

[Node.textContent](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent)