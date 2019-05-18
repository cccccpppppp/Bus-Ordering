const app = getApp();
let host = app.globalData.host;
let sessionid = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dIndex: 0,
    departments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取code并请求获得sessionid存入本地
    wx.login({
      success(res) {
        wx.request({
          url: host + "miniprogram/Common/login",
          data: {
            code: res.code
          },
          method: "POST",
          success(res) {
            sessionid = res.data.data.sessionid;
            // wx.setStorageSync("sessionid", sessionid); // 将sessionid存储到本地
            app.globalData.sessionid = sessionid;
            //获取用户类型
            wx.request({
              url: host + 'miniprogram/Common/info',
              data: {
                sessionid: sessionid
              },
              success: res => {
                let user_info = res.data.data;
                wx.setStorageSync("user_info", user_info); // 将用户信息存储到本地
              },
              fail() {
                wx.showModal({
                  title: '网络异常',
                })
              }

            })
          },
          fail() {
            wx.showModal({
              title: '登陆异常'
            })
          }

        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getDepartments: function () {
    let that = this;
    wx.request({
      url: host + "miniprogram/Common/allDepartment",
      data: {
        sessionid: sessionid
      },
      success(res) {
        let departments = res.data.data;
        if(departments){
          that.setData({
            departments: departments
          })
        }
      }
    })
  },
  getApplyCount: function () {
    wx.request({
      url: host + "miniprogram/Common/applyCount",
      data: {
        sessionid: sessionid
      }
    })
  },
  getApplyCarList: function () {
    wx.request({
      url: host + "miniprogram/Common/applyCarList",
      data: {
        sessionid: sessionid,
        page: 1,
        number: 6
      },
      success: (res) => {
        let data = res.data.data
        if (data){
          this.setData({
            applyCarList: data
          });
        }
        
      }
    })
  },
  bindPickerChange(e) {
    this.setData({
      dIndex: e.detail.value
    })
  }
})