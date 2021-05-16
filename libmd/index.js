const marked = require("marked");


Component({
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

    handleLink(e) {
      console.log(e);
      const { item } = e.currentTarget.dataset;
      const { href } = item || {};

      if (!href) return;

      if (href.indexOf('https://') == 0) {
        wx.navigateTo({
          url: '/pages/webview/index?url=' + encodeURIComponent(href),
        });
      } else {
        try {
          wx.navigateTo({
            url: href,
          });
        } catch (error) {
          console.error('----libmd.handleLink', error);
        };
      }
    },

  },
})