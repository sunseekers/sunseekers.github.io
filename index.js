var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
function flatArr(arr,nodeList = []){
  return arr.reduce((total,item)=>{
    if(Array.isArray(item)){
      flatArr(item,total)
    }else{
      total.push(item)
    }
    return total
  },nodeList)
}

//设计模式
  //工厂模式：不关心内部如何实现，以及内部逻辑，只需要提供一个接口
class Man {
  constructor(name){
    this.name = name
  }
  alertName(){
    alert(this.name)
  }
}
class Factory {
  static create(name){
    return new Man(name)
  }
}

Factory.create('yck').alterName()

//单例模式：全局只有一个对象可以访问，一个变量确保实例只创建一次
class Singleton {
  constructor(){}
}
Singleton.getInstance = (function(){
  let instance
  return function(){
    if(!instance){
      instance = new Singleton()
    }
    return instance
  }
})()
  //适配器模式：两个接口不兼容的情况下，不需要改变已有的接口，通过包装一层的方式实现，在vue中经常用到
//比如父组件传递给子组件一个时间戳属性，组件内部需要将时间戳转为正常的日期显示，一般会使用 computed 来做转换这件事情，这个过程就使用到了适配器模式
class Plug{
  getName(){
    return '港版插头'
  }
}
class Target {
  constructor(){
    this.plug = new Plug()
  }
  getName(){
    return this.plug.getName()+' 适配器转二脚插头'
  }
}
//装饰模式：不需要改变已有的接口，作用是给对象添加功能,在 React 中，装饰模式其实随处可见,目前好像不能直接使用待验证
function readonly(target,key,descriptor){
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = 'yck'
}
let t = new Test()

t.yck = '111' // 不可修改
console.log(t)
// //代理模式：最常见的就是事件代理，给父元素绑定事件代理给所有的子元素
// <ul id="ul">
//   <li>1</li>
//   <li>2</li>
//   <li>3</li>
//   <li>4</li>
//   <li>5</li>
//   </ul>
//   <script>
//   let ul = document.querySelector('#ul')
// ul.addEventListener('click', (event) => {
//   console.log(event.target);
// })
// </script>

// 发布-订阅模式：也叫观察者模式，通过一对一或者一对多，当对象发生改变时，就会订阅方就会收到通知
//在 Vue 中，如何实现响应式也是使用了该模式。对于需要实现响应式的对象来说，在 get 的时候会进行依赖收集，当改变了对象的属性时，就会触发派发更新。


function Person(name,age){
  this.name=name
  this.age=age
  return this
}


(function(global){
  let NaNSymbol = Symbol("NaN")
  let encodeVal=value=>value!==value?NaNSymbol:value
  let decodeVal=value=>value===NaNSymbol?NaN:value
  let makeIterator=(array,iterator)=>{
    let nextIndex=0
    let obj={
      next(){
        return nextIndex<array.length?{value:iterator(array[nextIndex++]),done:false}:{value:0,done:true}
      }
    }
    // 让这个obj具有可叠性
    obj[Symbol.iterator]=()=>obj
    return obj
  }
  function forOf(obj,cb){
    if(typeof obj[Symbol.iterator]!=="function") throw new TypeError(`${obj} is not iterable`)
    if(typeof cb!=='function')throw new TypeError('cb must be callable')
    iterable=obj[Symbol.iterator]()
    result=iterable.next()
    while(!result.done){
      cb(result.value)
      result=iterable.next()
    }
  }
  function Set(data){
    this._value=[]
    this.size=0
    forOf(data,item=>this.add(item))
  }
  Set.prototype['add']=value=>{
    value=encodeVal(value)
    if(this._value.indexOf(value)==-1){
      this._value.push(value)
      ++this.size
    }
    return this
  }
  Set.prototype['has']=value=>this._value.indexOf(encodeVal(value))!==-1
  Set.prototype['delete'] = function(value) {
    var idx = this._values.indexOf(encodeVal(value));
    if (idx == -1) return false;
    this._values.splice(idx, 1);
    --this.size;
    return true;
}

Set.prototype['clear'] = function(value) {
    this._values = [];
    this.size = 0;
}
Set.prototype['forEach']=(callbackFn,thisArg)=>{
  
}
})

function Parent(name){
  this.name=name
}
Parent.prototype.getName=()=>{
  console.log(this.name);
}
function Child(name,age){
  Parent.call(this,name)
  this.age=age
}
Child.prototype=Object.create(Parent.prototype)

class Parent{
  constructor(name){
    this.name=name
  }
}
class Child extends Parent{
  constructor(name,age){
    super(name)
    this.age=age
  }
}

(function(){
  let root = this
  function watch(obj,name,func){
    let value = obj[name]
    Object.defineProperty(obj,name,{
      get(){
        console.log(23);
        return value
      },
      set(newValue){
        console.log(2232332);
        value=newValue
        func(newValue)
      }
    })
    if(value) obj[name]=value
  }
})