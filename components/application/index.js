const util = require("../../utils/util.js");
import WxValidate from "../../utils/WxValidate";
const { $Message } = require("../../iView/base/index");
const app = getApp();
let host = app.globalData.host;
let now = new Date();
let maxTime = new Date();
maxTime.setDate(now.getDate() + 7); // 可提前预约7天
let formatTimeNow = util.formatTime(now);
let formatMaxTime = util.formatTime(maxTime);
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

  },
  /**
   * 组件的初始数据
   */
  data: {
    applyCarLately: {},
    toTimeline: false, // 跳转到timeline页面
    spinning: true, // 加载中
    counter: 0,  // 文本域字数
    start_place: "", // 起始位置
    myInfo: {  // 我的信息
      name: null,
      phone: null,
      type: null
    },
    dIndex: 0,  // 部门选择索引
    departments: [],// 部门列表
    date: "2018-12-18", // 订车日期
    time: "5:32",    // 订车时间
    maxDate: '2018-12-31',  // 最大订车时间
    start_place_latitude: "", // 起始位置经度
    start_place_longitude: "",// 起始位置纬度
    people_number_range: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], //人数选择列表
    people_number_index: 0  //人数选择索引
  },
  lifetimes: {
    attached: function () {
      let that = this;
      post('miniprogram/Apply_car/applyCarLately')
        .then(data => {
          that.setData({spinning:false});
          let applyCarLately = data.data;
          // 如果订单状态值不为2,5,6则跳转到申请订单页面
          if (applyCarLately.status !== 6 && applyCarLately.status !== 5 && applyCarLately.status !== 2) {
            that.setData({
            toTimeline: true,
            applyCarLately: applyCarLately,
            })
          }
        })
        .catch(() => that.setData({ spinning: false }))
      this.setData({
        myInfo: app.globalData.user_info,
        date: formatTimeNow.formatedDate,
        time: formatTimeNow.formatedTime,
        maxDate: formatMaxTime.formatedDate,
      });
      // console.log(formatMaxTime.formatedDate);
      this.initValidate();
      this.getDepartments();
    }
  },
  wxValidate: {},
  methods: {
    initValidate: function () {
      const rules = {
        start_place: {
          required: true
        },
        destination_place: {
          required: true
        },
        name: {
          required: true,
          rangelength: [2, 10]
        },
        phone: {
          required: true,
          tel: true
        }
      };
      const messages = {
        start_place: {
          required: "请填写出发地"
        },
        destination_place: {
          required: "请填写目的地"
        },
        name: {
          required: "请填写姓名",
          minlength: "所填写姓名必须在2-10个汉字之间"
        },
        phone: {
          required: "请填写手机号",
          tel: "请填写正确的手机号码"
        }
      };
      this.wxValidate = new WxValidate(rules, messages);
    },
    showModal: function (error) {
      $Message({
        content: error.msg,
        type: "error"
      });
    },
    //获取部门信息
    getDepartments: function () {
      let that = this;
      post("miniprogram/Common/allDepartment")
      .then(res => {
        let departments = res.data;
          if (departments) {
            this.setData({departments: departments})
          }
      })
    },
    // 部门选取
    bindDepartmentChange(e) {
      this.setData({
        dIndex: e.detail.value
      });
    },
    // 日期选取
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      });
    },
    // 时间选取
    bindTimeChange: function (e) {
      this.setData({
        time: e.detail.value
      });
    },
    // 人数选取
    bindPeopleNumChange: function (e) {
      this.setData({
        people_number_index: e.detail.value
      });
    },
    // 文本域计数器
    bindText: function (e) {
      var t_text = e.detail.value.length;
      this.setData({
        counter: t_text
      });
    },
    // 用户跳转到等待界面
    b2aListener(e) {
      this.setData({ toTimeline: false })
    },
    // 打开自带地图选择起始位置并返回位置信息
    chooseStartAdd: function () {
      let that = this;
      wx.chooseLocation({
        success: function (result) {
          let name = result.name;
          let address = result.address;
          let latitude = result.latitude;
          let longitude = result.longitude;
          that.setData({
            start_place: name,
            start_place_latitude: latitude,
            start_place_longitude: longitude,
            address: address
          });
        }
      });
    },
    // 打开自带地图选择目的位置并返回位置信息
    chooseDestinationAdd: function () {
      let that = this;
      wx.chooseLocation({
        success: function (result) {
          let name = result.name;
          let address = result.address;
          let latitude = result.latitude;
          let longitude = result.longitude;
          that.setData({
            destination_place: name,
            // destination_place_latitude: latitude,
            // destination_place_longitude: longitude,
            // destination_address: address
          });
        }
      });
    },

    // 申请用车
    submitCar: function (e) {
      let that = this;
      let wxValidate = this.wxValidate;
      const params = e.detail.value;
      let departments = this.data.departments;
      let dIndex = this.data.dIndex;
      let phone = params.phone;
      let name = params.name;
      let go_time = params.date + " " + params.time;
      let destination_place = params.destination_place;
      let people_number = this.data.people_number_range[params.people_number];
      let reason = params.reason;
      let start_place = params.start_place;
      let start_place_latitude = this.data.start_place_latitude;
      let start_place_longitude = this.data.start_place_longitude;
      let form = {
        department_id: departments[dIndex].id,
        name: name,
        phone: phone,
        people_number: people_number,
        start_place: start_place,
        start_place_latitude: start_place_latitude,
        start_place_longitude: start_place_longitude,
        destination_place: destination_place,
        go_time: go_time,
        reason: reason
      }
      // 校验表单
      if (!wxValidate.checkForm(params)) {
        const error = wxValidate.errorList[0];
        this.showModal(error);
        console.log('验证未通过');
        return false;
      } else {
        wx.showModal({
          title: '确认信息',
          content: '请确认申请信息无误',
          success(res) {
            if(res.confirm) {
              wx.showLoading({
                title: '加载中',
                mask: true,
              });
              post("miniprogram/Apply_car/applyCar", form)
                .then(res => {
                  post('miniprogram/Apply_car/applyCarLately')
                    .then(res => {
                      wx.hideLoading();
                      that.setData({
                        toTimeline: true,
                        applyCarLately: res.data
                      })
                    })
                    .catch(() => wx.hideLoading())
                })
            }
          }
        })
      }
    } // submitCar() END
  }
})
