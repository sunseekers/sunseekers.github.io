---
layout: post
title: PrintStream 里的内容转为 String
categories: [Java]
description: PrintStream 里的内容转为 String
keywords: PrintStream
---

PrintStream 里的内容转为 String

---

#### 前言

有个业务需求是将其 yarn log 日志返回到前端。

参考 [yarn logs -applicationId命令java版本简单实现](https://www.cnblogs.com/lyy-blog/p/9635601.html) 实现该业务需求

发现它是将其输出流作为文件输出的。

PrintStream out = new PrintStream(appIdStr); 

这将会把输出流数据输出到源代码目录下。

因此需要将输出流处理后转为 String 返回到前端

#### 代码

```java
ByteArrayOutputStream os = new ByteArrayOutputStream();
PrintStream out = new PrintStream(os);
String s = new String(os.toByteArray(), StandardCharsets.UTF_8);
```

---
参考链接
* [PrintStream里的内容转为String](https://www.jianshu.com/p/83ad6eb5a905)
* [(JAVA）从零开始之--打印流PrintStream记录日志文件](https://www.cnblogs.com/fnz0/p/5423201.html)
* [java io系列16之 PrintStream(打印输出流)详解](https://www.cnblogs.com/skywang12345/p/io_16.html)

