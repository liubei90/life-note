/*
 * @Author: liubei
 * @Date: 2021-06-03 14:40:03
 * @LastEditTime: 2021-06-03 15:09:17
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