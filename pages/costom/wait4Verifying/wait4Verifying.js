const app = getApp();
var host = app.globalData.host;
var req_status = function () {
  var that = this;
  wx.showLoading();
  wx.request({
    url: host + 'miniprogram/Predetermine/applyCarLately',
    data: {
      sessionid: wx.getStorageSync("sessionid")
    },
    method: 'GET',
    success: function (res) {
      wx.hideLoading();
      var data = res.data.data;
      that.setData({
        msgIndex: data.status
      })
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
        icon: 'none'
      })
    },
  })
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg :{
      '已提交': ['waiting', '提交成功', '等待管理员审核……'],
      '审核通过': ['info', '审核通过', '司机正在路上……'],
      '审核未通过': ['warn', '审核未通过',''],
      '完成': ['success', '已完成', '请对本次行程评价']
    },
    msgIndex: '已提交'
  },

  toRate: function() {
    wx.redirectTo({
      url: '../rate/rate?id=' + this.data.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msgIndex: options.status,
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: req_status,

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})