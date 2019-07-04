---
layout: post
title: PostMan 的基本使用汇总
categories: [Tools]
description: PostMan 发送 JSON 格式的 POST/PUT 请求
keywords: PostMan
---

PostMan 发送 JSON 格式的 POST/PUT 请求

---


#### 前言

用 POSTMAN 发送 JSON 格式的 POST/PUT 请求

#### 设置Header

Content-Type  application/json

![](/images/blog/2019-04-10-5.png)

#### 设置Body

选择 raw

![](/images/blog/2019-04-10-6.png)

#### PUT 请求

把请求方式改为 PUT即可

![](/images/blog/2019-04-10-7.png)

#### GET 请求

GET 请求选择是 Params 面板填写参数

![](/images/blog/2019-04-10-8.png)

#### 登录鉴权

有时候需要登陆鉴权的需求。 这里不重复写了。移步 落落殿下的 [postman登录鉴权，获取token后进行其他接口测试][1]


---
参考链接
* [用POSTMAN发送JSON格式的POST请求](https://blog.csdn.net/rziqq/article/details/77715085#commentBox)
* [postman登录鉴权，获取token后进行其他接口测试][1]


[1]: https://blog.csdn.net/qq_42512064/article/details/81034744