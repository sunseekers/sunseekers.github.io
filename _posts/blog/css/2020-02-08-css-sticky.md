---
layout: post
title: css position:sticky 粘性定位
categories: [CSS]
description: css 粘性定位
keywords: css 粘性定位
---

# 我只说 sticky 定位

其他的定位先不说，刚刚发现了这个定位的另外一个神奇的用法，想要分享分享，我是从文档上面看到

## position:sticky 生效

粘性定位可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位；所以四个阈值一定要指定其中一个，否则会失效。

父级元素(祖先)不能有任何 `overflow:visible` 以外的 `overflow` 设置

一个复杂一点点的例子：
粘性定位常用于定位字母列表的头部元素。标示 B 部分开始的头部元素在滚动 A 部分时，始终处于 A 的下方。而在开始滚动 B 部分时，B 的头部会固定在屏幕顶部，直到所有 B 的项均完成滚动后，才被 C 的头部替代。

```
<html>
<head>
<style>
* {
  box-sizing: border-box;
}
dl {
  margin: 0;
  padding: 24px 0 0 0;
}

dt {
  background: #B8C1C8;
  border-bottom: 1px solid #989EA4;
  border-top: 1px solid #717D85;
  color: #FFF;
  font: bold 18px/21px Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 2px 0 0 12px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
}

dd {
  font: bold 20px/45px Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0 0 0 12px;
  white-space: nowrap;
}

dd + dd {
  border-top: 1px solid #CCC
}
</style>
</head>
<body>
<div >
  <dl>
    <dt>A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl>
    <dt>C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl>
    <dt>E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl>
    <dt>T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>F</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>B</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>U</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>P</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>M</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>L</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
    <dl>
    <dt>Y</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>
</body>
</html>
```
## js 模拟实现
在一次实际开发过程中，因为考虑到手机的机型的兼容性问题，这个原生好用的我的自己模拟实现这个，其实实现也不难

```
.scroll {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  background: #fff;
}
  .list-scropper-wrapper {
    padding-top: 56px;
  }
<div class="scroll-wrapper">// 滚动层
    <div class="list-wrapper" ref="scroll" :class="{ scroll: isScrollTop }">//需要定位的父层
      <div class="list-tab" :class="{ scroll: isScrollTop }">
        定位子层
        </div>
      </div>
      <div class="list-remind">
        这里是其他的内容
      </div>
    </div>
  </div>
      scrollTop() {
      const targetRect = this.$refs.scroll.getBoundingClientRect()
      const targetTop = targetRect.top
      return targetTop < 0
    }
```

当滚动层，滚动到一定位置的时候，需要把某一个元素置于顶部可见。

实现原理：获取需要定位的父元素，如果父元素到顶部的距离小于0，说明已经滚动到了顶部，这个时候就需要固定定位了。反之亦然。

坑：因为用fixed进行定位，脱离了文档流会导致文档流中少了一块高度区域，页面的高度发生了变化整个页面要进行重排，页面会有明显的卡顿或者模拟定位失效，用户体验度不好等等情况。这个时候要怎么处理呢？

给少了一块高度的父元素用padding-top 补上

我们用 position:relative 实现原理也是一样的
## 参考文章

[杀了个回马枪，还是说说 position:sticky 吧](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)

[MDN position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

