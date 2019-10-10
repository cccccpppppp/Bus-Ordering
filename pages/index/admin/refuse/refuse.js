const app = getApp();
var host = app.globalData.host;
const request = require("../../../../utils/request.js");
let post = request.post;
Page({
  data: {
    input: "",
    id: "",
    counter: 0
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    });
  },

  back(e) {
    var that = this;
    this.data.input = e.detail.value.input;
    let param = {
      apply_id: that.data.id,
      status: 2, // 审核未通过
      fail_cause: that.data.input, //未通过原因
      is_can_comment: 0
    }
    post("miniprogram/Admin/check", param)
      .then((res) => {
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 3000
        });
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 2000);
      })
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
