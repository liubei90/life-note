/*
 * @Author: liubei
 * @Date: 2021-05-31 15:19:57
 * @LastEditTime: 2021-06-03 16:14:53
 * @Description: 
 */
const marked = require("marked");


Component({
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    md: {
      type: String,
      value: '',
    }
  },

  data: {
    tokens: null,
  },

  observers: {
    md(v) {
      let tokens = null;

      if (v) {
        tokens = marked.lexer(v);
      }

      console.log(tokens);

      this.setData({ tokens });
    },
  },

  methods: {

  },
})