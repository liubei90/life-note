const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const systemInfo = wx.getSystemInfoSync();

function getScala() {
  const screenWidth = systemInfo.screenWidth;
  return 750 / screenWidth;
}

function getScreenWidth() {
  return systemInfo.screenWidth;
}


module.exports = {
  formatTime,
  getScala,
  getScreenWidth,
}
