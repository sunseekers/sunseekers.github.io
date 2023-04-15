---
layout: post
title: 图片合成系列
categories: [文章推荐]
description: 推荐我个人认为好的文章
keywords: 文章推荐
---

最近在做一个叫书封的项目，get到一些关于图片合成，滤镜的东西，记录一下

## 知识点
1. 上传图片加水印，前后端都可以做，那么前端要怎么做呢？

[小tips:使用canvas在前端实现图片水印合成](https://www.zhangxinxu.com/wordpress/2017/05/canvas-picture-watermark-synthesis/)

原理是：直接连续在使用drawImage()把对应的图片绘制到canvas画布上就可以，并借助canvas的toDataURL()方法把我们的canvas画布转换成base64无损PNG地址。

2. 获取上传的时候图片信息，如何实现

a. 本地选择图片转化成base64地址,然后渲染到img上面，然后或者图片信息
```
inputFile.addEventListener('change', function (event) {
    var reader = new FileReader();
    var file = event.target.files[0];
    reader.onload = function(e) {
      var base64 = e.target.result;
          let image = new Image()
          image.src = base64
          image.onload = () => {
            const { width, height } = image
            const ratio = width / height
            console.log(width, height, '图片真实宽高') // 图片真实宽高
          }
    };
    reader.readAsDataURL(file);
});
```

3. 前端图片合成也就是混合模式(也就是我们拼图时候说的特效)

[CSS混合模式mix-blend-mode/background-blend-mode简介](https://www.zhangxinxu.com/wordpress/2015/05/css3-mix-blend-mode-background-blend-mode/)

[深入理解CSS mix-blend-mode滤色screen混合模式](https://www.zhangxinxu.com/wordpress/2019/05/css-mix-blend-mode-screen/)

[mix-blend-mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/mix-blend-mode): 属性描述了元素的内容应该与元素的直系父元素的内容和元素的背景如何混合。

原来前端也能做这个事情，第一次在项目中使用，像玩ps一样，真有意思
