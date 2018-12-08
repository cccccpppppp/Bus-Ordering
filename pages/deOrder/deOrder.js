// pages/son/deOrder/deOrder.js
const app = getApp();
var host = app.globalData.host;

Page({
  data: {
    id: "",//订单的id

    //当前用户的身份 &所有身份为flase为司机
    isapply:false,//是否是申请人
    ifadmin:false,//是否管理员
    ifload : true,
    iffail: true,//该申请是否退回

    resdata:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取跳转接受的id
    var id = options.id;
    //var id =45;
    console.log(id)

    var that = this;

        

        //获取用户类型
        wx.request({
          url: host + "miniprogram/Common/getUserType",
          data: {
            sessionid: wx.getStorageSync("sessionid")
          },
          method: "POST",
          success(res) {
            console.log(res.data.data.type)


            if (res.data.data.type == "预订人员")
            {
              that.setData(
                {
                  isapply: true,//是申请人
                  ifadmin: false,//不是是管理员
                },
                //获取订单的详细信息
                  wx.request({
                  url: host + "miniprogram/Predetermine/getApplyCarById",
                  data: {
                    sessionid: wx.getStorageSync("sessionid"),
                    id: id
                  },
                  method: "POST",
                  success(res) {
                    that.setData({
                      resdata : res.data.data
                    })
                    //审核是否通过
                    if (res.data.data.status == "审核未通过") {
                      that.setData({
                        iffail: true
                      })
                    }
                    else {
                      that.setData({
                        iffail: false
                      })
                    }
                    that.setData({
                      ifload :false,
                    })
                  }
                })//获取订单详细信息
              )
            }

            //管理员
            else if (res.data.data.type == "管理人员")
            {
              that.setData({
                isapply: false,//不是申请人
                ifadmin: true,//是管理员
              }),
                //获取订单的详细信息
                wx.request({
                url: host + "miniprogram/Admin/getApplyCarById",
                  data: {
                    sessionid: wx.getStorageSync("sessionid"),
                    id: id
                  },
                  method: "POST",
                  success(res) {
                    that.setData({
                      resdata: res.data.data
                    })

                    //审核是否通过
                    if (res.data.data.status == "审核未通过") {
                      that.setData({
                        iffail: true
                      })
                    }
                    else {
                      that.setData({
                        iffail: false
                      })
                    }
                    that.setData({
                      ifload: false,
                    })
                  }
                })//获取订单详细信息

            }

            //司机
            else
            {
              that.setData({
                isapply: false,//不是否是申请人
                ifadmin: false,//不是管理员
              })

              //获取订单的详细信息
              wx.request({
                url: host + "miniprogram/Driver/getApplyCarById",
                data: {
                  sessionid: wx.getStorageSync("sessionid"),
                  id: id
                },
                method: "POST",
                success(res) {
                  that.setData({
                    resdata: res.data.data,
                  })

                  that.setData({
                    ifload: false,
                  })

                  // //审核是否通过
                  // if (res.data.data.status == "审核未通过") {
                  //   that.setData({
                  //     iffail: true
                  //   })
                  // }
                  // else {
                  //   that.setData({
                  //     iffail: false
                  //   })
                  // }

                }
              })//获取订单详细信息
            }
          }
        })//获取用户类型
  },

  return_last()
  {
    wx.navigateBack({
      delta: 1
    })
  }
})