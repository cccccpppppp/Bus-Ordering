//app.js
App({
  onLaunch: function() {
    
  },
  globalData: {
    userInfo: null,
    host: "http://47.107.172.101/"
  },

  //定义查看订车订单状态的方法
  applyCarLately: function () {
    wx.showLoading();
    wx.request({
      url: this.globalData.host + 'miniprogram/Predetermine/applyCarLately',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        var data = res.data.data;
        var msg = res.data.msg;
        var dic = {
          '已提交': './wait4Verifying/wait4Verifying',
          '审核通过': './success/success',
          '审核未通过': './faild/faild',
          '完成': ''
        }
        if (data === null) {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        } else {
          wx.redirectTo({
            url: dic[data.status],
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
      },
      complete: function (res) { },
    })
  },
})