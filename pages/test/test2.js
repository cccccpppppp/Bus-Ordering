const app = getApp();
let host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['未完成', '已完成'],
    count: [0, 0, 0],
    current: '0',
    unfinished: [],
    finished: [],
    unverified: []
  },
  //不参与页面渲染的数据
  unshownData: {
    sessionid: 0,
    unfinishedPage: 0,
    finishedPage: 0,
    unverifiedPage: 0,
    type: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.unshownData.sessionid = app.globalData.sessionid;
    let that = this;
    let type = wx.getStorageSync('user_info');
    this.unshownData.type = type;
    // 如果用户类型不是司机则获取未通过订单
    if(type !== 2) {
      this.getApplyCarList(0, 10, 2)
        .then((data) => {
          that.setData({ 
            unverified: data,
            tabs: ['未完成', '已完成', '未通过']
          });
          that.unshownData.unverifiedPage++;
        }
        )
        .catch(that.showToast());
    }
    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
    //获取未完成订单并setData
    this.getApplyCarList(0, 10, 1)
      .then((data) => {
        that.setData({
        unfinished: data
        });
        that.unshownData.unfinishedPage++;
        }
      )
      .catch(that.showToast());
    //获取已完成订单并setData
    this.getApplyCarList(0, 10, 6)
      .then((data) => {
        that.setData({ finished: data });
        that.unshownData.finishedPage++;
        })
      .catch(that.showToast());
  }, // onLoad() END
  // swiper换页
  switchSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //获取订单列表
  getApplyCarList(page, number, status) {
    let that = this;
    var p = new Promise(function (resolve, reject) {
      wx.request({
        url: host + "miniprogram/Common/applyCarList",
        data: {
          sessionid: that.unshownData.sessionid,
          page: page,
          number: number,
          status: status
        },
        success: (res) => {
          let data = res.data.data
          if (data) {
            resolve(data);
          } else {
            reject('请求异常');
          }
        },
        fail() {
          reject('网络异常');
        }
      });
    })
    return p;
  },
  // showToast
  showToast(error) {
    wx.showToast({
      title: error,
      icon: "none",
      duration: 2000
    })
  },
  // tabs切页
  handleChange({
    detail
  }) {
    this.setData({ current: detail.key });
  },

})