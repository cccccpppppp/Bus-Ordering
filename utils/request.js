const app = getApp();
let host = app.globalData.host;
/**
* promise化POST请求.
* @param {string} url - 去掉host的请求url.
* @param {object} param - 请求参数，默认参数为空对象，如果app.globalData.sessionid不为null则添加sessionid参数.
*/
const post = (url, param = {}) => {
  if (app.globalData.sessionid){
    param.sessionid = app.globalData.sessionid;
  }
  let p = new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      method: 'POST',
      data: param,
      success: res => {
        if(res.statusCode === 200) {
          resolve(res.data);
        }
        else {
          wx.showModal({
            title: '请求错误',
            content: '错误代码：' + res.statusCode,
            showCancel: false
          })
          reject(res.statusCode);
        }
      },
      fail() {
        wx.showModal({
          title: '请求错误',
          content: 'request failed',
          showCancel: false
        })
        reject('请求超时');
      }
    });
  })
  return p;
}

/**
* promise化GET请求.
* @param {string} url - 去掉host的请求url.
* @param {object} param - 请求参数，默认参数为空对象，如果app.globalData.sessionid不为null则添加sessionid参数.
*/
const myGet = (url, param = {}) => {
  if (app.globalData.sessionid) {
    param.sessionid = app.globalData.sessionid;
  }
  let p = new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      method: 'GET',
      data: param,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.data);
        }
        else {
          wx.showModal({
            title: '请求错误',
            content: '错误代码：' + res.statusCode,
            showCancel: false
          })
          reject(res.statusCode);
        }
      },
      fail() {
        wx.showModal({
          title: '请求错误',
          content: 'request failed',
          showCancel: false
        })
        reject('请求超时');
      }
    });
  })
  return p;
}

module.exports = {
  post: post,
  myGet: myGet
}
