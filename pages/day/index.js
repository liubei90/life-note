// index.js
// 获取应用实例
const app = getApp();
import plugin from '../../components/calendar-v3/plugins/index';
import todo from '../../components/calendar-v3/plugins/todo';
import flower from '../../components/calendar-v3/plugins/flower';
import solarLunar from '../../components/calendar-v3/plugins/solarLunar/index';
import { dateUtil } from '../../components/calendar-v3/utils/index'
const { getNotes,
  postNote,
  getNote,
  putNote,
  deleteNote, } = require('../../apis/notes');
const { getScala, getScreenWidth } = require('../../utils/util');


plugin.use(todo).use(solarLunar).use(flower);


Page({
  data: {
    calendarConfig: {
      theme: 'elegant',
      hideHeader: true,
      onlyShowCurrentMonth: true,
      autoChoosedWhenJump: true,
      // showLunar: true,
    },

    loading: false, // 加载数据
    current: 0,
    currentNotes: null,
    fieldAnimation: {},
    isInAddNote: false,
    isInAnimation: false,
    isError: false,
    inputText: '',
    delayBlur: false,
    refreshAnimation: {},
  },
  onLoad(options) {
    console.log('--pages/day/index.onLoad', options);

    this.setData({
      options,
    });
  },

  onReady() {
    console.log('--pages/day/index.onReady');

    const { day } = this.data.options;
    this.calendar = this.selectComponent('#calendar').calendar;

    if (day) {
      this.jump(dateUtil.transformDateRow2Dict(day));
    } else {
      this.getDayNotes(dateUtil.todayFMD());
    }
  },

  onShareAppMessage() {

  },

  handleTransition(e) {
    if (this.data.loading) return;
    console.log('----pages/day/index.handleTransition');

    const { dx, dy } = e.detail;

    this.setData({ dx, dy });
  },

  handleAnimationFinish(e) {
    console.log('----pages/day/index.handleAnimationFinish');

    const { current, source } = e.detail;
    const { dx } = this.data;

    if (source != 'touch') return;

    this.setData({ current });

    if (dx > 0) {
      this.jumpNext();
    } else {
      this.jumpPrev();
    }
  },

  /**
   * 时间改变
   */
  handleAfterTapDate(e) {
    console.log('----pages/day/index.handleAfterTapDate', e.detail);

    this.getDayNotes(e.detail);
  },

  jumpPrev() {
    const day = this.calendar.getSelectedDates()[0];

    this.jump(dateUtil.getPrevDateInfo(day));
  },

  jumpNext() {
    const day = this.calendar.getSelectedDates()[0];

    this.jump(dateUtil.getNextDateInfo(day));
  },

  jump(day) {
    if (!this.calendar) return;

    this.calendar.jump(day).then(() => { this.getDayNotes(day); });
  },

  getDayNotes(day) {
    if (!this.calendar) return;

    console.log('----pages/day/index.handleAfterTapDate', day);

    this.setData({
      // loading: true,
      // currentNotes: [],
    });

    getNotes({ theday: dateUtil.toTimeStr(day) }).then((res) => {
      this.setData({
        isError: false,
        loading: false,
        currentNotes: res.data,
      });
    }).catch((err) => {
      this.setData({
        isError: true,
        loading: false,
        currentNotes: [],
      });

      // wx.showToast({ title: err && err.msg || '获取数据失败', icon: 'none' });
    }).finally(() => {
      this.processFlowers();
    });
  },

  /**
   * 更新当前日期小红花
   */
  processFlowers() {
    const { currentNotes = [] } = this.data;
    const day = this.calendar.getSelectedDates()[0];
    let flower = 0;

    if (currentNotes.some(item => item['flower'] == 1)) {
      flower = 1;
    }

    if (currentNotes.some(item => item['flower'] == 2)) {
      flower = 2;
    }

    if (flower) {
      this.calendar.setFlowers({
        dates: [
          {
            year: day['year'],
            month: day['month'],
            date: day['date'],
            flowSrc: '/assets/flower' + flower + '.png',
          }
        ]
      });
    } else {
      this.calendar.deleteFlowers([
        {
          year: day['year'],
          month: day['month'],
          date: day['date'],
        }
      ]);
    }

  },

  handleItemChange() {
    const day = this.calendar.getSelectedDates()[0];

    this.getDayNotes(day);
  },

  /**
   * 点击刷新
   */
  handleRefresh() {
    this.setData({
      refreshAnimation: this.getRefreshAnimation().export(),
    }, () => {
      setTimeout(() => {
        this.setData({
          refreshAnimation: this.clearRefreshAnimation().export(),
        });
      }, 1000);
    });

    this.handleItemChange();
  },

  getRefreshAnimation() {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    });
    animation.rotate(180).step()
      .rotate(360).step();

    return animation;
  },

  clearRefreshAnimation() {
    const animation = wx.createAnimation({
      duration: 1,
      timingFunction: 'step-end',
    });
    animation.rotate(0).step();

    return animation;
  },

  /**
   * 添加笔记
   */
  handleAddNote() {
    const { inputText, isInAnimation, isInAddNote } = this.data;

    if (isInAnimation) return;
    console.log('----pages/day/index.handleAddNote', isInAnimation, isInAddNote);

    if (isInAddNote) {
      if (!String(inputText).trim()) {
        return;
      };

      this.setData({
        delayBlur: true,
      })

      this.addNote().then(() => {
        this.handleItemChange();
        this.toggleNotePanel();
      });
    } else {
      this.toggleNotePanel();
    }
  },

  addNote() {
    let { inputText } = this.data;

    inputText = String(inputText).trim();

    console.log('----pages/day/index.addNote', inputText);

    if (!inputText) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return Promise.reject();
    }

    const day = this.calendar.getSelectedDates()[0];

    return postNote({
      theday: dateUtil.toTimeStr(day),
      content: inputText,
    }).then((res) => {
      wx.showToast({ title: '添加成功', icon: 'none' });
    }).catch((err) => {
      wx.showToast({ title: err && err.msg || '添加失败', icon: 'none' });
      throw err;
    });
  },

  toggleNotePanel() {
    return new Promise((resolve, reject) => {
      const { inputText, isInAnimation, isInAddNote } = this.data;
      this.setData({
        isInAnimation: true,
        inputText: isInAddNote ? inputText : '',
      });

      this.setData({
        fieldAnimation: this.getAnimation(isInAddNote).export(),
      }, () => {
        setTimeout(() => {
          this.setData({
            isInAddNote: !isInAddNote,
            isInAnimation: false,
            delayBlur: false,
          });

          resolve();
        }, 300)
      });
    });
  },

  /**
   * 失去焦点，收起输入框
   * NOTE: 点击发送按钮导致的blur事件，应该阻止blur事件
   * 进测算，blur事件执行100+m后才会执行按钮tap事件
   * 使用touchstart替换tap事件，可以在blur之前执行
   */
  handleBlur() {
    const { delayBlur, inputText, isInAnimation, isInAddNote } = this.data;

    if (isInAnimation) return;

    if (delayBlur) return this.setData({ delayBlur: false, });

    console.log('----pages/day/index.handleBlur');

    this.toggleNotePanel();
  },

  /**
   * 接受输入内容
   */
  handleInput(e) {
    this.setData({
      inputText: e.detail.value,
    });
  },

  getAnimation(isInAddNote) {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    });
    animation.width(isInAddNote ? 0 : (getScreenWidth() - 80)).step();

    return animation;
  },

})
