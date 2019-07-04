---
layout: post
title: HBase 源码调试
categories: [HBase]
description: HBase 源码调试
keywords: HBase
---

为了更深入的了解HBase的工作流程，对源码进行跟踪调试是一个很好的办法。

---

#### 前言

为了更深入的了解HBase的工作流程，对源码进行跟踪调试是一个很好的办法。

#### 下载源码

这里使用的版本是社区版的 1.2.6

下载网址 http://archive.apache.org/dist/hbase/

#### 编译HBase源码

网上很多教程说需要先编译Hadoop源码才能编译HBase，但是本人亲测，如果只是在单机节点测试，即使用standalone模式是不需要事先编译Hadoop源码的。

在编译源码前，需要准备JDK，Maven等工具。请自行安装

jdk，版本1.8

maven ，版本是3.3.9

下载记得添加环境变量。

准备好这些工具就可以开始编译了，直接去HBase源文件所在的目录。

执行下方命令编译
``` 
mvn clean package -DskipTests=true

# 忽略
## mvn clean install -DskipTests=true 
```

编译成功后仍然在当前目录执行mvn idea:idea，这样是为了生成idea所需要的.project文件。

两次都需要看到 BUILD SUCCESS 才行。

![](/images/blog/2019-03-19-2.png)

接下来就是在idea里引入HBase。这一project即可。


#### HMaster 

Debug Configuration设置

为了能在单机节点上运行HBase，我们需要在conf/hbase-site.xml下设置相关数据的存储目录。
即在hbase-site.xml里加入以下配置信息。

```xml
<configuration>
    <property>
        <name>hbase.rootdir</name>
        <value>file:///Users/tu/Public/hbase</value>
    </property>
    <property>
        <name>hbase.defaults.for.version.skip</name>
        <value>true</value>
    </property>
</configuration>
```

其中，hbase.rootdir的value是用来存放HBase数据的目录，你不需要事先创建hbase目录，
只需要事先保证/Users/tu/Public目录存在就行。当然，你也可以自己配置成别的目录。

hbase.defaults.for.version.skip 是避免出现后文中说的异常情况。

HBase架构里有一个HMaster是负责管理整个集群的。所以我们程序的起点也就在 HMaster 这个类里面

```
org.apache.hadoop.hbase.master.HMaster

-Dlog4j.configuration=file:/Users/tu/IdeaProjects/hbase-1.2.6/conf/log4j.properties
```

![](/images/blog/2019-03-19-3.png)

HMaster 应该就可以启动了。当在 Console 里没看见错误，就意味着 HMaster 成功启动了，你也可以在浏览器中输入http://localhost:16010 来验证，

类似的，我们也可以把 arguments 改成 stop，新增一个让 HMaster 结束的 JAVA Application。

![](/images/blog/2019-03-19-4.png)

查看 Web UI 验证下

![](/images/blog/2019-04-26-1.png)

#### Shell

当然，光有一个HMaster我们无法操控HBase，所以接下来是HBase shell的配置。

``` 
org.jruby.Main

-Dlog4j.configuration=file:/Users/tu/IdeaProjects/hbase-1.2.6/conf/log4j.properties
-Dhbase.ruby.sources=/Users/tu/IdeaProjects/hbase-1.2.6/hbase-shell/src/main/ruby
 
/Users/tu/IdeaProjects/hbase-1.2.6/bin/hirb.rb
```

![](/images/blog/2019-03-19-5.png)

这是hbase shell 也可以运行了。

最好在文本编辑器里写好命令后再粘贴过来，如果直接在 console 中写会出现回退bug。

![](/images/blog/2019-03-19-6.png)


#### 遇到的问题

运行HMaster，报错：hbase-default.xml file seems to be for and old version of HBase

![](/images/blog/2019-03-19-7.png)

这种情况是因为 hbase-default.xml 中的 hbase.defaults.for.version 配置项在打包时没有被正常替换成maven指定的版本号，

具体自己可以解开hbase-*.jar打开hbase-default.xml进行验证。

我这里运用了多种方式解决。没有一个好像特别有效。都是多种方式折腾后才避免。

第一种是重新 maven 编译了一次源码。

第二种是根据参考链接的提示配置了 hbase.defaults.for.version.skip 参数。

第三种修改 hbase-default.xml 中关于HBase默认版本号的配置项。

vim hbase-common/src/main/resources/hbase-default.xml

``` 
<property skipInDoc="true">
    <name>hbase.defaults.for.version</name>
    <value>1.2.6</value>
    <description>This defaults file was compiled for version ${project.version}. This variable is used
    to make sure that a user doesn't have an old version of hbase-default.xml on the
    classpath.</description>
  </property>
```

然后重新 maven 编译一下源码

mvn clean install -DskipTests=true

---
参考链接
* [HBase 在linux环境下本地编译及调试](https://blog.csdn.net/huoshanbaofa123/article/details/75008193)
* [hbase本地调试环境搭建](https://www.cnblogs.com/superhedantou/p/5567787.html)
* [HBase异常：hbase-default.xml file seems to be for and old version of HBase的解决方法](https://www.cnblogs.com/panfeng412/archive/2012/07/22/hbase-exception-hbase-default-xml-file-seems-to-be-for-and-old-version-of-HBase.html)
* [转 HBase异常：hbase-default.xml file seems to be for an old version of HBase](https://www.cnblogs.com/pekkle/p/10465654.html)






