let index = 0
const ATTRS = 'ATTRS'
const TEXT = 'TEXT'
const REMOVE = "REMOVE"
const REPLACE = "REPLACE"

function diff(oldTree, newTree) {
  let patches = {}
  // 递归树 比较后的结果放到补丁包种
  // index 每次传递给walk时，index 是递增的，所有人都基于一个序号来递增
  walk(oldTree, newTree, index, patches)
  return patches
}

function walk(oldNode, newNode, index, patches) {
  let currentPatch = [] //每个元点的补丁包
  if (!newNode) {
    currentPatch.push({
      type: REMOVE,
      index
    })
  } else if (isString(oldNode) && isString(newNode)) {
    if (oldNode !== newNode) { // 判断文本是否一致
      currentPatch.push({
        type: TEXT,
        text: newNode
      })
    }
  } else if (oldNode.type !== newNode.type) {
    let attrs = diffAttr(oldNode.props, newNode.props)
  } else {
    currentPatch.push({
      type: REPLACE,
      newNode
    })
  }
  if (Object.keys(attrs).length > 0) {
    currentPatch.push({
      type: ATTRS,
      attrs
    })
  }
  if (currentPatch.length > 0) { //当前元素确实有补丁
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = currentPatch
  }
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {}
  // 判断老的属性种和新的属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] != newAttrs[key]) {
      patch[key] = newAttrs[key] //有可能是undefined
    }
    // 如果有儿子节点，遍历儿子
    diffChildren(oldNode.children, newNode.children, index, patches)
  }
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key]
    } //老节点是不是有这个属性
  }
}

function diffChildren(oldChildren, newChildren, index, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, idx) => {
    walk(child, newChildren[idx], ++index, patches)
  })
}

function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]'
}


// 给元素打补丁，重新更新视图

let allPathes

function patch(node, patches) {
  allPathes = patches
  let index = 0 //默认哪个需要打补丁
  walkPatch(node) //给某一个元素打补丁
}

function walkPatch(node) {
  let currentPatch = allPathes[index++]
  let childrenNodes = node.childNodes
  childrenNodes.forEach(child => walk(child)) //子节点
  if (currentPatch) {
    doPatch(node, currentPatch)
  }
}

function doPatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case ATTRS:
        for (let key in patch.attrs) {
          let value = patch.attrs[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break;
      case TEXT:
        node.textContent = patch.text
        break;
      case REMOVE:
        node.parentNode.removeChild(node)
        break;
      case REPLACE:
        let newNode = (patch.newNode instanceof Element) ? render(patch.newNode) : document.createTextNode(patch.newNode)
        node.parentNode.replaceChild(newNode, node)
        break;
      default:
        break;
    }
  })
}