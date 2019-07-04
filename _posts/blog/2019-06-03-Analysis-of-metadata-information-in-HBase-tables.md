---
layout: post
title: HBase 表信息解析
categories: [HBase]
description: HBase 表元数据信息解析
keywords: HBase
---

HBase 表元数据信息解析

---

#### 表元数据


``` 
desc 'dimensoft:user', //namespace:tableName
    {
        NAME => 'info', //列族
 
        DATA_BLOCK_ENCODING => 'NONE', //数据块编码方式设置
        //参见: http://hbase.apache.org/book.html#compression
        //http://hbase.apache.org/book.html#data.block.encoding.enable
 
        BLOOMFILT => 'ROW', //参见：http://hbase.apache.org/book.html#bloom.filters.when
 
        REPLICATION_SCOPE => '0', //配置HBase集群replication时需要将该参数设置为1.
 
        //参见：http://blog.cloudera.com/blog/2012/08/hbase-replication-operational-overview/?utm_source=tuicool
        'REPLICATION_SCOPE is a column-family level attribute
user has to alter each column family with the alter command as
shown above, for all the column families he wants to replicate.'
 
        VERSIONS => '1', //设置保存的最大版本数
 
        COMPRESSION => 'NONE', //设置压缩算法
 
        MIN_VERSIONS => '0', //最小存储版本数
 
        TTL => 'FOREVER', //参见：http://hbase.apache.org/book.html#ttl
        'ColumnFamilies can set a TTL length in seconds, and HBase
        reached. This applies to all versions of a row - even the current one.
        The TTL time encoded in the HBase for the row is specified in
        UTC.'
 
        KEEP_DELETED_CELLS => 'false', //参见：http://hbase.apache.org/book.html#cf.keep.deleted
 
        BLOCKSIZE => '65536', //设置HFile数据块大小（默认64kb）
 
        IN_MEMORY => 'false',//设置激进缓存，优先考虑将该列族放入块缓存中,即放入BlockCache，
                             //针对随机读操作相对较多的列族可以设置该属性为true，不能设置meta为false，因为meta表经常使用
 
        BLOCKCACHE => 'true' //数据块缓存属性
    }
```


#### TTL 
 
在minor compaction时删除仅包含过期行的存储文件。设置hbase.store.delete.expired.storefile为false禁用此功能。将最小版本数设置为0以外也会禁用此功能。


#### 数据块编码

数据块编码是 HBase 的一个特性，即 key 会根据前一个 key 进行编码和压缩。

其中一个编码选项（FAST_DIFF）让hbase 只存储当前 key 和前一个 key 不同的地方。

HBase 独立存储每个单元，包括 key 和 value。当一行有多个 cell 时，为每个 cell 写入相同的 key 将会消耗大量空间，启用数据块编码可以节省大量空间。

多数情况下启动数据块编码是有用的。



#### MinVersion

used when timeToLive is set
     
如果HBase中的表设置了TTL的时候，MinVersion才会起作用。
 
a）MIN_VERSION > 0时：

Cell至少有MIN_VERSION个最新版本会保留下来。这样确保在你的查询以及数据早于TTL时有结果返回。

b）MIN_VERSION = 0时：

Cell中的数据超过TTL时间时，全部清空，不保留最低版本。
