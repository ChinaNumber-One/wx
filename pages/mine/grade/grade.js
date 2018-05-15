// pages/mine/grade/grade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    describe:'请给我们评个星吧',
    starImgs: ['/img/star_blank.png', '/img/star_blank.png', '/img/star_blank.png', '/img/star_blank.png', '/img/star_blank.png'],
    level:'满意度',
    showBtn: false,
    btnText:'提交',
    btnColor:'#ffbf1c'
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
  clickStart(e){
    this.setData({
      point: e.currentTarget.dataset.index
    })
    if(!this.data.showBtn){
      this.setData({
        showBtn:true
      })
    }
    switch (e.currentTarget.dataset.index){
      case 0: 
      for(var i=0;i<this.data.starImgs.length;i++){
        if (i <= e.currentTarget.dataset.index){
          this.data.starImgs[i] = '/img/selection.png'
        } else {
          this.data.starImgs[i] = '/img/star_blank.png'
        }
      }
      this.setData({
        starImgs: this.data.starImgs,
        level:'极差',
        btnColor:'#ffbf1c',
        btnText:'反馈',
        describe: '用的不爽？请点前往反馈问题，我们会尽快改进！',
        feedBack:true        
      })
      break;
      case 1: 
      for (var i = 0; i < this.data.starImgs.length; i++) {
        if (i <= e.currentTarget.dataset.index) {
          this.data.starImgs[i] = '/img/selection.png'
        }else {
          this.data.starImgs[i] = '/img/star_blank.png'
        }
      }
      this.setData({
        starImgs: this.data.starImgs,
        level: '失望',
        btnColor: '#ffbf1c',
        btnText: '反馈',
        describe: '用的不爽？请点前往反馈问题，我们会尽快改进！',
        feedBack: true
      })
        break;
      case 2: 
      for (var i = 0; i < this.data.starImgs.length; i++) {
        if (i <= e.currentTarget.dataset.index) {
          this.data.starImgs[i] = '/img/selection.png'
        } else {
          this.data.starImgs[i] = '/img/star_blank.png'
        }
      }
      this.setData({
        starImgs: this.data.starImgs,
        level: '一般',
        btnColor: '#ffbf1c',
        btnText: '反馈',
        describe: '用的不爽？请点前往反馈问题，我们会尽快改进！',
        feedBack: true
      })
        break;
      case 3: 
      for (var i = 0; i < this.data.starImgs.length; i++) {
        if (i <= e.currentTarget.dataset.index) {
          this.data.starImgs[i] = '/img/selection.png'
        } else {
          this.data.starImgs[i] = '/img/star_blank.png'
        }
      }
      this.setData({
        starImgs: this.data.starImgs,
        level: '满意',
        btnColor: '#5fc8f4',
        btnText: '提交',
        describe: '谢谢您的支持，我们会继续努力的！',
        feedBack: false
      })
        break;
      case 4:
      for (var i = 0; i < this.data.starImgs.length; i++) {
        if (i <= e.currentTarget.dataset.index) {
          this.data.starImgs[i] = '/img/selection.png'
        } else {
          this.data.starImgs[i] = '/img/star_blank.png'
        }
      }
      this.setData({
        starImgs: this.data.starImgs,
        level: '惊喜',
        btnColor: '#5fc8f4',
        btnText: '提交',
        describe: '谢谢您的支持，我们会继续努力的！',
        feedBack: false
      })
        break;
    }
  },
  submit(){
    if (this.data.btnText === '反馈'){
      wx.navigateTo({
        url: '/pages/mine/feedback/feedback',
      })
    }
    if (this.data.btnText === '提交') {
      wx.showToast({
        title: '提交成功！',
        icon: 'success',
        duration: 2000
      })
      wx.request({
        url: 'https://www.wordming.cn/score/add.html',
        data:{
          point:this.data.point
        },
        complete:res=>{
          if(res.data.result){
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})