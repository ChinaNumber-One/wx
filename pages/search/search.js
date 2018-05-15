// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSearchIcon: true,
    placeholder: '搜索攻略/游记',
    history: [],
    dataInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorageData()
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
  onFocus() {
    this.setData({
      showSearchIcon: false,
      placeholder: ' '
    })
  },
  onBlur(e) {
    var value = e.detail.value.replace(/\s/gi, '')
    var reg1 = /^http/
    var reg2 = /^wxfile/
    if (reg1.test(value) || reg2.test(value)) {
      wx.showToast({
        title: '含有敏感词，请重新输入',
        icon: 'none',
        duration: 2000
      })
    } else {
      if(value !== '') {
        let _index = this.data.history.indexOf(value)
        if (_index !== -1) {
          this.data.history.splice(_index, 1)
        }
        if (this.data.history.length > 4) {
          this.data.history.splice(-1, 1)
        }
        this.data.history.unshift(value)
        this.setData({
          history: this.data.history
        })

        wx.setStorage({
          key: "SEARCH_LIST",
          data: this.data.history
        })
        this.getData(value)
      } else {
        this.setData({
          placeholder: '搜索攻略/游记',
          showSearchIcon: true
        }) 
      }
    }
    
  },
  onInput(e) {
    if(e.detail.value === '') {
      this.setData({
        dataInfo:[]
      })
    }
  },
  getStorageData() {
    wx.getStorage({
      key: 'SEARCH_LIST',
      success: this.getStorageDataSucc.bind(this),
      fail: this.resetStorageData.bind(this)
    })
  },
  resetStorageData(res) {
    if (res.errMsg === 'getStorage:fail data not found') {
      wx.setStorage({
        key: "SEARCH_LIST",
        data: ['北京'],
        success: this.resetStorageDataSucc.bind(this)
      })
    }
  },
  getStorageDataSucc(res) {
    this.setData({
      history: res.data
    })
  },
  resetStorageDataSucc(res) {
    this.getStorageData()
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  delStorage() {
    this.setData({
      history: []
    })
    wx.removeStorage({
      key: 'SEARCH_LIST',
      success: function (res) {
        if(res.errMsg === 'removeStorage:ok') {
          wx.showToast({
            title: '清空成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  getData(key) {
    wx.request({
      url: 'https://www.wordming.cn/search/get.html?search=' + key,
      success: this.getDataSucc.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
    wx.showLoading({
      title: '正在搜索……',
      mask: true
    })
  },
  getDataSucc(res) {
    var reg1 = /^http/
    var reg2 = /^wxfile/
    if (res.data.data.list.length !== 0) {
      for (var i = 0; i < res.data.data.list.length;i++){
        if (reg1.test(res.data.data.list[i].title) || reg2.test(res.data.data.list[i].title)) {
          res.data.data.list[i] = ''
        } 
      }

      this.setData({
        dataInfo: res.data.data.list
      })
    } else {
      this.setData({
        dataInfo: [{
          type: 'noData',
          title: '-.-未找到相关信息～'
          }]
      })
    }
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
  },
  goDetail(e) {
    var id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.type === '游记') {
      wx.navigateTo({
        url: '/pages/visitDetail/visitDetail?type=visit&id=' + id,
      })
    } else if (e.currentTarget.dataset.type === '攻略') {
      wx.navigateTo({
        url: '/pages/visitDetail/visitDetail?type=strategy&id=' + id,
      })
    }
  },
  searchHisory(e) {
   this.getData(e.currentTarget.dataset.key)
  }
})