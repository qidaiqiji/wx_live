//index.js
//获取应用实例

import api from '../../utils/api.js'
const {
  aliyunLiveList,
  autoLogin,
  vodList,
  getMakePushUrl,
  pushMakePushUrl
} = api
const app = getApp()

Page({
  data: {
    isLive:false,
    page:1,
    pageSize:5,
    requestLock: false,
    vodList:[],
    liveList:[],
    eveList:[],

  },
  onLoad: function () {



  },
  onShow(){
    wx.login({
      success: (val) => {
        autoLogin({
          code: val.code
        }).then(res => {
          if (res.code == 0) {
            wx.setStorageSync('Authorization', res.data.access_token)
            wx.setStorageSync('is_checked', res.data.is_checked)
            wx.setStorageSync('provinceId', res.data.provinceId)
            wx.setStorageSync('noLogin', false)
            if (res.data.is_checked == 2) {
              this.setData({
                noLook: false,
                noLookTwo: false,
                noLookHide: false
              })
            } else {
              this.setData({
                noLook: true,
              })
            }

            if (!res.data.nickName) {
              res.data.nickName = app.globalData.userInfo.nickName
            }
            app.globalData.userInfo = res.data;
            const imgHead = app.globalData.imgHead
            const version = app.globalData.userInfo.version
            this.setData({
              reacquire: true
            })
            aliyunLiveList().then(res => {
              console.log(res)
              this.setData({
                ...res.data
              })
            })
              let page = +this.data.page
            this.getVodList(page);
          } else {
            wx.setStorageSync('Authorization', '')
            wx.setStorageSync('is_checked', '')
            wx.setStorageSync('provinceId', '')
            wx.setStorageSync('noLogin', true)
            this.setData({
              noLook: true,
              reacquire: false
            }, () => {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            })
          }
        }).catch(res => {
          this.setData({
            reacquire: false
          })
        })
      }
    })


  },
  jumpToPusher(e){
    //外部有层判断是否是老师
    let id = e.currentTarget.dataset.id
    let isAnchor = e.currentTarget.dataset.isanchor
    if (this.data.noLook) {
      app.userType()

    }else{
      if (isAnchor) {
        pushMakePushUrl({ id }).then(res => {
          console.log(res.code)
          if (res.code == 0) {
            let url = res.data.url && res.data.url.replace('?', '+')
            url = url.replace('=', '`')
            url = JSON.stringify(url)
            console.log(url)
            wx.navigateTo({
              url: `/pages/pusher/pusher?id=${id}&url=${url}`,
            })
          } else {
            app.onToast(res.msg)
          }

        }).catch(fail => {
          console.log(fail)
        })
      } else {
        getMakePushUrl({ id}).then(res => {
          if (res.code == 0) {
            let url = res.data.url.replace('?', '+')
            url = url.replace('=', '`')
            url = JSON.stringify(url)
            console.log(url)
            wx.navigateTo({
              url: `/pages/player/player?id=${id}&url=${url}`,
            })
          } else {
            app.onToast(res.msg)
          }
        }).catch(fail => {
          console.log(fail)
        })
      }
    }


  },
  jumpToWatchPlay(){
    wx.navigateTo({
      url: '/pages/player/player',
    })
  },
  jumpToWatchVideo(){
    wx.navigateTo({
      url: '/pages/videos/videos',
    })
  },
  jumpToVedio(e){
    if (this.data.noLook) {
      app.userType()

    } else {
    let videoUrl = e.currentTarget.dataset.videourl
    let id = e.currentTarget.dataset.id
      let url = videoUrl.replace('?', '+')
      url = url.replace('=', '`')
      url = JSON.stringify(url)
      console.log(url)
      wx.navigateTo({
        url: `/pages/videos/videos?id=${id}&url=${url}`,
      })
    }
  },
  onPullDownRefresh(e){
    wx.login({
      success: (val) => {
        autoLogin({
          code: val.code
        }).then(res => {
          if (res.code == 0) {
            wx.setStorageSync('Authorization', res.data.access_token)
            wx.setStorageSync('is_checked', res.data.is_checked)
            wx.setStorageSync('provinceId', res.data.provinceId)
            wx.setStorageSync('noLogin', false)
            if (res.data.is_checked == 2) {
              this.setData({
                noLook: false,
                noLookTwo: false,
                noLookHide: false
              })
            } else {
              this.setData({
                noLook: true,
              })
            }

            if (!res.data.nickName) {
              res.data.nickName = app.globalData.userInfo.nickName
            }
            app.globalData.userInfo = res.data;
            const imgHead = app.globalData.imgHead
            const version = app.globalData.userInfo.version
            this.setData({
              reacquire: true
            })
            aliyunLiveList().then(res => {
              console.log(res)
              this.setData({
                ...res.data
              },()=>{
                wx.stopPullDownRefresh()
              })
            })
          } else {
            wx.setStorageSync('Authorization', '')
            wx.setStorageSync('is_checked', '')
            wx.setStorageSync('provinceId', '')
            wx.setStorageSync('noLogin', true)
            this.setData({
              noLook: true,
              reacquire: false
            }, () => {
              // wx.navigateToMiniProgram({
              //   appId: 'wxde9818782425c9f3',
              //   path: '/pages/login/login',
              //   envVersion: 'trial'
              // })
              wx.stopPullDownRefresh()
            })
          }
        }).catch(res => {
          this.setData({
            reacquire: false
          })
        })
      }
    })
  },
  onReachBottom: function () {

    let page = +this.data.page + 1
    this.getVodList(page)

  },
  getVodList(page) {
    if (!this.data.requestLock) {
      this.data.requestLock = true
      let pageSize = +this.data.pageSize
      let allData = this.data.vodList
      this.setData({
        isLoading: page > 1 ? true : false
      }, () => {

      })
      vodList({
        pageSize,
        page
      }).then(res => {

        allData = allData.concat([], ...res.data.vodList)

        if (res.data.vodList.length < pageSize) {
          this.setData({
            vodList: allData,
            page,
            requestLock: true,
            reachTheBottom: true,
            isLoading: false,
          })
        } else {
          this.setData({
            vodList: allData,
            page,
            requestLock: false,
            isLoading: true,
          })
        }
      }).catch(res => {
        this.setData({
          requestLock: false,
          isLoading: false,
          reacquire: false
        })
      })
    }
  },
})
