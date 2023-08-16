---
layout: post
title: IntersectionObserver 实现移动端分页和埋点曝光
categories: [功能实现]
description: 移动端实现分页和埋点曝光
keywords: 移动端实现分页和埋点曝光
---

# IntersectionObserver
他是 Web API 中的一种观察者模式，用于检测元素与其祖先元素或视口之间的交集（intersection）
## 移动端分页原因？

1. 数据接口需要进行分页，后端数据量特别大，每一次请求接口只会给一部分的数据

2. 数据接口不需要进行分页，但是给的数据量特别大，渲染慢，用户需要等待很久，但是用户一般只会看前面的数据

第一种情况是被迫的分页，第二种是为了用户体验。现在的移动端分页不像以前，还有一个分页的页脚，你去点击上下页切换，或者页码跳转。现在的分页都是隐藏的，一个产品有没有分页，专业人事才知道

### 实现原理

1. 监听滚动事件 `onScroll` ，滚动条的总高度 >= 可视区的高度+距离顶部的距离，表示滚动到底部，这个时候可以进行接口的数据请求，或者添加一部分的数据到列表中去

2. 利用 `IntersectionObserver` 目标元素有没有即将进入我们的视口（用户能不能看到它）,即将进入我们的视口，表示已经滚动到了底部，这个时候可以进行接口的数据请求，或者添加一部分的数据到列表中去

两种实现原理只是使用的东西不一样，底层原理是一样的，就是当用户滚动到底部的时候我们进行数据接口的请求。

第一种方式的关键代码

```
    // 滚动加载数据
    onScroll(event) {
      const target = event.target
      // 滚动条的总高度
      const scrollHeight = target.scrollHeight
      // 可视区的高度
      const clientHeight = target.clientHeight
      // 距离顶部的距离
      const scrollTop = target.scrollTop
      // 滚动到底部,在安卓机低下有可能有小数，需要取整
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.getList()// 接口请求或者添加数据到列表中去
      }
    },
    // 获取数据 this.isLoading 前端请求加锁，接口数据没有返回前，滑动到底部，不请求接口，避免重复数据，isFirst是否是第一次请求接口
    async getList(isFirst) {
      if (this.isLoading || !this.hasMore) return
      this.showToastMask()// 加载中提醒
      this.isLoading = true

      if (!isFirst) {
        this.params.pageNum++
      }

      const res = await this.$api.xxx(this.params)
      this.isLoading = false
      this.total = res.data.count
      this.list = this.params.pageNum === 1 ? res.data || [] : [...this.list, ...res.data]
      this.hasMore = this.list.length < this.total
      this.toast.hide()
    }
```
[详情查看 scroll 实现分页](https://github.com/sunseekers/vue-compontent/blob/master/src/components/Scroll.vue)

第二种实现方式，关键性代码

```
    getObserver(){
     const observer = new IntersectionObserver(entry=>{
       if(entry[0]&&entry[0].isIntersecting){
         this.getList()
       }
     });
    observer.observe(document.querySelector('.list-loading-status'))
    },
```

[详情查看 IntersectionObserver 实现分页](https://github.com/sunseekers/vue-compontent/blob/master/src/components/ScrollIntersection.vue)

你喜欢第一种还是第二种，因人而异，看自己喜欢把。第二种更加灵活，他还能做图片的懒加载，没有进入可视区，图片就用占位符占位，进去可视区之后在渲染。在满屏片的图片渲染的时候，这是一个很好的方式。还有组件曝光埋点

## 组件曝光埋点原理 
这个和移动端滚动加载分页原理是一样的，所谓的曝光就是元素出现在，可视区内的时候，给接口发送一个请求。和移动端滚动加载，到了底部发送一个请求，没啥差别。以此为原理就好了

```
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { intersectionRatio } = entry
        const target = entry.target as HTMLElement
        if (
          intersectionRatio === 1 
        ) {
          // 发送接口请求
          report(data, type)
        }
      })
    },
    {
      threshold: 1,
    },
  )
```

假设我们我们用的是vue3，那就可以composition api写成hooks 的形式，借用 `import { createSharedComposable,  } from '@vueuse/core`, 可在每个页面单独使用。

如果我们想封装为组件的形式，可以利用slot 和指令相结合的形式。

```
// 入口注册指令
app.directive('track', directive)

// 插槽做组件包裹，目的是为了统一传数据(曝光和点击都需要埋点的时候用方便，如果只有其中一种那可以不需要)
<template>
 // 父组件给插槽的内容再透传给子组件（v-bind一定要是object 类型的参数）
  <slot v-bind="data"></slot> 
</template>

// 使用方式
<DataSlot
  v-slot="slotData"
  :data="{
    dt: 'list_id',
    pdid: 'page',
    x2: 2,
    did: 'list',
  }"
>{{slotData}}</DataSlot>
```

组件或者hooks方式使用都是可以的，在项目中一般是两者相结合使用。各种场景都合适

## IntersectionObserver，MutationObserver

IntersectionObserver 和 MutationObserver 都是 JavaScript 原生 API，用于监听 DOM 的变化。它们的主要区别在于监听的对象和监听频率上：

IntersectionObserver 监听的是某个 DOM 元素与当前视窗（Viewport）的交叉状态变化。它能够在需要时被异步执行，以最小的性能消耗来监听多个目标元素的交叉状态，并在发生变化时执行回调函数。这样就可以实现类似图片懒加载、滚动加载等功能。

MutationObserver 监听的则是某个特定 DOM 元素的任何子孙节点的变化。它能够异步执行回调函数，以最小的性能消耗来监听目标元素的子节点的添加、移动、删除等操作，并在发生变化时执行回调函数。这样就可以实现类似自动保存表单、动态 UI 更新等功能。

ResizeObserver用于监听 DOM 元素的尺寸变化

所以，简单来说，IntersectionObserver 主要用于监听目标元素与视窗的交叉状态，而 MutationObserver 则主要用于监听 DOM 元素的修改。这两个 API 都能提高网页性能，因为它们能够降低监听操作对更新性能带来的影响，同时还能减少不必要的工作。

## 总结
因为 IntersectionObserver 可以有效地监听元素何时进入或离开另一个元素或视口，因此我们可以利用他做很多事情，不仅限于移动端分页，曝光埋点，懒加载等等。

这么做的目的是更好的性能和用户体验。

MutationObserver