---
layout: post
title: html2canvas 把网页转图片
categories: [web]
description: 发现，探索 web 优质文章
keywords: html2canvas
---
# 一个网页如何转化成一张图片？
利用 `html2canva` 插件，把 `html` 转成一个 `canvas` 就是一张图片了；

## 为什么要把一张网页转化成图片
如果你经常跑步用过悦动圈或者其他 `app`,会看到一个弹窗，这个弹窗是你的成就或者为你量身定制的一个页面，这时候我们想像朋友炫耀，可以用手机截图，但是截图总是会有一些我们不需要的东西，用户体验不好。

我团队的需求是我们 `app` 里面有一个德育包，可以在德育包里面打卡，记录自己养成的良好习惯。一个月之后，我们想要图形化的看看我们的成就，并且分享给身边的朋友，把网页转化图片就派上用场了；

[html2canvas 文档](http://html2canvas.hertzen.com/configuration/)

使用前确保你对 `canvas` 有一定的了解，对新手不是特别友好。配合文档敲一遍代码基本上就了解用法了；

官网的第一个例子就是一个很完美的例子
```
<div id="capture" style="padding: 10px; background: #f5da55">
    <h4 style="color: #000; ">Hello world!</h4>
</div>

html2canvas(document.querySelector("#capture")).then(canvas => {
    document.body.appendChild(canvas)
});

```
其中`then` 返回的是一个 `canvas` 就是`canvas` 这个元素。 通常我们都是在`then` 里面进行我们需要的操作；
`html2canvas` 的第一个参数是目标（即我们要转化的元素标识），第二个参数是对象，`css` 属性的设置。说起来就是这么简单。接下来就需要自己去踩坑了；

```
    // 分享图片事件
    share() {
      const { canvas, scale, elShareImage } = this.handleShareImage()
      const toast = this.$createToast({
        time: 0,
        txt: '图片生成中'
      })
      toast.show()

      html2canvas(elShareImage, {
        canvas,
        scale,
        backgroundColor: null
      }).then(canvas => {
 
        let imageBase64 = canvas.toDataURL('image/png') //data:image/png;base64,iVBORw0KGgoAAAANSUh

        toast.hide()
        // 图片生成之后的具体处理
        
      })
    },
    // 处理将要分享的图片
    handleShareImage() {
      const { elShareImage, elCanvas: canvas } = this.$refs  // 这里对我们获取到我们的目标元素，进行一些图片大小的设置
      const ratio = 3
      const width = elShareImage.clientWidth
      const height = elShareImage.clientHeight
      const ctx = canvas.getContext('2d')

      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.scale(ratio, ratio)

      return {
        scale: ratio,
        canvas,
        elShareImage
      }
    },
```
imageBase64 是一个字符串，字符串里面包括了数据的类型，编码，数据本身;上面例子是一个 `png` 的图片，用的 `base64` 编码，在后面就是具体的数据了。

HTMLCanvasElement.toDataURL() 方法返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。

关于一些具体的参数可以到文档里面参看更加详细的解释，再不行通过 `console.log` 来查看

## 如何解决图片跨域？？
网页中有来自不同域的图片，如果按照上面的配置会出现一个问题，图片无法生成，取而代之的是一块空白。后来定位到是跨域了，尝试过使用 `new Image()` 去解决，何耐没法解决，我也很无奈。后来仔细读文档才发现，文档有配置，添加一个配置就可以实现跨域了 `useCORS: true,`。原来这么简单，折腾半天，不好好看文档

