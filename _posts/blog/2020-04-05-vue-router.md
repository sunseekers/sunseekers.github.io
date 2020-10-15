---
layout: post
title: vue-router 实现原理
categories: [vue]
description: vue-router
keywords:  vue-router
---

# vue-router 手写一个估计写不来
看别人的代码，学习一下实现思路

## 参考资料
[前端路由简介以及vue-router实现原理](https://zhuanlan.zhihu.com/p/37730038)

[muwoo/blogs 实现地址](https://github.com/muwoo/blogs/tree/master/src/router)

[Vue Router：如何实现一个前端路由？（下）](https://kaiwu.lagou.com/course/courseInfo.htm?courseId=326#/detail/pc?id=4076)
## 理解思路
前端路由的好处是无须刷新页面，减轻了服务器的压力，提升了用户体验

根据vue-router的用法，面向过程编程，去看看是怎么实现的
1. 路由对象的创建（一个构造函数）
  1. 当前路径的一些信息
  2. 路由跳转前后的一些辅助方法和属性

2. 路由的安装
  1. 全局注册 RouterView 和 RouterLink 组件（可以在任何组件中去使用这俩个组件的原因）
  2. 通过 provide 方式全局注入 router 对象和 reactiveRoute 对象

3. 路径的管理
  1. 路由想要发生变化，就是通过改变路径完成的
  2. 路径发生改变的时候，发生一系列的变化，history hash memory

4. 路径和路由组件的渲染的映射

5. 导航守卫的实现

