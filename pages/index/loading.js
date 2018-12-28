const app = getApp();
let host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        // console.log(res.code);
        wx.request({
          url: host + "miniprogram/Common/login",
          data: {
            code: res.code
          },
          method: "POST",
          success(res) {
            wx.setStorageSync("sessionid", res.data.data.sessionid); // 将sessionid存储到本地
            //获取用户类型
            wx.request({
              url: host + 'miniprogram/Common/info',
              data: {
                sessionid: wx.getStorageSync("sessionid")
              },
              success: res => {
                let user_info = res.data.data;
                wx.setStorageSync("user_info", user_info); // 将用户信息存储到本地
                wx.redirectTo({
                  url: './index',
                });
              },
              fail() {
                wx.showModal({
                  title: '网络异常',
                  content: ''
                })
              }

            })
          },
          fail() {
            wx.showModal({
              title: '登陆异常'
            })
          }

        })
      }
    })
    
  }
})