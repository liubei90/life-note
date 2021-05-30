const { putNote, deleteNote } = require('../../apis/notes');


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
    handleLongPress() {
      // flower: 0 无， 1 小红花， 2 太阳花
      const { id, flower } = this.data.item;

      putNote(id, { flower: (Number(flower) + 1) % 3 }).then(() => {
        this.triggerEvent('item-change');
      });
    },
    handleDelete() {
      const { id } = this.data.item;

      wx.showLoading({ title: '删除中', });
      deleteNote(id).then((res) => {
        wx.hideLoading();
        this.triggerEvent('item-change');
      });
    },
  }
})
