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

```
function show(data){
console.log(data);
}
function jspon({url,params,cd}){
return new Promise((resolve,reject)=>{
let script=document.createElement("script")

window[cd] = data=>{
resolve(data)
document.body.removeChild(script)

}
params={...params,cd}
let arr = []
for(let key in params){
arr.push(`${key}=${params[key]}`)
}
script.src=`${url}?${arr.join("&")}`
document.body.appendChild(script)
})

}
// 只能发 get 请求，不安全，xss 攻击，你用的网站对你做攻击
jsonp({
url:'baidu.con',
params:{wd:'a'},
cd:'show'
}).then(data=>{
console.log(data);
})

//服务器
let express = require('express')
let app = express()
app.get('/say',(req,res)=>{
  let {wd,cd} = req.query
  res.end(`${cd}(''i like you)`)
})
app.list(3000)
```

cors

let express = require('express')
let app = express()
app.use(express.static(\_\_dirname))
let whitList=['x']
app.use((req,res,next)=>{
let origin = req.headers.origin
if(whitList.includex(origin)){
res.setHeader('')
}
next()
})
app.list(3000)

xmlHttprequest 4000 服务发起这个请求
