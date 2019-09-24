import { $startWuxRefresher, $stopWuxRefresher, $stopWuxLoader, $wuxRefreshing, $wuxTail, $wuxHide } from '../../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../../utils/request.js");
let myGet = request.myGet;
const GetPeriod = require("../../../utils/getperiod.js");
Page({
  data: {
    firstOnShow: true, // 判断是否为第一次加载
    scrollTop: 0,
    tabs: ['未完成', '已完成'],  // tabs栏名
    count: [0, 0, 0],   // tabs栏显示的数字
    current: '0',    // 当前页面
    unfinished: [],  // 未完成订单数据
    finished: [],    // 已完成订单数据
    unverified: [],  // 未通过订单数据
    loading: false,  // 加载中
    chosenDate: '2019-1',  // 已选日期
    nowDate: '2019-12',  // 现在的日期
    all: true,       // 是否显示全部
    unfinishedPage: 1, // 未完成页码
    finishedPage: 1,  // 已完成页码
    unverifiedPage: 1, // 未通过页码
  },
  /**
   * 不参与页面渲染的数据
   */
  // unshownData: {
  //   unfinishedPage: 1,
  //   finishedPage: 1,
  //   unverifiedPage: 1,
  //   type: 0
  // },
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
    // let current = this.data.current;  // 当前页面数值: 0, 1 or 2
    // let pageList = ["unfinishedPage", "finishedPage", "unverifiedPage"];  // current对应的
    // let statusList = [[0, 1, 3, 4], [6], [2, 5]];  // current对应的状态数组
    // let currentNameList = ['unfinished', 'finished', 'unverified'];  // current对应的页名
    // this.requestOrder(1, 10, statusList[current])
    //  .then(res => {
    //    that.setData({
    //      [currentNameList[current]]: res.data,
    //      [pageList[current]]: 2,  // 当前页面的页数设为2
    //      });
    //   //  that.unshownData[currentList[current]] = 2;
    //    $stopWuxRefresher();
    //  })
    //  .catch(() => $stopWuxRefresher())
    let current = this.data.current;  // 当前页面数值: 0, 1 or 2
    let pageList = ["unfinishedPage", "finishedPage", "unverifiedPage"];  // current对应的页数
    let statusList = [[0, 1, 3, 4], [6], [2, 5]];  // current对应的状态数组
    let currentNameList = ['unfinished', 'finished', 'unverified'];  // current对应的页名
    console.log(that.data[pageList[current]])
    this.requestOrder(1, (that.data[pageList[current]] - 1) * 10, statusList[current])
      .then(res => {
        that.setData({
          [currentNameList[current]]: res.data,  // 将得到的订单数据覆盖当前的数据
        });
        $stopWuxRefresher();
      })
      .catch(e => {
          // console.log(e.message)
          $stopWuxRefresher();
        })
  },
  onLoadmore() {
    console.log('onLoadmore')
    let that = this;
    let current = this.data.current;
    let pageList = [this.data.unfinishedPage, this.data.finishedPage, this.data.unverifiedPage];  // current对应的页数
    let statusList = [[0, 1, 3, 4], [6], [2, 5]];  // current对应的状态数组
    this.requestOrder(pageList[current], 10, statusList[current])
      .then(res => {
        let currentNameList = ['unfinished', 'finished', 'unverified'];
        let currentList = ['unfinishedPage', 'finishedPage', 'unverifiedPage'];
        if(res.data !== null && res.data.length === 0) {
          $stopWuxLoader('#wux-refresher', that, true);
        } else {
          that.setData({ [currentNameList[current]]: that.data[currentNameList[current]].concat(res.data) });
          that.data[currentList[current]] += 1;
          $stopWuxLoader();
        }
      })
      .catch(() => $stopWuxRefresher())
  },
  onLoad: function (options) {
    // 获取当前日期
    this.time = new GetPeriod();
    let nowDate = this.time.getNowDate().slice(0, 7);
    this.setData({ nowDate: nowDate, chosenDate: nowDate });

    let that = this;
    // 如果用户类型不是司机则获取未通过订单
    if (app.globalData.user_info.type !== 2) {
      that.setData({
        tabs: ['未完成', '已完成', '未通过']
      });
    }

    // 请求未完成、已完成、未通过的订单1页
    myGet("miniprogram/Common/firstApplyCarList", { num: 10 })
      .then(res => {
        this.setData({
          unfinished: res.data.unfinished,
          finished: res.data.finished,
          unverified: res.data.unverified,
          finishedPage: 2,
          unfinishedPage: 2,
          unverifiedPage: 2,
        })
      })
      // .catch(e => console.log(e.message))
    // this.data.type = app.globalData.user_info;
  }, // onLoad() END
  onShow() {
    console.log('onshow')
    let that = this;
    myGet('miniprogram/Common/applyCount', {status: 6})
      .then(res => that.setData({ count: [0, res.data, 0] }))

    // 请求目前为止浏览过的页码的订单（刷新页面），第一次onShow不执行
    if(!this.data.firstOnShow) {
      let current = this.data.current;  // 当前页面数值: 0, 1 or 2
      let pageList = ["unfinishedPage", "finishedPage", "unverifiedPage"];  // current对应的页数
      let statusList = [[0, 1, 3, 4], [6], [2, 5]];  // current对应的状态数组
      let currentNameList = ['unfinished', 'finished', 'unverified'];  // current对应的页名
      console.log(that.data[pageList[current]])
      this.requestOrder(1, (that.data[pageList[current]] - 1) * 10, statusList[current])
        .then(res => {
          that.setData({
            [currentNameList[current]]: res.data,  // 将得到的订单数据覆盖当前的数据
          });
        })
        .catch(e => console.log(e.message))
    }
    if(this.data.firstOnShow) {
      this.setData({ firstOnShow: false})
    }
  }, // onShow() End

  //获取订单数量
  getapplyCount() {
    let that = this;
    //请求已完成的订单数量
    myGet('miniprogram/Common/applyCount', {status: 6})
      .then((res) => {
        that.setData({ count: [0, res.data.data, 0] })
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