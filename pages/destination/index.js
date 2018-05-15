const app = getApp()
Page({
  data:{
    place:"定位中…",
    locationInfo:null,
    city:"定位中…",
    dataInfo: null,
  },
  onLoad(options) {
    wx.showLoading({
      title: '正在定位……',
      mask: true
    })
    this.getLocation();
  },
  onShow() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    if(app.city && app.city !== this.data.city) {
      this.setData({
        city: app.city
      })
      this.getData();
    }  
  },
  getLocation() {
    //获取经纬度
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: this.getLocationSucc.bind(this)
    })
  },
  getLocationSucc(res) {
    app.qqmapsdk.reverseGeocoder({
      // location: {
      //   latitude: res.latitude,
      //   longitude: res.longitude
      // },
      success: this.reverseLocationSucc.bind(this),
      complete: this.reverseLocationComplete.bind(this)
    })
  },
  reverseLocationSucc(addressRes) {
    this.setData({
      place: addressRes.result.formatted_addresses.recommend,
      locationInfo: addressRes.result.address_component,
      city: addressRes.result.address_component.city.replace(/市/g, "")
    })
    app.province = this.data.locationInfo.province
    app.city = this.data.city
  },
  reverseLocationComplete() {
    wx.stopPullDownRefresh()
    this.getData();
  },
  getData() {
    wx.request({
      url: 'https://www.wordming.cn/common/place.html',
      data: {
        city: this.data.city
      },
      success: this.getDataSucc.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
  },
  getDataSucc(res) {
    if (res.data.data) {
      //热门城市存储到全局
      var hotcityList = []
      res.data.data.views.map( (value, index) => {
        hotcityList.push(value.city)
      })
      app.hotCity = hotcityList
      this.setData({
        dataInfo: res.data.data
      })
    } else {
      console.log("数据为空")
    }

  },
  getDataError() {
    alert("服务器发生错误！")
  },
  ajaxComplete() {
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh() {
    this.getData();
  },
  changeCity() {
    wx.navigateTo({
      url: '/pages/switchcity/switchcity?page=destination'
    })
  },
  reloadPage(e) {
    app.city = e.currentTarget.dataset.city
    this.setData({
      city: e.currentTarget.dataset.city
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    this.getData();
  },
  goVisitDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/visitDetail/visitDetail?type=visit&id=' + id,
    })
  },
  goStrategyDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/visitDetail/visitDetail?type=strategy&id=' + id,
    })
  }
})