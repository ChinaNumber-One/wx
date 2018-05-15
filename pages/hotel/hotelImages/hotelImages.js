// pages/hotelImages/hotelImages.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'all',
    imgList:{},
    allImages:[],
    outLookImages:[],
    hallImages:[],
    roomImages:[],
    otherImages:[]
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
    var allArr = [],
        hallArr = [],
        outLookArr = [],
        roomArr = [],
        otherArr = [];
    for (var a1 = 0; a1 < app.hotelImg.outLook.length;a1++){
      outLookArr.push(app.hotelImg.outLook[a1].imgUrl)
    }
    for (var a2 = 0; a2 < app.hotelImg.hall.length; a2++) {
      hallArr.push(app.hotelImg.hall[a2].imgUrl)
    }
    for (var a3 = 0; a3 < app.hotelImg.roomType.length; a3++) {
      roomArr.push(app.hotelImg.roomType[a3].imgUrl)
    }
    for (var a4 = 0; a4 < app.hotelImg.other.length; a4++) {
      otherArr.push(app.hotelImg.other[a4].imgUrl)
    }
    var allArr = allArr.concat(outLookArr, hallArr, roomArr, otherArr)
    this.setData({
      allImages: allArr,
      outLookImages: outLookArr,
      hallImages: hallArr,
      roomImages: roomArr,
      otherImages: otherArr,
      imgList: app.hotelImg
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
  //改变topbar 添加 class  样式
  menuClick (e) {
    this.setData({
      type: e.target.dataset.type
    })
  },
  //图片查看器
  lookImg(e) {
    var urls = []
    switch(this.data.type){
      case 'all' : urls = this.data.allImages;break;
      case 'outLook': urls = this.data.outLookImages;break;
      case 'hall': urls = this.data.hallImages;break;
      case 'room': urls = this.data.roomImages;break;      
      case 'other': urls = this.data.otherImages;break;
    }
    wx.previewImage({
      current: e.currentTarget.dataset, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
})