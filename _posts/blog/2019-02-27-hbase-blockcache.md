---
layout: post
title: HBase BlockCache 读缓存
categories: [HBase]
description: 走进 BlockCache
keywords: HBase, BlockCache, LRUBlockCache, BucketCache
---

BlockCache也称为读缓存，HBase会将一次文件查找的Block块缓存到Cache中，
以便后续同一请求或者邻近数据查找请求直接从内存中获取，避免昂贵的IO操作，重要性不言而喻。

---
#### HBase 缓存

HBase提供了2种类型的缓存结构：MemStore & BlockCache。其中 MemStore 是写缓存，BlockCache 是读缓存。

MemStore： HBase写数据首先写入MemStore之中，并同时写入HLog，待满足一定条件后将MemStore中数据刷到磁盘，可以很大提升HBase的写性能。
而且对读也很有提升，如果没有MemStore，读取刚写入的数据需要从文件中通过I/O查找。

BlockCache: HBase会将一次文件查找的Block块缓存到Cache中，以便后续同一请求或者相邻数据查找请求，可以直接从内存中获取，避免昂贵的IO操作。

**读取数据时，首先到memestore上读数据，找不到再到blockcahce上找数据，再查不到则到磁盘查找，并把读入的数据同时放入blockcache。**

#### Block Cache

BlockCache 是 RegionServer 级别的，一个 RegionServer 只有一个 BlockCache，在RegionServer启动的时候完成Block Cache的初始化工作。

HBase提供了两种不同的BlockCache实现，用于缓存从HDFS读出的数据。这两种分别为：
* 默认的，存在于堆内存的（on-heap）LruBlockCache
* 存在堆外内存的（off-heap）BucketCache

**当blockcache达到heapsize * hfile.block.cache.size * 0.85时，会启用淘汰机制。(有待查看源码验证)**

#### 缓存策略

常用的 BlockCache 包括 LruBlockCache，以及 CombinedBlockCache（LruBlockCache + BucketCache）。

使用缓存有以下三个策略，有多种配置缓存的机制：
> * LruBlockCache 缓存机制：把元数据和列族信息缓存在Java堆内存中。如果 BucketCache 机制没有启动时，默认是启动 LruBlockCache 的；
> * CombinedBlockCache 缓存机制：运用 LruBlockCache 和 BucketCache 两个缓存：当BucketCache启用时，INDEX/BLOOM块会保存于LRUBlockCache的堆内存，数据块（DATA blocks）会一直保存于BucketCache。这时启动 BucketCache 缓存机制后默认的操作；
> * 一级和二级缓存机制 (Raw L1+L2)：这个机制把元数据和列族信息缓存在LruBlockCache (一级缓存)，然后从 LruBlockCache 读取数据缓存在 BucketCache (二级缓存)，如果要启动这个缓存机制，要先在 hbase-site.xml 中配置 hbase.bucketcache.combinedcache.enabled=false，这个参数默认是 true；

**注意：从HBase 2.0.0 开始，L1与L2的概念便被弃用。第三种缓存方式只能在hbase 2.0.0之前，可以设置。**

补充：
CombinedBlockCache是一个LRUBlockCache和BucketCache的混合体。
BucketCache是阿里贡献的。LRUBlockCache中主要存储Index Block和Bloom Block，
而将Data Block存储在BucketCache中。
因此一次随机读需要首先在LRUBlockCache中查到对应的Index Block，然后再到BucketCache查找对应数据块

##### 1. 开启缓存

> * 当 BLOCKCACHE = false 和 IN_MEMORY = false，这意味著没有缓存；
> * 当 BLOCKCACHE = true 和 IN_MEMORY = false，这意味著使用 最近使用原则 Least Recently Used (LRU) 缓存；
> * 当 BLOCKCACHE = true 和 IN_MEMORY = true，这意味著缓存度是最長久的，有优先级别来缓存数据；


##### 2. 禁用缓存

可以在每一个列族上禁用读取缓存，使用 HBase Shell 来将读取时不需要缓存的列族 BLOCKCACHE 参数设置为 false，
使用 Java APi 在 scan 和 get 操作时使用 setCacheBlocks(false) 方法来禁用缓存，
但注意是的我们不能禁用 metadata 的缓存，因为元数据信息会频繁地被使用，**就算禁用了也回加载到缓存中**。
那应该在什么情况下可以禁用缓存，如果数据只是使用一次，不用反覆检索或者查找就不需要使用缓存。

