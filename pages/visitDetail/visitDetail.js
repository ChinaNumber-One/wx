// pages/visitDetail/visitDetail.js
var WxParse = require('../../wxParse/wxParse.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{},
    article:null,
    url:'',
    types:'',
    ID:'',
    userImgDefault:'/img/userimg.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type === 'strategy'){
      wx.setNavigationBarTitle({
        title: '攻略详情页'
      })
      this.setData({
        types: options.type,
        url: 'https://www.wordming.cn/strategy/get.html?id='
      })
    } else if(options.type === 'visit'){
      wx.setNavigationBarTitle({
        title: '游记详情页'
      })
      this.setData({
        types: options.type,
        url: 'https://www.wordming.cn/visit/get.html?id='
      })
    }
    this.setData({
      id:options.id
    })
    this.getData(this.data.id)
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

  getData(id) {
    // console.log(this.data.url)
    wx.showNavigationBarLoading()
    wx.request({
      url: this.data.url + id,
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
    if (res.data.data.visit) {
      WxParse.wxParse('article', 'html', res.data.data.visit.content, this, 5)
      this.setData({
        dataInfo: res.data.data.visit
      })
    } else if (res.data.data.strategy) {
      WxParse.wxParse('article', 'html', res.data.data.strategy.content, this, 5)
        this.setData({
          dataInfo: res.data.data.strategy
        })
    } else {
      console.log('数据为空！')
    }
   var reg = /^http/
   if (!reg.test(this.data.dataInfo.imgUrl)){
     this.data.dataInfo.imgUrl = 'https://www.wordming.cn' + this.data.dataInfo.imgUrl
     this.setData({
       dataInfo: this.data.dataInfo
     })
   }
   if (!reg.test(this.data.dataInfo.userImg)) {
     this.data.dataInfo.userImg = 'https://www.wordming.cn' + this.data.dataInfo.userImg
     this.setData({
       dataInfo: this.data.dataInfo
     })
   }
  },
  getDataError() {
    alert("服务器发生错误！")
  },
  ajaxComplete() {
    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh() {
    this.getData(this.data.id)
  },
  wxParseTagATap(){
    
  },
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  }
})