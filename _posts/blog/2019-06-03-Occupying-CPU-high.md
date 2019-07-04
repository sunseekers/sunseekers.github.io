---
layout: post
title: 使用堆栈进行问题排查
categories: [Linux]
description: 使用堆栈进行问题排查
keywords: Linux, CPU
---

使用堆栈进行问题排查，如机器占用 CPU 高问题排查、死锁

---

#### 前言

经常需要对 Java 的服务进程进行一定的问题排查处理

遇到了一次 HBase 集群一直出现某台服务器负载过高。查看后发现是 CPU 负载高。

#### 定位方法

1 使用top命令查看 CPU使用率高的进程号

2 查看此进程中占用CPU高的线程   
使用命令 
    
    top -H -p <PID> 
    
即可打印出某进程 <PID> 下的线程的CPU耗时信息   

一般某个进程如果出现问题，是因为某个线程出现问题了，获取查询到的占用CPU最高的线程号   
或者使用命令

    ps -mp <PID> -o THREAD,tid,time | sort -rn   

观察回显可以得到CPU最高的线程号。

3 获取出现问题的线程的堆栈。
java 问题使用 jstack 工具是最有效，最可靠的。
到java/bin目录下有 jstack工具，获取进程堆栈，并输出到本地文件。

    jstack <PID> > allstack.txt

获取线程堆栈，并输出到本地文件。

4 将需要的线程ID转换为16进制格式
   
    printf "%x\n" <PID>

回显结果为线程ID，即 TID。

5 使用命令获得TID,并输出到本地文件。

    jstack <PID> | grep <TID> > Onestack.txt

如果只是在命令行窗口查看，可以使用命名：

    jstack <PID> | grep <TID> -A 30

-A 30意思是显示30行。


#### 无业务情况下，RegionServer占用CPU高

##### 1. 问题背景与现象

无业务情况下，RegionServer占用CPU较高。

##### 2. 原因分析

通过 Top 命令获取 RegionServer 的进程使用 CPU 情况信息，占用 CPU 较高。

根据 RegionServer 的进程编号，获取线程使用 CPU 情况。

top -H -p 12345（根据实际RegionServer的进程ID进行替换）

具体如下图所示，发现部分线程CPU使用率均达到80%。

![](/images/blog/2019-06-03-1.png){:height="80%" width="80%"} 


根据RegionServer的进程编号，获取线程堆栈信息。

jstack 12345 >allstack.txt （根据实际RegionServer的进程ID进行替换）

将需要的线程ID转换为16进制格式：
printf "%x\n" 30648

输出结果TID为77b8。

根据输出16进制TID，在线程堆栈中进行查找，发现在执行compaction操作。

![](/images/blog/2019-06-03-3.png){:height="80%" width="80%"} 

对其它线程执行相同操作，发现均为compactions线程。

![](/images/blog/2019-06-03-2.png){:height="80%" width="80%"} 


---
参考链接
* [无业务情况下，RegionServer占用CPU高](http://support-it.huawei.com/docs/zh-cn/fusioninsight-all/maintenance-guide/zh-cn_topic_0046294881.html)


