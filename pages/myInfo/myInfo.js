Page({
  data: {
    myInfo: {
      "name": null,
      "phone": null,
      "type": null
    }
  },

  onLoad: function (options) {
    this.setData({
      myInfo: wx.getStorageSync('user_info')
    })
  },

})