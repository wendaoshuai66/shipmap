import config from '@/config'
const rootHistoryPath = config.rootHistoryPath
export default {
  tabList: [
    {
      text: '船舶搜索',
      icon: 'ship',
      router: 'ship',
      path: rootHistoryPath + '/route/index'
    },
    {
      text: '我的船队',
      icon: 'ships',
      router: 'fleet',
      path: rootHistoryPath + '/route/fleet'
    },
    {
      text: '港口查询',
      icon: 'port',
      router: 'portSearch',
      path: rootHistoryPath + '/route/portSearch'
    },
    {
      text: '航线航速',
      icon: 'shipLine',
      router: 'shipLine',
      path: rootHistoryPath + '/route/shipLines'
    },
    {
      text: '历史航线',
      icon: 'history',
      router: 'history',
      path: rootHistoryPath + '/route/history'
    }
  ]
}
