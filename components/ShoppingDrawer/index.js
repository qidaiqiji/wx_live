// components/ShoppingDrawer/index.js
import api from '../../utils/api.js'
const {
  addCart
}=api
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList:Object,
    cartCount:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideShoppingCart(){
      this.triggerEvent('hideShoppingCart')
    },
    handleAddCart(e){
      let goodsId = e.currentTarget.dataset.goodsid
      let goodsNum = e.currentTarget.dataset.goodsnum
      addCart({ goodsId, goodsNum}).then(res=>{
        this.setData({
          ...res.data
        })
      })
    },
    jumpToHomeShopping(){
      wx.navigateToMiniProgram({
        appId: 'wxde9818782425c9f3',
        path: '/pages/login/login',
        envVersion: 'trial'
      })
    },
  }
})
