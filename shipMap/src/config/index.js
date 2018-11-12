export const host = window.location.host
export const hostname = window.location.hostname
export const path = host.substr(host.indexOf('.'))
export const domian = hostname.substr(host.indexOf('.'))

const RootDomian = '.mycrudeoil.com'
let SLD = {}
switch (true) {
  // case hostname.search('dev.') !== -1:
  //   // SLD = {
  //   //   asset: '//' + RootDomian + '/',
  //   //   member: '//' + RootDomian + '/'
  //   // }
  //   break
  case hostname.search('test.') !== -1:
    SLD = {
      asset: '//asset.test' + RootDomian + '/',
      member: '//member.test' + RootDomian + '/',
      ship: '//ship.test' + RootDomian + '/',
      specialIds: [100011683, 100000085],
      info: '//info.test' + RootDomian + '/',
      domain: '.test.mycrudeoil.com',
      loginUrl: '//member.test' + RootDomian + '/sys/login.htm?returnUrl=',
      logoutUrl: '//member.test' + RootDomian + '/sys/logout.htm?returnUrl=',
      memberUrl: '//member.test' + RootDomian + '/member/',
      index: '//www.test.mycrudeoil.com'
    }
    break
  case hostname.search('9.') !== -1:
    SLD = {
      asset: '//asset9' + RootDomian + '/',
      member: '//sys9' + RootDomian + '/',
      ship: '//ship9' + RootDomian + '/',
      specialIds: [100008982],
      info: '//info9' + RootDomian + '/',
      domain: '.mycrudeoil.com',
      loginUrl: '//sys9' + RootDomian + '/login.htm?returnUrl=',
      logoutUrl: '//sys9' + RootDomian + '/logout.htm?returnUrl=',
      memberUrl: '//member9' + RootDomian + '/',
      index: '//www9.mycrudeoil.com'
    }
    break
  default: SLD = {
    asset: '//asset' + RootDomian + '/',
    member: '//sys' + RootDomian + '/',
    ship: '//ship' + RootDomian + '/',
    specialIds: [100008019, 100008020, 100008024, 100008022],
    info: '//info' + RootDomian + '/',
    domain: '.mycrudeoil.com',
    loginUrl: '//sys' + RootDomian + '/login.htm?returnUrl=',
    logoutUrl: '//sys' + RootDomian + '/logout.htm?returnUrl=',
    memberUrl: '//member' + RootDomian + '/',
    index: '//www.mycrudeoil.com'
  }
}

export default {
  RootDomian,
  html5Path: false,
  rootHistoryPath: '/map',
  localPath: '//' + host + '/',
  staticImagesPath: hostname.search('dev.') >= 0 ? '/static' : '/map/static',
  iconsSvg: '/src/icons/svg',
  // staticImagesPath: '//' + host + '/static/images',
  mapTitlePath: '//mt0.google.cn',
  SLD
}
