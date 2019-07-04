---
layout: post
title: HBase 目录结构
categories: [HBase]
description: HBase 目录结构
keywords: HBase
---

HBase 在 HDFS 存储目录结构、在 Zookeeper 的目录结构

---

#### 前言

HBase 在 HDFS 存储目录结构、在 Zookeeper 的目录结构

#### 在 HDFS 路径

HBase 在 HDFS 默认根目录: `/hbase`

配置项 `<name> hbase.rootdir </name> `

``` 
[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase
Found 10 items
drwxr-xr-x   - hbase hbase          0 2019-02-22 11:20 /hbase/.hbase-snapshot   # 存储的是 Snapshot 的相关信息
drwxr-xr-x   - hbase hbase          0 2019-06-10 20:57 /hbase/.tmp              # 临时目录。当对表进行操作的时候，首先会将表移动到该目录下，然后再进行操作。
drwxr-xr-x   - hbase hbase          0 2019-06-19 20:17 /hbase/MasterProcWALs    # 一个HMaster主节点状态日志文件。
drwxr-xr-x   - hbase hbase          0 2019-06-19 19:12 /hbase/WALs              # 预写日志，和 Hadoop 中的 edits 文件类似，作用是容灾
drwxr-xr-x   - hbase hbase          0 2019-06-19 19:25 /hbase/archive           # HBase 在做 Split , Compact，Drop 操作完成之后，会将 HFile 移到 archive 目录中,然后将之前的 hfile 删除掉,该目录由 HMaster 上的一个定时任务定期去清理. 
drwxr-xr-x   - hbase hbase          0 2019-01-30 16:55 /hbase/corrupt           # 存储 HBase 做损坏的日志文件，一般都是为空的
drwxr-xr-x   - hbase hbase          0 2019-06-11 11:44 /hbase/data              # HBase 的表数据目录，0.98版本里支持 namespace 的概念模型，系统会预置两个 namespace 即: hbase 和 default
-rw-r--r--   3 hbase hbase         42 2018-12-25 15:31 /hbase/hbase.id          # 它是一个文件，存储集群唯一的 cluster id 号，是一个 uuid
-rw-r--r--   3 hbase hbase          7 2018-12-25 15:31 /hbase/hbase.version     # 同样也是一个文件，存储集群的版本号，貌似是加密的，看不到，只能通过web-ui 才能正确显示出来  
drwxr-xr-x   - hbase hbase          0 2019-06-19 19:54 /hbase/oldWALs           # 预写日志归档目录，参数 hbase.master.logcleaner.ttl 控制此文件会定时被清除，默认是 10 分钟
```

MasterProcWALs 解释下。由于目前几乎所有的集群操作都是通过 procedure 进行的。   
procedure 执行的每一步都会以log的形式持久化在 HBase 的 MasterProcWals 目录下，这样 master 在重启时也能通过日志来恢复之前的状态并且继续执行。  
完成的操作日志一段时间后会被删除

/hbase/archive 目录下的数据会过期清理，但是 Snapshot 对应的数据不会被清理，除非删除对应 Snapshot。
只要原来的文件有被删除的情况，如 Compaction，Split, Drop 操作，那么快照所引用的hfile文件都会归档到archive的对应表目录中。

HBase 的表数据目录首先是 namespace。hbase、default 是 HBase 自带的 namespace

``` 
[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase/data
Found 4 items
drwxr-xr-x   - hbase hbase          0 2019-06-19 19:12 /hbase/data/default
drwxr-xr-x   - hbase hbase          0 2018-12-25 15:31 /hbase/data/hbase
drwxr-xr-x   - hbase hbase          0 2019-03-06 10:38 /hbase/data/mytest
drwxr-xr-x   - hbase hbase          0 2019-01-03 14:41 /hbase/data/nametest
```

hbase 这个 namespace 下面存储了 HBase 的 namespace、meta 和 acl 三个表。   
如果没有开启 HBase 权限的话不会有 acl 这个表。 启用 HBase 授权。设置 hbase.security.authorization = true

``` 
[root@aaadddccc ~]# hadoop fs -ls /hbase/data/hbase
Found 3 items
drwxr-xr-x   - hbase supergroup          0 2018-04-16 21:12 /hbase/data/hbase/acl
drwxr-xr-x   - hbase supergroup          0 2016-06-30 19:03 /hbase/data/hbase/meta
drwxr-xr-x   - hbase supergroup          0 2016-06-30 19:04 /hbase/data/hbase/namespace
```

每张表都维护 tabledesc 和 regioninfo

