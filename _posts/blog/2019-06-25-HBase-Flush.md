---
layout: post
title: HBase Flush 时机
categories: [HBase]
description: HBase MemStore 的刷写时机
keywords: HBase, Flush
---

HBase MemStore 的刷写时机

---

#### Flush 时机

HBase 会在如下几种情况下触发 flush 操作，需要注意的是 MemStore 的最小 flush 单元是 HRegion 
而不是单个 MemStore。可想而知，如果一个 HRegion 中 Memstore 过多，每次 flush 的开销必然会很大，
因此建议在进行表设计的时候尽量减少 ColumnFamily 的个数。

根据 HBase 官方文档总结的刷写时机有6种:
##### 1. MemStore 级别限

当 Region 中任意一个 MemStore 的大小达到了上限(hbase.hregion.memstore.flush.size，默认128MB)，会触发 MemStore 刷新。

##### 2. Region 级别限制

当 Region 中所有 MemStore 的大小总和达到了上限(hbase.hregion.memstore.block.multiplier * hbase.hregion.memstore.flush.size，默认 4 * 128M = 512M)，会触发 MemStore 刷新。

##### 3. Region Server 级别限制

当 Region Server 内部所有 MemStore 总和大小达到分配给 MemStore 最大内存(hbase_heapsize * hbase.regionserver.global.memstore.size, 默认0.4，也就是堆内存的40%)，会触发刷写阻塞。
低于分配给 MemStore 最大内存，高于 Memstore 刷新的低水位线(hbase.regionserver.global.memstore.size.lower.limit, 默认值 0.95), 会触发刷写。

总体来说，如果全局 MemStore 的总和达到了分配给 MemStore 最大内存的95%，就会导致全局刷写，默认有40%的内存会分给 MemStore。而当超过了 MemStore 的最大内存，也就是堆内存的40%就会触发刷写阻塞。

如果有16G堆内存，默认情况下:
``` 
#达到该值会触发刷写
16*0.4*0.95=0.608
#达到该值会触发刷写阻塞
16*0.4=6.4
```

相信好多人会在网上看到 hbase.regionserver.global.memstore.upperLimit、hbase.regionserver.global.memstore.lowerLimit 这两个参数。

这两个参数已经发生了改变了。对应的新参数如下:

新参数 | 老参数 
-|-
hbase.regionserver.global.memstore.size | hbase.regionserver.global.memstore.upperLimit
hbase.regionserver.global.memstore.size.lower.limit | hbase.regionserver.global.memstore.lowerLimit

的确，当时我也看了老版本的 Region Server 级别限制:
`当一个Region Server中所有Memstore的大小总和达到了上限（hbase.regionserver.global.memstore.upperLimit ＊ hbase_heapsize，默认 40%的JVM内存使用量），会触发部分Memstore刷新。Flush顺序是按照Memstore由大到小执行，先Flush Memstore最大的Region，再执行次大的，直至总体Memstore内存使用量低于阈值（hbase.regionserver.global.memstore.lowerLimit ＊ hbase_heapsize，默认 38%的JVM内存使用量）。`

按照老版本来看，我发现新搭建的集群配置怎么不对，lowerLimit 怎么比 upperLimit 还高。一度让我弄混。

![](/images/blog/2019-06-25-1.png){:height="80%" width="80%"}

直到我弄清楚 hbase.regionserver.global.memstore.size.lower.limit 是分配给 MemStore 最大内存的刷新的低水位线才明白。

大家可以参阅官方文档对两个新参数的解释。

![](/images/blog/2019-06-25-2.png){:height="80%" width="80%"}

##### 4. HLog 数量限制

当一个 Region Server 中 HLog 数量达到上限(可通过参数 hbase.regionserver.maxlogs 配置)时，系统会选取最早的一个 HLog 对应的一个或多个 Region 进行 flush

![](/images/blog/2019-06-25-3.png){:height="80%" width="80%"}

##### 5. 定期刷新

HBase 定期刷新 MemStore (hbase.regionserver.optionalcacheflushinterval), 默认周期为1小时，确保 MemStore 不会长时间没有持久化。为避免所有的 MemStore 在同一时间都进行 flush 导致的问题，定期的 flush 操作有 20000 左右的随机延时。

hbase.regionserver.optionalcacheflushinterval 参数设置为 0 可关闭。CDH 管理页面上没有直接设置

![](/images/blog/2019-06-25-4.png){:height="80%" width="80%"}

##### 6. 手动执行

可以通过 shell 命令 flush 'tableName' 或者 flush 'regionName' 分别对一个表或者一个 Region 进行 flush。

##### 7. 其他

执行 Compact 和 Split 之前，会进行一次 flush

---
参考链接
* [Hbase memstore 的刷写时机](https://cloud.tencent.com/developer/article/1005744)
* [HBase1.2官方文档](https://hbase.apache.org/1.2/book.html)


