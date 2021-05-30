// index.js
// 获取应用实例
const app = getApp();
import { dateUtil } from '../../components/calendar-v3/utils/index';

const { getDailySentences,
  postDailySentence,
  getDailySentence,
  putDailySentence,
  deleteDailySentence,
  addDailySentence } = require('../../apis/daily_sentence');
const { throttle } = require('../../utils/lodash');

Page({
  data: {
    isEdit: false, // 编辑模式
    dayNotes: {},
    dayText: '',
    current: 0,
    swiperDays: ['', ''],
    dx: 0,
    autoFocus: false,
  },

  onLoad() {
    this.pageInit();
  },

  onShareAppMessage() {
    return {
      title: '日读笔记',
      path: '/pages/daily_sentence/index',
    }
  },

  pageInit() {
    wx.showLoading({ title: '加载中' });
    getDailySentences().then((res) => {
      const dailys = res.data || [];
      const dayNotes = {};

      dailys.forEach(item => {
        dayNotes[dateUtil.toTimeStr(dateUtil.transformDateRow2Dict(item['theday']))] = item;
      });

      this.setData({
        dayNotes,
      });
    }).finally(() => {
      wx.hideLoading();
    });

    this.initSwiper();
  },

  handleClickDay(e) {
    const { day } = e.currentTarget.dataset;

    if (!day) return;

    wx.navigateTo({
      url: '/pages/day/index?day=' + day,
    });
  },

  handleEditContent(e) {
    const { content = '' } = e.currentTarget.dataset;
    this.setData({
      isEdit: true,
      dayText: content,
    }, () => {
      setTimeout(() => {
        this.setData({
          autoFocus: true,
        })
      }, 300);
    });
  },

  handleInput(e) {
    this.setData({
      dayText: e.detail.value,
    });
  },

  handleBlur() {
    console.log('----daily_sentence.handleBlur');

    const { dayText, swiperDays, current } = this.data;
    const content = String(dayText).trim();

    if (!content) return this.setData({ isEdit: false, }); // wx.showToast({ title: '请输入内容', icon: 'none' });

    wx.showLoading({ title: '新增一句' });
    addDailySentence({
      theday: swiperDays[current],
      content,
    }).then((res) => {
      return this.getDayNote();
    }).finally(() => {
      this.setData({ isEdit: false, dayText: '', autoFocus: false, });
      wx.hideLoading();
    });

  },

  noop() {},

  getDayNote() {
    const { swiperDays, current } = this.data;
    return getDailySentences({
      theday: swiperDays[current],
    }).then((res) => {
      if (res.data && res.data.length) {
        const daily = res.data[0];
        const key = 'dayNotes.' + dateUtil.toTimeStr(dateUtil.transformDateRow2Dict(daily['theday']))

        this.setData({
          [key]: daily,
        })
      }
    });
  },

  handleTransition: throttle(function(e) {
    console.log('----daily_sentence.handleTransition', e.detail);
    this.setData({
      dx: e.detail.dx,
    });

    this.toggleSwiper();
  }, 100, { trailing: false }),

  // handleTransition: function(e) {
  //   console.log('----daily_sentence.handleTransition', e.detail);
  //   this.setData({
  //     dx: e.detail.dx,
  //   });

  //   this.toggleSwiper();
  // },

  handleAnimationFinish(e) {
    console.log('----daily_sentence.handleAnimationFinish', e.detail);
    if (e.detail.source == 'touch') {
      this.setData({
        current: e.detail.current,
      });
    }
  },

  handleChange(e) {
    console.log('----daily_sentence.handleChange', e.detail);
  },

  // 滑动swiper的处理
  initSwiper() {
    const { current, swiperDays } = this.data;

    // swiperDays[current] = dateUtil.toTimeStr(dateUtil.todayFMD());

    this.setData({ ['swiperDays[' + current + ']']: dateUtil.toTimeStr(dateUtil.todayFMD()) });
  },

  toggleSwiper() {
    const { current, swiperDays } = this.data;
    const theDay = dateUtil.transformDateRow2Dict(swiperDays[current]);
    const dir = this.getDirection();
    let oday = '';

    if (dir == 'right') {
      oday = dateUtil.toTimeStr(dateUtil.getPrevDateInfo(theDay));
    } else if (dir == 'left') {
      oday = dateUtil.toTimeStr(dateUtil.getNextDateInfo(theDay));
    }

    swiperDays[(current + 1) % 2] = oday;

    this.setData({ swiperDays });
  },

  getDirection() {
    const { dx } = this.data;

    return dx == 0 ? 
              null : 
              dx > 0 ? 'left' : 'right';
  },

})
