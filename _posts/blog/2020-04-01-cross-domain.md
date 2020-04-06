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

`jsonp` : 原理是利用 `script img` 等标签没有跨域的限制，缺点是只能发 `get` 请求，不安全，`xss` 攻击，你需要跨域的网站对你做攻击

```
  // 核心代码
      function jsonp({ url,params,cd}) {
      return new Promise((resolve, reject) => {
        let script = document.createElement("script")

        window[cd] = data => {
          resolve(data)
          document.body.removeChild(script)

        }
        params = {...params,cd}
        let arr = []
        for (let key in params) {
          arr.push(`${key}=${params[key]}`)
        }
        script.src = `${url}?${arr.join("&")}`
        document.body.appendChild(script)
      })
    }
```
[实现源码](https://github.com/sunseekers/node/tree/master/cross-domian)

[跨域资源共享( `CORS` )](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) : 只是一个完全由后端参与并实现的，前端不需要做任何事情

简单的说就是在服务加上一个白名单允许哪些网址跨站访问，浏览器出现了哪些跨域的错误信息，在服务端设置 `setHeader` 表示允许出现跨域。他的缺点是，全部有服务器来做，需要什么加什么，会有很多的代码量

[代码实现](https://github.com/sunseekers/node/tree/master/cross-domian)

`postMessage`： 利用 `iframe` 像子窗口里面发送数据，然后子窗口反传数据给父窗口 [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)

[代码实现](https://github.com/sunseekers/node/tree/master/cross-domian/postMessage)

`document.domain`: 只能在一级域名和二级域名使用
`window.name`
`location.hash`
`http-proxy`:  `webpack` 上面配置使用
`nginx` : 在 `nginx` 的配上上面加上允许跨域的域名就好了
`websocket` :