``` 
[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase/data/default/tu
Found 3 items
drwxr-xr-x   - hbase hbase          0 2019-06-01 15:59 /hbase/data/default/tu/.tabledesc    # 表的元数据目录
drwxr-xr-x   - hbase hbase          0 2019-06-01 15:59 /hbase/data/default/tu/.tmp          # 中间临时数据，当 .tableinfo 被更新时该目录就会被用到
drwxr-xr-x   - hbase hbase          0 2019-06-08 21:06 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd  # encoded_regionname 即 region 编码名

[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase/data/default/tu/.tabledesc
Found 1 items
-rw-r--r--   3 hbase hbase        285 2019-06-01 15:59 /hbase/data/default/tu/.tabledesc/.tableinfo.0000000001 # 表元数据信息具体文件

[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd
Found 4 items
-rw-r--r--   3 hbase hbase         37 2019-06-01 15:59 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/.regioninfo      # region 描述目录
drwxr-xr-x   - hbase hbase          0 2019-06-08 21:06 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/.tmp             # 存储临时文件，比如某个合并产生的重新写回的文件
drwxr-xr-x   - hbase hbase          0 2019-06-08 21:06 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/picinfo          # 列族
drwxr-xr-x   - hbase hbase          0 2019-06-01 16:52 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/recovered.edits  # WAL 日志回放目录
[root@massive-dataset-new-005 ~]# hadoop fs -ls /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/.regioninfo
-rw-r--r--   3 hbase hbase         37 2019-06-01 15:59 /hbase/data/default/tu/44b1f7dc0ce95cfd867d69a17f26b1fd/.regioninfo      # region 描述文件
```

#### 在 zk 目录结构

查看 Zookeeper 内部 HBase 相关数据，有三个主要的渠道:
- 通过 hbase shell 命令 zk_dump 查看
- 通过 hbase zkcli 查看
- 通过 Zookeeper 查看

``` 
[zk: localhost:2181(CONNECTED) 0] ls /hbase
[meta-region-server, acl, backup-masters, table, draining, region-in-transition, running, table-lock, master, balancer, namespace, hbaseid, online-snapshot, replication, splitWAL, recovering-regions, rs, flush-table-proc]
```

``` 
hbase(main):001:0> zk_dump
HBase is rooted at /hbase
Active master address: datanode1,60000,1483706056881
Backup master addresses:
Region server holding hbase:meta: datanode3,60020,1483706055770
Region servers:
 datanode2,60020,1483706054731
 datanode0,60020,1483706054027
 datanode4,60020,1483706055881
 datanode3,60020,1483706055770
 datanode7,60020,1483706055693
 datanode5,60020,1483706054452
/hbase/replication: 
/hbase/replication/peers: 
/hbase/replication/rs: 
/hbase/replication/rs/datanode5,60020,1483706054452: 
/hbase/replication/rs/datanode7,60020,1483706055693: 
/hbase/replication/rs/datanode3,60020,1483706055770: 
/hbase/replication/rs/datanode4,60020,1483706055881: 
/hbase/replication/rs/datanode0,60020,1483706054027: 
/hbase/replication/rs/datanode2,60020,1483706054731: 
Quorum Server Statistics:
 localhost:2181
  Zookeeper version: 3.4.5-cdh5.7.2--1, built on 07/22/2016 19:18 GMT
  Clients:
   /172.16.171.9:48487[1](queued=0,recved=5107,sent=5107)
   /172.16.171.17:36252[1](queued=0,recved=50936,sent=50936)
   /172.16.171.20:47011[1](queued=0,recved=19631,sent=19631)
   /172.16.171.19:62253[1](queued=0,recved=7455,sent=7455)
   /127.0.0.1:18625[1](queued=0,recved=22,sent=22)
   /172.16.171.11:34643[1](queued=0,recved=7456,sent=7456)
   /127.0.0.1:18621[1](queued=0,recved=3,sent=3)
   /172.16.171.21:38192[1](queued=0,recved=7467,sent=7467)
   /172.16.171.17:36254[1](queued=0,recved=50936,sent=50936)
   /172.16.171.5:60302[1](queued=0,recved=7456,sent=7456)
   /172.16.171.9:48540[1](queued=0,recved=25518,sent=25518)
   /172.16.171.9:32467[1](queued=0,recved=7455,sent=7455)
   /172.16.171.8:61522[1](queued=0,recved=10566,sent=10586)
   /172.16.171.19:16777[1](queued=0,recved=25518,sent=25518)
   /127.0.0.1:18626[0](queued=0,recved=1,sent=0)
   /172.16.171.8:45515[1](queued=0,recved=7455,sent=7455)
   /172.16.171.12:18371[1](queued=0,recved=381742,sent=381742)
  
  Latency min/avg/max: 0/3/51663
  Received: 1431771
  Sent: 1461307
  Connections: 17
  Outstanding: 0
  Zxid: 0x2600046a80
  Mode: follower
  Node count: 5349
```

关于输出结果的解读，就不去细说了，感兴趣的兄弟，自己去问度娘吧。

---
参考链接
* [hbase数据存储](https://www.jianshu.com/p/4e4f5f558816)
* [hbase在hdfs上的详细目录结构](https://blog.csdn.net/L_15156024189/article/details/83444255)
* [HBase与Zookeeper数据结构查询](https://www.cnblogs.com/hadoopdev/p/3984318.html)
* [HBase 在HDFS上的物理目录结构](https://blog.bcmeng.com/post/hbase-hdfs.html)

