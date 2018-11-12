<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade-transform" mode="out-in">
      <div>
        <div class="map-mouseover-style">
          <p>{{this.mapLat}}</p>
          <p>  {{this.mapLng}}</p>
        </div>
        <!-- 地图 -->
        <div id="map-main" :style="{height: mapHeight + 'px',width: 100 + '%',position: 'absolute', top: 0, left: 0, zIndex:1}" ref="mapBox">

        </div>
        <!-- 导航 -->
        <min-nav></min-nav>
        <!-- 二级导航 -->
        <tab-nav></tab-nav>
        <!-- 船详情 -->
        <ship-detail
        v-if="dialogTableVisible"
        :dialogTableVisible='dialogTableVisible'
        :isSetCenter = 'isSetCenter'
        :shipImo = "shipImo"
        :portInquirys ='portInquiryshow'
        :beforeClose='closeDliago'
        ></ship-detail>
        <port-inquiry  :dialogPortVisible = 'portTableVisible' :beforeClose="portcloseDliago"></port-inquiry>
        <!-- <vessel-file   :beforeClose='filleVlessClose' :dialogFilleVisible='vesselFileVisible' :back="backDetailShow" ></vessel-file> -->
        <!-- <weather-tab @show="cweather" :tabV="tabshow" :beforeClose1="closeWeather"></weather-tab> -->

        <!--港口详情-->
        <port-lists-all v-if="portListAllVisible" :before-close="portClose">

        </port-lists-all>
        <!-- <hisrory-speed :speedVisible = 'speedVisible'></hisrory-speed> -->

         <!--侧边栏-->
        <side-nav></side-nav>

        <!-- <ship-hall ></ship-hall> -->
        <!-- 船盘大厅的列表的滚动条 -->
        <div class="small-search" ref='smallSearch'>
          <ship-plate-search :isSmall="true"></ship-plate-search>
          <scroll-text-bar class="ship-plate-scroll-bar" :beforeClick='showShipDetails' :items='allShipPlateList.datas' v-if="allShipPlateList && allShipPlateList.datas && path.search('shipPlate') === -1">
          </scroll-text-bar>
        </div>
        <div style="z-index: 1">
           <router-view :key="key"></router-view>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
