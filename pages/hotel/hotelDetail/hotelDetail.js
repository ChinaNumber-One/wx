// pages/hotelDetail/hotelDetail.js
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelId:null,
    dataInfo:null,
    buildTime:'',
    imgList:{},
    roomList:[],
    hotelLat:'',
    hotelLon:'',
    myLat:'',
    myLon:'',
    startTime:'',
    endTime:'',
    showStartTime:'',
    showEndTime:'',
    days:null,
    roomInfo:null,
    showRoomInfo:false,
    distance:'计算距离中……',
    // hotelInfoInterface:'https://www.wordming.cn/static/json/hotelBaseInfo.json',
    // hotelRoomInterface:'https://www.wordming.cn/static/json/hotelRoom.json',
    // roomPriceInterface: 'https://www.wordming.cn/static/json/hotelPrice.json'
    hotelInfoInterface: 'https://route.showapi.com/1450-4',
    hotelRoomInterface: 'https://route.showapi.com/1450-2',
    roomPriceInterface: 'https://route.showapi.com/1450-5'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hotelId: options.hotelId
    })
    
    
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
    if (app.startTime && app.endTime && app.days) {
      this.setData({
        showStartTime: app.startTime.split('-')[1] + '月' + app.startTime.split('-')[2] + '日',
        showEndTime: app.endTime.split('-')[1] + '月' + app.endTime.split('-')[2] + '日',
        days: app.days
      })
    } 
    this.getDataSucc();
    var infoQuery = {
      hotalId: this.data.hotelId,
      showapi_appid: 65611,
      showapi_sign: '160177dac6604f0d947485ebbe89e94d'
    }
    this.getData(this.data.hotelInfoInterface, infoQuery, this.getInfoSucc.bind(this))
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getData(url, data, fn, complete) {
    wx.request({
      url: url,
      success: fn,
      data:data,
      fail: this.getDataError.bind(this),
      complete: complete || function(){
        // this.ajaxComplete.bind(this)
      }
    })
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
  },
  getDataSucc() {
    var res ={}
    //从 存储轮播图酒店图片中找到当前酒店的图组
    for (var i = 0; i < app.swiperHotel.length; i++) {
      if (app.swiperHotel[i].hotalId === this.data.hotelId) {
        res = app.swiperHotel[i]
      }
    }
    if (res.imgList) {
      var outLook = [],
          hall = [],
          roomType=[],
          other=[];
      for (var i = 0; i < res.imgList.length;i++){
        if (res.imgList[i].imgType === 1) {
          outLook.push(res.imgList[i]);
        } else if (res.imgList[i].imgType === 2) {
          hall.push(res.imgList[i]);
        } else if (res.imgList[i].imgType === 4) {
          roomType.push(res.imgList[i]);
        } else {
          other.push(res.imgList[i]);
        }
      }
      this.setData({
        imgList: {
          hotelId: res.hotalId,
          hotelName: res.hotalName,
          imgNums: res.imgList.length,
          outLook : outLook,
          hall : hall,
          roomType : roomType,
          other : other
        }
      })
      // 存储当前酒店图片信息
      app.hotelImg = this.data.imgList
    } else {
      console.log("数据为空")
    }

  },
  getInfoSucc(res) {
    WxParse.wxParse('article', 'html', res.data.showapi_res_body.subNotice, this, 5)
    this.setData({
      buildTime: res.data.showapi_res_body.renovationTime.substring(0, 4),
      dataInfo: res.data.showapi_res_body,
    })
    //酒店经纬度  计算距离 还需获取 定位的经纬度
    if (res.data.showapi_res_body.hotalGPS !== []){
      this.setData({
        hotelLat: res.data.showapi_res_body.hotalGPS[0].hotalGPSLat,
        hotelLon: res.data.showapi_res_body.hotalGPS[0].hotalGPSLon,
      })
    }
    wx.getLocation({
      type: 'wgs84',
      success: this.getLocationSucc.bind(this)
    })
    var roomQuery = {
      hotalId: this.data.hotelId,
      showapi_appid: 65611,
      showapi_sign: '160177dac6604f0d947485ebbe89e94d'
    }
    this.getData(this.data.hotelRoomInterface ,roomQuery, this.getRoomSucc.bind(this))
  },
  getRoomSucc(res){
    console.log(res.data.showapi_res_body.roomList)
    if (res.data.showapi_res_body.roomList && this.data.imgList.roomType){
      for (var i = 0; i < res.data.showapi_res_body.roomList.length; i++){
        res.data.showapi_res_body.roomList[i].imgUrl = []
        for (var j = 0; j < this.data.imgList.roomType.length;j++) {
          if (res.data.showapi_res_body.roomList[i].roomId == this.data.imgList.roomType[j].roomId){
            res.data.showapi_res_body.roomList[i].imgUrl.push(this.data.imgList.roomType[j].imgUrl)
          }
        }
      }
      
    }
    this.setData({
      roomList: res.data.showapi_res_body.roomList
    })
    //获取价格信息
    var priceQuery = {
      showapi_appid: 65611,
      showapi_sign: '160177dac6604f0d947485ebbe89e94d',
      hotalId: this.data.hotelId,
      startTime: app.startTime,
      endTime: app.endTime
    }
    this.getData(this.data.roomPriceInterface, priceQuery, this.getPriceSucc.bind(this), this.ajaxComplete.bind(this))
  },
  getPriceSucc(res){
    for (var i = 0; i < this.data.roomList.length; i++) {
      for (var j = 0; j < res.data.showapi_res_body.result.length; j++) {
        if (this.data.roomList[i].roomId == res.data.showapi_res_body.result[j].roomId
          && this.data.roomList[i].roomPriceId == res.data.showapi_res_body.result[j].roomPriceId
          ) {
          this.data.roomList[i].priceInfo = res.data.showapi_res_body.result[j]
          //判断剩余房间数
          if (res.data.showapi_res_body.result[j].proSaleInfoDetails.length === 0){
            this.data.roomList[i].showPrice = false;
          } else {
            this.data.roomList[i].showPrice = true
            var sum = 0;
            var minPrice = 9999999999;
            for (var rooms = 0; rooms < res.data.showapi_res_body.result[j].proSaleInfoDetails.length;rooms++){
              sum += res.data.showapi_res_body.result[j].proSaleInfoDetails[rooms].inventoryStats
              //最低价格
              minPrice = minPrice > res.data.showapi_res_body.result[j].proSaleInfoDetails[rooms].distributorPrice ? 
                          res.data.showapi_res_body.result[j].proSaleInfoDetails[rooms].distributorPrice : minPrice;
            }
            this.data.roomList[i].priceInfo.minPrice = minPrice
            // console.log(minPrice)
            if (sum === Number(res.data.showapi_res_body.result[j].proSaleInfoDetails.length)*4){
              this.data.roomList[i].roomBanSale = true
            } else {
              this.data.roomList[i].roomBanSale = false
            }
          }
        }
      }
      if (this.data.roomList[i].roomCounts){
        this.data.roomList.push(this.data.roomList[i])
        this.data.roomList.splice(i,1)
      }
      if (this.data.roomList[i].imgUrl){
        this.data.roomList[i].imgCount = this.data.roomList[i].imgUrl.length;
      }
      this.data.roomList[i].bedSize = this.data.roomList[i].bedSize.split(',')
    }
    //按价格排序
    this.data.roomList.sort(function(x,y){
      return x.priceInfo.minPrice - y.priceInfo.minPrice
    })
    this.setData({
      roomList:this.data.roomList
    })
  },
  getLocationSucc(res){
    this.setData({
      myLat:res.latitude,
      myLon:res.longitude
    })
    app.qqmapsdk.calculateDistance({
      to: [{
        latitude: this.data.hotelLat,
        longitude: this.data.hotelLon
      }],
      success: function (res) {
        var distance = res.result.elements[0].distance
        if(distance%1000 > 0) {
          this.setData({
            distance: (distance/1000).toFixed(2) + '公里'
          })
        } else{
          this.setData({
            distance: distance + '米'
          })
        }
        
      }.bind(this),
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log("计算距离完成");
      }
    });
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
    this.getDataSucc();
    var infoQuery = {
      hotalId: this.data.hotelId,
      showapi_appid: 65611,
      showapi_sign: '160177dac6604f0d947485ebbe89e94d'
    }
    var roomQuery = {
      hotalId: this.data.hotelId,
      showapi_appid: 65611,
      showapi_sign: '160177dac6604f0d947485ebbe89e94d'
    }
    this.getData(this.data.hotelInfoInterface, infoQuery, this.getInfoSucc.bind(this))
    this.getData(this.data.hotelRoomInterface, roomQuery, this.getRoomSucc.bind(this))
  },
  lookImages() {
    wx.navigateTo({
      url: '/pages/hotel/hotelImages/hotelImages',
    })
  },
  changeDay() {
    wx.navigateTo({
      url: '/pages/dateSelet/dateSelect',
    })
  },
  bookingPhone(){
    wx.showModal({
      title: '拨打酒店电话？',
      content: '确定拨打电话预定房间？',
      confirmText: '拨打',
      success: this.callPhone.bind(this)
    })
  },
  callPhone(res){
    if (res.confirm) {
      wx.makePhoneCall({
        phoneNumber: this.data.dataInfo.hotalPhone
      })
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  },
  roomInfo(e){
    this.setData({
      roomInfo: this.data.roomList[e.currentTarget.dataset.index]
    })
   
    wx.getSystemInfo({
      success: function (res) {
       this.setData({
         systemInfo:res,
         showRoomInfo: true
       })
      }.bind(this)
    })
  },
  closeMasking(){
    this.setData({
      showRoomInfo: false,
    })
  },
  lookImg(e){
    wx.previewImage({
      current: this.data.roomInfo.imgUrl[e.currentTarget.dataset.index], 
      urls: this.data.roomInfo.imgUrl
    })
  },
  moreFacilities(){
    this.data.roomInfo.moreRoomFacilities = []
    for(var i = 0; i< this.data.roomInfo.roomFacilities.length; i++) {
      if (this.data.roomInfo.roomFacilities[i].roomFacilitiesDescription !== '暂无') {
        this.data.roomInfo.moreRoomFacilities.push(this.data.roomInfo.roomFacilities[i].roomFacilitiesName)
      }
    }
    this.data.roomInfo.showMoreRoomFacilities = true
    this.setData({
      roomInfo:this.data.roomInfo
    })
  },
  hideRoomFacilities(){
    this.data.roomInfo.showMoreRoomFacilities = false
    this.setData({
      roomInfo: this.data.roomInfo
    })
  },
  findWay(){
    wx.navigateTo({
      url: '/pages/hotel/hotelDetail/navigation/navigation?lat=' + this.data.hotelLat + '&lon=' + this.data.hotelLon + '&placeName='+this.data.dataInfo.hotalName,
    })
  }
})

