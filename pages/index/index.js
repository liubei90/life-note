// index.js
// 获取应用实例
const app = getApp();
const { getNotes } = require('../../request.js');
const marked = require("marked");


Page({
  data: {
    dayNotes: [],
    greetings: '还好吗？',
  },
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
    getNotes().then((res) => {
      const tokens = marked.lexer(res);
      const dayNotes = [];
      const tmpArr = [];

      for (let i = 0; i < tokens.length; i++) {
        const item = tokens[i];
        if ((item['type'] == 'heading' && item['depth'] == 1 && !tmpArr.length) ||
          (item['type'] != 'heading' || item['depth'] != 1)) {
          tmpArr.push(item);
        } else if (tmpArr.length > 0) {
          dayNotes.push(this.parser(tmpArr));
          tmpArr.length = 0;
        }
      }

      if (tmpArr.length > 0) {
        dayNotes.push(this.parser(tmpArr));
      }

      console.log(dayNotes);
      this.setData({
        dayNotes,
      });
    })
  },

  processNotes(res) {
    res.forEach((res) => {
      res.greetings = '还好吗？';
    });
    return res;
  },

  parser(tokens, res = {}) {

    for (let i = 0; i < tokens.length; i++) {
      const { type, depth, text, tokens: childs, href } = tokens[i];

      switch (type) {
        case 'heading':
          if (depth == 1) {
            res['day'] = text;
          }
          break;
        case 'text':
          res['note'] = res['note'] || [];
          res['note'].push(text);
          break;
        case 'blockquote':
        case 'paragraph':
        case 'em':
          this.parser(childs, res);
          break;
        case 'link':
          res['origin'] = text;
          res['url'] = href;
          break;
      }
    }

    return res;
  }
})
