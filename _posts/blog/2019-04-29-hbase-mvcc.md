---
layout: post
title: HBase 行锁与多版本并发控制 (MVCC)
categories: [HBase]
description: HBase 行锁与多版本并发控制
keywords: HBase, MVCC
---

[MVCC (Multiversion Concurrency Control)][1]，即多版本并发控制技术，
它使得大部分支持行锁的事务引擎不再单纯的使用行锁来进行数据库的并发控制。

---

#### 前言

HBase 是 BigTable 的开源实现，事务模型也与 BigTable 一脉相承 – 仅支持行级别的事务。

Jeff Dean大神在接受采访时公开承认目前在技术领域最后悔的事情就是没有在BigTable中加入跨行事务模型，
以至于之后很多团队都在BigTable之上重复造各种各样的分布式事务轮子。

#### 为什么 HBase 需要并发控制

HBase 对需要并发控制的数据有什么保证？

答案是 HBase 保证每行的 ACID 特性。

ACID的含义: 
> * 原子性(Atomicity): 事务的所有操作要么全部成功要么全部失败。
> * 一致性(Consistency): 事务前后数据的完整性必须保持一致。
> * 隔离性(Isolation): 多个事务执行的时候相互之间不会产生影响彼此的执行。
> * 持久性(Durability): 一旦事务被提交，数据便被持久化。

传统的关系型数据库一般都提供了跨越所有数据的 ACID 特性；

为了性能考虑，HBase只提供了基于单行的ACID。

在讲解HBase的MVCC之前，先了解一下现有的隔离级别，SQL 标准定义了4种隔离级别: 
1. read uncommitted    读未提交
2. read committed      读已提交
3. repeatable read     可重复读
4. serializable        可串行化

**HBase 不支持跨行事务，目前只支持单行级别的 read uncommitted 和 read committed 隔离级别。**

#### HBase 事务原子性保证

HBase 的写入主要分三步
1. 先写 WAL 日志   
2. 先写入 memstore
3. 再 Sync wal

PS: 第一步没有刷盘，只是准备好 WAL 日志。这里你可以查看源码验证。

写入 memstore 异常很容易可以回滚，因此保证写入/更新原子性只需要保证写入WAL的原子性即可。

HBase 0.98 之前版本需要保证WAL写入的原子性并不容易，这由WAL的结构决定。

假设一个行级事务更新R行中的3列（c1, c2, c3），来看看之前版本和当前版本的WAL结构: 

之前版本 WAL 结构:

``` 
<logseq1-for-edit1>:<KeyValue-for-edit-c1>

<logseq2-for-edit2>:<KeyValue-for-edit-c2>

<logseq3-for-edit3>:<KeyValue-for-edit-c3>
```

每个KV都会形成一个WAL单元，这样一行事务更新多少列就会产生多少个 WAL 单元。

在将这些WAL单元append到日志文件的时候，一旦出现宕机或其他异常，就会出现部分写入成功的情况，
原子性更新就无法保证。

当前版本 WAL 结构:

``` 
<logseq#-for-entire-txn>:<WALEdit-for-entire-txn>

<logseq#-for-entire-txn>:<-1, 3, <Keyvalue-for-edit-c1>, <KeyValue-for-edit-c2>, <KeyValue-for-edit-c3>>
```

通过这种结构，每个事务只会产生一个WAL单元。这样就可以保证WAL写入时候的原子性。

#### HBase 事务一致性保证

HBase 是一个强一致性数据库，不是“最终一致性”数据库，官网给出的介绍

![](/images/blog/2019-05-06-1.png){:height="80%" width="80%"} 

> * 每个值只出现在一个 Region
> * 同一时间一个 Region 只分配给一个 RS
> * 行内的 mutation 操作都是原子的

HBase 降低可用性提高了一致性。

当某台 RS fail 的时候，它管理的 Region failover 到其他 RS 时，
需要根据 WAL（Write-Ahead Logging）来 redo (redolog，有一种日志文件叫做重做日志文件)，
这时候进行 redo 的 Region 应该是不可用的，所以 HBase 降低了可用性，提高了一致性。

