import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxRefreshing, $wuxTail, $wuxHide } from '../../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../../utils/request.js");
let myGet = request.myGet;
const GetPeriod = require("../../../utils/getperiod.js");
Page({

  data: {
    scrollTop: 0,
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
    unfinishedPage: 1,
    finishedPage: 1,
    unverifiedPage: 1,
    type: 0
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  /**
   * 封装订单请求
   * @param {number} page - 请求页数
   * @param {number} number - 请求的订单的数量
   * @param {array} status - 请求的订单的状态
   */
  requestOrder(page, number, status) {
    return myGet("miniprogram/Common/applyCarList", {
      page: page,
      number: number,
      status: status
    })
  },
  onRefresh() {
    console.log('onRefresh')
    let that = this;
    let current = this.data.current;
    let pageList = [this.unshownData.unfinishedPage, this.unshownData.finishedPage, this.unshownData.unverifiedPage];
    let statusList = [[0, 1, 3, 4], [6], [2, 5]];
    let currentNameList = ['unfinished', 'finished', 'unverified'];
    this.requestOrder(1, 10, statusList[current])
     .then(res => {
       that.setData({ [currentNameList[current]]: res.data });
       that.unshownData[currentList[current]] = 2;
       $stopWuxRefresher();
     })
     .catch(() => $stopWuxRefresher())
  },
  onLoadmore() {
    console.log('onLoadmore')
    let that = this;
    let current = this.data.current;
    let pageList = [this.unshownData.unfinishedPage, this.unshownData.finishedPage, this.unshownData.unverifiedPage];
    let statusList = [[0, 1, 3, 4], [6], [2, 5]];
    this.requestOrder(pageList[current], 10, statusList[current])
      .then(res => {
        let currentNameList = ['unfinished', 'finished', 'unverified'];
        let currentList = ['unfinishedPage', 'finishedPage', 'unverifiedPage'];
        if(res.data !== null && res.data.length === 0) {
          $stopWuxLoader('#wux-refresher', that, true);
        } else {
          that.setData({ [currentNameList[current]]: that.data[currentNameList[current]].concat(res.data) });
          that.unshownData[currentList[current]] += 1;
          $stopWuxLoader();
        }
      })
      .catch(() => $stopWuxRefresher())
  },
  onLoad: function (options) {
    this.time = new GetPeriod();
    let nowDate = this.time.getNowDate().slice(0, 7);
    this.setData({ nowDate: nowDate, chosenDate: nowDate });
    this.unshownData.sessionid = app.globalData.sessionid;
    let that = this;
    this.unshownData.type = app.globalData.user_info;
  }, // onLoad() END
  onShow() {
    let that = this;
    // $wuxRefreshing();
    // this.getapplyCount();
    myGet('miniprogram/Common/applyCount', {status: 6})
      .then(res => that.setData({ count: [0, res.data, 0] }))
    // 如果用户类型不是司机则获取未通过订单
    if (this.unshownData.type !== 2) {
      that.setData({
        tabs: ['未完成', '已完成', '未通过']
      });
    }
    let promiseUnfinished = this.requestOrder(1, 10, [0, 1, 3, 4]);
    let promiseFinished = this.requestOrder(1, 10, [6]);
    let promiseUnverified = this.requestOrder(1, 10, [2, 5]);
    Promise.all([promiseUnfinished, promiseFinished, promiseUnverified])
      .then(datas => {
        this.setData({
          unfinished: datas[0].data,
          finished: datas[1].data,
          unverified: datas[2].data,
        })
        this.unshownData.finishedPage = 2;
        this.unshownData.unfinishedPage = 2;
        this.unshownData.unverifiedPage = 2;
        // $stopWuxRefresher();
      })
      .catch(() => $stopWuxRefresher())
  }, // onShow() End
  //获取订单数量
  getapplyCount() {
    let that = this;
    //请求已完成的订单数量
    myGet('miniprogram/Common/applyCount', app.globalData.sessionid)
      .then((res) => {
        that.setData({ count: [0, res.data.data, 0] })
      })
    // wx.request({
    //   url: host + 'miniprogram/Common/applyCount',
    //   data: {
    //     sessionid: that.unshownData.sessionid,
    //     status: 6//订单状态
    //   },
    //   success(res) {
    //     that.setData({ count: [0, res.data.data, 0] })
    //   }
    // })
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
  setAll() { this.setData({ all: !this.data.all }) },

})