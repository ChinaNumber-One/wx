// pages/hotel/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: null,
    userImg: null,
    isLogin: false,
    userInfo: {},
    height: 0,
    noPhone: true,
    userId: '绑定手机获取',
    phone: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'deviceInfo',
      success: function (res) {
        this.setData({
          height: res.data.windowHeight
        })
      }.bind(this),
    })
    wx.getStorage({
      key: 'USER_INFO',
      success: (res) => {
        if (res.data.isLogin) {
          this.setData({
            isLogin: res.data.isLogin,
            userImg: res.data.userImg,
            nickName: res.data.nickName,
          })
        }
      },
    }),
    wx.getStorage({
      key: 'ISLOGIN',
      success: (res) => {
        this.setData({
          userId: res.data.userId,
          phone: res.data.phone
        })
      },
      complete: (res) => {
        if (res.data && res.data.phone) {
          this.getUserInfo()

          this.setData({
            noPhone: false
          })
          console.log(this.data.noPhone)
        } else {
          wx.navigateTo({
            url: '/pages/mine/safeCenter/safeCenter',
          })
        }
      }
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
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
    wx.getStorage({
      key: 'ISLOGIN',
      success: (res) => {
        this.setData({
          userId: res.data.userId,
          phone: res.data.phone
        })
      },
      complete: (res) => {
        if (res.data && res.data.phone) {
          this.getUserInfo()

          this.setData({
            noPhone: false
          })
          console.log(this.data.noPhone)
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
  callMe() {
    wx.showModal({
      title: '电话联系',
      content: '确定拨打电话？',
      confirmText: '拨打',
      success: this.callPhone.bind(this)
    })
  },
  callPhone(res) {
    if (res.confirm) {
      wx.makePhoneCall({
        phoneNumber: '17660822280'
      })
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  },
  getUserInfo() {
    wx.getStorage({
      key: 'ISLOGIN',
      success: (res) => {
        this.setData({
          userId: res.data.userId,
          phone: res.data.phone
        })
      },
      complete: (res) => {
        if (res.data && res.data.phone) {
          this.setData({
            noPhone: false
          })
          wx.request({
            url: 'https://www.wordming.cn/common/mine.html',
            data: {
              id: this.data.userId
            },
            success: (res) => {
              if (!res.data.data.headImg) {
                return false
              }
              wx.setStorage({
                key: 'USER_INFO',
                data: {
                  isLogin: true,
                  userImg: 'https://www.wordming.cn' + res.data.data.headImg,
                  nickName: res.data.data.nickname,
                  sex: res.data.data.sex,
                  birth: res.data.data.birth,
                  desc: res.data.data.desc,
                  attentionNum: res.data.data.attentionNum,
                  fansNum: res.data.data.fansNum,
                },
                complete: data => {
                  this.setData({
                    isLogin: true,
                    userImg: 'https://www.wordming.cn' + res.data.data.headImg,
                    nickName: res.data.data.nickname,
                    // desc: res.data.data.desc,
                    // attentionNum: res.data.data.attentionNum,
                    // fansNum: res.data.data.fansNum,
                  })
                }
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/mine/safeCenter/safeCenter',
          })
        }
      }
    })
    
  },
  bindGetUserInfo(e) {
    wx.showLoading({
      title: '获取头像昵称……',
    })
    var userImg = (JSON.parse(e.detail.rawData).avatarUrl)
    var nickName = (JSON.parse(e.detail.rawData).nickName)
    var reg = /^[\w\u4e00-\u9fa5]{3,8}$/;
    if (!reg.test(nickName)) {
      nickName = '违规昵称，请修改'
    }
    wx.downloadFile({
      url: userImg, //仅为示例，并非真实的资源
      success: (res) => {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

        wx.uploadFile({
          url: 'https://www.wordming.cn/common/userInfo.html', //仅为示例，非真实的接口地址
          filePath: res.tempFilePath,
          name: 'userImg',
          formData: {
            'id': this.data.userId,
            'nickname': nickName,
            'birth': '2018-08-08',
            'sex': '男',
            'desc': '这个人很懒，什么都没写～'
          },
          success: (res) => {
            wx.hideLoading()
            this.getUserInfo();
          }
        })
      }
    })
  },
  outLogin() {
    if(!this.data.isLogin){
      wx.showToast({
        title: '您还未登陆！',
        icon:'none'
      })
      return
    }
    this.setData({
      isLogin: false
    })
    wx.showModal({
      title: '确定要退出登陆？',
      content: '退出登陆返回首页',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          wx.navigateTo({
            url: '/pages/mine/safeCenter/safeCenter',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})