/*
 * @Author: liubei
 * @Date: 2021-06-03 14:15:53
 * @LastEditTime: 2021-06-03 15:58:48
 * @Description: 
 */
Component({
    options: {
        styleIsolation: 'shared'
    },
    properties: {
        tokens: {
            type: Array,
            value: [],
        }
    },

    data: {
    },

    observers: {
        tokens(v) {
            // console.log(v);
        }
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