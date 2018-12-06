const app = getApp();
var host = app.globalData.host;
var now = new Date();
var getDate = function(now) {
  var year = now.getUTCFullYear();
  var month = now.getUTCMonth() + 1;
  var day = now.getDate();
  return year + '-' + month + '-' + day;
}

var getTime = function() {
  var time = now.getHours() + ':' + now.getMinutes();
  return time;
}
Page({
  data: {
    date: getDate(now),
    time: getTime(now)

  },
  onLoad: function() {
    wx.request({
      url: host + 'miniprogram/Predetermine/applyCarLately',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      method: 'GET',
      success: function(res) {
        var data = res.data.data;
        var msg = res.data.msg;
        var dic = {
          '已提交': './wait4Verifying/wait4Verifying',
          '审核通过': './success/success',
          '审核未通过': './faild/faild',
          '完成': ''
        }
        console.log(msg);
        wx.redirectTo({
          url: '',
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  submitCar: function(e) {
    var that = this;
    var value = e.detail.value;
    var phone = value.phone;
    var name = value.name;
    var go_time = value.date + ' ' + value.time;
    var start_place = value.start_place;
    var destination_place = value.destination_place;
    var people_number = value.people_number;
    wx.request({
      url: host + 'miniprogram/Predetermine/applyCar',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        name: name,
        phone: phone,
        people_number: people_number,
        start_place: start_place,
        destination_place: destination_place,
        go_time: go_time
      },
      method: 'POST',
      success: res => {
        if(res.data.msg === "ok"){
          wx.redirectTo({
            url: 'wait4Verifying/wait4Verifying',
          })
        }
        else {
          wx.showToast({
            title: '提交失败:' + res.data.msg,
            icon: 'none'
          })
        }
        
      }
    })
  }
})