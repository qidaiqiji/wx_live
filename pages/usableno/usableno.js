// pages/usableno/usableno.js
import api from '../../utils/api.js';
const app = getApp()
const {
  applyStatus
} = api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    istue: true,
    imgHead:'',
    version:'',
    qrcode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    const imgHead = app.globalData.imgHead;
    const version = app.globalData.userInfo&&app.globalData.userInfo.version;
    this.setData({
      imgHead,
      version
    })
    console.log(app.globalData.userInfo, '查看基本信息')
    this.setData({
      qrcode:imgHead + "img_qrcode.jpg?version=" + version
    })
    // 审核反馈
    applyStatus({
      companyName: this.data.usershop,
      nickname: this.data.username
    }).then(res => {
      console.log('审核反馈', res.data.checkedStatus)
      // 0 未审核 1 拒接 2  通过 3 注销  4待认证
      if (res.data.checkedStatus == 1) {
        this.setData({
          istue: false
        })
      } else if (res.data.checkedStatus == 4) {
        this.setData({
          istue: true
        })
      } else if (res.data.checkedStatus == 2) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
  // 重新提交
  newsubmit() {

    var pages = getCurrentPages() //获取加载的页
    var prevPage = pages[pages.length - 2];
    console.log(pages, '页面路径')
    if (prevPage && prevPage.route == 'pages/usable/usable') {
      wx.navigateBack({
        delta: 1
      })
      return false
    } else {
      console.log('进入跳转')
      wx.navigateTo({
        url: '/pages/usable/usable',
      })
    }


  },
  // 回到首页
  returnmy() {
     wx.reLaunch({
       url: '/pages/index/index?notLook=true',
     })
  },
  previewImage: function (e){
   
console.log(e);
var imgs =[];
imgs.push(e.currentTarget.dataset.imgs);
    var img = e.currentTarget.dataset.img || '';
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
    });
    wx.getImageInfo({// 获取图片信息（此处可不要）
      src: img,
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
    console.log(img);
  },
  isMaxShow(e) {
console.log(e);
var imgs =[];
imgs.push(e.currentTarget.dataset.imgs);
    var img = e.currentTarget.dataset.img || '';
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgs, // 需要预览的图片http链接列表
      success(){
        wx.getImageInfo({// 获取图片信息（此处可不要）
          src: img,
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
          }
        })
      }
    });
    console.log(img);

   
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
    // var pages = getCurrentPages() //获取加载的页
    // var prevPage = pages[pages.length - 2];
    // console.log(pages, '页面路径')
    // if (prevPage.route == 'pages/my/my') {
    //   wx.setStorageSync('isMy', false)
    // }
    // if (prevPage.route == 'pages/classify/classify') {
    //   wx.setStorageSync('isClassify', false)
    // }
    // if (prevPage.route == 'pages/cart/cart') {
    //   wx.setStorageSync('isCart', false)
    // }
    // if (prevPage.route == 'pages/found/found') {
    //   wx.setStorageSync('isFound', false)
    // }
    // let allRoute = pages && pages.map(item => item.route)
    // let importantArr = ['pages/my/my', 'pages/classify/classify', 'pages/cart/cart', 'pages/found/found']
    // if ((allRoute && allRoute.filter(item => new Set(importantArr).has(item)).length > 0)) {
    //   wx.reLaunch({
    //     url: '/pages/index/index',
    //   })
    // }
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

  }
})