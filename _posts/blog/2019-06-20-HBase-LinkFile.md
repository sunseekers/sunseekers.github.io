---
layout: post
title: HBase LinkFile
categories: [HBase]
description: HBase LinkFile
keywords: HBase
---

clone_snapshot 的关键 linkfile

---

#### 前言

今天 HBase 维护过程中打开了 /hbase/archive 路径，发现该路径下面存在文件。

/hbase/archive 为归档路径，HBase 在做 Split , Compact，Drop 操作完成之后，
会将 HFile 移到 archive 目录中, 然后将之前的 hfile 删除掉, 该目录由 HMaster 上的一个定时任务定期5分钟去清理.  

![](/images/blog/2019-06-20-1.png){:height="80%" width="80%"}

都18年6月份的数据了，怎么还没删掉。这不科学。这开启了我的探索之旅

#### 分析

某度搜索到对表做了 snapshot 的话，archive 不会被清理。

然后 hbase shell 中输入 list_snapshots 的确看到该表存在快照。(忘记留图了)

确认该快照已经不需要的情况下，我对其进行了删除。

10 分钟后观察发现还未删除。。。。这就有点尴尬了。

之前也遇到过一次 archive 目录下表的 HFile 文件是用 bulkload 方式加载的，HFile 文件权限不够，HBase 无法删除，
所以这次我也猜测是不是这个原因。

![](/images/blog/2019-06-20-2.png){:height="80%" width="80%"}

ls 查看后发现都是 hbase 的权限。这可咋办啊。这时我留意到有个 .links-ba0feda3ca8d499a9eb375503ad943c2 的目录

这个目录干嘛的。我对此产生疑惑

#### LinkFile 

![](/images/blog/2019-06-20-3.png){:height="80%" width="80%"}

进去看了之后，发现是个 back-reference 文件，这时就明白了，估计是 Snapshot 的恢复表一个指引。

![](/images/blog/2019-06-20-4.png){:height="80%" width="80%"}

正如猜想一样。就是恢复表的一个指引, 即 clone 生成的 LinkFile。

HBase 就是利用在删除 archive 中原始表文件的时候知道这些文件还被一些恢复表的 LinkFile 引用着

LinkFile 和 back-reference 文件格式如下所说。

``` 
（1）原始文件: /hbase/data/table-x/region-x/cf/file-x
（2）clone 生成的 LinkFile: /hbase/data/table-cloned/region-y/cf/{table-x}={region-x}-{file-x}，因此可以很容易根据LinkFile定位到原始文件
（3）back-reference 文件: /hbase/.archive/data/table-x/region-x/cf/.links-file-x/{region-y}.{table-cloned}，可以看到，back-reference文件路径中包含所有原始文件和LinkFile的信息，因此可以有效的根据原始文件/table-x/region-x/cf/file-x定位到LinkFile：/table-cloned/region-y/cf/{table-x}-{region-x}-{file-x}
```

举个例子。假设

LinkFile 文件名为 music=5e54d8620eae123761e5290e618d556b-f928e045bb1e41ecbef6fc28ec2d5712。

根据定义可以知道 music 为原始文件的表名，5e54d8620eae123761e5290e618d556b 为引用文件所在的 region，f928e045bb1e41ecbef6fc28ec2d5712 为引用的 HFile 文件

![](/images/blog/2019-06-20-5.png){:height="80%" width="80%"}

可以依据规则可以直接根据LinkFile的文件名定位到引用文件所在位置

***/music/5e54d8620eae123761e5290e618d556b/cf/f928e045bb1e41ecbef6fc28ec2d5712

如果在 music 表的 HFile 被放置到 archive 目录下，则会生成一个 back-reference 文件

根据这个 back-reference 文件 HBase 才知道该 HFile 该不该清理。

HFileLinkCleaner 负责清理这类 HFile。

![](/images/blog/2019-06-20-6.png){:height="80%" width="80%"}

通过注释可以了解到，如果对 archive 中的文件的引用不存在了，则可以删除。

```
/**
 * HFileLink cleaner that determines if a hfile should be deleted.
 * HFiles can be deleted only if there're no links to them.
 *
 * When a HFileLink is created a back reference file is created in:
 *      /hbase/archive/table/region/cf/.links-hfile/ref-region.ref-table
 * To check if the hfile can be deleted the back references folder must be empty.
 */
```

#### 清理

如果想尽快清理掉，有两种方法。

- 对恢复表做个 major_compact 即可把指引的 HFile 写入到恢复表上。指引文件会消失。
- 删除恢复表

#### 总结

其实之前就学过 snapshot 的知识，只是太久没回顾了，又有点忘记了。导致这次花了点时间。

如果有没讲清的地方，可以留言，也可以自行阅读参考链接。

---
参考链接
* [HBase原理 – 分布式系统中snapshot是怎么玩的？](http://hbasefly.com/2017/09/17/hbase-snapshot/)
* [HMaster 功能之定期清理archive](https://www.jianshu.com/p/f82aafd7b381)
* [Hbase在hdfs上的archive目录占用空间过大](https://blog.csdn.net/qq_31598113/article/details/79934919)







