---
layout: post
title: HBase Shell
categories: [HBase]
description: HBase Shell 入门
keywords: HBase
---

介绍最基本的HBase Shell的使用命令。

---

#### 使用 HBase Shell 访问

如果在 HBase 本身的机器上的话，找到 HBase bin 目录下启动 bin/hbase shell 即可

在本地搭建访问 HBase 集群的 Shell 客户端的话，需要配置一下 hbase-site.xml

官网下载二进制包即可。

![](/images/blog/2019-03-19-1.png)

wget http://mirrors.tuna.tsinghua.edu.cn/apache/hbase/hbase-1.2.11/hbase-1.2.11-bin.tar.gz 

修改 conf/hbase-site.xml 文件，添加集群的 ZK 地址。

```xml
<configuration>
        <property>
                <name>hbase.zookeeper.quorum</name>
                <value>100.73.12.12</value>
                <description>ZooKeeper 地址</description>
        </property>
        <property>
                <name>zookeeper.znode.parent</name>
                <value>/hbase</value>
                <description>ZooKeeper 中 HBase 的根 znode。</description>
        </property>
</configuration>
```

访问集群通过如下命令就可以访问集群了。

bin/hbase shell

#### HBase Shell 入门

##### 1. 展示HBase Shell的帮助信息

help命令提供了很多基本的命令和对应的使用方法，当你忘记一些基本用法的时候，记得输入help来查看。

hbase(main):001:0>help

如果要查看具体的命令帮助的话在后面加个命令名称

hbase(main):002:0>help 'list'

##### 2. 基本命令

使用create命令来创建一张新的表，在创建的时候你必须输入表的名称和ColumnFamily的名称

使用list命令来查询已经创建的表。

往表里面插入记录。在hbase中，往表里面写一行记录的命令叫做put

查询表中的所有数据。scan是一种访问HBase数据的方式，它非常的灵活，你可以用它来扫描全表，也可以用它查询固定范围

查询单条记录。使用get来查询单条记录

禁用一张表。使用disable命令能够禁用一张表，使用enable命令能够取消禁用，恢复禁用的表。

删除一张表。使用drop命令，这是一个危险的操作，使用的时候请务必小心。

退出HBase Shell。输入quit命令就可以离开HBase Shell环境了。

需要详细的介绍者请自行百度。


---
参考链接
* [阿里云使用 Shell 访问](https://help.aliyun.com/document_detail/52056.html?spm=a2c4g.11186623.6.555.3f7457bdKfIVRV)
* [阿里云HBase Shell 入门](https://help.aliyun.com/document_detail/52057.html?spm=a2c4g.11186623.6.554.4f553294ENHqYE)
