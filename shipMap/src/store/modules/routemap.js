import { allbackNew, reachPortSearch, portListAllData, currentProtShip, expectedList, historyPorts, historyport, queryFleets } from '@/api/routemap'
import { queryAllShipPlateList, findShipPlateList, lsRecord } from '@/api/shipHall'
import { isLogin } from '@/api/login'
import { Loading } from 'element-ui'
const user = {
  state: {
    allbackNew: '',
    shipImo: '',
    isSetCenter: false,
    minimizeWindows: [],
    shipInfos: Object,
    reachPortSearch: {},
    shipHallSearch: null,
    allShipPlateList: null,
    portListAll: null,
    getPortListAllInit: null,
    shipHallFile: null,
    shipHallCondition: null,
    getPortFlag: null,
    currentPort: null,
    expectedPort: null,
    historyPort: null,
    historyCourse: null,
    getUser: null,
    isHome: null,
    settingPageVisible: null,
    setVlessInfo: null,
    getWeatherShow: null,
    getPortName: null,
    gethistoryportDate: null,
    getQueeryFleets: null,
    deleteImo: null
  },

  mutations: {
    SET_EEACH_PORT_SEARCH: (state, data) => {
      state.reachPortSearch = data
    },
    SET_BACK_NEW: (state, data) => {
      state.allbackNew = data
    },
    SET_IMO: (state, data) => {
      state.shipImo = data
    },
    SEARCH_IMO: (state, data) => {
      state.isSetCenter = true
      state.shipImo = data
    },
    MINIMIZE_WINDOWS: (state, data) => {
      const flagArr = state.minimizeWindows
      const flag = flagArr.findIndex(item => item.routeName === data.routeName)
      if (flag === -1) {
        flagArr.push(Object.assign({}, data))
      } else {
        // flagArr.push(Object.assign({}, data))
        flagArr.splice(flag, 1, data)
      }
      state.minimizeWindows = flagArr
    },
    SHIP_INFOS: (state, data) => {
      state.shipInfos = data
    },
    SHIP_HALL_SEARCH: (state, data) => {
      state.shipHallSearch = data
    },
    ALL_SHIP_PLATE_LIST: (state, data) => {
      state.allShipPlateList = data
    },
    SHIP_HALL_CONDITION: (state, data) => {
      state.shipHallCondition = data
    },
    SET_PORT_LIST_ALL: (state, data) => {
      state.portListAll = data
    },
    GET_PORT_LIST_ALL_INIT: (state, data) => {
      state.getPortListAllInit = data
    },
    SHIP_HALL_FILE: (state, data) => {
      state.shipHallFile = data
    },
    GET_PORT_FLAG: (state, data) => {
      state.getPortFlag = data
    },
    CURRENT_PORT: (state, data) => {
      state.currentPort = data
    },
    EXPECTED_PORT: (state, data) => {
      state.expectedPort = data
    },
    HISTORY_PORT: (state, data) => {
      state.historyPort = data
    },
    HISTORY_COURSE: (state, data) => {
      state.historyCourse = data
    },
    SET_USER: (state, data) => {
      state.getUser = data
    },
    SETTING_PAGE_VISIBLE: (state, data) => {
      state.settingPageVisible = data
    },
    SET_VLESS_INFO: (state, data) => {
      state.setVlessInfo = data
    },
    SET_WEATHER_SHOW: (state, data) => {
      state.getWeatherShow = data
    },
    SET_PORT_Name: (state, data) => {
      state.getPortName = data
    },
    SET_HISTORY_PORT_DATE: (state, data) => {
      state.gethistoryportDate = data
    },
    SET_QUERY_FLEETS: (state, data) => {
      state.getQueeryFleets = data
    },
    DELETE_IMO: (state, data) => {
      state.deleteImo = data
    }
  },

  actions: {
    // 初始化数据
    getBackNew({ commit }, payload) {
      return new Promise((resolve, reject) => {
        allbackNew(payload).then(response => {
          const data = response.data.datas
          commit('SET_BACK_NEW', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 靠港查询
    reachPortSearch({ commit }, payload) {
      return new Promise((resolve, reject) => {
        reachPortSearch(payload).then(response => {
          const data = response.data.datas
          commit('SET_EEACH_PORT_SEARCH', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 当前在港
    setcuurentPort({ commit }, payload) {
      return new Promise((resolve, reject) => {
        currentProtShip(payload).then(response => {
          const data = response.data.datas
          commit('CURRENT_PORT', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    catchSetcuurentPort({ commit }, { type, data }) {
      commit(type, null)
      const newData = data
      newData.gtime = new Date().getTime()
      commit(type, newData)
    },
    // 预计到港
    expectedPort({ commit }, payload) {
      return new Promise((resolve, reject) => {
        expectedList(payload).then(response => {
          const data = response.data.datas
          commit('EXPECTED_PORT', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 历史到港
    historyPort({ commit }, payload) {
      return new Promise((resolve, reject) => {
        historyPorts(payload).then(response => {
          const data = response.data.datas
          commit('HISTORY_PORT', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 历史航线table数据
    sethistoryportDate({ commit }, payload) {
      return new Promise((resolve, reject) => {
        historyport(payload).then(response => {
          const data = response.data.datas
          commit('SET_HISTORY_PORT_DATE', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 历史航线historyCourse
    historyCourse({ commit }, payload) {
      commit('HISTORY_COURSE', payload)
    },
    // 登陆信息
    setUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        isLogin().then(response => {
          const data = response.data
          commit('SET_USER', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    setqueryFleets({ commit }, payload) {
      return new Promise((resolve, reject) => {
        queryFleets().then(response => {
          const data = response.data
          commit('SET_QUERY_FLEETS', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    setImo({ commit }, payload) {
      commit('SET_IMO', payload)
    },
    setSearchImo({ commit }, payload) {
      commit('SEARCH_IMO', payload)
    },
    minimizeWindows({ commit }, payload) {
      commit('MINIMIZE_WINDOWS', payload)
    },
    shipInfos({ commit }, payload) {
      commit('SHIP_INFOS', payload)
    },
    getPortFlag({ commit }, payload) { // 跳转港口搜索标记
      commit('GET_PORT_FLAG', payload)
    },
    // 船盘查询
    allShipPlateList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        findShipPlateList({}).then(response => {
          const data = response.data
          commit('ALL_SHIP_PLATE_LIST', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 船盘查询
    shipHallSearch({ commit }, payload) {
      let params = {
        type: '',
        etaStart: '',
        etaEnd: '',
        etaCabindabegin: '',
        etaCabindaEnd: ''
      }
      if (payload.updateObj) {
        params = payload.updateObj
      }
      return new Promise((resolve, reject) => {
        if (payload.isSmall) {
          findShipPlateList(params).then(response => {
            const data = response.data
            commit('SHIP_HALL_SEARCH', data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        } else {
          queryAllShipPlateList(params).then(response => {
            const data = response.data
            commit('SHIP_HALL_SEARCH', data)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 船盘查询条件
    shipHallCondition({ commit }, payload) {
      commit('SHIP_HALL_CONDITION', payload)
    },
    // 港口数据
    getPortListAll({ commit }, payload) {
      const options = { lock: true, text: 'Loading......', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' }
      const loading = Loading.service(options)
      portListAllData(payload).then(response => {
        if (response && response.data) {
          loading.close()
          const data = response.data.datas
          commit('SET_PORT_LIST_ALL', data)
        }
      })
    },
    // 港口初始化数据
    getPortListAllInit({ commit }, payload) {
      commit('GET_PORT_LIST_ALL_INIT', payload)
    },
    shipHallFile({ commit }, payload) {
      return new Promise((resolve, reject) => {
        lsRecord(payload).then(response => {
          const data = response.data
          commit('SHIP_HALL_FILE', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    settingPageVisible({ commit }, payload) {
      commit('SETTING_PAGE_VISIBLE', payload)
    },
    setVlessInfo({ commit }, payload) {
      commit('SET_VLESS_INFO', payload)
    },
    setWeatherShow({ commit }, payload) {
      commit('SET_WEATHER_SHOW', payload)
    },
    setPortName({ commit }, payload) {
      commit('SET_PORT_Name', payload)
    },
    deleteImo({ commit }, payload) {
      commit('DELETE_IMO', payload)
    }
  }
}

export default user
