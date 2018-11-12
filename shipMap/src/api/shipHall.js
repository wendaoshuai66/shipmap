import request from '@/utils/request'

/**
 * [port description]
 * @method queryAllShipPlateList 船盘大厅获取所有船盘信息
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function queryAllShipPlateList(data) {
  return request({
    url: '/shipPlate/queryAllShipPlateList.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method findShipPlateList 地图首页获取船盘信息
 * @param  {[type]} data [请求数据]
 * @return {[type]} 返回船盘大厅
 */
export function findShipPlateList(data) {
  return request({
    url: '/shipPlate/findShipPlateList.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method queryValueSet 船型
 * @param  {[type]} data [请求数据]
 * @return {[type]} 船型
 */
export function queryValueSet(data) {
  return request({
    url: '/shipPact/queryValueSet.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method findShipPlateDetailByShip 船盘详情
 * @param  {[type]} data [uuid]
 * @return {[type]}
 */
export function findShipPlateDetailByShip(data) {
  return request({
    url: '/shipPlate/findShipPlateDetailByShip.json',
    method: 'POST',
    data
  })
}
/**
 * [port description]
 * @method lsRecord 船舶档案
 * @param  {[type]} data [uuid]
 * @return {[type]}
 */
export function lsRecord(data) {
  return request({
    url: 'api/weather/lsRecord.json',
    method: 'POST',
    data
  })
}
