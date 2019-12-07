let obj = {}
Object.defineProperty(obj, 'name', {
  value: "sunseekers"
})
obj //{name: "sunseekers"}
obj.name = 'zm'
for (let key in obj) {
  console.log(key) //undefined
}
obj //{name: "sunseekers"},没法更改


Object.defineProperty(obj, 'name', {
  value: "sunseekers",
  writable: true, //可以修改这个属性
  enumerable: true, // 可以枚举
})
obj.name = 'zm'
obj //{name: "zm"}
for (let key in obj) {
  console.log(key) //name
}
// 属性描述符和数据描述符不可以同时存在
Object.defineProperty(obj, 'name', {
  value: "sunseekers",
  writable: true, //可以修改这个属性
  enumerable: true, // 可以枚举
  get() {
    console.log(value)
  }
})
let name = 'sunseekers'
Object.defineProperty(obj, "name", {
  get() {
    return name
  },
  set(newValue) {
    return name = newValue;
  },
  enumerable: true,
  configurable: true
});

// 数据劫持
function Sunseekers(option = {}) {
  this.$option = option
  var data = this._data = this.$option
  observe(data)
  //this 代理 this._data
  for (let key in data) {
    Object.defineProperty(this, key, {
      get() {
        return this._data[key]
      },
      set(newVal) {
        this._data[key] = newVal
      }
    })
  }
  // computed 可以缓存，只是把数据挂在在vm上面
  initComputed.call(this)
  new Compile(option.el, this)
}

function initComputed() { //具有缓存功能
  let vm = this
  let computed = this.$option.computed // 拿到这个对象的key值
  Object.keys(computed).forEach(key => {
    Object.defineProperty(vm, key, {
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get()
    })
  })
}

function Observe(data) {
  for (let key in data) {
    let val = data[key]
    let dep = new Dep() //数据获取的时候，监听事件
    observe(val) //对象应该也要被劫持
    Object.defineProperty(data, key, {
      enumerbale: true,
      get() {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newVal) {
        if (val === newVal) {
          return
        }
        val = newVal
        //如果是在原来的属性赋值一个对象新的的话，应该也要被劫持
        observe(newVal)
        dep.notify() //让所有的watch的update方法执行
      }
    })
  }
}

//这里不写任何业务
function observe(data) {
  if (typeof data !== 'object') return
  return new Observe(data)
}

// vue的特点不能新增不存在的属性，因为不存在的属性没有get和set
// 深度响应 因为每一次赋予一个新对象时，会给这个新对象增加数据劫持

// 编译
function Compile(el, vm) {
  vm.$el = document.querySelector(el)
  let fragment = document.createDocumentFragment() //创建文本碎片
  while (child = vm.$el.firstChild) { //将app里面的内容移到内存中去
    fragment.appendChild(child)// 这一个节点将会被移动到fragment里面去
  }
  replace(fragment)

  function replace(fragment) {
    // dom中{{a.b}} 替换成a.b的值
    Array.from(fragment).forEach(node => { //循环每一层
      let text = node.textContent
      let reg = /\{\{(.*)\}\}/
      if (node.nodeType === 3 && reg.test(text)) {
        let arr = RegExp.$1.split('.')
        let val = vm
        arr.forEach(item => {
          val = val[item]
        })
        new Watcher(vm, RegExp.$1, function (newVal) { //替换的对象，替换的值，替换要执行的函数
          node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)

        })
        // 替换的逻辑
        node.textContent = text.replace(/\{\{(.*)\}\}/, val)
      }
      // v-model 实现
      if (node.nodeType === 1) {
        //元素节点
        let nodeAttrs = node.attributes //获取当前dom节点的属性
        Array.from(nodeAttrs).forEach(attr => {
          let name = attr.name
          let exp = attr.value
          if (name.indexOf('-v') == 0) { //v-model
            node.value = vm[exp]
          }
          new Watcher(vm, exp, function (newVal) {
            node.value = newVal //当watcher触发时会自动将内容放到输入框内
          })
          //数据变了，更改视图
          node.addEventListener('input', (e) => {
            let newVal = e.target.value
            vm[exp] = newVal
          })
        })
      }
      if (node.childNodes) {
        replace(node)
      }
    })
  }

  // 然后再把进过处理的node节点塞回去
  vm.$el.appendChild(fragment)
}

// 订阅函数,假设每一个绑定的函数都有一个update属性
function Dep() {
  this.sub = []
}
Dep.prototype.addSub = function (fn) {
  this.sub.push(fn)
}
Dep.prototype.notify = function () {
  this.sub.forEach(sub => sub.update())
}
// 订阅的事件
function Watcher(vm, exp, fn) { //watch 是一个类，通过这个类创建的实例都有update方法
  this.vm = vm
  this.exp = exp
  let arr = exp.split('.')
  Dep.target = this
  let val = this.vm
  arr.forEach(item => {
    val = val[item] //数据更改的时候会调用get方法，到get方法里面去处理
  })
  Dep.target = null
  this.fn = fn
}
Watcher.prototype.update = function () {
  let arr = this.exp.split('.')
  Dep.target = this
  let val = this.vm
  arr.forEach(item => {
    val = val[item] //数据更改的时候会调用get方法，到get方法里面去处理
  })
  this.fn(val)
}
let watcher = new Watcher(function () {
  console.log(12)
})
let dep = new Dep()
dep.addSub(watcher)
dep.addSub(watcher)
dep.notify()
//实现原理是数组关系，订阅是往里面扔函数，发布是执行往里面扔的函数

// 发布订阅模式，是数据发生改变的时候就替换一下，所以找到发生改变的逻辑