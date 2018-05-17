// pages/ticket/ticketList/ticketList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    startCity:'',
    endCity: '',
    list:[1],
    showPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date:options.date,
      startCity:options.startCity,
      endCity:options.endCity
    })
    wx.setNavigationBarTitle({
      title: options.startCity + '-' + options.endCity
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
    this.getTicketList()
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
  getTicketList(){
    wx.showLoading({
      title: '正在查询，请稍后',
    })
    wx.request({
      url: 'https://www.wordming.cn/common/tickets.html',
      data:{
        startName:this.data.startCity,
        endName:this.data.endCity,
        queryDate:this.data.date
      },
      success:res=>{
        wx.hideLoading()
        this.setData({
          showPage:true
        })
        if(res.data.data){
          this.setData({
            list: res.data.data
          })
        }
      }
    })
  },
  backToSearch(){
    wx.navigateBack({
      delta: 1
    })
  }
})