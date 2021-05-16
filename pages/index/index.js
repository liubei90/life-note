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

      console.log(tokens);

      for (let i = 0; i < tokens.length; i++) {
        const item = tokens[i];
        if ((item['type'] == 'heading' && item['depth'] == 1 && !tmpArr.length) ||
          (item['type'] != 'heading' || item['depth'] != 1)) {
          tmpArr.push(item);
        } else if (tmpArr.length > 0) {
          dayNotes.push(this.parser(tmpArr));
          tmpArr.length = 0;
          tmpArr.push(item);
        }
      }

      if (tmpArr.length > 0) {
        dayNotes.push(this.parser(tmpArr));
      }

      this.processNotes(dayNotes);

      console.log(dayNotes);
      this.setData({
        dayNotes: dayNotes.reverse(),
      });
    })
  },

  onShareAppMessage() {
    return {
      title: '日读笔记',
      path: '/pages/index/index',
    }
  },

  processNotes(res) {
    res.forEach((item) => {
      ['note', 'idea'].forEach((name) => {
        const newnote = [];
        const note = item[name] || [];

        for (let i = 0; i < note.length; i++) {
          newnote.push(...note[i].split('\n'));
        }

        item[name] = newnote;
      })

    });
    return res;
  },

  /**
   * { day: '', idea: ['我的想法'], note: ['引用内容'], origin: '引用出处', url: '' }
   */
  parser(tokens, res = {}, ancestorType) {

    for (let i = 0; i < tokens.length; i++) {
      const { type, depth, text, tokens: childs, href } = tokens[i];

      switch (type) {
        case 'heading':
          if (depth == 1) {
            res['day'] = text;
          }
          break;
        case 'text':
          if (ancestorType == 'blockquote') {
            res['note'] = res['note'] || [];
            res['note'].push(text);
          } else {
            res['idea'] = res['idea'] || [];
            res['idea'].push(text);
          }
          break;
        case 'blockquote':
          this.parser(childs, res, type);
          break;
        case 'paragraph':
        case 'em':
          if (ancestorType == 'blockquote') {
            this.parser(childs, res, 'blockquote');
          } else {
            this.parser(childs, res, type);
          }
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
