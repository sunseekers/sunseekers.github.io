---
layout: page
title: About
description: tu's Personal Blog
keywords: lihuimintu, tu, 图 
comments: true
menu: 关于
permalink: /about/
subtitle:   <h3>Download My CV</h3>
            <a role="button" class="btn btn-primary hvr-grow-shadow" href="/assets/files/CV_Wendy_e.pdf" target="_blanks">
                <span class="flag-icon flag-icon-gb"></span> English
            </a>
            <a role="button" class="btn btn-primary hvr-grow-shadow" href="/assets/files/CV_Wendy_e.pdf" target="_blanks">
                <span class="flag-icon flag-icon-cn"></span> 中文
            </a>
                            
---

个人本职工作是一个大数据运维工程师。

通过记录博客的方式记录自己成长。记录自己的改变。

记录知识，坚信努力改变人生。

## 联系

{% for website in site.data.social %}
* {{ website.sitename }}：[@{{ website.name }}]({{ website.url }})
{% endfor %}

## Skill Keywords

{% for category in site.data.skills %}
### {{ category.name }}
<div class="btn-inline">
{% for keyword in category.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
