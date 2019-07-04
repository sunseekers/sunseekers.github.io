---
layout: post
title: JournalNode 不同步
categories: [HDFS]
description: JournalNode 不同步
keywords: HDFS
---

JournalNode 不同步

---

#### 前言

这里记录之前处理的一次 JournalNode 不同步。

应处理的太急，没有对现场进行截图。

下次再遇到，再补上截图吧。


#### 异常

在启动 HDFS 之后，HDFS 发出 JournalNode 不同步的警告。

经过检查，可以看见存放同步文件的目录 /data/dfs/jn 目录找不到，没有这种目录。

这时我们从其他正常的 JournalNode 上把目录 copy 过来即可。

如果有目录的话，那就移走。反正已经不完整了。但是别删了，防止需要回滚。

使用scp直接拷贝就可以了

``` 
rm -rf jn 
scp -r root@100.xxx.1:/data/dfs/jn ./
chown -R hdfs:hdfs jn
```

查看博客有人提示到说 scp 时间不应该超过 journalnode_sync_status_startup_tolerance 参数设置的时间

同时还提到在 scp 要考虑同步数据时的带宽限制。dfs.image.transfer.bandwidthPerSec参数。

![](/images/blog/2019-03-16-1.png)

![](/images/blog/2019-03-16-2.png)

---
参考链接
* [Hadoop:CDH 5--不同步的 JournalNode](http://www.voidcn.com/article/p-auelsbhf-bee.html)









