---
layout: post
title: 模拟 Promise API
categories: [JavaScript]
description: 发现，探索 Promise 优质文章
keywords: Promise
---

# 模拟 Promise API
封装了一个异步操作，并且还可以获取成功或者失败的结果

`Promise` 是 `JavaScript` 语言提供的一种标准化的异步管理方式，它的总体思想是，需要进行 `io`、等待或者其它异步操作的函数，不返回真实结果，而返回一个“承诺”，函数的调用方可以在合适的时机，选择等待这个承诺兑现（通过 `Promise` 的 `then` 方法的回调

首先我们分析有多少个宏任务；在每个宏任务中，分析有多少个微任务；根据调用次序，确定宏任务中的微任务执行次序；根据宏任务的触发规则和调用次序，确定宏任务的执行次序；确定整个顺序。

一旦我们创建了promise请求，他就会立即执行，不能中途取消，不设置回调，内部的结果就不会反馈到外面去
## 异步并行执行代码

场景 1: 多个请求并行请求优化处理

```
const promises = [getAgoraToken(params), getAgoraToken(params),getLive(), getList(liveId)];
const tokens =  Promise.all(promises);
console.log('tokens 是一个数组',tokens);
```

场景 2: 异步删除文件

```
function rmdir(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (err) return reject(err)
      if (stat.isDirectory()) {
        fs.readdir(dir, (err, files) => {
          if (err) return reject(err)
          Promise.all(files.map(item => rmdir(path.join(dir, item)))).then(() => {
            fs.rmdir(dir, resolve)
          })
        })
      } else {
        fs.unlink(dir, resolve)
      }
    })
  })
}
```

## 超时重连

原理其实很简单，就是利用 `Promise.race`，我们先创建一个 `Promise`，里面用 `setTimeout` 进行处理，然后将新创建的 `Promise` 与我们之前使用的 `Promise` "比赛"一下。

```
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
            throw new Error('Operation timed out after ' + ms + ' ms');
        });
    return Promise.race([promise, timeout]);
}
function getData(){}

timeoutPromise(getDate,1000).then(()=>{})
```

## `Promise` 和 `async await`
都是处理异步请求的方式，Promise 是es6，async await是es7，async await 是基于 promise实现的，都是

语法表现形式不一样

 `await` 如果它等到的是一个 `Promise` 对象， `await` 就忙起来了， 它会阻塞后面的代码， 等着 `Promise` 对象 `resolve`，然后得到 `resolve` 的值， 作为 `await` 表达式的运算结果。

 `await` 如果它等到的不是一个 `Promise` 对象， 那 `await` 表达式的运算结果就是它等到的东西，这里也会是一个微任务

`asycn await` 是异步处理的终极解决方案， 其实是 `generator + promise` 的终极语法糖

`asycn await` 可以进行 `try` 处理， 但是 `promise` 不能够进行这个处理,语法更加简介， 像同步函数一样

`return` 有返回值， 但是 `promise` 没有

`await` 后面必须跟一个 `promise`， 如果会转成 `promise`

```
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);// Promise {<resolved>: "hello async"}
```
看到输出就恍然大悟了——输出的是一个 Promise 对象。所以，async 函数返回的是一个 Promise 对象，如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。

Promise.resolve(x) 可以看作是 new Promise(resolve => resolve(x)) 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

`await` 会变成微任务，不管是否有需要等待

```
async function foo() {
console.log(1)
let a = await 100 ///这句话相当与 new Promise((resolve,reject)=>resolve(100))
console.log(a)
console.log(2)
}
console.log(0)
foo()
console.log(3)// 打印的顺序表示了执行的顺序，await 会变成微任务，不管是否有需要等待
```

```
// 把一个圆形 div 按照绿色 3 秒，黄色 1 秒，红色 2 秒循环改变背景色，
async function changeColor(duration,color){
  await new Promise((resolve)=>{
    setTimeout(resolve,duration)
  })
}
async function main(duration,color){
  while(true){
    await changeColor(3000,'green')
    await changeColor(2000,'orang')
    await changeColor(1000,'red')

  }
}
```

### async 地狱

```
(async ()=>{
  const getList=await getList()
  const getAnotherList = await getAnotherList()
})()
```
getList() 和 getAnotherList() 其实并没有依赖关系，但是现在的这种写法，虽然简洁，却导致了 getAnotherList() 只能在 getList() 返回后才会执行，从而导致了多一倍的请求时间。

为了解决这个问题，我们可以改成这样：

```
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();
```

优化处理，使用 Promise.all()：

```
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```

[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)

[async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)

## 自己手写一个 Promise

```
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
class myPromise {
  constructor(fn) {
    if (typeof fn !== 'function') return '不是函数'
    this.status = PENDING
    this.value = ''
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (value != null && value.then && typeof value.then === 'function') {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = RESOLVED
        this.value = value
        this.onResolvedCallbacks.forEach(item => item(this.value))
      }
    }
    const reject = value => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.value = value
        this.onRejectedCallbacks.forEach(item => item(this.value))
      }
    }
    try {
      fn(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : value => value
    let promise2
    if (this.status === RESOLVED) {
      return (promise2 = new myPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }

    if (this.status === REJECTED) {
      return (promise2 = new myPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }))
    }

    if (this.status === PENDING) {
      return (promise2 = new myPromise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }))
    }
  }
}

function resolvePromise(myPromise, x, resolve, reject) {
  if (myPromise === x) {
    throw '循环使用'
  }
  let called = false
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then()
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(myPromise, y, resolve, reject)
          },
          reject => {
            if (called) return
            called = true
            reject(err)
          },
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      test: 1,
    })
  }, 1000)
})
  .then(
    data => {
      console.log('result1', data)
    },
    data1 => {
      console.log('result2', data1)
    },
  )
  .then(data => {
    console.log('result3', data)
  })
```


[9k字 | Promise/async/Generator实现原理解析](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)

es5 寄生组合式继承
