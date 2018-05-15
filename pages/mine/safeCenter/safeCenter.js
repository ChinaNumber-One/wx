// pages/mine/safeCenter/safeCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone:'',
    phoneNum:'',
    hasNum:'',
    hasCode:false,
    code:null,
    activeColor:'#ffbf1c',
    textCode:'获取验证码',
    countDown:60,
    clickAble:true
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
        var encryotionPhone = res.data.phone.split('')
        encryotionPhone[3] = '*'
        encryotionPhone[4] = '*'
        encryotionPhone[5] = '*'
        encryotionPhone[6] = '*'
        this.setData({
          userId: res.data.userId,
          phone: encryotionPhone.join('')
        })
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
  checkPhoneNum(e){
    if (e.detail.value === ''){
      wx.showToast({
        title: '请先输入完整的手机号！',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        phoneNum: e.detail.value
      })
    }
    
    
  },
  getCode(){
    if(!this.data.clickAble){
      return;
    }
    if(this.data.phoneNum === ''){
      wx.showToast({
        title: '请先输入完整的手机号！',
        icon: 'none',
        duration: 1500
      })
    } else {
      const regPhone = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (regPhone.test(this.data.phoneNum)) {
        this.getData();
      } else {
        wx.showToast({
          title: '手机号码格式输入有误！',
          icon: 'none',
          duration: 1500
        })
      }
    }
    
  },
  saveCode(e){
    this.setData({
      code: e.detail.value
    })
  },
  getData(){
    wx.showToast({
      title: '验证码已发送！',
      icon: 'success',
      duration: 1500
    })
    wx.request({
      url: 'https://www.wordming.cn/common/send_register_code.html',
      method:'POST',
      data:{
        phone:this.data.phoneNum
      },
      success:(res)=>{
       
        if(res.data.result){
          this.btnDisable();
          this.setData({
            hasCode:true
          })
        } else {
          this.getLoginCode()
        }
      }
    })
  },
  getLoginCode(){
    wx.showToast({
      title: '验证码已发送！',
      icon: 'success',
      duration: 1500
    })
    wx.request({
      url: 'https://www.wordming.cn/common/send_login_code.html',
      method: 'POST',
      data: {
        phone: this.data.phoneNum
      },
      success: (res) => {
        if (res.data.result) {
          this.btnDisable();
          this.setData({
            hasCode: true
          })
        } else {
          this.getData()
        }
      }
    })
  },
  btnDisable(){
    this.setData({
      activeColor: '#757575',
      clickAble: false
    })
    var timer = setInterval(()=>{
      this.setData({
        textCode: '重新获取(' + this.data.countDown+'秒)',
        countDown: this.data.countDown - 1,
      })
      if (this.data.countDown <0){
        clearInterval(timer)
        this.setData({
          activeColor: '#ffbf1c',
          textCode: '获取验证码',
          countDown: 60,
          clickAble: true
        })
      }
    },1000)
  },
  bindPhone(){
    if (this.data.hasCode){
      wx.request({
        url: 'https://www.wordming.cn/common/login.html',
        method:'POST',
        data:{
          phone:this.data.phoneNum,
          code:this.data.code
        },
        success:res=>{
          if(res.data.result){
            wx.setStorage({
              key: 'ISLOGIN',
              data: {
                phone:this.data.phoneNum,
                userId:res.data.userId
              }
            })
            wx.showToast({
              title: '绑定成功！',
              icon: 'success',
              duration: 1500,
              complete:()=>{
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  })
                },2000)
              }
            })
            
          } else {
            wx.showToast({
              title: '验证码输入有误！',
              icon: 'none',
              duration: 1500
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '请先获取验证码！',
        icon: 'none',
        duration: 1500
      })
    }
  }
})