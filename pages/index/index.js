//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    defaultImg: '/img/defaultimg.png',
    dataInfo:{},
  },
  onLoad: function () {
    this.getData();
  },
  onShow() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  getData() {
    wx.request({
      url: 'https://www.wordming.cn/common/index.html',
      success: this.getDataSucc.bind(this),
      fail: this.getDataError.bind(this),
      complete: this.ajaxComplete.bind(this)
    })
    wx.showLoading({
      title: '正在加载……',
      mask: true
    })
  },
  getDataSucc(res) {
    if(res.data.data) {
      this.setData({
        dataInfo: res.data.data
      })
    } else {
      console.log("数据为空")
    }
    
  },
  getDataError() {
    alert("服务器发生错误！")
  },
  ajaxComplete() {
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh() {
    this.getData();
  },
  goDetail(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/visitDetail/visitDetail?type=visit&id='+id,
    })
  }
})
