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
  new Compile(option.el, this)
}

function Observe(data) {
  for (let key in data) {
    let val = data[key]
    observe(val) //对象应该也要被劫持
    Object.defineProperty(data, key, {
      enumerbale: true,
      get() {
        return val
      },
      set(newVal) {
        if (val === newVal) {
          return
        }
        val = newVal
        //如果是在原来的属性赋值一个对象新的的话，应该也要被劫持
        observe(newVal)
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
    fragment.appendChild(child)
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
        node.textContent = text.replace(/\{\{(.*)\}\}/, val)
      }
      if (node.childNodes) {
        replace(node)
      }
    })
  }

  // 然后再把进过处理的node节点塞回去
  vm.$el.appendChild(fragment)
}