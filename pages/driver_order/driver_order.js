var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
var host = app.globalData.host;

Page({
  data: {
    //选项卡信息
    tabs: ["未接受订单", "待完成","已完成订单"],
    activeIndex: 0,
    ifload: true,
    //两个选项卡是否有数据的判断，false为没有，ture为有
    hasalldata: true,
    hasrefuse: true,
    hasall : true,
    allorder: [],//未接单
    refuse: [],//已结单
    all:[]//所有订单
  },
  onLoad: function() {
    var that = this;

    //选项卡函数
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });


    //查询待完成数据
    wx.request({
      url: host + 'miniprogram/Driver/applyCarHistory',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        condition: 1, //
        pageCount: 10,
        page: 1,
      },
      success(res) {
        that.setData({
          allorder: res.data.data,
        })
        if (res.data.data.length == 0) {
          that.setData({
            hasalldata: false,
          })
        } else {
          that.setData({
            hasalldata: true,
          })
        }
      }

    }) //查询待完成请求

    //查询未接受数据
    wx.request({
      url: host + 'miniprogram/Driver/applyCarHistory',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        condition: 0, //
        pageCount: 10,
        page: 1,
      },
      success(res) {
        that.setData({
          refuse: res.data.data
        })
        console.log(that.data.refuse)
        if (res.data.data.length == 0) {
          that.setData({
            hasrefuse: false,
          })
        } else {
          that.setData({
            hasrefuse: true,
          })
        }
      }

    }) //查询未通过请求

    //查询已完成数据
    wx.request({
      url: host + 'miniprogram/Driver/applyCarHistory',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        condition: 2, //
        pageCount: 10,
        page: 1,
      },
      success(res) {
        that.setData({
          all: res.data.data,
        })
        console.log(res.data.data.length)
        if (res.data.data.length == 0) {
          that.setData({
            hasall: false,
          })
        } else {
          that.setData({
            hasall: true,
          })
        }
        that.setData({
          ifload: false,
        })
      }

    }) //查询已完成请求

  }, //onload函数

  //下拉到底部刷新
  onReachBottom() {
    console.log("页面已经到达底部")
  },

  //选项卡点击切换函数
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  accept(e) {
    var that = this;
    var id = e.target.id;
    console.log(id)
    wx.request({
      url: host + 'miniprogram/Driver/accept',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        id: id,
      },
      success(res) {
        if (res.data.msg == "ok") {
          //提示成功
          wx.showToast({
            title: '已接单',
            icon: 'success',
            duration: 3000
          });

          //查询已接单数据
          wx.request({
            url: host + 'miniprogram/Driver/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              condition: 1, //
              pageCount: 10,
              page: 1,
            },
            success(res) {
              that.setData({
                allorder: res.data.data,
              })
              if (res.data.data.length == 0) {
                that.setData({
                  hasalldata: false,
                })
              } else {
                that.setData({
                  hasalldata: true,
                })
              }
            }

          }) //查询已接受请求

          //再次查询数据达到刷新效果
          //查询未接受数据
          wx.request({
            url: host + 'miniprogram/Driver/applyCarHistory',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              condition: 0, //
              pageCount: 10,
              page: 1,
            },
            success(res) {
              that.setData({
                refuse: res.data.data
              })
              console.log(that.data.refuse)
              if (res.data.data.length == 0) {
                that.setData({
                  hasrefuse: false,
                })
              } else {
                that.setData({
                  hasrefuse: true,
                })
              }
            }

          }) //查询未通过请求

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          });
        }
      }
    })
  },

  //完成订单按钮
  complete(e) {
    var id = e.target.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认该订单已经完成！',
      confirmText: "确定",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: host + 'miniprogram/Driver/finish',
            data: {
              sessionid: wx.getStorageSync("sessionid"),
              id: id
            },
            success(res) {
              if (res.data.msg == "ok") {
                console.log("1" + res.data.msg)
                wx.showToast({
                  title: '订单已完成',
                  icon: "success",
                  duration: 2000
                })

                //查询已接单数据
                wx.request({
                  url: host + 'miniprogram/Driver/applyCarHistory',
                  data: {
                    sessionid: wx.getStorageSync("sessionid"),
                    condition: 1, //
                    pageCount: 10,
                    page: 1,
                  },
                  success(res) {
                    that.setData({
                      allorder: res.data.data,
                    })
                    if (res.data.data.length == 0) {
                      that.setData({
                        hasalldata: false,
                      })
                    } else {
                      that.setData({
                        hasalldata: true,
                      })
                    }
                  }

                }) //查询已接受请求

                //查询已完成数据
                wx.request({
                  url: host + 'miniprogram/Driver/applyCarHistory',
                  data: {
                    sessionid: wx.getStorageSync("sessionid"),
                    condition: 2, //
                    pageCount: 10,
                    page: 1,
                  },
                  success(res) {
                    that.setData({
                      all: res.data.data,
                    })
                    console.log(res.data.data.length)
                    if (res.data.data.length == 0) {
                      that.setData({
                        hasall: false,
                      })
                    } else {
                      that.setData({
                        hasall: true,
                      })
                    }
                  }

                }) //查询已完成请求

              } else {
                console.log(res)
                wx.showToast({
                  title: res.data.msg,
                  icon: "none",
                  duration: 2000
                })
              }
            }
          })
        }
      }
    });
  },

  //跳转订单详细界面
  to_deorder(e){
    var id = e.currentTarget.id;
    var that = this;
    wx.navigateTo({
      url: '../deOrder/deOrder?id=' + id,
    })
  }
});