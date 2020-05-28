---
layout: post
title: react hook api 搬运及使用场景
categories: [react]
description: react hook api 搬运及使用场景
keywords: react
---

# `react` hook

这里主要讲 hook 的语法和使用场景

## hook

Hook 是一个特殊的函数,使用了 JavaScript 的闭包机制，可以让你在函数组件里“钩入” React state 及生命周期等特性。Hook 不能在 class 组件中使用。这也就是我开篇说的函数式组件一把索的原因

Hook 的调用顺序在每次渲染中都是相同的，所以它能够正常工作，只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 进行关联。但如果我们将一个 Hook 调用放到一个条件语句中会发生什么呢？

答案：Hook 的调用顺序发生了改变出现 bug [Hook 规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)

## userState

是允许你在 React 函数组件中数据变化可以异步响应式更新页面 UI 状态的 hook。

userState 函数初始化变量值，返回一个数组，数组第一项是这个初始化的变量，第二项是响应式修改这个变量的方法名。

```
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 “count” 的 state 变量。可以声明很多个
  const [count, setCount] = useState<number>(0); // 数组解构,在typescript中使用，我们可以用如下的方式声明状态的类型
  const [fruit, setFruit] = useState<string>('banana');

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>// 修改 count 的值
        Click me
      </button>
    </div>
  );
}
```

userState 的返回的第二个参数可以接受一个函数，如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState。该函数将接收先前的 state，并返回一个更新后的值。注意了 useState 不会自动合并更新对象，所以运算符来达到合并更新对象的效果。

```
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
    useEffect(() => {
    function handleWindowMouseMove(e) {
      // 展开 「...state」 以确保我们没有 「丢失」 width 和 height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
  });// 没有第二个参数，只会渲染一次，永远不会重复执行
}
```

一般情况下，我们使用 userState hook，给他传的是一个简单值，但是如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用

```
const [state, setState] = useState(() => {
  return  doSomething(props);
});
```

useState 返回的更新状态方法是异步的，下一个事件循环周期执行时，状态才是最新的值。不要试图在更改状态之后立马获取状态。这里有可能会出现陈旧值引用的问题，这并不是 reatc 的 bug，是因为 JavaScript 的正常表现，是因为闭包

