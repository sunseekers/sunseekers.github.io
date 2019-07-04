---
layout: post
title: 浅学 CountDownLatch
categories: [Java]
description: 关于 CountDownLatch 的文章
keywords: CountDownLatch
---

CountDownLatch 是一个同步的辅助类，允许一个或多个线程一直等待，直到其它线程完成它们的操作。

---

#### 前言

在阅读 HBase 快照源码时看到了 waitForLatch 的方法，由此认识了 CountDownLatch。

![](/images/blog/2019-05-10-1.png){:height="80%" width="80%"} 

![](/images/blog/2019-05-10-2.png){:height="80%" width="80%"} 

还是挺重要的知识点。于是花了点时间去了解一下。

#### 简介

> * A synchronization aid that allows one or more threads to wait until a set of operations being performed in other threads completes.

翻译过来 CountDownLatch 是一个同步的辅助类，允许一个或多个线程一直等待，直到其它线程完成它们的操作。

Java中，CountDownLatch是一个同步辅助类，在完成一组其他线程执行的操作之前，它允许一个或多个线程阻塞等待。

CountDownLatch 使用给定的计数初始化，核心的两个方法: await() 和 countDown()
前者可以实现给定计数倒数一次，后者是等待计数倒数到 0，如果没有到达 0，就一直阻塞等待。



![](/images/blog/2019-05-10-3.png){:height="80%" width="80%"} 

使用说明: 

count 初始化 CountDownLatch，然后需要等待的线程调用 await 方法。await 方法会一直受阻塞直到 count=0。
而其它线程完成自己的操作后，调用 countDown() 使计数器 count 减 1。当 count 减到 0 时，
所有在等待的线程均会被释放

说白了就是通过 count 变量来控制等待，如果 count 值为 0 (其他线程的任务都完成了)，那就可以继续执行



#### 示例

##### 1. 我等待其他线程

tu 现在去做实习生了，其他的员工还没下班，tu 不好意思先走，等其他的员工都走光了，tu 再走。

```java 
import java.util.concurrent.CountDownLatch;

public class Application {
    public static void main(String[] args) {

        // 等5个其他员工线程，所以计数器设置为 5
        final CountDownLatch countDownLatch = new CountDownLatch(5);

        System.out.println("现在6点下班了.....");

        // tu 线程启动
        new Thread(new Runnable() {
            public void run() {

                try {
                    // 这里调用的是await()不是wait()
                    countDownLatch.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("...其他的5个员工走光了，tu 终于可以走了");
            }
        }).start();

        // 其他员工线程启动
        for (int i = 0; i < 5; i++) {
            new Thread(new Runnable() {
                public void run() {
                    System.out.println("员工 XXX 下班了");
                    countDownLatch.countDown();
                }
            }).start();
        }
    }
}
```

![](/images/blog/2019-05-10-4.png){:height="80%" width="80%"}

##### 2. 其他线程等我

tu 现在负责仓库模块功能，但是能力太差了，写得很慢，别的员工都需要等 tu 写好了才能继续往下写。

```java 
import java.util.concurrent.CountDownLatch;

public class Application {
    public static void main(String[] args) {

        // 只等 tu 线程，所以计数器设置为 1
        final CountDownLatch countDownLatch = new CountDownLatch(1);

        System.out.println("现在6点下班了.....");

        // tu 线程启动
        new Thread(new Runnable() {
            public void run() {

                try {
                    Thread.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("tu 终于写完了");
                countDownLatch.countDown();

            }
        }).start();

        // 其他员工线程启动
        for (int i = 0; i < 5; i++) {
            new Thread(new Runnable() {
                public void run() {
                    System.out.println("其他员工需要等待tu");
                    try {
                        countDownLatch.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("tu 终于写完了，其他员工可以开始了！");
                }
            }).start();
        }
    }
}
```

![](/images/blog/2019-05-10-5.png){:height="80%" width="80%"}

#### 深入理解

对源码的理解可以参看 crossoverJie 的 [什么是CountDownLatch？][1]。 写得非常通俗易懂。


#### 应用

结合线程安全的 map 容器，基于 test-and-set 机制，CountDownLatch 可以实现基本的互斥锁，原理如下：

1. 初始化：CountDownLatch 初始化计数为1

2. test过程：线程首先将临界资源作为key，latch作为value尝试插入线程安全的map中。如果返回失败，表示其他线程已经持有了该锁，调用await方法阻塞到该latch上，等待其他线程释放锁；

3. set过程：如果返回成功，就表示已经持有该锁，其他线程必然插入失败。持有该锁之后执行各种操作，执行完成之后释放锁，释放锁首先将map中对应的KeyValue移除，再调用latch的countDown方法，该方法会将计数减1，变为0之后就会唤醒其他阻塞线程。



---
参考链接
* [什么是CountDownLatch？][1]
* [Java多线程打辅助的三个小伙子](https://mp.weixin.qq.com/s/77yJj3amPr6Q2VQJxVAS2Q)
* [HBase 事务和并发控制机制原理](http://www.codeceo.com/article/hbase-transaction.html)


[1]: https://mp.weixin.qq.com/s/JryG3UTj90rDORDa_KHhhw



