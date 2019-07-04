---
layout: post
title: MySQL 5.7 安装
categories: [MySQL]
description: MySQL 5.7 手动安装
keywords: MySQL, 5.7
---

在 Linux 环境下手动安装 mysql 5.7 二进制包

---

#### 前言
MySql 是数据库的明星。基本大小厂都在用

作为一个运维人员，MySql 的安装是必须掌握的。

#### 准备

Mysql 版本： 5.7.18

mysql 二进制包到mysql 官网下载即可

##### 1. 解压

```
# 创建 MySql 目录
mkdir /opt/mysql
# 解压 Mysql 二进制包
tar -zxvf mysql**** -C /opt/mysql
cd /opt/mysql
mv mysql... base
```

##### 2. 目录

> * mysql安装目录：/opt/mysql/base
> * 数据目录：/opt/mysql/data/13307
> * 配置文件：/opt/mysql/my.cnf.13307
> * binlog目录：/opt/mysql/binlogw/13307
> * mysql 临时目录： /opt/mysql/base/mysql_tmp

按照上面目录创建目录。没有的就创建，有的就忽略。

##### 3. 生成my.cnf 配置文件

编辑修改 my.cnf.13307 文件
vim /opt/mysql/my.cnf.13307

```
[mysql]
# DO NOT CHANGE
port = 13307
default-character-set = utf8mb4

[mysqld]
# DO NOT CHANGE
server_id = 313432
basedir = /opt/mysql/base
datadir = /opt/mysql/data/13307
socket = /opt/mysql/data/13307/mysql_13307.sock
port = 13307
log-bin = /opt/mysql/binlogw/13307/mysql-bin
tmpdir = /opt/mysql/base/mysql_tmp
skip-name-resolve = 1
max_allowed_packet = 64M
default_storage_engine = InnoDB
character_set_server = utf8mb4
skip-external-locking = 1
table_open_cache_instances = 32
back_log = 1500
wait_timeout = 3600
interactive_timeout = 3600
default-time-zone = '+8:00'
explicit_defaults_for_timestamp = 1
lower_case_table_names = 1
symbolic-links = 0
secure_file_priv = ''
```

##### 4. 修改权限

添加 mysql 用户，并修改 mysql 所在目录的权限

```
useradd mysql

chown -R mysql:mysql /opt/mysql
```

#### 初始化实例

进入base目录下初始化实例

```
cd /opt/mysql/base
./bin/mysqld --defaults-file=/opt/mysql/my.cnf.13307 --user=mysql --initialize
```

**去 mysql-error.log 查看实例随机密码，搜索最后一个password 保留即可**

![](/images/blog/2019-03-14-1.png)

路径为 /opt/mysql/data/13307/mysql-error.log

**在/opt/mysql/data/13307下如果只有mysql-error.log 一个文件，说明初始化实例报错了，
查看mysql-error.log错误日志根据报错信息处理即可，处理完之后得把/opt/mysql/data/13307下的文件都清空，否者会数据目录不为空的错误**

#### 起mysql实例

进入 base 目录下起 mysql 实例

```
cd /opt/mysql/base
./bin/mysqld_safe --defaults-file=/opt/mysql/my.cnf.13307 --user=mysql &

# 查看是否有mysql 进程

ps -ef | grep mysqld
```

如果启动mysql 失败， 查看 mysql-error.log 错误日志处理即可。

#### 连接mysql

``` 
# 如果不进入bin目录起，可能会报root密码过期错误
cd /opt/mysql/base    
./bin/mysql -S /opt/mysql/data/13307/mysql_13307.sock  -u root -p -A
```

输入初始化实例步骤获得的随机密码

连接成功后需要修改root密码

``` 
SET PASSWORD = PASSWORD('your_password');
```

#### 修改环境变量

全局环境变量

vim /etc/profile

``` 
export MYSQL_HOME=/opt/mysql/base
export PATH=${MYSQL_HOME}/bin:$PATH
```













