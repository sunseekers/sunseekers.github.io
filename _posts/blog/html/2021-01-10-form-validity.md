---
layout: post
title: form 表单验证元素
categories: [HTML]
description: 发现，探索 web 优质文章
keywords: form 表单验证元素
---

# 背景
接着前面的的表单元素继续说，用户提交一个表单或者一段数据的时候，通常我们都会有表单验证，验证内容是否合法，验证内容的有效性，验证内容是否填写了等等，这样的需求在平常的项目里面应该是一个很常见的操作。如果你对form表单有了解，我相信你很多事原生标签都帮你做了

## 表单样式修改
我们可以通过 css 的伪类来控制表单验证的情况，

[:valid 内容验证正确](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:valid)

[:invalid 内容未通过验证](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:invalid)

[:optional 任意没有required属性的](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:optional)

[:required 必选的时候样式](https://developer.mozilla.org/en-US/docs/Web/CSS/:required)

[:focus-within 元素获得焦点，他的父元素发生变化](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-within)


## form表单元素内置验证方法和属性

checkValidity()方法可以用来验证当前表单控件元素，或者整个表单是否验证通过，返回值是布尔值，true或者false。

reportValidity()方法可以触发浏览器的内置的验证提示交互，返回布尔值，true或者false

setCustomValidity()方法顾名思义就是设置自定义的验证，我们可以使用这个方法自定义提示文字。

[HTMLFormElement.elements](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLFormElement/elements)：获得 form 中所有的表单控件元素（输入框、下拉框、选择框等）

[fieldset:disabled](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/fieldset):如果设置了这个 bool 值属性, <fieldset> 的所有子代表单控件也会继承这个属性

## 参考资料
[checkValidity等form原生JS验证方法和属性详细介绍](https://www.zhangxinxu.com/wordpress/2019/08/js-checkvalidity-setcustomvalidity/)


[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)

[HTMLFormElement - 表示 DOM 中的 <form> 元素](https://www.mifengjc.com/api/HTMLFormElement.html)