永远不能禁用META块的缓存。由于[HBASE-4683](https://issues.apache.org/jira/browse/HBASE-4683)始终缓存索引和bloom块，
因此即使禁用BlockCache，也会缓存META块。

#### LRUBlockCache



HBase默认的BlockCache实现方案。Block数据块都存储在 JVM heap内，由JVM进行垃圾回收管理。
其使用一个ConcurrentHashMap管理BlockKey到Block的映射关系，
缓存Block只需要将BlockKey和对应的Block放入该HashMap中，查询缓存就根据BlockKey从HashMap中获取即可。

同时该方案采用严格的LRU淘汰算法，当Block Cache总量达到一定阈值之后就会启动淘汰机制，最近最少使用的Block会被置换出来。
在具体的实现细节方面，需要关注三点：

##### 1. 缓存分层策略

HBase在LRU缓存基础上，采用了缓存分层设计，将整个BlockCache分为三个部分：Single、Mutile和In-Memory。
> * Single：当我们只有一次读取的数据，这个级别的数据块是第一时间就会被挤出去
> * Mutile：读取多次数据的缓存，这个级别的数据块是当块中没有 SINGLE 级别的数据才会被挤出去
> * In-Memory：对列族属性中的 IN_MEMEORY 设置为 true，这个级别的数据块是最后才会被挤出去，Catalog 表是默认启动了 IN_MEMORY 表的特性；

将内存从逻辑上分为了三块, 分别占到整个BlockCache大小的25%、50%、25%。

需要特别注意的是，
<font color=#CD5C5C>
HBase系统元数据存放在InMemory区，因此设置数据属性InMemory = true需要非常谨慎，
确保此列族数据量很小且访问频繁，否则有可能会将hbase.meta元数据挤出内存，严重影响所有业务性能。
</font>

##### 2. LRU淘汰算法实现

系统在每次cache block时将BlockKey和Block放入HashMap后都会检查BlockCache总量是否达到阈值，如果达到阈值，就会唤醒淘汰线程对Map中的Block进行淘汰。
系统设置三个MinMaxPriorityQueue队列，分别对应上述三个分层，每个队列中的元素按照最近最少被使用排列，系统会优先poll出最近最少使用的元素，将其对应的内存释放。
可见，三个分层中的Block会分别执行LRU淘汰算法进行淘汰。


##### 3. LRU方案优缺点

LRU方案使用JVM提供的HashMap管理缓存，简单有效。
但随着数据从single-access区晋升到mutil-access区，基本就伴随着对应的内存对象从young区到old区 ，
晋升到old区的Block被淘汰后会变为内存垃圾，最终由CMS回收掉（Conccurent Mark Sweep，一种标记清除算法），
然而这种算法会带来大量的内存碎片，碎片空间一直累计就会产生臭名昭著的Full GC。
尤其在大内存条件下，一次Full GC很可能会持续较长时间，甚至达到分钟级别。
大家知道Full GC是会将整个进程暂停的（称为stop-the-wold暂停），
因此长时间Full GC必然会极大影响业务的正常读写请求。BucketCache方案才会横空出世。


#### BucketCache

BucketCache 大家自行阅读范欣欣的博客学习 [HBase BlockCache系列 － 探求BlockCache实现机制][1]

#### BucketCache 工作模式

BucketCache默认有三种工作模式：heap、offheap和file；这三种工作模式在内存逻辑组织形式以及缓存流程上都是相同的。
但是对应的最终存储介质不一样，也可以说对应的IOEngine不一样。

其中heap 和 offheap都是用内存作为最终存储介质，内存分配查询也都使用Java NIO ByteBuffer技术。

heap模式分配内存调用的是ByteBuffer.allocate方法，从JVM提供的heap区分配

offheap调用的是ByteBuffer.allocateDirect()方法，直接从操作系统分配。

这两种内存分配模式会对HBase性能产生一定影响，最大的是GC,和heap相比，offheap模式因为内存属于操作系统，所以基本不会产生CMS GC,也就在任何情况下都不会因为内存碎片导致触发Full GC

除此之外，在内存分配以及读取方面，两者性能也有不同，比如内存分配时heap模式需要先从操作系统分了配内存然后再拷贝到JVM Heap，相比offheap直接从操作系统分配内存更耗时；但是反过来

读取缓存是heap模式可以直接从JVM读取，而offheap需要首先从操作系统拷贝JVM heap在读取，后者显得更耗时

file模式和前面两者不同，它使用Fussion-IO或者SSD等作为存储介质，相比昂贵的内存，这样可以提供更大的存储容量，因此可以极大地提升缓存命中率。

#### BucketCache 配置

BucketCache配置使用

```
    <property>
      <name>hbase.bucketcache.ioengine</name>
      <value>offheap</value>
    </property>
    <property>
      <name>hfile.block.cache.size</name>
      <value>0.2</value>
    </property>
    <property>
      <name>hbase.bucketcache.size</name>
      <value>4196</value>
    </property>
```

hbase.bucketcache.size 在1.0 之前表示要提供给缓存的总堆内存大小的百分比，1.0 之后是BucketCache的总容量（兆字节）。默认值：0

![](/images/blog/2019-02-27-1.png)

#### 总结
因水平有限。大部分内容都是 copy 大神们的文章。我这只是把自己的理解汇总到一起。无意商业和彰显。

HBase 的官方文档 [BlockCache](http://hbase.apache.org/book.html#block.cache) 也是挺不错的资料。

找到一个翻译的中文博客，也可以参阅一下。[HBase Block Cache（块缓存)][2]



---
参考链接
* [第五章：大数据 の HBase 进阶](http://www.cnblogs.com/jcchoiling/p/7360110.html)
* [HBase BlockCache系列 － 探求BlockCache实现机制][1]
* [hbase缓存机制](https://blog.csdn.net/yx_keith/article/details/79138974)
* [HBase Block Cache（块缓存][2]
* [1-游走HBase的Block Cache](https://zhuanlan.zhihu.com/p/27639937)
* [HBase BlockCache系列 – 走进BlockCache](http://hbasefly.com/2016/04/08/hbase-blockcache-1/)
* [HBase BlockCache系列 － 性能对比测试报告](http://hbasefly.com/2016/05/06/hbase-blockcache-3/)
* [HBase最佳实践－内存规划](http://hbasefly.com/2016/06/18/hbase-practise-ram/)
* [HBase之缓存](https://blog.csdn.net/zhanglh046/article/details/78517812)


[1]: http://hbasefly.com/2016/04/26/hbase-blockcache-2/ "HBase BlockCache系列 － 探求BlockCache实现机制"
[2]: https://www.cnblogs.com/zackstang/p/10061379.html "HBase Block Cache（块缓存）"
