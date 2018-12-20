const app = getApp();
var host = app.globalData.host;
// let fail_cause = '拒绝理由:' + wx.getStorageSync('applyCarLately').fail_cause;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {
      '未审核': ['waiting', '提交成功', '等待管理员审核……'],
      '审核通过': ['info', '审核通过', '等待司机确认订单'],
      '审核未通过': ['warn', '审核未通过', ''],
      '司机已确认': ['waiting', '司机已确认', ''],
      '完成': ['success', '已完成', '请对本次行程评价']
    },
    msgIndex: '已提交',
    is_can_comment: 0,
  },

  toIndex: () => {
    wx.redirectTo({
      url: '../../costom/costom'
    })
  },

  toRate: function () {
    wx.navigateTo({
      url: '../rate/rate',
    })
  },

  // 跳转到order页面
  navOrder: () => {
    wx.navigateTo({
      url: '../order/order',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fail_cause = '拒绝理由:' + wx.getStorageSync('applyCarLately').fail_cause;
    this.setData({
      msgIndex: options.status,
      ['msg.审核未通过[2]']: fail_cause
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showLoading();
    wx.request({
      url: host + 'miniprogram/Apply_car/applyCarLately',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        var data = res.data.data;
        let fail_cause = '拒绝理由:' + data.fail_cause;
        wx.setStorageSync('applyCarLately', data);    // 将最近一单订单的data存储到本地
        that.setData({
          msgIndex: data.status,
          is_can_comment: data.is_can_comment,
          ['msg.审核未通过[2]']: fail_cause
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
  }
})