//index.js
//获取应用实例
const app = getApp();
var host = app.globalData.host;

Page({
  data: {

  },
  onLoad: function() {
    
  },

  //跳转到预定人员页面
  toCostom: () => {
    // 获取用户类型
        wx.request({
          url: host + 'miniprogram/Predetermine/register',
          method: 'POST',
          data: {
            sessionid: wx.getStorageSync("sessionid")
          },
          success(res) {
            if (res.msg === "ok" || "重复注册") {
              wx.redirectTo({
                url: '../costom/costom',
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          },
          fail() {
            wx.showToast({
              title: '网络异常',
              icon: 'none'
            })
          }
        })
  },

  //跳转到申请授权页面
  to_req_permission: () => {
    wx.redirectTo({
      url: '../permission/permission',
    })
  }
})