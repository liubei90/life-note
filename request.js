const { api } = require('./api');

function getNotes() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: api.note_md,
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

    // 
    // resolve([
    //   { day: '2021-05-11', note: '爱的反面从来不是冲突，（其实冲突也是一种联结）爱的反面是漠然', origin: '当一对情侣无话可说的时候，该怎么做？', url: 'https://www.zhihu.com/question/280272233/answer/673024647' }
    // ]);
  });
}

module.exports = {
  getNotes,
}
