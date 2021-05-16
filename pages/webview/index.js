// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    url: '',
  },
  onLoad(options) {
    const url = this.processUrl(options);

    if (!url) return;

    this.setData({ url });
  },

  onShareAppMessage() { },

  processUrl(options) {
    const { type } = options;
    const url = decodeURIComponent(options['url']);

    return url;
  },

})
