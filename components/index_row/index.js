// components/index_row/index.js
import api from '../../utils/api.js'
const {
  reminder,
  cancelReminder,
}=api
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:String,
    isLive:Boolean,
    item:Object,

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
    jumpToRoom(e){
      return false
      let id = e.currentTarget.dataset.id
      let isAnchor = e.currentTarget.dataset.isanchor
      if(isAnchor){
        wx.navigateTo({
          url: '/pages/pusher/pusher?id='+id,
        })
      }else{
        getMakePushUrl({ id: this.data.id }).then(res => {
          console.log(res, '拿到值了')
          if(res.data.url == ''){

          }else{
            wx.navigateTo({
              url: '/pages/player/player?id=' + id,
            })
          }
        })
      }

    },
    cancelReminder(e){
      cancelReminder({ id: e.currentTarget.dataset.id}).then(res=>{
        if (res.code == 0) {
            if (this.data.item.id == e.currentTarget.dataset.id) {
              this.data.item.hasReminder = false
            }
          this.setData({
            item: this.data.item
          })
        }

      })
    },
    reminder(e){
      reminder({ id: e.currentTarget.dataset.id }).then(res=>{
        if(res.code ==0){
          if (this.data.item.id == e.currentTarget.dataset.id ){
            this.data.item.hasReminder = true
            }
          this.setData({
            item: this.data.item
          })
        }

      })
    },
  }
})
