var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var host = app.globalData.host;

Page({
  data: {
    //选项卡信息
    tabs: ["所有申请", "未通过申请"],
    activeIndex: 0,

    //两个选项卡是否有数据的判断，false为没有，ture为有
    hasalldata: true,
    hasrefuse: true,
    allorder: [
    ],
    refuse: [
    ]
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

    //获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
      },
      method: "POST",
      success(res) {

        //根据用户类型发送请求查询申请
        if (res.data.data.type == "预订人员") {
          //查询全部数据
          wx.request({
            url: host + 'miniprogram/Predetermine/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 10 //查询全部数据
            },
            success(res) {
              that.setData({
                //id: red.data.data.id,
                allorder: res.data.data,
              })
              if (res.data.data.length == 0) {
                that.setData({
                  hasalldata: false,
                })
              }
              else {
                that.setData({
                  hasalldata: true,
                })
              }
            }

          })//查询全部请求

          //查询未通过数据
          wx.request({
            url: host + 'miniprogram/Predetermine/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 2 //查询全部数据
            },
            success(res) {
              that.setData({
                //id: red.id,
                allorder: res.data.data
              })
              console.log(res.data.data.length)
              if (res.data.data.length == 0) {
                that.setData({
                  hasrefuse: false,
                })
              }
              else {
                that.setData({
                  hasrefuse: true,
                })
              }
            }

          })//查询未通过请求

        }//预定人员查询请求

        //身份为管理员查询管理员数据
        else if (res.data.data.type == "管理人员") {

          //查询全部数据
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 10 //查询全部数据
            },
            success(res) {
              that.setData({
                //id: red.id,
                allorder: res.data.data,
              })
              if (res.data.data.length == 0) {
                that.setData({
                  hasalldata: false,
                })
              }
              else {
                that.setData({
                  hasalldata: true,
                })
              }
            }
          })//查询全部请求

          //查询未通过数据
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: 1,
              pageCount: 10,
              status: 2 //查询全部数据
            },
            success(res) {
              that.setData({
                //id: red.id,
                refuse: res.data.data,
              })
              if (res.data.data.length == 0) {
                that.setData({
                  hasrefuse: false,
                })
              }
              else {
                that.setData({
                  hasrefuse: true,
                })
              }
            },
          })//查询未通过请求

        }
      }
    })



  },//onload函数

  //下拉到底部刷新
  onReachBottom() {
    console.log("页面已经到达底部")
  },

  //选项卡点击切换函数
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});