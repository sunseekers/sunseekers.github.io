---
layout: post
title: yarn logs -applicationId 命令 Java 版本简单实现
categories: [Yarn]
description: yarn logs -applicationId 命令 Java 版本简单实现
keywords: yarn, applicationId
---

yarn logs -applicationId 命令 Java 版本简单实现

---

#### 前言
有个需求是需要把将 yarn logs 日志获得然后在前端页面上显示出来。

我一开始是直接读取 /tmp/logs 下面 log 文件。读取出来排版有点丑。而且开头和结尾处有乱码。

花了大量时间再纠结乱码的去除。被折腾的不要不要的。

最后在 任我行的[yarn logs -applicationId命令java版本简单实现][1] 看到实现的可能性。

任我行代码

``` 
import java.io.DataInputStream;
import java.io.EOFException;
import java.io.FileNotFoundException;
import java.io.PrintStream;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileContext;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.fs.RemoteIterator;
import org.apache.hadoop.security.UserGroupInformation;
import org.apache.hadoop.yarn.api.records.ApplicationId;
import org.apache.hadoop.yarn.conf.YarnConfiguration;
import org.apache.hadoop.yarn.logaggregation.AggregatedLogFormat;
import org.apache.hadoop.yarn.logaggregation.LogAggregationUtils;
import org.apache.hadoop.yarn.util.ConverterUtils;

public class GetYarnLog {
    public static void main(String[] args) {
        run("application_1535700682133_0496");
    }
    
    public static int run(String appIdStr) throws Throwable{
 
    
         Configuration conf = new YarnConfiguration();
         conf.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/core-site.xml"));
         conf.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/yarn-site.xml"));
         conf.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/hdfs-site.xml"));
         if(appIdStr == null || appIdStr.equals(""))
          {
             System.out.println("appId is null!");
             return -1;
          }
         PrintStream out=new PrintStream(appIdStr); 
         ApplicationId appId = null;
         appId = ConverterUtils.toApplicationId(appIdStr);
         
         Path remoteRootLogDir = new Path(conf.get("yarn.nodemanager.remote-app-log-dir", "/tmp/logs"));

         String user =  UserGroupInformation.getCurrentUser().getShortUserName();;
         String logDirSuffix = LogAggregationUtils.getRemoteNodeLogDirSuffix(conf);
         
         Path remoteAppLogDir = LogAggregationUtils.getRemoteAppLogDir(remoteRootLogDir, appId, user, logDirSuffix);
         RemoteIterator<FileStatus> nodeFiles;
         try
         {
           Path qualifiedLogDir = FileContext.getFileContext(conf).makeQualified(remoteAppLogDir);
           nodeFiles = FileContext.getFileContext(qualifiedLogDir.toUri(), conf).listStatus(remoteAppLogDir);
         }
         catch (FileNotFoundException fnf)
         {
           logDirNotExist(remoteAppLogDir.toString());
           return -1;
         }
         
         boolean foundAnyLogs = false;
         while (nodeFiles.hasNext())
         {
           FileStatus thisNodeFile = (FileStatus)nodeFiles.next();
           if (!thisNodeFile.getPath().getName().endsWith(".tmp"))
           {
               System.out.println("NodeFileName = "+thisNodeFile.getPath().getName());
             AggregatedLogFormat.LogReader reader = new AggregatedLogFormat.LogReader(conf, thisNodeFile.getPath());
             try
             {
               AggregatedLogFormat.LogKey key = new AggregatedLogFormat.LogKey();
               DataInputStream valueStream = reader.next(key);
               for (;;)
               {
                 if (valueStream != null)
                 {
                   String containerString = "\n\nContainer: " + key + " on " + thisNodeFile.getPath().getName();
                   
                   out.println(containerString);
                   out.println(StringUtils.repeat("=", containerString.length()));
                   try
                   {
                     for (;;)
                     {
                       AggregatedLogFormat.LogReader.readAContainerLogsForALogType(valueStream, out, thisNodeFile.getModificationTime());
                       
                       foundAnyLogs = true;
                     }
                         
                   }
                   catch (EOFException eof)
                   {
                     key = new AggregatedLogFormat.LogKey();
                     valueStream = reader.next(key);
                      
                   }
                   
                 }else{
                     break;
                 }
               }
             }
             finally
             {
               reader.close();
             }
           }
         }
         if (!foundAnyLogs)
         {
           emptyLogDir(remoteAppLogDir.toString());
           return -1;
         }
         return 0;
       }
}
```

#### 代码


