import request from '@/utils/request'
import config from '@/config'
/**
 * [port description]
 * @method removeSubscribe 取消订阅
 * @param  {[type]} data [columnId]
 * @return {[type]}
 */
export function removeSubscribe(data) {
  return request({
    url: `${config.SLD.info}subscribe/removeSubscribe.json`,
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method subscribeColumn 订阅
 * @param  {[type]} data [columnId]
 * @return {[type]}
 */
export function subscribeColumn(data) {
  return request({
    url: `${config.SLD.info}subscribe/subscribeColumn.json`,
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method infoListOS 邮轮、船期
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function infoListOS(data) {
  return request({
    url: `${config.SLD.info}front/infoListOS.json`,
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method infoList 最新成交指数下的列表
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function infoList(data) {
  return request({
    url: `${config.SLD.info}front/infoList.json`,
    method: 'POST',
    data
  })
}
/**
 * [forecast description] 邮轮、船期详情
 * @method infoDetail
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function infoDetail(data) {
  return request({
    url: `${config.SLD.info}front/infoDetail.json?infoUuid=${data}`,
    method: 'GET'
  })
}
/**
 * [forecast description] WS点
 * @method shipPointY
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function shipPointY(data) {
  return request({
    url: `${config.SLD.info}front/shipPointY.json`,
    method: 'GET'
  })
}
/**
 * [port description]
 * @method fixtureListForward 租约信息
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function fixtureListForward(data) {
  return request({
    url: '/om/platform/fixtureListForward.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method findFixtureDetail 租约详情
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function findFixtureDetail(data) {
  return request({
    url: '/om/platform/findFixtureDetail.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method portQueueList 港口排队列表
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function portQueueList(data) {
  return request({
    url: '/home/platform/portQueueList.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method homeBerthPlanDetail 港口列表
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function homeBerthPlanDetail(data) {
  return request({
    url: '/home/platform/homeBerthPlanDetail.json',
    method: 'POST',
    data
  })
}

export function infoMationFun() {
  return request({
    url: `${config.SLD.info}column/columnList.json`,
    method: 'post',
    data: {
    }
  })
}
