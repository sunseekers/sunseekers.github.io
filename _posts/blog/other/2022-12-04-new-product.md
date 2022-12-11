---
layout: post
title: 创建一个需要配合哪些基建
categories: [功能实现]
description: 前端工程化方面
keywords: 前端工程化方面
---

小项目的话，自己一个人写的话，随意一点问题不到。但是如果是大项目的话，还是需要底层有一定的规则限制会好很多，代码不至于太乱，大家都能保持一致的风格。简称前端工程化方面

# 需要做哪些事情
### husky
最好有，提交代码之前做一些验证，不通过不让提交

官方文档：https://typicode.github.io/husky/#/

当我们在提交或者推送代码的时候，可以使用它验证提交信息、运行测试、格式化代码、触发 CI/CD 等

### commitlint

提交的信息说明存在一定规范，现配合使用 commitlint + husky 用来规范 git commit -m "" 中的描述信息

官方文档：https://github.com/conventional-changelog/commitlint

### lint-staged
在前面已经配置了 husk、commitlint。lint-staged 在我们提交代码时，只会对修改的文件进行检查、修复处理，以保证提交的代码没有语法错误，不会影响其他伙伴在更新代码无法运行的问题。

### stylelint
非必需,最好有

自动修复错误、格式化样式代码

官方文档：https://stylelint.io/

### ts
官方文档：https://www.tslang.cn/samples/index.html

TS是定义者给使用者写的。为了让使用者更方便（VSCode提示）以及更安全（约束）的使用他提供的方法或者类。

使用TS，是有两个身份的，定义和使用。

当然在使用TS的时候，可能会遇到很多编辑器报红线的问题，遇事不要慌，这个当然不是我们的问题啦，.eslintrc.js的锅，我们在该文件的rules中关闭对应的配置就好了

遇到问题不要慌，先看报错，然后在思考一下，一般根据报错的提示修复就好了呀

就是本质上 eslint 不能之间拿来给 ts 用，需要装一下https://typescript-eslint.io/

推荐关于范型:https://www.typescriptlang.org/docs/handbook/2/generics.html#handbook-content

注：TS 中 type 和 interface 的区别：https://www.cnblogs.com/frank-link/p/14781056.html

interface： 只能定义对象类型

type 声明还可以定义基础类型、联合类型或交叉类型


### eslint
官方文档： http://eslint.cn/docs/rules/

前面的那些要生效，当然少不了它啦，是代码检查工具，用来检查你的代码是否符合指定的规范，可以约束团队的代码风格统一。

## 参考文章
[vue 项目集成 husky+commitlint+stylelint ](https://www.cnblogs.com/JasonLong/p/14520479.html)