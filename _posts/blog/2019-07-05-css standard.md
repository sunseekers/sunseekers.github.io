---
layout: post
title: 前端规范
categories: [前端面试]
description: 前端面试
keywords: 前端规范
---

# 团队规范高于一切规范
大部分团队规范都是在慢慢探索，实践规范起来的。适合团队的就是最好，否者都是纸上谈兵

## 我平时写代码应该有的规范

每个常量都该命名，用有意义且常用的单词命名变量，长时间之后还知道这个常量是做什么的


使用 `forEach` 或者其他循环的时候，参数命名要简单易懂，可描述性

避免无意义的前缀命名，比如我前面写过的

```
Bad:
const car = {
  carMake: 'Honda',
  carModel: 'Accord',
  carColor: 'Blue'
};

Good:
const car = {
  make: 'Honda',
  model: 'Accord',
  color: 'Blue'
};
```


函数参数越少越好，参数多了可以考虑使用结构，不用考虑参数顺序


一个函数只做一件事情

函数名要一眼就看懂是做什么的

有一些规范已经融入骨髓，不好拿出来写了，上面的是我需要进一步改进的规范

可参考[[前端开发]--分享个人习惯的命名方式](https://juejin.im/post/5b6ad6b0e51d4519171766e2) 我觉得他写的很好，可以借鉴和学习。推荐学习和收藏

