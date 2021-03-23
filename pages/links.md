---
layout: page
title: 感谢那些在前端路上陪伴过我的每位朋友
description: 没有博客推荐的博客是孤独的
keywords: 博客推荐
comments: true
menu: 感谢
permalink: /links/
---

有朋友，有同事，还有素未谋面的你，会永远的记住你们，那些一个孤独无助的时刻，有你们存在而温暖

[张鑫旭](https://www.zhangxinxu.com/): 同事 => 分享/指导/解决问题/博客

[严文彬](https://github.com/XboxYan)：同事 => 分享/指导/解决问题

[Pengcheng Nie](https://github.com/bran-nie)：朋友 => 分享/指导

[何锦余](https://github.com/elowes)：同事+朋友 => 分享/指导/扯皮

[Coco](https://github.com/chokcoco)：素未谋面 => 公众号学习CSS

[Swenson](https://github.com/Swenson1992)：师傅 => 毕设/鼓励

emmm，还有一些朋友暂时没有合适的联系方式，先表示抱歉，后续会陆陆续续补上

{% for link in site.data.links %}
* [{{ link.name }}]({{ link.url }})
{% endfor %}

