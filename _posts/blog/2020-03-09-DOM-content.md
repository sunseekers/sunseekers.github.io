---
layout: post
title: Element.innerHTML 和 Node.textContent(innerText)  的区别
categories: [文章推荐]
description: 发现，探索 HTML 优质文章
keywords: HTML
---

# 字面意思勉强可以理解
这是一个平常很少用的属性，可以了解，有需要的时候看看

## Element.innerHTML
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

## Node.textContent
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