---
layout: post
title: HBase 自动大合并脚本
categories: [HBase]
description: HBase 自动大合并脚本
keywords: HBase, compaction
---

HBase 自动大合并脚本

---

#### 前言

HBASE 有默认的 major compaction 机制。

一般情况下，Major Compaction 时间会持续比较长，整个过程会消耗大量系统资源，对上层业务有比较大的影响。
因此线上业务都会将关闭自动触发 Major Compaction 功能，改为手动在业务低峰期触发。
我们可以使用major_compact命令手动合并

如果hbase中的表很多的时候，用脚本定时在凌晨时分触发。

#### 脚本

备注: 只使用了 major_compact 这个合并命令

``` 
#!/bin/bash
time_start=`date "+%Y-%m-%d %H:%M:%S"`
echo "开始进行HBase的大合并.时间:${time_start}"
  
str=`echo list | hbase shell | sed -n '$p'`
 
str=${str//,/ }
arr=($str)
length=${#arr[@]}
current=1
 
echo "HBase中总共有${length}张表需要合并."
echo "balance_switch false" | hbase shell | > /dev/null
echo "HBase的负载均衡已经关闭"
  
for each in ${arr[*]}
do
        table=`echo $each | sed 's/]//g' | sed 's/\[//g'`
        echo "开始合并第${current}/${length}张表,表的名称为:${table}"
        echo "major_compact ${table}" | hbase shell | > /dev/null
        let current=current+1
done
  
echo "balance_switch true" | hbase shell | > /dev/null
echo "HBase的负载均衡已经打开."
  
time_end=`date "+%Y-%m-%d %H:%M:%S"`
echo "HBase的大合并完成.时间:${time_end}"
duration=$($(date +%s -d "$finish_time")-$(date +%s -d "$start_time"))
echo "耗时:${duration}s"
```

#### Linux 定时 

使用 crontab 来业务低峰期启动。

每天凌晨3点30分执行 majorCompact.sh 脚本

``` 
30 3 * * * /bin/bash /root/bigdata/majorCompact.sh >>  /root/bigdata/majorCompact.log
```

