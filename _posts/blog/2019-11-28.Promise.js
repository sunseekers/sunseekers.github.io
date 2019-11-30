const PENDING =  'pending';//初始态
const FULFILLED =  'fulfilled';//成功始态
const REJECTED =  'rejected';//失败始态
function Promise1(executor){
    const self = this
    self.status = PENDING
     self.value = ''
     //所有成功的函数
     self.onResolvedCallbacks = []
     //所有失败的函数
     self.onRejectedCallbacks = []
    // 成功调用的函数
    function resolve(value){
			if(value!=null &&value.then&&typeof value.then == 'function'){
				return value.then(resolve,reject);
			}
			if(self.status == PENDING){
        self.status = FULFILLED;
        self.value = value;//成功后会得到一个值，这个值不能改
        //调用所有成功的回调
        self.onResolvedCallbacks.forEach(cb=>cb(self.value));
      }
    }
    // 失败调用的函数
    function reject(reason){
			if(self.status == PENDING){
        self.status = REJECTED;
        self.value = reason;//失败的原因给了value
        self.onRejectedCallbacks.forEach(cb=>cb(self.value));
      }
    }
    try{
        executor(resolve,reject);
    }catch(e){
        reject(e)
    }
}
function resolvePromise(promise2,x,resolve,reject){
	if(promise2 ===x ){
    return reject(new TypeError('循环引用'));
	}
  let called = false;//promise2是否已经resolve 或reject了
	//x是一个thenable对象或函数，只要有then方法的对象，
	if(x!=null&&((typeof x==='object')||(typeof x==='function'))){
		try{
			let then = x.then
			if(typeof then==='function'){
				then.call(x,function(y){
					//如果promise2已经成功或失败了，则不会再处理了
          if(called)return;
          called = true;
          resolvePromise(promise2,y,resolve,reject)
				},function(err){
					if(called)return;
					called = true;
					reject(err);
				})
			}else{
				//到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
				resolve(x);
			}
		}catch(e){
			if(called)return;
     called = true;
     reject(e);
		}
	}else{
    resolve(x);
	}
}
Promise1.prototype.then = function(onFulfilled, onRejected){
    onFulfilled = typeof onFulfilled ==='function' ? onFulfilled:value=>value
    onRejected = typeof onRejected ==='function' ? onRejected:value=>value
    let self = this;
    let promise2;
    if(self.status===FULFILLED){
				console.log('fulfilled');
				return new Promise1(function(resolve,reject){
					setTimeout(function(){
						try{
							let x =onFulfilled(self.value);
							//如果获取到了返回值x,会走解析promise的过程
							resolvePromise(promise2,x,resolve,reject);
						}catch(e){
							//如果执行成功的回调过程中出错了，用错误原因把promise2 reject
							reject(e);
						}
					})
				})
    }
    if(self.status===REJECTED){
			return promise2 = new Promise(function(resolve,reject){
				setTimeout(function(){
					try{
						let x =onRejected(self.value);
						resolvePromise(promise2,x,resolve,reject);
					}catch(e){
						reject(e);
					}
				})
			});
    }
    if(self.status===PENDING){
			return promise2 = new Promise(function(resolve,reject){
				self.onResolvedCallbacks.push(function(){
						try{
							let x =onFulfilled(self.value);
							//如果获取到了返回值x,会走解析promise的过程
							resolvePromise(promise2,x,resolve,reject);
						}catch(e){
							reject(e);
						}
	 
				});
				self.onRejectedCallbacks.push(function(){
						try{
							let x =onRejected(self.value);
							resolvePromise(promise2,x,resolve,reject);
						}catch(e){
							reject(e);
						}
				});
			});
    }
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
class Promise{
	constructor(fn){
		if(typeof fn!='function') return '不是一个函数'
		this.status = PENDING
		this.value = ''
		this.onResolvedCallbacks = []
		this.onRejectedCallbacks = []
		const resolve = value=>{
			if(value!=null&&( value.then&&typeof value.then==='function')){
				return value.then(resolve,reject)
			}

			if(this.status===PENDING){
			this.value = value
			this.status = RESOLVED
			this.onResolvedCallbacks.forEach(item=>item(this.value))
			}
		}
		const reject = value=>{
			if(this.status===PENDING){
				this.value = value
				this.status = REJECTED
				this.onRejectedCallbacks.forEach(item=>item(this.value))
				}
		}
		try{
			fn(resolve,reject)
		}catch(e){
			reject(e)
		}
	}
	then(onFulfilled,onRejected){
		onFulfilled = typeof onFulfilled ==='function' ? onFulfilled:value=>value
		onRejected = typeof onRejected ==='function' ? onRejected:value=>value
		let promise2

		if(this.status===RESOLVED){
			return promise2 = new Promise((resolve,reject)=>{
				setTimeout(()=>{
					try{
						let x = onFulfilled(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2,x,resolve,reject);		
					}catch(e){
						reject(e)
					}
				})
			})
		}
		if(this.status===REJECTED){
			let promise2
			return promise2 = new Promise((resolve,reject)=>{
				setTimeout(()=>{
					try{
						let x = onRejected(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2,x,resolve,reject);		
					}catch(e){
						reject(e)
					}
				})
			})
		}
		if(this.status===PENDING){
			//不知道什么时候会成功或者失败，把所有的都压入进去
		return promise2 =new Promise((resolve,reject)=>{
			this.onResolvedCallbacks.push(()=>{
				setTimeout(()=>{
					try{
						console.log(1212);
						let x = onFulfilled(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2,x,resolve,reject);		
					}catch(e){
						reject(e)
					}
				})
			})
			this.onRejectedCallbacks.push(()=>{
				setTimeout(()=>{
					try{
						let x = onRejected(this.value)
						//如果获取到了返回值x,会走解析promise的过程
						resolvePromise(promise2,x,resolve,reject);		
					}catch(e){
						reject(e)
					}
				})
			})
		})	
		}
	}
}
function resolvePromise(promise2,x,resolve,reject){
	if(promise2===x){
		return '循环引用'
	}
	let called = false
	if(x!=null && (typeof x==='object'||typeof x==='function')){
		try{
			let then = x.then()
			if(typeof then==='function'){
				then.call(x,function(y){
					//如果promise2已经成功或失败了，则不会再处理了
					if(called)return;
					called = true;
					resolvePromise(promise2,y,resolve,reject)
				},function(err){
					if(called)return;
					called = true;
					reject(err);
				})
			}else{
				//到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
				resolve(x);
			}
		}catch(e){
			if(called)return;
			called = true;
			reject(e);
		}
	}else{
		resolve(x)
	}
}
new Promise((resolve, reject) => {
	setTimeout(() => {
			resolve({ test: 1 })
			resolve({ test: 2 })
			reject({ test: 2 })
	}, 1000)
}).then((data) => {
	console.log('result1', data)
},(data1)=>{
	console.log('result2',data1)
}).then((data) => {
	console.log('result3', data)
})
console.log(78)



///////////////////////////////////////////////

const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
class myPromise{
	constructor(fn){
		if(typeof fn !=='function') return '不是函数'
		this.status=PENDING
		this.value=""
		this.onResolvedCallbacks = []
		this.onRejectedCallbacks = []
		const resolve = value=>{
			if(value!=null&&value.then&&typeof value.then ==='function'){
				return value.then(resolve,reject)
			}
			if(this.status===PENDING){
				this.status=RESOLVED
				this.value=value
				this.onResolvedCallbacks.forEach(item=>item(this.value))
			}
		}
		const reject = value=>{
			if(this.status===PENDING){
				this.status=REJECTED
				this.value=value
				this.onRejectedCallbacks.forEach(item=>item(this.value))
			}
		}
		try{
			fn(resolve,reject)
		}catch(e){
			reject(e)
		}
	}
	then(onFulfilled,onRejected){
		onFulfilled = typeof onFulfilled==='function'? onFulfilled:value=>value
		onRejected = typeof onRejected==='function'? onRejected:value=>value
		let promise2
		if(this.status===RESOLVED){
			return promise2 = new myPromise((resolve,reject)=>{
				setTimeout(()=>{
					try{
						let x = onFulfilled(this.value)
						resolvePromise(promise2,x,resolve,reject)
					}catch(e){
						reject(e)
					}
				})
			})
		}

		if(this.status===REJECTED){
			return promise2 = new myPromise((resolve,reject)=>{
				setTimeout(()=>{
					try{
						let x = onRejected(this.value)
						resolvePromise(promise2,x,resolve,reject)
					}catch(e){
						reject(e)
					}
				})
			})
		}

		if(this.status===PENDING){
			return promise2 = new myPromise((resolve,reject)=>{
				this.onResolvedCallbacks.push(()=>{
					setTimeout(()=>{
						try{
							let x = onFulfilled(this.value)
							resolvePromise(promise2,x,resolve,reject)
						}catch(e){
							reject(e)
						}
					})
				})
				this.onRejectedCallbacks.push(()=>{
					setTimeout(()=>{
						try{
							let x = onRejected(this.value)
							resolvePromise(promise2,x,resolve,reject)
						}catch(e){
							reject(e)
						}
					})
				})
			})
		}
	}
}
function resolvePromise(myPromise,x,resolve,reject){
	if(myPromise===x){
		throw("循环使用")
	}
	let called = false
	if(x!=null&&(typeof x==='object' ||typeof x==="function")){
		try{
			let then = x.then()
			if(typeof then ==="function"){
				then.call(x,y=>{
					if(called) return 
					called = true
					resolvePromise(promise2,y,resolve,reject)
				},reject=>{
					if(called) return 
					called = true
					reject(err)
				})
			}else{
				resolve(x)
			}
		}catch(e){
			if(called) return 
			called = true
			reject(e)
		}
		
	}else{
		resolve(x)
	}
}