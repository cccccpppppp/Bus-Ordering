const app = getApp();
var host = app.globalData.host;
const request = require("../../../../utils/request.js");
let myGet = request.myGet;
var itemList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "1",
    ifload:true,
    is_can_comment: 1,
    drive_data:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      ifload:true,
      id: options.id,
    })
    itemList = [];
    myGet('miniprogram/Admin/getDriverInfoList')
      .then(res => {
        let select = [];
        select = res.data.data
        for (var i in select)
        {
          select[i].checked = false
        }
        that.setData({
          drive_data : select,
          ifload:false,
        })
      })
    // wx.request({
    //   url: host + 'miniprogram/Admin/getDriverInfoList',
    //   data: {
    //     sessionid: that.data.sessionid,
    //   },
    //   success(res) {
    //     var select = [];
    //     select = res.data.data
    //     for (var i in select)
    //     {
    //       select[i].checked = false
    //     }
    //     that.setData({
    //       drive_data : select,
    //       ifload:false,
    //     })
    //   }
    // })
  },

  //-------------选择司机事件--------------//
  checkboxChange: function(e) {
    var that = this;
    var select = that.data.drive_data
    console.log(e)
    for (var i in select) {
      select[i].checked = false
    }
    for (var i in e.detail.value)
    {
      select[e.detail.value[i]].checked = true
    }
    that.setData({
      drive_data : select
    })
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
    var ifnull = true;
    var drivelist = [];
    for(var i in that.data.drive_data)
    {
      if(that.data.drive_data[i].checked==true)
      {
        drivelist = drivelist.concat(that.data.drive_data[i].phone)
        ifnull = false
      }
    }
    if (ifnull == true) {
      wx.showToast({
        title: '请至少选择一个司机',
        icon: 'none',
        duration: 2000
      })
    } else {
      let param = {
        apply_id: that.data.id,
        status: 1,//审核通过
        driverPhonList: drivelist,
        is_can_comment: that.data.is_can_comment
      }
      myGet('miniprogram/Admin/check', param)
        .then(() => {
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
        })
      // wx.request({
      //   url: host + 'miniprogram/Admin/check',
      //   data: {
      //     sessionid: that.data.sessionid,
      //     apply_id: that.data.id,
      //     status: 1,//审核通过
      //     driverPhonList: drivelist,
      //     is_can_comment: that.data.is_can_comment
      //   },
      //   method : "GET",
      //   success(res) {
      //     console.log(res.data.status)
      //     if (res.data.status == 0)
      //     {
      //       wx.showToast({
      //         title: '已同意该订单',
      //         icon: 'success',
      //         duration: 2000
      //       })
      //       setTimeout(function () {
      //         wx.navigateBack({
      //           delta: 1
      //         })
      //       }, 2000);
      //     }
      //     else if(res.data.status == 1)
      //     {
      //       wx.showToast({
      //         title: res.data.msg,
      //         icon : "none",
      //         duration : 5000
      //       })
      //       setTimeout(function(){
      //         wx.navigateBack({
      //           delta: 1 
      //         })
      //       },2000);
      //     }
      //     else{
      //       wx.showToast({
      //         title: res.data.msg,
      //         icon: 'none',
      //         duration: 5000
      //       })
      //     }
      //   }
      // })
    }
  }

})