---
layout: post
title: Linux 实现文件的去重
categories: [Linux]
description: Linux 实现文件的去重
keywords: Linux, sort, uniq
---

Linux 实现文件的去重

此为转载文章。[linux实现文件的去重][1]

---
#### 实现文件的去重

##### 1. 两个文件的交集，并集
```
# 取出两个文件的并集(重复的行只保留一份)

cat file1 file2 | sort | uniq > file3

# 取出两个文件的交集(只留下同时存在于两个文件中的文件)

cat file1 file2 | sort | uniq -d > file3

# 删除交集，留下其他的行

cat file1 file2 | sort | uniq -u > file3
```

##### 2. 两个文件合并
```
# 一个文件在上，一个文件在下

cat file1 file2 > file3

# 一个文件在左，一个文件在右

paste file1 file2 > file3
```

##### 3. 一个文件去掉重复的行

```
sort file | uniq > file1

注意：重复的多行记为一行，也就是说这些重复的行还在，只是全部省略为一行！

sort file | uniq –u > file1

上面的命令可以把重复的行全部去掉，也就是文件中的非重复行！
```

[1]: https://www.cnblogs.com/followees/p/7845575.html