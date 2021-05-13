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

//     resolve(`
// # 2021-05-13
// 共情能力

// > 一 赢得争论的唯一方法是避免争论
// > 二 尊重对方的观点，永远别说你不对
// > 三 假如你错了，立刻真心实意的承认
// > 四 先说友善的话，气氛对了之后再说别的
// > 五 先让对方回答 对，是的
// > 六 尽量让对方多说
// > 七 让对方感觉，那是他自己的主意
// > 八 努力从对方视角看问题，要诚实
// > [人性的弱点]()

// # 2021-05-12

// > 一 真的喜欢别人
// > 二 你的一笑值千金
// > 三 记住对方的名字
// > 四 倾听 鼓励对方多聊自己
// > 五 聊对方感兴趣的话题
// > 六 使对方感到重要的，要真心实意
// > [人性的弱点]()

// # 2021-05-11

// > 爱的反面从来不是冲突，（其实冲突也是一种联结）爱的反面是漠然
// > [当一对情侣无话可说的时候，该怎么做？](https://www.zhihu.com/question/280272233/answer/673024647)
// `);

  });
}

module.exports = {
  getNotes,
}