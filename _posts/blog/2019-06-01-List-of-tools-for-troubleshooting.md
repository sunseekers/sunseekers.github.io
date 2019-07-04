---
layout: post
title: 排查问题的工具清单
categories: [Tools]
description: some word here
keywords: keyword1, keyword2
---

Content here

---

#### Linux命令类

##### tail

最常用的tail -f

``` 
tail -300f shopbase.log # 倒数300行并进入实时监听文件写入模式
```

##### grep

在文件中搜索字符串匹配的行并输出

```
grep forest f.txt     # 文件查找
grep forest f.txt cpf.txt # 多文件查找
grep 'log' /home/admin -r -n # 目录下查找所有符合关键字的文件
grep ERROR */* 搜索当前路径下所有的文件
cat f.txt | grep -i shopbase  #  -i 不区分大小写	-v 排除指定字符串
grep 'shopbase' /home/admin -r -n --include *.{vm,java} # 指定文件后缀
grep 'shopbase' /home/admin -r -n --exclude *.{vm,java} # 反匹配
seq 10 | grep 5 -A 3    #上匹配  显示匹配后和它后面的3行
seq 10 | grep 5 -B 3    #下匹配  显示匹配行和它前面的3行
seq 10 | grep 5 -C 3    #上下匹配，平时用这个就妥了  匹配行和它前后各3行
cat f.txt | grep -c 'SHOPBASE' # -c 统计文件中某字符串的个数
```

##### awk

内建变量

NR: NR表示从awk开始执行后，按照记录分隔符读取的数据次数，默认的记录分隔符为换行符 
因此**默认的就是读取的数据行数**，NR可以理解为Number of Record的缩写。

FNR: 在awk处理多个输入文件的时候，在处理完第一个文件后，NR并不会从1开始，而是继续累加   
因此就出现了FNR，每当处理一个新文件的时候，FNR就从1开始计数，FNR可以理解为File Number of Record。

NF: NF表示目前的行记录用分割符分割的字段的数目，NF可以理解为Number of Field。

基本命令  
默认分隔符为空白字符(tab、空格)

``` 
awk '{print $4,$6}' f.txt  # 第4、5列
awk '{print NR,$0}' f.txt cpf.txt   # 以行号输出，行号累加、$0 表示整行、多个文件
awk '{print FNR,$0}' f.txt cpf.txt # 每个文件的行号从1开始计算
awk '{print FNR,FILENAME,$0}' f.txt cpf.txt  # FILENAME 多文件匹配时输出该行所在的文件名
awk '{print FILENAME,"NR="NR,"FNR="FNR,"$"NF"="$NF}' f.txt cpf.txt  # NF 分割字段数
echo 1:2:3:4 | awk -F: '{print $1,$2,$3,$4}' # -F 指定分割符
```

匹配

``` 
awk '/ldb/ {print}' f.txt   #匹配ldb
awk '!/ldb/ {print}' f.txt  #不匹配ldb
awk '/ldb/ && /LISTEN/ {print}' f.txt   #匹配ldb和LISTEN
awk '$5 ~ /ldb/ {print}' f.txt #第五列匹配ldb
```


##### find

``` 
sudo -u admin find /home/admin /tmp /usr -name "*.log"  (多个目录去找)
find . -iname "*.txt" (大小写都匹配)
find . -type d  (当前目录下的所有子目录)
find /usr -type l (目录下所有的符号链接)
find /usr -type l -name "z*" (目录下符合z开头的符号链接)
find /usr -type l -name "z*" -ls (符号链接的详细信息 eg:inode,目录)
find /home/admin -size +250000k(超过250000k的文件，当然+改成-就是小于了)
find /home/admin -tyep f -perm 777 (按照权限查询文件)
find /home/admin -tyep f -perm 777 -ls (按照权限查询文件)
find /home/admin -type f -perm 777 -exec ls -l {} \; (按照权限查询文件)
find /home/admin -atime -1  1天内访问过的文件
find /home/admin -ctime -1  1天内状态改变过的文件    
find /home/admin -mtime -1  1天内修改过的文件
find /home/admin -amin -1  1分钟内访问过的文件
find /home/admin -cmin -1  1分钟内状态改变过的文件    
find /home/admin -mmin -1  1分钟内修改过的文件
find /home/admin -newer while2 -type f -exec ls -l {} \; # 搜索比 while2 文件更新的且类型是普通文件的文件，搜索到时打印该文件的信息
```

