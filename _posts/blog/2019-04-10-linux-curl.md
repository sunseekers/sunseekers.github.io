---
layout: post
title: Curl 模拟 GET\POST 请求
categories: [Linux]
description: Curl 模拟 GET\POST 请求，以及 curl post 上传文件
keywords: curl
---

Curl 模拟 GET\POST 请求，以及 curl post 上传文件

---

#### 前言

一般情况下，我们调试数据接口，都会使用一个 Postman 的工具。

我在本机的测试环境下使用该工具来模拟 HTTP 请求。

今天遇到一个棘手的问题。刚把开发的 jar 包发布到线上服务器上，结果前端报后端 404。

这就奇了怪了，看了下本地代码发现是有接口的，为了验证下，想模拟下 HTTP 请求。 

发现 Postman 在线上 Linux 用不了。得换个命令行方式。

百度搜索了下发现在命令行中，使用 Curl 这个工具完全可以满足轻量的调试要求。

#### GET 请求

curl 命令 + 请求接口的地址。

``` 
curl http://localhost:9999/api/daizhige/article
```

如上，我们就可以请求到我们的数据了，如果想看到详细的请求信息，我们可以加上 -v 参数

![](/images/blog/2019-04-10-4.png)

有使用 Get 方式请求需要带参数。如 http://localhost:8088/dw?a=b&c=d。

在命令行执行后报错说 c 没有传参 （本人踩的大坑）

查阅资料后发现对 & 要进行转义

``` 
curl http://localhost:8088/dw?a=b\&c=d
```

#### POST 请求

可以用 -X POST 来申明我们的请求方法，用 -d 参数，来传送我们的参数。

**同理可以用 -X PUT 和 -X DELETE 来指定另外的请求方法。**

```
curl http://localhost:9999/api/daizhige/article -X POST -d "title=comewords&content=articleContent"
```

如上，这就是一个普通的 Post 请求。

但是，一般我们的接口都是 JSON 格式的，这也没有问题。我们可以用 -H 参数来申明请求的 header

```
curl http://localhost:9999/api/daizhige/article -X POST -H "Content-Type:application/json" -d '"title":"comewords","content":"articleContent"'
```

so, 我们还可以用 -H 来设置更多的 header 比如，用户的 token 之类的。

同样，可以用 -v 来查看详情。

#### POST 上传文件

上面的两种请求，都是只传输字符串，我们在测试上传接口的时候，会要求传输文件，其实这个对于 curl 来说，也是小菜一碟。

用 -F "file=@__FILE_PATH__" 的请示，传输文件即可。

``` 
curl http://localhost:8000/api/v1/upimg -F "file=@/Users/fungleo/Downloads/401.png" -H "token: 222" -v
```

更多 curl 的使用方法，以及参数说明，可以在系统中输入 man curl 来进行查看。

---
参考链接
* [curl 模拟 GET\POST 请求，以及 curl post 上传文件](https://blog.csdn.net/fungleo/article/details/80703365)
* [curl 命令模拟 HTTP GET/POST 请求](https://www.cnblogs.com/alfred0311/p/7988648.html)







