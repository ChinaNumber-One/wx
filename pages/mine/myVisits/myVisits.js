// pages/mine/myVIsits/myVIsits.js
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,
    phone:null,
    myVisits:[],
    article:null,
    articleArr:[]
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

    wx.getStorage({
      key: 'ISLOGIN',
      success: (res) => {
        this.setData({
          userId: res.data.userId,
          phone: res.data.phone
        })
      },
      complete: (res) => {
        if (res.data.phone) {
          this.setData({
            noPhone: false
          })
          this.getMyVisits()
        } else {
          wx.navigateTo({
            url: '/pages/mine/safeCenter/safeCenter',
          })
        }
      }
    })
    
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
    this.getMyVisits()
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
  getMyVisits(){
    wx.showLoading({
      title: '数据加载中……',
    })
    wx.request({
      url: 'https://www.wordming.cn/common/userVisit.html',
      data:{
        id:this.data.userId
      },
      success:res=>{
        if(res.data.data.list.length>0){
          var reg1 = /^http/
          var reg2 = /^wxfile/
          var arr = []
          for (var i = 0; i < res.data.data.list.length;i++){
            if (!reg1.test(res.data.data.list[i].title) && !reg2.test(res.data.data.list[i].title)) {
              WxParse.wxParse('article', 'html', res.data.data.list[i].article, this, 5)
              arr.push(this.data.article)
              this.data.myVisits.push(res.data.data.list[i])
            }
            this.setData({
              articleArr: arr,
              myVisits: this.data.myVisits
            })
            wx.hideLoading()
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '您还为发表过任何游记！',
            icon:'none'
          })
        }
      }
    })
  }
})