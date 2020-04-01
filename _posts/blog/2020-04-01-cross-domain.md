---
layout: post
title: 跨域
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: web
---

# 为什么浏览器不支持跨域

为了安全期间，避免出现安全漏洞，cookie，LocalStorage，DOM 元素有同源策略 ，iframe（当我面在网页里面嵌入 a 网页的时候，如果支持跨域，当用户登录 a 网页的时候我们就能够获取到 a 网页的账号密码，那肯定是不安全的）ajax 不支持跨域（如果支持跨域，接口都对外暴露了）

## 实现跨域

jsonp
cors 纯后端提供
postMessage
document.domain
window.name
location.hash
http-proxy
nginx
websocket
