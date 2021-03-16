---
layout: post
title: 自动化测试
categories: [HTML]
description: 发现，探索 web 优质文章
keywords: 发现，探索 web 优质文章
---
# lulu UI 自动化测试
## 背景
最近从头到尾的写了 Datalist 一个自动化测试，熟悉了自动化测试所需要的相关文档与自动化测试
带来的便利。解决了每次都需要手动点击测试的繁琐工程，解放了双手。
## 工具使用

[mocha](https://mochajs.cn/#usage):mocha是一个功能丰富的javascript测试框架

[puppeteer-core npm](https://www.npmjs.com/package/puppeteer-core):自动化执行操作，即相当于我手动执行浏览器中的大多数操作

[puppeteer-core 文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v5.5.0&show=api-class-page)

[Automattic expect.js](https://github.com/Automattic/expect.js): 断言库

在写自动化测试的时候，后面两个文档用的最多，前面的了解即可

1. 自动化测试的描述 => 用到了 mocha 

```
describe('通过datalist元素设置的下拉列表测试', function () { // 一级标题分类
    it('点击按钮出现下拉列表', async function () { // 二级标题分类
        // 你的操作，比如开启浏览器

    })
})

```

2. 打开浏览器通用代码 => 用到了 puppeteer-core

```
    let page;
    //所有测试开始之前
    before(async ()=>{
        page = await browser.newPage();
        page.setViewport({
            height: 20000,
            width: 2000
        });
        // 开始几率代码覆盖率
        await page.coverage.startJSCoverage();
        await page.goto('http://localhost:10086/tests/edge/browser/Datalist/', {
            waitUntil: 'domcontentloaded'
        });
    });
    // 所有测试结束后
    after(async ()=>{
        const jsCoverage = await page.coverage.stopJSCoverage();
        const needCoverage = [];
        for (const entry of jsCoverage) {
            if (/theme\/edge\/js\/common\/ui/.test(entry.url)) {
                needCoverage.push(entry);
            }
        }
        pti.write(needCoverage);
        await page.close();
    });
```

3. 断言是否符合你的预期 => Automattic expect.js

```
it('点击按钮出现下拉列表', async function () {
    const eleBtnMatch = await page.waitForSelector('#btn1', {visible: true,
        timeout: 1000}); // puppeteer-core 文档有，浏览器帮你做什么，词即意
    await eleBtnMatch.click();
    const display = await page.$eval('.ui-datalist-input-person', el=>el.style.display);
    expect(display).to.contain('block'); // 断言库 你的预期答案是什么
});
```

4. 执行当前文件的自动化测试 `npm run test:edge edge/browser/Datalist`

5. 所有的自动化测试代码大概就是这个模版，测试的具体看文档，我就是看着文档一点点测试，一句句跑，符合预期就用，没有最好的。

## 自动化测试书写
凡事有交代，件件有着落，事事有回应

1. 自动化的前提是手动测试，所以你首先要手动可以跑完所有的流程。

2. 清楚的表示你测试的是哪一个功能，触发什么，预期的结果是什么，比如：点击下面按钮，输入框出现下拉列表，触发show事件 列表出现 

3. 遇到不方便测试的属性或者事件的时候，灵活变通，比如：测试接口请求成功，返回成功之后可以在页面添加一个明显的样式，证明

4. 还需要对源码熟悉，快速判断问题

5. 多写几个就会了


