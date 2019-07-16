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
        if (applyCarLately.status === 6) {
          if (applyCarLately.is_can_comment) {
            if (applyCarLately.comment === null) {
              that.setData({
                toTimeline: true,
                applyCarLately: applyCarLately
              })
            }
          }
        } else {
          that.setData({
            toTimeline: true,
            applyCarLately: applyCarLately
          })
        }
      })
      this.setData({
        myInfo: wx.getStorageSync("user_info"),
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
  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 表单-验证字段
   */
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
          minlength: "请输入正确的名称"
        },
        phone: {
          required: "请填写手机号",
          tel: "请填写正确的手机号"
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
    bindDepartmentChange(e) {
      this.setData({
        dIndex: e.detail.value
      });
    },
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      });
    },
    bindTimeChange: function (e) {
      this.setData({
        time: e.detail.value
      });
    },
    bindPeopleNumChange: function (e) {
      this.setData({
        people_number_index: e.detail.value
      });
    },
    //文本域计数器
    bindText: function (e) {
      var t_text = e.detail.value.length;
      this.setData({
        counter: t_text
      });
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
      const params = e.detail.value;
      let wxValidate = this.wxValidate;
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
        return false;
      } else {
        post("miniprogram/Apply_car/applyCar", form)
          .then(res => {
            that.setData({ toTimeline: true })
          })
        // let sessionid = app.globalData.sessionid;
        // wx.request({
        //   url: host + "miniprogram/Apply_car/applyCar",
        //   data: {
        //     sessionid: sessionid,
        //     department_id: departments[dIndex].id,
        //     name: name,
        //     phone: phone,
        //     people_number: people_number,
        //     start_place: start_place,
        //     start_place_latitude: start_place_latitude,
        //     start_place_longitude: start_place_longitude,
        //     destination_place: destination_place,
        //     go_time: go_time,
        //     reason: reason
        //   },
        //   method: "POST",
        //   success: res => {
        //     let status = res.data.status;
        //     if (status == 0 || status == 1) {
        //       wx.redirectTo({
        //         url: "./loading"
        //       });
        //     } else {
        //       wx.showToast({
        //         title: 请求失败,
        //         icon: "none"
        //       });
        //     }
        //   },
        //   fail() {
        //     wx.showModal({
        //       title: '登陆异常',
        //     })
        //   }
        // });
      }
    } // submitCar() END
  }
})
