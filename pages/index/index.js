//index.js
//获取应用实例
const app = getApp();
var host = app.globalData.host;

Page({
  data: {

  },
  onLoad: function () {
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
    wx.showLoading({
      title: '获取登陆类型',
    })
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success (res) {
        wx.hideLoading();
        var dic = {
          '预订人员': '../costom/costom',
          '管理人员': '../admin/admin',
          '司机': '../driver/driver',
        };
        var type = res.data.data.type;
        // console.log(type);
        // console.log(dic[type])

        //如果不是首次登录则根据类型跳转到相应页面
        if (type !== '首次登录') {
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: host + 'miniprogram/Common/getUserType',
            data: {
              sessionid: wx.getStorageSync("sessionid")
            },
            success (res) {
              wx.hideLoading();
              wx.redirectTo({
                url: dic[type]
              })
            },
            fail () {
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              })
            }

          })
        } else {
          wx.showToast({
            title: '首次登录',
            icon: 'none'
          })
        }
      }
      
    })
  },

  //跳转到预定人员页面
  toCostom: () => {
    // 获取用户类型
    wx.request({
      url: host + 'miniprogram/Common/getUserType',
      data: {
        sessionid: wx.getStorageSync("sessionid")
      },
      success(res) {
        wx.request({
          url: host + 'miniprogram/Predetermine/register',
          method: 'POST',
          data: {
            sessionid: wx.getStorageSync("sessionid")
          },
          success(res) {
            if (res.msg === "ok" || "重复注册") {
              wx.redirectTo({
                url: '../costom/costom',
              })
            }
            else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          },
          fail () {
            wx.showToast({
              title: '网络异常',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  //跳转到申请授权页面
  to_req_permission: () => {
    wx.redirectTo({
      url: '../permission/permission',
    })
  }
})