设想一下，如果 redo 的 Region 能够响应请求，那么可用性提高了，
则必然返回不一致的数据(因为 redo 可能还没完成)，那么 HBase 就降低一致性来提高可用性了。

##### 1. HBase 的强一致性

先假设 HDFS 的副本存储策略，也就是dfs.replication的值为3（默认值就是3）

那么，HBase 的存储实例，也就是 HFile 也有3个副本。

那么当某一个 RS 崩溃时，并不用担心数据的丢失，因为数据是存储在 HDFS 上，
哪怕崩溃的 RS 所在的 DN 上有一个副本，在其他 DN 上也还有2个副本。

HFile 是已经持久化在磁盘上了，而 HFile 是不能改变的。

更新的数据放在 memstore 中，当 memstore 达到阈值就 flush 到磁盘上，生成 HFile 文件，
而一旦生成HFile就是不可改变的

##### 2. WAL的一致性

WAL 是 memstore 里的数据在 RS 崩溃时得以恢复的保证。WAL 的实现是 HLog，
HLog 也是存储在 HDFS 上的，所以 RS 崩溃了也不会导致 HLog 的丢失，它也有备份。

每一次更新都会调用写日志的 sync() 方法，这个调用强迫写入日志的更新都会被文件系统确认。

#### HBase 事务隔离性保证

##### 写写并发控制

###### 1. 为什么需要写写并发控制？

现在假设有两个并发写入请求同时进来，分别对同一行数据进行写入。

下图所示 RowKey 为 Greg，现在分别更新列族 info 下的 Company 列和 Role 列:

![](/images/blog/2019-04-30-1.png){:height="80%" width="80%"} 

如果没有任何并发控制策略的话，写入数据（先写WAL，再写memstore）可能会出现不同KV写入”交叉”现象，如下图所示

![](/images/blog/2019-04-30-2.png){:height="80%" width="80%"} 

这样的话，用户最终读取到的数据就会产生不一致，如下:

![](/images/blog/2019-04-30-3.png){:height="80%" width="80%"} 

###### 2. 如何实现写写并发控制？

实现写写并发其实很简单，只需要在写入（或更新）之前先获取行锁，
如果获取不到，说明已经有其他线程拿了该锁，就需要不断重试等待或者自旋等待，
直至其他线程释放该锁。

拿到锁之后开始写入数据，写入完成之后释放行锁即可。

这种行锁机制是实现写写并发控制最常用的手段。

最简单的方式是提供一个基于行的独占锁来保证对同一行写的独立性。

> * (0) 获取行锁
> * (1) 写WAL文件
> * (2) 更新MemStore：将每个cell写入到memstore
> * (3) 释放行锁

###### 3. 如何实现批量写入多行的写写并发？

HBase 支持批量写入（或批量更新），即一个线程同时更新同一个Region中的多行记录。

那如何保证当前事务中的批量写入与其他事务中的批量写入的并发控制呢？

思路还是一样的，使用行锁。

但这里需要注意的是必须使用两阶段锁协议: 

(1) 获取所有待写入（更新）行记录的行锁

(2) 开始执行写入（更新）操作

(3) 写入完成之后再统一释放所有行记录的行锁

不能更新一行锁定（释放）一行，多个事务之间容易形成死锁。

题外话: 关于两阶段锁协议可以看下 [两阶段锁协议][2] 和 范神的 [数据库事务系列－HBase行级事务模型][3] FARMERJOHN 的评论

支持一个 Region 的多行。跨 Region 多行事务不支持

###### 4. 范神疑惑

![](/images/blog/2019-04-30-4.png){:height="80%" width="80%"} 

针对这里。当初也没想明白，事后不知道在哪看到一个回答提到因为版本信息客户端可以修改为自己的时间。
因此 HBase 需要自己的机制来保障。 个人觉得这个回答是合理的。记录下来。


##### 读写并发控制

###### 1. 为什么需要读写并发控制？

