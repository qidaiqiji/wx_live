const {
  $Toast
} = require('../../components/base/index');
import api from '../../utils/api.js'

const {
  getreg,
  getshort
} = api
const app = getApp();
const throttle = app.throttle;
Page({
  data: {
    x: 0,
    urll: '',
    usernumber: '',
    usercode: '',
    code: '',
    num: 0,
    ms: '#FFAEC2',
    mss: '#FFAEC2',
    maxNum: 0, //验证成功时的坐标，
    // nohidden: false,
    hide: 1,
    requestLock: false
  },
  onLoad: function (options) {
    wx.hideShareMenu()
    if (options.bad) {
      $Toast({
        content: '您的账号异常请联系'
      });
      this.setData({
        ...options
      })
    }
  },
  jumpToHome: throttle(function (e) {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }),
  // 提示信息
  handlenumber() {
    $Toast({
      content: '请输入正确的手机号码'
    });
  },
  handlecode() {
    $Toast({
      content: '验证码不正确'
    });
  },
  prompt(e) {
    $Toast({
      content: e
    });
  },
  // 获取电话号码
  bindnumder: function (e) {
    this.setData({
      usernumber: e.detail.value
    })
    console.log(this.data.usernumber)
    if (this.data.usercode !== '' && this.data.usernumber !== '') {
      this.setData({
        mss: '#FF3366'
      })
    } else {
      this.setData({
        mss: '#FFAEC2'
      })
    }
  },
  // 获取验证码
  bindcode: function (e) {
    this.setData({
      usercode: e.detail.value
    })
    console.log(this.data.usercode);
    if (this.data.usercode !== '' && this.data.usernumber !== '') {
      this.setData({
        // 红色
        mss: '#FF3366'
      })
    } else {
      this.setData({
        mss: '#FFAEC2'
      })
      
    }
  },
  // 点登陆
  loginup: throttle(function (event) {
    if (this.data.bad) {
      app.onToast('您的账号异常无法使用')
      return false
    }
    // 手机号为空提醒
    var myreg = /^[1][0-9]{10}$/;
    var myRegTwo = /^[0-9]{6}$/;
    if (this.data.usernumber == '') {
      this.handlenumber()
    } else if (!myreg.test(this.data.usernumber)) {
      app.onToast('请输入正确的手机号')
      return false
    } else if (this.data.usercode == '') {
      this.handlecode()
    } else if (!myRegTwo.test(this.data.usercode)) {
      app.onToast('请输入正确的验证码')
      return false
    }
    //网络请求登录
    if (this.data.usernumber !== '' && this.data.usercode !== '') {
      getreg({
        mobile: this.data.usernumber,
        checkNo: this.data.usercode,
        code: this.data.code,
      }).then(res => {
        if (res.code == 1 || res.code == 0) {
          // 登陆成功
          app.globalData.userInfo = res.data;
          wx.setStorageSync('Authorization', res.data.access_token)
          if (+res.data.provinceId > 0) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            wx.reLaunch({
              url: '/pages/provinceSelect/provinceSelect'
            })
          }
        } else if (res.code == 13) {
          $Toast({
            content: res.msg,
            duration: 0,
          });
          setTimeout(() => {
            $Toast.hide();
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 5000);

        } else {
          // 登陆失败
          $Toast({
            content: res.msg
          });
        }
        this.setData({
          ...res.data,
        })
      }).catch(fail => {
        $Toast({
          content: '注册失败'
        });
      })
    }
  }, 4000),
  // 滑块事件
  chang(event) {
    if (event.detail.x >= 240) {
      this.setData({
        mobileX: 1
      })
      let startT00 = new Date().getTime()
      console.log(startT00, 'startT00')
    } else {
      this.setData({
        mobileX: 2
      });
      let startT0 = new Date().getTime()
      console.log(startT0, 'startT0')
    }

  },
  htouchmoveis(e) {
    var mobileX = this.data.mobileX
    console.log('123465', mobileX);
    var myreg = /^[1][0-9]{10}$/;
    // 判断滑块位置
    if (mobileX == 1) {
      if (this.data.requestLock) {
        return false;
      } else {
        if (myreg.test(this.data.usernumber)) {
          this.setData({
            requestLock: true
          })
          // code
          if (!!this.data.requestLock) {
            console.log('触发次数')
            wx.login({
              success: (res) => {
                // console.log("我是code", res.code);
                this.setData({
                  code: res.code
                })
              }
            })
            // 发送短信
            getshort({
              mobile: this.data.usernumber,
              type: '1'
            }).then(res => {
              this.setData({
                ...res.data,
                requestLock: false
              })
              console.log("短信已发送", this.data)
            }).catch(res => {
              this.setData({
                requestLock: true
              })
            })
          }
          //  滑块移动后显示验证码
          setTimeout(() => {
            if (this.data.hide == 1) {
              this.setData({
                hide: 2,
              });
            }
          }, 300);
          setTimeout(() => {
            if (this.data.hide == 2) {
              this.setData({
                hide: 3,
              });
            }
          }, 2000);
          // 倒计时
          this.logintimes();
        } else {
          this.handlenumber();
          this.setData({
            x: 0
          });
        }
      }
    }
    if (mobileX == 2) {
      let startT = new Date().getTime()
      console.log(startT, 'startT')
      this.setData({
        x: 0
      }, () => {
        let startT1 = new Date().getTime()
        console.log(startT1, 'startT2')
      })
      let startT3 = new Date().getTime()
      console.log(startT3, 'startT3')
      this.handlenumber()

    }
  },
  code_fn() {
    if (this.data.ms == '#FF3366') {
      wx.login({
        success: (res) => {
          this.setData({
            code: res.code
          })
        }
      })
      // 发送短信
      getshort({
        mobile: this.data.usernumber,
        type: '1'
      }).then(res => {
        this.setData({
          ...res.data
        })
      });
      this.logintimes();
    }





  },
  logintimes() {
    clearTimeout(timedown);
    var timedown = setTimeout(() => {
      this.setData({
        num: 60,
        ms: '#FFAEC2'
      });
      var that = this;

      function count(times) {
        var timer = '';
        timer = setInterval(function () {
          var minute = 0;
          var second = 0;
          if (times > 0) {
            second = Math.floor(times) - (minute * 60);
            that.setData({
              ms: '#FFAEC2'
            })
          } else if (times <= 0) {
            clearInterval(timer);
            that.setData({
              ms: '#FF3366'
            })
          }
          times--;
          that.setData({
            num: second
          })
        }, 1000);
      }
      count(59);
    }, 30)
  },
  agreement() {
    return false
    wx.navigateTo({
      url: '/pages/agreement/agreement',
    })
  },
  onUnload(){
  }
})