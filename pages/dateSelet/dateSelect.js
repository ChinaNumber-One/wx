// pages/dateSelect/dateSelect.js

var Moment = require("utils/Moment.js");

var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth()+1
var DATE_DAY = new Date().getDate()
const app = getApp();
Page({
  data:{
    maxMonth:16, //最多渲染月数
    dateList:[],
    renderArr: [],
    systemInfo:{},
    startName: '入住',
    endName: '离店',
    weekStr:['日','一','二','三','四','五','六'],
    checkInDate:Moment(new Date()).format('YYYY-MM-DD'),
    checkOutDate:Moment(new Date()).add(1,'day').format('YYYY-MM-DD'),
    showIndate: '请选择',
    showOutdate: '请选择',
    days:1,
    markcheckInDate:false, //标记开始时间是否已经选择
    markcheckOutDate:false   //标记结束时间是否已经选择
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.createDateListData();
    var _this = this;

    var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
    var checkOutDate = Moment(new Date()).add(1,'day').format('YYYY-MM-DD');

    wx.getSystemInfo({
      success: function(res) {
        _this.setData({systemInfo:res,checkInDate:checkInDate,checkOutDate:checkOutDate});
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  createDateListData:function(){
    var dateList = [];
    var now = new Date();
    /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
    now = new Date(now.getFullYear(),now.getMonth(),1);
    for(var i=0;i<this.data.maxMonth;i++){
      var momentDate = Moment(now).add(this.data.maxMonth-(this.data.maxMonth-i),'month').date;
      var year = momentDate.getFullYear();
      var month = momentDate.getMonth()+1;

      var days = [];
      var totalDay = this.getTotalDayByMonth(year,month);
      var week = this.getWeek(year,month,1);
      //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
      //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
      for(var j = -week+1;j<=totalDay;j++){
          var tempWeek = -1;
          if(j>0)
             tempWeek = this.getWeek(year,month,j);
          var clazz = '';
          if(tempWeek == 0 || tempWeek == 6)
              clazz = 'week'
          if(j<DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
              //当天之前的日期不可用
              clazz = 'unavailable '+clazz;
          else
              clazz = 'nostate '+clazz
          days.push({day:j,class:clazz})
      }
      var dateItem = {
        id:year+'-'+month,
        year:year,
        month:month,
        days:days
      }

      dateList.push(dateItem);
    }
    this.setData({
      dateList:dateList
    });
    DATE_LIST = dateList;
  },
  /*
	 * 获取月的总天数
	 */
	getTotalDayByMonth:function(year,month){
		month=parseInt(month,10);
		var d=new Date(year,month,0);
		return d.getDate();
	},
	/*
	 * 获取月的第一天是星期几
	 */
	getWeek:function(year,month,day){
		var d=new Date(year,month-1,day);
		return d.getDay();
	},
  // 获取 文本星期几？
  getWeekText(num) {
    switch(num) {
      case 0: return '星期天';break;
      case 1: return '星期一'; break;
      case 2: return '星期二'; break;
      case 3: return '星期三'; break;
      case 4: return '星期四'; break;
      case 5: return '星期五'; break;
      case 6: return '星期六'; break;
    }
  },
  /**
   * 点击日期事件
   */
  onPressDate:function(e){
    var {year,month,day} = e.target.dataset;

    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if((day<DATE_DAY && month == DATE_MONTH) || day<=0) return;
    //拼接 0 
    var tempMonth = month;
    var tempDay = day;
    if(month<10) tempMonth='0'+month
    if(day <10) tempDay= '0'+day

    var date = year+'-'+tempMonth+'-'+tempDay;
    var renderArr = this.data.renderArr;
    //如果点击选择的日期小于等于入住时间，则重新渲染入住时间
    if((this.data.markcheckInDate && Moment(date).before(this.data.checkInDate)||this.data.checkInDate === date)){  
      renderArr = []
      // this.renderPressStyle(year, month, day);
        this.setData({
          renderArr: renderArr,
          markcheckInDate:false,
          markcheckOutDate:false,
          dateList:DATE_LIST.concat()
        });
     //第一次点击
    } else if(!this.data.markcheckInDate){
      renderArr.push({
        year:year,
        month:month,
        day:day
      })
      this.renderPressStyle(year, month, day);
      this.setData({
        showIndate: month + '月' + day + '日  ' + this.getWeekText(this.getWeek(year,month,day)),
        renderArr: renderArr,
        checkInDate:date,
        markcheckInDate:true,
      });
      //第二次点击
    }else if(!this.data.markcheckOutDate){
      renderArr.push({
        year:year,
        month: month,
        day: day
      })
      this.renderPressStyle(year, month, day);
      this.setData({
        renderArr: renderArr,
        showOutdate: month + '月' + day + '日  ' + this.getWeekText(this.getWeek(year, month, day)),
        checkOutDate:date,
        markcheckOutDate:true,
      });
      this.getDaysNum(this.data.checkInDate, this.data.checkOutDate);
      
    }
    else if (this.data.markcheckInDate && this.data.markcheckOutDate){
      renderArr = []
      this.setData({
        renderArr: renderArr,
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
        markcheckInDate: false,
        markcheckOutDate: false,
        dateList: DATE_LIST.concat()
      });
    }
  },
  renderPressStyle:function(year,month,day){
      var dateList = this.data.dateList;
      var flagArr = this.data.renderArr;
      //渲染点击样式
      for(var i=0;i<dateList.length;i++){
        if (dateList[i].id === year + '-' + month ){     
          // 获取所选两个月的 下标
          if(flagArr.length === 1){
            flagArr[0].i = i
          }else if(flagArr.length ===2){
            flagArr[1].i = i
          }
          // 1、同年同月   index1    
          if (flagArr.length === 2 && flagArr[0].i === flagArr[1].i ) {
            for (var index1 = 0; index1 < dateList[i].days.length;index1++){
              if (dateList[i].days[index1].day > flagArr[0].day && dateList[i].days[index1].day < flagArr[1].day){
                dateList[i].days[index1].class = dateList[i].days[index1].class + ' between';
              }
            }
          }
          //2、相邻两个月   
          if (flagArr.length === 2 && flagArr[0].i !== flagArr[1].i) {
            // 渲染最小小月份  index2
            for (var index2 = 0; index2 < dateList[flagArr[0].i].days.length; index2++) {
              if (dateList[flagArr[0].i].days[index2].day > flagArr[0].day ) {
                dateList[flagArr[0].i].days[index2].class = dateList[flagArr[0].i].days[index2].class + ' between';
              }
            }
            // //渲染中间月份  index4   中间月是  flagArr[0].i + 1   到 i-i
            for (var index4 = flagArr[0].i + 1; index4 < i;index4++){
              for (var index5 = 0; index5 < dateList[index4].days.length;index5++){
                if (dateList[index4].days[index5].day>0){
                  dateList[index4].days[index5].class = dateList[index4].days[index5].class + ' between';
                }
              }
            }
            // 渲染最大月份 index3
            for (var index3 = 0; index3 < dateList[i].days.length; index3++) {
              if (dateList[i].days[index3].day < flagArr[1].day && dateList[i].days[index3].day>0) {
                dateList[i].days[index3].class = dateList[i].days[index3].class + ' between';
              }
            }
          }
          for(var j=0;j<dateList[i].days.length;j++){
            var tempDay = dateList[i].days[j].day;
            if(tempDay == day){
              dateList[i].days[j].class = dateList[i].days[j].class+' active';
              if(flagArr.length ===1){
                dateList[i].days[j].sign =  this.data.startName
              }else if(flagArr.length === 2){
                dateList[i].days[j].sign = this.data.endName
              }
              break;
            }
          }
          break;
        } 
      }
      this.setData({
        dateList:dateList
      });
  },
  getDaysNum(startTime, endTime) {
    //startTime和endTime是2002-12-18格式
    var aDate, oDate1, oDate2, iDays
    aDate = startTime.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
    aDate = endTime.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    this.setData({
      days:iDays
    })
    
  },
  submitTime(){
    //  点击完成  存储全局变量 获取缓存起来的日期
    app.startTime = this.data.checkInDate
    app.endTime = this.data.checkOutDate
    app.days = this.data.days
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    });
  }
})