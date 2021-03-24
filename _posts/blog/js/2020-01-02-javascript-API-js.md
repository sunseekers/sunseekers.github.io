---
layout: post
title: javaScript API
categories: [JavaScript]
description: javaScript API
keywords: javaScript API
---

# 可互替的  `API`
如果遇到兼容性的问题，我们可以尝试用多个 `api` 改写，最后写出我们要的结果

## 举个例子

场景：在一次开发的过程中遇到了 `includes` 方法不兼容，后来用 `indexOf` 替换
//判断一个字符串是否包含另一个字符串
console.log(content.includes('b'));
console.log(content.indexOf('b')!=-1);

## 简化版 `flat` 方法

```
function flat(list){
  return list.reduce((acc,val)=>
    Array.isArray(val)?acc.concat(flat(val)):acc.concat(val)
  ,[])
}
```
## 简化版 `filter` 方法

```
Array.prototype.filter = function(fn){
    let newArr = []
    console.log(this)
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        flag&&newArr.push(this[i])
    }
    return newArr
}
```

## 简化版 `every` 方法

```
//要求每一个元素都要符合条件，只要有一个不符合就退出
Array.prototype.every = function(fn){
    let flag = true
    for(let i = 0 ; i<this.length;i++){
         flag = fn(this[i])
        if(!flag){
          return false
        }
    }
    return flag
}
```

## 简化版 `some` 方法

```
//要求只要有一个元素都要符合条件
Array.prototype.some = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return flag
        }
    }
    return false
}
```


## 简化版 `find` 方法

```
//要求只要有一个元素都要符合条件,就返回这个元素
Array.prototype.find = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return this[i]
        }
    }
}
```
## 简化版 `findIndex` 方法

```
//要求只要有一个元素都要符合条件,就返回这个元素
Array.prototype.findIndex = function(fn){
    for(let i = 0 ; i<this.length;i++){
        let flag = fn(this[i])
        if(flag){
          return i
        }
    }
}
```

If you need the index of the found element in the array, use findIndex().

If you need to find the index of a value, use Array.prototype.indexOf(). 
(It’s similar to findIndex(), but checks each element for equality with the value instead of using a testing function.)

If you need to find if a value exists in an array, use Array.prototype.includes(). Again, it checks each element for equality with the value instead of using a testing function.

If you need to find if any element satisfies the provided testing function, use Array.prototype.some().


[Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)





