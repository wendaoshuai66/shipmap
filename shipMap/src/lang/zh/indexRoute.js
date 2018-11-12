import config from '@/config'
const rootHistoryPath = config.rootHistoryPath
export default {
  routeList: [
    {
      text: '地图',
      router: 'ship',
      path: rootHistoryPath + '/route/index'
    },
    {
      text: '船盘大厅',
      router: 'shipHall',
      path: rootHistoryPath + '/shipHall/index'
    },
    {
      text: '资讯',
      router: 'mapInformation',
      path: rootHistoryPath + '/mapInformation/index'
    },
    {
      text: '运费保值',
      router: null,
      href: config.SLD.asset + 'pages/front/ffa_transaction/index.htm'
    },
    {
      text: '合作伙伴',
      router: 'cooperative',
      path: rootHistoryPath + '/Cooperative/index'
    },
    {
      text: '用户中心',
      router: null,
      href: config.SLD.memberUrl + 'center/my.htm'
    }
  ]
}
