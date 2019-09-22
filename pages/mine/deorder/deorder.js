import { $wuxDialog } from '../../../wux/index';
const app = getApp();
let host = app.globalData.host;
const request = require("../../../utils/request.js");
let post = request.post;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},  // 订单信息
    status: ['未审核', '等待司机确认', '审核未通过', '部分司机已确认', '全部司机已确认', '司机取消订单', '已完成'],  // 订单状态
    type: 0,   // 用户类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = app.globalData.user_info.type;  // 用户类型
    this.setData({ 
      content: JSON.parse( options.content ),
      type: type
    });
  },
  // 取消订单（通用）
  cancel() {
    let that = this;
    wx.navigateTo({
      url: 'cancel/cancel?id=' + that.data.content.apply_id,
    })
  },
  
  // 评价订单
  toComment() {
    wx.navigateTo({
      url: "../../pages/index/rate/rate?id=" + this.data.content.apply_id
    });
  },

  // 完成订单（司机）
  prompt() {
    let that = this;
    const alert = (content) => {
        $wuxDialog('#wux-dialog--alert').alert({
            resetOnClose: true,
            title: '提示',
            content: content,
        })
    }

    $wuxDialog().prompt({
        resetOnClose: true,
        title: '公里数',
        content: '请输入行驶距离',
        fieldtype: 'number',
        password: 0,
        defaultText: '',
        placeholder: 'km',
        maxlength: 4,
        onConfirm(e, km) {
          const id = that.data.content.apply_id;
          let param = {
            sessionid: app.globalData.sessionid,
            apply_id: id,
            km: km
          }
          wx.showLoading();
          post('miniprogram/Driver/finish', param)
            .then((res) => {
              wx.hideLoading();
              if (res.data.status == 0) {
                alert('订单已完成！');
                wx.navigateBack({ delta: 1 });
              } else {
                alert(res.data.msg);
              }
            })
            .catch(wx.hideLoading)
          // wx.request({
          //   url: host + 'miniprogram/Driver/finish',
          //   data: {
          //     sessionid: app.globalData.sessionid,
          //     apply_id: id,
          //     km: km
          //   },
          //   success: (res) => {
          //     wx.hideLoading();
          //     if (res.data.status == 0) {
          //       alert('订单已完成！');
          //       wx.navigateBack({ delta: 1 });
          //     } else {
          //       alert(res.data.msg);
          //     }
          //   },
          //   fail: () => {
          //     alert('网络错误');
          //     wx.hideLoading();
          //   },
          // });
        },
    })
},
})