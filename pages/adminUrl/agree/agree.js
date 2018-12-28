const app = getApp();
var host = app.globalData.host;
var itemList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "1",
    drive: [],
    is_can_comment: 1,
    drive_data:[],
    drive_name : "请选择司机"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      id: options.id
    })
    itemList = [];
    wx.request({
      url: host + 'miniprogram/Admin/getDriverInfoList',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
      },
      success(res) {
        that.setData({
          drive_data : res.data.data
        })
        console.log(that.data.drive_data)
        for(var i = 0;i < that.data.drive_data.length;i++)
        {
          itemList = itemList.concat(res.data.data[i].name);
        }
      }
    })
  },

  //-------------选择司机事件--------------//
  open: function() {
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function(res) {
        if (!res.cancel) {
          // that.setData({
          //   drive : [],
          //   //drive: that.data.drive_data[res.tapIndex].phone,
          //   drive: that.data.drive.concat(that.data.drive_data[res.tapIndex].phone),
          //   drive_name: that.data.drive_data[res.tapIndex].name
          // })
          that.setData({
            drive:[]
          })
          that.setData({
            drive: that.data.drive.concat(that.data.drive_data[res.tapIndex].phone),
            drive_name: that.data.drive_data[res.tapIndex].name
          })
        }
      }
    });
  },

  //-----------------点击开关事件---------------//
  switch_check(e) {
    var that = this;
    if (e.detail.value == true) {
      that.setData({
        is_can_comment: 1
      })
    } else {
      that.setData({
        is_can_comment: 0
      })
    }
  },

  //提交表单
  post() {
    var that = this
    if (that.data.drive.length == 0) {
      wx.showToast({
        title: '请至少选择一个司机',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: host + 'miniprogram/Admin/check',
        data: {
          sessionid: wx.getStorageSync("sessionid"),
          apply_id: that.data.id,
          status: 1,//审核通过
          driverPhonList: that.data.drive,
          is_can_comment: that.data.is_can_comment
        },
        method : "GET",
        success(res) {
          console.log(res.data.status)
          if (res.data.status == 0)
          {
            wx.showToast({
              title: '已同意该订单',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000);
          }
          else if(res.data.status == 1)
          {
            wx.showToast({
              title: res.data.msg,
              icon : "none",
              duration : 5000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1 
              })
            },2000);
          }
          else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 5000
            })
          }
        }
      })
    }
  }

})