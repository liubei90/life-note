// index.js
// 获取应用实例
const app = getApp();
import plugin from '../../components/calendar-v3/plugins/index';
import todo from '../../components/calendar-v3/plugins/todo';
import flower from '../../components/calendar-v3/plugins/flower';
import solarLunar from '../../components/calendar-v3/plugins/solarLunar/index';
import { dateUtil } from '../../components/calendar-v3/utils/index'
import { wxLogin } from '../../apis/auth';


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

    this.calendar.setFlowers({
      dates: [
        {
          year: 2021,
          month: 5,
          date: 21,
          flowSrc: '/assets/flower1.png',
        }
      ]
    });
  },

  onShareAppMessage() {

  },

  handleTransition(e) {
    if (this.data.loading) return;
    console.log('----pages/day/index.handleTransition');

    const { dx, dy } = e.detail;

    this.setData({ dx, dy, loading: true });
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
   * 添加笔记
   */
  handleAddNote() {
    const { isInAnimation, isInAddNote } = this.data;
    console.log('----pages/day/index.handleAddNote', isInAnimation, isInAddNote);

    if (isInAnimation) return;

    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    });
    animation.width( isInAddNote ? 0 : 200).step();

    this.setData({
      isInAnimation: true,
    });

    this.setData({
      fieldAnimation: animation.export(),
    }, () => {
      setTimeout(() => {
        this.setData({
          isInAddNote: !isInAddNote,
          isInAnimation: false,
        });
      }, 300)
    })
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

    // this.setData({ loading: true, });

    console.log('----pages/day/index.handleAfterTapDate', day);

    setTimeout(() => {
      this.setData({ loading: false, currentNotes:  [
        { content: '这是第一个笔记', status: 1, is_delete: 0, },
        { content: '这是第二个笔记', status: 1, is_delete: 0, },
        { content: '这是第三个笔记', status: 1, is_delete: 0, },
      ] });
    }, 1000);
  },

})
