const app = getApp();
var host = app.globalData.host;
// let fail_cause = '拒绝理由:' + wx.getStorageSync('applyCarLately').fail_cause;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg: [
      ["waiting", "提交成功", "等待管理员审核"],
      ["info", "审核通过", "等待司机确认订单"],
      ["warn", "最近一单申请审核未通过", ""],
      ["waiting", "部分司机已确认", ""],
      ["waiting", "所有司机已确认", ""],
      ["warn", "最近一次订单已被司机取消", ""],
      ["success", "已完成", "请对本次行程评价"]
    ],
    msgIndex: 0,
    driverListIndex: 0,
    driverList: [],
    is_can_comment: 0
  },

  toIndex: () => {
    wx.redirectTo({
      url: "../../costom/costom"
    });
  },

  toRate: function() {
    wx.navigateTo({
      url: "../rate/rate"
    });
  },

  callDriver: (e) => {
    let applyCarLately = wx.getStorageSync("applyCarLately");
    wx.makePhoneCall({
      phoneNumber: applyCarLately.driver.phone[e.detail.value]//待确认
    });
  },

  // 跳转到order页面
  navOrder: () => {
    wx.navigateTo({
      url: "../order/order"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let applyCarLately = wx.getStorageSync("applyCarLately");
    let fail_cause = "拒绝理由：" + applyCarLately.fail_cause;       // 管理员拒绝理由
    let status = applyCarLately.status;
    let cancel_cause = "取消理由：" + applyCarLately.cancel_cause;  // 司机取消理由
    let driverList = applyCarLately.driver//待确认
    this.setData({
      msgIndex: status,
      driverList: driverList,
      ["msg.[2][2]"]: fail_cause,
      ["msg.[5][2]"]: cancel_cause
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    wx.showLoading();
    wx.request({
      url: host + "miniprogram/Apply_car/applyCarLately",
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      method: "GET",
      success: function(res) {
        wx.hideLoading();
        var data = res.data.data;
        let fail_cause = "拒绝理由：" + data.fail_cause;
        let cancel_cause = "取消理由：" + data.cancel_cause;
        let driverList = data.driver//待确认
        wx.setStorageSync("applyCarLately", data); // 将最近一单订单的data存储到本地
        that.setData({
          msgIndex: data.status,
          is_can_comment: data.is_can_comment,
          driverList: driverList,
          ["msg.[2][2]"]: fail_cause,
          ["msg.[5][2]"]: cancel_cause,
        });
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: "网络异常",
          icon: "none"
        });
      }
    });
    wx.stopPullDownRefresh();
  }
});
