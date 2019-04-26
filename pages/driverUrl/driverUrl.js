const app = getApp();
var host = app.globalData.host;
var page = 1;
Page({

  data: {
    ifload : true,
    haddata :true,
    hadmore : true,
    order:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData({sessionid: app.globalData.sessionid});
  },

  onShow: function (options) {
    page = 1;
    var that = this;
    this.getdata();
  },

  //发送请求获取数据
  getdata() {
    var that = this;
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid: that.data.sessionid,
        page: page,
        number: 10,
        status: 1
      },
      success(res) {
        that.setData({
          order: that.data.order.concat(res.data.data),
        })
        console.log(that.data.order)
        page++;
        if (that.data.order.length == 0) {
          that.setData({
            haddata: false
          })
        }
        else if (res.data.data.length == 10) {
          that.setData({
            haddata: true,
            hadmore: true
          })
        }
        else {
          that.setData({
            haddata: true,
            hadmore: false
          })
        }
      },
    })
    this.setData({
      ifload_more: false,
      ifload: false,
    })
  },
  know(e){
    var id = e.target.id
    var that = this;
    wx.request({
      url: host + 'miniprogram/Driver/accept',
      data:{
        sessionid: that.data.sessionid,
        apply_id : id
      },
      success(res)
      {
        page = 1;
        that.setData({
          order : []
        })
        that.getdata();
      }
    })
  }
})