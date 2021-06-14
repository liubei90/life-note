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
const { throttle, debounce } = require('../../utils/lodash');


const mdStr = `
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题

>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容

**这是加粗的文字**
*这是倾斜的文字*
***这是斜体加粗的文字***
~~这是加删除线的文字~~

---
----
***
*****

![图片alt](/assets/qinzi_chengzhang@3x.png)

[简书](https://jianshu.com)

- 列表内容
+ 列表内容
* 列表内容

1. 列表内容
2. 列表内容
3. 列表内容

表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容

\`代码内容\`

`;


Page({
  data: {
    isEdit: false, // 编辑模式
    dayNotes: {},
    dayText: '',
    current: 0,
    oldCurrent: 0,
    swiperDays: ['', '', ''],
    dx: 0,
    autoFocus: false,
    simpleMode: true, // 简洁模式


    articles: {}, // 每日一文

    // scrollTop: 0,
    // scrollHeight: 0,
    moveStartY: -1, // 触摸开始
    moveEndY: -1, // 触摸结束

    sentenceAnimation: {},
    articleAnimation: {},
  },

  onLoad() {
    this.pageInit();
  },

  // onShareAppMessage() {
  //   return {
  //     title: '日读笔记',
  //     path: '/pages/daily_sentence/index',
  //   }
  // },

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
      wx.hideLoading();
    }).catch((res) => {
      wx.hideLoading();
      wx.showToast({ title: res && res.msg || '接口错误', icon: 'none', });
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

  // 添加一句
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

  // 添加一章
  handleEditArticle() {},

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
    }).catch((res) => {
      wx.showToast({ title: res && res.msg || '接口错误', icon: 'none', });
    }).finally(() => {
      this.setData({ isEdit: false, dayText: '', autoFocus: false, });
      wx.hideLoading();
    });

  },

  // bindscroll({detail: { scrollTop, scrollHeight }}) {
  //   this.setData({ scrollTop, scrollHeight });
  // },

  bindtouchmove({ changedTouches }) {
    if (changedTouches && changedTouches.length) {
      const { clientX, clientY } = changedTouches[0];
      const { moveStartY, moveEndY } = this.data;

      if (moveStartY == -1) {
        this.setData({ moveStartY: clientY });
      }

      this.setData({ moveEndY: clientY });
      this.moveEnd();
    }
  },

  moveEnd: debounce(function() {
    console.log('----pages/daily_sentence/index.moveEnd');
    const { moveStartY, moveEndY } = this.data;
    const offset = moveEndY - moveStartY;

    this.setData({ moveStartY: -1, moveEndY: -1 });

    if (offset > 20) {
      this.setData({ simpleMode: true });
      this.toggleSimpleMode();
    } else if (offset < -20) {
      this.setData({ simpleMode: false });
      this.toggleSimpleMode();
    }
  }, 500),

  toggleSimpleMode() {
    const { simpleMode } = this.data;
    const sentenceAnimation = wx.createAnimation({});
    const articleAnimation = wx.createAnimation({});

    if (simpleMode) {
      sentenceAnimation.top(0).step();
      articleAnimation.top('100%').step();
    } else {
      sentenceAnimation.top('-100%').step();
      articleAnimation.top(0).step();
    }

    this.setData({
      sentenceAnimation: sentenceAnimation.export(),
      articleAnimation: articleAnimation.export(),
    });

    setTimeout(() => {
      wx.setNavigationBarTitle({ title: simpleMode ? '一句' : '一章' });
    }, 400);
  },

  noop() {},

  getDayNote() {
    const { swiperDays, current } = this.data;
    return getDailySentences({
      theday: swiperDays[current],
    }).then((res) => {
      if (res.data && res.data.length) {
        const daily = res.data[0];
        const key = 'dayNotes.' + dateUtil.toTimeStr(dateUtil.transformDateRow2Dict(daily['theday']));

        this.setData({
          [key]: daily,
        });
      }
    });
  },

  handleChange(e) {
    console.log('----daily_sentence.handleChange', e.detail);

    if (e.detail.source == 'touch') {
      this.setData({
        oldCurrent: this.data.current,
        current: e.detail.current,
      });

      this.toggleSwiper();
    }

    this.setData({ isEdit: false });
  },

  // 滑动swiper的处理
  initSwiper() {
    const { current, swiperDays } = this.data;

    this.setData({ ['swiperDays[' + current + ']']: dateUtil.toTimeStr(dateUtil.todayFMD()) });
  },

  toggleSwiper() {
    const { current,  oldCurrent, swiperDays } = this.data;
    const theDay = dateUtil.transformDateRow2Dict(swiperDays[oldCurrent]);
    const dir = this.getDirection();
    let oday = '';

    if (!dir) return;

    if (dir == 'left') {
      oday = dateUtil.toTimeStr(dateUtil.getPrevDateInfo(theDay));
    } else if (dir == 'right') {
      oday = dateUtil.toTimeStr(dateUtil.getNextDateInfo(theDay));
    }

    swiperDays[current] = oday;

    this.setData({ swiperDays });
  },

  getDirection() {
    const { current, oldCurrent, swiperDays } = this.data;
    let dir = '';

    if (current > oldCurrent) {
      dir = (current == (swiperDays.length - 1) && oldCurrent == 0) ? 'left' : 'right';
    } else if (current < oldCurrent) {
      dir = (current == 0 && oldCurrent == (swiperDays.length - 1)) ? 'right' : 'left';
    }

    return dir;
  },

})
