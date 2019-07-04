---
layout: post
title: HBase 编译
categories: [HBase]
description: HBase 编译
keywords: keyword1, keyword2
---

HBase 源码调试后编译

---
#### 前言
说真的，一直说看源码看源码，但是压根不知道怎么入坑。

去官网下载源码下来就难道对着 API 文档一直看？？

好像不是很实用吧。估计大家看着看着就放弃了。

这里做点有成就感的事。

#### Patch

有时候我们下载的版本存在一些 bug。 这时就需要打补丁文件了。

可以到官网查看你当前版本需要打的补丁

![](/images/blog/2019-03-21-1.png)

在这里，你可以看到你所在版本修复的补丁。

![](/images/blog/2019-03-21-2.png)

根据编号。去 Apache 的 [JIRA](http://issues.apache.org/jira/) 找到对应的 issue。

这里我们以 HBASE-21592 为例。可以看到它有好几个 patch 文件。

![](/images/blog/2019-03-21-3.png)

我们把 master 的 patch 文件下载下来。并利用 IDEA 打入 HBase 源码中。

如何使用 IDEA 生成 patch 和使用 patch。请参考 [资料1][1]

#### 编译、打包

对代码进行修改之后，想将其验证。这时就需要编译、打包了。

在项目下执行 mvn clean package -DskipTests=true assembly:single

成功后，在 hbase-1.2.9/hbase-assembly/target 目录下有目标tar包。

![](/images/blog/2019-03-21-4.png)

hbase-1.2.9-bin.tar.gz 即为二进制tar包。将其部署即可。

但是大部分场景是针对已经运行的 HBase 集群。 因此这里将采取替换 jar 包的方式来实现。

假设修改的是 client 模块的代码。打包编译后可以在该模块的 target 目录下看到一个 jar 包

![](/images/blog/2019-03-21-5.png)

将其替换到线上的 HBase 集群的 lib 包下。

并重启 HBase 集群。

---
参考链接
* [HBase1.1.2编译](https://blog.csdn.net/rkjava/article/details/48789571)
* [hbase编译打包](https://blog.csdn.net/xuguokun1986/article/details/50755269)
* [Hbase测试&打补丁（HBASE-5415.patch）](https://www.cnblogs.com/bigfanofcpp/archive/2012/05/03/2871855.htm)

[1]: https://blog.csdn.net/lx_yoyo/article/details/75453708






