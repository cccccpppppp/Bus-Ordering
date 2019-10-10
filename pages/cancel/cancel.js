const request = require("../../utils/request.js");
let post = request.post;
Page({
  data: {
    counter: 0,
    apply_id: null
  },
  onLoad: function (options) {
    this.setData({ apply_id: options.apply_id });
  },
  
  cancel(e) {
    console.log(e.detail.value.input)
    let that = this;
    let param = {
      apply_id: this.data.apply_id,
      cancel_cause: e.detail.value.input
    }
    wx.showModal({
      title: '提示',
      content: '确认取消本次订单？',
      success(res) {
        if(res.confirm) {
          wx.showLoading({ mask: true });
          post("miniprogram/Common/cancel", param)
            .then(res => {
              if(res.status === 0){
                wx.hideLoading();
                wx.showToast({
                  icon: 'success',
                  title: res.data.msg,
                })
              } else if(res.status === 1) {
                setTimeout(wx.navigateBack, 1500);
              }
            })
            .catch(e => {
              wx.hideLoading()
              setTimeout(wx.navigateBack, 1500);
            })
        }
      }
    })
  },
  //文本域计数器
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      counter: t_text
    });
  }
})