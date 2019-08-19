// pages/videos/videos.js
import api from '../../utils/api.js'
const{
  vodInfo,
  vodGoodsList
}=api
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  handleShowAllgoods(e) {
    vodGoodsList({ id: this.data.id }).then(res => {
      this.setData({
        ...res.data
      })
    })

    this.setData({
      isShowShoppingCart: true
    })

  },
  getInterval(e) {

    this.setData({
      urlInterval: setInterval(() => {
        vodInfo({ id: this.data.id }).then(res => {
          console.log(res, '拿到值了')
          this.setData({
            ...res.data
          }, () => {

          })
        })
      }, 60000)
    })
  },
  hideShoppingCart() {
    this.setData({
      isShowShoppingCart: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = options.url && options.url

    url = JSON.parse(url)
    url = url.replace('+', '?')
    url = url.replace('`', '=')
    this.setData({
      ...options,
      url
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
    this.getInterval()
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

  }
})