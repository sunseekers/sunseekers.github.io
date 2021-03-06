---
layout: post
title: 虚拟 DOM
categories: [JavaScript]
description: DOM
keywords: DOM
---

# 虚拟 DOM

简单说说虚拟 DOM

## 真实的 DOM 和框架操作 DOM？

virtual DOM 也就是虚拟节点，它通过js的对象模拟真实的dom中的节点，然后通过特定的render渲染成真实的dom节点，操作真实的 DOM 这种方式虽然简单粗暴，但是很明显还有一个问题就是这样无法包含节点的状态。比如它会失去当前聚焦的元素和光标，以及文本选择和页面滚动位置，这些都是页面的当前状态。

对于 `DOM` 这么多属性，其实大部分属性对于做 `diff` 是没有任何用处的，所以如果用更轻量级的 `JS` 对象来代替复杂的 `DOM` 节点，然后把对 `DOM` 的 `diff` 操作转移到 `JS` 对象，就可以避免大量对 `DOM` 的查询操作。这个更轻量级的 `JS` 对象就称为 `Virtual DOM`

框架的意义在于为你掩盖底层的 `DOM` 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 `DOM` 操作更快，因为框架的 `DOM` 操作层需要应对任何上层 `API` 可能产生的操作，它的实现必须是普适的。

## Virtual DOM 存在的前提

`Virtual DOM` 存在（从我的理解来看），主要是三个方面，分别是：一个对象，两个前提，三个步骤。

一个对象指的是 `Virtual DOM` 是一个基本的 `JavaScript` 对象，也是整个 `Virtual DOM` 树的基本。

两个前提分别是 `JavaScript` 很快和直接操作 `DOM` 很慢，这是`Virtual DOM` 得以实现的两个基本前提。得益于 `V8` 引擎的出现，让 `JavaScript` 可以高效地运行，在性能上有了极大的提高。直接操作 `DOM` 的低效和 `JavaScript` 的高效相对比，为 `Virtual DOM` 的产生提供了大前提。

三个步骤指的是 `Virtual DOM` 的三个重要步骤，分别是：生成`Virtual DOM` 树、对比两棵树的差异、更新视图。

`DOM` 是前端工程师最常接触的内容之一，一个 `DOM` 节点包含了很多的内容，但是一个抽象出一个 `DOM` 节点却只需要三部分：节点类型，节点属性、子节点。所以围绕这三个部分，我们可以使用 `JavaScript` 简单地实现一棵 `DOM` 树，然后给节点实现渲染方法，就可以实现虚拟节点到真是 `DOM` 的转化。

```
// 虚拟dom type类型，props属性，children子节点
//创建一个类
class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

//创建一个元素
function createElement() {
  return new Element(type, props, children)
}

// render 方法可以将vnode转化为真实dom
function render(eleObj) {
  // 创建一个元素
  let el = document.createElement(eleObj.type)
  for (let key in eleObj.props) {
    setAttr(el, key, eleObj.props[key])
  }
  eleObj.children.forEach(child => {
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    el.appendChild(child)
  })
  return el
}

// 设置属性
function setAttr(node, key, value) {
  props.forEach(element => {
    switch (key) {
      case 'value': //node是一个input或者textarea
        if (node.tagName.toUpperCase() === "INPUT" || node.tagName.toUpperCase() === "TEXEAREA") {
          node.value = value
        } else {
          node.setAttribute(key, value)
        }
        break;
      case 'style':
        node.style.cssText = value
        break;
      default:
        node.setAttribute(key, value)
        break
    }
  });
}
// 渲染页面
function renderDom(el, target) {
  target.appendChild(el)
}
```

使用的时候 `createElement()`, `render()`, `renderDom()`

比较两棵 `DOM` 树的差异是 `Virtual DOM` 算法最核心的部分，这也是我们常说的的 `Virtual DOM` 的 `diff` 算法。在比较的过程中，我们只比较同级的节点，非同级的节点不在我们的比较范围内，这样既可以满足我们的需求，又可以简化算法实现。

## 框架的意义？

框架存在的意义是什么？是提高性能？提高开发效率？亦或是其他用途，每个人对框架的理解不同，答案也不尽相同。但是不得不承认，存在框架的情况下，项目的可维护性有了极大的提高，而对于其他方面就要做出牺牲，比如性能。在上面的性能测试中，其实完全走入了一个误区，在测试中我们用到的原生的操作其实是“人为”地对操作进行优化之后的结果，而如果抛开人为优化的前提，最终的结果可能就不是这样了。`Virtual DOM` 的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。这一点是原生操作远远无法替代的

虚拟 `DOM` 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 `DOM`

