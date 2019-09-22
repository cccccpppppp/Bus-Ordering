const app = getApp();
let host = app.globalData.host;
const request = require("../../../utils/request.js");
let post = request.post;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {
      name: '',
      phone: '',
      sessionid: null
    }
  },
  modifyInfo: function (e) {
    let that = this;
    let sessionid = app.globalData.sessionid || wx.getStorageSync('sessionid');
    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    wx.showModal({
      content: "你的信息将被修改",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          post("miniprogram/Common/setInfo", {
            name: name,
            phone: phone
          })
            .then(res => {
              // wx.hideLoading();
              wx.showToast({
                title: res.msg,
                icon: 'success'
              });
            })
            .catch(wx.hideLoading)
        }
      }
    });
  },

  onLoad: function (options) {
    this.setData({
      myInfo: app.globalData.user_info,
    })
  },

  onUnload() {
    post("miniprogram/Common/info")
      .then(res => app.globalData.user_info = res.data)
  }
});
