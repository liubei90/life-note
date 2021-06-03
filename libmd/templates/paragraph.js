/*
 * @Author: liubei
 * @Date: 2021-06-03 14:28:22
 * @LastEditTime: 2021-06-03 14:30:00
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