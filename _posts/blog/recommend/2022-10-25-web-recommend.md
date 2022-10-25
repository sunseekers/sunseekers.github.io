---
layout: post
title: 路由的实现方式
categories: [文章推荐]
description: 推荐我个人认为好的文章
keywords: 文章推荐
---

来看看前端路由实现方式，共享有趣的文章，分享使用的文章
## 文章推荐

### 1. hash和history路由的实现模式

推荐理由：

1. hash的实现全部在前端，不需要后端服务器配合，兼容性好，主要是通过监听hashchange事件，处理前端业务逻辑

2. history的实现，需要服务器做以下简单的配置，通过监听pushState及replaceState事件

[面试官为啥总是喜欢问前端路由实现方式](https://juejin.cn/post/7127143415879303204)

### js 如何触发自定义事件

推荐理由：创建 >> 初始化 >> 派发 >> 监听 

比如我们创建一个自定义的403事件，当我们发现页面没有权限的时候，就去派发他。实现没权限就触发403事件

```
  // 无权限=> axios
  document.dispatchEvent(new CustomEvent('403'))
  // 
  document.addEventListener('403', () => {
  router.replace('/403')
})
```


[js使用dispatchEvent派发自定义事件](https://juejin.cn/post/6844903833227771917)

### js 如何触发自定义事件

推荐理由：

1. 前端资源的两种缓存模式浏览器缓存和http缓存 

2. http 缓存的如何进行设置

[中高级前端工程师都需要熟悉的技能--前端缓存](https://juejin.cn/post/7127194919235485733)