const app = getApp()
Page({
  data: {
    showLetter: "",
    winHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "定位中…",
    hotcityList: [],
    commonCityList: [],
    inputName: '',
    completeList: [],
    backPath: '/pages/destination/index',
    dataInfo: null
  },
  onLoad: function (options) {
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    if (options.page === 'destination') {
      this.setData({
        page: options.page,
        backPath: "/pages/destination/index",
        city: app.city
      })
    } else if (options.page === 'hotel'){
      this.setData({
        page: options.page,
        backPath: "/pages/hotel/index",
        city: app.city
      })
    } else if (options.page === 'viewList') {
      this.setData({
        page: options.page,
        backPath: "/pages/destination/searchView/searchView",
        city: app.city
      })
    }
    this.setData({
      winHeight: winHeight
    });
    this.getData();
  },
  onShow() {
    this.getStorageData()
    this.setData({
      hotcityList:app.hotCity
    })
  },
  getData() {
    wx.request({
      url: 'https://www.wordming.cn/common/city_list.html',
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
    if (res.data.data) {
      this.setData({
        dataInfo: res.data.data.list
      })
      var arr = []
      for (var item in this.data.dataInfo) {
        arr = arr.concat(this.data.dataInfo[item])
      }
      this.setData({
        cityList: arr
      })
    } else {
      console.log("数据为空")
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
    wx.stopPullDownRefresh()
  },
  onPullDownRefresh() {
    this.getData();
  },
  // 点击字母
  clickLetter: function (e) {
    const showLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    const that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 500)
  },

  //选择城市
  bindCity: function (e) {
    this.setData({
      city: e.currentTarget.dataset.city,
      scrollTop: 0,
      completeList: [],
    })
    app.city = e.currentTarget.dataset.city   
    //判断所选城市是否在 历史访问中存在，改变在历史访问数组中的位置
    wx.getStorage({
      key: 'COMMON_CITY_LIST',
      success: function(res){
        let _index = res.data.indexOf(e.currentTarget.dataset.city)
        if (_index !== -1) {
          res.data.splice(_index, 1)
        }
        res.data.unshift(e.currentTarget.dataset.city)
        //历史访问超过6个 删除最后一个
        if (res.data.length > 6) {
          res.data.splice(-1, 1)
        }
        wx.setStorage({
          key: "COMMON_CITY_LIST",
          data: res.data
        })
        this.setData({
          commonCityList:res.data
        })

      }.bind(this)
    })
    if (this.data.page === 'viewList') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.switchTab({
        url: this.data.backPath
      })
    }
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  //输入框 输入
  bindKeyInput: function(e) {
    if(e.detail.value) {
      this.setData({
        inputName: e.detail.value
      })
      this.auto()
    }else {
      this.setData({
        completeList: [],
      })
    }
  },
  // 查询
  auto: function() {
    let inputSd = this.data.inputName
    let sd = inputSd.toLowerCase();
    let num = sd.length
    const cityList = this.data.cityList;
    let finalCityList = []
    let temp = cityList.filter(
                  item => {
                    let text = item.spell.toLowerCase().slice(0,num)
                    return (text && text == sd)
                  }
                  
                );
    let chinese = cityList.filter(
      itemChinese => {
        let textChinese = itemChinese.name.slice(0, num)
        return (textChinese && textChinese == inputSd)
      }
    )
   if(temp[0]) {
     temp.map(
       item => {
         let testObj = {};
         testObj.city = item.name
         finalCityList.push(testObj)
       }
     )
     this.setData({
       completeList: finalCityList,
     })
   } else if (chinese[0]){
     chinese.map(
       item => {
         let testObj = {};
         testObj.city = item.name
         finalCityList.push(testObj)
       }
     )
     this.setData({
       completeList: finalCityList,
     })
   } else {
     return
   }

 },
 getStorageData() {
   wx.getStorage({
     key: 'COMMON_CITY_LIST',
     complete:function (res) {
       if(res.errMsg !== 'getStorage:ok'){
         try {
           wx.setStorageSync('COMMON_CITY_LIST', ['北京'])
           this.getStorageData()
         } catch (e) {
           console.log(e)
         }
       } else {
        this.setData({
          commonCityList: res.data
        })
       }
     }.bind(this)
   })
 }
})
