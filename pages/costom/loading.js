const app = getApp();
let host = app.globalData.host;
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: host + 'miniprogram/Apply_car/applyCarLately',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success(res) {
        let data = res.data.data;
        let status = data.status;
        wx.setStorageSync('data', data);    // 将最近一单数据存储到本地
        if(status === '完成') {
          wx.redirectTo({
            url: './costom',
          });
        } else {
          wx.redirectTo({
            url: './wait4Verifying/wait4Verifying?status=' + status,
          });
        }
      }
    })
  },
})