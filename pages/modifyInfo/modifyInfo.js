const app = getApp();
let host = app.globalData.host;
let sessionid = wx.getStorageSync("sessionid");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  modifyInfo: e => {
    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    wx.showModal({
      content: '你的信息将被修改',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: host + 'miniprogram/Common/setInfo',
            method: 'POST',
            data: {
              sessionid: sessionid,
              name: name,
              phone: phone
            },
            success: res => {
              wx.hideLoading();
              wx.showToast({
                title: '',
                duration: 2000,
                mask: false,
                success: (result) => {
                  wx.request({
                    url: host + 'miniprogram/Common/info',
                    data: {
                      sessionid: sessionid
                    },
                    success: res => {
                      let pages = getCurrentPages();                 //获取页面栈
                      let prevPage = pages[pages.length - 2];        //上一个页面
                      wx.setStorageSync("user_info", res.data.data); // 将用户信息存储到本地
                      prevPage.changeData(res.data.data.type);
                      setTimeout(function () {
                        wx.navigateBack();
                      }, 2000);
                    }

                  })
                },
                fail: () => {
                  wx.hideLoading();
                  wx.showToast({
                    title: '网络错误',
                    icon: 'none',
                  });
                }
              });
            }
          })
        }
      }
    });
  },

  onLoad: options => {

  }
})