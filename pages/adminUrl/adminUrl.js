const app = getApp();
var host = app.globalData.host;
var page = 1;
Page({
  data: {
    ifload : true,//是否加载界面
    hadata: true,//是否有数据
    hadmore: true,//是否有更多数据
    ifload_more : false,
    uncheck: [],
    sessionid: app.globalData.sessionid
  },

  //发送请求获取数据
  getdata(){
    var that = this;
    wx.request({
      url: host + 'miniprogram/Common/applyCarList',
      data: {
        sessionid:that.data.sessionid,
        page: page,
        number: 10,
        status: 0
      },
      success(res) {
        that.setData({
          uncheck: that.data.uncheck.concat(res.data.data),
        })
        page++;
        if (that.data.uncheck.length == 0) {
          that.setData({
            hadata: false
          })
        }
        else if (res.data.data.length == 10) {
          that.setData({
            hadata: true,
            hadmore: true
          })
        }
        else {
          that.setData({
            hadata: true,
            hadmore: false
          })
        }
      },
    })
    this.setData({
      ifload_more : false,
      ifload: false,
    })
  },

  //生命周期函数--监听页面加载
  onLoad: function(options) {
    this.data.sessionid = app.globalData.sessionid;
  },
  onShow: function(options) {
    page = 1;
    var that = this;
    this.setData({
      sessionid: app.globalData.sessionid
    });
    this.setData({
      uncheck : [],
      ifload : true,
    })
    this.getdata();
  },

  //页面下拉到底部
  onReachBottom()
  {
    if(this.data.hadmore == true)
    {
      this.setData({
        ifload_more : true
      })
      this.getdata()
    }
  },

  //转到拒绝页面
  refuse(e) {
    var id = e.target.id;
    wx.navigateTo({
      url: 'refuse/refuse?id=' + id
    })
  },

  //转到同意页面
  agree(e) {
    var id = e.target.id;
    wx.navigateTo({
      url: 'agree/agree?id=' + id
    })
  },

  refusedrive(e)
  {
    var that = this;
    var id = e.target.id;
    wx.request({
      url: host + "miniprogram/Admin/check",
      data: {
        sessionid: that.data.sessionid,
        apply_id: id,
        status: 2 // 审核未通过
      },
      success(res) {
        if (res.data.msg == "成功") {
          //提示成功
          wx.showToast({
            title: "已拒绝该申请",
            icon: "success",
            duration: 3000
          });
          setTimeout(function () {
            var uncheck = that.data.uncheck;
            for(var i in uncheck)
            {
              if (uncheck[i].apply_id == id)
              {
                uncheck.splice(i,1);
              } 
            }
            that.setData({
              uncheck:uncheck
            })
          }, 2000);
        } else {
          //提示失败原因
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000
          });
        }
      }
    });
  },
  agreedrive(e) {
    var that = this;
    var id = e.target.id;
    wx.request({
      url: host + "miniprogram/Admin/check",
      data: {
        sessionid: that.data.sessionid,
        apply_id: id,
        status: 6 // 审核未通过
      },
      success(res) {
        if (res.data.msg == "成功") {
          //提示成功
          wx.showToast({
            title: "已同意该申请",
            icon: "success",
            duration: 3000
          });
          setTimeout(function () {
            var uncheck = that.data.uncheck;
            for (var i in uncheck) {
              if (uncheck[i].apply_id == id) {
                uncheck.splice(i, 1);
              }
            }
            that.setData({
              uncheck: uncheck
            })
          }, 2000);
        } else {
          //提示失败原因
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000
          });
        }
      }
    });
  },
})