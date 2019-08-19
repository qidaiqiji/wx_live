import api from '../../utils/api.js'
const {
  pushMakePushUrl,
  changeStatus,
  goodsList,
  aliyunLiveInfo,
  
} = api
const app =getApp()
const {
  throttle 
} = app
Page({
  data:{
    whiteness:0,
    beauty:0,
    isMuted:true,
    isPlay:3,
    isShowModal:false,
    isShowCloseOperation:false,
    pauseStopInterval:null,
    hideReadyPlay:false,
    relevance:false,

  },
  onLoad(options){
    console.log(options,'options')
    let url = options.url&&options.url
    
    url = JSON.parse(url)
    url = url.replace('+', '?')
    url = url.replace('`', '=')
    this.setData({
      ...options,
      url
    })
    // if (options.has =='success'){
    //   console.log('jinrudaol zheli')
    //   clearInterval(this.data.pauseStopInterval)
    //   this.setData({
    //     isShowModal: false,
    //     isShowCloseOperation: false,
    //     hideReadyPlay:true,
    //     hadPause: true,
    //     isMuted: true,
    //     isPlay:0,
    //   })
    // }else{
    //   wx.setStorageSync('roomId', options.id)
    // }


  },
  onReady(res) {

  },

  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  handlePlay(){
    if(this.data.url == ''){
      return false
    }
    // wx.setStorageSync(`hideReadyPlay${id}`, true)
    this.setData({
      hideReadyPlay: true,
      isMuted:false,
    },()=>{
      let indexTime = null
      clearInterval(indexTime)
      indexTime = setInterval(() => {
        this.setData({
          isPlay: this.data.isPlay - 1
        }, () => {
          if (this.data.isPlay <= 0) {
              this.ctx.start({
                success: val => {
                  console.log('触发了开始', val)
                  this.setData({
                    relevance: true
                  })
                  changeStatus({ liveStatus: 2, id: this.data.id }).then(res => {
                    console.log(res, 'changeStatus')
                  })
                },
                fail: res => {
                  console.log('start fail')
                }
              })
            

            clearInterval(indexTime)
          }
        })
        console.log(1111)
      }, 1000)
    })
  },
  bindStart() {
    console.log(this.ctx)
    this.ctx.start({
      success: val => {
        console.log('触发了开始', val)
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
        this.setData({
          isMuted:true
        })
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  },
  handleToPlayer() {
    wx.navigateTo({
      url: '/pages/player/player',
    })
  },
  handleToMeiYan(e){
    if (e.currentTarget.dataset.type == 'jian'){
      this.setData({
        beauty: this.data.beauty>0?--this.data.beauty:0
      })
    }else{
      this.setData({
        beauty: this.data.beauty < 9 ? ++this.data.beauty : 9
      })
    }

  },
  handleToMeiBai(e){
    if (e.currentTarget.dataset.type == 'jian') {
      this.setData({
        whiteness: this.data.whiteness > 0 ? --this.data.whiteness : 0
      })
    } else {
      this.setData({
        whiteness: this.data.whiteness < 9 ? ++this.data.whiteness : 9
      })
    }
  },
  handleclickBack(e){
    this.setData({
      isShowModal:true,
      content:'您刚才点击了返回，您是要返回上个页面吗？返回上页将暂停课程。',
      operations: ['我手滑了','返回上页']
    })
  },
  handleclickModal(e){
    console.log(e)
    if(e.detail.type == 'left'){
      this.setData({
        isShowModal: false
      })
    } else if (e.detail.type == 'right'){
      if (e.detail.operation =='返回上页'){
        this.setData({
          isShowModal: false
        }, () => {
          this.ctx.pause({
            success: res => {
              console.log('pause success111')
              this.setData({
                hadPause: true,
                isMuted: true
              },()=>{
                changeStatus({ liveStatus: 4, id: this.data.id }).then(res => {
                  console.log(res, 'changeStatus')
                })
                wx.navigateBack({
                  delta: 1
                })
              })
            },
            fail: res => {
              console.log('pause fail')
            }
          })

        })
      } else if (e.detail.operation == '暂停'){
        clearInterval(this.data.pauseStopInterval)
        this.setData({
          isShowModal: false,
          isShowCloseOperation:false
        }, () => {
          this.ctx.pause({
            success: res => {
              console.log('pause success')
              changeStatus({ liveStatus:4,id:this.data.id}).then(res=>{
                console.log(res,'changeStatus')
              })
              this.setData({
                hadPause: true,
                isMuted: true
              })
            },
            fail: res => {
              console.log('pause fail')
            }
          })
        })
      } else if (e.detail.operation == '关闭'){
        this.setData({
          isShowModal: false
        }, () => {
          this.ctx.stop({
            success: res => {
              console.log('stop success')
              changeStatus({ liveStatus: 3, id: this.data.id }).then(res => {
                console.log(res, 'changeStatus')
              })
              clearInterval(this.data.showTime)
              this.setData({
                hadStop: true,
                isMuted:true
              })
            },
            fail: res => {
              console.log('stop fail')
            }
          })
        })

      }

    }
  },
  handlecontinuePlay(){
    ///
    this.setData({
      hadPause:false,
      hideReadyPlay:true,

    },()=>{
      this.ctx.resume({
        success: res => {
          changeStatus({ liveStatus: 2, id: this.data.id }).then(res => {
            console.log(res, 'changeStatus')
          })
          console.log('resume success')
          this.setData({
            isMuted:false
          })
        },
        fail: res => {
          console.log('resume fail')
        }
      })
    })
  },
  handleShowAllgoods(e) {
    goodsList({ id: this.data.id}).then(res=>{
      this.setData({
        ...res.data
      })
    })

    this.setData({
      isShowShoppingCart: true
    })

  },
  hideShoppingCart() {
    this.setData({
      isShowShoppingCart: false
    })
  },
  move() {
    return false;
  },


  handleClose(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  handleOrientation(){
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  },
  handlePusher: throttle(function (){
    if (this.data.relevance){
      this.setData({
        isShowCloseOperation: !this.data.isShowCloseOperation
      }, () => {
        clearInterval(this.data.pauseStopInterval)
        if (this.data.isShowCloseOperation) {
          this.setData({
            pauseStopInterval: setInterval(() => {
              this.setData({
                isShowCloseOperation: false
              }, () => {
                clearInterval(this.data.pauseStopInterval)
              })
              console.log(1111)
            }, 4000)
          })
        }
      })
    }
  }),
  handlePause(){
    this.setData({
      isShowModal: true,
      content: '是否要暂停课程？若要继续课程，可点击播放按钮继续',
      operations: ['取消', '暂停']
    })
  },
  handleStop(){
    this.setData({
      isShowModal: true,
      content: '确定要关闭课程吗？',
      operations: ['取消', '关闭']
    })
  },
  getInterval(e) {

    this.setData({
      urlInterval: setInterval(() => {
        aliyunLiveInfo({ id: this.data.id }).then(res => {
          console.log(res, '拿到值了')
          this.setData({
            ...res.data
          }, () => {
            if (this.data.lastMin == 10) {
              this.setData({
                isShowModal: true,
                content: '课程时长已达极限10分钟后课程将自动关闭',
                operations: ['取消', '关闭']
              })
            }
          })
        })
      }, 60000)
    })
  },
  onShow(){
    this.ctx = wx.createLivePusherContext('pusher')
    console.log(this.ctx.start)
    this.getInterval()
  },
  onHide(){
    clearInterval(this.data.pauseStopInterval)
    this.setData({
      isShowModal: false,
      isShowCloseOperation: false
    }, () => {
      this.ctx.pause({  
        success: res => {
          console.log('pause success')
          this.setData({
            // hadPause: true,
            isMuted: false
          })
        },
        fail: res => {
          console.log('pause fail')
        }
      })
    })
    console.log('隐藏了当前页面')

  },
  onUnload(){
    console.log('销毁了当前页面')
  },
  onShareAppMessage: function (res) {
 
  },
})