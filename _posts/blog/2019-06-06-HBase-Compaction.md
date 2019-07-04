---
layout: post
title: HBase Compaction 机制
categories: [HBase]
description: HBase Compaction 机制
keywords: Compaction, HBase
---

Compaction 是 buffer->flush->merge 的 Log-Structured Merge-Tree 模型的关键操作

---

#### 介绍

![](/images/blog/2019-06-06-1.png){:height="80%" width="80%"}

一个表中的数据存储到 RS 上，RS 会管理实际存储表的数据的 region，每个 region上 每一个 ColumnFamily 
会有一个 MemStore。

写入的数据写入 MemStore 内存区，当内存缓冲区满了之后，会将数据刷新到磁盘，随时间推移，一个 Store 中的 StoreFile 数量将会增长

Compaction 是一个操作，通过merge，将会减少一个 Store 中的StoreFile的数量，从而提高读操作的性能。

Compaction 是资源密集型操作，将提高或者影响性能，取决于很多因素。

#### 类型

[官方Compaction介绍](http://hbase.apache.org/book.html#compaction)

合并有两种类型: 小合并（minor Compression）和大合并（major Compression）

Minor & Major Compaction的区别

1）Minor 操作只用来做部分文件的合并操作以及包括 minVersion = 0 并且设置 ttl 的过期版本清理，不做任何删除数据、多版本数据的清理工作。

2）Major 操作是对 region 下的 HStore 下的所有 StoreFile 执行合并操作，最终的结果是整理合并出一个文件。

![](/images/blog/2019-06-06-2.png){:height="80%" width="80%"}

#### 作用

主要起到如下几个作用:

1）合并文件, 提高读写数据的效率

2）清除删除、过期、多余版本的数据

3）文件本地化

RegionServer 最终目的是要实现数据本地化，才能够快速查找数据，HDFS 客户端默认拷贝三份数据副本，
其中第一份副本写到本地节点上，第二和第三份则写在不同机器的节点上 (RegionServer)；

Region 的拆分会导致 RegionServer 需要读取非本地的 StoreFile，
此时，HDFS 将会自动通过网络拉取数据，但通过网络读写数据相对地比本地读写数据的效率要低，要提升效率，
必须尽可能采用数据本地性，这也是为什么 HBase 要不定时地进行大合并和刷新把数据聚合在本地磁盘上来实现数据本地化，提升查询效率。   
其次，在用户查询数据的时候，将会减少查询文件的数量，提高HBase查询效率，减少HDFS上保持寻址所有小文件的压力。压缩可能需要大量资源，并且可能会因许多因素而有助于或阻碍性能。

#### 触发时机

在什么情况下会发生 Compaction 呢？

HBase 中可以触发 compaction 的因素有很多，最常见的因素有这么三种: MemStore Flush、后台线程周期性检查、手动触发。

1. MemStore Flush: 应该说 compaction 操作的源头就来自flush操作，MemStore flush会产生 HFile 文件，文件越来越多就需要 compact。因此在每次执行完 Flush 操作之后，都会对当前 Store 中的文件数进行判断，符合条件就会触发 compaction。    
需要说明的是，compaction 都是以 Store 为单位进行的，而在 Flush 触发条件下，整个 Region 的所有 Store 都会执行compact，所以会在短时间内执行多次 compaction。

2. 后台线程周期性检查: CompactionChecker 是RS上的工作线程(Chore)。后台线程 CompactionChecker 定期触发检查是否需要执行 compaction，设置执行周期是通过 threadWakeFrequency 指定。  
   大小通过 hbase.server.thread.wakefrequency 配置(默认10000)，然后乘以默认倍数 hbase.server.compactchecker.interval.multiplier (1000), 
   毫秒时间转换为秒。因此，在不做参数修改的情况下，CompactionChecker大概是2hrs 46mins 40sec 执行一次。
   
3. 手动触发：一般来讲，手动触发 compaction 通常是为了执行 major compaction，原因有三，其一是因为很多业务担心自动 major compaction 影响读写性能，因此会选择低峰期手动触发；   
其二也有可能是用户在执行完 alter 操作之后希望立刻生效，执行手动触发 major compaction API；   
其三是 HBase 管理员发现硬盘容量不够的情况下手动触发 major compaction 删除大量过期数据；  
无论哪种触发动机，一旦手动触发，HBase会不做很多自动化检查，直接执行合并。

#### Compaction 诱发因子

参数名 | 配置项 | 默认值
-|-|-
minFilesToCompact | hbase.hstore.compaction.min | 3 |
maxFilesToCompact | hbase.hstore.compaction.max | 10 | 
minCompactSize | hbase.hstore.compaction.min.size | 128 MB 即(memstoreFlushSize) | 
maxCompactSize | hbase.hstore.compaction.max.size | Long.MAX_VALUE | 

首先，对于 HRegion 里的每个 HStore 进行一次判断，needsCompaction() 判断是否足够多的文件触发了 Compaction 的条件。

![](/images/blog/2019-06-09-1.png){:height="80%" width="80%"}

条件为: HStore 中 StoreFiles 的个数 – 正在执行 Compacting 的文件个数 > minFilesToCompact

操作: 以最低优先级提交 Compaction 申请。

步骤1: 选出待执行Compact的 StoreFiles。由于在 Store 中的文件可能已经在进行 Compacting，因此，这里取出未执行 Compacting 的文件，将其加入到 Candidates 中。

步骤2: 执行 compactSelection 算法，在 Candidates 中选出需要进行 compact 的文件，并封装成 CompactSelection 对象当中。

1 选出过期的 StoreFiles。过滤minVersion=0，StoreFile.maxTimeStamp + store.ttl < now_timestamp。这意味着整个文件最大的时间戳的kv，都已经过期了，从而证明整个 StoreFile 都已经过期了。   
CompactSelection 如果发现这样的 StoreFile，会优先选择出来，作为 Min 然后提交给 Store 进行处理。

    应用重要参考: 根据应用的需求设置 TTL，并且设置 minVersions = 0，
    根据 selectCompation 优选清理过期不保留版本的文件的策略，
    这样会使得这部分数据在 CompactionChecker 的周期内被清理。
    
2 判断是否需要进行 major Compaction，这是很多判断条件的合成。

> * 用户强制执行major compaction
> * 长时间没有进行 compact。hbase.hregion.majorcompaction 设置的值，也就是判断上次进行 major Compaction 到当前的时间间隔，如果超过设置值，并且满足另外一个条件是 compactSelection.getFilesToCompact().size() < this.maxFilesToCompact (即候选文件数小于 hbase.hstore.compaction.max）。
> * Store中含有Reference文件，Reference文件是split region产生的临时文件，只是简单的引用文件，一般必须在compact过程中删除

    因此，通过设置 hbase.hregion.majorcompaction = 0 可以关闭 CompactionChecke 触发的 major compaction，但是无法关闭用户调用级别的 major Compaction。
 
如果不满足 major compaction条件，就必然为 minor compaction
   
3 过滤对于大文件进行 Compaction 操作。判断 fileToCompact 队列中的文件是否超过了 maxCompactSize，如果超过，则过滤掉该文件，避免对于大文件进行 compaction  

4 如果 Minor Compaction 方式执行。会检查经过过滤过的 fileToCompact 的大小是否满足 minFilesToCompact 最低标准，如果不满足，忽略本次操作。

确定执行的  Minor Compaction的操作时，会使用一个 smart 策略算法，从 filesToCompact 当中选出匹配的 StoreFiles。

HBase 主要有两种 minor 策略: RatioBasedCompactionPolicy  和ExploringCompactionPolicy

Ratio 策略是 0.94版本的默认策略，而 0.96 版本之后默认策略就换为了 Exploring 策略

**RatioBasedCompactionPolicy**

fileToCompact 队列从老到新

如果 fileSizes[start] > Math.max(minCompactSize, (long)(sumSize[start+1] * r )，那么继续 start++。这里 r 的含义是 compaction 比例，它有如下四个参数控制

配置项 | 默认值 | 含义
-|-|-
hbase.hstore.compaction.ratio | 1.2F |  |
hbase.hstore.compaction.ratio.offpeak | 5.0F | 与下面两个参数联用 | 
hbase.offpeak.start.hour | -1 | 设置 HBase offpeak 开始时间[0,23] | 
hbase.offpeak.end.hour | -1 | 设置 HBase offpeak 结束时间 [0,23] | 

如果默认没有设置offpeak时间的话，那么完全按照hbase.hstore.compaction.ration来进行控制。如下图所示，如果filesSize[i]过大，超过后面8个文件总和*1.2，那么该文件被认为过大，而不纳入minor Compaction的范围。

![](/images/blog/2019-06-09-2.png){:height="80%" width="80%"}

这样做使得 Compaction 尽可能工作在最近刷入hdfs的小文件的合并，从而使得提高 Compaction 的执行效率。

**ExploringCompactionPolicy**

该策略思路基本和RatioBasedCompactionPolicy相同，不同的是，Ratio策略在找到一个合适的文件集合之后就停止扫描了，而Exploring策略会记录下所有合适的文件集合，并在这些文件集合中寻找最优解。最优解可以理解为：待合并文件数最多或者待合并文件数相同的情况下文件大小较小，这样有利于减少compaction带来的IO消耗。
具体流程戳[这里](https://my.oschina.net/u/220934/blog/363270)

5) 通过 selectCompaction 选出的文件，加入到 filesCompacting 队列中。

6) 创建compactionRequest，提交请求。

#### 挑选合适的线程池

HBase 实现中有一个专门的线程 CompactSplitThead 负责接收 compact 请求以及 split 请求，
而且为了能够独立处理这些请求，这个线程内部构造了多个线程池：largeCompactions、smallCompactions以及splits等，
其中splits线程池负责处理所有的split请求，
largeCompactions和smallCompaction负责接收处理CR(CompactionRequest)，
其中前者用来处理大规模compaction，后者处理小规模compaction。

哪些 compaction 应该分配给 largeCompactions 处理，哪些应该分配给 smallCompactions 处理？是不是 Major Compaction 就应该交给largeCompactions线程池处理？不对。  
而是根据一个配置hbase.regionserver.thread.compaction.throttle的设置值(一般在hbase-site.xml没有该值的设置)   
而是采用默认值2 * minFilesToCompact * memstoreFlushSize，如果cr需要处理的storefile文件的大小总和，大于throttle的值，则会提交到largeCompactions线程池进行处理，反之亦然。

这里需要明白三点:

1 上述设计目的是为了能够将请求独立处理，提供系统的处理性能。

2 这两个线程池不是根据 CR 来自于 Major Compaction 和 Minor Compaction 来进行区分

3 largeCompactions 线程池和 smallCompactions 线程池默认都只有一个线程，用户可以通过参数 hbase.regionserver.thread.compaction.large 和 
hbase.regionserver.thread.compaction.small 进行配置

#### 执行 HFile 文件合并

上文一方面选出了待合并的HFile集合，一方面也选出来了合适的处理线程，万事俱备，只欠最后真正的合并。

合并流程说起来也简单，主要分为如下几步:

1. 分别读出待合并hfile文件的KV，并顺序写到位于./tmp目录下的临时文件中

2. 将临时文件移动到对应region的数据目录

3. 将compaction的输入文件路径和输出文件路径封装为KV写入WAL日志，并打上compaction标记，最后强制执行sync

4. 将对应region数据目录下的compaction输入文件全部删除

上述四个步骤看起来简单，但实际是很严谨的，具有很强的容错性和完美的幂等性：

1. 如果RS在步骤2之前发生异常，本次compaction会被认为失败，如果继续进行同样的compaction，上次异常对接下来的compaction不会有任何影响，也不会对读写有任何影响。唯一的影响就是多了一份多余的数据。

2. 如果RS在步骤2之后、步骤3之前发生异常，同样的，仅仅会多一份冗余数据。

3. 如果在步骤3之后、步骤4之前发生异常，RS在重新打开region之后首先会从WAL中看到标有compaction的日志，因为此时输入文件和输出文件已经持久化到HDFS，因此只需要根据WAL移除掉compaction输入文件即可

#### Compaction对写入也会有很大的影响

当写请求非常多，导致不断生成HFile，
但compact的速度远远跟不上HFile生成的速度，这样就会使HFile的数量会越来越多，
导致读性能急剧下降。  
为了避免这种情况，
在HFile的数量过多的时候会限制写请求的速度：在每次执行MemStore flush的操作前，
如果HStore的HFile数超过hbase.hstore.blockingStoreFiles （默认7），
则会阻塞flush操作hbase.hstore.blockingWaitTime时间，
在这段时间内，如果compact操作使得HStore文件数下降到回这个值，则停止阻塞。
另外阻塞超过时间后，也会恢复执行flush操作。这样做就可以有效地控制大量写请求的速度，
但同时这也是影响写请求速度的主要原因之一。

Compaction执行合并操作生成的文件生效过程，需要对Store的写操作加锁，阻塞Store内的更新操作，直到更新Store的storeFiles完成为止。   
Memstore 无法刷新磁盘，此时如果 memstore 的内存耗尽，客户端就会导致阻塞或者是超时。


#### 总结

在大多数情况下，Major 是发生在 storefiles 和 filesToCompact 文件个数相同，并且满足各种条件的前提下执行。

触发 major compaction 的可能条件有: major_compact 命令、majorCompact() API、region server自动运行。
（相关参数：hbase.hregion.majoucompaction 默认为24 小时、hbase.hregion.majorcompaction.jetter 默认值为 0.5 防止region server 在同一时间进行major compaction）

hbase.hregion.majorcompaction.jetter 参数的作用是：对参数hbase.hregion.majoucompaction 规定的值起到浮动的作用

minor compaction的运行机制要复杂一些，它由一下几个参数共同决定:

hbase.hstore.compaction.min: 默认值为 3，表示至少需要三个满足条件的store file时，minor compaction才会启动。对应的旧参数 hbase.hstore.compactionThreshold

hbase.hstore.compaction.max: 默认值为10，表示一次minor compaction中最多选取10个store file

hbase.hstore.compaction.min.size: 表示文件大小小于该值的store file 一定会加入到minor compaction的store file中

hbase.hstore.compaction.max.size: 表示文件大小大于该值的store file 一定会被minor compaction排除

hbase.hstore.compaction.ratio: 将store file 按照文件年龄排序（older to younger），minor compaction总是从older store file开始选择，如果该文件的size 小于它后面hbase.hstore.compaction.max 个store file size 之和乘以 该ratio，则该store file 也将加入到minor compaction 中。

另外，一般情况下，Major Compaction 时间会持续比较长，整个过程会消耗大量系统资源，对上层业务有比较大的影响。因此线上业务都会将关闭自动触发 Major Compaction 功能，改为手动在业务低峰期触发。

---
参考链接
* [HBase Compaction的前生今世－身世之旅](http://hbasefly.com/2016/07/13/hbase-compaction-1/?xiruzu=vpafs3)
* [HBase Compaction算法之ExploringCompactionPolicy](https://my.oschina.net/u/220934/blog/363270)
* [hbase compaction 简单介绍](https://blog.csdn.net/zhoudetiankong/article/details/68924319)
* [深入分析HBase Compaction机制](https://blog.csdn.net/hljlzc2007/article/details/10980949#commentsedit)
* [HBase什么时候作minor major compact](https://www.cnblogs.com/cxzdy/p/5368715.html)
* [HBase自动大合并脚本](https://blog.csdn.net/Ancony_/article/details/84789142)
* [HBase在线系统性能优化](https://blog.csdn.net/wodatoucai/article/details/71171348)


