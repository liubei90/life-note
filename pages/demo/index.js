// index.js
// 获取应用实例
const app = getApp();

const mdStr = `
# 这是一级标题

这是一段段落[这是链接](https://www.qq.com)

## 这是二级标题
`;

Page({
  data: {
    mdStr: mdStr,
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
