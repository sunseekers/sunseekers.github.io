---
layout: post
title: class 使用
categories: [功能实现]
description: 发现，探索 web 优质文章
keywords: web
---

# class 在项目中使用

我们平时再看视频的时候，经常会看到弹幕，我们现在手写一个弹幕的实现。主要使用的是 class 的应用

## 弹幕实现原理

`video` 元素和 `canvas` 元素的结合。把 `canvas` 元素覆盖在`video`上面，根据一定的步伐 `speed` 按照浏览器的渲染帧数进行顺畅的渲染 `requestAnimationFrame` 当 `canvas` 移除以后，这个元素就消除。一句话总结就是一个元素在另外一个元素上面移动

实现思路：创建两个类，一个弹幕的类，一个弹幕实例的类。通过使用类方便扩展，在类上面挂载方法属性都很方便

学到的知识点：

想要知道一个一段文字的宽度，可以使用 `span` 标签来测量，测量完了之后把 `span` 删除就好了。

类上挂载方法属性，共享都很方便，不需要层层参数传递

元素移动可以使用 `requestAnimationFrame` 和步伐保证移动顺畅，不至于移动过于生硬或者卡帧

代码实现

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
  <style>
  .barrage{
    width: 680px;
    height: 450px;
    margin:0 auto;

  }
  #canvas{
    position: absolute;
  }
  button{
    cursor:pointer;
  }
  </style>
<body>
  <div class='barrage'>
    <canvas width='0' height='0' id='canvas'></canvas>
    <video id='video' controls src="../Downloads/1579248268366130.mp4" width="640" height="380"></video>
    <input type='text'/><button>添加弹幕</button>
  </div>
</body>
<script>
const data =[{
value:'sunseeker 第一次写弹幕',time:1,speed:3,color:'red',fontSize:20
},{
value:'sunseeker 第二次写弹幕',time:3,speed:5,color:'red',fontSize:20
}]// 弹幕的虚拟数据
let $=document.querySelector.bind(document)
let video=$('#video')
let canvas=$('#canvas')
// 创建一个弹幕的类
class Canvasbarrage {
  constructor(video,canvas,option){
    if(!video||!canvas) return
    this.video=video
    this.canvas=canvas
  // 默认选项，放一些弹幕的默认值
  let defaultOption = {
    fontSize:20,
    color: 'gold',
    speed:2,
    opacity:0.3,
    data:[]
  }
  // 将属性挂在对象上面，到时候获取更加方便
  // 获取 canvas 画布
  this.context = canvas.getContext('2d')
  // 设置canvas 和video 等宽高
  this.canvas.width=video.clientWidth
  this.canvas.height=video.clientHeight
  this.isPause = true // 默认暂停播放，表示不渲染弹幕
  Object.assign(this,defaultOption,option)
  // 存放所有的弹幕,构造一个类，把所有的对象传进去，它自动转换我们想要的数据格式
  // 构造函数里面传一个this（这个实例）,是因为data里面有些数据不全，一个一个传太费劲了，所以一起传方便
  this.barrages = this.data.map(item=>new Barrage(item,this))
  // 渲染所有弹幕
  this.render()
  }
  // 递归渲染
  renderBarrage(){
    // 将数组里面的弹幕一项一项拿出来，判断时间是不是和视频的时间一样的话，就开始渲染此弹幕
    const currentTime=this.video.currentTime
    this.barrages.forEach(el=>{
      if(!el.flag&&currentTime>=el.time ){
        // 先去初始化，之后在绘制，没有初始化，就初始化一项
        if(!el.isInited){
          el.init()
          el.isInited=true
        }
        el.x-=el.speed
        el.render()//渲染自己，这个是Barrage里面的方法
        if(el.x<=el.width*-1)
          el.flag=true//停止渲染的操作
      }
    })
  }
  render(){
    // 第一次先清空之前的状态，执行渲染弹幕，如果没有暂停，继续渲染（相当于递归）
    // canvas 画都是要先清空上一次的状态
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
    // 执行渲染,先写步骤后面在补方法，这是一个比较好的放松
    this.renderBarrage()
    if(!this.isPause){
      // 递归渲染
      requestAnimationFrame(()=>this.render())
    }
  }
}

// 创造弹幕实例的类
class Barrage{
  constructor(obj,ctx){
    this.value = obj.value
    this.time = obj.time
    this.obj=obj
    this.ctx=ctx
  }
  init(){
    this.opacity=this.obj.opacity||this.ctx.opacity
    this.color=this.obj.color||this.ctx.color
    this.speed = this.obj.speed||this.ctx.speed
    this.fontSize=this.obj.fontSize||this.ctx.fontSize
    // 求自己的宽度，目的是用来验证是否还需要继续绘制，用span标签来获取宽度，获取完了之后
    // 删除这个元素，如果不删除页面的节点会越来越多，影响性能
    let span = document.createElement('span')
    span.innerText=this.value
    span.style.font=`${this.fontSize}px`
    span.style.position='absolute'
    document.body.appendChild(span)
    // 记录弹幕有多宽
    this.width=span.clientWidth
    document.body.removeChild(span)
    // 弹幕出现的位置,在弹幕移动的时候，当移动的位置小于-width，就是移出去了
    this.x = this.ctx.canvas.width
    this.y = this.ctx.canvas.height*Math.random()
    if(this.y<this.fontSize){
      this.y=this.fontSize
    }
    if(this.y>this.ctx.canvas.height-this.fontSize){
      this.y=this.ctx.canvas.height
    }
  }
  render(){
    this.ctx.context.font = `${this.fontSize}px`
    this.ctx.context.fillStyle=this.color
    this.ctx.context.fillText(this.value,this.x,this.y)
  }
}

let barrage = new  Canvasbarrage(video,canvas,{data})
 video.addEventListener('play',function(){
  barrage.isPause=false // 实例上面有这个方法，所以可以修改
  barrage.render()
})
video.addEventListener('pause',()=>{
  barrage.isPause=true
})

</script>
</html>

```
