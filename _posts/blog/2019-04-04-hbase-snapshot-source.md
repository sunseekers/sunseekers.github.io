---
layout: post
title: HBase Snapshot 源码分析 1
categories: [HBase]
description: some word here
keywords: HBase, Snapshot
---

Snapshot是很多存储系统和数据库系统都支持的功能。

---

#### 前言

主要是以作者 clark010 文章为核心写的。 [原HBase Snapshot - 1 - 简介][1] 。

参考众多文章汇总的文章。无意商用和抄袭。只是个人学习的总结。

具体参考请看文末尾的链接。

#### 背景
HBase 的 Snapshot 及 Restore 都不涉及文件的移动和拷贝，操作耗时在秒级别；

因为底层依赖的 HDFS FileSystem 不支持硬链接，所以 HBase 自己实现了一套FileLink的逻辑，每次snapshot都只是进行文件的link而不实际移动数据，

而这保证了snapshot操作的效率（虽然不可避免的需要进行一下内存flush，但基本最耗时的消耗都在flush这一下）。

#### Snapshot相关存储路径
``` 
/[hbase-root]
    |__ .hbase-snapshot  存储所有snapshot的元信息
        |__ .tmp/  snapshot的workDir，临时数据存放
        |__ [snapshot name]
            |__ .snapshotinfo  snapshot的元信息
            |__ data.manifest  snapshot相关hfile的元信息
    |__ data
        |__ [namespace]  
            |__ [table]
                |__ .tabledesc
                    |__ .tableinfo.[id]
                |__ [encode region]
                    |__ .regioninfo
                    |__ [column family]
                        |__ [HFile / Link Files] HBase底层支持HFile及链接文件
                        |__ .links-[regionName]  back reference，用于快速的删除无用的引用文件
                            |__ [ref files]
                    |__ .....
    |__ archive
        |__ data
            |__ [namespace]
                |__ [table]
                    |__ [encode region]
                        |__ [column family]
                            |__ [HFile / Link Files] 
    |__ WALs / oldWALs / ......
```

#### 主要Java类

Client：
> * HBaseAdmin  - 入口类

Master：
> * MasterRpcServices  - 接收Client端的RPC请求
> * SnapshotManager
> * EnabledTableSnapshotHandler extends TableSnapshotHandler  - 在线表
> * DisabledTableSnapshotHandler extends TableSnapshotHandler  - 离线表
> * ProcedureCoordinator  - 用于提交分布式snapshot事务
> * Procedure
> * ZKProcedureCoordinatorRpcs extends ProcedureCoordinator
> * SnapshotFileCache  - 缓存snapshot引用文件，用于判断文件是否deletable
> * SnapshotFileCleaner - 清理snapshot文件线程

RegionServer：
> * RegionServerSnapshotManager - 监控分布式任务，并创建管理具体子任务
> * FlushSnapshotSubprocedure
> * RegionSnapshotTask - FlushSnapshotSubprocedure内部类
> * HRegion - 调用snapshot接口，处理具体的snapshot任务
> * SnapshotManifest - Utility class to help read/write the Snapshot Manifest
> * SnapshotManifestV2/SnapshotManifestV1 - SnapshotManifest内存数据结构


---
参考链接
* [HBase原理 – 分布式系统中snapshot是怎么玩的？](http://hbasefly.com/2017/09/17/hbase-snapshot/)
* [原HBase Snapshot - 1 - 简介][1]
* [原HBase Snapshot- 2 -Snapshot源码分析](https://www.jianshu.com/p/e1a2baa790d1)
* [hbase源码系列（七）Snapshot的过程](https://www.cnblogs.com/cenyuhai/p/3712943.html)
* [hbase源码系列（八）从Snapshot恢复表](https://www.cnblogs.com/cenyuhai/p/3721247.html)
* [HBase Snapshot 源码 流程](https://ppg.iteye.com/blog/1888453)
* [HBase Snapshot原理和实现](https://www.cnblogs.com/foxmailed/p/3914117.html)


[1]: https://www.jianshu.com/p/74942f500a13