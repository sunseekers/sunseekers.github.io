---
layout: post
title: 浏览器断网提示用户断网拉
categories: [JavaScript]
description: 发现，探索 web 优质文章
keywords: 组件
---

# 背景
第二次在项目中遇到这个需求了，第一次我说浏览器实现比较麻烦，扔个app包做了（是我懒），第二次是在接口请求超时时做了处理。之后我就一直在想浏览器是有网这个是不是有api，后来也就忘记了，最近一次看了一篇文章才恍然大悟

## 我看的资料
<a href="https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651576288&idx=2&sn=a87b24ed300de0aee44925b81c4a91dd&chksm=80250021b7528937230debfe045f401e70651bc1a3a39addac12ef76a1613c0a2ddbf4b4480c&scene=27#wechat_redirect">如何处理浏览器的断网情况？</a> 这篇文章写的挺好的的，还有demo，我推荐看看他的文章

<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorOnLine/Online_and_offline_events">在线和离线事件</a>


前面两篇文章我觉得已经介绍的很详细了，用法也很简单。看看就能懂，就是监听两个事件online和offline

然后在对应的事件里面做对应的事情就好了，完美结束

<a href="https://codepen.io/qingchuang/pen/xxqdvVM">浏览器判断是否断网</a>