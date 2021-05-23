// app.js

const { wxLogin } = require('./apis/auth');

App({
  onLaunch() {
    console.log('app.onLaunch');

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wxLogin(res.code).then((res) => {
          console.log('登录成功！', res);
          this.globalData.loginInfo = res;
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
