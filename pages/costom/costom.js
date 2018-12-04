// pages/costom/costom.js
var now = new Date();
var getDate = function(now) {
  var year = now.getUTCFullYear().toString();
  var month = (now.getUTCMonth() + 1).toString();
  var day = now.getDay().toString();
  return year + '-' + month + '-' + day;
}

var getTime = function() {
  var time = now.getHours().toString() + ':' + now.getMinutes().toString();
  return time;
}

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    date: getDate(now),
    time: getTime(now)
    
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  }
})