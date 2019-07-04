---
layout: post
title: CDH 更改 hostname
categories: CM
description: 修改 hostname
keywords: CM、hostname、 Cloudera Manager
---

修改 hostname

---
### 前言

修改 CDH 的 hostname

### 操作系统

CentOS7.2

---

### 步骤

#### 停止 CDH
在 CM 页面上停止 Cluster 集群和 Clouder Management Service

#### 停止 CM
先把所有主机的 agent 停止。接着停止 server

```
# 停止
systemctl stop cloudera-scm-agent
systemctl stop cloudera-scm-server

# 确认是否停止
systemctl status cloudera-scm-agent
systemctl status cloudera-scm-server
```

#### 修改ClouderaManger资源库表修改数据库的hostname

```
# 获取密码
grep password /etc/cloudera-scm-server/db.properties

# 登录 （mysql 的自行查阅）
psql -h localhost -p 7432 -U scm  

# 查询表
select host_id, host_identifier, name, ip_address from hosts;

# 修改表
update HOSTS set name='hostname' where host_id=1;

# 退出
\q

```

#### 修改主机 hostname
```
# 直接修改命令
hostname yz-JDB-106-38-11

# 查看修改后的hostname
hostname                   
```

#### 修改host
更改host，复制到所有主机上

#### 启动 CM
所有主机启动agent
```
# 启动
systemctl start cloudera-scm-server
systemctl start cloudera-scm-agent
```

#### 处理
目前只启动 Clouder Management Service
##### 更改hostname服务器包含namenode等主节点的情况
如果更改hostname服务器不包含namenode就跳过
重命名hosts的服务器中有namenode，而且已经启用了高可用
1. 只启动zookeeper 集群，此时所有其他服务，特别是HDFS/ZKFC，不能处于运行状态
2. 在某一台zookeeper服务器，执行zookeeper-client
* 若集群没有启用kerberos，则直接跳过第二步；若集群配置了kerberos，则按第二步操作
* 配置zk认证如下：点击“HDFS”服务->点击“实例”页面->点击“Failover Controller”角色->点击“进程”页面；
在“hdfs/hdfs.sh [“zkfc”]”程序中，点击“显示”，查看“core-site.xml”，查看ha.zookeeper.auth属性，获取“digest:hdfs-fcs:”后为密码，如TEbW2bgoODa96rO3ZTn7ND5fSOGx0h；
执行addauth：addauth digest hdfs-fcs:TEbW2bgoODa96rO3ZTn7ND5fS
* 验证HA znode是否存在：ls /hadoop-ha
* 删除HDFS znode：rmr /hadoop-ha/nameservice1
* 如果没有运行JobTracker的高可用，则删除HA znode：rmr /hadoop-ha

3.点击”HDFS”服务->点击”实例”tab->选择“操作”->点击“在zookeeper中初始化HA状态”

4.更新Hive Metastore
  * 备份元数据库
  * 点击“Hive”服务->点击“操作”->点击“更新Hive Metastore Namenodes”

![](/images/blog/2019-02-13-1.png){:height="80%" width="80%"}

#### 更改hostname服务器包含kudu master等主节点的情况
修改 Kudu master hostname 的步骤请参考[官方文档](https://kudu.apache.org/docs/administration.html#_changing_the_master_hostnames)


#### 启动其他组件



