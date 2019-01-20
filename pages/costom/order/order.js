Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusList: ['未审核', '等待司机确认', '审核未通过', '部分司机已确认', '全部司机已确认', '司机取消订单', '已完成']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myOrder = wx.getStorageSync("applyCarLately");
    this.setData({
      myOrder: myOrder
    })

  }
})