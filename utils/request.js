const app = getApp();
let host = app.globalData.host;
// 登录函数
const login = () => {
  return new Promise(function (resolve, reject) {
    // 获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        wx.request({
          url: host + "miniprogram/Common/login",
          data: { code: res.code },
          method: "POST",
          success(res) {
            let sessionid = res.data.data.sessionid;
            if (res.statusCode === 200) {
              if (res.data.status === 0) {
                // 将sessionid存储到本地
                wx.setStorage({
                  key: "sessionid",
                  data: sessionid,
                })
                app.globalData.sessionid = sessionid;
                // app.globalData.user_info = res.data.data;
                resolve();
              }
              else {
                // 显示错误信息
                wx.showModal({
                  title: '请求错误',
                  content: '错误信息：' + res.data.msg,
                  showCancel: false
                })
                reject();
              }
            }
            else {
              wx.showModal({
                title: '请求错误',
                content: '错误代码：' + res.statusCode,
                showCancel: false
              })
              reject();
            }
          },
          fail() {
            // 一般请求failed都是因为超时
            wx.showModal({
              title: '请求超时',
              content: 'request failed',
              showCancel: false
            })
            reject();
          }
        })
      }
    }) // 梦幻花括号就让它藏在模块里吧
  })
}

/**
* promise化POST请求.
* @param {string} url - 去掉host的请求url.
* @param {object} param - 请求参数，默认参数为空对象，如果app.globalData.sessionid不为null则添加sessionid参数.
*/
const post = (url, param = {}) => {
  // if (app.globalData.sessionid) {
  //   param.sessionid = app.globalData.sessionid;  // 如果全局变量中sessionid有值，把它加入param对象中
  // }
  param.sessionid = app.globalData.sessionid || wx.getStorageSync('sessionid'); // 将内存或内部存储的sessionid加入param对象
  let p = new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      method: 'POST',
      data: param,
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.status === 0) {
            resolve(res.data); // 如果状态码为200且data.status为0时promise对象状态为resolved
          }
          else if (res.data.msg.indexOf("登录") !== -1) {  // 如果返回信息中包含字符"登录"则重新登录
            // 弹出未登录提示框，用户点击确认后重连
            // wx.showModal({
            //   title: '请求错误',
            //   content: '错误信息：' + res.data.msg,
            //   showCancel: false,
            //   success() {
            //     wx.showLoading();
            //     // 登录
            //     login()
            //       .then(() => {
            //         wx.hideLoading();
            //         reject();
            //       })
            //       .catch(() => wx.hideLoading())
            //   }
            // })

            // 显示正在登陆
            wx.showLoading({
              title: '登陆中...',
              mask: true
            })
            // 登录
            login()
              .then(() => {
                // wx.hideLoading();
                wx.showToast({
                  icon: 'success'
                })
                reject();
              })
              .catch(() => {
                // wx.hideLoading();
                wx.showToast({
                  icon: 'fail'
                })
              })
          }
          else {
            // 显示错误信息
            wx.showModal({
              title: '请求错误',
              content: '错误信息：' + res.data.msg,
              showCancel: false
            })
            reject(res.data); // 如果data.status不为0则promise对象状态为rejected
          }
        }
        else {
          wx.showModal({
            title: '请求错误',
            content: '错误代码：' + res.statusCode,
            showCancel: false
          })
          reject(res.statusCode); // 状态码不为200则rejected
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
  // if (app.globalData.sessionid) {
  //   param.sessionid = app.globalData.sessionid;
  // }
  param.sessionid = app.globalData.sessionid || wx.getStorageSync('sessionid'); // 将内存或内部存储的sessionid加入param对象
  let p = new Promise(function (resolve, reject) {
    wx.request({
      url: host + url,
      method: 'GET',
      data: param,
      success(res) {
        if (res.statusCode === 200) {
          if (res.data.status === 0) {
            resolve(res.data); // 如果状态码为200且data.status为0时promise对象状态为resolved
          }
          else if (res.data.msg.indexOf("登录") !== -1) {  // 如果返回信息中包含字符"登录"则重新登录
            // 显示正在登陆
            wx.showLoading({
              title: '登陆中...',
              mask: true
            })
            // 登录
            login()
              .then(() => {
                // wx.hideLoading();
                wx.showToast({
                  icon: 'success'
                })
                reject();
              })
              .catch(() => {
                // wx.hideLoading();
                wx.showToast({
                  icon: 'fail'
                })
              })
          }
          else {
            // 显示错误信息
            wx.showModal({
              title: '请求错误',
              content: '错误信息：' + res.data.msg,
              showCancel: false
            })
            reject(res.data); // 如果data.status不为0则promise对象状态为rejected
          }
        }
        else {
          wx.showModal({
            title: '请求错误',
            content: '错误代码：' + res.statusCode,
            showCancel: false
          })
          reject(res.statusCode); // 状态码不为200则rejected
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

// 还可以解耦和简化模块: 把网络请求功能单独封装为一个函数, 再让post() myGet() login()分别调用这一函数(坑)

module.exports = {
  post: post,
  myGet: myGet
}
