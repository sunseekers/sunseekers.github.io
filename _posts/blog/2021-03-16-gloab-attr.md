---
layout: post
title: HTML 全局属性的使用
categories: [HTML]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---
# 背景
在原生项目的开发中看到一些全局的属性使用，减少了很多的工作量，在没有框架的基础下

## 全局属性及用途

[data-*](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/data-*):全局自定义属性

可用来唯一标识，比如 `<li data-id="10784">Jason Walters, 003: Found dead in "A View to a Kill".</li>` 这个list的id，获取的时候 ele.dataset.id 即可。如果使用框架的时候可以在点击的时候把整条数据项穿进去，但是不借入框架的话，就有点麻烦
