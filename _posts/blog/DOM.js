// 虚拟dom type类型，props属性，children子节点

//创建一个元素
class Element {
  //放在私有属性上，new可以new出来
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}
//创建一个元素
function createElement() {
  return new Element(type, props, children)
}
// render 方法可以将vnode转化为真实dom
function render(eleObj) {
  // 创建一个元素
  let el = document.createElement(eleObj.type)
  for (let key in eleObj.props) {
    setAttr(el, key, eleObj.props[key])
  }
  eleObj.children.forEach(child => {
    child = (child instanceof Element) ? render(child) : document.createTextNode(child)
    el.appendChild(child)
  })
  return el
}

// 设置属性
function setAttr(node, key, value) {
  props.forEach(element => {
    switch (key) {
      case 'value': //node是一个input或者textarea
        if (node.tagName.toUpperCase() === "INPUT" || node.tagName.toUpperCase() === "TEXEAREA") {
          node.value = value
        } else {
          node.setAttribute(key, value)
        }
        break;
      case 'style':
        node.style.cssText = value
        break;
      default:
        node.setAttribute(key, value)
        break
    }
  });
}
// 渲染页面
function renderDom(el, target) {
  target.appendChild(el)
}
//使用的时候createElement render renderDom

// DOM diff 比较两个虚拟dom区别，比较两个对象的区别
// dom diff 作用，根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁更新dom

