
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'搜索景点名称',
    showSearchIcon: true,
    provinceView: false,
    noResult:false,
    pagesArr:[],
    deviceHeight:null,
    page:1,
    keyword:'',
    allNum:null,
    allPages:null,
    contentList:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function (res) {
        this.setData({
          deviceHeight: res.windowHeight
        })
      }.bind(this)
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
  getData(){
    wx.request({
      url: 'https://route.showapi.com/268-1',
      data: {
        showapi_appid: 59145,
        showapi_sign: '2bb96e1b9b5648ecb3210073ea6eaf71',
        keyword:this.data.keyword,
        page:this.data.page
      },
      success: this.getViewSucc.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
    wx.showLoading({
      title: '正在搜索……',
      mask: true
    })
  },
  getViewSucc(res){
    if(res.data.showapi_res_body.pagebean.allNum<=0){
      this.setData({
        noResult: true
      })
    }
    var pagesArr = []
    for (var i = 0; i < res.data.showapi_res_body.pagebean.allPages; i++) {
      pagesArr.push(i + 1)
    }
    this.setData({
      pagesArr:pagesArr,
      contentList: res.data.showapi_res_body.pagebean.contentlist,
      allPages: res.data.showapi_res_body.pagebean.allPages,
      page: res.data.showapi_res_body.pagebean.currentPage,
    })
  },
  goDetail(e) {
    for (var i = 0; i < this.data.contentList.length; i++) {
      if (this.data.contentList[i].id === e.currentTarget.dataset.id) {
        app.currentView = this.data.contentList[i]
        break;
      }
    }
    wx.navigateTo({
      url: '/pages/destination/viewDetail/viewDetail',
    })
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
  },
  onFocus() {
    this.setData({
      showSearchIcon: false,
      placeholder: ' '
    })
  },
  onBlur(e){
    var value = e.detail.value.replace(/\s/gi, '')
    if(value !== ''){
      this.setData({
        keyword:value
      })
      this.getData();
    }else {
      this.setData({
        showSearchIcon: true,
        placeholder: '搜索景点名称'
      })
    }
  },
  onConfirm(e) {
    var value = e.detail.value.replace(/\s/gi, '')
    if (value !== '') {
      this.setData({
        keyword: value
      })
      this.getData();
    } else {
      this.setData({
        showSearchIcon: true,
        placeholder: '搜索景点名称'
      })
    }
  },
  onInput(e) {
    if (e.detail.value === '') {
      if(this.data.noResult){
        this.setData({
          noResult: false
        })
      }
      this.setData({
        contentList:[]
      })
    }
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  //选择页码
  bindPickerChange: function (e) {
    this.setData({
      scrollTop: 0,
      page: Number(e.detail.value) + 1
    })
    this.getData()
  },
  //上一页
  toLastPage() {
    if (this.data.page <= 1) {
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
      this.getData()
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
      this.getData()
    }
  },
})