现在我们通过在写入更新之前加锁、写入更新之后释放锁实现写写并发控制，
那读写之间是不是也需要一定的并发控制呢？如果不加并发控制，会出现什么现象呢？接着看下图:

![](/images/blog/2019-04-30-5.png){:height="80%" width="80%"} 

上图分别是两个事务更新同一行数据，现在假设第一个事务已经更新完成，
在第二个事务更新到一半的时候进来一个读请求，如果没有任何并发控制的话，
读请求就会读到不一致的数据，Company 列为 Restaurant，Role 列为 Engineer，如下图所示:

![](/images/blog/2019-04-30-6.png){:height="80%" width="80%"} 

可见，读写之间也需要一种并发控制来保证读取的数据总能够保持一致性，不会出现各种诡异的不一致现象。

###### 2. 如何实现读写并发控制？

实现读写并发最简单的方法就是仿照写写并发控制 – 加锁。
但几乎所有数据库都不会这么做，性能太差，对于读多写少的应用来说必然不可接受。

MVCC机制 – Mutil Version Concurrent Control 就闪亮登场了。

MVCC 又称为乐观锁，它在读取数据项时，不加锁；与 MVCC 相对，基于锁的并发控制机制称为悲观锁；

HBase 中 MVCC 机制实现主要分为两步：

(1) 为每一个写（更新）事务分配一个Region级别自增的序列号

(2) 为每一个读请求分配一个已完成的最大写事务序列号

```
对于写

w1 获取到行锁后，每个写操作立刻被分配一个 write number

w2 写中的每个 cell 存储其 write number

w3 写操作完成以后要申明其已经完成了

对于读

r1 每个写操作首先被分配一个读时间戳，叫做 read point

r2 每个 read point 被分配一个最大整数。这个最大整数是大于等于已完成 write number 的整数

r3 某个（行，列）组合的读取 read 返回数据单元格，其匹配（行，列）的写入编号是小于或等于读取点的最大值 read
```

示意图如下所示:

![](/images/blog/2019-04-30-7.png){:height="80%" width="80%"} 

上图中两个写事务分别分配了序列号1和序列号2，读请求进来的时候事务1已经完成，事务2还未完成，
因此分配事务1对应的序列号1给读请求。此时序列号1对本次读可见，序列号2对本次读不可见，读到的数据是:

![](/images/blog/2019-04-30-8.png){:height="80%" width="80%"} 

具体实现中，所有的事务都会生成一个Region级别的自增序列，并添加到队列中，
如下图最左侧队列，其中最底端为已经提交的事务，
队列中的事务为未提交事务。
现假设当前事务编号为15，并且写入完成（中间队列红色框框），
但之前的写入事务还未完成（序列号为12、13、14的事务还未完成），
此时当前事务必须等待，而且对读并不可见，
直至之前所有事务完成之后才会对读可见（即读请求才能读取到该事务写入的数据）。
如最右侧图，15号事务之前的所有事务都成功完成，
此时Read Point就会移动到15号事务处，表示15号事务之前的所有改动都可见。

![](/images/blog/2019-04-30-9.png){:height="80%" width="80%"}

``` 
为什么提交WriteNumber时，会出现调整后的ReadNumber小于本次写操作所分配的WriteNumber呢？

这是因为并发写入时，多个线程的写入速度是随机的，可能存在WriteNumber比较大（假设值为x）
的写入操作比WriteNumber较小的（假设值为y）写入操作先结束了，但此时并不能将ReadNumber的值调整为x，
因为此时还存在WriteNumber比x小的写入操作正在进行中，
ReadNumber为x即表示MemStore中所有WriteNumber小于或等于x的数据都可以被读取了，
但实际上还有值没有被写入完成，可能会出现数据不一致的情况，
所以如果写队列中WriteNumber比较大的写入操作如果较快的结束了，
则需要进行相应的等待，直到写队列中它前面的那些写入操作完成为止。
``` 

自增序列就是 SequenceId

MVCC 的精髓是写入的时候分配递增版本信息（SequenceId），
读取的时候分配唯一的版本用于读取可见，比之大的版本不可见。

