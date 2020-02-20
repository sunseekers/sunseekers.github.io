---
layout: post
title: 模拟 Promise API
categories: [JavaScript]
description: 发现，探索 Promise 优质文章
keywords: Promise
---
```
const PENDING = 'pending'; //初始态
const FULFILLED = 'fulfilled'; //成功始态
const REJECTED = 'rejected'; //失败始态
function Promise1(executor) {
	const self = this
	self.status = PENDING
	self.value = ''
	//所有成功的函数
	self.onResolvedCallbacks = []
	//所有失败的函数
	self.onRejectedCallbacks = []
	// 成功调用的函数
	function resolve(value) {
		if (value != null && value.then && typeof value.then == 'function') {
			return value.then(resolve, reject);
		}
		if (self.status == PENDING) {
			self.status = FULFILLED;
			self.value = value; //成功后会得到一个值，这个值不能改
			//调用所有成功的回调
			self.onResolvedCallbacks.forEach(cb => cb(self.value));
		}
	}
	// 失败调用的函数
	function reject(reason) {
		if (self.status == PENDING) {
			self.status = REJECTED;
			self.value = reason; //失败的原因给了value
			self.onRejectedCallbacks.forEach(cb => cb(self.value));
		}
	}
	try {
		executor(resolve, reject);
	} catch (e) {
		reject(e)
	}
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('循环引用'));
	}
	let called = false; //promise2是否已经resolve 或reject了
	//x是一个thenable对象或函数，只要有then方法的对象，
	if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
		try {
			let then = x.then
			if (typeof then === 'function') {
				then.call(x, function (y) {
					//如果promise2已经成功或失败了，则不会再处理了
					if (called) return;
					called = true;
					resolvePromise(promise2, y, resolve, reject)
				}, function (err) {
					if (called) return;
					called = true;
					reject(err);
				})
			} else {
				//到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
				resolve(x);
			}
		} catch (e) {
			if (called) return;
			called = true;
			reject(e);
		}
	} else {
		resolve(x);
	}
}
Promise1.prototype.then = function (onFulfilled, onRejected) {
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
	onRejected = typeof onRejected === 'function' ? onRejected : value => value
	let self = this;
	let promise2;
	if (self.status === FULFILLED) {
		console.log('fulfilled');
		return new Promise1(function (resolve, reject) {
			setTimeout(function () {
				try {
					let x = onFulfilled(self.value);
					//如果获取到了返回值x,会走解析promise的过程
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					//如果执行成功的回调过程中出错了，用错误原因把promise2 reject
					reject(e);
				}
			})
		})
	}
	if (self.status === REJECTED) {
		return promise2 = new Promise(function (resolve, reject) {
			setTimeout(function () {
				try {
					let x = onRejected(self.value);
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					reject(e);
				}
			})
		});
	}
	if (self.status === PENDING) {
		return promise2 = new Promise(function (resolve, reject) {
			self.onResolvedCallbacks.push(function () {
				try {
					let x = onFulfilled(self.value);
					//如果获取到了返回值x,会走解析promise的过程
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					reject(e);
				}

			});
			self.onRejectedCallbacks.push(function () {
				try {
					let x = onRejected(self.value);
					resolvePromise(promise2, x, resolve, reject);
				} catch (e) {
					reject(e);
				}
			});
		});
	}
}
//catch 的原理是只传一个失败的回调
Promise1.prototype.catch = function (onRejected) {
	this.then(null, onRejected)
}

function gen(items, cb) {
	let result = [],
		counts = 0;
	return function (i, data) {
		result[i] = data
		if (++counts === items) {
			cb(result)
		}
	}
}
// all 方法是所有的都成功了才调用成功的方法
Promise1.all = function (promises) {
	return new Promise1((resolve, reject) => {
		let done = gen(promises.length, resolve)
		for (let i = 0; i < promises.length; i++) {
			promises[i].then(data => {
				done(i, data)
			}, reject)
		}
	})
}
// race 方法是只要有一个成功了才调用成功的方法
Promise1.race = function (promises) {
	return new Promise1((resolve, reject) => {
		for (let i = 0; i < promises.length; i++) {
			promise1[i].then(resolve, reject)
		}
	})
}
Promise1.resolve = value => {
	return new Promise1(resolve => resolve(value))
}
Promise1.reject = value => {
	return new Promise1(reject => reject(value))
}
// console.log(1)
// function a(){
//    return new Promise(resolve=>{
//         console.log(2)
//         resolve()
//     })
// }
// setTimeout(()=>{
//     console.log(79);
// })//宏1
// a().then(res=>{
//     console.log(4);
//     new Promise(res=>{
//         console.log(5)
//         res()
//     })
//     setTimeout(()=>{
//         console.log(7);
//     })//微宏1
// }).then(res=>{
//     console.log(6);
//     new Promise(res=>{
//         console.log(51)
//         res()
//     })
//     setTimeout(()=>{
//         console.log(97);
//     })//微宏1
// }).then(res=>console.log('2121212121')).then(res=>console.log('a'))
// setTimeout(()=>{
//     console.log(799);
// })////宏2
// console.log(3);


const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
class Promise {
	constructor(fn) {
		if (typeof fn != 'function') return '不是一个函数'
		this.status = PENDING
		this.value = ''
		this.onResolvedCallbacks = []
		this.onRejectedCallbacks = []
		const resolve = value => {
			if (value != null && (value.then && typeof value.then === 'function')) {
				return value.then(resolve, reject)
			}

			if (this.status === PENDING) {
				this.value = value
				this.status = RESOLVED
				this.onResolvedCallbacks.forEach(item => item(this.value))
			}
		}
		const reject = value => {
			if (this.status === PENDING) {
				this.value = value
				this.status = REJECTED
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
			return promise2 = new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		if (this.status === REJECTED) {
			let promise2
			return promise2 = new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						let x = onRejected(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2, x, resolve, reject);
					} catch (e) {
						reject(e)
					}
				})
			})
		}
		if (this.status === PENDING) {
			//不知道什么时候会成功或者失败，把所有的都压入进去
			return promise2 = new Promise((resolve, reject) => {
				this.onResolvedCallbacks.push(() => {
					setTimeout(() => {
						try {
							console.log(1212);
							let x = onFulfilled(this.value)
							//如果获取到了返回值x,会走解析promise的过程
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e)
						}
					})
				})
				this.onRejectedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onRejected(this.value)
							//如果获取到了返回值x,会走解析promise的过程
							resolvePromise(promise2, x, resolve, reject);
						} catch (e) {
							reject(e)
						}
					})
				})
			})
		}
	}
}

function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return '循环引用'
	}
	let called = false
	if (x != null && (typeof x === 'object' || typeof x === 'function')) {
		try {
			let then = x.then()
			if (typeof then === 'function') {
				then.call(x, function (y) {
					//如果promise2已经成功或失败了，则不会再处理了
					if (called) return;
					called = true;
					resolvePromise(promise2, y, resolve, reject)
				}, function (err) {
					if (called) return;
					called = true;
					reject(err);
				})
			} else {
				//到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
				resolve(x);
			}
		} catch (e) {
			if (called) return;
			called = true;
			reject(e);
		}
	} else {
		resolve(x)
	}
}
new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve({
			test: 1
		})
		resolve({
			test: 2
		})
		reject({
			test: 2
		})
	}, 1000)
}).then((data) => {
	console.log('result1', data)
}, (data1) => {
	console.log('result2', data1)
}).then((data) => {
	console.log('result3', data)
})
console.log(78)



///////////////////////////////////////////////

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
class myPromise {
	constructor(fn) {
		if (typeof fn !== 'function') return '不是函数'
		this.status = PENDING
		this.value = ""
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
			return promise2 = new myPromise((resolve, reject) => {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e)
					}
				})
			})
		}

		if (this.status === REJECTED) {
			return promise2 = new myPromise((resolve, reject) => {
				setTimeout(() => {
					try {
						let x = onRejected(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e)
					}
				})
			})
		}

		if (this.status === PENDING) {
			return promise2 = new myPromise((resolve, reject) => {
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
			})
		}
	}
}

function resolvePromise(myPromise, x, resolve, reject) {
	if (myPromise === x) {
		throw ("循环使用")
	}
	let called = false
	if (x != null && (typeof x === 'object' || typeof x === "function")) {
		try {
			let then = x.then()
			if (typeof then === "function") {
				then.call(x, y => {
					if (called) return
					called = true
					resolvePromise(myPromise, y, resolve, reject)
				}, reject => {
					if (called) return
					called = true
					reject(err)
				})
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

function fn(n) {
	console.log(78)
	// return new Promise(res=>{
	// 	setTimeout(() => {
	// 		res(`sunseekers${n}`)
	// 	}, n)
	// })
	setTimeout(() => {
		console.log(`sunseekers${n}`)
	}, n)
}
async function a() {
	console.log(2)

	let res = await fn(200000)

	console.log(res, 12)
	let res1 = await fn(1000)
	console.log(res1, 34)
	console.log(12)
	return 'sunseekers'

}
a()
a().then(res => console.log(res))
console.log(1122)

new Promise(resolve => {
	resolve('name')
	return 'sunseeker'
})
// 如果它等到的是一个 Promise 对象， await 就忙起来了， 它会阻塞后面的代码， 等着 Promise 对象 resolve， 然后得到 resolve 的值， 作为 await 表达式的运算结果。

// 如果它等到的不是一个 Promise 对象， 那 await 表达式的运算结果就是它等到的东西，这里也会是一个微任务

// asycn await 是异步处理的终极解决方案， 其实是generator + promise的终极语法糖

// asycn await 可以进行try处理， 但是promise不能够进行这个处理
// 语法更加简介， 像同步函数一样
// return 有返回值， 但是promise没有
// await 后面必须跟一个promise， 如果不是会转成

// https: //segmentfault.com/a/1190000007535316    这个文章写的特别好
// https: //developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function 这个解析很不错

function deepClone(parent, child) {
	child = child ? child : {}
	for (let key in obj) {
		if (parent.hasOwnProperty(key)) {
			if (typeof parent[key] === 'object') {
				child[key] = Object.prototype.toString.call(parent[key]) === 'object object' ? {} : []
				deep(obj[key], child)

			} else {
				child[key] = parent[key]

			}
		} else {}
	}
}

async function foo() {
	return 2
}
console.log(foo())  // Promise {<resolved>: 2}


async function foo() {
	console.log(1)
	let a = await 100 ///这句话相当与 new Promise((resolve,reject)=>resolve(100))
	console.log(a)
	console.log(2)
}
console.log(0)
foo()
console.log(3)// 打印的顺序表示了执行的顺序，await会变成微任务，不管是否有需要等待



async function foo() {
	console.log('foo')
}
async function bar() {
	console.log('bar start')
	await foo() //这里会执行foo函数里面的打印，相当于new promise的resolve 这部分是同步任务
	console.log('bar end')
}
console.log('script start')
setTimeout(function () {
	console.log('setTimeout')
}, 0)
bar();
new Promise(function (resolve) {
	console.log('promise executor')
	resolve();
}).then(function () {
	console.log('promise then')
})
console.log('script end')



 function resolveAfter2Seconds(n) {
  return new Promise(resolve => {
		console.log(n,'9999');
    setTimeout(() => {
      resolve('resolved');
    }, n);
  });
}

async function asyncCall() {
  console.log('calling');
	var result = await resolveAfter2Seconds(20000);
  var result1 = await resolveAfter2Seconds(1000);
  var result2 = await resolveAfter2Seconds(3000);	
  console.log(result);
  // expected output: 'resolved'
}

asyncCall();
//  [1, 2, 5, 7, 8, 9, 13]

function search(list,target){
	let start = 0
	let end = list.length-1
	if(end===0){
		return '数组长度是0'
	}
	while(start<=end){
		let mid = parseInt(start+(end-start)/2)
		if(list[mid]>target){
			console.log(mid,end,2);
			end = mid-1
		}else if(list[mid]<target){
			console.log(mid,end,3);
			start=mid+1
		}
		if(list[mid]===target){
			console.log(mid,end,4);
			return mid
		}
		return -1
	}
}
```