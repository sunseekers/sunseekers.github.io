---
layout: post
title: 二分查找
categories: [Algorithm]
description: 一种在有序数组中查找某一特定元素的搜索算法
keywords: 二分查找, 折半搜索, 对数搜索
---

一种在有序数组中查找某一特定元素的搜索算法

--- 

#### 前言

第一篇二分搜索论文是 1946 年发表，然而第一个没有 bug 的二分查找法却是在 1962 年才出现，中间用了 16 年的时间。

#### 定义

在计算机科学中，二分查找（英语：binary search），也称折半搜索（英语：half-interval search）、对数搜索（英语：logarithmic search），是一种在有序数组中查找某一特定元素的搜索算法。

搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束；

如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较。

如果在某一步骤数组为空，则代表找不到。

这种搜索算法每一次比较都使搜索范围缩小一半。

#### 二分查找法代码

二分查找有很多种变体，使用时需要注意查找条件，判断条件和左右边界的更新方式，
三者配合不好就很容易出现死循环或者遗漏区域，本篇中我们将介绍常见的几种查找方式的模板代码，包括：

1. 标准的二分查找
2. 二分查找左边界
3. 二分查找右边界
4. 二分查找左右边界
5. 二分查找极值点

##### 1. 标准二分查找

首先给出标准二分查找的模板

``` 
int search(int[] nums, int sz, int target) {
    int left = 0;
    int right = sz - 1;
    while (left <= right) {
        int mid = left + ((right - left) >> 1);
        if (nums[mid] == target) return mid;
        else if (nums[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return -1;
}
```

循环条件: left <= right

中间位置计算: mid = left + ((right -left) >> 1)

左边界更新: left = mid + 1

右边界更新: right = mid - 1

返回值: mid / -1

这里有几点需要注意:

1. 我们的循环条件中包含了 left == right的情况，则我们必须在每次循环中改变 left 和 right的指向，以防止进入死循环

2. 循环终止的条件包括：
   * 找到了目标值
   * left > right （这种情况发生于当left, mid, right指向同一个数时，这个数还不是目标值，则整个查找结束。）

3. left + ((right -left) >> 1) 其实和 (left + right) / 2是等价的，这样写的目的一个是为了防止 (left + right)出现溢出，一个是用右移操作替代除法提升性能。

4. left + ((right -left) >> 1) 对于目标区域长度为奇数而言，是处于正中间的，对于长度为偶数而言，是中间偏左的。因此左右边界相遇时，只会是以下两种情况: 
   * left/mid , right (left, mid 指向同一个数，right指向它的下一个数)
   * left/mid/right （left, mid, right 指向同一个数

即因为 mid 对于长度为偶数的区间总是偏左的，所以当区间长度小于等于 2 时，mid 总是和 left 在同一侧。

个人比较喜欢刘汝佳的二分算法。

```
int bsearch(int *A, int x, int y, int v) {
    int m;
    while (x < y) {
        m = x + ((y - x) >> 1);
        if (A[m] == v) return m;
        else if (A[m] > v) y = m;
        else x = m + 1;
    }
    return -1;
}

```

刘汝佳这里的 x, y 表示左闭右开区间的左右端点。即 y 不在取值范围内。这里小心 y 爆int。

#### 二分查找左边界

既然要寻找左边界，搜索范围就需要从右边开始，不断往左边收缩，
也就是说即使我们找到了nums[mid] == target, 这个mid的位置也不一定就是最左侧的那个边界，
我们还是要向左侧查找，所以我们在nums[mid]偏大或者nums[mid]就等于目标值的时候，继续收缩右边界，
算法模板如下: 

``` 
int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left] == target ? left : -1;
}
```

循环条件： left < right

中间位置计算： mid = left + ((right -left) >> 1)

左边界更新：left = mid + 1

右边界更新： right = mid

返回值： nums[left] == target ? left : -1

与标准的二分查找不同：

首先，这里的右边界的更新是right = mid，因为我们需要在找到目标值后，继续向左寻找左边界。

其次，这里的循环条件是left < right。    
因为在最后left与right相邻的时候，mid和left处于相同的位置(前面说过，mid偏左)，则下一步，无论怎样，left, mid, right都将指向同一个位置，如果此时循环的条件是left <= right，则我们需要再进入一遍循环，此时，如果nums[mid] < target还好说，循环正常终止；否则，我们会令right = mid，这样并没有改变left,mid,right的位置，将进入死循环。

事实上，我们只需要遍历到left和right相邻的情况就行了，因为这一轮循环后，无论怎样，left,mid,right都会指向同一个位置，而如果这个位置的值等于目标值，则它就一定是最左侧的目标值；如果不等于目标值，则说明没有找到目标值，这也就是为什么返回值是nums[left] == target ? left : -1。

个人比较喜欢刘汝佳的代码

当 v 存在时返回它出现的第一个位置。如果不存在，返回这样一个下标 i :
在此处插入 v (原来的元素 A[i], A[i + 1], .... 全部往后移动一个位置) 后序列仍然有序。

```
int lower_bound(int *A, int x, int y, int v) {
    int m;
    while (x < y) {
        m = x + ((y - x) >> 1);
        if (A[m] >= v) y = m;
        else x = m + 1;
    }
    return x;
}
```

#### 二分查找右边界

有了寻找左边界的分析之后，再来看寻找右边界就容易很多了，毕竟左右两种情况是对称的嘛，关于使用场景这里就不再赘述了，大家对称着理解就好。我们直接给出模板代码：

``` 
class Solution {
    public int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        while (left < right) {
            int mid = left + ((right - left) >> 1) + 1;
            if (nums[mid] > target) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }
        return nums[right] == target ? right : -1;
    }
}
```

循环条件： left < right

中间位置计算： mid = left + ((right -left) >> 1) + 1

左边界更新：left = mid

右边界更新： right = mid - 1

返回值： nums[right] == target ? right : -1

这里大部分和寻找左边界是对称着来写的，唯独有一点需要尤其注意——中间位置的计算变了，我们在末尾多加了1。这样，无论对于奇数还是偶数，这个中间的位置都是偏右的。

对于这个操作的理解，从对称的角度看，寻找左边界的时候，中间位置是偏左的，那寻找右边界的时候，中间位置就应该偏右呗，但是这显然不是根本原因。根本原因是，在最后left和right相邻时，如果mid偏左，则left, mid指向同一个位置，right指向它们的下一个位置，在nums[left]已经等于目标值的情况下，这三个位置的值都不会更新，从而进入了死循环。所以我们应该让mid偏右，这样left就能向右移动。这也就是为什么我们之前一直强调查找条件，判断条件和左右边界的更新方式三者之间需要配合使用。


个人比较喜欢刘汝佳的代码

当 v 存在时返回它出现的最后一个位置的后面一个位置。  
如果不存在，返回这样一个下标 i : 此处插入 v (原来的元素 A[i], A[i + 1], .... 全部往后移动一个位置) 后序列仍然有序。

```
int upper_bound(int *A, int x, int y, int v) {
    int m;
    while (x < y) {
        m = x + ((y - x) >> 1);
        if (A[m] > v) y = m;
        else x = m + 1;
    }
    return x;
}
```


#### 总结

这样，对二分查找的讨论就相对比较完整了: 设lower_bound 和 upper_bound 的返回值分别为 L 和 R，
则 v 出现的子序列为 [L, R), 这个结论当 v 不存在时也成立: 此时 L = R，区间为空。

---
参考链接
* [二分查找、二分边界查找算法的模板代码总结](https://segmentfault.com/a/1190000016825704#articleHeader10)