[函数式组件与类组件在线区别 demo](https://codesandbox.io/s/pjqnl16lm7?file=/src/ProfilePageClass.js)

比如使用 immutable.js 里面的 set 结构的时候，进行循环删除里面的某些项，结果删除的永远是数组的最后一项

```
infos.forEach((el) => {
  if( list.has(el.id）){
    setList(list.delete(item.id))// 这里是异步，在你循环的时候，页面还没有重绘，拿不到最后一个值
    }
  })
```

如果我们想要实现循环里面删除，那么怎么做呢？别忘了，useState 是想要我们直接修改 DOM 的渲染，所以才使用他的。我们可以先整体的修改完之后再去影响 DOM 的渲染

```
  infos.forEach((el) => {
    if (list.has(el.id)) {
      list = list.delete(el.id)//这里是同步删除
    }
  })
  setList(list)//删除完了之后，在去修改DOM的结构
```

React 这样设计的目的是为了性能考虑，争取把所有状态改变后只重绘一次就能解决更新问题，而不是改一次重绘一次，也是很容易理解的.内部是通过 merge 操作将新状态和老状态合并后，重新返回一个新的状态对象,组件中出现  setTimeout  等闭包时，尽量在闭包内部引用 ref 而不是 state，否则容易出现读取到旧值的情况.闭包引用的是原来的旧值，一旦经过 setUsetate,引用的就是一个新的对象，和原来的对象引用的地址不一样了。

能够直接影响 DOM 的变量，这样我们才会将其称之为状态。当某一个变量对于 DOM 而言没有影响，此时将他定义为一个异步变量并不明智。好的方式是将其定义为一个同步变量。

[React Hooks 异步操作踩坑记](https://juejin.im/post/5dad5020f265da5b9603e0ca#comment)


## useReducer

useState 的替代方案，升级版，但我们遇到多个 useState 之间互相影响，需要或者说只是某一个参数不一样，其他的大致差不多的时候，我们就可以使用 useReducer 替换，这个有点像 vue 里面的 vuex 的感觉，也有点 Redux 的感觉，但是只是有一点点，几个还是完全不一样的概念

```
const initialState = {count: 0};

// 多个 useState 结合成一个了
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```

[useReducer](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)

[The State Reducer Pattern with React Hooks](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks)

[React Hooks 的体系设计之一 - 分层](https://zhuanlan.zhihu.com/p/106665408)

[Umi Hooks - 助力拥抱 React Hooks](https://zhuanlan.zhihu.com/p/103150605?utm_source=wechat_session)

### Effect Hook

React 会等待浏览器完成画面渲染之后才会延迟调用 useEffect，他相当于 react class 的三个生命周期函数 componentDidMount（组件挂载完成），componentDidUpdate（组件更新） 和 componentWillUnmount（组件将要销毁） 三个生命周期函数的组合，可以实现减少重复代码的编写

componentDidMount： 组件挂载完成的时候，需要执行一堆东西

componentDidUpdate：组件更新钩子函数，就理解成 vue 里面的 watch 吧，当你监听的某一个数据发生变化的时候，就会执行这一个 Effect Hook 钩子函数里面的东西。

componentWillUnmount：清除 effect ，在某种情况下，你需要清理一些数据为了避免内存泄露的时候就可以用它。 返回一个函数，就表示你要做的清空操作了。不返回一个函数就表示不需要做清空操作。（组件卸载，

```
  const [debounceVal, setDebounceVal] = useState(value)
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounceVal(value)
    }, delay)
    return () => {
      clearTimeout(handle) // 组件销毁的时候清空定时器
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return debounceVal
```


默认情况下，它在第一次渲染之后和每次更新之后都会执行，而且 effect 的清除阶段在每次重新渲染时都会执行，这个能就会导致性能问题 ，所以他又称是副作用。他可以接受第二个参数，他会对比更新前后的两个数据，如果没有变化的话，就不执行 hook 里面的东西。仅仅只有在第二次参数发生变化的时候才会执行。这样就避免没有必要的重复渲染和清除操作

可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。意味着该 hook 只在组件挂载时运行一次，并非重新渲染时，（需要注意的是[]是一个引用类型的值，在某些情况下自定义 hooks，他作为第二个参数也会导致页面重新渲染，因为引用地址变了，所以在自定义 hooks 的时候需要注意，在自定义 hook 详细说


[useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/) -> 这个写的特别好，特别推荐看学习

[超性感的React Hooks（四）：useEffect](https://mp.weixin.qq.com/s/5sXbnSTQEyKr-WqEEXQCBA)

### useMemo

简单说就是把一些需要计算但是不会变得数据存储在本地，下次用的时候直接拿计算的结果就好了，不需要计算（ 如果我们有 `CPU` 密集型操作，我们可以通过将初始操作的结果存储在缓存中来优化使用。如果操作必然会再次执行，我们将不再麻烦再次使用我们的 `CPU`，因为相同结果的结果存储在某个地方，我们只是简单地返回结果他通过内存来提升速度，`React.useMemo` 是新出来的 `hooks api`，并且这个 `api` 是作用于 `function` 组件，此方法仅作为性能优化的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

```
function App() {
  const [num, setNum] = useState(0);

  // 一个非常耗时的一个计算函数
  // result 最后返回的值是 49995000
  function expensiveFn() {
    let result = 0;

    for (let i = 0; i < 10000; i++) {
      result += i;
    }

    console.log(result) // 49995000
    return result;
  }

  const base = expensiveFn();
  //  const base = useMemo(expensiveFn, []); 只有在第一次点击的时候才会执行，后来都不执行了,他的第二个参数和useEffect一样的意思

  return (
    <div className="App">
      <h1>count：{num}</h1>
      <button onClick={() => setNum(num + base)}>+1</button>
    </div>
  );
}
```

记住，传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo

### useCallback

父组件给子组件传递函数的时候，父组件每一次的修改都会重新渲染，都会导致它们在每次渲染上都有不同的引用，最后的结果是，每一次父组件的修改都直接导致了子组件没有必要的渲染。（引用类型

这个时候我们吧把函数以及依赖项作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，这个 memoizedCallback 只有在依赖项有变化的时候才会更新。

给定相同 props 的情况下渲染相同的结果，并且通过记忆组件渲染结果的方式来提高组件的性能表现，第二个参数代表的意义和上面的一样

// 避免引用类型的重复渲染
```
  const handleIndicator = useCallback((indicator: EvaluateIndicator) => {
    console.log('传给字组件')
  }, [])
```

// 函数防抖

```
import React, { useState, useCallback } from 'react'
import { debounce } from '../../utils/tool'

import './index.scss'
interface searchlParams {
  handleSearch: (val: string) => void
}
const Search: React.FC<searchlParams> = ({ handleSearch }) => {
  const [value, setValue] = useState<string>('')
  /* 防抖的另外一种写法 */
  const debounceSearch = useCallback(
    debounce((val) => handleSearch(val), 2000),
    [],
  )
  const changhandleSearch = (e: any) => {
    setValue(e.target.value)
    debounceSearch(e.target.value)
  }
  return (
    <div className="search-wrapper">
      <input className="input-control" value={value} onChange={changhandleSearch} placeholder="搜索" />
    </div>
  )
}
```
子组件需要配合 React.memo 的使用，React.memo 和 useCallback 都是为了减少重新 render 的次数

[如何对 React 函数式组件进行优化](https://juejin.im/post/5dd337985188252a1873730f)

[浅谈 React 性能优化的方向](https://juejin.im/post/5d045350f265da1b695d5bf2#comment)

### React.memo

可以减少重新 render 的次数的。

```
//子组件

function Child(props) {
  console.log(props.name)
  return <h1>{props.name}</h1>
}

export default React.memo(Child)

// 父组件
function App() {
  const [count, setCount] = useState<number>(1)

  return (
    <div className="App">
      <h1>{ count }</h1>
      <button onClick={() => setCount(count+1)}>改变数字</button>
      <Child name="sunseekers"></Child>
    </div>
  );
}
```

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。（如果没有用 React.memo 包裹，每一次 count 变化，子组件都会重新渲染）

仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染.默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现

[如何对 React 函数式组件进行优化](https://juejin.im/post/5dd337985188252a1873730f)

### useRef

相当于 vue 里面的 refs ，只是在这边的用法不一样而已。useRef 返回一个可变的 ref 对象，其 current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变,当我们遇到了因为闭包问题导致的陈旧值引用的问题，我们就可以用它来解决问题

```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素,所以在控制太可以打印两条数据信息出来

[Refs and the DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#callback-refs)

[refs 通过函数引用 demo](https://codesandbox.io/s/bold-bash-hy5wd?file=/src/index.js)

[The State Reducer Pattern with React Hooks](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks)

### 自定义 Hook

这个有就有点像 vue 里面的 mixin 了，当我们在多个组件函数里面共同使用同一段代码，并且这段代码里面包含了 react 的 hook，我们想在多个组件函数共享逻辑的时候，我们可以把他提取到第三个函数中去，而组件和 Hook 都是函数，所以也同样适用这种方式。

自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook，在两个组件中使用相同的 Hook 不会共享 state，是独立的 state


1. 接口请求，在每一个接口前面都加一个 loading

```
import { useState, useCallback, useEffect } from 'react'

export function useFriendStatus(fn, dependencies) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  // 请求的方法 这个方法会自动管理loading
  const request = useCallback(() => {
    setLoading(true)
    setData(fn)
    setLoading(false)
  })
  // 根据传入的依赖项来执行请求
  useEffect(() => {
    request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencies])

  return {
    // 请求获取的数据
    data,
    // loading状态
    loading,
    // 请求的方法封装
    request,
  }
}

// 组件中使用
const { data, loading } = useFriendStatus(fetchTodos({ tab: 'activeTab' }), 'activeTab')

```

如果 dependencies 是引用类型的要注意了，会导致每一次加载页面引用的地址都不一样，直接导致页面死循环，所以处理的时候， 要特别小心和注意了。比如说，如果我们给 useFriendStatus 第二个参数一个空数组，每一次请求接口页面就会重新渲染，第二个参数的空数组引用地址变了，会导致死循环，自己尝试

2. 函数防抖

```
//@ts-ignore
import React, { useState, useEffect } from 'react'
export default function useDebounce(value, delay) {
  const [debounceVal, setDebounceVal] = useState(value)
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebounceVal(value)
    }, delay)
    return () => {
      clearTimeout(handle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return debounceVal
}
// 组件中使用
interface searchlParams {
  handleSearch: (val: string) => void
}
const Search = ({ handleSearch:searchlParams }) => {
  const [value, setValue] = useState<string>('')
  // 函数防抖,每一次内部变量变化都会注册和执行setTimeout，函数重新渲染之后
  const debounceSearch = useDebounce(value, 2000)
  useEffect(() => {
    handleSearch(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch])

  return (
    <div className="search-wrapper">
      <input className="input-control" value={value} onChange={(e) => setValue(e.target.value)} placeholder="搜索" />
      {/* <i className="iconfont ico search-ico">&#xe6aa;</i> */}
    </div>
  )
}
```
[在 react 函数式组件中使用防抖与节流函数](https://zhuanlan.zhihu.com/p/88799841)

[自定义 Hook](https://zh-hans.reactjs.org/docs/hooks-custom.html)

[使用 React Hooks + 自定义 Hook 封装一步一步打造一个完善的小型应用](https://juejin.im/post/5d6771375188257573636cf9)


