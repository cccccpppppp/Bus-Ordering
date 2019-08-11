const request = require("../../utils/request.js");
let post = request.post;
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    myOrder: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    normalList: ['已提交', '已审核', '部分司机已确认', '所有司机已确认', '已完成', '已评价'],
    // statusList: ['已提交', '已审核通过', '未通过', '部分司机已确认', '所有司机已确认', '已取消', '已完成'],
    scroll: 3, // 订单状态值
    scrollObj: {  //订单状态对应的steps下标值
      0: 0,
      1: 1,
      3: 2,
      4: 3,
      6: 4
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 转到评价页面
    toRate: function () {
      wx.navigateTo({
        url: "../../pages/index/rate/rate?id=" + this.data.myOrder.apply_id
      });
    },
    // 转到订车页面
    toApplication() {
      this.triggerEvent('back2application');
    },
    // 请求最近一单信息
    getApplyCarLately() {
      let that = this;
      this.setData({ loading: true });
      post('miniprogram/Apply_car/applyCarLately')
        .then(data => {
          let applyCarLately = data.data;
          that.setData({
            myOrder: applyCarLately,
            loading: false
          })
        })
        .catch(e => that.setData({ loading: false }))
    },
    // 打电话
    phoneCall(event) {
      let type = event.currentTarget.dataset.type; // 获取打电话的对象的身份类型
      let callIndex = 0;
      let phoneNumber = '';
      if (type == "drivers") {
        callIndex = event.currentTarget.dataset.callIndex; // 获取司机数组索引
        phoneNumber = this.data.myOrder[type][callIndex].phone;
      } else if (type == "admin"){
        phoneNumber = this.data.myOrder[type].phone;
      }
      console.log("拨打电话：" + phoneNumber);
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
      })
    }
  },
  lifitimes: {
    attached() {
      
    },
  },
  pageLifetimes: {
    show: function () {
      this.getApplyCarLately();
    }
  }
})
