// pages/ticket/index.js
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dayInMonth = date.getDate();
const dayInWeek = date.getDay();
const currentDate = [year, month, dayInMonth];
let selected = [year, month, dayInMonth];

const week = [
  { 'value': '周日', 'class': 'weekend' },
  { 'value': '周一', 'class': '' },
  { 'value': '周二', 'class': '' },
  { 'value': '周三', 'class': '' },
  { 'value': '周四', 'class': '' },
  { 'value': '周五', 'class': '' },
  { 'value': '周六', 'class': 'weekend' },
];

let isLeapYear = function (y) {
  return y % 400 == 0 || (y % 4 == 0 && y % 100 != 0);
}

let isToday = function (y, m, d) {
  return y == year && m == month && d == dayInMonth;
}

let isWeekend = function (emptyGrids, d) {
  return (emptyGrids + d) % 7 == 0 || (emptyGrids + d - 1) % 7 == 0
}

let calEmptyGrid = function (y, m) {
  return new Date(`${y}/${m}/01 00:00:00`).getUTCDay() + 1;
}

let calDaysInMonth = function (y, m) {
  let leapYear = isLeapYear(y);
  if (month == 2 && leapYear) {
    return 29;
  }
  if (month == 2 && !leapYear) {
    return 28;
  }
  if ([4, 6, 9, 11].includes(m)) {
    return 30;
  }
  return 31;
}

let calWeekDay = function (y, m, d) {
  return new Date(`${y}/${m}/${d} 00:00:00`).getUTCDay();
}

let calDays = function (y, m) {
  let emptyGrids = calEmptyGrid(y, m);
  let days = [];
  for (let i = 1; i <= 31; i++) {
    let ifToday = isToday(y, m, i);
    let isSelected = selected[0] == y && selected[1] == m && selected[2] == i;
    let today = ifToday ? 'today' : '';
    let select = isSelected ? 'selected' : '';
    let weekend = isWeekend(emptyGrids, i) ? 'weekend' : '';
    let todaySelected = ifToday && isSelected ? 'today-selected' : '';
    
    let day = {
      'value': i,
      'class': `date-bg ${weekend} ${today} ${select} ${todaySelected}`,
    }
    days.push(day);
  }
  return days.slice(0, calDaysInMonth(y, m));
}

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currYear: year,
    currMonth: month,
    week: week,
    emptyGrids: calEmptyGrid(year, month),
    days: calDays(year, month),
    selected: selected,
    startCity:app.startCity,
    endCity:app.endCity
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
    this.setData({
      startCity: app.startCity,
      endCity: app.endCity
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
  getStartCity(){
    wx.navigateTo({
      url: '/pages/switchcity/switchcity?page=ticket&type=from',
    })
  },
  getEndCity() {
    wx.navigateTo({
      url: '/pages/switchcity/switchcity?page=ticket&type=to',
    })
  },
  changeMonth(e) {
    let id = e.target.id;
    let currYear = this.data.currYear;
    let currMonth = this.data.currMonth;
    if (id == 'prev'){
      if (currYear === year && currMonth - 1<month){
        return false
      } else {
        currMonth = currMonth - 1
      }
    } else {
      currMonth = currMonth + 1
    }
    // currMonth = id == 'prev' ? currMonth - 1 : currMonth + 1;
    if (id == 'prev' && currMonth < 1) {
      currYear -= 1;
      currMonth = 12;
    }
    if (id == 'next' && currMonth > 12) {
      currYear += 1;
      currMonth = 1;
    }
    this.setData({
      currYear: currYear,
      currMonth: currMonth,
      emptyGrids: calEmptyGrid(currYear, currMonth),
      days: calDays(currYear, currMonth)
    })
  },

  selectDate(e) {
    let data = e.target.dataset.selected;
    if(data[0]==year && data[1]==month&&data[2]<currentDate[2]){
      wx.showToast({
        title: '请选择今天及以后日期！',
        icon: 'none',
        duration: 1000
      })
    } else {
      selected = [data[0], data[1], data[2]];
      let days = calDays(data[0], data[1]);
      this.setData({
        currYear: data[0],
        currMonth: data[1],
        days: days
      })
    }
    
  },
  submit(){
    if (this.data.startCity === '请选择') {
      wx.showToast({
        title: '请选择出发地！',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (this.data.endCity === '请选择') {
      wx.showToast({
        title: '请选择到达地！',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    if (Number(selected[1])<10){
      selected[1] = "0" + Number(selected[1])
    }
    if (Number(selected[2]) < 10) {
      selected[2] = "0" + Number(selected[2])
    }
    var date = (selected.join('-'))
    
    wx.navigateTo({
      url: '/pages/ticket/ticketList/ticketList?startCity=' + this.data.startCity + '&endCity=' + this.data.endCity + '&date=' + date,
    })
  }
})