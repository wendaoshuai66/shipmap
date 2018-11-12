import axios from 'axios'
import Router from '@/router'
import { MessageBox } from 'element-ui'// MessageBox Message
import store from '@/store'
import i18n from '@/lang'
import { getToken } from '@/utils/auth'
import config from '@/config'
// create an axios instance
const service = axios.create({
  baseURL: config.localPath, // process.env.BASE_API, api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = getToken()
  }
  config.params = {
    _t: Date.parse(new Date()) / 1000,
    ...config.params
  }
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => {
  //   console.log(response)
  //   return response
  // },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // if (_.isEmpty(response.data.datas)) {
    //   Message({
    //     message: i18n.t('commonRemind.noMessage'),
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // this.$alert(i18n.t('commonRemind.noMessage'), i18n.t('history.prompt'))
    // }
    const res = response.data
    if (res.status === 401) { // 未登录
      MessageBox.confirm(i18n.t('commonRemind.loginTips'), {
        confirmButtonText: i18n.t('login.logIn'),
        cancelButtonText: i18n.t('commonRemind.cancel'),
        type: 'warning'
      }).then(() => {
        window.location.href = config.SLD.loginUrl + encodeURIComponent(window.location.href)
      }).catch(() => {
        Router.push({ name: 'ship' })
      })
      return response
    } else if (res.status === 403) { // 没权限
      MessageBox.alert(i18n.t('commonRemind.Jurisdiction'), {
        confirmButtonText: i18n.t('history.confirm'),
        type: 'warning'
      }).then(() => {
        Router.push({ name: 'ship' })
      }).catch(() => {
        Router.push({ name: 'ship' })
      })
      return false
    } else {
      return response
    }
  },
  error => {
    // console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  })

export default service
