# sunseekers

我的个人博客：<https://sunseekers.github.io/>

Fork自 图的<https://lihuimintu.github.io/> 

博客还在搭建期间，慢慢完善中

## 概览

<!-- vim-markdown-toc GFM -->

* [Fork 指南](#fork-指南)
* [经验与思考](#经验与思考)
* [致谢](#致谢)

<!-- vim-markdown-toc -->

## Fork 指南

Fork 本项目之后，还需要做一些事情才能让你的页面「正确」跑起来。

1. 正确设置项目名称与分支。

   按照 GitHub Pages 的规定，名称为 `username.github.io` 的项目的 master 分支。\
   username 为你 github 的账号名称

2. 修改域名。

   如果你需要绑定自己的域名，那么修改 CNAME 文件的内容；如果不需要绑定自己的域名，那么删掉 CNAME 文件。 \
   图上面有介绍怎么修改域名。需要绑定域名的可以参考她的方式 \
   本人没有使用域名，已经将其 CNAME 文件删除了

3. 修改配置。

   网站的配置基本都集中在 \_config.yml 文件中，将其中与个人信息相关的部分替换成你自己的，比如网站的 url、title、subtitle 和第三方评论模块的配置等。

   **评论模块：** 目前支持 disqus、gitment 和 gitalk，选用其中一种就可以了。它们各自的配置指南链接在 \_config.yml 文件的 Comments 一节里都贴出来了。
   
   本人使用的是 gitalk 。gitment 按教程配置没成功。有报错，没找到解决方式，于是放弃。\
   [注册 OAuth Application](https://github.com/settings/applications/new) 
   来注册一个新的 OAuth Application。其他内容可以随意填写，
   但要确保填入正确的 callback URL（一般是评论页面对应的域名，这里我填的是我 Blog 域名 https://sunseekers.github.io ）。\
   你会得到一个 client ID 和一个 client secret，这个将被用于之后的用户登录。
   将其在 _config.yml 中替换掉
   ```
    gitalk:
        owner: '你的 GitHub ID'
        repo: '存储评论的 repo'
        clientID: '你的 client ID'
        clientSecret: '你的 client secret'
   ```
   在这里你得新建一个存储评论的仓库
   
4. 删除我的文章与图片。

   如下文件夹中除了 template.md 文件外，都可以全部删除，然后添加你自己的内容。

   * \_posts 文件夹中是我已发布的博客文章。
   * \_drafts 文件夹中是我尚未发布的博客文章。
   * \_wiki 文件夹中是我已发布的 wiki 页面。
   * images 文件夹中是我的文章和页面里使用的图片。

5. 修改「关于」页面。

   pages/about.md 文件内容对应网站的「关于」页面，里面的内容多为个人相关，将它们替换成你自己的信息，包括 \_data 目录下的 skills.yml 和 social.yml 文件里的数据。

6. 增加博客阅读统计功能。
   使用的是leancloud，参照的[博客来源][1]
   
   本人未用博客阅读统计功能。在 _config.yml 将其关闭了

   
## 经验与思考

* 大家可以先参考图的经验与思考
* 使用方式先在 _drafts 下新建 md 文件。文件开头参考 template.md 模版。写好后再移动到 _posts/blog 下。接着提交到 GitHub 即可


## 致谢

本博客外观

基于 [图](http://lihuimintu.github.io)

基于 [毛毛虫_Wendy](http://mmcwendy.info)

基于 [DONGChuan](http://dongchuan.github.io) 

基于 [Zhuang Ma](http://mazhuang.org/)

修改，非常感谢！

[1]: http://jekyllthemes.org/

