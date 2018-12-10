const app = getApp();
var host = app.globalData.host;
var now = new Date();
var getDate = function(now) {
  var year = now.getUTCFullYear();
  var month = now.getUTCMonth() + 1;
  var day = now.getDate();
  return year + "-" + month + "-" + day;
};

var getTime = function() {
  var time = now.getHours() + ":" + now.getMinutes();
  return time;
};
Page({
  data: {
    counter: 0,
    date: getDate(now),
    time: getTime(now),

    start_place: '',
    address: '',
    start_place_latitude: '',
    start_place_longitude: ''
  },

  // 加载本页面时获取用户最近一单订单的信息，如果状态为完成则留在本页面，否则跳转到相应状态的页面
  onLoad: function() {
    wx.showLoading();
    wx.request({
      url: host + "miniprogram/Predetermine/applyCarLately",
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      method: "GET",
      success: function(res) {
        wx.hideLoading();
        var data = res.data.data;
        var msg = res.data.msg;
        console.log(data.status); //test
        if (data === null) {
          wx.showToast({
            title: msg,
            icon: "none"
          });
        } else if (data.status !== "完成") {
          wx.redirectTo({
            url:
              "./wait4Verifying/wait4Verifying?status=" +
              data.status +
              "&id=" +
              data.id
          });
          wx.setStorageSync("applyCarLately", data); // 将最近一单的信息存储到本地
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: "网络异常",
          icon: "none"
        });
      },
      complete: function(res) {}
    });
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    });
  },

  //文本域计数器
  bindText: function(e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      counter: t_text
    });
  },

  // 跳转到订单页面
  toOrder: () => {
    wx.navigateTo({
      url: "../Order/Order"
    });
  },

  // 打开自带地图选择位置并返回位置信息
  chooseAdd: function() {
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
        })
      }
    });
  },

  //提交预定表单
  submitCar: function(e) {
    var that = this;
    var value = e.detail.value;
    var phone = value.phone;
    var name = value.name;
    var go_time = value.date + " " + value.time;
    var destination_place = value.destination_place;
    var people_number = value.people_number;
    var reason = value.reason;
    var start_place = this.data.start_place;
    let start_place_latitude = this.data.start_place_latitude;
    let start_place_longitude = this.data.start_place_longitude;
    wx.request({
      url: host + "miniprogram/Predetermine/applyCar",
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        name: name,
        phone: phone,
        people_number: people_number,
        start_place: start_place,
        start_place_latitude: start_place_latitude,
        start_place_longitude: start_place_longitude,
        destination_place: destination_place,
        go_time: go_time,
        reason: reason
      },
      method: "POST",
      success: res => {
        var msg = res.data.msg;
        if (msg === "ok" || msg.indexOf("提交成功") !== -1) {
          wx.redirectTo({
            url: "wait4Verifying/wait4Verifying"
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          });
        }
      }
    });
  }
});
