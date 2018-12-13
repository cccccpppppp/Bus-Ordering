var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var host = app.globalData.host;

var allpage = 1;
var repage = 1;

Page({
  data: {
    //选项卡信息
    tabs: ["所有申请", "未通过申请"],
    activeIndex: 0,
    usertype: "预订人员",
    
    //两个选项卡是否有数据的判断，false为没有，ture为有
    ifload :true,
    ifload_more :false,
    hasdatamore : true,
    hasrefusemore : true,
    hasalldata : true,
    hasrefuse: true,
    allorder:[
    ],
    refuse:[
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
        data:{
          sessionid: wx.getStorageSync("sessionid"),
        },
        method: "POST",
        success(res){

          //根据用户类型发送请求查询申请
          if (res.data.data.type == "预订人员")
          {
            //查询全部数据
            wx.request({
              url: host +'miniprogram/Predetermine/applyCarHistory',
              data:{
                sessionid: wx.getStorageSync("sessionid"),
                page: 1,
                pageCount: 10,
                status: 10 //查询全部数据
              },
              success(res)
              {
                allpage = allpage + 1,
                that.setData({
                  //id: red.data.data.id,
                  allorder: res.data.data,
                  usertype: "预订人员"
                })
                if (res.data.data.length == 0) {
                  that.setData({
                    hasalldata: false,
                  })
                }
                else if (res.data.data.length == 10)
                {
                  that.setData({
                    hasdatamore :true,
                    hasalldata: true,
                  })
                }
                else {
                  that.setData({
                    hasdatamore: false,
                    hasalldata: true,
                  })
                }
                that.setData({
                  ifload: false,
                })
              }

            })//查询全部请求

            //查询未通过数据
            wx.request({
              url: host +'miniprogram/Predetermine/applyCarHistory',
              data: {
                sessionid: wx.getStorageSync("sessionid"),
                page: 1,
                pageCount: 10,
                status: 2 
              },
              success(res) {
                repage = repage + 1,
                that.setData({
                  //id: red.id,
                  refuse : res.data.data
                })
                console.log(res.data.data.length)
                if (res.data.data.length == 0) {
                  that.setData({
                    hasrefuse: false,
                  })
                }
                else if (res.data.data.length == 10) {
                  that.setData({
                    hasrefusemore : true,
                    hasrefuse : true,
                  })
                }
                else {
                  that.setData({
                    hasrefusemore : false,
                    hasrefuse : true,
                  })
                }
                that.setData({
                  ifload: false,
                })
              }

            })//查询未通过请求

          }//预定人员查询请求
          
          //身份为管理员查询管理员数据
          else if (res.data.data.type == "管理人员")
          {

            //查询全部数据
            wx.request({
              url: host +'miniprogram/Admin/applyCarHistory',
              data: {
                sessionid: wx.getStorageSync("sessionid"),
                page: 1,
                pageCount: 10,
                status: 10 //查询全部数据
              },
              success(res) {
                allpage = allpage +1,
                that.setData({
                  //id: red.id,
                  allorder: res.data.data,
                  usertype: "管理人员"
                })
                if (res.data.data.length == 0) {
                  that.setData({
                    hasalldata: false,
                  })
                }
                else if (res.data.data.length == 10) {
                  that.setData({
                    hasdatamore: true,
                    hasalldata: true,
                  })
                }
                else {
                  that.setData({
                    hasdatamore: false,
                    hasalldata: true,
                  })
                }
                that.setData({
                  ifload: false,
                })
              }
            })//查询全部请求

            //查询未通过数据
            wx.request({
              url: host +'miniprogram/Admin/applyCarHistory',
              data: {
                sessionid: wx.getStorageSync("sessionid"),
                page: 1,
                pageCount: 10,
                status: 2 //查询全部数据
              },
              success(res) {
                repage = repage +1,
                that.setData({
                  //id: red.id,
                  refuse: res.data.data,
                })
                if (res.data.data.length == 0) {
                  that.setData({
                    hasrefuse: false,
                  })
                }
                else if (res.data.data.length == 10) {
                  that.setData({
                    hasrefusemore: true,
                    hasrefuse: true,
                  })
                }
                else {
                  that.setData({
                    hasrefusemore: false,
                    hasrefuse: true,
                  })
                }
                that.setData({
                  ifload: false,
                })
              },
            })//查询未通过请求

          }
        }
      })



  },//onload函数

  //下拉到底部刷新
  onReachBottom(){
    var that = this;
    
    if (this.data.activeIndex == 0)
    {
      if(that.data.hasdatamore == true)
      {
        that.setData({
          ifload_more : true,
        })
        if (that.data.usertype == "预订人员")
        {
          //查询全部数据
          wx.request({
            url: host + 'miniprogram/Predetermine/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: allpage,
              pageCount: 10,
              status: 10 //查询全部数据
            },
            success(res) {
              that.setData({
                allorder: that.data.allorder.concat(res.data.data) 
              })

              if (res.data.data.length == 10) {
                that.setData({
                  hasdatamore: true,
                })
              }
              else {
                that.setData({
                  hasdatamore: false,
                  hasdatamore: false,
                })
              }
            },
          })//查询全部请求
          that.setData({
            ifload_more: false,
          })
        }
        else if (that.data.usertype == "管理人员")
        {
          //查询全部数据
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: allpage,
              pageCount: 10,
              status: 10 //查询全部数据
            },
            success(res) {
              that.setData({
                allorder : that.data.allorder.concat(res.data.data) 
              })

             if (res.data.data.length == 10) {
                that.setData({
                  hasdatamore: true,
                })
              }
              else {
                that.setData({
                  hasdatamore: false,
                  hasdatamore : false,
                })
              }
            },
          })//查询全部请求
          that.setData({
            ifload_more: false,
          })
        }
      }
    }


    else if (this.data.activeIndex == 1)
    {
      if (that.data.hasrefusemore == true) {
        that.setData({
          ifload_more: true,
        })
        if (that.data.usertype == "预订人员") {
          wx.request({
            url: host + 'miniprogram/Predetermine/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: allpage,
              pageCount: 10,
              status: 2 
            },
            success(res) {
              that.setData({
                refuse: that.data.refuse.concat(res.data.data)
              })

              if (res.data.data.length == 10) {
                that.setData({
                  hasrefusemore: true,
                })
              }
              else {
                that.setData({
                  hasrefusemore : false,
                })
              }
            },
          })
          that.setData({
            ifload_more: false,
          })
        }
        else if (that.data.usertype == "管理人员") {
          wx.request({
            url: host + 'miniprogram/Admin/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              page: allpage,
              pageCount: 10,
              status: 2
            },
            success(res) {
              that.setData({
                refuse: that.data.refuse.concat(res.data.data)
              })

              if (res.data.data.length == 10) {
                that.setData({
                  hasrefusemore : true,
                })
              }
              else {
                that.setData({
                  hasrefusemore : false,
                })
              }
            },
          })
          that.setData({
            ifload_more: false,
          })
        }
      }
    }
  },

  //选项卡点击切换函数
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
});