这里需要注意版本必须递增，而且版本递增的范围一定程度上决定了事务是什么事务，
比如 HBase 是 Region 级别的递增版本，那么事务就是 Region 级别事务。
MySQL 中版本是单机递增版本，那么 MySQL 事务就支持单机跨行事务。
Percolator 中版本是集群递增版本，那么 Percolator 事务就是分布式事务。

#### HBase 事务持久性保证

HBase 事务持久化可以理解为 WAL 持久化。

HBase 中可以通过设置 WAL 的持久化等级决定是否开启 WAL 机制、以及 HLog 的落盘方式。

1. SKIP_WAL：只写缓存，不写HLog日志。这种方式因为只写内存，因此可以极大的提升写入性能，但是数据有丢失的风险。在实际应用过程中并不建议设置此等级，除非确认不要求数据的可靠性。

2. ASYNC_WAL：异步将数据写入HLog日志中。

3. SYNC_WAL：同步将数据写入日志文件中，需要注意的是数据只是被写入文件系统中，并没有真正落盘。

4. FSYNC_WAL：同步将数据写入日志文件并强制落盘。最严格的日志写入等级，可以保证数据不会丢失，但是性能相对比较差。目前实现中 FSYNC_WAL 并没有实现！

用户可以通过客户端设置WAL持久化等级。默认如果用户没有指定持久化等级，HBase 使用 SYNC_WAL 等级持久化数据。

#### 外话

HBase 也同样支持 read uncommitted 级别，也就是我们在查询的时候将 scan 的 MVCC 值设置为一个超大的值，大于目前所有申请的 MVCC 值，
那么查询时同样会返回正在写入的数据。

![](/images/blog/2019-05-06-2.png){:height="80%" width="80%"}

![](/images/blog/2019-05-06-3.png){:height="80%" width="80%"}

![](/images/blog/2019-05-06-4.png){:height="80%" width="80%"}

获取了 readPoint，注意只有在 READ_COMMITTED 下，
readpoint 才是生效的，然后会对 memstore 和 storeFile 进行查询，
过滤掉大于这次 readPoint 的数据，防止读取到还没提交成功的数据，也就是 READ_COMMITTED 读已提交。

如果是 READ_UNCOMMITTED 则 readPoint 会返回 Long.MAX_VALUE，就有会读到最新的的数据包括没提交的

总结下MVCC算法下写操作的执行流程: 
> * (0) 获取行锁
> * (0a) 获取写序号
> * (1) 写WAL文件
> * (2) 更新MemStore：将每个cell写入到 memstore，同时附带写序号
> * (2a) 申明以写序号完成操作
> * (3) 释放行锁

WAL写入的时候能保证一行数据的原子性了，为什么还需要加写锁？是因为memstore会有并发写的问题吗？

整个写的过程由很多子步骤 对同一行数据更新 在memstore层面也要保证原子性

---
参考链接
* [两阶段锁协议][2]
* [数据库事务系列－HBase行级事务模型][3]
* [HBase － 数据写入流程解析][4]
* [HBase 强一致性详解](https://blog.csdn.net/ruichaoo/article/details/78961770)
* [HBase中的多版本并发控制](https://hellokangning.github.io/en/post/multiversion-concurrency-control-in-hbase/#where-mvcc-is-used)
* [大数据技术-HBase：HBase并发版本控制MVCC](https://blog.csdn.net/huanggang028/article/details/46047927)
* [HBase之Java API](https://blog.csdn.net/javaman_chen/article/details/7220216)
* [官方文档acid-semantics](http://hbase.apache.org/acid-semantics.html)
* [HBase 事务和并发控制机制原理](http://www.codeceo.com/article/hbase-transaction.html)

[1]: https://en.wikipedia.org/wiki/Multiversion_concurrency_control
[2]: https://www.cnblogs.com/zszmhd/p/3365220.html
[3]: http://hbasefly.com/2017/07/26/transaction-2/
[4]: http://hbasefly.com/2016/03/23/hbase_writer/