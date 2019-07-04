---
layout: post
title: Hive 映射 HBase 表方式
categories: [Hive]
description: Hive 映射 HBase 表方式
keywords: Hive, HBase
---

Hive 映射 HBase 表方式

--- 

#### HBase 表映射到 Hive 中

##### Hive 内部表

``` 
CREATE TABLE ods.s01_buyer_calllogs_info_ts (
    key string comment "hbase rowkey",
    buyer_mobile string comment "手机号",
    contact_mobile string comment "对方手机号",
    call_date string comment "发生时间",
    call_type string comment "通话类型",
    init_type string comment "0-被叫,1-主叫",
    other_cell_phone string comment "对方手机号",
    place string comment "呼叫发生地",
    start_time string comment "发生时间",
    subtotal string comment "通话费用",
    use_time string comment "通话时间（秒）"
)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'    
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,record:buyer_mobile,record:contact_mobile,record:call_date,record:call_type,record:init_type,record:other_cell_phone,record:place,record:start_time,record:subtotal,record:use_time")    
TBLPROPERTIES("hbase.table.name" = "s01_buyer_calllogs_info_ts");
```

Hive 每一个字段得映射到 HBase 的列簇的列。如果只想映射列簇，看第三种方式

建好表之后，进入 hbase shell 执行 list 能看到表 s01_buyer_calllogs_info_ts  

Hive drop 掉此表时，HBase 也被 drop

创建内部表可以不指定 hbase.table.name
 
##### Hive 外部表

``` 
# HBase 建表
create 'buyer_calllogs_info_ts', 'record', {SPLITS_FILE => 'hbase_calllogs_splits.txt'}
 
 
# Hive 建表
CREATE EXTERNAL TABLE ods.s10_buyer_calllogs_info_ts (
    key string comment "hbase rowkey",
    buyer_mobile string comment "手机号",
    contact_mobile string comment "对方手机号",
    call_date string comment "发生时间",
    call_type string comment "通话类型",
    init_type string comment "0-被叫,1-主叫",
    other_cell_phone string comment "对方手机号",
    place string comment "呼叫发生地",
    start_time string comment "发生时间",
    subtotal string comment "通话费用",
    use_time string comment "通话时间（秒）"
)    
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'    
WITH SERDEPROPERTIES ("hbase.columns.mapping" = ":key,record:buyer_mobile,record:contact_mobile,record:call_date,record:call_type,record:init_type,record:other_cell_phone,record:place,record:start_time,record:subtotal,record:use_time")    
TBLPROPERTIES("hbase.table.name" = "buyer_calllogs_info_ts");
```

从方式需要先在 HBase 建好表，然后在 Hive 中建表
 
Hive drop 掉表，HBase 表不会变

##### Hive 映射 HBase 的列簇

``` 
# 内部表
CREATE TABLE hbase_table_1 (
    value map<string,int>, 
    row_key int
)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ( "hbase.columns.mapping" = "cf:,:key");

# Hive insert 插入方式
INSERT OVERWRITE TABLE hbase_table_1 SELECT map(bar, foo), foo FROM pokes WHERE foo=98 OR foo=100;

# 外部表
CREATE EXTERNAL TABLE hbase_table_2 (
    value map<string,int>, 
    row_key int
)
STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
WITH SERDEPROPERTIES ( "hbase.columns.mapping" = "cf:,:key") 
TBLPROPERTIES("hbase.table.name" = "hbase_table_22");
```

在 HBase 查看结果

![](/images/blog/2019-06-18-2.png){:height="80%" width="80%"}

可以根据需求确定，详细参见[官方文档](https://cwiki.apache.org/confluence/display/Hive/HBaseIntegration)

#### 一个简单的测试

在查阅资料时看到一个很有意思的测试。感兴趣的可以自己阅读 [一个简单的测试：HBase-Hive 映射表](https://mp.weixin.qq.com/s/NelyoN5WZITwP-54KiqBfg)

测试结论: 
- 可以看到，同一张HBase表可以映射多张 Hive 外部表，并且查询列互不影响。
- 可见向不同 Hive 外部表中插入数据是不会影响HBase其他列的。
- insert into 与 insert overwrite 操作HBase-Hive映射外部表结果是一样的，且均是基于Hive表所属列进行更新，不会影响其他列的值。

#### 注意点

1、HBase 中的空 cell 在 Hive 中会补 null

2、Hive 和 HBase 中不匹配的字段会补 null

3、Bytes 类型的数据，建 Hive 表示加#b, 因为 HBase 中 double，int , bigint 类型以byte方式存储时，用字符串取出来必然是乱码。

4、其中:key代表的是 HBase 中的 rowkey, Hive 中也要有一个 key 与之对应, 不然会报错, cf 指的是 HBase 的列族, 
创建完后,会自动把 HBase 表里的数据同步到 Hive 中

---
参考链接
* [Hive映射HBase表的几种方式](https://www.cnblogs.com/ChouYarn/p/7986830.html)
* [hive与hbase数据类型对应关系](https://blog.csdn.net/jameshadoop/article/details/42162669)



