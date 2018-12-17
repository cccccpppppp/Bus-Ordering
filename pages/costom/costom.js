
Page({

  data: {
    counter: 0,
    start_place:'桂电',
    myInfo: {
      "name": null,
      "phone": null,
      "type": null
    },
    date: '2018-12-18',
    time: '5:32',
    start_place_latitude: '',
    start_place_longitude: ''
    
  },

  onLoad: function (options) {
    this.setData({
      myInfo: wx.getStorageSync('user_info')
    })
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
})