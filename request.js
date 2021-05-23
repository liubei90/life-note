const { api } = require('./api');

function getNotes() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api.note_md + '?t=' + Math.random(),
      success: (res) => {
        console.log(res);
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject();
        }
      },
      fail: () => {
        reject();
      },
    });
  });
}

module.exports = {
  getNotes,
}
