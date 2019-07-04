---
layout: post
title: Scala 递归修改 HDFS 路径权限
categories: [Spark]
description: Scala 外部命令工作的原理和使用示例
keywords: spark, scala
---

通过scala代码可以直接调用JVM的系统功能或者OS的系统功能或者OS的shell命令，这可以极大的简化外部功能的实现

---

#### 前言
写了一个 spark 的文件操作的代码。遇到一个权限问题。 

HDFS 提供 API 修改某个路径的权限。

```scala
val sparkConf = new SparkConf()
val sc = new SparkContext(sparkConf)

val fs: FileSystem =  FileSystem.get(sc.hadoopConfiguration)
fs.setPermission(new Path("/user/hadoop/data"),new FsPermission("777"))
```

但是没有递归修改某个路径的权限。

![](/images/blog/2019-03-07-1.png)

最先想法是通过递归的方式去一个个路径改权限。

同事给了一个 idea ，说可以试试代码调用外部命令来直接使用 hadoop fs -chmod -R 777 path 的方式来实现。

#### 原理

scala外部命令工作的原理：

通过scala代码可以直接调用JVM的系统功能或者OS的系统功能或者OS的shell命令，这可以极大的简化外部功能的实现，因为这种工作方式实际上是复用JVM和OS本身提供的功能，作为scala本身是直接把结果拿过来，其实这是代码模块化和软件复用的一种表现。

scala是基于JVM进程的，scala程序运行的时候会运行在JVM进程中，而JVM进程是OS的一个普通进程，通过JVM可以直接和OS进行交互，而OS有例如启动进程等功能，所以scala程序可以通过JVM去调用外部的功能。

#### 示例

spark-shell
```scala
import sys.process._

"ls -al"!
```

代码
```scala
import sys.process._

/**
  * scala外部命令
  */
object CMD {
  def main(args: Array[String]): Unit = {
    "hadoop fs -chmod -R 777 /user/hadoop/data"!
    
    val tmp = Process(s"""ls""").!!
    
    println(tmp)
  }
}
```

![](/images/blog/2019-03-13-1.png)

---
参考链接
* [scala外部命令工作的原理和使用示例](https://blog.csdn.net/u013063153/article/details/53502788)
* [Spark中直接操作HDFS](https://www.cnblogs.com/maxigang/p/10033159.html)
* [spark读取hdfs上的文件和写入数据到hdfs上面](https://www.cnblogs.com/heml/p/6186109.html)
* [scala中可以执行外部命令Process](https://www.cnblogs.com/zuizui1204/p/9543928.html)
* [使用scala.sys.process包和系统交互](https://fuliang.iteye.com/blog/1127449)