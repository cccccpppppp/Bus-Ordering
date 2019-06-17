const app = getApp();
const host = app.globalData.host;
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

  // 返回预车页面
  toIndex: () => {
    wx.redirectTo({
      url: "../../costom/costom"
    });
  },

  // 评价
  toRate: function() {
    wx.navigateTo({
      url: "../rate/rate"
    });
  },

  // 取消订单
  cancel() {
    let that = this;
    let applyCarLately = wx.getStorageSync('applyCarLately');
    wx.navigateTo({
      url: '../../deorder/cancel/cancel?id=' + applyCarLately.apply_id
    })
  },
  //拨打司机电话
  callDriver: (e) => {
    let applyCarLately = wx.getStorageSync("applyCarLately");
    let phoneNums = []
    for (let driver of applyCarLately.drivers) {
      phoneNums.push(driver.phone);
    }
    wx.makePhoneCall({
      phoneNumber: phoneNums[e.detail.value]
    });
  },

  // 跳转到order页面
  navOrder: () => {
    wx.navigateTo({
      url: "../order/order"
    });
  },
  /**
   * 更新最近一单信息中申请状态、拒绝理由、取消理由和是否可评论的值
   * @param {object} applyCarLately 
   */
  getItems: function(applyCarLately) {
    let fail_cause = "拒绝理由：" + applyCarLately.fail_cause;       // 管理员拒绝理由
    let status = applyCarLately.status;
    let cancel_cause = "取消理由：" + applyCarLately.cancel_cause;  // 司机取消理由
    let driverList = [];
    let is_can_comment = applyCarLately.is_can_comment;
    // 循环遍历接单司机的手机号码
    for (let driver of applyCarLately.drivers) {
      driverList.push(driver.name);
    }
    this.setData({
      msgIndex: status,
      driverList: driverList,
      ["msg.[2][2]"]: fail_cause,
      ["msg.[5][2]"]: cancel_cause,
      is_can_comment: is_can_comment
    });
  },
  // 上一单申请是完成状态时点击“我知道了”将hasRead值存储在本地，并跳转到首页
  getIt: function() {
    let hasRead = 1;
    wx.setStorageSync("hasRead", hasRead);
    this.toIndex();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({sessionid: app.globalData.sessionid});
    let applyCarLately = wx.getStorageSync("applyCarLately");
    this.getItems(applyCarLately);
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
        sessionid: that.data.sessionid
      },
      method: "GET",
      success: function(res) {
        wx.hideLoading();
        let applyCarLately = res.data.data;
        that.getItems(applyCarLately);
        wx.setStorageSync("applyCarLately", applyCarLately); // 将最近一单订单的data存储到本地
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: "网络异常",
          icon: "none"
        });
      }
    });
    
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  }
});
