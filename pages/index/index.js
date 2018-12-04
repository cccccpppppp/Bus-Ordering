//index.js
//获取应用实例
const app = getApp();
var host = app.globalData.host;

Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function () {

  },

  onLoad: function () {
    var that = this;
    //域名地址
    wx.login({
      success(res) {
        console.log(res.code);
        wx.request({
          url: host + "miniprogram/Common/login",
          data: {
            code: res.code
          },
          method: "POST",
          success(res) {
            wx.setStorageSync("sessionid", res.data.data.sessionid); //将sessionid存储到本地
            console.log(res.data);
          },
          fail() {
            console.log('login()异常')
          }
          
        })
      }
    })
  },

  //跳转到预定页面
  toCostom: () => {
    // 获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success(res) {
        wx.request({
          url: host + 'miniprogram/Predetermine/register',
          method: 'POST',
          data: {
            sessionid: wx.getStorageSync("sessionid")
          },
          success(res) {
            console.log(res.data.msg)
            if (res.msg === "ok" || "重复注册") {
              wx.redirectTo({
                url: '../costom/costom',
              })
            }
          }
        })
      }
    })
  }

})