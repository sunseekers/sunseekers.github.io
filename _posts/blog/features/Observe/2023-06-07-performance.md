---
layout: post
title: 用 performance 测量网页性能和加载情况
categories: [功能实现]
description: 用 performance 测量网页性能和加载情况
keywords: 用 performance 测量网页性能和加载情况
---

## performance 是什么
window.performance 是一个 JavaScript API，它提供了一些方法和属性，用于测量网页的性能和加载情况。通过 window.performance 可以访问到许多浏览器内置的性能相关信息，比如页面资源加载时间，页面渲染时间，请求响应时间等等。使用 window.performance 可以帮助开发者进行性能分析和优化工作。比如常用的 `performance.getEntriesByType('navigation')`

更多信息参考文档 [performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API) 

定义页面性能的标志，获取对应的标准值，从而发现影响页面性能的问题

基本性能指标： request数，打包大小，load时间

FCP：首次内容绘制，优化加载顺序，提供非阻塞的加载形式，页面分批分层逐步加载，加强用户体验感受，尽可能少的等待

LCP：最大内容绘制，核心内容：服务器时间，渲染阻止的js和css，资源加载时间，客户端渲染

TBT：积累阻塞时间，网站的执行和运行。第一内容时间（FCP和TTI的时间差，ttl 页面完全可交互时间，不必要的js加载解析执行。减少主线成工作和js执行时间

请求越少越好，传输1M以内，load 1.5s以内

## 监控网页需要哪些指标

<img src='https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/timestamp-diagram.svg'/>


`performance.getEntriesByType('navigation')[0]`: 用于获取导航相关性能信息

```
Number(perf.domainLookupEnd - perf.domainLookupStart); // DNS解析时间
Number(perf.connectEnd - perf.connectStart); // TCP连接时间
Number(perf.responseStart - perf.requestStart); // 网络请求耗时 TTFB
Number(perf.responseEnd - perf.responseStart); // 网络资源传输时间
Number(perf.domInteractive - perf.responseEnd); // DOM解析完成
Number(perf.loadEventStart - perf.domContentLoadedEventEnd); // 同步资源加载时间
Number(perf.responseStart - perf.domainLookupStart); // 首包时间
Number(perf.responseEnd - perf.fetchStart); // 白屏时间/首次渲染时间
Number(perf.domInteractive - perf.fetchStart); // 首次可交互时间
Number(perf.domContentLoadedEventEnd - perf.fetchStart); // dom ready
Number(perf.loadEventStart - perf.fetchStart); // 页面完全加载时间
```

## Web Performance常见性能指标

LCP： 最大内容绘制 (Largest Contentful Paint) 指标会根据页面首次开始加载的时间点来报告可视区域内可见的最大图像或文本块完成渲染的相对时间。为了提供良好的用户体验，网站应该努力将最大内容绘制控制在2.5 秒或以内.一个良好的测量阈值为页面加载的第 75 个百分位数，且该阈值同时适用于移动和桌面设备。https://web.dev/i18n/zh/lcp/#what-elements-are-considered

FCP：首次内容绘制 (First Contentful Paint ) 指标测量页面从开始加载到页面内容的任何部分在屏幕上完成渲染的时间。网站应该努力将首次内容绘制控制在1.8 秒或以内。为了确保您能够在大部分用户的访问期间达成建议目标值，一个良好的测量阈值为页面加载的第 75 个百分位数，且该阈值同时适用于移动和桌面设备。

DCL (DomContentloaded)：当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载。

FMP(First Meaningful Paint) 首次有效绘制：页面主角元素的首次有效绘制。例如，在 bilibili 上，主角元素就是视频元素；微博的博文是主要元素。

TTI (Time to Interactive) 可交互时间：页面主角元素的首次有效绘制。例如，在 bilibili 上，主角元素就是视频元素；微博的博文是主要元素。

TBT (Total Blocking Time) 页面阻塞总时长:TBT汇总所有加载过程中阻塞用户操作的时长，在FCP和TTI之间任何long task中阻塞部分都会被汇总。

FP (First Paint) 首次绘制:标记浏览器渲染任何在视觉上不同于导航前屏幕内容之内容的时间点。

FID (First Input Delay) 首次输入延迟:FID (First Input Delay) 首次输入延迟: 指标衡量的是从用户首次与您的网站进行交互（即当他们单击链接，点击按钮等）到浏览器实际能够访问之间的时间

L (onLoad): 页面的onLoad时的时间点。当依赖的资源, 全部加载完毕之后才会触发。

在我们判断接口请求的耗时时，可以用chrome的Timing

![]({{ site.url }}/images/timing.png)


DNS查找: 每个新域pagerequires DNS查找一个完整的往返。 DNS查询的时间，当本地DNS缓存没有的时候，这个时间可能是有一段长度的，但是比如你一旦在host中设置了DNS，或者第二次访问，由于浏览器的DNS缓存还在，这个时间就为0了。

初始链接链接：建立TCP连接的时间，就相当于客户端从发请求开始到TCP握手结束这一段，包括DNS查询+Proxy时间+TCP握手时间。

SSL:握手所花费的时间。

等待服务器响应：请求发出后，到收到响应的第一个字节所花费的时间(Time To First Byte),发送请求完毕到接收请求开始的时间;这个时间段就代表服务器处理和返回数据网络延时时间了。服务器优化的目的就是要让这个时间段尽可能短。
## 查看内存运行情况
内存泄漏是经常发生的事情，少量的内存泄漏不会影响系统的正常运行，但有一些内存泄漏需要我们格外重视，比如长期运行导致内存一直提升，页面交互卡顿，更严重时将会导致系统崩溃。当我们遇到内存泄漏时，要如何排查及解决呢？我们需要系统地知道监控内存泄露工具方法以及具体排查步骤，才能彻底地解决内存泄露。

先确认是否有内存的泄露，然后同performance记录查，看堆快照找出可疑对象，定位问题找到原因，修复验证

可借助下面的工具查看内存的一些相关情况

1. 任务管理器查看内存占用空间和javascript使用的内存

2. 堆快照进一步分析可能的对象，看详细内容

3. performance 查看内存使用情况

## 参考文章
[Web Performance常见性能指标(FP, FCP, LCP, DCL, FMP, TTI, TBT, FID, CLS)](https://songyazhao.github.io/2020/11/02/Web%20Performance%E5%B8%B8%E8%A7%81%E6%80%A7%E8%83%BD%E6%8C%87%E6%A0%87/)

[chrome查看JS内存使用情况](https://www.cnblogs.com/liuzhaoting/articles/13182118.html)