##### top
top除了看一些基本信息之外，剩下的就是配合来查询进程的各种问题了

``` 
ps -ef | grep java
top -H -p pid
```

获得线程10进制转16进制后jstack去抓看这个线程到底在干啥 [使用堆栈进行问题排查](https://lihuimintu.github.io/2019/06/03/Occupying-CPU-high/)


#### Java 七板斧

##### jps

``` 
jps -mlvV
```

![](/images/blog/2019-06-05-1.png){:height="80%" width="80%"} 

如果遇到 process information unavailable 情况。到 jdk 的安装路径下运行命令 bin/jps

##### jstack

```
jstack 2815
```

##### jinfo

可看系统启动的参数，如下

``` 
jinfo 30670
jinfo -flags  30670
```

##### jmap

两个用途

查看堆的情况

``` 
jmap -heap 30670
```

![](/images/blog/2019-06-05-2.png){:height="80%" width="80%"} 

dump

导出整个JVM 中内存信息, 生成堆转储文件   
使用 jhat 分析堆情况

``` 
jmap -dump:live,format=b,file=/tmp/heap2.bin 2815
jmap -dump:format=b,file=/tmp/heap3.bin 2815
```



查看 JVM 堆中对象详细占用情况

``` 
jmap -histo 2815
jmap -histo 2815 | head -10  # 前10
```

##### jstat

jstat参数众多，但是使用一个就够了

``` 
jstat -gcutil 2815 1000 
```

#### VM options

你的类到底是从哪个文件加载进来的

```
-XX:+TraceClassLoading
结果形如[Loaded java.lang.invoke.MethodHandleImpl$Lazy from D:programmejdkjdk8U74jrelib
t.jar]
```

应用挂了输出dump文件

``` 
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/home/admin/logs/java.hprof
```

#### plugin of intellij idea

##### key promoter

快捷键一次你记不住，多来几次你总能记住了吧？

##### maven helper

#### 其他

##### dmesg

如果发现自己的java进程悄无声息的消失了，几乎没有留下任何线索，那么dmesg一发，很有可能有你想要的。

``` 
sudo dmesg|grep -i kill|less
```

去找关键字oom_killer。找到的结果类似如下:

``` 
[6710782.021013] java invoked oom-killer: gfp_mask=0xd0, order=0, oom_adj=0, oom_scoe_adj=0
[6710782.070639] [<ffffffff81118898>] ? oom_kill_process+0x68/0x140 
[6710782.257588] Task in /LXC011175068174 killed as a result of limit of /LXC011175068174 
[6710784.698347] Memory cgroup out of memory: Kill process 215701 (java) score 854 or sacrifice child 
[6710784.707978] Killed process 215701, UID 679, (java) total-vm:11017300kB, anon-rss:7152432kB, file-rss:1232kB
```

以上表明，对应的java进程被系统的OOM Killer给干掉了，得分为854.

OOM killer（Out-Of-Memory killer），该机制会监控机器的内存资源消耗。   
当机器内存耗尽前，该机制会扫描所有的进程（按照一定规则计算，内存占用，时间等），
挑选出得分最高的进程，然后杀死，从而保护机器。

dmesg日志时间转换公式:
log实际时间=格林威治1970-01-01+(当前时间秒数-系统启动至今的秒数+dmesg打印的log时间)秒数：

``` 
date -d "1970-01-01 UTC `echo "$(date +%s)-$(cat /proc/uptime|cut -f 1 -d' ')+12288812.926194"|bc ` seconds"
```

剩下的，就是看看为什么内存这么大，触发了OOM-Killer了。

#### RateLimiter

想要精细的控制QPS? 比如这样一个场景，你调用某个接口，对方明确需要你限制你的QPS在400之内你怎么控制？这个时候 RateLimiter 就有了用武之地。详情可移步http://ifeve.com/guava-ratelimite

---
参考链接
* [阿里员工排查问题的工具清单，总有一款适合你！](https://mp.weixin.qq.com/s/eDL4-XJZO4Y8Hs4U0bCcnQ)
* [运维技巧之逼格高又实用的Linux命令](https://mp.weixin.qq.com/s/f_yEBXHjC_v-PlcrFi9ryQ)
* [java命令--jstack 工具](https://www.cnblogs.com/kongzhongqijing/articles/3630264.html)


