const app = getApp();
var host = app.globalData.host;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    input: "",
    id: "",
    t_text: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      sessionid: app.globalData.sessionid,
      id: options.id
    });
  },

  back(e) {
    var that = this;
    this.data.input = e.detail.value.input;
    wx.request({
      url: host + "miniprogram/Admin/check",
      data: {
        sessionid: that.data.sessionid,
        apply_id: that.data.id,
        status: 2, // 审核未通过
        fail_cause: that.data.input, //未通过原因
        is_can_comment: 0
      },
      success(res) {
        if (res.data.msg == "成功") {
          //提示成功
          wx.showToast({
            title: "已拒绝该申请",
            icon: "success",
            duration: 3000
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 2000);
        } else {
          //提示失败原因
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000
          });
        }
      }
    });
  },
  //文本域计数器
  bindText: function(e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      counter: t_text
    });
  }
});
