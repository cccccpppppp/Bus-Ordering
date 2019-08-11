const app = getApp();
let host = app.globalData.host;
Page({

  data: {
    user_info: {}
  },

  onLoad: function (options) {
    this.setData({ user_info: app.globalData.user_info });
  },
})