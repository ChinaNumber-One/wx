// pages/hotelList/hotelList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:'/img/loadingImg.png',
    pageUp:null,
    pageDown:null,
    city:'',
    page:1,
    dataInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city:options.city
    })
    this.getHotelList()
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
    // this.getHotelList()
    
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
    this.getHotelList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page+1
    })
    this.getHotelList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getHotelList(){
    wx.showLoading({
      title: '正在加载……',
      mask: true,
    })
    wx.request({
      url: 'https://route.showapi.com/1450-1',
      data:{
        showapi_appid:65611,
        showapi_sign:'160177dac6604f0d947485ebbe89e94d',
        cityName:this.data.city,
        page:this.data.page
      },
      success:res=>{
        if (res.data.showapi_res_body.contentlist&&res.data.showapi_res_body.contentlist.length>0){
          // this.data.pageUp = res.data.showapi_res_body.contentlist.splice(0,10)
          // this.data.pageDown = res.data.showapi_res_body.contentlist.splice(10, 10)
          var newArr = this.data.dataInfo.concat(res.data.showapi_res_body.contentlist)
          this.setData({
            dataInfo: newArr
          })
          console.log(this.data.dataInfo)
          this.loopDataInfo()
        }
      },
      complete: res=>{
        if(res.data.showapi_res_code === 0){
          wx.hideLoading()
          wx.stopPullDownRefresh()
        } else if (res.data.showapi_res_code === -1) {
          wx.hideLoading()
          return false;
        }
      }
    })
  },
  loopDataInfo(){
    var arr = []
    for(let i = 0;i<this.data.dataInfo.length;i++){

      //获取图片
      wx.request({
        url: 'https://route.showapi.com/1450-3',
        data: {
          showapi_appid: 65611,
          showapi_sign: '160177dac6604f0d947485ebbe89e94d',
          hotalId: this.data.dataInfo[i].hotalId,
        },
        success:res=>{
          if (res.data.showapi_res_body.imgList&&res.data.showapi_res_body.imgList.length>0){
            arr.push(res.data.showapi_res_body)
            app.swiperHotel = arr
            for (let j = 0; j < res.data.showapi_res_body.imgList.length;j++){
              if (res.data.showapi_res_body.imgList[j]&&res.data.showapi_res_body.imgList[j].imgType === 4 && res.data.showapi_res_body.imgList[j].isRoomDefault ===1){
                this.data.dataInfo[i].mainImg = res.data.showapi_res_body.imgList[j].imgUrl
                
                break;
              }
            }
            this.setData({
              dataInfo:this.data.dataInfo
            })
          }
        }
      })
      //获取价格
      wx.request({
        url: 'https://route.showapi.com/1450-5',
        data: {
          showapi_appid: 65611,
          showapi_sign: '160177dac6604f0d947485ebbe89e94d',
          hotalId: this.data.dataInfo[i].hotalId,
          startTime: app.startTime,
          endTime:app.endTime
        },
        success:res=>{
          var minPrice = 99999999;
          if (res.data.showapi_res_body.result&&res.data.showapi_res_body.result.length>0){
            for (var m = 0; m < res.data.showapi_res_body.result.length;m++){
              if (res.data.showapi_res_body.result[m].proSaleInfoDetails.length === 0){
                // break;
                // this.data.dataInfo[i].prices = '面议'
              }else {
                
                for (let rooms = 0; rooms < res.data.showapi_res_body.result[m].proSaleInfoDetails.length; rooms++) {
                  //最低价格
                  minPrice = minPrice > res.data.showapi_res_body.result[m].proSaleInfoDetails[rooms].distributorPrice ?
                    res.data.showapi_res_body.result[m].proSaleInfoDetails[rooms].distributorPrice : minPrice;
                }
                
              }
              
            }
            this.data.dataInfo[i].prices = minPrice
            
            this.setData({
              dataInfo: this.data.dataInfo
            })
          }
          
        }
      })
      // break;
    }
    this.setData({
      dataInfo: this.data.dataInfo
    })
  },
  goHotelDetail(e) {
    wx.navigateTo({
      url: '/pages/hotel/hotelDetail/hotelDetail?hotelId=' + e.currentTarget.dataset.hotelid
    })
  },
})