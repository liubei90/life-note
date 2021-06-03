/*
 * @Author: liubei
 * @Date: 2021-05-31 15:19:57
 * @LastEditTime: 2021-06-03 16:23:46
 * @Description: 
 */
// index.js
// 获取应用实例
const app = getApp();

const mdStr = `
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题

>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容

**这是加粗的文字**
*这是倾斜的文字*
***这是斜体加粗的文字***
~~这是加删除线的文字~~

---
----
***
*****

![图片alt](/assets/qinzi_chengzhang@3x.png)

[简书](https://jianshu.com)

- 列表内容
+ 列表内容
* 列表内容

1. 列表内容
2. 列表内容
3. 列表内容

表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

\`代码内容\`

`;


Page({
  data: {
    mdStr: mdStr
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
    ;
  },

  onShareAppMessage() {

  },

})
