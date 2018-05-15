// pages/mine/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    phone:'',
    weixin:'',
    QQ:''
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
  checkContent(e){
    if(e.detail.value !== ''){
      this.setData({
        content:e.detail.value
      })
    }
  },
  checkPhone(e) {
    if (e.detail.value !== '') {
      const regPhone = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (regPhone.test(e.detail.value)) {
        this.setData({
          phone: e.detail.value
        })
      } else {
        
      }
    }
  },
  checkWeixin(e) {
    if (e.detail.value !== '') {
      this.setData({
        weixin: e.detail.value
      })
    }
  },
  checkQQ(e) {
    if (e.detail.value !== '' && typeof e.detail.value === 'Number') {
      this.setData({
        QQ: e.detail.value
      })
    }
  },
  submitFeedBack(){
    if(this.data.content !=='' && this.data.phone !== ''){
      var query = {}
      query.text = this.data.content
      query.phone = this.data.phone
      if(this.data.weixin !== ''){
        query.wechat = this.data.weixin
      }
      if(this.data.QQ !== ''){
        query.qq = this.data.QQ
      }
      wx.showToast({
        title: '提交成功！',
        icon: 'success',
        duration: 2000,
      })
      wx.request({
        url: 'https://www.wordming.cn/tickling/add.html',
        data: query,
        complete: res => {
          if(res.data.result){
            wx.switchTab({
              url: '/pages/mine/index',
            })
          }
        }
      })
    } 
    if(this.data.content === ''){
      wx.showToast({
        title: '您还未填写内容！',
        icon: 'none',
        duration: 1500
      })
    }

    if(this.data.phone === ''){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 1500
      })
    }
  }
})