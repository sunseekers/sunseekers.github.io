---
layout: post
title: 无障碍访问
categories: [HTML]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---

# 什么是无障碍访问

无障碍性是最常用于描述设施或设施,帮助残疾人，让他们也可以很好的使用产品。[MDN 无障碍介绍](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility) 

## 如何提高无障碍访问

[WAI-ARIA basics](https://developer.mozilla.org/zh-CN/docs/Learn/Accessibility/WAI-ARIA_basics): 通过浏览器和一些辅助技术，进一步实现语义化
这样一来能帮助我们解决问题，也让用户可以了解发生了什么,如屏幕阅读器，屏幕阅读机可以大声朗读或者输出盲文。

ARIA就是可以让屏幕阅读器准确识别网页中的内容，变化，状态的技术规范

无障碍访问的时候，使用 aria-label 属性添加描述，aria-label标签来为辅助设备提供相应的标识来告诉它这个元素有xxx的作用。

### role 常用的属性见名思义
这定义了元素是干什么的

button，checkbox，radio，radiogroup，tabpanel，tablist，tab，timer，navigation，menu，group，listbox（列表框），option，alert，grid，heading，alertdialog

### ARIA 属性值

定义一些属性给元素，让他们具备更多的语义

aria-busy: 是否处于忙碌状态

aria-label: 添加描述，方便辅助设备的访问

aria-sort: 是否升序(ascending)还是降序(descending)

aria-valuemax: 表允许的最大值

aria-valuemin: 表示允许的最小值

aria-valuenow: 表示当前值

aria-required: 是否必须

aria-checked: 用户选择了哪些属性

aria-disabled: 表禁用状态

aria-hidden: 表示元素隐藏不见

aria-selected: 表示选择状态

aria-multiselectable: 是否可以多选

aria-level: 等级有点类似h1-h6

[aria-labelledby](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute): 与id属性进行关联

## 无障碍在项目中的使用
a 标签记得设置href兜底，如果有js逻辑会走js逻辑（js逻辑优先级高于HTML上面的逻辑）

纯图片按钮加上aria-label="xxx"

图片加上alt属性

role="tab" role="tablist" role="tabpanel"以及aria-selected="true" 和 aria-selected="false" 的识别

## 语义化
`<figure> + <img> + <figcaption>` 图片文字打成一块

装饰图不能使用img，否则会影响语义化，无障碍访问，建议使用i或者伪元素

辅助性文字可以使用伪元素实现


## 参考文档
[基于VoiceOver的移动web站无障碍访问实战](https://www.zhangxinxu.com/wordpress/2017/01/voiceover-aria-web-accessible-iphone/)

[WAI-ARIA无障碍网页应用属性完全展示](https://www.zhangxinxu.com/wordpress/2012/03/wai-aria-%e6%97%a0%e9%9a%9c%e7%a2%8d%e9%98%85%e8%af%bb/)

[HTML tabindex属性与web网页键盘无障碍访问](https://www.zhangxinxu.com/wordpress/2017/05/html-tabindex/)