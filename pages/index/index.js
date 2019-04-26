const app = getApp();
let host = app.globalData.host;
let dic = {
  0: ['申请用车', '../costom/loading'],
  1: ['待审核','../adminUrl/adminUrl'],
  2: ['待接单','../driverUrl/driverUrl']
};
Page({
  data: {
    // userType: '预定人员',
    hasNewOrder: false,     // 是否有新订单
    header: '../../images/header.jpg',
    menu: [
      {
        name: '申请用车',
        icon: '../../images/icons/document.png',
        url: ''
      },
      {
        name: '我的信息',
        icon: '../../images/icons/mine.png',
        url: '../myInfo/myInfo'
      },
      {
        name: '修改信息',
        icon: '../../images/icons/editor.png',
        url: '../modifyInfo/modifyInfo'
      },
      {
        name: '历史订单',
        icon: '../../images/icons/order.png',
        url: '../order/order'
      }
    ]
  },
  // 修改信息后转换用户类型
  changeData: function(type){
    this.setData({
      'menu[0].name': dic[type][0],
      'menu[0].url': dic[type][1]
    })
  },
  // 检索本地存储的user_info并根据用户类型选择显示menu的内容
  onLoad: function () {
    let that = this;
    let user_info = wx.getStorageSync("user_info");
    if(user_info.type===2) {
      this.setData({
        'menu[0].name': dic[user_info.type][0],
        'menu[0].url': dic[user_info.type][1],
        'menu[4]':{
          name: '添加订单',
          icon: '../../images/icons/add.png',
          url: '../driverUrl/add/add'
        }
      });
    }
    else {
      this.setData({
        // userType: user_info.type,
        'menu[0].name': dic[user_info.type][0],
        'menu[0].url': dic[user_info.type][1]
      });
    }
  },
  // 如果有新订单hasNewOrder为true，显示小红点
  onShow: function () {
    let sessionid = app.globalData.sessionid;
    var that = this;
    let user_info = wx.getStorageSync("user_info");
    let status = 0;
    if (user_info.type !== 0) {
      if (user_info.type === 2) { status = 1; }
      wx.request({
        url: host + 'miniprogram/Common/applyCarList',
        data: {
          sessionid: sessionid,
          status: status
        },
        method: 'GET',
        success: (result)=>{
          let applyList = result.data.data;
          if (applyList.length !== 0) {
            that.setData({
              hasNewOrder: true
            })
          } else {
            that.setData({
              hasNewOrder: false
            })
          }
        }
      });
    }
  }
})
