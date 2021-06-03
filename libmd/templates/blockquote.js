/*
 * @Author: liubei
 * @Date: 2021-06-03 13:57:38
 * @LastEditTime: 2021-06-03 14:02:29
 * @Description: 
 */
Component({
    options: {
        styleIsolation: 'shared'
    },
    properties: {
        item: {
            type: Object,
            value: null,
        }
    },

    data: {
    },

    observers: {
        item(v) {
            // console.log(v);
        }
    },

    methods: {

    },
})