

import base64 from './base64.js'
import config from '../config.js'

import Fly from "./index.js"


const {
  encode
} = base64
const fly = new Fly();
fly.config.baseURL = config.url
// fly.config.timeout = 15000;


// 请求拦截器
fly.interceptors.request.use(function(request) {
  wx.getNetworkType({
    success: function(res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      console.log(networkType)
      if (networkType == 'none') {
        console.log('无网络了')
        wx.setStorageSync('NotNetWork', true)
        return false
      } else {
        if (wx.getStorageSync('NotNetWork')) {
          wx.setStorageSync('NotNetWork', false)
        } else {
          return false
        }
      }
    }
  })

    if (request.params == 'haveModel') {
      wx.showLoading({
        title: "加载中",
        mask: true,
      });
    } else if (request.params == 'haveLoading') {
      wx.showNavigationBarLoading();
    }

    // if (request.url == 'v2/aliyun-live/list' || request.url =='v2/aliyun-live/push-url'){
    //   wx.setStorageSync('Authorization', 'QXqc_ottNoKXzhopgN2pbKJlqDWmAz-4')
    // }else{
    //   wx.setStorageSync('Authorization', 'MF0SJa5AGRdKUHbt6VWVpieNIaHdasv8')
    // }

    if (wx.getStorageSync('Authorization')) { //检查本地缓存是否有token存在没有则重新获取
      request.headers = { //设置请求头
        "content-type": "application/json",
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization') + ':')}`,
      }
      return request;
      
    }
     

  
})
// 响应拦截器
fly.interceptors.response.use(
  response => {
    console.log(response)
    console.log('返回的路径', response.request.url, response.data)
    if (response.status && ("" + response.status).startsWith('2')) {
      console.log('response.data', response.data)
      if (response.request.params == 'haveLoading') {
        wx.hideNavigationBarLoading();
      }
      wx.hideLoading()
      return response.data
    }
  },
  err => { // 响应错误
    console.log("错误", err)

    if (err.status == 0) {
      if (wx.getStorageSync('NotNetWork')) {
        // wx.showLoading({
        //   title: "请连接网络···",
        // });
        wx.showToast({
          icon: 'none',
          title: "无网络，请检查网络设置",
          duration: 5000
        })
      }
    } else {
      wx.hideLoading()
    }
    if (err.status == 1) {
      console.log('请求超时')
    }
  }
)
export default fly