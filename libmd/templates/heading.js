/*
 * @Author: liubei
 * @Date: 2021-06-03 14:35:57
 * @LastEditTime: 2021-06-03 14:36:24
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