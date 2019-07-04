---
layout: post
title: 浅学 Synchronized
categories: [Java]
description: Synchronized 是并发编程中重要的使用工具之一
keywords: Synchronized
---

Synchronized 是并发编程中重要的使用工具之一

--

#### 前言

JVM 自带的关键字，可在需要线程安全的业务场景中使用，来保证线程安全。

#### 用法

> * 按照锁的对象区分可以分为对象锁和类锁
> * 按照在代码中的位置区分可以分为方法形式和代码块形式

对象锁

锁对象为当前 this 或者说是当前类的实例对象

``` 
public void synchronized method() {
    System.out.println("我是普通方法形式的对象锁");
}

public void method() {
    synchronized(this) {
        System.out.println("我是代码块形式的对象锁");
    }
}
```
类锁

锁的是当前类或者指定类的Class对象。

一个类可能有多个实例对象，但它只可能有一个Class对象。

``` 
public static void synchronized method() {
    System.out.println("我是静态方法形式的类锁");
}

public void method() {
    synchronized(*.class) {
        System.out.println("我是代码块形式的类锁");
    }
}
```


#### 简单举例

可以参看[深入理解synchronized关键字][1]、[Java并发编程：Synchronized及其实现原理][2]。

原理也可以参看上面两个文章。

#### 总结

一把锁只能同时被一个线程获取，没有拿到锁的线程必须等待；

每个实例都对应有自己的一把锁，不同实例之间互不影响；

锁对象是*.class以及synchronized修饰的static方法时，所有对象共用一把类锁；

无论是方法正常执行完毕或者方法抛出异常，都会释放锁；

使用synchronized修饰的方法都是可重入的。

---
参考链接
* [深入理解synchronized关键字][1]
* [Java并发编程：Synchronized及其实现原理][2]



[1]: https://mp.weixin.qq.com/s/Zwl3fUyO4igP6wE5W5IwYw
[2]: https://www.cnblogs.com/paddix/p/5367116.html


