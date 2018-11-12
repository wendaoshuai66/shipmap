import config from '@/config'
const rootHistoryPath = config.rootHistoryPath
export default {
  tabList: [
    {
      route: 'typhoon',
      path: rootHistoryPath + '/route/typhoon',
      name: '台风',
      iconName: 'taifeng'
    },
    {
      route: 'weather',
      name: '气象海况',
      path: rootHistoryPath + '/route/weather',
      iconName: 'qixiang'
    },
    {
      route: 'piratesDrills',
      path: rootHistoryPath + '/route/pirates-drills',
      name: '海盗军演',
      iconName: 'haidao'
    }
  ]
}
