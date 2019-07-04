---
layout: post
title: SpringBoot 企业邮箱发送邮件
categories: [SpringBoot, Java]
description: some word here
keywords: keyword1, keyword2
---

以腾讯企业邮箱为例，讲解如何用 spring-boot 发送邮件

---

#### 背景
因公司内部平台需要用公家的企业邮箱账号发送邮件给运维人员。
发邮件是一个很常见的功能，代码本身并不复杂，有坑的地方主要在于各家邮件厂家的设置。故此记录下来。
下面以腾讯企业邮箱为例，讲解如何用spring-boot发送邮件。

#### 添加依赖项
``` 
<!-- SpringBoot Mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

#### application.yml配置
``` 
spring:
  mail:
    host: smtp.exmail.qq.com  # 邮箱服务器地址
    username: xxxx@puscene.com # 这里填写企业邮箱
    password: **************** # 这里填写企业邮箱登录密码
    properties:
      mail:
        smtp:
          auth: true
          socketFactory:
            class: javax.net.ssl.SSLSocketFactory
            fallback: false
            port: 465
```
企业邮箱如果未开启安全登录，就不需要授权码了，直接填写登录密码即可。如果开启了安全登录，参考下图：

![](/images/blog/2019-02-20-1.png){:height="80%" width="80%"}

则password这里，需要填写客户端专用密码

#### 发送代码示例
```java
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;


/**
 * @author tu
 * @date 2019-02-20 15:47
 * @description 企业邮箱发送邮件
 */

@Service
public class SendMailUtil {


    @Autowired
    private JavaMailSender mailSender; //框架自带的


    @Value("${spring.mail.username}")  //发送人的邮箱  比如155156641XX@163.com
    private String from;

    @Async  //意思是异步调用这个方法
    public void sendMail(String title, String url, String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from); // 发送人的邮箱
        message.setSubject(title); //标题
        message.setTo(email); //发给谁  对方邮箱
        message.setText(url); //内容
        System.out.println("lihm");
        mailSender.send(message); //发送
    }
}
```

注意: 

最开始我用单元测试的方式运行发送代码。邮箱未收到邮件。 
后面运行 Application 之后再测试才收到邮件

#### 扩展

个人邮箱的发送可以参看[Springboot 快速实现邮件发送功能][1] 

附上常见邮箱服务器地址:
``` 
smtp.163.com
smtp.qq.com
```


---
参考链接
* [spring-boot 速成(10) -【个人邮箱/企业邮箱】发送邮件](https://www.cnblogs.com/yjmyzz/p/send-mail-using-spring-boot.html)
* [Springboot 快速实现邮件发送功能][1]
* [Java + 腾讯企业邮箱 + javamail + SSL 发送邮件](https://www.cnblogs.com/LUA123/p/5575134.html)
* [Springboot实现发送邮箱](https://blog.csdn.net/mcb520wf/article/details/80196804)

      
[1]: https://www.jianshu.com/p/19fb209c22c7 
    