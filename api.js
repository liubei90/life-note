const { getAccessToken } = require('./storage');
const lifeNoteDomain = 'https://wx-dev.lbliubei.cn/life-note';
// const lifeNoteDomain = 'http://localhost:9301';
const lifeDailySentenceDomain = lifeNoteDomain;


/**
 * 捕获业务错误
 * @param {*} request 
 */
function catchStatusError(request) {
  return request.then((res) => {
    if (!res || !res.status) {
      console.error('----api.catchStatusError', res);

      throw res || new Error();
    };

    return res;
  });
}


function requestWithToken(options) {
  const accessToken = getAccessToken();

  if (!accessToken) return Promise.reject();

  const { header = {} } = options;

  header['Authorization'] = 'Bearer ' + accessToken;
  options['header'] = header;

  return catchStatusError(basicRequest(options));
}


function basicRequest(options) {
  const { url, data, success, fail, complete } = options;

  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (res) => {
        if (res.statusCode == 200) {
          success && success(res.data);
          resolve(res.data);
        } else {
          fail && fail(res.statusCode, res.data)
          reject(res.statusCode, res.data);
        }
      },
      fail: (err) => {
        fail && fail(null, err)
        reject(null, err);
      },
      complete: (res) => {
        console.log('--api.basicRequest', options, res);
        complete && complete(res);
      },
    });
  });
}

module.exports = {
  basicRequest,
  requestWithToken,
  lifeNoteDomain,
  lifeDailySentenceDomain,
  api: {
    note_md: 'https://wx-dev.lbliubei.cn/gitee/liubei90/life-note/note.md',
    user_detail: lifeNoteDomain + '/auth_wx/user_detail',
    wx_login: lifeNoteDomain + '/auth_wx/wx_login',
  }
}
