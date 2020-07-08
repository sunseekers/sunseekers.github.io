---
layout: post
title: javascript 代码优化相关
categories: [JavaScript]
description: 发现，探索 javascript 优质文章
keywords: javascript
---

# 平时代码可优化
一些值得参考代码优化相关的提议

## if 语句
多个if else可以考虑条件之间的联系，用|| && 实现

map结构的key-value关系对应

```
let obj={
   'status=1&type=1':'普通用户在预售中参与活动，赠送700积分',
   'status=1&type=2':'vip用户在预售中参与活动，赠送1000积分',
   'status=2&type=1':'普通用户在进行中参与活动，赠送300积分',
   'status=2&type=2':'普通用户在进行中参与活动，赠送800积分'
}

console.log(obj[`status=${status}&type=${type}`])
```

数组下标进行存储

if return

switch优化

// 例子 5-2
// 根据颜色找出对应的水果

```
// bad
function test(color) {
  switch (color) {
    case 'red':
      return ['apple', 'strawberry'];
    case 'yellow':
      return ['banana', 'pineapple'];
    case 'purple':
      return ['grape', 'plum'];
    default:
      return [];
  }
}

test('yellow'); // ['banana', 'pineapple']

// good
const fruitColor = {
  red: ['apple', 'strawberry'],
  yellow: ['banana', 'pineapple'],
  purple: ['grape', 'plum']
};

function test(color) {
  return fruitColor[color] || [];
}

// better
const fruitColor = new Map()
  .set('red', ['apple', 'strawberry'])
  .set('yellow', ['banana', 'pineapple'])
  .set('purple', ['grape', 'plum']);

function test(color) {
  return fruitColor.get(color) || [];
}
```
