
function myVue(options = {}) {
  // 1
  // this.$options 有vue的所有属性
  this.$options = options
  this.$el = this.$options.el
  let data = this._data = this.$options.data
  // observe 观察数据的变化
  // 2
  observe(data)
  // 在vue中可以直接this.xx 获取到数据，即this代理到数据
  // 4
  for (let key in data) {
    let props = data[key]
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get() {
        console.log('监听获取属性');
        return this._data[key]
      },
      set(val) {
        console.log('监听设置属性');
        if (val === props) return // 如果数据没有发生变化就直接用之前的
        this._data[key] = val // 引用类型，引用的是同一个地址
      }
    })
  }
  new Compile(options.el, this)
}
// 3
function observe(data) {
  if (typeof data !== 'object') return
  return new Observe(data) //逻辑拆分,方便深层监听对象属性
}

function Observe(data) { // 这里写主要的逻辑
  let dep = new Dep()
  // 循环监听每一个属性
  for (let key in data) {
    let props = data[key]
    // 上面分开写的原因
    observe(props)
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        // 读取数据的时候会调用这里的数据
        Dep.target && dep.addSub(Dep.target) // 订阅数据更新视图函数
        console.log('监听获取属性');
        return props
      },
      set(val) {
        console.log('监听设置属性');
        if (val === props) return // 如果数据没有发生变化就直接用之前的
        props = val
        // 设置完一个新值也需要数据劫持（监听)，这样就可以监听每一个数据的变化了
        observe(val)
        dep.notify() // 让所有的订阅函数都执行
      }
    })
  }
}

function Compile(el, vm) {
  // 1 el
  vm.$el = document.querySelector(el)
  // 2
  let fragment = document.createDocumentFragment()
  while (child = vm.$el.firstChild) { // 将app转移到内存中
    fragment.appendChild(child)
  }
  replace(fragment)
  vm.$el.appendChild(fragment)

  function replace(fragment) { // 文本节点替换

    Array.from(fragment.childNodes).forEach(node => {
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/
      if (node.nodeType === 3 && reg.test(text)) {
        const val = getNewVal(vm, RegExp.$1)
        // 这里进行数据驱动视图的更新操作，页面后面渲染时候执行的替换
        new Watcher(vm, RegExp.$1, newVal => { // 第一个是实例，第二个是要替换的操作，第三个是替换函数
          node.textContent = text.replace(reg, newVal)
        })
        node.textContent = text.replace(reg, val) // 这里是页面第一次渲染时候需要的替换
      }
      if (node.childNodes) {
        replace(node)

      }
    })
  }
}


// 发布订阅模式 ，订阅再有发布
// 绑定的每一个方法都有update属性
function Dep() {
  this.subs = []
}
Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)

}
Dep.prototype.notify = function () {
  this.subs.forEach(sub => sub.update())
}

//监听一个函数
function Watcher(vm, exp, fn) { // watch 是一个类，通过这个类创建的实例都有updata方法
  this.vm = vm
  this.exp = exp
  this.fn = fn
  Dep.target = this // 因为监听了读取操作，所以在读数据的时候一定会走get方法
  getNewVal(vm, exp) // 这里执行了get方法
  Dep.target = null
}
Watcher.prototype.update = function () {
  const val = getNewVal(this.vm, this.exp)
  this.fn(val)
}

function getNewVal(vm, exp) {
  let arr = exp.split('.')
  let val = vm
  arr.forEach(k => { // 这里相当于取操作，this.name 或者 this.a.a,会执行get里面的操作
    val = val[k] //引用类型，用的是同一个地址
  })
  return val
}