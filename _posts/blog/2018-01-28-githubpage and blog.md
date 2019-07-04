---
layout: post
title: 如何利用github page快速搭建个人博客
categories: Blog
description: 利用github page快速搭建个人博客
keywords: github page,博客
---
快速搭建个人博客

## 背景
本来计划在简书或者csdn上一个博客用来记录一些读书笔记，就上知乎搜了一下哪个平台更好用，当时有大神推荐可以用github page自己搭建一个博客平台，随即我就查阅如何利用github page搭建个人博客，经过几天修改，大功告成了，下面就是我的博客地址。
- [x] http://mmcwendy.info 

**注:地址是毛毛虫_Wendy的简写，欢迎大家fork和star**

## 使用github page搭建博客
## Github page
github page是面向用户、组织和项目开放的公共静态页面搭建托管服务，站点可以被免费托管在 Github 上，你可以选择使用 Github Pages 默认提供的域名 github.io 或者自定义域名来发布站点，更便利地是你直接从你的GitHub存储库托管。只需编辑和推送你的blog，并且你的更改是实时的。
### 搭建流程
#### 第一步:创建仓库
在创建仓库之前，默认你有github账号以及会基础的git命令能够上传代码，如果不会，请参考廖雪峰git教程【[资料1](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)】。
#### 方式 1:
你只需要登录GitHub并创建一个名为username .github.io 的新存储库 ，其中username是GitHub上的用户名（如图1）。
**注意：如果存储库的第一部分不完全符合你的用户名，则不起作用，因此请确保正确无误。**

![图1](/images/blog/2018-01-28-1.png)

然后你可以参考许多模板【参考模板[素材1](http://jekyllthemes.org)，[素材2](https://hexo.io/themes/)】，基于模板进行修改，打造属于自己风格的网站，我这个人比较看颜值，单选模板都选了一天，真心累。

#### 方式 2:
当然你也可以直接fork我的项目【[地址](https://github.com/DWJWendy/DWJWendy.github.io)】，然后将我的项目名改成你的github用户名.github.io,按照 GitHub Pages 的规定，名称为 username.github.io 的项目的 master 分支，或者其它名称的项目的 gh-pages 分支可以自动生成 GitHub Pages 页面。正常情况下，你可以在本地测试启动程序:

- 进入项目目录下:

```
cd DWJWendy.github.io
```
- 启动:

```
bundle exec jekyll serve
```

然后你可以通过127.0.0.1:4000在浏览器中访问到网页，如图2


![图2](/images/blog/2018-01-28-2.png)

有关jekyll的具体内容参考【[资料2](http://jekyllcn.com/)】


#### 第二步:修改模板

1. 修改配置。

   网站的配置基本都集中在 \_config.yml 文件中，将其中与个人信息相关的部分替换成你自己的，比如网站的 url、title、subtitle 和第三方评论模块的配置等。

   **评论模块：** 目前支持 disqus、gitment 和 gitalk，选用其中一种就可以了，推荐使用 gitment。它们各自的配置指南链接在 \_config.yml 文件的 Comments 一节里都贴出来了，搭建过程【[资料3](https://imsun.net/posts/gitment-introduction/)】

   **注意：** 如果使用 disqus，因为 disqus 处理用户名与域名白名单的策略存在缺陷，请一定将 disqus.username 修改成你自己的，否则请将该字段留空。
![图3](/images/blog/2018-01-28-5.png)
  
2. 删除我的文章与图片。

   如下文件夹中除了 template.md 文件外，都可以全部删除，然后添加你自己的内容。

   * \_posts 文件夹中是我已发布的博客文章。
   * \_drafts 文件夹中是我尚未发布的博客文章。
   * \_wiki 文件夹中是我已发布的 wiki 页面。
   * images 文件夹中是我的文章和页面里使用的图片。

3. 修改「关于」页面。

   pages/about.md 文件内容对应网站的「关于」页面，里面的内容多为个人相关，将它们替换成你自己的信息，包括 \_data 目录下的 skills.yml 和 social.yml 文件里的数据。

4. 增加博客阅读统计功能。
   使用的是leancloud,它是一个一站式后端云服务. 包括云存储、数据分析、用户关系、消息推送、即时通信等现代应用基础模块，因为只用存储博文阅读统计数，所以我用了数据存储模块，我的修改是直接参照这篇博客的，非常简单【[资料4](http://blog.csdn.net/u013553529/article/details/63357382)】


#### 第三步:上传
当你的修改完成后，你就可以进入项目下，并在终端输入相关的git命令将其上传到之前建立的仓库中

```
#进入项目目录
cd DWJWendy.github.io
#上传代码(依次在终端输入下面命令)
git init
git add --all
git commit -m "first version"
git remote add origin git@github.com:DWJWendy/DWJWendy.github.io.git
git push -u origin master

```
然后你就可以在浏览器输入你的域名就可以访问你的博客，博客建立好你只需要自己写博客，然后按照上述方式传到github上，你新的博文既可以被别人访问了，如图3我的博客。

![图4](/images/blog/2018-01-28-4.png)

## 域名
说说我在这里踩的坑吧:我忘记**域名需要解析**，哈哈哈真是超级搞笑……

最初我选择github page主要是它不用服务器，不要域名就可以搭建自己的博客，但是大神小白告诉我他去Godaddy上买的域名，果然还非常的便宜，我只用了7元就买了 mmcwendy.info,有效期1年。

再说域名解析，虽然曾经在计算机网络的课程上知道这个名词，但还真是第一次解析，我就直接找了资源【[资料5](https://www.zhihu.com/question/31377141)】，按照教程来还是非常简单的，这个是我的域名解析图3

![图5](/images/blog/2018-01-28-3.png)

## 注意事项


1. 虽然有很好的模板，但是很多东西还是需要自己的理解，了解最基本的原理，避免走弯路。
2. 不是仅仅将上面的内容改了就可以的，你还需要注意一些细节，比如文件路径/comment.html里面的部分代码也需要修改。
3. 在使用这个模板之前，你需要在本地安装Bower和Bundler，安装的教程可以在网上找一下，这个很简单，两行代码就可以搞定。
4. 博文编辑使用markdown来编写。
## 一点小想法

看颜值选了好多模板，最终确定了这个模板，主要是网站的结构比较清晰，可以直接跟github想的项目直接相连，并且博客可以根据内容打上不同的tag，可能是机器学习学多了，非常喜欢这个分类明确的东西，另外，它的wiki部分让我非常喜欢，并且可以实时评论，如果有人评论了博文还会有email提醒，很多都是现成的应用，但是组合在一起就觉得特别棒。另外，对我而言，之前并没有用过markdown，这一篇博文用markdown写感觉markdown写起来还真是很方便，推荐。

## 致谢

本博客外观
基于 [DONGChuan](http://dongchuan.github.io) 
和 [Zhuang Ma](http://mazhuang.org/)
修改，非常感谢！
