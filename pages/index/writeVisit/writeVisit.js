// pages/index/writeVisit/writeVisit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,
    phone:null,
    productInfo: {},
    imgs: 0,
    imgUrls:[],
    i:0,
    str:'',
    uploadImgs: 0,
    headImg:'',
    title:'',
    content:'',
    autoFocus: false,
    toolBar:[{
      showTypes:false,
      types:'text',
      text:'',
      images:''
    }, {
      showTypes: false,
      types:'image',
      text: '',
      images:''
      }, {
        showTypes: false,
        types: 'none',
        text: '',
        images:''
      }]
  },
  //添加图片  
  bindChooseImage: function (e) {
    var index = e.currentTarget.dataset.index
    wx.chooseImage({
      count:1,
      sourceType: ['album','camera'],
      success:  (res)=> {
        var tempFilePaths = res.tempFilePaths
        //图片本地地址
        this.data.toolBar[index].images = tempFilePaths[0]
        this.setData({
          toolBar: this.data.toolBar
        })
      }
    })
  } ,
  addHeadImg(){
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths
        this.setData({
          headImg: tempFilePaths[0]
        })
      }
    })
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
  getDataError() {
    alert("服务器发生错误！")
  },
  showTypes(e){
    var index = e.currentTarget.dataset.index
    this.data.toolBar[index].showTypes = true
    this.data.toolBar[index].autoFocus = false
    this.setData({
      toolBar: this.data.toolBar
    })
  },
  deleteContent(e){
    console.log(1)
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.data.toolBar.splice(index,1)
    this.setData({
      toolBar:this.data.toolBar
    })
  },
  addContent(e){
    var types = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.data.toolBar[index].showTypes = false
    if(index === 0){
      this.data.toolBar.splice(index, 0, {
        showTypes: false,
        types: types,
        images:''
      })
    } else {
      this.data.toolBar.splice(index, 0, {
        showTypes: false,
        types: types,
        images: ''
      })
    }
    this.setData({
      toolBar: this.data.toolBar
    })
  },
  saveTitle(e){
    this.setData({
      title: e.detail.value
    })
  },
  saveText(e){
    var value = e.detail.value
    var index = e.currentTarget.dataset.index;
    this.data.toolBar[index].text = value;
    this.data.toolBar[index].autoFocus = false ;
    this.setData({
      toolBar: this.data.toolBar
    })
    console.log(this.data.toolBar)
  },
  submitVisit(){
        
      var reg1 = /^http/
      var reg2 = /^wxfile/
      if (reg1.test(this.data.title) || reg2.test(this.data.title)) {
        wx.showToast({
          title: '标题开头不能为“http”',
          icon: 'none',
          duration: 2000,
        })
        console.log('http')
      } else if (this.data.title === '') {
        wx.showToast({
          title: '请填写标题',
          icon: 'none',
          duration: 2000,
        })
        console.log('kong')
      } else {
        if(this.data.headImg !== ''){
          if (this.data.toolBar[this.data.i].types === 'image' && this.data.toolBar[this.data.i].images !== '') {
            this.data.imgs++
            wx.showLoading({
              title: '图片上传中……',
              mask: true
            })

            this.startUpload()
          } else {
            if (this.data.i < this.data.toolBar.length - 1) {
              this.data.i++
              this.submitVisit();
            } else {
              console.log(this.data.i + '----' + this.data.toolBar.length)
              if (this.data.uploadImgs === this.data.imgs) {
                console.log(this.data.imgUrls)
                this.publishVisit()
              }
            }
          }
        } else {
          wx.showToast({
            title: '请上传顶部图片！',
            icon: 'none',
            duration: 2000,
          })
        }
      }
      console.log(this.data.toolBar[this.data.i])
      
  },
  startUpload() {
    const uploadTask = wx.uploadFile({
      url: 'https://www.wordming.cn/common/publish.html',
      filePath: this.data.toolBar[this.data.i].images,
      name: 'file',
      formData: {
        'title': this.data.toolBar[this.data.i].images,
        'text': '图片上传……',
        'userId': this.data.userId
      },
      fail: res => {
        console.log('上传图片失败！' + this.data.toolBar[this.data.i].images)
      },
      complete: res => {
        // 上传图片成功，获取ID
        if (res.statusCode === 200) {
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
          wx.showLoading({
            title: '图片上传中……',
            mask: true
          })
          wx.request({
            url: 'https://www.wordming.cn/search/get.html',
            data: {
              search: this.data.toolBar[this.data.i].images
            },
            fail: this.getDataError.bind(this),
            complete: res => {
              // 获取 id 成功，获取图片 url
              if (res.statusCode === 200) {

                var id = res.data.data.list[0].id
                wx.request({
                  url: 'https://www.wordming.cn/visit/get.html',
                  data: {
                    id: id
                  },
                  fail: this.getDataError.bind(this),
                  complete: res => {
                    // 获取 图片 URL 成功
                    if (res.statusCode === 200) {
                      this.data.uploadImgs++
                      this.data.imgUrls.push('https://www.wordming.cn' + res.data.data.visit.imgUrl )
                      
                      if (this.data.i < this.data.toolBar.length -1) {
                        this.data.i++
                        this.submitVisit();
                      } else {
                        console.log(this.data.i + '----' + this.data.toolBar.length)
                        if (this.data.uploadImgs === this.data.imgs) {
                          console.log(this.data.imgUrls)
                          this.publishVisit()
                        }
                      }
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: "无服务发生未知的错误",
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '上传图中（' + res.totalBytesSent + '/' + res.totalBytesExpectedToSend + '）',
      })
      if (res.progress === 100) {
        
      }
    })
  },
  publishVisit(){
    var index = 0
    for(var i = 0;i<this.data.toolBar.length;i++){
      if(this.data.toolBar[i].types === 'image'){
        this.data.str+='<p><img src="'+this.data.imgUrls[index]+'"></p>'
        index++
      } else {
        this.data.str += '<p style="text-indent:2rem">' + this.data.toolBar[i].text + '</p><br />'
      }
    }
    console.log(this.data.str)
    wx.uploadFile({
      url: 'https://www.wordming.cn/common/publish.html',
      filePath: this.data.headImg,
      name: 'file',
      formData: {
        'title': this.data.title,
        'text': this.data.str,
        'userId': this.data.userId
      },
      fail: res => {
        wx.showToast({
          title: "顶部图片未添加……",
          icon: 'none',
          duration: 2000
        })
      },
      complete: res=>{
        wx.hideLoading()
        wx.showToast({
          title: '发表成功',
          icon: 'success',
          duration: 2000,
          complete:res=>{
            //setTimeOut
            // wx.navigateTo({
            //   // url: '/pages'
            // })
          }
        })
      }
    })
  },
  
  
  
  
  getFocus(e){
    var index = e.currentTarget.dataset.index;
    for(var i=0;i<this.data.toolBar.length;i++){
      if(i === index ){
        this.data.toolBar[i].autoFocus = true
      } else {
        this.data.toolBar[i].autoFocus = false
      }
    }
    this.setData({
      toolBar: this.data.toolBar
    })
  }
})