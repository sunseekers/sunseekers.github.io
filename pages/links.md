---
layout: page
title: 一个人的学习是孤独的
description: 没有博客推荐的博客是孤独的
keywords: 博客推荐
comments: true
menu: 博客
permalink: /links/
---

> 推荐一些我觉得不错的博客，或者公众号，互相学习

{% for link in site.data.links %}
* [{{ link.name }}]({{ link.url }})
{% endfor %}
