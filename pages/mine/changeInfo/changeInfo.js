// pages/mine/changeInfo/changeInfo.js
var Moment = require("../../dateSelet/utils/Moment.js");
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:null,
    userId:null,
    phone: null,
    userImg: null,
    nickName: null,
    sex: null,
    birth: null,
    desc: null,
    wrongName:false,
    textAreaHeight:50,
    endDate: Moment(new Date()).format('YYYY-MM-DD'),
    sexRadio: [
      {  value: '男' , checked: '' },
      { value: '女', checked: ''},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          height: res.windowHeight
        })
      },
    })
    wx.getStorage({
      key: 'ISLOGIN',
      success: (res) => {
        this.setData({
          userId: res.data.userId,
          phone: res.data.phone
        })
      }
    })
    wx.getStorage({
      key: 'USER_INFO',
      success: (res) => {
        this.setData({
          userImg: res.data.userImg,
          nickName: res.data.nickName,
          desc: res.data.desc,
          sex: res.data.sex,
          birth: res.data.birth
        })
        var reg = /^[\w\u4e00-\u9fa5]{3,8}$/;
        if (!reg.test(res.data.nickName)) {
          this.setData({
            wrongName: true
          })
        } else {
          this.setData({
            wrongName: false
          })
        }
        for (var i = 0; i < this.data.sexRadio.length;i++){
          if (this.data.sexRadio[i].value === this.data.sex){
            this.data.sexRadio[i].checked = 'true'
          }
        }
        this.setData({
          sexRadio: this.data.sexRadio
        })
      }
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
  radioChange(e){
    this.setData({
      sex: e.detail.value
    })
    console.log(e.detail.value)
  },
  saveName(e){
    var reg = /^[\w\u4e00-\u9fa5]{3,8}$/;
    if (!reg.test(e.detail.value)){ 
      this.setData({
        wrongName:true
      })
    } else {
      this.setData({
        wrongName: false
      })
    }
    this.setData({
      nickName: e.detail.value
    })
  },
  saveDesc(e){
    console.log(e)
    this.setData({
      desc: e.detail.value
    })
  },
  showReg(){
    wx.showToast({
      title: '只能由数字,字母,汉字,下划线组成，共3-8位',
      icon:'none',
      duration:3000
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birth: e.detail.value
    })
  },
  changeImg(){
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        //图片本地地址
        this.setData({
          userImg: res.tempFilePaths[0]
        })
        
      }
    })
    
  },
  submitFeedBack(){
    wx.showLoading({
      title: '正在保存……',
    })
    var regHttp = /^https+/
    if (regHttp.test(this.data.userImg)){
      console.log('http')
      wx.downloadFile({
        url: this.data.userImg, 
        complete:  (res)=> {
          if (res.statusCode === 200) {
            this.setData({
              userImg: res.tempFilePath
            })
            console.log(this.data.userImg)
            this.uploadImg()
          }
        }
      })
    }else {
      console.log(this.data.userImg)
      this.uploadImg()
    }
  },
  uploadImg(){
    const uploadTask = wx.uploadFile({
      url: 'https://www.wordming.cn/common/userInfo.html',
      filePath: this.data.userImg,
      name: 'userImg',
      formData: {
        'id': this.data.userId,
        'nickname': this.data.nickName,
        'birth': this.data.birth,
        'sex': this.data.sex,
        'desc': this.data.desc
      },
      fail: res => {
        wx.showToast({
          title: "顶部图片未添加……",
          icon: 'none',
          duration: 2000
        })
      },
      complete: res => {
        setTimeout(res=>{
          wx.switchTab({
            url: '/pages/mine/index'
          })
        },1000)
      }
    })
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '上传图中（' + res.totalBytesSent + '/' + res.totalBytesExpectedToSend + '）',
      })
      if (res.progress === 100) {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
      }
    })
  },
  bindlinechange(e){
    var lineCount = e.detail.lineCount
    if (e.detail.lineCount == 2){
      lineCount = e.detail.lineCount - 1
    }
    this.setData({
      textAreaHeight: 30 * lineCount
    })
  }
  
})