// 基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。 装箱转换
// 模仿call 方法
Function.prototype.selfCall = function(context) {
  let func = this //this 在哪调用指向哪，这里是在一个函数里面调用，所以指向调用他的函数
  console.log(this)
  context || (context = window)
  if (typeof func !== 'function') throw new TypeError('this is not function')
  context.fn = func //这里会产生装箱操
  let args = [...arguments].slice(1)
  let res = context.fn(args)
  delete context.fn
  return res
}
// 模仿apply 方法
Function.prototype.selfApply = function(context) {
  let func = this //this 在哪调用指向哪，这里是在一个函数里面调用，所以指向调用他的函数
  context || (context = window)
  if (typeof func !== 'function') throw new TypeError('this is not function')
  context.fn = func //这里会产生装箱操
  let args = [...arguments][1]
  if (!args) {
    return context.fn()
  }
  let res = context.fn(args)
  delete context.fn
  return res
}
// 判断类型
function isType(type) {
  return obj => {
    // call 本身会产生装箱操作
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }
}
// 相当于
const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`

function c1() {
  console.log(this, '888')
  this.p1 = 1
  this.p2 = function() {
    console.log(this.p1)
  }
}
c1() // this 指向window
let c = new c1() // this 指向函数本身
