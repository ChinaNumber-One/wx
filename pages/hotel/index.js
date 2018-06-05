
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    hotelList:[],
    autoplay: false,    
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
    hotelListInterfage:'https://route.showapi.com/1450-1?showapi_appid=65611&showapi_sign=160177dac6604f0d947485ebbe89e94d&cityName=',
    hotelImgInterfage:'https://route.showapi.com/1450-3?showapi_appid=65611&showapi_sign=160177dac6604f0d947485ebbe89e94d&hotalId='
    // //模拟数据接口
    // hotelListInterfage: 'https://www.wordming.cn/static/json/searchHotel.json?cityName=',
    // hotelImgInterfage: 'https://www.wordming.cn/static/json/hotelInfo.json?hotalId='
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
    console.log(app.startTime)
    if (app.startTime && app.endTime && app.days) {
      
      this.changeData();
    } else {
      this.setDefaultTime();
    }
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
    console.log(app.city)
    this.setData({
      i:0
    })
    if (this.data.city !== app.city) {
      this.setData({
        city:app.city
      })
      this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
    }
    if (this.data.startTime !== app.startTime || this.data.endTime !== app.endTime) {
      this.changeData();
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
    var m1 = dd.getMonth() + 1;
    var y1 = dd.getFullYear();


    dd.setDate(d + 1);
    var y2 = dd.getFullYear();
    var m2 = dd.getMonth() + 1;
    var nextd = dd.getDate();
    if (m1 < 10) {
      m1 = "0" + m1
    }
    if (m2 < 10) {
      m2 = "0" + m2
    }
    if (d < 10) {
      d = "0" + d
    }
    if (nextd < 10) {
      nextd = "0" + nextd
    }
    this.setData({
      city: app.city,
      showStartTime: m1 + "月" + d + '日',
      showEndTime:  m2 + "月" + nextd + '日',
      startTime: y1 + "-" + m1 + "-" + d,
      endTime: y2 + "-" + m2 + "-" + nextd
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
    this.setData({
      i:0
    })
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
      fail: this.getDataError.bind(this)
    })
  },
  getDataSucc(res) {
    if(res.data.showapi_res_code === -1 && res.data.showapi_res_error !==''){
      wx.hideLoading()
      wx.showToast({
        title: res.data.showapi_res_error,
        icon:'none',
        duration:1500
      })
      return 
    }
    if (res.data) {
      var list = res.data.showapi_res_body.contentlist.splice(0,8)
      console.log(list)
      this.setData({
        hotelList: list,
      })
      console.log(this.data.hotelList.length)
      for (var i = 0; i < this.data.hotelList.length;i++) {
        this.getImgRequest(this.data.hotelImgInterfage + this.data.hotelList[i].hotalId, this.getImgSucc)
      }
    } else {
      console.log("数据为空")
    }

  },
  getImgRequest(url,fn){
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
    wx.request({
      url: url,
      complete: fn.bind(this),
      fail: this.getDataError.bind(this)
    })
  },
  getImgSucc(res) {
    console.log(res)
    if (res.data.showapi_res_code ===0&&res.data.showapi_res_body.imgList){
      app.swiperHotel.push(res.data.showapi_res_body)
      // for (var _i = 0; _i < res.data.showapi_res_body.imgList.length;_i++ ){
      //   if (res.data.showapi_res_body.imgList[_i].isHotalDefault === 1) {
          
      //     break;
      //   }
      // }
      var imgUrl = res.data.showapi_res_body.imgList[0].imgUrl
      for (var h = 0; h < this.data.hotelList.length; h++) {
        if (this.data.hotelList[h].hotalId == res.data.showapi_res_body.hotalId) {
          this.data.hotelList[h].imgUrl = imgUrl
        }
        // break;
      }
      
      
    }
    this.data.i++
    this.setData({
      hotelList: this.data.hotelList,
      autoplay: true
    })
    if(this.data.i === this.data.hotelList.length){
      this.ajaxComplete()
    }
  },
  getDataError() {
    wx.showToast({
      title: '服务端发生错误！',
      icon: 'none',
      duration: 2000
    })
  },
  ajaxComplete() {
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh() {
    this.data.i = 0;
    this.getData(this.data.hotelListInterfage + app.city, this.getDataSucc);
  },
  goHotelDetail(e) {
    wx.navigateTo({
      url: '/pages/hotel/hotelDetail/hotelDetail?hotelId=' + e.currentTarget.dataset.hotelid
    })
  },
  searchHotelList(){
    wx.navigateTo({
      url: '/pages/hotel/hotelList/hotelList?city='+app.city,
    })
  }
})