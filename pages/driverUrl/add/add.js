const util = require("../../../utils/util.js");
import WxValidate from "../../../utils/WxValidate";
const { $Message } = require("../../../iView/base/index");
const app = getApp();
let host = app.globalData.host;
let now = new Date();
let maxTime = new Date();
maxTime.setDate(now.getDate() + 7);       // 可提前预约7天
let formatTimeNow = util.formatTime(now);
let formatMaxTime = util.formatTime(maxTime);
let wxValidate;


Page({
  data: {
    counter: 0,
    start_place: "",
    myInfo: {
      type: null
    },
    start_place: "",
    destination_place:"",
    date: "2018-12-18",
    time: "5:32",
    maxDate: '2018-12-31',
    people_number_range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    people_number_index: 0
  },

  onLoad: function (options) {
    this.setData({
      sessionid: app.globalData.sessionid,
      myInfo: wx.getStorageSync("user_info"),
      date: formatTimeNow.formatedDate,
      time: formatTimeNow.formatedTime,
      maxDate: formatMaxTime.formatedDate,
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  bindPeopleNumChange: function (e) {
    this.setData({
      people_number_index: e.detail.value
    });
  },

  //文本域计数器
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      counter: t_text
    });
  },


  //调用验证函数
  submitCar: function (e) {
    var that = this;
    const params = e.detail.value;
    let go_time = params.date + " " + params.time;
    let destination_place = params.destination_place;
    let people_number = this.data.people_number_range[params.people_number];
    let reason = params.reason;
    let start_place = params.start_place;
    let km = params.km;
    if (destination_place == "" || start_place=="")
    {
      console.log("空")
    }
    else{
      wx.request({
        url: host + "miniprogram/Driver/add",
        data: {
          sessionid: that.data.sessionid,
          people_number: people_number,
          start_place: start_place,
          destination_place: destination_place,
          go_time: go_time,
          reason: reason,
          km: km
        },
        method: "POST",
        success: res => {
          let status = res.data.status;
          if (status == 0 || status == 1) {
            wx.showToast({
              title: res.data.msg,
              icon: "success"
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 3000);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            });
          }
        },
        fail() {
          wx.showModal({
            title: '登陆异常',
            content: ''
          })
        }
      });
    }
  },

    // 打开自带地图选择位置并返回位置信息
  chooseStartAdd: function () {
    let that = this;
    wx.chooseLocation({
      success: function (result) {
        let name = result.name;
        let address = result.address;
        let latitude = result.latitude;
        let longitude = result.longitude;
        that.setData({
          start_place: name,
          start_place_latitude: latitude,
          start_place_longitude: longitude,
          address: address
        });
      }
    });
  },
  // 打开自带地图选择位置并返回位置信息
  chooseDestinationAdd: function () {
    let that = this;
    wx.chooseLocation({
      success: function (result) {
        let name = result.name;
        let address = result.address;
        let latitude = result.latitude;
        let longitude = result.longitude;
        that.setData({
          destination_place: name,
          // destination_place_latitude: latitude,
          // destination_place_longitude: longitude,
          // destination_address: address
        });
      }
    });
  },
});
