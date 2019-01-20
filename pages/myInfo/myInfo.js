Page({
  data: {
    myInfo: {
      "name": null,
      "phone": null,
      "type": null
    },
    typeList: ['预订人员', '管理人员', '司机']
  },

  onLoad: function (options) {
    this.setData({
      myInfo: wx.getStorageSync('user_info')
    })
  },

})