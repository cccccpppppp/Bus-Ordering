const app = getApp();
var host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "1",
    drive :[],
    is_can_comment : 1,
    checkboxItems: [
      { name: '', value: '0',phone:"", },
      { name: '', value: '1' ,phone: ""}
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.id
    })
    wx.request({
      url: host + 'miniprogram/Admin/getDriverInfoList',
      data:{
        sessionid: wx.getStorageSync("sessionid"),
      },
      success(res)
      {
        var name0 = "checkboxItems[" + 0 + "].name";
        var phone0 = "checkboxItems[" + 0 + "].phone";
        var name1 = "checkboxItems[" + 1 + "].name";
        var phone1 = "checkboxItems[" + 1 + "].phone";
        that.setData({
          [name0] : res.data.data[0].name,
          [name1]: res.data.data[1].name,
          [phone0]: res.data.data[0].phone,
          [phone1]: res.data.data[1].phone,
        })
      }
    })
  },

  //-------------选择司机事件--------------//
  checkboxChange: function (e) {
    var that = this;
    var length = e.detail.value.length;
    that.setData({
      drive: []
    })
    for (var i = 0; i < e.detail.value.length;i++)
    {
      that.setData({
        drive: that.data.drive.concat(this.data.checkboxItems[e.detail.value[i]].phone)
      })
    }
    console.log(that.data.drive)
   
    //-------------------------------------------------------------------//
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },

  //-----------------点击开关事件---------------//
  switch_check(e)
  {
    var that = this;
    if (e.detail.value == true)
    {
      that.setData({
        is_can_comment : 1
      })
    }
    else{
      that.setData({
        is_can_comment : 0
      })
    }
  },
  post(){
    var that = this
    if(that.data.drive.length == 0)
    {
      wx.showToast({
        title: '请至少选择一个司机',
        icon: 'none',
        duration: 2000
      })
    }
    else
    {
      wx.request({
        url: host + 'miniprogram/Admin/check',
        data: {
          sessionid: wx.getStorageSync("sessionid"),
          apply_id: that.data.id,
          status: 1,//审核通过
          driverPhonList: that.data.drive,
          is_can_comment: that.data.is_can_comment
        },
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