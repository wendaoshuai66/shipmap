import {
  rectangle// 可是区域船只
  // shipLine, // 轨迹
  // shipinfo // 轨迹信息
} from '@/api/routemap'
import moment from 'moment'
// import _ from 'lodash'
import store from '@/store'
import { formatDegree } from '@/utils'
import config from '@/config'
import i18n from '@/lang'
import somaliaPirates from '@/lib/routemapData/somaliaPirates'
const L = window.L
let LazyArr = []
let piratesPoint = []
const militaryArea = []
const currents = []
const historyMarker = []
const historyLine = []
const lineSpeedMarkers = []
const Map = {
  mapView: null,
  initShip: true, // 初始化地图
  ShipHistory: false,
  notDrap: false,
  historyMarkerBlean: true, // 航线缩放
  shipPlateN: [],
  shipPlateY: [],
  portLists: [],
  typhoonLineArr: [],
  portListArr: [],
  weatherGridLayer: {},
  portShipMarkers: [],
  currentSearchIMO: null,
  prortCircle: [],
  ship: null,
  cirles: [],
  loadType: [1, 2, 3, 4],
  shipType: ['ULCC', 'VLCC', 'Suezmax', 'Aframax'],
  /**
   * [initMap description]
   * @method 初始化地图
   * @param  {[type]} mapId  id
   * @param  {[type]} aption [description]
   * @return {[type]}        [description]
   */
  initMap(mapId, aption) {
    let h1 = 'zh-CN'
    let gl = 'CN'
    if (i18n.locale !== 'zh') {
      h1 = 'en-EN'
      gl = 'EN'
    }
    const osmLink = 'Google Map'
    // const thunLink = '<a href="http://thunderforest.com/">谷歌卫星图</a>'
    const osd = '&copy;' + new Date().getFullYear() + ' mycrudeoil.com - ' + osmLink // 右下角图例
    // 瓦片图地址
    const osmUrl = config.mapTitlePath + `/vt/lyrs=m@160000000&hl=${h1}&gl=${gl}&src=app&y={y}&x={x}&z={z}&s=Ga`
    const landUrl = config.mapTitlePath + `/vt/lyrs=s@160000000&hl=${h1}&gl=${gl}&src=app&y={y}&x={x}&z={z}&s=Ga`
    // const sea = 'http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}' 海图如需要打开注释
    const osmMap = L.tileLayer(osmUrl, { attribution: osd, prefix: false })
    const landMap = L.tileLayer(landUrl, { attribution: osd, prefix: false })

    // const showCoordinates = (e) => {
    // }
    const centerMap = (e) => {
      this.mapView.panTo(e.latlng)
    }
    const zoomIn = (e) => {
      this.mapView.zoomIn()
    }
    const zoomOut = (e) => {
      this.mapView.zoomOut()
    }
    // const seaMap = L.tileLayer(sea)
    this.mapView = L.map(mapId, {
      center: [30.14512718337613, 68.73046875000001],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: false,
      // renderer: L.canvas(),
      layers: [osmMap], // 默认图层
      worldCopyJump: true,
      maxBounds: [[90, -720], [-90, 720]], // 地图范围
      contextmenu: true,
      contextmenuWidth: 140,
      // maxBoundsViscosity: 1.0,
      contextmenuItems: [
        // {
        //   text: 'Show coordinates',
        //   callback: showCoordinates
        // },

        {
          text: i18n.t('contextMenu.CenterMapHere'),
          callback: centerMap
        }, '-', {
          text: i18n.t('contextMenu.ZoomIn'),
          icon: config.staticImagesPath + '/images/zoom-out.png',
          callback: zoomIn
        }, {
          text: i18n.t('contextMenu.ZoomOut'),
          icon: config.staticImagesPath + '/images/zoom-in.png',
          callback: zoomOut
        }],
      ...aption
    })

    // this.mapView.locate({ setView: true, maxZoom: 12 })
    let baseLayers = {
      '谷歌路线图': osmMap,
      '谷歌卫星图': landMap
      // '海图': seaMap
    }
    // 切换图层中英文
    if (i18n.locale !== 'zh') {
      baseLayers = {
        'Roadmap': osmMap,
        'satellite map': landMap
        // 'Nautical chart': seaMap
      }
    }
    L.control.layers(baseLayers).addTo(this.mapView)
    this.mapView.on('resize', () => {
      this.mapView.invalidateSize()
    })
    // 切换图层按钮位置
    const zoomControl = L.control.zoom({ position: 'bottomright' })
    this.mapView.addControl(zoomControl)
    const osm2 = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13 })
    new L.Control.MiniMap(osm2, { toggleDisplay: true, minimized: false }).addTo(this.mapView)
    // L.control.mousePosition().addTo(this.mapViews)

    // 索马里海盗区域
    const triangleCoords = somaliaPirates.data.triangleCoords
    const latlngs = []
    triangleCoords.map((value) => {
      const flagArr = []
      flagArr.push(value.lat)
      flagArr.push(value.lng)
      latlngs.push(flagArr)
    })
    const polygon = L.polygon(latlngs, { color: 'red', weight: 1 }).addTo(this.mapView)
    const html = `<div>${i18n.t('commonRemind.Pirate')}</div>`
    polygon.bindPopup(html, { className: 'pirates-Somalia' })
  },
  /**
   * [removeMarker description]
   * @method removeMarker  canvas层marker清除
   * @param  {[type]}     ciLayer [description]
   * @param  {[type]}     markers [description]
   * @return {[type]}             [description]
   */
  // removeMarker(ciLayer, markers) {
  //   this.mapView.removeLayer(ciLayer)
  // },
  _ZoomShipTimer() {
    // if (!this.currentTimer) {
    //   this.currentTimer = new Date().getTime()
    // } else {
    //   if (new Date().getTime() - this.currentTimer < 100) {
    //     clearTimeout(this.ZoomShipTimer)
    //     this.currentTimer = new Date().getTime()
    //   } else {
    //     this.currentTimer = new Date().getTime()
    //   }
    // }
    // this.ZoomShipTimer = setTimeout(() => {
    this.LazyLoadShip(() => {})
    // }, 100)
  },
  // 初始化地图
  initial() {
    this.initCirleMarker(this.shipPlateN, '#29F92F') // 黄点
    this.initCirleMarker(this.shipPlateY, '#ffee35') // 绿点
    // this.initPort(ports)
    let flag = true
    // 拖拽地图
    this.mapView.on('dragend', (e) => {
      if (Map.initShip) {
        if (e.target.getZoom() >= 7) {
          // Map.removelazyShip()
          this._ZoomShipTimer()
          // this.LazyLoadShip(this.shipDetailDliago)
        }
      }
    })
    // 缩放地图
    this.mapView.on('zoomend', (e) => {
      if (this.initShip) {
        if (e.target.getZoom() >= 7) {
          flag = true
          // this.ciLayer.clearLayers()
          this.removeCirleMarker()
          if (!this.notDrap) {
            this._ZoomShipTimer()
          }
          // this.LazyLoadShip(this.shipDetailDliago)
        } else {
          if (flag) {
            flag = false
            this.removelazyShip()
            this.initCirleMarker(this.shipPlateN, '#29F92F')
            this.initCirleMarker(this.shipPlateY, '#ffee35')
          }
        }
      }
    })
  },
  // 初始化港口
  initPort() {
    const port = L.icon({
      iconUrl: config.staticImagesPath + '/images/port.png',
      iconSize: [20, 25],
      iconAnchor: [10, 9]
    })
    this.portLists.map((item, index) => {
      const marker = L.marker([item.lat, item.lng || item.log], {
        icon: port
      }).addTo(Map.mapView)
      marker.bindTooltip(`${i18n.t('commonRemind.portName')}:${i18n.locale !== 'en' ? item.nameCn : item.nameEn}`)
      this.portListArr.push(marker)
      marker.on({
        'click': (e) => {
          if (this.mapView.getZoom() > 6) {
            // 点击港口弹出港口详情数据
            store.dispatch('getPortListAll', item.nameEn)
            store.dispatch('getPortListAllInit', item)
          }
        }
      })
    })
  },
  /**
   * [LazyLoadShip description]
   * @method LazyLoadShip 船懒加载
   * @param  {Function}   callback [description] 回调
   */
  LazyLoadShip(cb) {
    const obj = {
      'lat_n': this.mapView.getBounds()._northEast.lat,
      'lat_s': this.mapView.getBounds()._southWest.lat,
      'lon_e': this.mapView.getBounds()._northEast.lng,
      'lon_w': this.mapView.getBounds()._southWest.lng,
      'loadType': this.loadType,
      'shipType': this.shipType
    }
    rectangle(obj).then(response => {
      if (LazyArr.length > 0) {
        this.removelazyShip()
      }
      if (this.mapView.getZoom() > 6) {
        const lazzDate = response.data.datas
        if (this.ship) {
          const index = lazzDate.findIndex(item => item.imo === this.ship.imo)
          if (index === -1) {
            lazzDate.push(this.ship)
          }
        }
        if (cb && typeof cb === 'function') {
          // console.log(cb, '2222222222222')
          cb()
        }
        this.initMarkerShip(lazzDate)
        this.notDrap = false
      }
    })
    // .catch(error => {})
  },
  /**
   * 初始化圆点
   * @param {*} arrDate 数据
   * @param {*} color  颜色
   */
  initCirleMarker(arrDate, color) {
    if (this.mapView.getZoom() < 7) {
      arrDate.map((item, index) => {
        if (item.lat !== null) {
          const cirleMarker = L.circleMarker(L.latLng(item.lat, item.lng || item.log), {
            radius: 4,
            color: color,
            stroke: true,
            opacity: 0.7,
            weight: 2,
            fillColor: color,
            fillOpacity: 1
          }).addTo(this.mapView)
          this.cirles.push(cirleMarker)
        } else {
          console.warn(item.imo + ' No latitude and longitude')
        }
      })
    }
  },
  /**
   * 移除圆点
   */
  removeCirleMarker() {
    const myGroup = L.layerGroup(this.cirles)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    this.cirles.length = 0
  },
  /**
   * 三角形船只函数
   * @param {*} arrDate 数据
   */
  initMarkerShip(arrDate) {
    const newArr = []
    arrDate.map((item, index) => {
      let styles = ''
      if (item.isShipPlate === '0') {
        if (item.loadEn === 'Full-laden') {
          styles = `Full-laden`
        } else {
          styles = `Full-ladenN`
        }
      } else {
        if (item.loadEn === 'Full-laden') {
          styles = `Null-laden`
        } else {
          styles = `Null-ladenN`
        }
      }
      if (this.currentSearchIMO && item.imo === this.currentSearchIMO) {
        styles += ' cuurent-active-imo'
      }
      const headding = item.heading || 0
      const mark = L.marker([item.lat, item.lng], {
        icon: L.divIcon({
          'className': styles,
          // html: '<div style="background:red;width:10px;height:10px" ></div>'
          html: '<svg viewBox="-15 -15 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-top:-8px; margin-left:-8px" width="28px" height="28px" ><path transform="rotate(' + headding + ')"  d="M-6 10L0 -10L6 10z" /></svg>'
        })
      }).addTo(this.mapView)
      var html = `<div class='ship-diover-style'><p>${i18n.t('commonRemind.shipName')}:${item.shipName}</p><p>${i18n.t('typhoon.typhoonBubble.Lat')}:${item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S'}</p><p>${i18n.t('typhoon.typhoonBubble.Lng')}:${item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W'}</p></div>`
      mark.bindTooltip(html, { className: 'ship-tyle-arrow', direction: 'right', opacity: '0.7' })
      // (item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W')
      // (item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S')
      newArr.push(mark)
      // LazyArr.push(mark)
      mark.on({
        'click': (e) => {
          // this.removeCurrentMarker()
          this.shipDetailImo = item.imo
          this.shipDetail(this.shipDetailImo)
          // store.dispatch('setImo', item.imo)
          // this.addCurrentMarker(item.lat, item.lng, 0)
        }
        // 'mouseover': function(e) {
        //   mark._icon.childNodes[0].childNodes[0].style.stroke = '#af0636'
        // },
        // 'mouseout': function(e) {
        //   mark._icon.childNodes[0].childNodes[0].style.stroke = '#27af06'
        // }
      })
    })
    LazyArr = newArr
  },
  /**
   * [removelazyShip description]
   * @method removelazyShip 清除懒加载船只
   * @return {[type]}       [description]
   */
  removelazyShip() {
    const myGroup = L.layerGroup(LazyArr)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    LazyArr.length = 0
  },
  /**
   * [addCurrentMarker description]
   * @method addCurrentMarker 当前选中船只
   * @param  {[type]}         lat   [description]
   * @param  {[type]}         lng   [description]
   * @param  {[type]}         marks [description]
   */
  addCurrentMarker(lat, lng) {
    const styles = `stroke-width: 5;stroke:#ff5c00;fill: transparent;fill-opacity: 1;scale:0.22;`
    const currentMark = L.marker([lat, lng], {
      icon: L.divIcon({
        'className': 'cuurent-div-icon',
        // html: '<div style="background:red;width:10px;height:10px" ></div>'
        html: '<svg viewBox="-2 -2 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-top:-17px; margin-left:-17px" width="48px" height="48px" ><path  style=" ' + styles + ' " d="M0 35L0 0L35 0 M61 0L96 0L96 35 M96 61L96 96L61 96 M35 96L0 96L0 61" /></svg>'
      })
    }).addTo(this.mapView)
    // const styleship = `fill:transparent;stroke:#ff5c00;stroke-width:2;`
    // const currentship = L.marker([lat, lng], {
    //   icon: L.divIcon({
    //     'className': 'cuurent-div-icon',
    //     // html: '<div style="background:red;width:10px;height:10px" ></div>'
    //     html: '<svg viewBox="-15 -15 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" transform="rotate(' + marks + ')" style="margin-top:-8px; margin-left:-8px" width="28px" height="28px" ><path  style=" ' + styleship + ' " d="M-6 10L0 -10L6 10z" /></svg>'
    //   })
    // }).addTo(this.mapView)
    // currents.push(currentship)
    currents.push(currentMark)
  },
  // removeMap(arr) {
  //   const myGroup = L.layerGroup(arr)
  //   this.mapView.addLayer(myGroup)
  //   myGroup.clearLayers()
  //   arr.length = 0
  // },
  /**
   * [removeCurrentMarker description]
   * @method removeCurrentMarker 清除当前船只
   * @return {[type]}            [description]
   */
  removeCurrentMarker() {
    const myGroup = L.layerGroup(currents)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    currents.length = 0
  },
  /**
   * [addShipline description]
   * @method addShipline 历史轨迹
   * @param  {[type]}    imo       [description]
   * @param  {[type]}    startTime [description]
   * @param  {[type]}    endTime   [description]
   */
  addShipline(path) {
    this.initShip = false
    this.ShipHistory = true
    this.removelazyShip()
    this.removeCurrentMarker()
    // let infoArray = []
    this.ShipHistoryline(path)
    const num = this.mapView.getZoom()
    const start = L.icon({
      iconUrl: config.staticImagesPath + '/images/startIcon.png',
      iconSize: [20, 25],
      iconAnchor: [10, 9]
    })
    const startIcon = L.marker(L.latLng(path[0].lat, path[0].lng), {
      icon: start
    }).addTo(this.mapView)
    const styles = `fill:#0ea406;stroke:#0ea406;stroke-width:2;`
    const Endrotate = path[path.length - 1].heading || 0
    const endtIcon = L.marker(L.latLng(path[path.length - 1].lat, path[path.length - 1].lng), {
      icon: L.divIcon({
        'className': 'ship-div-icon',
        // html: '<div style="background:red;width:10px;height:10px" ></div>'
        html: '<svg viewBox="-15 -15 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-top:-8px; margin-left:-8px" width="28px" height="28px" ><path transform="rotate(' + Endrotate + ')" style=' + styles + ' d="M-6 10L0 -10L6 10z" /></svg>'
      })
    }).addTo(this.mapView)
    historyLine.push(startIcon)
    historyLine.push(endtIcon)
    this.ShipHistoryMarker(this.fillterlat(this.mapView, path, num))
    this.mapView.on('zoomend', (e) => {
      const zoomNumber = e.target.getZoom()
      this.removeShipHistoryMarker()
      if (this.historyMarkerBlean) {
        this.ShipHistoryMarker(this.fillterlat(this.mapView, path, zoomNumber))
      }
    })
    this.mapView.on('dragend', (e) => {
      const zoomNumber1 = this.mapView.getZoom()
      this.removeShipHistoryMarker()
      if (this.historyMarkerBlean) {
        this.ShipHistoryMarker(this.fillterlat(this.mapView, path, zoomNumber1))
      }
    })
  },

  /**
   * [ShipHistoryMarker description]
   * @method ShipHistoryMarker 动态加载marker
   * @param  {[type]}          path [description]数据
   */
  ShipHistoryMarker(path) {
    path.map(item => {
      // L.circleMarker(new L.LatLng(item.lat, item.lng), 10).addTo(this.mapView)
      const mark = L.marker(L.latLng(item.lat, item.lng), {
        icon: L.divIcon({
          'className': 'div-line',
          // html: '<div style="background:red;width:10px;height:10px" ></div>'
          html: '<div class="pointText">' + item.text + '</div><svg viewBox="-15 -15 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-top:-8px; margin-left:-8px" width="28px" height="28px" ><circle cx="0" cy="0" r="5" stroke="red"stroke-width="2" fill="#fff"/></svg>'
        })
      }).addTo(this.mapView)
      var htmls = ''
      if (item.windDirection === null) {
        htmls = `<div class='ship-diover-style'>
        <p>${i18n.t('commonRemind.shipName')}:${item.shipName}</p>
        <p>${i18n.t('commonRemind.imo')}:${item.imo}</p>
        <p>${i18n.t('commonRemind.mmsi')}:${item.mmsi}</p>
        <p>${i18n.t('commonRemind.speed')}:${item.speed}${i18n.t('commonRemind.konts')}</p>
        <p>${i18n.t('commonRemind.lat')}:${item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S'}</p>
        <p>${i18n.t('commonRemind.lng')}:${item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W'}</p>
        <p>${i18n.t('detail.group2.shipWaterline')}:${item.draught ? item.draught : ''}</p>
        <p>${i18n.t('commonRemind.time')}:${item.text}</p>
        <p>${i18n.t('commonRemind.bow')}:${item.heading}</p>
        <p>${i18n.t('commonRemind.direation')}:${item.cog}</p>
        </div>`
      } else {
        htmls = `<div class='ship-diover-style'>
        <p>${i18n.t('commonRemind.shipName')}:${item.shipName}</p>
        <p>${i18n.t('commonRemind.imo')}:${item.imo}</p>
        <p>${i18n.t('commonRemind.mmsi')}:${item.mmsi}</p>
        <p>${i18n.t('commonRemind.speed')}:${item.speed}${i18n.t('commonRemind.konts')}</p>
        <p>${i18n.t('commonRemind.lat')}:${item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S'}</p>
        <p>${i18n.t('commonRemind.lng')}:${item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W'}</p>
        <p>${i18n.t('commonRemind.drat')}:${item.draught ? item.draught : ''}</p>
        <p>${i18n.t('commonRemind.time')}:${item.text}</p>
        <p>${i18n.t('commonRemind.windSpeed')}:${item.windSpeed}m/s</p>
        <p>${i18n.t('commonRemind.windDirection')}:${item.windDirection}</p>
        <p>${i18n.t('commonRemind.bow')}:${item.heading}</p>
        <p>${i18n.t('commonRemind.direation')}:${item.cog}</p>
        </div>`
      }
      mark.bindTooltip(htmls, { className: 'ship-tyle-arrow', direction: 'right', opacity: '0.7' })
      historyMarker.push(mark)
    })
    // this.mapView.fitBounds(polyline.getBounds())
  },
  /**
   * [ShipHistoryline description]
   * @method ShipHistoryline 历史轨迹线
   * @param  {[type]}        path [description]数据
   */
  ShipHistoryline(path) {
    const path1 = []
    path.map(item => {
      const c = L.latLng(item.lat, item.lng)
      path1.push(c)
    })
    // const dashArray
    const polyline = L.polyline(path1, { color: 'red' }).addTo(this.mapView)
    const arrow = L.polylineDecorator(path1, {
      patterns: [
        { offset: 50, repeat: 300, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: 'red', fillOpacity: 1, weight: 0 }}) }
      ]
    }).addTo(this.mapView)
    historyLine.push(polyline)
    historyLine.push(arrow)
    this.mapView.fitBounds(polyline.getBounds())
  },
  /**
   * 虚线
   * @param {*} path 数据
   * @param {*} number 虚线距离
   */
  dashLine(path, number) {
    const path1 = []
    path.map(item => {
      const c = L.latLng(item.lat, item.lng)
      path1.push(c)
    })
    // const dashArray
    const polyline = L.polyline(path1, { color: 'green', dashArray: number }).addTo(this.mapView)
    const arrow = L.polylineDecorator(path1, {
      patterns: [
        { offset: 50, repeat: 300, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: 'red', fillOpacity: 1, weight: 0 }}) }
      ]
    }).addTo(this.mapView)
    historyLine.push(polyline)
    historyLine.push(arrow)
  },
  /**
   * [removeShipHistoryMarker description]
   * @method removeShipHistoryMarker 清除历史轨迹线
   * @return {[type]}                [description]
   */
  removeShipHistoryMarker() {
    const myGroup = L.layerGroup(historyMarker)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    historyMarker.length = 0
  },
  /**
   * [removeShipHistoryLine description]
   * @method removeShipHistoryLine 清除历史轨迹点
   * @return {[type]}              [description]
   */
  removeShipHistoryLine() {
    const myGroup = L.layerGroup(historyLine)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    historyLine.length = 0
  },

  /**
   * [fillterlat description]
   * @method fillterlat 过滤marker点
   * @param  {[type]}   mapView     [map对象]
   * @param  {[type]}   arr         [数据]
   * @param  {[type]}   leval       [缩放等级]
   * @param  {Array}    [filter=[0, 0,            200, 90, 45, 20, 10, 5, 2, 2, 2, 1, 1]] [过滤规则]
   * @return {[type]}               [description]
   */
  fillterlat(mapView, arr, leval, filter = [0, 0, 200, 100, 80, 60, 70, 40, 30, 20, 10, 5, 1]) {
    return arr.filter((e, i) => {
      return leval ? i % filter[leval] === 0 && mapView.getBounds().contains(L.latLng(e.lat, e.lng)) : mapView.getBounds().contains(L.latLng(e.lat, e.lng))
    })
  },

  /**
   * [lineSpeedMarkers description]
   * @method lineSpeedMarkers 航速航速添加港口图标
   * @param  {[type]}         path [description]
   * @return {[type]}              [description]
   */
  lineSpeedMarkers(path, flag) {
    const port = L.icon({
      iconUrl: config.staticImagesPath + '/images/port.png',
      iconSize: [20, 25],
      iconAnchor: [10, 9]
    })
    let latlngs = {}
    path.map(item => {
      if (item.lon) {
        latlngs = L.latLng(item.lat, item.lon)
      } else {
        latlngs = L.latLng(item.lat, item.lng)
      }
      const marker = L.marker(latlngs, {
        icon: port
      }).addTo(this.mapView)
      if (flag) {
        var html = `<div class='bindTooltipHtml'><p>${item.nameCn}</p><p>${item.time}</p></div>`
        const popuops = L.popup({ 'autoClose': false, 'closeOnClick': false, 'closeButton': false }).setLatLng(latlngs).setContent(html).openOn(this.mapView)
        lineSpeedMarkers.push(popuops)
      }
      lineSpeedMarkers.push(marker)
    })
  },

  /**
   * [removeLineSpeedMarkers description]
   * @method removeLineSpeedMarkers 航速航线图标移除
   * @return {[type]}               [description]
   */
  removeLineSpeedMarkers() {
    const myGroup = L.layerGroup(lineSpeedMarkers)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    lineSpeedMarkers.length = 0
  },
  /**
   * [drawingTyphoonFun description]
   * @method drawingTyphoonFun 绘制台风
   * @param  {[msg]} [description]数据
   */
  drawingTyphoonFun(msg) {
    // const newTphoy = []
    // const newTphoy2 = []
    // const newTphoy3 = []
    // msg.map(item => {
    //   newTphoy.push({
    //     ...item,
    //     lng: item.lng > 0 ? item.lng - 360 : item.lng
    //   })
    //   if (item.lng < 0) {
    //     newTphoy2.push({
    //       ...item,
    //       lng: item.lng + 360
    //     })
    //   } else {
    //     newTphoy3.push(item)
    //   }
    // })
    const typoneGr = (item) => {
      // 台风已走过的线
      this.drawLineFun(item.positions, 'red')
      // 已走过台风marker点
      this.isMarkerFun(item.positions, true)
      // this.drawWindCircle(item.positions[item.positions.length - 1])

      // const lastTypone = {
      //   lat: item.positions[item.positions.length - 1].lat,
      //   lng: item.positions[item.positions.length - 1].lng
      // }
      // let lastTypone1 = null
      // const lastTypone2 = null
      // const lastTypone3 = null
      // if (lastTypone.lng < 0) {
      //   lastTypone1 = {
      //     ...lastTypone,
      //     lng: item.lng + 360
      //   }
      // } else {
      //   lastTypone2 = {
      //     ...lastTypone,
      //     lng: item.lng + 360
      //   }
      // }
      // 台风预测路线
      if (item.forepositions.length !== 0) {
        item.forepositions.map((item, index) => {
          // 台风预测路线
          this.dottedLineFun(item, this.randomColor(index), 5)
          // 台风预测点
          this.isMarkerFun(item, false)
        })
      }
    }
    msg.map(item => {
      typoneGr(item)
    })
    // newTphoy2.map(item => {
    //   typoneGr(item)
    // })
    // newTphoy3.map(item => {
    //   typoneGr(item)
    // })
  },
  drawWindCircle(item) {
    // 当前台风位置marker点
    const typhoon = L.icon({
      iconUrl: config.staticImagesPath + '/images/typhoon.png',
      iconSize: [25, 25]
    })
    const latLng = L.latLng(item.lat, item.lng)
    const currentTyphoon = L.marker(latLng, { icon: typhoon }).addTo(this.mapView)
    const html = `
      <div class='ship-diover-style'>
        <p>${i18n.t('typhoon.Name')}: ${item.name}</p>
        <p>${i18n.t('typhoon.Time')}: ${item.updatetime}</p>
        <p>${i18n.t('typhoon.typhoonBubble.Pressure')}: ${item.pressure}${i18n.t('typhoon.typhoonBubble.PressureUnit')}</p>
        <p>${i18n.t('typhoon.typhoonBubble.WindForce')}: ${item.level}${i18n.t('typhoon.typhoonBubble.WindForceUnit')}</p>
        <p>${i18n.t('typhoon.typhoonBubble.WindLevel')}: ${item.strong}</p>
        <p>${i18n.t('typhoon.WindSpeed')}: ${item.windspeed}m/s</p>
        <p>${i18n.t('typhoon.typhoonBubble.MovingSpeed')}: ${item.movespeed}Km</p>
        <p>${i18n.t('typhoon.typhoonBubble.MovingDirection')}: ${item.movedirection}</p>
        <p>${i18n.t('typhoon.typhoonBubble.Lng')}: ${item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W'}</p>
        <p>${i18n.t('typhoon.typhoonBubble.Lat')}: ${item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S'}</p>
        <p>${i18n.t('typhoon.typhoonBubble.windRange7')}: ${item.circle7}Km</p>
        <p>${i18n.t('typhoon.typhoonBubble.windRange10')}: ${item.circle10}${i18n.t('typhoon.typhoonBubble.unit')}</p>
        <p>${i18n.t('typhoon.typhoonBubble.Source')}: ${item.src}</p>
      </div>
    `
    currentTyphoon.bindTooltip(html, { className: 'typhoon-history-mark', direction: 'right', opacity: '0.7' })
    this.typhoonLineArr.push(currentTyphoon)
    // 七级风圈
    if (item.circle7 !== null && item.circle7.split('|')[0] !== '0') {
      const typhoon7 = L.circle([item.lat, item.lng], { radius: (item.circle7.split('|')[0]) * 1000, color: '#ff7300' }).addTo(this.mapView)
      const html = `
        <div class='ship-diover-style'>
          <p>${i18n.t('typhoon.typhoonBubble.windRange7')}</p >
          <p>${i18n.t('typhoon.typhoonBubble.Radius')}: ${item.circle7}${i18n.t('typhoon.typhoonBubble.unit')}</p >
        </div>
      `
      typhoon7.bindTooltip(html, { className: 'typhoon-7', direction: 'right', opacity: '0.7' })
      this.typhoonLineArr.push(typhoon7)
    }
    // 十级风圈
    if (item.circle10 !== null && item.circle10.split('|')[0] !== '0') {
      const typhoon10 = L.circle([item.lat, item.lng], { radius: (item.circle10.split('|')[0]) * 1000, color: '#e70014' }).addTo(this.mapView)
      const html = `
        <div class='ship-diover-style'>
          <p>${i18n.t('typhoon.typhoonBubble.windRange10')}</p >
          <p>${i18n.t('typhoon.typhoonBubble.Radius')}: ${item.circle10}${i18n.t('typhoon.typhoonBubble.unit')}</p >
        </div>
      `
      typhoon10.bindTooltip(html, { className: 'typhoon-10', direction: 'right', opacity: '0.7' })
      this.typhoonLineArr.push(typhoon10)
    }
  },
  drawLineFun(lineArr, color) {
    const newTphoy = []
    const newTphoy2 = []
    const newTphoy3 = []
    lineArr.map(item => {
      newTphoy.push({
        ...item,
        lng: item.lng > 0 ? item.lng - 360 : item.lng
      })
      if (item.lng < 0) {
        newTphoy2.push({
          ...item,
          lng: item.lng + 360
        })
      } else {
        newTphoy3.push(item)
      }
    })
    const typhoonLine = L.polyline(newTphoy, { color, zIndex: 10000 }).addTo(this.mapView)
    const typhoonLine2 = L.polyline(newTphoy2, { color, zIndex: 10000 }).addTo(this.mapView)
    const typhoonLine3 = L.polyline(newTphoy3, { color, zIndex: 10000 }).addTo(this.mapView)
    if (newTphoy.length > 0) {
      this.drawWindCircle(newTphoy[newTphoy.length - 1])
    }
    if (newTphoy2.length > 0) {
      this.drawWindCircle(newTphoy2[newTphoy2.length - 1])
    }
    if (newTphoy3.length > 0) {
      this.drawWindCircle(newTphoy3[newTphoy3.length - 1])
    }
    this.typhoonLineArr.push(typhoonLine)
    this.typhoonLineArr.push(typhoonLine2)
    this.typhoonLineArr.push(typhoonLine3)
  },
  dottedLineFun(lineArr, color, number) {
    const newTphoy = []
    const newTphoy2 = []
    const newTphoy3 = []
    lineArr.map(item => {
      newTphoy.push({
        ...item,
        lng: item.lng > 0 ? item.lng - 360 : item.lng
      })
      if (item.lng < 0) {
        newTphoy2.push({
          ...item,
          lng: item.lng + 360
        })
      } else {
        newTphoy3.push(item)
      }
    })
    const typhoonLine = L.polyline(newTphoy, { color, dashArray: number }).addTo(this.mapView)
    const typhoonLine2 = L.polyline(newTphoy2, { color, dashArray: number }).addTo(this.mapView)
    const typhoonLine3 = L.polyline(newTphoy3, { color, dashArray: number }).addTo(this.mapView)
    this.typhoonLineArr.push(typhoonLine)
    this.typhoonLineArr.push(typhoonLine2)
    this.typhoonLineArr.push(typhoonLine3)
  },
  isMarkerFun(arrDate, flag) {
    const newTphoy = []
    const newTphoy2 = []
    const newTphoy3 = []
    arrDate.map(item => {
      newTphoy.push({
        ...item,
        lng: item.lng > 0 ? item.lng - 360 : item.lng
      })
      if (item.lng < 0) {
        newTphoy2.push({
          ...item,
          lng: item.lng + 360
        })
      } else {
        newTphoy3.push(item)
      }
    })
    const createRo = (item) => {
      if (item.lat !== null) {
        const typhoonMark = L.circleMarker(L.latLng(item.lat, item.lng || item.log), {
          radius: 4,
          color: item.colour,
          stroke: true,
          opacity: 0.7,
          weight: 2,
          fillColor: item.colour,
          fillOpacity: 1,
          zIndex: 200000
        }).addTo(this.mapView)
        if (flag) {
          const html = `
          <div class='ship-diover-style'>
            <p>${i18n.t('typhoon.Name')}: ${item.name}</p>
            <p>${i18n.t('typhoon.Time')}: ${item.updatetime}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Pressure')}: ${item.pressure}${i18n.t('typhoon.typhoonBubble.PressureUnit')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.WindForce')}: ${item.level}${i18n.t('typhoon.typhoonBubble.WindForceUnit')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.WindLevel')}: ${item.strong}</p>
            <p>${i18n.t('typhoon.WindSpeed')}: ${item.windspeed}m/s</p>
            <p>${i18n.t('typhoon.typhoonBubble.MovingSpeed')}: ${item.movespeed}Km</p>
            <p>${i18n.t('typhoon.typhoonBubble.MovingDirection')}: ${item.movedirection}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Lng')}: ${(item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Lat')}: ${(item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.windRange7')}: ${item.circle7}${i18n.t('typhoon.typhoonBubble.unit')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.windRange10')}: ${item.circle10}${i18n.t('typhoon.typhoonBubble.unit')}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Source')}: ${item.src}</p>
          </div>
        `
          typhoonMark.bindTooltip(html, { className: 'typhoon-history-mark', direction: 'right', opacity: '0.7' })
        } else {
          const html = `
          <div class='ship-diover-style'>
            <p>${i18n.t('typhoon.typhoonBubble.Source')}: ${item.country}</p>
            <p>${i18n.t('typhoon.Time')}: ${item.forecasttime}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Pressure')}: ${item.forepressure}${i18n.t('typhoon.typhoonBubble.PressureUnit')}</p>
            <p>${i18n.t('typhoon.WindSpeed')}: ${item.forespeed}m/s</p>
            <p>${i18n.t('typhoon.typhoonBubble.Lng')}: ${item.lng > 0 ? formatDegree(item.lng) + 'E' : formatDegree(-item.lng) + 'W'}</p>
            <p>${i18n.t('typhoon.typhoonBubble.Lat')}: ${item.lat > 0 ? formatDegree(item.lat) + 'N' : formatDegree(-item.lat) + 'S'}</p>
          </div>
        `
          typhoonMark.bindTooltip(html, { className: 'typhoon-history-mark', direction: 'right', opacity: '0.7' })
        }
        this.typhoonLineArr.push(typhoonMark)
      } else {
        console.warn(item.imo + 'No latitude and longitude')
      }
    }
    newTphoy.map(item => {
      createRo(item)
    })
    newTphoy2.map(item => {
      createRo(item)
    })
    newTphoy3.map(item => {
      createRo(item)
    })
  },
  // 台风功能用到的颜色组
  randomColor(i) {
    const colorArr = ['#FF2A6C', '#C52BFF', '#FE9329', '#2AFECB', '#2A8EFE', '#00FA9A', '#FFD700', '#FF6347', '#8A2BE2', '#FF00FF']
    return colorArr[i]
  },
  // loading函数
  loadingFun(_this) {
    const loading = _this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    return loading
  },
  /**
   * [removeLineSpeedMarkers description]
   * @method piratesDrills 海盗军演点
   * @return {[type]} [description]
   */
  // 军演区域
  piratesDrills(data, key) {
    const point = []
    const area = []
    const navigationWarning = data.navigationWarning
    const pirate = data.pirate
    if (navigationWarning.length > 0) {
      var myIcon = L.icon({
        iconUrl: config.staticImagesPath + '/images/' + '/military exercise.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })
      navigationWarning.map(value => {
        const marker = L.marker([value.center.lat, value.center.lng], { icon: myIcon }).addTo(this.mapView)
        var html = '<div class="bindTooltipHtml">' + (i18n.locale === 'zh' ? value.name : value.nameEn) + '</div>'
        marker.bindTooltip(html, { className: 'pirates-drills', direction: 'right', opacity: '0.7' })
        const polygonData = []
        var bound = value.bound
        bound.map(item => {
          polygonData.push([item.lat, item.lng])
        })
        point.push(marker)
        area.push(polygonData)
      })
    }
    if (pirate.length > 0) {
      pirate.map(value => {
        const myIcon = L.icon({
          iconUrl: config.staticImagesPath + '/images/' + value.type + '.png',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
        const marker = L.marker([value.lat, value.lng], { icon: myIcon }).addTo(this.mapView)
        const wordList = {
          Type: i18n.t('typhoon.typhoonBubble.Type'),
          Lng: i18n.t('typhoon.typhoonBubble.Lng'),
          Lat: i18n.t('typhoon.typhoonBubble.Lat'),
          Time: i18n.t('typhoon.typhoonBubble.Time'),
          Name: i18n.locale !== 'zh' ? value.type : value.typeCn
        }
        const html = '<div class="bindTooltipHtml">' +
        '<div class="type">' + wordList.Type + ':' + wordList.Name + '</div>' +
        '<div class="lng">' + wordList.Lng + ':' + (value.lng > 0 ? formatDegree(value.lng) + 'E' : formatDegree(-value.lng) + 'W') + '</div>' +
        '<div class="lat">' + wordList.Lat + ':' + (value.lat > 0 ? formatDegree(value.lat) + 'N' : formatDegree(-value.lat) + 'S') + '</div>' +
        '<div class="time">' + wordList.Time + ':' + value.date + '</div>' + '</div>'
        marker.bindTooltip(html, { className: 'pirates-drills', direction: 'right', opacity: '0.7' })
        point.push(marker)
      })
    }
    let switchFlag = true
    this.mapView.on('zoomend', (e) => {
      if (e.target.getZoom() >= 7) {
        if (switchFlag) {
          area.map(value => {
            const polygon = L.polygon(value, { color: 'red', weight: '1' }).addTo(this.mapView)
            militaryArea.push(polygon)
          })
        }
        switchFlag = false
      }
    })
    if (key === 1) {
      this.removeMap(piratesPoint)
      this.removeMap(militaryArea)
    }
    piratesPoint = point
  },
  // 移除军演区域
  removeMapPiratesDrills() {
    this.removeMap(piratesPoint)
    this.removeMap(militaryArea)
  },
  // 移除地图数据（单个数组）
  removeMap(arr) {
    const myGroup = L.layerGroup(arr)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    arr.length = 0
  },
  // vuex 改变imo
  shipDetail(imo) {
    store.dispatch('setImo', imo)
  },
  // 创建瓦片图网格
  CoordMapType(type, time) {
    const self = this
    const createTile = function(coords) {
      const weatherDiv = L.DomUtil.create('div', 'type')
      const size = this.getTileSize()
      weatherDiv.width = size.x
      weatherDiv.height = size.y
      // 将切片号乘以切片分辨率，默认为256pixel,得到切片左上角的绝对像素坐标
      const nwPoint = coords.scaleBy(size)
      // 根据绝对像素坐标，以及缩放层级，反投影得到其经纬度
      self.mapView.unproject(nwPoint, coords.z)
      // title.style.border
      weatherDiv.style.width = weatherDiv.width + 'px'
      weatherDiv.style.height = weatherDiv.height + 'px'
      // weatherDiv.style.backgroundColor = 'red'
      // weatherDiv.style.borderColor = 'red'
      // weatherDiv.style.borderWidth = '1px'
      // weatherDiv.style.borderStyle = 'solid'
      // weatherDiv.innerHTML = coords.x + ',' + coords.y + ',' + coords.z
      const url = config.SLD.ship + 'api/weather/weatherChart.json?type=' + type + '&x=' + coords.x + '&y=' + coords.y + '&z=' + coords.z + '&time=' + time
      weatherDiv.style.backgroundImage = 'URL(' + url + ')'
      return weatherDiv
    }
    L.GridLayer.DebugCoords = L.GridLayer.extend({
      createTile: createTile
    })

    L.gridLayer.debugCoords = function(opts) {
      return new L.GridLayer.DebugCoords(opts)
    }
    // if (!this.weatherGridLayer) {
    this.weatherGridLayer[type] = L.gridLayer.debugCoords({ zIndex: 5 })
    // }

    this.mapView.addLayer(this.weatherGridLayer[type])
  },
  /**
   * 移除气象瓦片图
   */
  removeWeatherLayer() {
    // if (this.weatherGridLayer) {
    Object.keys(this.weatherGridLayer).map((item) => {
      this.mapView.removeLayer(this.weatherGridLayer[item])
    })
  },
  /**
   * 当前在港 预计到港 历史到港船只序号显示
   * @param {*} data 数据
   */
  portShipMarker(data) {
    data.map((item, index) => {
      let htmls = ''
      if (index < 9) {
        htmls = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="22px" height="35px" viewBox="0 0 22 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="7.26优化船舶序号" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="blue" transform="translate(1.000000, 1.000000)">
                    <ellipse id="Oval-6" fill="#D9D9D9" opacity="0.595089286" cx="10" cy="31.6666667" rx="5" ry="1.66666667"></ellipse>
                    <path d="M0.0276606518,9.97233935 C0.0276606518,4.46476841 4.49242906,0 10,0 C15.5075709,0 19.9723393,4.46476841 19.9723393,9.97233935 C20.1910524,12.7654276 19.1154767,15.9298004 16.6482262,18.2826221 C15.5184895,19.3599627 14.2150387,20.4376486 13.3241131,21.6067353 C11.2964783,24.2674298 11.1347513,26.1720155 11.1347513,29.917018 C11.1347513,30.5803596 11.1515909,31.64339 10,31.5790746 C9.1173706,31.5125274 8.73327025,30.9585086 8.84769895,29.917018 C8.84769895,26.1851033 8.69584841,24.260439 6.67588688,21.6067353 C5.77813622,20.4273245 4.49049595,19.3685315 3.35177377,18.2826221 C0.884523306,15.9298004 -0.191052357,12.7654276 0.0276606518,9.97233935 Z" id="Combined-Shape" stroke="#dc0909" fill="#dc0909"></path>
                </g>

                <text x="6" y="16" style="font-size:16px;fill:#fff">${index + 1}</text>
            </g>
        </svg>`
      } else {
        htmls = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="22px" height="35px" viewBox="0 0 22 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 51.1 (57501) - http://www.bohemiancoding.com/sketch -->
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="7.26优化船舶序号" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="blue" transform="translate(1.000000, 1.000000)">
                    <ellipse id="Oval-6" fill="#D9D9D9" opacity="0.595089286" cx="10" cy="31.6666667" rx="5" ry="1.66666667"></ellipse>
                    <path d="M0.0276606518,9.97233935 C0.0276606518,4.46476841 4.49242906,0 10,0 C15.5075709,0 19.9723393,4.46476841 19.9723393,9.97233935 C20.1910524,12.7654276 19.1154767,15.9298004 16.6482262,18.2826221 C15.5184895,19.3599627 14.2150387,20.4376486 13.3241131,21.6067353 C11.2964783,24.2674298 11.1347513,26.1720155 11.1347513,29.917018 C11.1347513,30.5803596 11.1515909,31.64339 10,31.5790746 C9.1173706,31.5125274 8.73327025,30.9585086 8.84769895,29.917018 C8.84769895,26.1851033 8.69584841,24.260439 6.67588688,21.6067353 C5.77813622,20.4273245 4.49049595,19.3685315 3.35177377,18.2826221 C0.884523306,15.9298004 -0.191052357,12.7654276 0.0276606518,9.97233935 Z" id="Combined-Shape" stroke="#dc0909" fill="#dc0909"></path>
                </g>

                <text x="4" y="16" style="font-size:12px;fill:#fff">${index + 1}</text>
            </g>
        </svg>`
      }

      const latLng = L.latLng(item.lat, item.lon)
      const portMarker = L.marker(latLng, {
        icon: L.divIcon({
          'className': 'cuurent-port-ship-icon',
          // html: '<div style="background:red;width:10px;height:10px" ></div>'
          html: htmls
        })
      }).addTo(this.mapView)
      this.portShipMarkers.push(portMarker)
    })
  },
  // 港口范围
  portZoom(data) {
    const prortCircle = L.circle([data.lat, data.lon || data.lng], 30000, {
      color: 'rgba(0,0,0,.4)',
      fillColor: 'rgba(0,0,0,.4)',
      fillOpacity: 0.5
    }).addTo(this.mapView)
    const port = L.icon({
      iconUrl: config.staticImagesPath + '/images/port.png',
      iconSize: [20, 25],
      iconAnchor: [10, 9]
    })
    const portmarker = L.marker([data.lat, data.lon || data.lng], {
      icon: port
    }).addTo(this.mapView)
    const time = data.time.indexOf('-') > 0 ? data.time : moment(Number(data.time)).format('YYYY-MM-DD HH:mm:ss')
    const html = `<div class='ship-diover-style'><p>${i18n.locale !== 'zh' ? data.nameEn : data.nameCn}(${data.country})</p><p>${time}</p></div>`
    // portmarker.bindTooltip(html, { className: 'ship-tyle-arrow', direction: 'right', opacity: '0.7' }).openTooltip()
    portmarker.bindPopup(html, { className: 'ship-tyle-arrow', direction: 'right', opacity: '0.7' }).openPopup()
    this.prortCircle.push(prortCircle)
    this.prortCircle.push(portmarker)
  },
  // 移除港口数据
  removePortZoom() {
    const myGroup = L.layerGroup(this.prortCircle)
    this.mapView.addLayer(myGroup)
    myGroup.clearLayers()
    this.prortCircle.length = 0
  }
}

export default Map

// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import XYZSource from 'ol/source/XYZ';
//
// const olMap = {
// 	mapView: null,
// 	initMap(mapId) {
// 		this.mapView = new Map({
// 		  target: mapId,
// 		  layers: [
// 		    new TileLayer({
// 		      source: new XYZSource({
// 		        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
// 		      })
// 		    })
// 		  ],
// 		  view: new View({
// 		    center: [0, 0],
// 		    zoom: 2
// 		  })
// 		});
// 		navigator.geolocation.getCurrentPosition(function(pos) {
// 		  const coords = fromLonLat([pos.coords.longitude, pos.coords.latitude]);
// 		  this.mapView.getView().animate({center: coords, zoom: 10});
// 		});
// 	}
// }
// export default olMap
