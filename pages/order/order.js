const app = getApp();
var host = app.globalData.host;
Page({
  data: {
    tabs: ['未完成', '已完成'],
    count:[0,0,0],
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
    unpage: 1, //未完成页数
    page: 1, //已完成页数
    nopage: 1, //未通过页数
    current: '0', //当前页面 
    hiddenmodalput: true,//是否显示输入公里数弹窗
    km:"",
    thisorderid:0,//当前点击的订单id
  },

  //点击按钮弹出指定的hiddenmodalput弹出框 
  modalinput: function (e) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      thisorderid: e.target.id
    })
  },
  //取消按钮 
  textcancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认 
  textconfirm: function (e) {
    var that = this;
    if(that.data.km=="")
    {
      wx.showToast({
        title: '请输入公里数！',
        icon: 'none'
      })
    }
    else{
      this.setData({
        hiddenmodalput: true
      })
      that.finish();
    }

  },

  getkm:function(e)
  {
    this.setData({
      km: e.detail.value
    })
  },

  onLoad: function(options) {
    this.data.sessionid = app.globalData.sessionid;
    var that = this;
    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
          that.setData({
              clientHeight: res.windowHeight
          });
      }
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
            tabs: ["未完成", "已完成", "未通过"]
          })
        } else if (res.data.data.type == 2) {
          that.getunfinish(0);
          that.getunfinish(4);
          that.getunfinish(3);
          that.getapplyCount();
          that.setData({
            type: "司机"
          })
        }
        that.setData({
          ifload_more: false,
          ifload: false,
        })
      }
    }); //获取用户类型
    this.getfinish();
    this.getnopass();
    this.getapplyCount();
  },
  //获取未完成订单
  getunfinish(status) {
    var that = this;
    let unpage = this.data.unpage;
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
        that.data.unpage = unpage + 1;
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

  // swiper换页
  switchSwiper(e) {
    this.setData({
      current: e.detail.current
    })
  },
  //获取订单数量
  getapplyCount() {
    var that = this;
    //请求
    wx.request({
      url: host + 'miniprogram/Common/applyCount',
      data: {
        sessionid: that.data.sessionid,
        status: 6//订单状态
      },
      success(res) {
        that.setData({
          count: [0,res.data.data,0]
        })
      }
    })
  },
  //获取已完成订单
  getfinish() {
    var that = this;
    let page = this.data.page;
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
        that.data.page = page + 1;
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
    let nopage = this.data.nopage;
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
        that.data.nopage = nopage + 1;
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
    let current = this.data.current;
    that.setData({
      ifload_more: true
    })

    if (current === '0') {
      if (that.data.hadunmore) {
        if (that.data.type === "司机") {
          that.getunfinish(4);
        } else {
          that.getunfinish(1);
        }
      }
    } else if (current === '1') {
      if (that.data.hadfinishmore) {
        that.getfinish();
      }
    } else {
      if (that.data.hadnopassmore) {
        that.getnopass();
      }
    }
    that.setData({
      ifload_more: false
    })
  },
  //点击订单已完成
  finish(e) {
    var id = this.data.thisorderid;
    var that = this;
    // unpage = 1;
    wx.request({
      url: host + 'miniprogram/Driver/finish',
      data: {
        sessionid: that.data.sessionid,
        apply_id: id,
        km:that.data.km
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
    // unpage = 1;
    wx.navigateTo({
      url: 'cancel/cancel?id=' + id,
    })
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

})