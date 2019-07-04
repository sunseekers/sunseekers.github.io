---
layout: page
title: Wiki
description: 活到老，学到老
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

> 7秒记忆的我，只有记录下来啦！

<ul class="listing">
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" %}
<li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
