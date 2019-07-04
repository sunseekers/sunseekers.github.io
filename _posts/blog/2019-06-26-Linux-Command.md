---
layout: post
title: Linux 命令记录
categories: [Linux]
description: 运维过程中所接触到的 Linux 命令
keywords: Linux
---

运维过程中所接触到的 Linux 命令

---

#### 前言

有人分享技术面试时说到面试官让其将用到的哪些linux命令，全写下来。

因此我也想总结下自己运维过程中所接触到的 Linux 命令

不会记录的很详细。想到记录什么就记录什么。

#### crontab

查看某个用户的 cron 任务

``` 
crontab -u username -l
```

查看所有用户的 cron 任务

``` 
# 以root用户执行
cat /etc/passwd | cut -f 1 -d : |xargs -I {} crontab -l -u {}
```

#### bc

bc命令是一种支持任意精度的交互执行的计算器语言。是Linux简单的计算器,能进行进制转换与计算。

执行浮点运算

参数 scale=3 是将bc输出结果的小数位设置为3位

``` 
echo "scale=3;10/3" | bc
3.333
```


进制转换

``` 
echo "obase=2;$255" | bc
11111111
```

