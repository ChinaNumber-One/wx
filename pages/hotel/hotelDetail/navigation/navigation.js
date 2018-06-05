var amapFile = require('../libs/amap-wx.js');
var config = require('../libs/config.js');
var key = config.Config.key;
var myAmapFun = new amapFile.AMapWX({ key: key });
Page({
  data: {
    types: [{
      name: '驾车',
      class:'active'
    }, {
      name: '公交'
    }, {
      name: '骑行'
    }, {
      name: '步行'
    }],
    markers: [{
      iconPath: "../../../../img/mapicon_navi_s.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 23,
      height: 33
    }, {
      iconPath: "../../../../img/mapicon_navi_e.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    placeName: '',
    polyline: [],
    textData: null,
    steps: [],
    showSteps: false,
    height: null,
    width: null,
    city:null,
    showBus:false,
    title:'驾驶导航',
    icon:'icon-jiache',
    wayIndex:'',
    changeBusIndex:0,
  },
  onShow() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight,
          width: res.windowWidth
        })
      },
    })


  },
  onLoad: function (e) {
    if (e.placeName) {
      this.setData({
        placeName: e.placeName
      })
    }
    if (e.lat && e.lon) {
      this.data.markers[1].latitude = Number(e.lat).toFixed(6)
      this.data.markers[1].longitude = Number(e.lon).toFixed(6)
      this.setData({
        markers: this.data.markers
      })
    }
    wx.getLocation({
      altitude:true,
      success: (res) => {
        if (res.latitude && res.longitude) {
          this.data.markers[0].latitude = Number(res.latitude).toFixed(6)
          this.data.markers[0].longitude = Number(res.longitude).toFixed(6)
          this.setData({
            markers: this.data.markers
          })

        }
      },
      complete: res => {
        this.getCarWay()
        this.getPositionName()
      }
    })

  },
  getPositionName() {
    var that = this;
    myAmapFun.getRegeo({
      iconPath: "../../img/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      location: this.data.markers[1].longitude + ',' + this.data.markers[1].latitude,
      success: function (data) {
        that.setData({
          city: data[0].name.replace(/市/g, ",").split(',')[0],
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })
  },
  getWalkWay(){
    var that = this;
    var start = this.data.markers[0].longitude + ',' + this.data.markers[0].latitude
    var end = this.data.markers[1].longitude + ',' + this.data.markers[1].latitude
    wx.showLoading({
      title: '加载中……',
    })
    myAmapFun.getWalkingRoute({
      origin: start,
      destination: end,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          that.setData({
            steps: steps
          })
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        wx.hideLoading()
      }
    })
  },
  getRidingWay() {
    var that = this;
    var start = this.data.markers[0].longitude + ',' + this.data.markers[0].latitude
    var end = this.data.markers[1].longitude + ',' + this.data.markers[1].latitude
    wx.showLoading({
      title: '加载中……',
    })
    myAmapFun.getRidingRoute({
      origin: start,
      destination: end,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          that.setData({
            steps: steps
          })
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        wx.hideLoading()
      }
      
    })

  },
  getBusWay() {
    var that = this;
    var start = this.data.markers[0].longitude + ',' + this.data.markers[0].latitude
    var end = this.data.markers[1].longitude + ',' + this.data.markers[1].latitude
    wx.showLoading({
      title: '加载中……',
    })
    myAmapFun.getTransitRoute({
      origin: start,
      destination: end,
      city:this.data.city,
      success: (data)=> {
        if (data.transits) {
          var steps = data.transits;
          for (var i = 0; i < steps.length; i++) {
            // 时间
            var d = Math.floor(steps[i].duration / 86400);
            var h = Math.floor(steps[i].duration % 86400 / 3600);
            var m = Math.floor(steps[i].duration % 86400 % 3600 / 60);
            if(d!==0){
              var time = d + '天' + h + "小时" + m + '分钟'
            } else if(d === 0 && h !== 0 ){
              var time = h + "小时" + m + '分钟'
            } else if(d ===0 && h === 0) {
              var time = m + '分钟'
            }
            steps[i].time = time
            if (typeof steps[i].cost === 'object'){
              steps[i].cost = null
            } else {
              steps[i].cost = Number(steps[i].cost )
            }
          }
          this.setData({
            steps:steps
          })
          this.wayDetail()
        }
        if (data.distance) {
          that.setData({
            distance: data.distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
        wx.hideLoading()
      }
    })
  },
  getCarWay() {
    var that = this;
    var start = this.data.markers[0].longitude + ',' + this.data.markers[0].latitude
    var end = this.data.markers[1].longitude + ',' + this.data.markers[1].latitude
    wx.showLoading({
      title: '加载中……',
    })
    myAmapFun.getDrivingRoute({
      origin: start,
      destination: end,
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          that.setData({
            steps: steps
          })
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
      wx.hideLoading()
      }
    })
  },
  changeType(e){
    var value = e.target.dataset.value
    for(var i=0;i<this.data.types.length;i++){
      if(this.data.types[i].name === value){
        this.data.types[i].class = 'active'
      } else {
        this.data.types[i].class = ''
      }
    }
    if(value === '驾车'){
      this.setData({
        showBus: false,
        title:'驾车导航',
        icon:'icon-jiache',

      })
      this.getCarWay()
    } else if(value === '步行') {
      this.setData({
        showBus: false,
        title: '步行导航',
        icon:'icon-buxing'
      })
      this.getWalkWay()
    } else if (value === '骑行') {
      this.setData({
        showBus: false,
        title: '骑行导航',
        icon:'icon-qihang'
      })
      this.getRidingWay()
    } else if (value === '公交') {
      this.setData({
        showBus:true,
        title: '公交路线',
        icon:'icon-jiaotonggongjiaochekanfangtuandabamianxing'
      })
      this.getBusWay()
    }
    this.setData({
      types:this.data.types
    })
  },
  showSteps(e) {
    if (!this.data.showSteps) {
      this.setData({
        showSteps: true
      })
    } else {
      this.setData({
        showSteps: false
      })
    }

  },
  wayDetail(e){
    if(e){
      var index = e.currentTarget.dataset.index
      this.setData({
        polyline: [],
        wayIndex: e.currentTarget.dataset.index
      })
    } else {
      var index = 0;
    }
    
    var way = this.data.steps[index]
    console.log(way)
    var points = []
    for(var w = 0;w<way.segments.length;w++){
      for (var i = 0; i < way.segments[w].walking.steps.length; i++) {
        var poLen = way.segments[w].walking.steps[i].polyline.split(';');
        for (var j = 0; j < poLen.length; j++) {
          points.push({
            longitude: parseFloat(poLen[j].split(',')[0]),
            latitude: parseFloat(poLen[j].split(',')[1])
          })
        }

      }
      if (way.segments[w].bus.buslines.length>0) {
        var poLen1 = way.segments[w].bus.buslines[this.data.changeBusIndex].polyline.split(';');
        for (var n = 0; n < poLen1.length; n++) {
          points.push({
            longitude: parseFloat(poLen1[n].split(',')[0]),
            latitude: parseFloat(poLen1[n].split(',')[1])
          })
        }
      }
    }
    
    this.setData({
      polyline: [{
        points: points,
        color: "#0091ff",
        width: 6
      }]
    });
    console.log(this.data.polyline)
  },
  changeBusWay(e){
    this.setData({
      changeBusIndex: e.currentTarget.dataset.index
    })
  }
})