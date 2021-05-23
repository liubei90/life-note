const { api, basicRequest } = require('../api');


function getUserDetail() {}

function wxLogin(code) {
  return basicRequest({
    url: api.wx_login + '?code=' + code,
  }).then((res) => {
    // 登录成功
    if (res && res.status == true) {
      wx.setStorageSync('loginInfo', res.data);
    } else {
      wx.removeStorageSync('loginInfo');
    }

    return res.data;
  }).catch(() => {
    wx.removeStorageSync('loginInfo');
    throw Error();
  });
}

module.exports = {
  getUserDetail,
  wxLogin,
}
