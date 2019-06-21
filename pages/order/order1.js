const app = getApp();
let host = app.globalData.host;
const GetPeriod = require("../../utils/getperiod.js");
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
    unverified: [],
    loading: false,
    chosenDate: '2019-1',
    nowDate: '2019-12',
    all: true
  },
  /**
   * 不参与页面渲染的数据
   */
  unshownData: {
    sessionid: 0,
    unfinishedPage: 1,
    finishedPage: 1,
    unverifiedPage: 1,
    type: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.time = new GetPeriod();
    let nowDate = this.time.getNowDate().slice(0, 7);
    this.setData({ nowDate: nowDate, chosenDate: nowDate });
    this.unshownData.sessionid = app.globalData.sessionid;
    let that = this;
    this.unshownData.type = wx.getStorageSync('user_info');
    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  }, // onLoad() END
  onShow() {
    let that = this;
    this.getapplyCount();
    // 如果用户类型不是司机则获取未通过订单
    if (this.unshownData.type !== 2) {
      this.getApplyCarList(1, 10, 2)
        .then((data) => {
          that.setData({
            unverified: data,
            tabs: ['未完成', '已完成', '未通过']
          });
          that.unshownData.unverifiedPage = 2;
        })
        .catch(that.showToast);
    } else {
      this.getapplyCount();
    }
    //获取未完成订单
    let unfinished = this.getUnfinishedApplyCarList(0, 10);
    this.unshownData.unfinishedPage = 2;
    //获取已完成订单
    this.getApplyCarList(1, 10, 6)
      .then((data) => {
        that.setData({ finished: data });
        that.unshownData.finishedPage = 2;
      })
      .catch(that.showToast);
  }, // onShow() End
  onReachBottom() {
    let that = this;
    let current = this.data.current;
    let unfinishedPage = this.unshownData.unfinishedPage;
    this.setData({ loading: true });
    if (current == 0) {
      // this.getUnfinishedApplyCarList(this.unshownData.unfinishedPage, 10);
      let unfinished = [];
      let p1 = this.getApplyCarList(this.unshownData.unfinishedPage, 10, 0);
      let p2 = this.getApplyCarList(this.unshownData.unfinishedPage, 10, 1);
      let p3 = this.getApplyCarList(this.unshownData.unfinishedPage, 10, 3);
      let p4 = this.getApplyCarList(this.unshownData.unfinishedPage, 10, 4);
      Promise.all([p1, p2, p3, p4]).then(values => {
        unfinished = unfinished.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
        that.setData({ loading: false, unfinished: that.data.unfinished.concat(unfinished) });
      }
      );
      this.unshownData.unfinishedPage += 1;
    } else if (current == 1) {
      this.getApplyCarList(this.unshownData.finishedPage, 10, 6)
        .then((data) => {
          that.setData({ finished: that.data.finished.concat(data), loading: false });
          that.unshownData.finishedPage += 1;
        })
        .catch(that.showToast);
    } else {
      this.getApplyCarList(this.unshownData.unverifiedPage, 10, 2)
        .then((data) => {
          that.setData({ unverified: that.data.unverified.concat(data), loading: false });
          that.unshownData.unverifiedPage += 1;
        })
        .catch(that.showToast);
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.onShow();
    wx.stopPullDownRefresh();
    setTimeout(wx.hideNavigationBarLoading,1000);
  },
  //获取订单数量
  getapplyCount() {
    let that = this;
    //请求已完成的订单数量
    wx.request({
      url: host + 'miniprogram/Common/applyCount',
      data: {
        sessionid: that.unshownData.sessionid,
        status: 6//订单状态
      },
      success(res) {
        that.setData({ count: [0, res.data.data, 0] })
      }
    })
  },
  // 获取当前年、月
  getYearMonth() {
    this.time = new GetPeriod();
    let monthArray = this.data.monthArray;
    let nowDate = this.time.getNowDate();
    let month = nowDate[6];
    for (let i = 1; i <= month; i++) { monthArray.push(i) }
    this.setData({
      yearIndex: nowDate.slice(0, 4),
      month: month,
      monthArray: monthArray
    });
  },
  // swiper换页
  switchSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //获取订单列表
  getApplyCarList(page, number, status) {
    let that = this;
    let p = new Promise(function (resolve, reject) {
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
  // 获取未完成订单列表（状态码：0，1, 3，4，返回获取到的未完成订单对象
  getUnfinishedApplyCarList: function (page, number) {
    let that = this;
    let unfinished = [];
    let p1 = this.getApplyCarList(page, number, 0);
    let p2 = this.getApplyCarList(page, number, 1);
    let p3 = this.getApplyCarList(page, number, 3);
    let p4 = this.getApplyCarList(page, number, 4);
    Promise.all([p1, p2, p3, p4]).then(values => {
      unfinished = unfinished.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
      that.setData({ loading: false, unfinished: unfinished });
    }
    );
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
  handleChange({ detail }) {
    this.setData({ current: detail.key });
  },
  // 设置月份
  setDate(e) {
    this.setData({ chosenDate: e.detail.value });
    console.log(e.detail.value)
  },
  // 显示全部
  setAll() { this.setData({ all: !this.data.all }) }
})