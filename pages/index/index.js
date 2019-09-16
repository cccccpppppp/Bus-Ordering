import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxRefreshing, $wuxTail, $wuxHide } from '../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../utils/request.js");
let post = request.post;
Page({
  data: {
    userType: 0,  // 用户类型
    scrollTop: 0,  // wux-refresher组件必要数据
    reqStatus: 'loading'  // 请求状态值，有3种状态：loading, success, fail
  },
  onLoad: function (options) {
    this.login(); 
  },
  onShow: function() {
    
  },
  // 登陆
  login() {
    $wuxRefreshing();
    let that = this;
    console.log('start wx.login()')
    // 获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        post("miniprogram/Common/login", { code: res.code })
          .then(data => app.globalData.sessionid = data.data.sessionid)
          .then(() => {
            return post('miniprogram/Common/info'); // 判断用户类型
            })
          .then(data => {
            $stopWuxRefresher();
            app.globalData.user_info = data.data;
            that.setData({ reqStatus: 'success', userType: data.data.type });
          })
          .catch(e => {
            $stopWuxRefresher();
            that.setData({ reqStatus: 'fail' })
            })
      }
    })
  },
  //下拉刷新结束触发
  onPulling() {
    console.log('onPulling')
  },
  //下拉刷新完成触发，用于子组件调用
  onRefresh() {
    if (this.selectComponent("#application")) {
      $stopWuxRefresher();
      console.log('普通用户onRefresh')
    } else if (this.selectComponent("#driver-check")) {
      this.selectComponent("#driver-check").getCheckList();
      console.log('司机onRefresh')
    } else if (this.selectComponent("#admin-check")) {
      console.log('司机onRefresh')
      this.selectComponent("#admin-check").getCheckList();
    }
  },
  //上拉加载，用于子组件调用
  onLoadmore() {
    if (this.selectComponent("#application")) {
      this.onStopLoading();
      console.log('普通用户onLoadmore')
    } else if (this.selectComponent("#driver-check")) {
      this.selectComponent("#driver-check").loadMore();
      console.log('普通用户onLoadmore')
    } else if (this.selectComponent("#admin-check")) {
      this.selectComponent("#admin-check").loadMore();
      console.log('普通用户onLoadmore')
    }
  },
  // 滚动监听函数（wux-refresher组件必要函数）
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
    // console.log(e.scrollTop)
  },
  // 停止上拉加载，用于子组件调用
  onStopLoading() {
    console.log('onStopLoading');
    $stopWuxLoader('#wux-refresher', this, true);
  },
  // 重新加载页面
  reload() {
    this.setData({ reqStatus: 'loading' })
    this.login();
  },
})