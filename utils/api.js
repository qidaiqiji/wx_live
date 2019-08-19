
import fly from 'request.js'
import qs from 'qs.js';
// console.log(fly)
// console.log(qs)

//拉流
const getMakePushUrl = params => fly.get('v2/aliyun-live/pull-url', qs.stringify(params), {
  params: 'haveModel'
})
//播流
const pushMakePushUrl = params => fly.get('v2/aliyun-live/push-url', qs.stringify(params))

//老师端状态更改
const changeStatus = params => fly.post('v2/aliyun-live/change-status',params)
//观众端定时获取数据
const aliyunLiveInfo = params => fly.get('v2/aliyun-live/info', qs.stringify(params))
//课程列表
const aliyunLiveList = params => fly.get('v2/aliyun-live/list',qs.stringify(params))
//拉取相关商品

// 加入购物车
const addCart = params => fly.post('v2/cart/add', params, {
  params: 'haveModel'
});
const goodsList = params => fly.get('v2/aliyun-live/goods-list', qs.stringify(params))
//首页 录播列表

const vodList = params => fly.get('v2/vod/list', qs.stringify(params))
// 登录信息
const getuser = params => fly.get('v2/user/info', qs.stringify(params));
const autoLogin = params => fly.post('v2/user/live-login-with-code', params);
const getreg = params => fly.post('v2/user/live-register', params);
const getshort = params => fly.post('v2/user/get-sms-check-no', params);
//想看
const reminder = params => fly.post('v2/aliyun-live/reminder', params);
// 取消想看
const cancelReminder = params => fly.post('v2/aliyun-live/cancel-reminder', params);

//定时拉取录播数据

const vodInfo = params => fly.get('v2/vod/info', qs.stringify(params))
const vodGoodsList = params => fly.get('v2/vod/goods-list', qs.stringify(params))

// 省份修改
const setprovince = params => fly.get('v2/user/change-province', params);
// 认证审核
const getApplyInfo = params => fly.get('v2/user/get-apply-info', qs.stringify(params));
const setApplyInfo = params => fly.post('v2/user/set-apply-info', params);
const applyStatus = params => fly.get('v2/user/apply-status', qs.stringify(params));

export default {
  getMakePushUrl,
  pushMakePushUrl,
  aliyunLiveList,
  getuser,
  autoLogin,
  aliyunLiveInfo,
  changeStatus,
  vodList,
  vodInfo,
  reminder,
  cancelReminder,
  goodsList,
  vodGoodsList,
  addCart,
  getreg,
  getshort,
  setprovince,
  getApplyInfo,
  setApplyInfo,
  applyStatus,


}