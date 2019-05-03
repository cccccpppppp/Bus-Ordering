const app = getApp();
let host = app.globalData.host;
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sessionid = app.globalData.sessionid;
    wx.request({
      url: host + 'miniprogram/Apply_car/applyCarLately',
      data: {
        sessionid: sessionid
      },
      success(res) {
        let data = res.data;
        let applyCarLately = data.data;
        wx.setStorageSync('applyCarLately', applyCarLately);    // 将最近一单数据存储到本地
        if(data.status == 0) {
          if ((applyCarLately.status === 6 && applyCarLately.is_can_comment) || (applyCarLately.status === 6 && applyCarLately.comment !== null)) {
            wx.redirectTo({
              url: './costom',
            });
          } else {
          let status = data.data.status;
          wx.redirectTo({
              url: './wait4Verifying/wait4Verifying?status=' + status,
            });
          }
        } else if (data.status == 1){
          wx.redirectTo({
            url: './costom',
          });
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none"
          });
        }
      }
    })
  },
})