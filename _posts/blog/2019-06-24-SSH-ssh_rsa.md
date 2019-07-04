---
layout: post
title: SSH 使用私钥登陆
categories: [Linux]
description: SSH 使用私钥登陆
keywords: SSH, Linux
---

SSH 使用私钥登陆

---

#### 前言

今天大数据开发找到我，让我帮他到业务运维机器上 scp 一个文件到大数据的接口机上。

业务运维发了一个 key 文件给我，让我通过 key 文件上去拿。

我登陆服务器都是用密码登陆的，这种用 key 的方式不会。

赶紧某歌学习下，并记录下来

#### 私钥、公钥

在当前用户家目录下的 .ssh 可以看到如下文件

``` 
[root@zhazhahui .ssh]# ls
authorized_keys  id_rsa  id_rsa.pub  known_hosts
```

id_rsa 为私钥、id_rsa.pub 为公钥

对比同事发的内容，知道发给我的是私钥。

那就是他把私钥对应的公钥复制到了 authorized_keys 文件内了

我直接拿他给的私钥登陆即可

#### 步骤

1 导入私钥，将私钥文件放到当前登陆用户目录下的 .ssh 目录下。 

将发给我的私钥写入 ssh_rsa 文件

``` 
vim ssh_rsa
```

2. 指定私钥登陆

``` 
ssh -i .ssh/ssh_rsa  root@target.com
```

如果出现了下面这种情况

![](/images/blog/2019-06-24-1.png){:height="80%" width="80%"}

这是因为私钥文件权限太高了，比较不安全，所以被阻止，需要将ssh_rsa的权限设置低一些比如 0400

chmod 0400 .ssh/ssh_rsa

这样就可以登陆成功了

---
参考链接
* [SSH私用私钥登陆](https://www.cnblogs.com/demonxian3/p/8331545.html)
* [ssh public key private key 免密码](https://www.cnblogs.com/hellotracy/articles/5179985.html)
* [设置 SSH 通过密钥登录](https://www.runoob.com/w3cnote/set-ssh-login-key.html)






