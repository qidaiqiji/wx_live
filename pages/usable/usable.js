// pages/self/usable/usable.js
const {
  $Toast
} = require('../../components/base/index');
import base64 from '../../utils/base64.js';
const {
  encode
} = base64;
import api from '../../utils/api.js';
const {
  getApplyInfo,
  setApplyInfo,
  applyStatus
} = api
const app = getApp()
const throttle = app.throttle
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscolor: 'rgba(255,174,194,1)',
    usershop: '',
    username: '',
    txtOne: '',
    txtTwo: '',
    businesslicenseImg: './img/img_businesslicense.png',
    shoppictureImg: './img/img_shoppicture.png',
    img_one: '',
    img_two: '',
    isactionSheet: false,
    iswho: '',
    actiions: [{
        name: '拍照',
      },
      {
        name: '从相册上传'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拉取认证信息
    wx.hideShareMenu()
    getApplyInfo({}).then(res => {
      console.log('拉取认证信息', res.data.shopFrontPic, res.data.bizLicensePic)
      if (res.data.bizLicensePic) {
        var bizLicensePic = res.data.bizLicensePic;
        var txtOne = '重新上传';
      } else {
        var bizLicensePic = this.data.businesslicenseImg;
        var txtOne = '上传营业执照';
      }
      if (res.data.shopFrontPic) {
        var shopFrontPic = res.data.shopFrontPic;
        var txtTwo = '重新上传';
      } else {
        var shopFrontPic = this.data.shoppictureImg;
        var txtTwo = '上传店铺照片';
      }
      this.setData({
        usershop: res.data.companyName,
        username: res.data.nickname,
        img_two: shopFrontPic,
        img_one: bizLicensePic,
        txtOne,
        txtTwo,

      });
      console.log("专辑数据", this.data);
      this.iscolors()
    });
    // 提交认证信息
  },
  jumpToHome: throttle(function (e) {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }),
  // 判断变色
  iscolors() {
    if (this.data.usershop !== '' && this.data.username !== '' && this.data.img_one !== './img/img_shoppicture.png' && this.data.img_two !== './img/img_businesslicense.png') {
      this.setData({
        iscolor: 'rgba(255,51,102,1)',
      })
    } else {
      this.setData({
        iscolor: 'rgba(255,174,194,1)',
      })
    }
  },
  // 获取铺名
  usershop: function (e) {
    this.setData({
      usershop: e.detail.value
    })
    console.log(this.data.usershop, '铺名')
    this.iscolors();

  },

  // 获取姓名
  username: function (e) {
    this.setData({
      username: e.detail.value
    })
    console.log(this.data.username, '姓名');
    this.iscolors();

  },
  getSex(e) {
    console.log('getsss', e.currentTarget.dataset.is)
    this.setData({
      isactionSheet: true,
      iswho: e.currentTarget.dataset.is
    });
  },
  actionSheetCancel() {
    this.setData({
      isactionSheet: false
    });
  },
  actionSheetClickItem(e) {
    console.log(e.detail.index, );
    var index = e.detail.index
    this.setData({
      isactionSheet: false
    })
    if (index == 1) {
      this.imgUpOne()
    }
    if (index == 0) {
      this.imgUptwo()
    }

  },
  // 本地相册
  imgUpOne() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: (res) => {
        // console.log(res,'res')
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        // 判断第几个图，01第一个，02第二个
        console.log(res.tempFilePaths, '0000000');
        this.newImgTxt(tempFilePaths);
      }
    })
  },
  // 相机
  imgUptwo() {
    console.log('相机')
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        console.log(res.tempFilePaths, '0000')
        this.newImgTxt(tempFilePaths);
      }
    });
  },
  // 显示图片和重新上传
  newImgTxt(tempFilePaths) {
    if (this.data.iswho == '01') {
      this.setData({
        img_one: tempFilePaths,
        txtOne: '重新上传'
      })
      this.iscolors();
      this.uploadLicense(tempFilePaths);
    } else {
      this.setData({
        img_two: tempFilePaths,
        txtTwo: '重新上传'
      })
      this.iscolors();
      this.uploadShopFront(tempFilePaths);
    };
  },
  // 上传店铺图片
  uploadShopFront(tempFilePaths) {
    console.log('上传店铺图片', tempFilePaths);
    //  文件上传
    wx.uploadFile({
      url: 'https://api.xiaomei360.com/v2/user/upload-shop-front', // 仅为示例，非真实的接口地址
      filePath: tempFilePaths,
      header: {
        "content-type": 'multipart/form-data',
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization')+':')}`,
      },
      name: 'file',
      formData: {
        user: 'test'
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  // 上传营业图片
  uploadLicense(tempFilePaths) {
    console.log('调用上传', tempFilePaths);
    //  文件上传
    wx.uploadFile({
      url: 'https://api.xiaomei360.com/v2/user/upload-license', // 仅为示例，非真实的接口地址
      filePath: tempFilePaths,
      header: {
        "content-type": 'multipart/form-data',
        "Authorization": `Basic ${encode(wx.getStorageSync('Authorization')+':')}`,
      },
      name: 'file',
      formData: {
        user: 'test'
      },
      success: (res) => {
        console.log(res)
      }
    })
  },

  submitOn() {
    if (this.data.usershop !== '' && this.data.username !== '' && this.data.img_one !== './img/img_shoppicture.png' && this.data.img_two !== './img/img_businesslicense.png') {
      // 提交
      setApplyInfo({
        companyName: this.data.usershop,
        nickname: this.data.username
      }).then(res => {
        console.log('提交认证信息', res)
        if (res.code == 0) {
          var pages = getCurrentPages() //获取加载的页
          var prevPage = pages[pages.length - 2];
          console.log(pages, '页面路径')
          if (prevPage && prevPage.route == 'pages/usableno/usableno') {
            wx.navigateBack({
              delta: 1
            })
            return false
          } else {
            console.log('进入跳转')
            wx.navigateTo({
              url: '/pages/usableno/usableno',
            })
          }
        } else {
          $Toast({
            content: '您填写的信息有误，请核对后提交。'
          });
        }
      })
    } else if (this.data.usershop == '') {
      $Toast({
        content: '请输入实体店名称'
      });
    } else if (this.data.username == '') {
      $Toast({
        content: '请输入联系人姓名'
      });
    } else if (this.data.img_one == this.data.shoppictureImg) {
      $Toast({
        content: '请上传营业执照'
      });
    } else if (this.data.img_two == this.data.businesslicenseImg) {
      $Toast({
        content: '请上传店铺照片'
      });
    };


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
    var pages = getCurrentPages() 
    console.log(pages,'usable')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('223','结束了')
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

})