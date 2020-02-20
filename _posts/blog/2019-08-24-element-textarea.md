---
layout: post
title: 如何实现一个可编辑的文本输入框，元素的高度随着内容的改变而自动改变
categories: [功能实现]
description: textarea 实现高度随着内容的增加而增加 ， div 模拟 textarea
keywords: 移动端
---

# 用什么实现可编辑的文本输入框

我们是用用 `textarea` 高度随着内容的改变而自动改变，还是用 `div` 模拟 `textarea`呢？
两者都能实现，实现原理似乎不太一样，选用哪一个，就要看产品的需求和哪一个需要填的坑最少了。在一次开发中兜兜转转，我最后选择了用 `textarea` ，原因和之前的项目保持一致的风格。还是那句老话，如果在项目中有很多地方需要使用，可以考虑使用一个公共的组件库，后期代码维护方便。如果是一个团队的多个项目中使用，可以写成一个公共的 `UI` 库，通过 `npm` 安装使用。

## 需求

根据输入内容自动撑开元素的高度，避免滚动条里面嵌套滚动条的尴尬局面。如果文本输入框元素后面有元素会被自动挤下去，整体的体验应该算是挺不错的，所有内容通过一个滚动就可以展示完

### `textarea` 是什么

一个文本输入框，一个可以无限输入内容的标签，文字超出高度，会自动有一个滚动条。在工作中用的比较少，第一时间想到 `textarea` ，可是在网上都是看到通过 `cols` 去控制行高，还有丑丑的滚动条，高度要实时控制，需要去监听输入内容变化，一变化就改变 `cols` 的大小，我无法知道用户输入的是换行还是字符串，什么时候进行 `cols` 的大小变化，我不知道怎么去判断？开始要放弃 `textarea`

### `div` 模拟 `textarea`

后来想到用 `div` 模拟 `textarea`，设置 `contenteditable=“true”` , 那么 `placeholder` 怎么模拟？ 查询一番找到了解决方案

```
   .textarea:empty:before {
      content: attr(placeholder);
      color: rgba(144, 144, 144, 1);
      line-height: 24px;
    }
    .textarea:focus:before {
      content: none;
    }
```

这个可以完美的实现，问题又来了，在 `IOS`,底下不能编辑，头疼，解决方案 `-webkit-user-select: text;` 。好像问题都解决了，其实并没有，安卓或者 `IOS` 在聚焦的时候第一次总是没法聚焦，要点两次，解决方案，加一段代码

```
  // 解决焦点聚焦时候的问题
  let textarea = this.$refs.textarea
  textarea.focus()
  if (typeof window.getSelection !== 'undefined' &&
    typeof document.createRange !== 'undefined') {
    var range = document.createRange()
    range.selectNodeContents(textarea)
    range.collapse(false)
    var sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (typeof document.body.createTextRange !== 'undefined') {
    var textRange = document.body.createTextRange()
    textRange.moveToElementText(textarea)
    textRange.collapse(false)
    textRange.select()
  }
```

这一次我以为完美实现了。让我崩溃的事再一次发生了，在提测前几个小时，模拟的输入框，每一次换行都会被一个 `div` 标签包着，而且我获取到的内容是带有标签的（`span,br`),这个导致的直接不好影响就是，所用用我并不知道哪些人会用，麻烦太大了。后来我又发现可以通过使用 `-webkit-user-modify: read-write-plaintext-only;"` 进行控制，让只能输入纯文本，问题是解决了。

目前自测过程中发现了几个小问题，都慢慢的解决了。关于手机的兼容性，只是简单的对比了`ios` 和安卓两个系统，还有更多机型没有仔细测试。

这一篇文章写的蛮好的，[小 tip: 如何让 contenteditable 元素只能输入纯文本](https://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/)

[contenteditable 跟 user-modify 还能这么玩](https://juejin.im/post/5d5003396fb9a06b265088c0)

### 回头再来看看 `textarea`

提测以后我继续和对桌交流我的迷惑，因为`div` 模拟 `textarea`，不知道有多少坑等着我去踩，对桌说了一句是标签就有 `height` 这些属性。在我的潜意识里面居然忽略了这个，一语点醒梦中人

最后，又回到最初的起点，呆呆的看着电脑屏幕，我都是在干了一些什么事？

继续研究用 `textarea`，实现，发现了利用 `Element.scrollHeight` 这个只读属性可以实现（一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。）

```
  <textarea maxlength='1000' ref="textarea" class='textarea' v-model='sendContent' placeholder="请输入文本内容……" @input="resizeHeight">


    // 函数节流，不实时改变数据
     function throttle (fn, interval = 300) {
      let canRun = true
      return function () {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
          fn.apply(this, arguments)
          canRun = true
        }, interval)
      }
    },
    created(){
      //函数节流，需要先执行一次，形成必包。如果在methods里面，每一次调用都是生成新的函数，没有节流的效果
      this.resizeHeight = this.throttle(this.resize, 1000)()
    }

    resize () {
      let text = this.$refs.textarea
      text.style.height = 'auto'
      text.style.height = text.scrollHeight + 'px'
    },

    //去掉默认样式
      overflow-y: hidden;
      outline: none;
      resize: none;
      border: none;
```

有网友说这个还有一个弊端:"终端数据是 `socket` 返回的 有时候设置高度有点不对 而且聚焦的时候滚动条会跳到最顶端 还有好多其他的问题" 我的数据不是 `socket` 返回的，所以这一点我不知道会不会影响

注意了：当我们设置了 `textarea` 的 `display` 时候，在 `IOS` 下面字体颜色灰蒙蒙的，尝试过给 `textarea:dispay` 添加属性，去修改字体的颜色，但是好像都失效了 。最后改用了 `readonly` 去实现，需要加下面一段代码，否则会有光标在那显示

```
[readonly="readonly"] {
  user-select: none;
}
```
## `white-space`
或许你都没有听说过这个属性，但是在关键时刻很好用，是他帮助我解决了一个很大的难题。前面说到过 `div` 模拟 `textarea`。如果是用 `div` 单纯的去显示 `textarea` 内容，在 `vue` 中可以用 `v-html` 去渲染，但是如果接口返回的数据把换行转成是一个空格，这时候如果我们没有进行处理的话，换行会失效。可以选择用 `js` 进行处理，但是没必要，因为 `css` 可以解决。`white-space: pre-wrap;` 解决，就是这么简单。我遇到这个问题，向我领导求助，他能够分分钟想到这个属性，或许这就是大佬佩服佩服。以后碰到空格要换行展示，用它就行了。开心，又学到新的东西
### 总结

或许还有更多更好的实现方式，多个脑袋总会比一个脑袋好用，欢迎大家和我交流。兜兜转转最后我还是选择了使用 `textarea` ，转了一个那么大的圈，回到最初，只想说，革命尚未成功，同志仍需努力。我发现了自己以前写东西都是用别人写好的 `ui` 库，却不曾去思考人家底层是如何实现的？是不是还有其他的实现方式？如果是我会怎么去实现？哎说到底还是自己太菜了，往后余生，请多多关照，多多学习，不要再继续这么菜了
