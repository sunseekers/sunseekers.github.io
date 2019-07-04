---
layout: post
title: HDFS 块损坏
categories: [HDFS]
description: HDFS 块损坏
keywords: HDFS, block
---

发现测试集群HDFS报丢失块的告警。 对块进行修复

---

#### 前言

发现测试集群HDFS报丢失块的告警。 

![](/images/blog/2019-03-14-4.png)

如果块损坏过多，超过设置的百分比，NameNode 会进入安全模式。需要退出安全模式处理

#### 处理

解决方法：
* 如果文件不重要，可以直接删除此文件；或删除后重新复制一份到集群中
* 如果不能删除，需要从上面命令中找到发生在哪台机器上，然后到此机器上查看日志。

先确认集群有没有datanode宕机

```
sudo -u hdfs hdfs dfsadmin -report
```

查看丢失块的信息

``` 
# 需要hdfs权限权限操作。如果没有hdfs 账号，则在命令前加 sudo -u hdfs ，以hdfs权限运行该命令

# 检查整个文件系统
hdfs fsck /   

# 查看损坏块的信息
hdfs fsck -list-corruptfileblocks   

# 查看损坏块的信息  -locations位置信息  -blocks各个块的信息   -files显示文件信息，包括文件名称，大小，块数量和健康状况（是否有缺失的块）
hdfs fsck /tmp/sort-data/part-r-00016 -locations -blocks -files   
 
 
# 如果hadoop不能自动恢复，则只能删除 corrupted blocks;
# 此方式会将丢失的块全部删除
hdfs fsck  / -delete   
```
![](/images/blog/2019-03-14-5.png)

![](/images/blog/2019-03-14-6.png)

#### HDFS block丢失过多进入安全模式（Safe mode）的解决方法

前面介绍的是简单的块损坏。 后面遇到一次丢失块比例高达 13% 的测试环境。

由于系统断电，内存不足等原因导致 dataNode 丢失超过设置的丢失百分比，系统自动进入安全模式。

解决办法就是退出安全模式。清理损坏的块。

**注意: 这种方式会出现数据丢失，损坏的block会被删掉** 请慎重

退出安全模式：

![](/images/blog/2019-03-14-7.png)

执行健康检查，删除损坏掉的block。  hdfs fsck  /  -delete

---
参考链接
* [查看修复HDFS中丢失的块 &HDFS block丢失过多进入安全模式（safe mode）的解决方法](https://blog.csdn.net/mnasd/article/details/82143653)
* [查看修复HDFS中丢失的块](https://www.cnblogs.com/admln/p/5822004.html)









