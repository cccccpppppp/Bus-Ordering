// pages/admin/refuse/refuse.js
const app = getApp();
var host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    id: ""
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  back(e) {
    var that = this;
    this.data.input = e.detail.value.input;
    wx.request({
      url: host + 'miniprogram/Admin/check',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        id: that.data.id,
        opinion: 2,
        fail_cause: that.data.input,
      },
      success(res){
        if (res.data.msg == "ok")
        {
          //提示成功
          wx.showToast({
            title: '已拒绝该申请',
            icon: 'success',
            duration: 3000,
          });
          setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
          }, 2000);
        }
        else {
          //提示失败原因
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  },
})