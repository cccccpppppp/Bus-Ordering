const app = getApp();
var host = app.globalData.host;
var id = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifload: true, //页面是否加载
    iffail: true, //该申请是否退回
    type: "", //用户类型

    resdata: [],
  },

  //获取用户身份
  getusertype() {
    var that = this;
    var type=wx.getStorageSync("user_info").type
    if(type==0)
    {
      that.setData({
        type: "预定人员"
      })
    }
    else if (type==1)
    {
      that.setData({
        type: "管理人员"
      })
    }
    else
    {
      that.setData({
        type: "司机"
      })
    }
    
    // wx.request({
    //   url: host + 'miniprogram/Common/info',
    //   header:{
    //     "Content-Type": "application/json; charset=utf-8"
    //   },
    //   data: {
    //     sessionid: wx.getStorageSync("sessionid"),
    //   },
    //   success(res) {
    //     console.log(res.data.data.type)
    //     that.setData({
    //       type: res.data.data.type
    //     })
    //   }

    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id;
    var that = this;
    this.getusertype();
    wx.request({
      url: host + 'miniprogram/Common/applyCarById',
      header: {
        "Content-Type": "application/json; charset=utf-8"
      },
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        id: id
      },
      success(res) {
        that.setData({
          resdata: res.data.data
        })
        if (res.data.data.status == "2") {
          that.setData({
            iffail: true
          })
        } else {
          that.setData({
            iffail: false
          })
        }
      }
    })
    this.setData({
      ifload: false
    })
  },
  return_last(){
    wx.navigateBack({
      delta: 1
    })
  }
})