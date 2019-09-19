import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxRefreshing, $wuxTail, $wuxHide } from '../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../utils/request.js");
let post = request.post;
let myGet = request.myGet;
Component({
  options: {
    addGlobalClass: true,
  },
  lifetimes: {
    attached() {
      $wuxRefreshing();
      this.getCheckList();
    }
  },
  pageLifetimes: {
    show: function () {
      // $wuxRefreshing();
      this.getCheckList();
    }
  },
  data: {
    checkList: {},
    // page: 1
  },
  methods: {
    // 获取待审核订单列表
    getCheckList() {
      let that = this;
      post('miniprogram/driver/waiting')
        .then(res => {
          $stopWuxRefresher();
          that.setData({
            checkList: res.data,
            // page: 1
          })
        })
        .catch(() => {
          $stopWuxRefresher();
        })
    },
    // 上拉加载更多，供父组件调用
    loadMore() {
      let that = this;
      that.triggerEvent('stoploading', {}, {});
    },
    // 司机确认订单
    getIt(e) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确认接受订单？',
        success(res) {
          if (res.confirm) {
            let apply_id = e.currentTarget.dataset.id;
            let param = {
              apply_id: apply_id,
            }
            wx.showLoading();
            post("miniprogram/Driver/accept", param)
              .then(res => {
                wx.hideLoading();
                if (res.data.msg == "成功") {
                  //提示成功
                  wx.showToast({
                    title: "已接受该订单",
                    icon: "success",
                    duration: 3000
                  });
                  // that.triggerEvent('onLoadmore', {}, {});
                  that.getCheckList();
                } else {
                  //提示失败原因
                  wx.showToast({
                    title: res.data.msg,
                    icon: "none",
                    duration: 3000
                  });
                  // that.triggerEvent('onLoadmore', {}, {});
                  that.getCheckList();
                }
              })
              .catch(() => {
                wx.hideLoading()
                // that.triggerEvent('onLoadmore', {}, {});
                this.getCheckList();
                })
          }
        }
      })
    },
  }
})
