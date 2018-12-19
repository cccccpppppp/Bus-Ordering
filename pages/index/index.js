const app = getApp();
let host = app.globalData.host;
let dic = {
  '预订人员': ['申请用车', '../costom/loading'],
  '管理人员': ['待审核','adminUrl'],
  '司机': ['待接单','driverUrl']
};
Page({
  data: {
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
        url: ''
      }
    ]
  },

  changeData: function(type){
    this.setData({
      'menu[0].name': dic[type][0],
      'menu[0].url': dic[type][1]
    })
 },
  // 检索本地存储的user_info并根据用户类型选择显示menu的内容
  onLoad: function () {
    let user_info = wx.getStorageSync("user_info");
    this.setData({
      'menu[0].name': dic[user_info.type][0],
      'menu[0].url': dic[user_info.type][1]
    });
  },
  onShow: function () {
    
  }
})
