const app = getApp();
var host = app.globalData.host;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems: [{
        name: '熟悉路况',
        value: '0',
        checked: true
      },
      {
        name: '准时',
        value: '1',
        checked: true
      },
      {
        name: '安全驾驶',
        value: '2',
        checked: true
      },
      {
        name: '车内无异味',
        value: '3',
        checked: true
      },
      {
        name: '准备有矿泉水',
        value: '4',
        checked: true
      },
      {
        name: '车内干净卫生',
        value: '5',
        checked: true
      },
      {
        name: '到达帮拿行李',
        value: '6',
        checked: true
      }
    ],
    counter: 0,
    starIndex: 5
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
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

  //rate星数计算
  starsOnChange(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex': index
    })
  },

  //textarea字数计算
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      counter: t_text
    })
  },

  //提交评价
  submitRate: function (e) {
    let value = e.detail.value;
    let applyCarLately = wx.getStorageSync('applyCarLately');
    let apply_id = applyCarLately.apply_id;
    let mark = this.data.starIndex * 2;
    let basicRate = value.basicRate; // 获取基本评价的内容(Array)
    console.log(basicRate);
    let allBRate = ['0', '1', '2', '3', '4', '5', '6']; // 所有基本评价的内容
    // 将basicRate转化为['0', '1', '0', '1']的形式
    basicRate = allBRate.map(function (x) {
      if (basicRate.indexOf(x) === -1) {
        return 0;
      } else {
        return 1;
      }
    })
    let is_familiar_route = basicRate[0];
    let is_punctuality = basicRate[1];
    let is_safe = basicRate[2];
    let is_peculiar_smell = basicRate[3];
    let is_water = basicRate[4];
    let is_clean = basicRate[5];
    let is_carry = basicRate[6];
    let evaluation_content = value.extraRate;
    wx.showLoading();
    wx.request({
      url: host + 'miniprogram/Apply_car/comment',
      method: 'POST',
      data: {
        sessionid: wx.getStorageSync("sessionid"),
        apply_id: apply_id,
        mark: mark,
        is_familiar_route: is_familiar_route,
        is_punctuality: is_punctuality,
        is_safe_driving: is_safe,
        is_have_peculiar_smell: is_peculiar_smell,
        is_have_water: is_water,
        is_clean: is_clean,
        is_help_luggage: is_carry,
        content: evaluation_content
      },
      success(res) {
        wx.hideLoading();
        if (res.data.status == 0) {
          wx.showModal({
            content: '评价成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/index/index'
                });
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
        }
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  }
})