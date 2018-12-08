var sliderWidth = 115; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var host = app.globalData.host;

Page({
  data: {
    tabs: ["未审核", "全部审核","详细信息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    ifload: true,
    hasis:true,
    hasun:true,
    uncheck:[],
    ischeck:[],
  },
  onLoad: function () {
    var that = this;
    //选项卡函数
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow:function()
  {
    var that = this;
    //查询数据
    //未审核订单
    wx.request({
      url: host + 'miniprogram/Admin/applyCarHistory',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        page: 1,
        pageCount: 10,
        status: 0//查询未审核订单
      },
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          uncheck: res.data.data,
        })
        console.log(res.data.data.length)
        if(res.data.data.length == 0)
        {
          that.setData({
            hasun : false
          })
        }
        else
        {
          that.setData(
            {
              hasun : true
            }
          )
        }
      }
    })

    //全部审核订单
    wx.request({
      url: host + 'miniprogram/Admin/applyCarHistory',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        page: 1,
        pageCount: 10,
        status: 1//查询全部审核订单
      },
      method: "POST",
      success(res) {
        console.log(res)
        that.setData({
          ischeck: res.data.data,
        })
        if(res.data.data.length == 0)
        {
          that.setData({
            hasis : false
          })
        }
        else{
          that.setData({
            hasis: true
          })
        }
        that.setData({
          ifload: false,
        })
      }
    })


  },

  //同意申请
  agree(e){
    var that = this;
    var id = e.target.id;
    wx.request({
      url: host + 'miniprogram/Admin/check',
      data:{
        sessionid: wx.getStorageSync("sessionid"),
        id : id,
        opinion: 1,
      },
      success(res)
      {
        if(res.data.msg == "ok")
        {
          //提示成功
          wx.showToast({
            title: '已同意',
            icon: 'success',
            duration: 3000
          });

          //未审核订单
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 0//查询未审核订单
            },
            method: "POST",
            success(res) {
              console.log(res)
              that.setData({
                uncheck: res.data.data,
              })
            }
          })

          //全部审核订单
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 1//查询全部审核订单
            },
            method: "POST",
            success(res) {
              console.log(res)
              that.setData({
                ischeck: res.data.data,
              })
            }
          })
        }
        else{
          //提示失败原因
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  },

  //拒绝申请
  refuse(e)
  {
    var id = e.target.id;
    wx.navigateTo({
      url: 'refuse/refuse?id='+id
    })
  },

  tabClick: function (e) {
    //当用户点击全部订单函数跳转订单界面
    if (e.currentTarget.id == 2)
    {
      wx.navigateTo({
        url: '../Order/Order'
      })
    }
    else {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id,
      });
    }
  },

  //单个订单信息
  to_deorder(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/deOrder/deOrder' + "?id=" + id
    })
  },
});

