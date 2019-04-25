const app = getApp();
let host = app.globalData.host;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {
      name: '',
      phone: ''
    }
  },
  modifyInfo: e => {
    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    wx.showModal({
      content: "你的信息将被修改",
      success: function(res) {
        if (res.confirm) {
          let sessionid = wx.getStorageSync("sessionid");
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: host + "miniprogram/Common/setInfo",
            method: "POST",
            data: {
              sessionid: sessionid,
              name: name,
              phone: phone
            },
            success: res => {
              if (res.data.status === 0) {
                wx.hideLoading();
                wx.showToast({
                  title:'成功',
                  success: result => {
                    wx.request({
                      url: host + "miniprogram/Common/info",
                      data: {
                        sessionid: sessionid
                      },
                      success: res => {
                        let pages = getCurrentPages(); //获取页面栈
                        let prevPage = pages[pages.length - 2]; //上一个页面
                        wx.setStorageSync("user_info", res.data.data); // 将用户信息存储到本地
                        prevPage.changeData(res.data.data.type);
                        setTimeout(function() {
                          wx.navigateBack();
                        }, 500);
                      }
                    });
                  },
                  fail: () => {
                    wx.hideLoading();
                    wx.showToast({
                      title: "网络错误",
                      icon: "none"
                    });
                  }
                });
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                });
              }
            }
          });
        }
      }
    });
  },

  onLoad: function (options) {
    this.setData({
      myInfo: wx.getStorageSync('user_info')
    })
  },
});
