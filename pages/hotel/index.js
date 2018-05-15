
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelList:[],
    city:'',
    startTime:'',
    showStartTime:'',
    endTime:'',
    showEndTime: '',
    days:1,
    place:'',
    locationInfo: null,
    mainImg: [],
    //购买接口
    // hotelListInterfage:'https://route.showapi.com/1450-1?showapi_appid=59145&showapi_sign=2bb96e1b9b5648ecb3210073ea6eaf71&cityName=',
    // hotelImgInterfage:'https://route.showapi.com/1450-3?showapi_appid=59145&showapi_sign=2bb96e1b9b5648ecb3210073ea6eaf71&hotalId='
    //模拟数据接口
    hotelListInterfage: 'https://www.wordming.cn/static/json/searchHotel.json?cityName=',
    hotelImgInterfage: 'https://www.wordming.cn/static/json/hotelInfo.json?hotalId='
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
    if(app.startTime && app.endTime && app.days){
      this.changeData();
    } else {
      this.setDefaultTime();
    }
  },
  changeData() {
    var showStartTime = app.startTime.split('-')[1] + '月' + app.startTime.split('-')[2] + '日'
    var showEndTime = app.endTime.split('-')[1] + '月' + app.endTime.split('-')[2] + '日'
    this.setData({
      city: app.city,
      startTime: app.startTime,
      endTime: app.endTime,
      showStartTime: showStartTime,
      showEndTime: showEndTime,
      days: app.days
    })
    
  },
  setDefaultTime() {
    var dd = new Date();
    var d = dd.getDate();
    dd.setDate(d + 1);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var nextd = dd.getDate();
    if(m<10){
      m = "0" + m
    }
    if(d<10){
      d = "0" + d
    }
    if(nextd < 10) {
      nextd = "0" + d
    }
    this.setData({
      city: app.city,
      showStartTime: m + "月" + d + '日',
      showEndTime:  m + "月" + nextd + '日',
      startTime: y + "-" + m + "-" + d,
      endTime: y + "-" + m + "-" + nextd
    })
  },
  changeDay() {
    wx.navigateTo({
      url: '/pages/dateSelet/dateSelect',
    })
  },
  changeCity() {
    wx.navigateTo({
      url: '/pages/switchcity/switchcity?page=hotel',
    })
  },
  openMap() {
    wx.navigateTo({
      url: '/pages/hotel/map/map',
    })
  },
  getLocation() {
    wx.showLoading({
      title: '正在定位……',
      mask: true
    })
    this.setData({
      city: '定位中……'
    })
    //获取经纬度
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      success: this.getLocationSucc.bind(this)
    })
  },
  getLocationSucc(res) {
    app.qqmapsdk.reverseGeocoder({
      success: this.reverseLocationSucc.bind(this),
      complete: this.reverseLocationComplete.bind(this)
    })
  },
  reverseLocationSucc(addressRes) {
    this.setData({
      place: addressRes.result.formatted_addresses.recommend,
      locationInfo: addressRes.result.address_component,
      city: addressRes.result.address_component.province + addressRes.result.formatted_addresses.recommend
    }) 
    app.city = addressRes.result.address_component.city.replace(/市/g, "")
    wx.hideLoading()
    this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
  },
  reverseLocationComplete() {
    
  },
  getData(url, fn) {
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
    wx.request({
      url: url,
      success: fn.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
  },
  getDataSucc(res) {
    if (res.data) {
      var list = res.data.showapi_res_body.contentlist.splice(0,4)
      for(var m = 0;m<4;m++) {
        this.setData({
          hotelList: list,
          mainImg: []
        })
      }
      for (var i = 0; i < this.data.hotelList.length;i++) {
        this.getData(this.data.hotelImgInterfage + this.data.hotelList[i].hotalId, this.getImgSucc)
      }
    } else {
      console.log("数据为空")
    }

  },
  getImgSucc(res) {
    if(res.data){
      app.swiperHotel.push(res.data.showapi_res_body)
      var list = res.data.showapi_res_body.imgList;
      
      for (var _i =0 ;_i< list.length;_i++ ){
        if (list[_i].isHotalDefault === 1) {
          this.data.mainImg.push(list[_i])
          break;
        }
      }
      if (this.data.mainImg.length === this.data.hotelList.length) {
        for(var j =0;j<this.data.mainImg.length;j++){
          this.data.hotelList[j].imgUrl = this.data.mainImg[j].imgUrl
        }
        this.setData({
          hotelList: this.data.hotelList
        })
      }
      
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
    this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
  },
  goHotelDetail(e) {
    wx.navigateTo({
      url: '/pages/hotel/hotelDetail/hotelDetail?hotelId=' + e.currentTarget.dataset.hotelid
    })
  }
})