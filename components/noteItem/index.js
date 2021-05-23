
Component({
  options: {
    // styleIsolation: 'apply-shared',
    // multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    item: {
      type: Object,
      value: null
    }
  },
  lifetimes: {
    attached: function() {

    }
  },
  methods: {

  }
})
