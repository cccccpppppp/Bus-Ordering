var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var host = app.globalData.host;
var unpage = 1;
var page = 1;
var nopage = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifload: true, //是否加载界面
    hadundata: true, //是否有数据
    hadfinishdata: true,
    hadnopassdata: true,
    hadunmore: true, //是否有更多数据
    type: "",
    hadfinishmore: true,
    hadnopassmore: true,
    ifload_more: false,
    unfinish: [], //未完成订单
    finish: [], //已完成订单
    notpass: [], //未通过订单
    tabs: ["未完成订单", "已完成订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    unpage = 1;
    page = 1;
    nopage = 1;
    this.setData({
      sessionid: app.globalData.sessionid
    });

    //获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/info',
      data: {
        sessionid: that.data.sessionid,
      },
      success(res) {
        if (res.data.data.type == 0 || res.data.data.type == 1) {
          that.getunfinish(0);
          that.getunfinish(1);
          that.getunfinish(3);
          that.getunfinish(4);
          that.setData({
            tabs: ["未完成订单", "已完成订单", "未通过订单"]
          })
        } else if (res.data.data.type == 2) {
          that.getunfinish(0);
          that.getunfinish(4);
          that.getunfinish(3);
          that.setData({
            type: "司机"
          })
        }
        that.setData({
          ifload_more: false,
          ifload: false,
        })
      }
    }) //获取用户类型


    this.getfinish();
    this.getnopass();
  },



  //获取未完成订单
  getunfinish(status) {
    var that = this;
    //请求
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid: that.data.sessionid,
        page: unpage,
        number: 10,
        status: status
      },
      success(res) {
        that.setData({
          unfinish: that.data.unfinish.concat(res.data.data),
        })
        unpage++;
        if (that.data.unfinish.length == 0) {
          that.setData({
            hadundata: false
          })
        } else if (res.data.data.length == 10) {
          that.setData({
            hadundata: true,
            hadunmore: true
          })
        } else {
          that.setData({
            hadundata: true,
            hadunmore: false
          })
        }
      },
    })
  },


  //获取已完成订单
  getfinish() {
    var that = this;
    //请求
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid: that.data.sessionid,
        page: page,
        number: 10,
        status: 6
      },
      success(res) {
        that.setData({
          finish: that.data.finish.concat(res.data.data),
        })
        page++;
        if (that.data.finish.length == 0) {
          that.setData({
            hadfinishdata: false
          })
        } else if (res.data.data.length == 10) {
          that.setData({
            hadfinishdata: true,
            hadfinishmore: true
          })
        } else {
          that.setData({
            hadfinishdata: true,
            hadfinishmore: false
          })
        }
      },
    })
  },

  //获取未通过订单
  getnopass() {
    var that = this;
    //请求
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid: that.data.sessionid,
        page: nopage,
        number: 10,
        status: 2
      },
      success(res) {
        that.setData({
          notpass: that.data.notpass.concat(res.data.data),
        })
        nopage++;
        if (that.data.notpass.length == 0) {
          that.setData({
            hadnopassdata: false
          })
        } else if (res.data.data.length == 10) {
          that.setData({
            hadnopassdata: true,
            hadnopassmore: true
          })
        } else {
          that.setData({
            hadnopassdata: true,
            hadnopassmore: false
          })
        }
      },
    })
  },

  onReachBottom() {
    var that = this;
    that.setData({
      ifload_more: true
    })

    if (this.data.activeIndex == 0) {
      if (that.data.hadunmore == true) {
        if (that.data.type == "司机") {
          that.getunfinish(4);
        } else {
          that.getunfinish(1);
        }
      }
    } else if (this.data.activeIndex == 1) {
      if (that.data.hadfinishmore == true) {
        that.getfinish();
      }
    } else {
      if (that.data.hadnopassmore == true) {
        that.getnopass();
      }
    }
    that.setData({
      ifload_more: false
    })
  },

  //点击订单已完成
  finish(e) {
    var id = e.target.id;
    var that = this;
    unpage = 1;
    wx.request({
      url: host + 'miniprogram/Driver/finish',
      data: {
        sessionid: that.data.sessionid,
        apply_id: id,
      },
      success(res)
      {
        if (res.data.status == 0)
        {
          wx.showToast({
            title: '已完成该订单',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            unfinish : []
          })
          that.getunfinish(4)
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon : "none",
            duration: 2000
          })
        }
      }
    })
  },
  // 取消订单
  cancel(e)
  {
    var that = this;
    var id = e.target.id;
    unpage = 1;
    wx.navigateTo({
      url: 'cancel/cancel?id=' + id,
    })
  },

  //选项卡点击切换函数
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }

})