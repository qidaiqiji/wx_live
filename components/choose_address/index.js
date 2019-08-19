// components/choose_address/index.js
var tcity = require("../../utils/citys.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    condition: Boolean,
    value: {
      type: Array,
      value: [],
      observer(newData, oldData) {
        console.log(newData, oldData, '地址选择')

        this._getValues(newData)

      }
    },
    onlyProvince: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    // value: [5, 1, 0],
    values: [0, 0, 0],
    condition: false,
    onlyProvince: false,
    defaultValue: []
  },

  attached() {
    this._getDefaultCityData()
    this.setData({
      modalName: true,
    })


  },
  ready: function () {

    this._getDefaultCityData()




  },
  /**
   * 组件的方法列表
   */
  methods: {
    _getValues(newData) {
      this.setData({
        value: newData,
      })
    },
    move() {
      return false
    },
    bindChange: function (e) {
      var val = e.detail.value
      var province = val[0];
      var city = val[1];

      // 这是 初始你选中的值
      var t = this.data.values;
      var cityData = this.data.cityData;
      if (province != t[0]) {
        var citys = [];
        var countys = [];

        for (let i = 0; i < cityData[province].child.length; i++) {
          citys.push(cityData[province].child[i].name)
        }
        if (cityData[province].child[0].child) {
          for (let i = 0; i < cityData[province].child[0].child.length; i++) {
            countys.push(cityData[val[0]].child[0].child[i].name)
          }
        } else {
          countys = []
        }

        this.setData({
          province: this.data.provinces[province],
          citys: citys,
          countys: countys,
          values: val,
          value: [province, 0, 0]
        })
        return;
      }
      if (city != t[1]) {
        var countys = [];
        if (cityData[province].child[city].child) {
          for (let i = 0; i < cityData[province].child[city].child.length; i++) {
            countys.push(cityData[province].child[city].child[i].name)
          }
        } else {
          countys = []
        }

        this.setData({
          city: this.data.citys[city],
          countys: countys,
          values: val,
          value: [province, city, 0]
        })
        return;
      }
      if (val[2] != t[2]) {
        this.setData({
          county: this.data.countys[val[2]],
          values: val
        })
        return;
      }


    },
    cancel() {
      this.setData({
        values: this.data.defaultValue,
        value: this.data.defaultValue,
        modalName: false
      })
      this.triggerEvent('close', {
        condition: false,
        values: this.data.defaultValue,
        isConfirm: false,
        region:false
      }, {})
    },
    confirm() {
      this.triggerEvent('close', {
        condition: false,
        values: this.data.values,
        isConfirm: true,
        region:true
      }, {});
      this.triggerEvent('closeTwo', {}, {})
    },
    _getDefaultCityData() {
      var defaultValue = this.data.value
      console.log(this.data.value)
      var that = this;


      tcity.init(that);

      var cityData = that.data.cityData;
      console.log(cityData)
      var provinces = [];
      var citys = [];
      var countys = [];
      var values = this.data.value
      for (let i = 0; i < cityData.length; i++) {
        provinces.push(cityData[i].name);
      }
      for (let i = 0; i < cityData[values[0]].child.length; i++) {
        citys.push(cityData[values[0]].child[i].name)
      }
      if (cityData[values[0]].child[values[1]].child) {
        for (let i = 0; i < cityData[values[0]].child[values[1]].child.length; i++) {
          countys.push(cityData[values[0]].child[values[1]].child[i].name)
        }
      }




      that.setData({
        'provinces': provinces,
        'citys': citys,
        'countys': countys,
        defaultValue,
        value: values
        // onlyProvince: e.properties.onlyProvince
        // 'province': province,
        // 'city': city,
        // 'county': county
      })
      console.log('初始化完成');
      // 地区如果一开始存在  要赋值
    },

  }
})