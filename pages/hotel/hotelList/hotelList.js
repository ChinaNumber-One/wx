// pages/hotelList/hotelList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'',
    page:1,
    dataInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city:options.city
    })
    this.getCityList()
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
  getCityList(){
    wx.request({
      url: 'https://route.showapi.com/1450-1',
      data:{
        showapi_appid:59145,
        showapi_sign:'2bb96e1b9b5648ecb3210073ea6eaf71',
        cityName:this.data.city,
        page:this.data.page
      },
      success:res=>{
        if(res.data.showapi_res_body.contentlist.length>0){
          res.data.showapi_res_body.contentlist = res.data.showapi_res_body.contentlist.splice(0, 5)
          this.setData({
            dataInfo: res.data.showapi_res_body
          })
          this.loopDataInfo()
        }
      }
    })
  },
  loopDataInfo(){
    for(let i = 0;i<this.data.dataInfo.contentlist.length;i++){

      //获取图片
      wx.request({
        url: 'https://route.showapi.com/1450-3',
        data: {
          showapi_appid: 59145,
          showapi_sign: '2bb96e1b9b5648ecb3210073ea6eaf71',
          hotalId: this.data.dataInfo.contentlist[i].hotalId,
        },
        success:res=>{
          if(res.data.showapi_res_body.imgList.length>0){
            app.swiperHotel.push(res.data.showapi_res_body)
            for (let j = 0; j < res.data.showapi_res_body.imgList.length;j++){
              if (res.data.showapi_res_body.imgList[j]&&res.data.showapi_res_body.imgList[j].imgType === 4 && res.data.showapi_res_body.imgList[j].isRoomDefault ===1){
                this.data.dataInfo.contentlist[i].mainImg = res.data.showapi_res_body.imgList[j].imgUrl
                console.log(this.data.dataInfo.contentlist[i].mainImg + '----------------'+i)
                break;
              }
            }
            
          }
        }
      })
      //获取价格
      wx.request({
        url: 'https://route.showapi.com/1450-5',
        data: {
          showapi_appid: 59145,
          showapi_sign: '2bb96e1b9b5648ecb3210073ea6eaf71',
          hotalId: this.data.dataInfo.contentlist[i].hotalId,
          startTime: app.startTime,
          endTime:app.endTime
        },
        success:res=>{
          if (res.data.showapi_res_body.result.length>0){
            for (var m = 0; m < res.data.showapi_res_body.result.length;m++){
              if (res.data.showapi_res_body.result[m].proSaleInfoDetails.length === 0){
                break;
              }else {
                var minPrice = res.data.showapi_res_body.result[m].proSaleInfoDetails[0].distributorPrice;
                for (var rooms = 0; rooms < res.data.showapi_res_body.result[m].proSaleInfoDetails.length; rooms++) {
                  //最低价格
        
                  minPrice = minPrice > res.data.showapi_res_body.result[m].proSaleInfoDetails[rooms].distributorPrice ?
                    res.data.showapi_res_body.result[m].proSaleInfoDetails[rooms].distributorPrice : minPrice;
                }
              }
             
            }
  
            this.data.dataInfo.contentlist[i].prices = minPrice
            this.setData({
              dataInfo: this.data.dataInfo
            })
          }
          
        }
      })

    }
    this.setData({
      dataInfo: this.data.dataInfo
    })
  }
})