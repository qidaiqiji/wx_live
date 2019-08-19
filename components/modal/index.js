// components/modal/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:String,
    operations:Array
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
    cancel(){
      this.triggerEvent('clickModal',{type:'left'})
    },
    handleBack(){
      this.triggerEvent('clickModal', { type: 'right', operation: this.data.operations[1]})
    }
  }
})
