const app = getApp();
var host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identities: ["管理员", "司机"],
    identityIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //选择器改变事件
  bindIdentityChange: function (e) {
    this.setData({
      identityIndex: e.detail.value
    })
    console.log(e.detail.value)
  },

  req_permission: function (e) {
    var that = this;
    var value = e.detail.value;
    var phone = value.phone;
    var name = value.name;
    var type = this.data.identityIndex;
    wx.showLoading();
    wx.request({
      url: host + 'miniprogram/Common/accredit',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        name: name,
        phone: phone,
        type: type
      },
      method: 'POST',
      success: res => {
        wx.hideLoading();
        if (res.data.msg === "ok") {
          wx.showToast({
            title: '',
          })
          wx.redirectTo({
            url: './wait4Verifying',
          })
        }
        else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }

      }
    })
  }
})