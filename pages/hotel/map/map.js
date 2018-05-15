const app = getApp();
Page({
  data: {
    longitude: "",
    latitude: "",
    markLat:'',
    markLng: '',
    markers: [],
    key:'旅馆',
    markIndex:null,
    controls: [{
      id: 1,
      iconPath: '/img/center.png',
      position: {
        left: 20,
        top: app.globalData.windowHeight - 90,
        width: 20,
        height: 20
      },
      clickable: true
    }]
  },

  onShow() {
    this.getLocation();  
  },

  onReady() {
    this.mapCtx = wx.createMapContext('map', this);
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.handleGetLocationSucc.bind(this)
    })
  },

  handleGetLocationSucc(res) {
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude,
      markLng: res.longitude,
      markLat: res.latitude
    })
    this.searchHotel();
  },
  searchHotel(key) {
    app.qqmapsdk.search({
      keyword: this.data.key,
      page_size: 20,
      address_format: 'short',
      location: {
        latitude: this.data.markLat,
        longitude: this.data.markLng
      },
      success: this.searchHotelSucc.bind(this),
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        
      }
    });
  },
  searchHotelSucc(res) {
    let marksArr = []
    for (var i = 0; i < res.data.length; i++) {
      if(res.data[i].tel !== ' '){
        marksArr.push({
          id: res.data[i].id,
          latitude: res.data[i].location.lat,
          longitude: res.data[i].location.lng,
          title: res.data[i].title,
          address: res.data[i].address,
          tel: res.data[i].tel,
          width: 20,
          height: 20,
          // iconPath: '/img/hotelMark.png',
          callout: {
            display: "ALWAYS",
            content: res.data[i].title,
            color: "#f3310a"
          }
        })
      }
    }
    this.setData({
      markers: marksArr
    })
  },
  controltap() {
    this.mapCtx.moveToLocation();
  },

  onShareAppMessage() {
    // return {
    //   title: '即刻出发',
    //   path: '/pages/index/index'
    // }
  },

  handleMarkerTap(e) {
    var markId = e.markerId
    for(var i=0;i<this.data.markers.length;i++){
      if (this.data.markers[i].id === markId) {
        this.setData({
          markIndex : i
        })
        console.log(this.data.markers[i])
        wx.showModal({
          title: '店家：' + this.data.markers[i].title,
          content: '地址：' + this.data.markers[i].address,       
          confirmText: '联系商家',
          success: this.getHotelSuccess.bind(this)
        })
        
      }
    }
  },
  changeView(e) {
    this.mapCtx.getCenterLocation({
      success: this.getCenterPointSucc.bind(this)
    })
  },
  getCenterPointSucc(res){
    setTimeout(()=>{
      this.setData({
        markLat: res.latitude,
        markLng: res.longitude
      })
      // 搜索拖动地图后 屏幕中心点附近酒店
      // this.searchHotel();
    },500)
  },
  getHotelSuccess(res){
    if (res.confirm) {
      wx.makePhoneCall({
        phoneNumber: this.data.markers[this.data.markIndex].tel
      })
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
  
  
})
