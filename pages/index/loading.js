const app = getApp();
let host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        console.log(res.code);
        wx.request({
          url: host + "miniprogram/Common/login",
          data: {
            code: res.code
          },
          method: "POST",
          success(res) {
            wx.setStorageSync("sessionid", res.data.data.sessionid); //将sessionid存储到本地
            console.log(res.data);
          },
          fail() {
            console.log('login()异常')
          }

        })
      }
    })
    //获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success(res) {
        var dic = {
          '预订人员': '../costom/costom',
          '管理人员': '../admin/admin',
          '司机': '../driver_order/driver_order',
        };
        var type = res.data.data.type;
        // console.log(type);
        // console.log(dic[type])

        //如果不是首次登录则根据类型跳转到相应页面
        if (type !== '首次登录') {
          wx.redirectTo({
            url: dic[type]
          })

        } else {
          wx.showModal({
            content: '检测到您是首次登陆，请选择您的身份类型',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: './index'
                });
              }
            }
          });
        }
      }

    })
  }
})