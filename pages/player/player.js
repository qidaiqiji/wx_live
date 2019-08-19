import api from '../../utils/api.js'
const {
  getMakePushUrl,
  pushMakePushUrl,
  aliyunLiveInfo,
  goodsList,

} = api

Page({
  data:{
    data:[],
    isShowShoppingCart:false,
    status:0,
    isShowModal:false
  },
  onLoad(options){
    let url = options.url && options.url

    url = JSON.parse(url)
    url = url.replace('+', '?')
    url = url.replace('`', '=')
    this.setData({
      ...options,
      url
    })
  },
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindPlay() {
    this.ctx.play({
      success: res => {

      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        this.ctx.mute({
          success: res => {
            console.log('mute success')
          },
          fail: res => {
            console.log('mute fail')
          }
        })
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
  bindMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
  },
  handleToPusher(){
    wx.navigateTo({
      url: '/pages/pusher/pusher',
    })
  },
  handleClose() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  handleclickBack(e) {
    this.setData({
      isShowModal: true,
      content: '您刚才点击了返回，您是要返回上个页面吗？返回上页将暂停课程。',
      operations: ['我手滑了', '返回上页']
    })
  },
  getInterval(e) {
 
    this.setData({
      urlInterval: setInterval(()=>{
        aliyunLiveInfo({ id: this.data.id }).then(res => {
          console.log(res, '拿到值了')
          if(res.code ==4){
              this.setData({
                status:3
              })
          }else{
            this.setData({
              ...res.data
            })
          }

        })
      },60000)
    })
  },
  onShow(){

    this.getInterval()
  },
  onHide(e){
    console.log(e,'关闭当前页')
    return false;
  },
  handleShowAllgoods(e){
    console.log(1111111)
      this.setData({
        isShowShoppingCart:true
      })
  },
  hideShoppingCart(){
    this.setData({
      isShowShoppingCart: false
    })
  },
  move(){
    return false;
  },
  handleInput(){
    this.setData({
      isShowInput:true
    })
  },
  handleShowAllgoods(e) {
    goodsList({ id: this.data.id }).then(res => {
      this.setData({
        ...res.data
      })
    })
    this.setData({
      isShowShoppingCart: true
    })

  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题test',
      path: '/pages/player/player'
    }
  }
})