// import _ from 'lodash'
import olMap from '@/views/routemap/map'
// import 'ol/ol.css';
import { formatDegree } from '@/utils'
import '../../../../static/lib/leaflet/Control.MiniMap.css'
import store from '@/store'
import tabNav from './tabNaver'
import ShipDetail from '@/views/routemap/shipDetail/index'
import portInquiry from '@/views/routemap/portInquiry/index'
import sideNav from './tabSide'
import shipHall from '@/views/shipHall/index'
import shipPlateSearch from '@/views/shipPlateSearch/index'
import minNav from './tabMin'
// import vesselFile from '@/views/routemap/vesselFile/index'
// import weatherTab from '@/views/routemap/shipDetail/weatherSearch'
import ScrollTextBar from '@/components/ShipPlateDetail/scrollTextBar'
import portListsAll from '@/views/routemap/portListsAll/index'
import {
  mapGetters
} from 'vuex'
import { findShipPlateDetailByShip } from '@/api/shipHall'
export default {
  components: {
    tabNav,
    ShipDetail,
    sideNav,
    shipHall,
    shipPlateSearch,
    portInquiry,
    minNav,
    ScrollTextBar,
    portListsAll
  },
  name: 'AppMain',
  data() {
    return {
      path: this.$route.path,
      mapHeight: window.innerHeight,
      dialogTableVisible: false,
      portTableVisible: false,
      // vesselFileVisible: false,
      speedVisible: true,
      tabshow: false,
      portListAllVisible: false,
      settingShow: false,
      mapLat: '',
      mapLng: ''
    }
  },
  watch: {
    shipImo: function(newValue, oldValue) {
      const minIDIndex = this.minimizeWindows.findIndex(item => item.imo === newValue)
      if (newValue && newValue !== oldValue) {
        this.dialogTableVisible = true
      } else {
        this.dialogTableVisible = false
      }
      if (minIDIndex !== -1) {
        this.minimizeWindows[minIDIndex].zoomAction()
        this.minimizeWindows.splice(minIDIndex, 1)
        this.dialogTableVisible = true
      }
      // this.dialogTableVisible = false
      // setTimeout(() => {
      //   this.dialogTableVisible = true
      // }, 100)
    },
    settingPageVisible: function(newValue, oldValue) {
      if (newValue !== null) {
        this.settingShow = true
      }
    },
    $route(to, from) {
      this.path = this.$route.path
      if (to.name !== 'portSearch') {
        this.portListAllVisible = false
      }
    },
    portListAll(newValue, oldValue) {
      this.portListAllVisible = true
    }
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    ...mapGetters([
      'permission_routers',
      // 'sidebar',
      'allbackNew',
      'shipImo',
      'shipHallSearch',
      'allShipPlateList',
      'isSetCenter',
      'portListAll',
      'settingPageVisible',
      'minimizeWindows'
    ])
  },
  methods: {
    // 关闭详情
    closeDliago() {
      olMap.ship = null
      olMap.currentSearchIMO = null
      olMap.removeCurrentMarker()
      this.dialogTableVisible = false
      store.dispatch('setImo', null)
      olMap.historyMarkerBlean = false
      olMap.initShip = true
      olMap.removeShipHistoryMarker()
      olMap.removeShipHistoryLine()
      // olMap.initial()
      // olMap.mapView.setZoom(8)
      olMap.LazyLoadShip()
    },
    // 显示船舶的详情
    showShipDetails(index) {
      findShipPlateDetailByShip({ uuid: this.allShipPlateList.datas[index].uuid }).then(response => {
        if (response && response.data && response.data.datas) {
          this.$router.push({ name: 'shipPlateMap', query: { uuid: this.allShipPlateList.datas[index].uuid, source: 'ship' }})
        }
      })
    },
    // 显示港口的详情
    portInquiryshow() {
      this.portTableVisible = true
    },
    // 关闭港口的详情
    portcloseDliago() {
      this.portTableVisible = false
    },
    // 返回按钮
    backDetailShow() {
      this.vesselFileVisible = false
      this.dialogTableVisible = true
    },
    // 显示天气
    weatherShow() {
      this.tabshow = true
    },
    // 关闭天气
    closeWeather() {
      this.tabshow = false
    },
    portClose(done) {
      this.portListAllVisible = false
      done()
    },
    cweather(data) {
      this.tabshow = false
    },
    settingPageClose() {
      store.dispatch('settingPageVisible', null)
      this.settingShow = false
    }
  },
  mounted() {
    /**
     * 初始化时设置map容器的高度，因为受css100%异常影响，
     * mpa容器默认取不到高度，
     * 因此需要js获取当前窗口的高度，并减去容器的上偏移
     * @return {Number}
     */
    const mapInnerHeight = () => {
      if (this.$refs.mapBox) {
        return window.innerHeight - this.$refs.mapBox.offsetTop
      }
    }
    this.mapHeight = mapInnerHeight()
    if (!this.allShipPlateList) {
      this.$store.dispatch('allShipPlateList').then((data) => {
      })
    }
    window.onresize = () => {
      this.mapHeight = mapInnerHeight()
    }
    olMap.initMap('map-main')
    const obj = {
      portShow: 'Y',
      shipType: ['VLCC', 'ULCC', 'SUEZMAX', 'AFRAMAX'],
      loadType: [1, 2, 3, 4]
    }
    this.$store.dispatch('getBackNew', obj).then((data) => {
      if (!this.allbackNew) return
      olMap.shipPlateN = this.allbackNew.shipsN
      olMap.shipPlateY = this.allbackNew.shipsY
      olMap.portLists = this.allbackNew.ports
      if (this.allbackNew.ports !== null) {
        olMap.initPort()
      }
      // if (!this.$route.query.imo) {
      //   olMap.initial()
      // }
      olMap.initial()
    }).catch(() => {
      // this.loading = false
    })
    if (this.$route.query.imo && !this.$route.query.mmsi) {
      store.dispatch('setImo', this.$route.query.imo)
    }

    olMap.mapView.on('mousemove ', (e) => {
      this.mapLat = e.latlng.lat > 0 ? formatDegree(e.latlng.lat) + 'N' : formatDegree(-e.latlng.lat) + 'S'
      this.mapLng = e.latlng.lng > 0 ? formatDegree(e.latlng.lng) + 'E' : formatDegree(-e.latlng.lng) + 'W'
    })
  },
  destroyed() {
    store.dispatch('setImo', null)
  }
}
</script>
<style >
.Full-laden{
  fill:rgb(41, 249, 47);stroke:rgb(41, 249, 47);stroke-width:2;
}
.Full-ladenN{
fill:transparent;stroke:rgb(41, 249, 47);stroke-width:2;
}
.Null-laden{
  fill:rgb(255, 238, 53);stroke:rgb(255, 238, 53);stroke-width:2;
}
.Null-ladenN{
  fill:transparent;stroke:rgb(255, 238, 53);stroke-width:2;
}
.cuurent-active-imo {
  stroke:#ff5c00
}
.Full-laden:hover,.Full-ladenN:hover,.Null-laden:hover,.Null-ladenN:hover path{
  stroke: #ff5c00;
}
.leaflet-touch .leaflet-control-layers, .leaflet-touch .leaflet-bar {
    margin-top: 60px !important;
}
.leaflet-bottom .leaflet-control-minimap {
  margin-bottom: 40px !important;
}
.cuurent-port-ship-icon{
  margin-left: -11px !important;
  margin-top: -32px !important;
}
.cuurent-port-ship-icon:hover path{
  stroke: #0353a7;
  fill: #0353a7;
}
.small-search {
 position:absolute;
 left: 534px;
 top:60px;
 width:766px;
 height:38px;
 z-index: 1;
 color: #fff;
 background:rgba(33,33,33,0.80);
}
.language-en .small-search {
 left: 661px;
}
.ship-plate-scroll-bar {
  position: relative;
  z-index: 1;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: rgba(33,33,33,0.80);
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
  border-radius: 0 0 2px 2px;
  color: #fff;
  font-size: 12px;
  padding: 0 7px 0 10px;
}
.el-message-box{
  background-color: rgba(0, 0, 0, 0.65);
}
.el-message-box__message p {
  color: #fff;
}
.el-message-box__title{
  color: #fff;
}
.el-button--primary{
  background-color: #FFCC00;
  border: none;

}
.el-button--primary:hover, .el-button--primary:focus{
  background-color: #ffa701;
  border: none;
}
.el-button--primary:active{
  background-color: #ffa701;
  border: none;
}
.map-mouseover-style{
  position: absolute;
  top:200px;
  left: 100px;
  width: 88px;
  height: 52px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}
</style>
