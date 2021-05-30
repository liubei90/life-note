function storeLoginInfo(info) {
  if (info) {
    wx.setStorageSync('loginInfo', info);
  } else {
    wx.removeStorageSync('loginInfo');
  }
}

function getAccessToken() {
  const loginInfo = wx.getStorageSync('loginInfo') || {};

  return loginInfo['access_token'];
}

function openId() {
  const loginInfo = wx.getStorageSync('loginInfo') || {};

  return loginInfo['openid'];
}

module.exports = {
  storeLoginInfo,
  getAccessToken,
  openId,
}