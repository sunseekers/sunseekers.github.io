---
layout: post
title: HBase 表数据迁移
categories: [HBase]
description: 使用 CopyTable 同步 HBase 数据
keywords: CopyTable, HBase
---

使用 CopyTable 同步 HBase 数据

---
#### 背景
迁移 Kylin需要将 metadata 表进行迁移。

#### 介绍
CopyTable 是 HBase 提供的一个数据同步工具，可以用于同步表的部分或全部数据。
CopyTable 可以将表的一部分或全部复制到同一个集群或另一个集群。目标表必须首先存在。

#### 命令示例
抄自官方
```
bin/hbase org.apache.hadoop.hbase.mapreduce.CopyTable 
[--starttime=X] [--endtime=Y] [--new.name=NEW] [--peer.adr=ADR] tablename
```

CopyTable常用选项说明如下：
* startrow 开始行。
* stoprow 停止行。
* starttime 时间戳（版本号）的最小值。
* endtime 时间戳的最大值。如果不指定starttime，endtime不起作用。
* peer.adr 目标集群的地址。格式为：hbase.zookeeer.quorum:hbase.zookeeper.client.port:zookeeper.znode.parent
* families 要同步的列族。多个列族用逗号分隔。
* all.cells 删除标记也进行同步。

更多参数参见[官方文档](http://hbase.apache.org/book.html?spm=a2c4e.11153940.blogcont176546.18.330a3d9aX9KqDF#copy.table)


抄自阿里云

```
./bin/hbase org.apache.hadoop.hbase.mapreduce.CopyTable 
-Dhbase.client.scanner.caching=200 
-Dmapreduce.local.map.tasks.maximum=16 
-Dmapred.map.tasks.speculative.execution=false 
--peer.adr=$ZK_IP1,$ZK_IP2,$ZK_IP3:/hbase $TABLE_NAME
```

> * 对于单机运行的情况，需要指定mapreduce.local.map.tasks.maximum参数，表示并行执行的最大map个数。不指定的话默认是1，所有任务都是串行执行的。
> * hbase.client.scanner.caching建议设置为大于100的数。这个数越大，使用的内存越多，但是会减少scan与服务端的交互次数，对提升读性能有帮助。
> * mapred.map.tasks.speculative.execution建议设置为false，避免因预测执行机制导致数据写两次。

注意执行前应该先创建目标表目标表的表名和列簇名需与原来保持一致。 
强烈建议根据数据的分布情况对目标表进行预分裂，这样能够提高写入速度。

性能数据可以阅读第一个参考链接

---
参考链接
* [使用CopyTable同步HBase数据](https://yq.aliyun.com/articles/176546)
* [表数据迁移（可以指定时间戳将数据导出方法）](https://www.cnblogs.com/yingjie2222/p/6016771.html)