```java
package com.jdb.bigdatams.util;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;

import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.yarn.conf.YarnConfiguration;
import org.apache.hadoop.yarn.logaggregation.AggregatedLogFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author lihm
 * @date 2019-04-19 14:51
 * @description TODO
 */

@Component
public class YarnLogUtil {

    @Value("${hadooprequest.nn1Address}")
    private String nn1;

    @Value("${hadooprequest.nn2Address}")
    private String nn2;

    @Value("${hadooprequest.nameservices}")
    private String HdfsNameservices;

    public String readLog(String applicationId, String userName) throws Exception {
        Configuration conf=new Configuration(false);
        String nameservices = HdfsNameservices;
        String[] namenodesAddr = {nn1, nn2};
        String[] namenodes = {"nn1","nn2"};
        conf.set("fs.defaultFS", "hdfs://" + nameservices);
        conf.set("dfs.nameservices",nameservices);
        conf.set("dfs.ha.namenodes." + nameservices, namenodes[0]+","+namenodes[1]);
        conf.set("dfs.namenode.rpc-address." + nameservices + "." + namenodes[0], namenodesAddr[0]);
        conf.set("dfs.namenode.rpc-address." + nameservices + "." + namenodes[1], namenodesAddr[1]);
        conf.set("dfs.client.failover.proxy.provider." + nameservices,"org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider");
        String hdfsRPCUrl = "hdfs://" + nameservices + ":" + 8020;

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        PrintStream out = new PrintStream(os);
        try {
            FileSystem fs = FileSystem.get(new URI(hdfsRPCUrl), conf, userName);
            FileStatus[]  paths = fs.listStatus(new Path("/tmp/logs/" + userName + "/logs/" + applicationId));

            if (paths == null || paths.length==0) {
                throw new FileNotFoundException("Cannot access " + "/tmp/logs/" + userName + "/logs/" + applicationId +
                        ": No such file or directory.");
            }

            long sizeLength = 0;
            for (FileStatus fileStatus : paths) {
                sizeLength += fs.getContentSummary(fileStatus.getPath()).getLength();
            }

            if (sizeLength > 1024 * 1024 * 1024) {
                return "文件大于 1 G，请自行到集群上查看";
            }

            for (int i = 0 ; i < paths.length ; ++i)
            {
                Configuration yarnConfiguration = new YarnConfiguration();
                // yarnConfiguration.addResource(new Path("/Users/tu/Public/ZaWu/conf.cloudera.yarn/core-site.xml"));
                // yarnConfiguration.addResource(new Path("/Users/tu/Public/ZaWu/conf.cloudera.yarn/yarn-site.xml"));
                // yarnConfiguration.addResource(new Path("/Users/tu/Public/ZaWu/conf.cloudera.yarn/hdfs-site.xml"));

                yarnConfiguration.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/core-site.xml"));
                yarnConfiguration.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/yarn-site.xml"));
                yarnConfiguration.addResource(new Path("/etc/hadoop/conf.cloudera.yarn/hdfs-site.xml"));
                AggregatedLogFormat.LogReader reader = new AggregatedLogFormat.LogReader(yarnConfiguration, paths[i].getPath());
                try {
                    AggregatedLogFormat.LogKey key = new AggregatedLogFormat.LogKey();
                    DataInputStream valueStream = reader.next(key);
                    for (;;) {
                        if (valueStream != null) {
                            String containerString = "\n\nContainer: " + key + " on " + paths[i].getPath().getName();
                            out.println(containerString);
                            out.println(StringUtils.repeat("=", containerString.length()));

                            try {
                                for (;;) {
                                    AggregatedLogFormat.LogReader.readAContainerLogsForALogType(valueStream, out, paths[i].getModificationTime());

                                }
                            } catch (EOFException eof) {
                                key = new AggregatedLogFormat.LogKey();
                                valueStream = reader.next(key);
                            }
                        } else {
                            break;
                        }
                    }
                } finally {
                    reader.close();
                }
            }

        } catch (FileNotFoundException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        }
        out.close();
        return new String(os.toByteArray(), StandardCharsets.UTF_8);
    }
}
```

#### 遇到的问题

##### 1. 权限问题

一开始遇到权限问题，尝试过在代码中解决，想以 application 的 appOwner 去读取。

没找到突破口。最后授权给运行的账号拥有 /tmp/logs 路径下的读权限解决。

``` 
HDFS 开启了 ACL 权限
hadoop fs -setfacl -R -m default:user:hadoop:rwx /tmp/logs
```

开启 default ACL 的话后续生成的文件。hadoop 都有权限去读。[HDFS ACL 权限管理](https://lihuimintu.github.io/2019/05/14/hdfs-acl/)

##### 2. 输出 String

按 任我行的代码。logs 日志一直是输出到本地代码的源路径下。

最后仔细研读代码后发现是跟 PrintStream 打印流有关。

问题就变成如何把 PrintStream 转为 String 了

具体参考 [PrintStream 里的内容转为 String][2]

---
参考链接
* [yarn logs -applicationId命令java版本简单实现][1]

[1]: https://www.cnblogs.com/lyy-blog/p/9635601.html
[2]: https://lihuimintu.github.io/2019/04/24/printstream-to-string/
