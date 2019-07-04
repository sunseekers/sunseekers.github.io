---
layout: post
title: HBase hbck 运维指南
categories: [HBase]
description: HBase hbck 运维指南
keywords: HBase, hbck, HBCK
---

HBaseFsck（hbck）是一个用于检查区域一致性和表完整性问题并修复损坏的 HBase 的工具

---


#### 前言

HBaseFsck（hbck）是一个用于检查区域一致性和表完整性问题并修复损坏的HBase的工具。  
它工作在两种基本模式 - 只读不一致识别模式和多阶段读写修复模式。

HBCK 现在有两个版本。HBCK2 是 HBase 2.x 系列的。

HBCK1 不适用 HBase2.x 的

[HBCK1官方文档](http://hbase.apache.org/1.2/book.html#hbck.in.depth)

[HBCK2官方文档](https://hbase.apache.org/2.0/book.html#hbck)

因公司 HBase 集群为 1.2.0 版本的。所以这里以 hbck1 为主讲。hbck2 可以看看这个[HBase指南 HBase 2.0之修复工具HBCK2运维指南](https://mp.weixin.qq.com/s/GVMWwB1WsKcdvZGfvX1lcA)

#### 检查方面 

1. HBase Region一致性

    > * 集群中所有 region 都 被 assign，而且 deploy 到唯一一台RegionServer上
    > * 该 region 的状态在内存中、hbase:meta 表中以及 zookeeper 这三个地方需要保持一致

2. HBase 表完整性

    > * 对于集群中任意一张表，每个rowkey都仅能存在于一个region区间
    
#### 常用检查命令

``` 
# hbck 帮助文档
./bin/hbase hbck -help 

# 检查 HBase 集群是否损坏
./bin/hbase hbck

# 只检测元数据表的状态
./bin/hbase hbck -metaonly 

# 使用该 -details 选项将报告更多细节，包括所有表格中所有分割的代表性列表
./bin/hbase hbck –details

# 以下命令只会尝试检查表 TableFoo 和 TableBar
./bin/hbase hbck TableFoo TableBar
```

在命令输出结束时，它会打印 OK 或告诉存在的 INCONSISTENCIES 数量。

Status: OK，表示没有发现不一致问题。

Status: INCONSISTENT，表示有不一致问题。

可能还想运行 hbck 几次，因为一些不一致可能是暂时的。（例如，群集正在启动或区域正在分裂）

![](/images/blog/2019-06-17-1.png){:height="80%" width="80%"}

#### 用法整理

这里把 HBCK1 帮助文档的整理出来。整理来源作者白42的[hbase hbck用法](http://www.zhyea.com/2017/07/29/hbase-hbck-usage.html)


    hbase hbck [opts] {only tables}
    
    opts通用可选项
    -help 展示help信息；
    
    -detail 展示所有Region的详情；
    
    -timelag <秒级时间>  处理在过去的指定时间内没有发生过元数据更新的region；
    
    -sleepBeforeRerun <秒级时间>  在执行-fix指令后时睡眠指定的时间后再检查fix是否生效；
    
    -summary 只打印表和状态的概要信息；
    
    -metaonly 只检查hbase:meta表的状态；
    
    -sidelineDir <hdfs://> 备份当前的元数据到HDFS上；
    
    -boundaries  校验META表和StoreFiles的Region边界是否一致；
    
    元数据修复选项
    在不确定的情况下，慎用以下指令。
    
    -fix 尝试修复Region的分配，通常用于向后兼容；
    
    -fixAssignments 尝试修复Region的分配，用来替换-fix指令；
    
    -fixMeta  尝试修复元数据问题；这里假设HDFS上的region信息是正确的；
    
    -noHdfsChecking  不从HDFS加载/检查Region信息；这里假设hbase:meta表中的Region信息是正确的，不会在检查或修复任何HDFS相关的问题，如黑洞(hole)、孤岛(orphan)或是重叠(overlap)；
    
    -fixHdfsHoles  尝试修复HDFS中的Region黑洞；
    
    -fixHdfsOrphans  尝试修复hdfs中没有.regioninfo文件的region目录；
    
    -fixTableOrphans  尝试修复hdfs中没有.tableinfo文件的table目录（只支持在线模式）；
    
    -fixHdfsOverlaps  尝试修复hdfs中region重叠的现象；
    
    -fixVersionFile  尝试修复hdfs中hbase.version文件缺失的问题；
    
    -maxMerge <n>  在修复region重叠的现时，允许merge最多<n>个region（默认n等于5）；
    
    -sidelineBigOverlaps  在修复region重叠问题时，允许暂时搁置重叠量较大的部分；
    
    -maxOverlapsToSideline <n>  在修复region重叠问题时，允许一组里暂时搁置最多n个region不处理（默认n等于2）；
    
    -fixSplitParents 尝试强制将下线的split parents上线；
    
    -ignorePreCheckPermission  在执行检查时忽略文件系统权限；
    
    -fixReferencesFiles 尝试下线引用断开（lingering reference）的StoreFile；
    
    -fixEmptyMetaCells  尝试修复hbase:meta表中没有引用到任何region的entry（REGIONINFO_QUALIFIER为空的行）。
    
    Datafile修复选项
    专业命令，慎用。
    
    -checkCorruptHFiles  检查所有HFile —— 通过逐一打开所有的HFile来确定其是否可用；
    
    -sidelineCorruptHFiles  隔离损坏的HFile。该指令中包含-checkCorruptHFiles操作。
    
    Meta修复快捷指令
    -repair  是以下指令的简写：-fixAssignments -fixMeta -fixHdfsHoles -fixHdfsOrphans -fixHdfsOverlaps -fixVersionFile -sidelineBigOverlaps -fixReferenceFiles -fixTableLocks -fixOrphanedTableZnodes；
    
    -repairHoles  是以下指令的简写：-fixAssignments -fixMeta -fixHdfsHoles。
    
    Table lock选项
    -fixTableLocks 删除已持有超过很长时间的table lock（(hbase.table.lock.expire.ms配置项，默认值为10分钟）。
    
    Table Znode选项
    -fixOrphanedTableZnodes  如果表不存在，则将其在zookeeper中ZNode状态设置为disabled。

#### 修复

##### 1. 局部低危修复

-fixAssignments ：修复没有assign、assign不正确或者同时assign到多台RegionServer的问题region。

-fixMeta ：主要修复.regioninfo文件和hbase:meta元数据表的不一致。修复的原则是以HDFS文件为准：如果region在HDFS上存在，但在hbase.meta表中不存在，就会在hbase:meta表中添加一条记录。反之如果在HDFS上不存在，而在hbase:meta表中存在，就会将hbase:meta表中对应的记录删除。

##### 2. 高危修复 

region区间overlap相关问题的修复属于高危修复操作，因为这类修复通常需要修改HDFS上的文件，有时甚至需要人工介入。

对于这类高危修复操作，建议先执行hbck -details详细了解更多的问题细节，再执行相应的修复命令

**-repair｜-fix 命令强烈不建议生产线使用**

[HBase排查 小心hbck的-repair参数](https://mp.weixin.qq.com/s/Ke12M7rVfntJL2s1uG-xVg)

-fix 用来修复 region 级别的不一致性。

其内部的操作顺序如下: 
1. 先查是否存在不一致的。 
2. 如有表级别的不一致性，则先修复表的不一致问题。 
3. 如有region级别的不一致性，则修复该级别的问题。在修复期间region是关闭状态 

#### 案例

hbck 可以修复各种错误 https://blog.csdn.net/liliwei0213/article/details/53639275

网上很多案例。这里就不写了，以后遇到处理的。我在补回记录


---
参考链接
* [HBase hbck——检察HBase集群的一致性](https://blog.csdn.net/xiao_jun_0820/article/details/28602213)
* [hbase hbck用法](http://www.zhyea.com/2017/07/29/hbase-hbck-usage.html)
* [Apache HBase 问题排查思路](https://mp.weixin.qq.com/s/RBXctAm9YGMPCQHR1NN8TQ)
* [HBase运维基础——元数据逆向修复原理](https://mp.weixin.qq.com/s/yt4X2tDQrLx35NsviRHbPg)




