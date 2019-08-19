//app.js
import api from './utils/api.js';
const {
  getuser,
  autoLogin

} = api
const {
  $Toast
} = require('/components/base/index');
App({
  onLaunch: function () {
    //检查是否存在新版本
    // wx.getUpdateManager().onCheckForUpdate(function (res) {
    //   // 请求完新版本信息的回调
    //   console.log("是否有新版本：" + res.hasUpdate);
    //   if (res.hasUpdate) { //如果有新版本
    //     // 小程序有新版本，会主动触发下载操作（无需开发者触发）
    //     wx.getUpdateManager().onUpdateReady(function () { //当新版本下载完成，会进行回调
    //       wx.showModal({
    //         title: '更新提示',
    //         content: '新版本已经准备好，单击确定重启应用',
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    //             wx.getUpdateManager().applyUpdate();
    //           }
    //         }
    //       })
    //     })
    //     // 小程序有新版本，会主动触发下载操作（无需开发者触发）
    //     wx.getUpdateManager().onUpdateFailed(function () { //当新版本下载失败，会进行回调
    //       wx.showModal({
    //         title: '提示',
    //         content: '检查到有新版本，但下载失败，请检查网络设置',
    //         showCancel: false,
    //       })
    //     })
    //   }
    // });
    // 屏幕高度
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        // console.log(calc,'calc')
        this.globalData.phoneScreenHeight = calc;
        this.globalData.appHeight = calc;
        this.globalData.system = res.system.replace(/[^a-zA-Z]/g, '');
      }
    });
  },
  onShow(options) {
    wx.onMemoryWarning(function () {
      console.log('onMemoryWarningReceive')
    })

    // if (options.path == 'pages/self/shareSignIn/shareSignIn' || options.path == 'pages/index/index' || options.path == 'pages/usable/usable' || options.path == 'pages/login/login') {
    //   return false
    // } else {
      this.getUserINfoFun()
    // }

  },
  globalData: {
    userInfo: null,
    statusBarHeight: 0,
    titleBarHeight: 0,
    imgHead: 'https://img.xiaomei360.com/wechat_xiaochengxu/',
    userInfo: {
      version: ''
    },
  },
  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait)
        if (callNow) func.apply(context, args)
      } else {
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait);
      }
    }
  },
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1000
    }
    let _lastTime = null
    // 返回新的函数
    return function () {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments) //将this和传递给原函数
        _lastTime = _nowTime
      }
    }
  },
  getUserINfoFun() {
    getuser().then(res => {
      this.globalData.userInfo = res.data;
      let userInfo = res.data
      wx.setStorageSync('Authorization', res.data.access_token)
      wx.setStorageSync('is_checked', res.data.is_checked)
      wx.setStorageSync('provinceId', res.data.provinceId)
      if (wx.getStorageSync('NotNetWork')) {
        return false
      }
      if (userInfo.provinceId > 0) {
        if (userInfo.is_checked == 0) {
          wx.redirectTo({
            url: '/pages/usableno/usableno',
          })
        } else if (userInfo.is_checked == 1) {
          wx.redirectTo({
            url: '/pages/usableno/usableno',
          })
        } else if (userInfo.is_checked == 3) {
          wx.redirectTo({
            url: '../login/login?bad=1'
          })
        } else if (userInfo.is_checked == 4) {
          wx.redirectTo({
            url: '/pages/usable/usable',
          })
        }
      } else if (userInfo.provinceId == 0) {
        wx.redirectTo({
          url: '/pages/provinceSelect/provinceSelect'
        })
      }
    }).catch(res => {
      // wx.login({
      //   success: (val) => {
      //     autoLogin({
      //       code: val.code
      //     }).then(res => {
      //       console.log(res.code, '报错时触发')
      //       if (res.code == 1) {
      //         wx.redirectTo({
      //           url: '/pages/login/login'
      //         })
      //       }
      //     })
      //   }
      // })

    })
  },
  //用户审核 状态
  userType() {
    if (!wx.getStorageSync('Authorization')) {
      wx.login({
        success: (val) => {
          autoLogin({
            code: val.code
          }).then(res => {
            if (res.code == 0) {
              wx.setStorageSync('Authorization', res.data.access_token)
              wx.setStorageSync('is_checked', res.data.is_checked)
              wx.setStorageSync('provinceId', res.data.provinceId)
              this.getUserINfoFun()
            } else if (res.code == 1) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })
        }
      })
      return false
    } else {
      console.log('没有token')
      this.getUserINfoFun()
    }
  },
  counDown(that, newDatadate) {
    var starttime = newDatadate;
    starttime = starttime.replace(new RegExp("-", "gm"), "/");
    var qxTime = (new Date(starttime)).getTime(); //得到毫秒
    //当前时间
    var currenTime = new Date().getTime();
    //两个时间差值
    var time = qxTime - currenTime;
    if(time > 0) {
  //console.log(time);
  time = parseInt(time / 1000)
  //毫秒转化天数
  var d = Math.floor(time / (60 * 60 * 24));
  var h = Math.floor(time / (60 * 60)) - (d * 24);
  var hTotal = Math.floor(time / (60 * 60))
  //分钟
  var s = Math.floor(time / 60) - (d * 24 * 60) - (h * 60);
  var ss = Math.floor(time) - (d * 24 * 60 * 60) - (h * 60 * 60) - (s * 60);
  if (d < 10) {
    d = '0' + d;
  }
  if (h < 10) {
    h = '0' + h;
  }
  if (hTotal < 10) {
    hTotal = '0' + hTotal
  }
  if (s < 10) {
    s = '0' + s
  }
  if (ss < 10) {
    ss = '0' + ss;
  };

  if (d !== '00') {
    that.setData({
      actPageData: d,
      actPageTxt: "天"
    })
  } else if (h !== '00') {
    that.setData({
      actPageData: h,
      actPageTxt: '时'
    })
  } else if (s !== '00') {
    that.setData({
      actPageData: s,
      actPageTxt: '分'
    })
  }
  that.setData({
    day: d,
    timsD: h,
    timeH: s,
    times: ss,
    hTotal: hTotal,
    // daojiashi: thatdaojiashi,
  })
} else if (time < 0) {
  clearInterval(that.data.daojiashi);
  that.setData({
    day: 0,
    timsD: 0,
    timeH: 0,
    times: 0,
    hTotal: 0,
  })
}
 },
  onToast(data) {
    $Toast({
      content: data
    });
  },
})