---
layout: post
title: 如何拥有一个属于自己的vite插件
categories: [功能实现]
description: vite 自定义插件
keywords: vite 自定义插件
---

## 背景
vue3 + vite2 的结合创建了一个项目，体验到了目前最好的极致的开发体验。曾和公司同事推荐过，想要进一步推广，让更多的项目，体验到这种极致的开发体验。特别是一些老项目，比如使用gulp构建的项目，我觉得他已经完成了自己的历史使命了，新的时代，他又了新的使命。抱着想试试老项目构建换vite的可行性和成本，开始了vite的探索之路

## vite为什么那么快
官网里面有一张图说的特别清楚，特别清晰。简单的说就是因为vite是不需要打包的，由vite构建的页面，都是实时服务端渲染的，即你需要什么就渲染什么，这点对开发者是友好的。所以他就是特别快，给我们的体验特别好

## 创建 vite 插件
vite 插件包含两个部分，一个是仅仅在运行时（本地构建）,另一个是打包时（build），因为他是基于rollup，所以插件的语法也是扩展于rollup，vite他有通用的钩子，和rollup差不多，也有vite特有的一些钩子。

### vite 插件的格式
1. 他拥有一个名称 => name
2. 生成一个钩子对象，如果钩子内部不需要自定义，就直接返回一个对象，如果需要就接受参数，返回一个函数
3. 在指定的生命周期内做你需要做的事

举个例子：

```
// vite-plugin-example.js

export default function myExample(){
  // 返回一个插件
  return {
    name:"my-example",
    // import xx from source 即from后面的 那个id确认
    resolveId(source){
      if(source === 'vitual-modele'){
        return source // 返回source表明命中了，vite不再询问其他插件处理该id请求
      }
      return null // 返回null表明没有命中，是其他的id还需要继续处理
    },
    // 加载模块代码
    load(id){
      if(id=== 'vitual-modele'){
          return 'export default "this is virtual"'// 返回vitual-modele要做的事情或者内容或者函数
      }
      return null //其他id继续处理
    }
  }
}

// vite.config.js
import myExample from './vite-plugin-example'

export default {
    plugins: [
      myExample(),
    ],
}

// main.js
import vm from 'vitual-modele'
console.log('【这里是我自己写的一个vite插件的模板】',vm)
```
[参考例子](https://github.com/sunseekers/vite-plugin/blob/master/vite-plugin-example.js)
### vite 通用的钩子
#### 只有在服务器启动时调用一次（可以得到rollup创建的一些选项
options： 替换或者操纵rollup ，选项 build的时候有用，别的时候是一个空对象，可以影响打包的行为

buildStart： 开始创建，一个信号

#### 每次有模块请求时都会被调用（每次import有发送请求的时候都会被调用，也是最重要的
resolveId：创建自定义确定函数，常用于定位第三方依赖

load： 创建自定义加载函数，可用于返回自定义的内容

transform： 可用于转化已加载的模块内容

上面那个例子就是用到了这里的几个生命钩子函数

[参考例子](https://github.com/sunseekers/vite-plugin/blob/master/vite-plugin-example.js)
#### 只有在服务器关闭时调用一次
buildEnd

closeBundle

### vite 通用的钩子
config：修改vite配置确认

configResolved:vite配置确认

configureServer：用于配置vite 应用程序dev server

transformIndexHtml:用于转换宿主页

handleHotUpdate:自定义HMR更新时调用
[参考例子](https://github.com/sunseekers/vite-plugin/blob/master/vite-plugin-mock.js)

### vite 钩子执行的顺序
<img src="https://tva1.sinaimg.cn/large/008i3skNly1gt1bd5tnpgj30up0ec75j.jpg">

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gt1bg72pdgj30tw0h3wfo.jpg">

[参考例子](https://github.com/sunseekers/vite-plugin/blob/master/vite-plugin-life.js)

## 总结
主要是看了[Young村长 的b站视频](https://space.bilibili.com/480140591/video?keyword=vite)，欢迎大家去看，写的是真的很不错。
文章截图来自她的PPT，代码也是来源于他的视频。非常期待他之后的更新，讲的真的是太好了，太喜欢了

两三年前 webpack 火的不行，未来 vite 很有可能会成为 webpack 的替代品，前端的更新是太快了。不学习太容易被淘汰了，可是真的学不动了。回头看看，注重基础根基才是最重要的的吧，万丈高楼平地起，基础稳了，才能立足于瞬息万变的时代中
