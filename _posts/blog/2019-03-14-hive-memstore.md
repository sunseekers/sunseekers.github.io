---
layout: post
title: Hive 重新配置元数据库
categories: [Hive]
description: hive 重新配置 原数据库
keywords: Hive
---

Hive 重新配置元数据库

--- 

#### 前言
有一套测试环境的 CDH 太久没维护了。各种组件都已经宕掉了。

作为一个合格的运维人员肯定得负责帮开发工程师整起来

在修复 Hive 的过程中，一直报 Hive Metastore canary创建数据库失败 。

通过定位发现是元数据库 mysql 宕了。凭借自己一点点mysql 知识准备把它启动起来。结果失败了。。。。。

后面找到负责搭建这个 mysql 的测试人员让其修复。。他折腾了一会说搞不定了。让找 DBA 看看。。。

觉得太麻烦了。因为是测试环境，元数据丢弃。所以想重新配置一个元数据库。

#### 修复

先搭建一套 mysql 数据库。我使用的mysql 版本为 5.7.18

搭建完成后需要新建数据库hive，新建 hive 连接的账号 和密码。

``` 
create databases hive

grant all privileges on *.* to 'root'@'%' identified by 'your_passwd'; 
```

![](/images/blog/2019-03-14-2.png)

按图配置对应的参数

接着给 hive 添加 mysql 驱动包  

路径  /opt/cloudera/parcels/CDH/lib/hive/mysql-connector-java-5.1.35-bin.jar

修改 hive 的参数

关闭 严格的 Hive Metastore 架构验证

打开 自动创建和升级 Hive Metastore 数据库架构

![](/images/blog/2019-03-14-2.png)

最后到mysql中的hive数据库执行 alter database hive character set latin1;

重启 hive 即可恢复

#### 总结
遇到问题，多看日志，根据日志来处理。


---
参考链接
* [hive 启动问题记录 及解决方法](https://blog.csdn.net/jim110/article/details/44907745)
* [hive中遇到的几个问题](https://blog.csdn.net/asas1314/article/details/50098453)
















