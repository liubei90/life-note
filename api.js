const lifeNoteDomain = 'http://localhost:9301';


function basicRequest(options) {
  const { url, data, success, fail, complate } = options;

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
      complate: (res) => {
        console.log('--api.basicRequest', options, res);
        complate && complate(res);
      },
    });
  });
}

module.exports = {
  basicRequest,
  api: {
    note_md: 'https://wx-dev.lbliubei.cn/gitee/liubei90/life-note/note.md',
    user_detail: lifeNoteDomain + '/auth_wx/user_detail',
    wx_login: lifeNoteDomain + '/auth_wx/wx_login',
  }
}
