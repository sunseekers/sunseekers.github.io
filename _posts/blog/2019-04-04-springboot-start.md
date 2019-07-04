---
layout: post
title: SpringBoot 启动方式
categories: [SpringBoot]
description: SpringBoot 启动方式
keywords: SpringBoot, keyword2
---

SpringBoot 启动方式

---
#### IDEA

启动类必须包含 @SpringBootApplication 这个注解

其他类目录要么跟Application同级，要么在其下级目录

![](/images/blog/2019-04-04-1.png)

#### MAVEN

进入到项目的pom.xml 层级，输入图中命令即可

![](/images/blog/2019-04-04-2.png)

#### JAR
maven 打包

![](/images/blog/2019-04-04-3.png)

编译成功后进入target 目录下可以看到有个jar包

![](/images/blog/2019-04-04-4.png)

jar 命令启动jar包

![](/images/blog/2019-04-04-5.png)
