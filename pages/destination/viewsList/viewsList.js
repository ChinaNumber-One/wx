// pages/destination/viewsList/viewsList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceHeight:0,
    scrollTop: 0,
    city:'',
    page: 1,
    pagesArr:[],
    province:'',
    allNum: 0,
    allPages: 0,
    contentList: null,
    defaultImg: '/img/noImg.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeightByStory()
    
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
    if(this.data.city !== app.city){
      this.setData({
        city: app.city
      })
      this.getProvince(app.city)
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getProvince(app.city)
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
  getHeightByStory(){
    wx.getSystemInfo({
      success: function(res) {
        this.setData({
          deviceHeight: res.windowHeight
        })
      }.bind(this),
    })
  },
  getView() {
    var query = {}
    if (this.data.proId){
      query.proId = this.data.proId
    }
    if(this.data.cityId){
      query.cityId = this.data.cityId
    }
    if (this.data.page > 0 && this.data.page <= this.data.allPages ){
      query.page = this.data.page
    }
    query.showapi_appid = 59145
    query.showapi_sign = '2bb96e1b9b5648ecb3210073ea6eaf71'
    wx.request({
      url: 'https://route.showapi.com/268-1',
      data: query,
      success: this.getViewSucc.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
  },
  getViewSucc(res) {
    var pagesArr = []
    for (var i = 0; i < res.data.showapi_res_body.pagebean.allPages; i++) {
      pagesArr.push(i+1)
    }
    this.setData({
      pagesArr: pagesArr,
      allNum: res.data.showapi_res_body.pagebean.allNum,
      allPages: res.data.showapi_res_body.pagebean.allPages,
      contentList: res.data.showapi_res_body.pagebean.contentlist,
      page: res.data.showapi_res_body.pagebean.currentPage
    })
  },
  getProvince(city) {
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
    app.qqmapsdk.geocoder({
      address: city,
      complete: this.getProvinceSucc.bind(this)
    })
  },
  getProvinceSucc(res) {
    this.setData({
      province : res.result.address_components.province
    })
    this.getProId();
  },
  getProId() {
    wx.request({
      url: 'https://route.showapi.com/268-2',
      data: {
        showapi_appid: 59145,
        showapi_sign: '2bb96e1b9b5648ecb3210073ea6eaf71'
      },
      success: this.getProIdSucc.bind(this),
      fail: this.getDataError.bind(this),
    })
  },
  getProIdSucc(res) {
    const provinceList = res.data.showapi_res_body.list
    for (var i = 0; i < provinceList.length; i++) {
      if (provinceList[i].name === this.data.province.replace(/省/g, "") || provinceList[i].name === this.data.province.replace(/市/g, "")) {
        this.setData({
          proId : provinceList[i].id
        })
        break;
      }
    }
    this.getCityId()
  },
  getCityId() {
    wx.request({
      url: 'https://route.showapi.com/268-3',
      data: {
        proId: this.data.proId,
        showapi_appid: 59145,
        showapi_sign: '2bb96e1b9b5648ecb3210073ea6eaf71'
      },
      success: this.getCityIdSucc.bind(this),
      fail: this.getDataError.bind(this),
    })
  },
  getCityIdSucc(res) {
    const cityList = res.data.showapi_res_body.list
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].name === app.city) {
        this.setData({
          cityId : cityList[i].id
        })
        break;
      } else {
        this.setData({
          cityId: null
        })
      }
    }
    this.getView()
    
  },
  goDetail(e){
    for (var i = 0; i < this.data.contentList.length;i++){
      if (this.data.contentList[i].id === e.currentTarget.dataset.id){
        app.currentView = this.data.contentList[i]
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/destination/viewDetail/viewDetail',
    })
  },
  //选择页码
  bindPickerChange: function (e) {
    this.setData({
      scrollTop: 0,
      page: Number(e.detail.value)+1
    })
    this.getView()
  },
  //上一页
  toLastPage(){
    if(this.data.page<=1){
      wx.showToast({
        title: '已经是第一页了～',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        scrollTop: 0,
        page: this.data.page - 1
      })
      this.getView()
    }
  },

  //下一页
  toNextPage() {
    if (this.data.page >= this.data.allPages) {
      wx.showToast({
        title: '已经是最后一页了～',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        scrollTop: 0,
        page: this.data.page + 1
      })
      this.getView()
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
  }
})