---
layout: post
title: HBase 中的备份和故障恢复方法
categories: [HBase]
description: some word here
keywords: keyword1, keyword2
---

常见的 HBase 数据迁移和备份的方式

---

#### 常见的 HBase 数据迁移和备份的方式

我们知道目前HBase可以通过如下几种方式对数据进行数据的迁移和备份：

1、通过distcp命令拷贝hdfs文件的方式实现数据的迁移和备份    
这种方式使用MapReduce实现文件分发，把文件和目录的列表当做map任务的输入，每个任务完成部分文件的拷贝和传输工作。在目标集群再使用bulkload的方式导入就实现了数据的迁移。    这种方式不好的地方在于需要停写，不然会导致数据不一致，比较适合迁移历史表（数据不会被修改的情况）

2、通过copytable的方式实现表的迁移和备份这种方式是以表级别进行迁移的，其本质也是使用MapReduce的方式进行数据的同步，和上面distcp不一样的是吗，copytable的方式是利用MapReduce去scan源表的数据，然后把scan出来的数据写到目标集群，从而实现数据的迁移和备份。    

这种方式相当于逻辑备份，需要通过大量的scan数据，对于很大的表，如果这个表本身又读写比较频繁的情况下，会对性能造成比较大的影响，并且效率比较低。

3、通过replication的方式实现表的复制    这种方式类似mysql的同步方式，HBase通过同步WAL日志中所有变更来实现表的同步，异步同步。    这种方式需要在两个集群数据一样的情况下开启复制，默认复制功能是关闭的，配置后需要重启集群，并且如果主集群数据有出现误修改，备集群的数据也会有问题。

4、通过Export/Import的方式实现表的迁移和备份这种方式和copytable的方式类似，将HBase表的数据转换成Sequence File并dump到HDFS，也涉及Scan表数据。和copytable不同的是，Export不是将HBase的数据scan出来直接Put到目标集群，而是先转换成文件并同步到目标集群，再通过Import的方式导到对应的表中。    这种方式需要scan数据，也会对HBase造成负载的影响，效率不高。

5、通过snapshot的方式实现表的迁移和备份    这种方式就是我们今天要重点介绍的HBase快照，通过快照的方式实现HBase数据的迁移和拷贝。这种方式比较常用，效率高，也是最为推荐的数据迁移方式。综上，我们可以分析了各种HBase数据的迁移和备份的方式的优劣，强烈推荐使用snapshot的方式来进行数据的迁移和备份，那么什么是snapshot？原理是什么？以及如何使用snap？在下面的篇幅中就来详细介绍一下HBase的快照功能。

https://www.jianshu.com/p/8d091591d872
https://www.cnblogs.com/blfshiye/p/5245317.html