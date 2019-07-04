---
layout: post
title: Maven 配置多个镜像地址
categories: [Tools]
description: maven conf/settings.xml配置多个镜像地址
keywords: Maven
---

maven conf/settings.xml配置多个镜像地址

---

#### 前言

今天合并同事的代码时，发现有个 jar 包是公司的 maven 仓库的。
所以我需要导入公司的 maven 镜像地址。

#### 遇到的问题

加入了 公司的 maven 镜像地址发现未生效。

怀疑是不是之前配置的阿里源导致冲突了。去掉阿里源之后发现它要帮我重新下载所有仓库，果断取消。

后面查阅资料 了解到 mirrorOf 相同的镜像，配置多了没任何作用，只会选取第一个。

确认后发现的确是这个原因造成的。

打包遇到各种垃圾问题。 好气，没解决。

https://blog.csdn.net/qq_31071543/article/details/81564562

压根就没生效。

#### 配置

``` 
<mirrors>
    <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
    <mirror>
      <id>dev</id>
      <mirrorOf>central</mirrorOf>
      <name>Maven Repository</name>
      <url>http://***/public</url>
    </mirror>
  </mirrors>
```

---
参考链接
* [maven settings.xml配置多个镜像地址](https://blog.csdn.net/u010072711/article/details/80516899)

