---
layout: post
title: GC 日志详解
categories: [JVM]
description: Java GC 日志详解（一图读懂）
keywords: Java, GC
---

Java GC 日志详解（一图读懂）

---

#### 前言

Java GC日志可以通过设置 -XX:+PrintGCDetails 标志创建更详细的GC日志。具体的可以参考[JVM 配置GC日志](https://lihuimintu.github.io/2019/02/19/gcLog/)

#### 图解

以 ParallelGC 为例

YoungGC 日志解释如下（图片源地址：[这里](http://ww4.sinaimg.cn/large/6c8effc1tw1dmbux7knpoj.jpg)）

![YoungGC](/images/blog/2019-06-24-2.png){:height="80%" width="80%"}

FullGC（图片源地址：[这里](http://ww1.sinaimg.cn/large/6c8effc1tw1dmc55axrbsj.jpg)）:

![FullGC](/images/blog/2019-06-24-3.png){:height="80%" width="80%"}

图来源于网络，侵删。

---
参考链接
* [Java GC 日志详解（一图读懂）](https://www.jianshu.com/p/ade514d7c56b)







