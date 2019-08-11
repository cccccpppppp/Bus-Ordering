const app = getApp();
let host = app.globalData.host;
Page({
  data: {
    myInfo: {},
    typeList: ['预订人员', '管理人员', '司机']
  },

  onLoad: function (options) {
    this.setData({
      myInfo: app.globalData.user_info
    })
  },

})