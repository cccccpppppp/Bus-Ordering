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
    hadnopassdata : true,
    hadunmore: true, //是否有更多数据
    hadfinishmore: true,
    hadnopassmore:true,
    ifload_more: false,
    unfinish :[],//未完成订单
    finish : [],//已完成订单
    notpass : [], //未通过订单
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
    

    //获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/info',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
      },
      success(res) {
        if (res.data.data.type == "管理人员" || res.data.data.type == "预订人员") {
          that.setData({
            tabs: ["未完成订单", "已完成订单", "未通过订单"]
          })
        }
      }
    })//获取用户类型

    this.getunfinish();
    this.getfinish();
    this.getnopass();
    this.setData({
      ifload_more: false,
      ifload: false,
    })

  },



  //获取未完成订单
  getunfinish(){
    var that = this;
    //请求
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        page: unpage,
        number: 10,
        status: 1
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
        sessionid: wx.getStorageSync("sessionid"),
        page: page,
        number: 10,
        status: 3
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
        sessionid: wx.getStorageSync("sessionid"),
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

  onReachBottom()
  {
    var that = this;
    that.setData({
      ifload_more: true
    })
    
    if (this.data.activeIndex == 0)
    {
      if(that.data.hadunmore == true)
      {
        that.getunfinish();
      } 
    }
    else if (this.data.activeIndex == 1)
    {
      if (that.data.hadfinishmore == true) {
        that.getfinish();
      }
    }
    else{
        if (that.data.hadnopassmore == true) {
          that.getnopass();
        }
    }
    that.setData({
      ifload_more : false
    })
  },

  //选项卡点击切换函数
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }

})