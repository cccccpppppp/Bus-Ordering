//index.js
//获取应用实例
const app = getApp();
var host = app.globalData.host;

Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function() {

  },

  onLoad: function() {
    var that = this;
    //域名地址
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
          }
        })
      }
    })
  },

  toCostom: () => {
    // 获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success(res) {
        // var type = res.data.data.type;
        // //type对应的url
        // var dic = {
        //   "管理人员": "../admin/admin",
        //   "司机": "../driver/driver",
        //   "预定人员": "../costom/costom",
        // };
        // console.log(dic)
        // console.log(type)
        // console.log(dic[1])
        // if (dic[type]) {
        //   wx.showToast({
        //     title: type,
        //     icon: 'none'
        //   })
        //   console.log(dic[type])
        //   wx.redirectTo({
        //     url: dic[type]
        //   })
        // }
        wx.redirectTo({
          url: '../costom/costom',
        })

      }
    })
  }

})