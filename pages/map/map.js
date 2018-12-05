// map.js
// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');

// 实例化API核心类
var dingwei = new QQMapWX({
  key: 'FFMBZ-ZJ4AR-BFMWO-WQ3Y6-JSSJ2-QUBEI' // 必填
});

Page({
  data: {
    latitude: "",
    longitude: "",
    controls: [],
    recommend: "",
    address: "",
  },

  onLoad() {
    var that = this;
    //获取地图的id，返回该地图的示例
    this.map = wx.createMapContext("map");

    //设置黑色标记的位置在地图中央
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '/img/dingwei.png',
            position: {
              left: res.windowWidth / 2 - 25,
              top: res.windowHeight / 2 - 50,
              width: 50,
              height: 50,
            }
          }]
        })
      }
    })

    //获取用户当前地址‘经纬度’以及地址描述
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(res.latitude)
        console.log(res.longitude)

        //获取当前经纬度的地址描述
        dingwei.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            that.setData({
                recommend: res.result.formatted_addresses.recommend,
                address: res.result.address,
              },
              console.log(res.result.formatted_addresses.recommend),
              console.log(res.result.address),
            )
          },
          fail: function(res) {
            console.log(res);
          },
        })
        that.setData({
          latitude: latitude,
          longitude: longitude,
        });
      },
    })
  },

  //用户移动地图，获取地图中心（黑色标点的位置）
  bindregionchange: function(e) {
    var that = this;
    //获取移动位置时间属性，只有当结束移动时才执行函数
    var etype = e.type;
    if (etype == "end") {
      //获取中心位置的经纬度
      that.map.getCenterLocation({
        success: function(res) {
          //设置经纬度
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
          });
          
          //获取当前经纬度的地址描述
          dingwei.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              that.setData({
                recommend: res.result.formatted_addresses.recommend,
                address: res.result.address,
              },
                console.log(res.result.formatted_addresses.recommend),
                console.log(res.result.address),
              )
            },
            fail: function (res) {
              console.log(res);
            },
          })//获取位置描述
        }
      })
    }
  },
})