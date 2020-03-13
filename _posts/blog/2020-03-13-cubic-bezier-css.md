---
layout: post
title: css 缓慢展开收起
categories: [css]
description: css 缓慢展开收起
keywords: css 缓慢展开收起
---

# 提高用户体验的一种收起展开

用户点击或者鼠标移动上去的时候，把原来隐藏的内容缓慢的加载出来，加一个过渡的效果，用户体验会很好

## 简单两行代码实现

实现原理就是利用 `height` 从 0 到一个固定值的过渡加载，再配合 `transition: all 350ms cubic-bezier(0.4, 0, 1, 1);`。动效加载就出来了，原来就是这么简单，动手试一试呀

```
<html>
<head>
<style>
  .wrapper:hover .list {
  height:200px;// 必须有一个高度，否则动效出不来
  overflow:auto;
  }
.list span{
  width: 60px;
  height: 60px;
  display: block;
}
.list{
  height:0;
  overflow:hidden;
  transition: all 350ms cubic-bezier(0.4, 0, 1, 1);

}
</style>
</head>
<body>
<div class="wrapper">
<div class="list">
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
<span>sunseekers</span>
</div>
<div id='botton'>上下滚动动效</div>
</div>
</body>
</html>
```

## 其他的使用场景

最初的时候在项目里面看到同事使用这个动效，觉得特别神奇，特别厉害。我每次遇到的时候都是粗糙的显示隐藏，后来发现这个真的好用。 `get` 到了新的技能

嗯嗯，宽度展示的时候也可以使用呀，就有动画展示了

[二级菜单的缓慢展示](https://github.com/sunseekers/vue-compontent/blob/master/src/components/SecondarySearch.vue)
