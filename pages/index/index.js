const app = getApp();
let host = app.globalData.host;
const request = require("../../utils/request.js");
let post = request.post;
Page({
  data: {
    PageCur: 'gwyc',
    userType: 0,
    reqStatus: 'loading'
  },
  onLoad: function (options) {
    this.login();
  },
  onShow: function() {
    
  },
  // 登陆
  login() {
    let that = this;
    console.log('start wx.login()')
    //获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        post("miniprogram/Common/login", { code: res.code })
          .then(data => app.globalData.sessionid = data.data.sessionid)
          .then(data => post('miniprogram/Common/info'))
          .then(data => {
            app.globalData.user_info = data.data;
            that.setData({ reqStatus: 'success', userType: data.data.type })
          })
          .catch(e => that.setData({ reqStatus: 'fail' }))
      }
    })
  },
  // 重新加载页面
  reload() {
    this.setData({ reqStatus: 'loading' })
    this.login();
  },
  // 自定义tabBar切换方法
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})