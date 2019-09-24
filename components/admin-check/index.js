import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxRefreshing, $wuxTail, $wuxHide } from '../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../utils/request.js");
let post = request.post;
Component({
  options: {
    addGlobalClass: true,  // 引入全局样式库
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
    page: 1
  },

  methods: {
    // 获取待审核订单列表
    getCheckList() {
      let that = this;
      let param = {
        page: 1,
        number: this.data.page * 10,
        status: 0
      }
      post('miniprogram/Common/applyCarList', param)
        .then(res => {
          $stopWuxRefresher();
          that.setData({
            checkList: res.data,
          })
        })
        .catch($stopWuxRefresher)
    },

    // 上拉加载更多，供父组件调用
    loadMore() {
      let that = this;
      let param = {
        page: this.data.page + 1,
        number: 10,
        status: 0
      }
      post('miniprogram/Common/applyCarList', param)
        .then(res => {
          if (res.data.length === 0) { // 请求无数据时显示“没有更多数据”
            console.log('没有更多数据');
            that.triggerEvent('stoploading', {}, {});
          } else {
            $stopWuxRefresher();
            that.setData({
              checkList: that.data.checkList.concat(res.data), // 拼接数组
              page: that.data.page + 1
            })
          }
        })
        .catch($stopWuxLoader)
    },
    // 同意司机
    pass(e) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确认同意订单？',
        success(res) {
          if (res.confirm) {
            let id = e.currentTarget.dataset.id;
            let param = {
              apply_id: id,
              status: 6
            }
            wx.showLoading();
            post("miniprogram/Admin/check", param)
              .then(res => {
                wx.hideLoading();
                wx.showToast({
                  title: "已同意该申请",
                  icon: "success",
                  duration: 3000
                });
                $wuxRefreshing();
                that.getCheckList();
              })
              .catch(wx.hideLoading)
          }
        }
      })
    },
    // 拒绝司机
    refuse(e) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确认拒绝该订单？',
        success(res) {
          if (res.confirm) {
            let id = e.currentTarget.dataset.id;
            let param = {
              apply_id: id,
              status: 2
            }
            wx.showLoading();
            post("miniprogram/Admin/check", param)
              .then(res => {
                wx.hideLoading();
                  wx.showToast({
                    title: "已拒绝该申请",
                    icon: "success",
                    duration: 3000
                  });
                $wuxRefreshing();
                that.getCheckList();
              })
              .catch(() => wx.hideLoading())
          }
        }
      })
    },
    
  }
})
