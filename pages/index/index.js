// index.js
// 获取应用实例
const app = getApp();
const { getNotes } = require('../../request.js');


Page({
  data: {
    dayNote: null,
    greetings: '还好吗？',
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
    getNotes().then((res) => {
      this.setData({
        dayNote: this.processNotes(res)[0],
      });
    })
  },

  processNotes(res) {
    res.forEach((res) => {
      res.greetings = '还好吗？';
    });
    return res;
  }
})
