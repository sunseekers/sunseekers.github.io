---
layout: post
title: HBase 表增加 Snappy 压缩
categories: [HBase]
description: HBase 表增加 Snappy 压缩
keywords: HBase, Snappy
---

HBase 表增加 Snappy 压缩

---

#### 前言

公司有业务要上 HBase。 数据量较大。要保存30天内的日志数据。因此觉得应该对该表增加 Snappy 压缩


####  验证 snappy 是否正常安装

snappy 的介绍和安装这里不介绍了。感兴趣的朋友可以读下这篇博客 [Hadoop HBase 配置 安装 Snappy 终极教程](https://www.cnblogs.com/shitouer/archive/2013/01/14/2859475.html)

CDH中，直接安装了snappy的库，所以直接用了。

找某个文件，对其进行压缩测试。

我这里就拿 HBase log 日志试试手。 

``` 
cd /var/log/hbase
hbase org.apache.hadoop.hbase.util.CompressionTest hbase-cmf-hbase-MASTER-massive-dataset-new-004.log.out  snappy
```

![](/images/blog/2019-04-03-1.png)

如果正确安装 snappy 则会显示 SUCCESS 字眼 

#### 增加 snappy 压缩 


##### 1. 创建表时指定压缩算法

create 'test', {NAME => 'info', VERSIONS => 1, COMPRESSION => 'snappy'}

##### 2. 创建表后指定或修改压缩算法

虽然不 disable 也能修改表结构，但是为了降低影响，建议先 disable。 修改完之后在 enable。

注意: 如果表较大，disable需要一些时间，请耐心等待。

修改表定义
``` 
alter 'mytable', {NAME=>'cf',COMPRESSION => 'snappy'}  
```

#### 使压缩生效

表中此前的数据，还没有压缩，如果要让整个表的数据都压缩，需要对表进行 major compact 。

``` 
major_compact 'mytable'
```

注意: 如果表的数据较多，该操作需要较长时间，所以尽量选择一个不忙的时间，避免对服务造成影响。

#### 压缩比

打开该表所在某个 RS 的 Web 界面，在 Region Name 找到表所在行，看 Storefile Metrics 中的 

storefileUncompressedSize , storefileSize 。 就可以看得，压缩前后容量。

![](/images/blog/2019-04-03-2.png)

假设Region 数据如下

storefileUncompressedSizeMB=160, storefileSizeMB=66

则压缩比算出来为 compressionRatio=0.4125

---
参考链接
* [HBase表增加snappy压缩](https://blackwing.iteye.com/blog/1942037)
* [HBase启用压缩](https://www.cnblogs.com/wxyidea/p/9347362.html)
* [HBase修改压缩格式及Snappy压缩实测分享](https://www.cnblogs.com/shitouer/p/hbase-table-alter-compression-type-and-snappy-compression-compare.html)
* [HBase使用压缩存储（snappy）](https://www.cnblogs.com/tyoyi/p/4538830.html)