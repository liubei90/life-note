const { storeLoginInfo, getAccessToken } = require('../storage');
const { api, basicRequest } = require('../api');


function getUserDetail() {}

function wxLogin(code) {
  return basicRequest({
    url: api.wx_login + '?code=' + code,
  }).then((res) => {
    // 登录成功
    if (res && res.status == true) {
      storeLoginInfo(res.data);
    } else {
      storeLoginInfo();
    }

    return res.data;
  }).catch(() => {
    storeLoginInfo();
    throw Error();
  });
}



module.exports = {
  getUserDetail,
  wxLogin,
}
