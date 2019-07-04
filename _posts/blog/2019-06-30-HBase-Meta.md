---
layout: post
title: HBase Meta 表
categories: [HBase]
description: 
keywords: HBase, Meta
---

HBase Meta 表

---

#### 前言

目录表 hbase:meta 作为HBase 表存在，并从 HBase shell 的list命令中过滤掉（命名空间"hbase"下的表都会过滤掉），但实际上是一个表，就像任何其他表一样。

![](/images/blog/2019-07-01-1.png){:height="80%" width="80%"} 

#### meta 表

hbase:meta 表属于系统表

META表是一个保存的了系统中所有 Region 列表的 HBase 表

它保存在一个 RS 上面，那如何去知道它在哪个 RS 上呢？ 这就要利用 zk 了

meta 表的地址信息保存在 zk 的 /hbase 路径下的 meta-region-server 节点上

![](/images/blog/2019-07-01-2.png){:height="80%" width="80%"} 

#### 表结构

![](/images/blog/2019-07-01-3.png){:height="80%" width="80%"} 

Key: Region key of the format ([table表名],[region start key起始键],[region id])

`region id 由该 region 生成的时间戳（精确到毫秒）与 region encoded 组成`  
`region encoded 由 region 所在的 表名, StartKey, 时间戳这三者的MD5值产生，HBase 在 HDFS 上存储 region 的路径就是 region encoded。`

key 被用来表示 region name

![](/images/blog/2019-07-01-4.png){:height="80%" width="80%"} 

values:

- info:regioninfo, RegionInfo 的 encodeValue值

- info:seqnumDuringOpen, 序列号

- info:server, Region 所在的 RS

- info:serverstartcode, RS 启动的 timestamp

![](/images/blog/2019-07-01-5.png){:height="80%" width="80%"} 

关于 HRegionInfo 的注释

空键用于表示表开始和表结束。具有空开始键的区域是表中的第一个区域。如果某个区域同时具有空开始和空结束键，则它是表中唯一的区域


---
参考链接
* [HBase运维基础——元数据逆向修复原理](https://yq.aliyun.com/articles/586755?utm_content=m_48695)


