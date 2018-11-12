<template>
    <!--  -->
    <div class="">
      <map-dialog ref="myDetail" class="detail"
      :visible.sync='dialogTableVisible'
      :drag='1'
      self-class="maxIndex"
      :shipImo='shipImo'
      :beforeClose='beforeClose'
      :left="leftHeight"
      :top="topHeight"
      :minimize='tabIndex === 1 ?  minimize : false '
      :minimize-pramas='minimizePramas'
      :before-minimize="miniClose"
      :width="isI18n ? '504px' : '631px'">
      <template slot="title" v-if="tabIndex === 1">
          <div class="detail_title">
            <el-row :gutter="20">
              <el-col :span="11" class="detail_title-text"><div class="">{{tableInfo.shipName}}</div></el-col>
              <el-col :span="12" class="detail_title-icon">
                <span class="mr-l-15 icon_detail" :title="$t('detail.weatherIcon')" @click="weatherSearch">
                  <svg-icon class="font16" icon-class="tianqi" />
                  {{$t('publics.weathers')}}
                </span>
                <span v-if="attention === '0'" class="mr-l-20 icon_detail" :title="$t('detail.fleet')" @click="addFleets" >
                  <svg-icon class="font16" icon-class="guanzhu" />
                  {{$t('publics.favorites')}}
                </span>
                <span v-if="attention === '1'" class="mr-l-20 icon_detail" :title="$t('detail.delete')" @click="removeFleets" >
                  <svg-icon class="font16" style="color:#FFA900;" icon-class="guanzhu" />
                  {{$t('detail.delete')}}
                </span>
              </el-col>
            </el-row>
          </div>
        </template>
        <template slot="title" v-if="tabIndex === 2">
          <div class="detail_title">
            <el-row :gutter="20">
            <el-col :span="11" class="detail_title-text">
              <span>
                <a href="javascript:;" @click="backDetail()">
                  <svg-icon class="font14"  style="transform: rotate(90deg);" icon-class="xiangxiajiantou" />
                </a>
              </span>
              <span class="mr-l-10">
                  <svg-icon class="font18" style="color:#ffa900" icon-class="chuanbodangan" />
              </span>
              <span class="mr-l-5" >
                {{$t('vlessfile.dalogName')}}
              </span>
            </el-col>
          </el-row>
          </div>
        </template>
        <div  v-if="tabIndex === 1" class="detail">
          <el-row :gutter="20" style="margin-top:4px">
            <el-col :span="11" class="mr-l-20  font12" style="color:#C8C8C8"><span class="">{{tableInfo.IMO}}</span><span class="font16">·</span><span>{{tableInfo.shipType}}</span></el-col>
          </el-row>
          <div class="detail-content">
          <el-row >
            <el-col class="line-option" v-for="item in Object.keys(list.group) " :key="item.imo" :span="12">
              <div class="grid-content bg-purple">
                <el-col :span="9" class="name">
                 {{$t('detail.group.' + item )}}:
                </el-col>
                <el-col :span="13" class="table-rignt">
                <span v-if='item =="displayCountryCn"'>
                  {{isI18n ? tableInfo['displayCountryCn'] : tableInfo['displayCountryEn']}}
                  <span class="flag-icon" :class="tableInfo.country">
                  </span>
                </span>
                <span v-if='item !=="displayCountryCn"'>
                   {{isI18n ? tableInfo[item] : arrEn.findIndex(i => i == item ) > -1 ? tableInfo[item + 'En'] : tableInfo[item]}}
                </span>
                </el-col>
              </div>
            </el-col>
          </el-row>
           <el-row >
            <el-col  class="line-option" v-for="item in Object.keys(list.group1) "  :key="item.imo" :span="12">
              <div class="grid-content bg-purple">
                <el-col :span="9"  class="name">
                 {{$t('detail.group1.' + item )}}:
                </el-col>
                <el-col :span="13" class="table-rignt">
                  <span v-if="item == 'SDWT'">
                    {{tableInfo[item] | numFormat}}Mt
                  </span>
                  <span v-else>
                     {{tableInfo[item]}}
                  </span>
                </el-col>
              </div>
            </el-col>
          </el-row>
           <el-row >
            <el-col  class="line-option"  v-for="item in Object.keys(list.group2) "  :key="item.imo" :span="12">
              <div class="grid-content bg-purple">
                <el-col :span="9"  class="name">
                 {{$t('detail.group2.' + item )}}:
                </el-col>
                <el-col :span="13" class="table-rignt">
                  <span v-if='item =="loadCn"'>
                  {{isI18n ? tableInfo['loadCn'] : tableInfo['loadEn']}}
                  </span>
                <span v-if='item !=="loadCn"'>
                  <span v-if='item =="shipSpeed"'>
                    {{isI18n ? tableInfo[item]+'节' :tableInfo[item]+'Knots' }}
                  </span>
                   <span v-else-if='item =="shipWaterline"'>
                     {{tableInfo[item]}}m
                  </span>
                   <span v-else-if='item =="shipFullWaterline"'>
                     {{tableInfo[item]}}m
                  </span>
                   <span v-else>
                     {{isI18n ? tableInfo[item] : arrEn.findIndex(i => i == item ) > -1 ? tableInfo[item + 'En'] : tableInfo[item]}}
                  </span>
                </span>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row >
            <el-col class="lh32" :span="24">
              <div class="grid-content bg-purple">
                <el-col :span="4"  class="name">
                 {{$t('detail.timeRange')}}:
                </el-col>
                <el-col :span="19">
                <div class="time">
                <span class="d1-time-cpm d1-time-cpm1">
                  <el-date-picker v-model="startTime"  format="yyyy-MM-dd HH:mm" class="timeP1" size="small" type="datetime"
                    placeholder="选择日期" :picker-options="pickerOptionsTyphoon1" >

                  </el-date-picker>
                </span>
              </div>
              <em class="sr-lineb">-</em>
              <div class="time">
                <span class="d1-time-cpm d1-time-cpm1">
                  <el-date-picker  v-model="endTime"  class="timeP1" size="small" format="yyyy-MM-dd HH:mm" type="datetime"
                    placeholder="选择日期" :picker-options="pickerOptionsTyphoon2" >

                  </el-date-picker>
                </span>

              </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
          </div>
        </div>
      <vessel-file v-if="tabIndex === 2" ></vessel-file>
    <template slot="footer" v-if="tabIndex === 1">
    <div class="footButton">
      <el-button type="warning" size="small" v-show='btnshow' v-text="$t('detail.voyageHistory')" @click="trajectoryQuery"></el-button>
      <el-button type="info" size="small" v-show='!btnshow' v-text="$t('detail.clearvoyageHistory')" @click="cleartrajectoryQuery"></el-button>
      <el-button type="warning" class="mr-l-10" size="small"  v-text="$t('detail.portCalling')"  @click="portInquiry"></el-button>
      <el-button type="warning" class="mr-l-10" size="small"  v-text="$t('detail.vesselFile')"  @click="vessfileshow"></el-button>
      <el-button type="warning" class="mr-l-10" size="small"  v-text="$t('detail.routeSpeed')" @click="lineSpeed" ></el-button>
      <el-button type="warning" class="mr-l-10" size="small" v-show='isShipPlate == 1' v-text="$t('detail.vesselDetails')" @click="plateDetail"></el-button>
    </div>
    <div class="footTips">
      <span v-text="$t('detail.tipText')"></span>
    </div>
    </template>

    </map-dialog>
  <!-- v-if= 'dialogTableVisible' shiImo='shiImo' beforeClose = 'beforeClose' left="20px" top="94px" width='504px' -->

  <weather-tab ></weather-tab>
  <!-- <weather-tab  :beforeClose1="closeWeather" :lat="detailLAT" :lng="detailLNG"></weather-tab> -->
</div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    vessel,
    shipLine,
    addFleet,
    unfollowFleet,
    shipinfo
  } from '@/api/routemap'
  // import {
  //   isI18n
  // } from '@/lang/index'
  import _ from 'lodash'
  // import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import vesselFile from '@/views/routemap/vesselFile/index'
  import tableKey from '@/lang/zh/shipDetail'
  import '@/styles/flag-icon.css'
  import Map from '@/views/routemap/map'
  import weatherTab from '@/views/routemap/shipDetail/weatherSearch'
  import store from '@/store'
  import i18n from '@/lang'
  export default {
    components: {
      mapDialog,
      weatherTab,
      vesselFile
    },
    name: 'dragDialog-demo',
    // directives: {
    //   elDragDialog
    // },
    props: {
      // shipImo: null,
      dialogTableVisible: {
        type: Boolean
      },
      beforeClose: {
        type: Function
      },
      portInquirys: {
        type: Function
      },
      vesselfile: {
        type: Function
      },
      weatherShow: {
        type: Function
      },
      isSetCenter: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters([
        'shipImo',
        'deleteImo',
        'shipHallFile'
        // isI18n: language === 'zh'
      ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    data() {
      return {
        list: {
          group: tableKey.group,
          group1: tableKey.group1,
          group2: tableKey.group2
        },
        minimizePramas: {
          title: i18n.t('detail.miniTitle'),
          zoomAction: () => {
            store.dispatch('setImo', this.tableInfo.IMO)
          }
        },
        oldData: [],
        tabIndex: 1,
        weatherDataShow: true,
        minimize: true,
        tableInfo: {},
        arrEn: ['destination', 'shipCondition', 'displayCountryCn', 'loadCn', 'nowSeaArea', 'shipCondition', 'shipInitial', 'nowSeaArea'],
        portTableVisible: '',
        startTime: new Date(new Date() - 7 * 24 * 3600 * 1000),
        endTime: new Date(new Date()),
        btnshow: true,
        isShipPlate: 0,
        // dataShow: false,
        topHeight: '',
        leftHeight: '20px',
        detailLAT: '',
        detailLNG: '',
        rotation: '',
        attention: null,
        pickerOptionsTyphoon2: {
          disabledDate: (time) => {
            if (this.startTime.getTime()) {
              return time.getTime() > Date.now() || time.getTime() < this.startTime.getTime()
            }
          }
        },
        pickerOptionsTyphoon1: {
          disabledDate: (time) => {
            if (this.endTime) {
              const curDate = (new Date()).getTime()
              const three = 90 * 24 * 3600 * 1000
              const threeMonths = curDate - three
              return time.getTime() > Date.now() || time.getTime() < threeMonths
            }
          }
          // shiImo:'',
          // dialogTableVisible:true
        }
      }
    },
    watch: {
      // 监听路由
      $route(to, from) {
        this.initTop()
        this.dataShow = false
        store.dispatch('setImo', null)
        if (Map.ShipHistory) {
          this.cleartrajectoryQuery()
        }
        Map.removeCurrentMarker()
        Map.currentSearchIMO = null
      },
      // imo号
      shipImo(n, o) {
        this.oldData.length = 0
        this.shipvessel()
        if (Map.ShipHistory) {
          this.cleartrajectoryQuery()
        }
        // Map.removeShipHistoryMarker()
        // this.weatherDataShow = false
      },
      // 删除imo
      deleteImo(n, o) {
        if (n === this.tableInfo.IMO) {
          this.attention = '0'
          store.dispatch('deleteImo', null)
        }
      }
    },
    methods: {
      // 返回船盘详情按钮
      backDetail() {
        this.tabIndex = 1
      },
      // 船详情数据
      shipvessel() {
        if (!_.isEmpty(this.shipImo)) {
          var obj = {
            imo: this.shipImo
          }
          vessel(obj).then(response => {
            if (response && response.data && response.data.features.length) {
              // this.dataShow = true
              const data = response.data.features[0].properties
              // if (this.isSetCenter) {
              if (Map.cirles.length > 0) {
                Map.removeCirleMarker()
              }
              const L = window.L
              if (data.lat) {
                // if (Map.mapView.getZoom() < 8) {
                //   Map.mapView.setZoom(8)
                // }
                Map.removeCurrentMarker()
                Map.currentSearchIMO = obj.imo
                this.detailLAT = data.lat
                this.detailLNG = data.lng
                this.rotation = data.rotation
                this.attention = String(data.attention)
                Map.ship = {
                  imo: data.shipMessage.IMO,
                  lat: data.lat,
                  lng: data.lng,
                  heading: data.rotation,
                  isShipPlate: data.attention, // 船盘状态
                  loadEn: data.loadEn
                }
                // Map.mapView.setView(L.latLng(data.lat, data.lng),7,{ animate: false })
                // setTimeout(() => {
                Map.mapView.setView(L.latLng(data.lat, data.lng), 8)
                Map.notDrap = true
                // Map.mapView.setZoom(7)
                Map.LazyLoadShip(() => Map.addCurrentMarker(data.lat, data.lng, data.rotation))
                // }, 200)
              } else {
                console.warn(this.shipImo + ' No latitude and longitude')
              }
              this.tableInfo = data.shipMessage
              this.isShipPlate = data.isShipPlate
            }
          })
        } else {
          return false
        }
      },
      // 靠港查询
      portInquiry() {
        const reachPort = {
          imo: this.tableInfo.IMO,
          startTime: this.startTime,
          endTime: this.endTime,
          lat: this.detailLAT,
          lng: this.detailLNG,
          mmsi: this.tableInfo.MMSI
        }
        store.dispatch('shipInfos', reachPort)
        this.portInquirys()
      },
      // 船舶档案
      vessfileshow() {
        const reachPort = {
          imo: this.tableInfo.IMO,
          mmsi: this.tableInfo.MMSI
        }
        store.dispatch('shipHallFile', reachPort).then((data) => {
          if (!_.isEmpty(this.shipHallFile) && !_.isEmpty(this.shipHallFile.datas) && this.shipHallFile.datas) {
            this.tabIndex = 2
          } else {
            this.$alert(i18n.t('commonRemind.noMessage'), i18n.t('history.prompt'))
          }
        }).catch(() => {
          // this.loading = false
        })
        // this.vesselfile()
        // // this.$refs.myDetail.left
      },
      // 船舶轨迹
      trajectoryQuery(imo) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        var start = new Date(this.startTime).getTime()
        var end = new Date(this.endTime).getTime()
        if (start < end) {
          Map.historyMarkerBlean = true
          const obj = {
            'startTime': start,
            'endTime': end,
            'imo': this.tableInfo.MMSI
          }
          shipLine(obj).then(response => {
            if (!_.isEmpty(response.data.point)) {
              loading.close()
              Map.addShipline(response.data.point)
              this.oldData = response.data.point
              shipinfo(response.data.uuid).then(res => {
                Map.removeShipHistoryMarker()
                Map.removeShipHistoryLine()
                if (this.oldData.length) {
                  const arrDate = []
                  this.oldData.map((item, index) => {
                    arrDate.push({
                      ...item,
                      ...res.data[item.idx]
                    })
                  })
                  Map.addShipline(arrDate)
                }
              })
              this.btnshow = false
            } else {
              loading.close()
              this.$alert(i18n.t('commonRemind.noMessage'), '')
            }
          })
        } else {
          this.$alert(i18n.t('commonRemind.timeTips'), '')
        }
      },
      // 清除轨迹
      cleartrajectoryQuery() {
        this.oldData.length = 0
        Map.ShipHistory = false
        const L = window.L
        Map.mapView.setView(L.latLng(this.detailLAT, this.detailLNG), 7)
        Map.addCurrentMarker(this.detailLAT, this.detailLNG)
        this.weatherDataShow = false
        this.btnshow = true
        Map.historyMarkerBlean = false
        Map.initShip = true
        Map.removeShipHistoryMarker()
        Map.removeShipHistoryLine()
        Map.initial()
      },
      // 弹窗动态位置
      initTop() {
        if (this.$route.name === 'ship') {
          this.topHeight = '145px'
        } else {
          this.topHeight = '104px'
        }
      },
      // 航速航线
      lineSpeed() {
        const MMIS = this.tableInfo.MMSI
        const zone = this.tableInfo.zone
        this.$router.push({ name: 'shipLine', params: { MMSI: MMIS, zone: zone, lat: this.detailLAT, lng: this.detailLNG }})
      },
      // 添加船队
      addFleets() {
        const obj = {
          imo: this.tableInfo.IMO,
          mmsi: this.tableInfo.MMSI
        }
        if (this.tableInfo.IMO !== '' && this.tableInfo.MMSI !== '') {
          addFleet(obj).then(response => {
            if (response.data.status === 0) {
              this.attention = '1'
              this.$store.dispatch('setqueryFleets').then((data) => {}).catch(() => {})
            }
          })
        } else {
          this.$alert(i18n.t('commonRemind.fleetEror'), '', {
            confirmButtonText: i18n.t('history.confirm')
          }).then(() => {
            this.$router.push({ name: 'ship' })
          })
        }
      },
      // 移除船队
      removeFleets() {
        const obj = {
          imo: this.tableInfo.IMO,
          mmsi: this.tableInfo.MMSI
        }
        unfollowFleet(obj).then(response => {
          if (response.data.status === 0) {
            this.attention = '0'
            this.$store.dispatch('setqueryFleets').then((data) => {}).catch(() => {})
          }
        })
      },
      // 天气查询
      weatherSearch() {
        const reachPort = {
          time: this.startTime,
          lat: this.detailLAT,
          lng: this.detailLNG
        }
        store.dispatch('setWeatherShow', reachPort)
        // this.tabShow = true
        // this.weatherShow()
      },
      // 船盘详情
      plateDetail() {
        this.$router.push({ name: 'shipPlateMap', query: { imo: this.tableInfo.IMO, mmsi: this.tableInfo.MMSI, source: 'ship?imo=' + this.tableInfo.IMO }})
      },
      // mini按钮
      miniClose() {
        this.beforeClose()
        store.dispatch('setImo', null)
        this.minimizePramas = Object.assign({}, this.minimizePramas, {
          imo: this.tableInfo.IMO,
          zoomAction: () => {
            store.dispatch('setImo', this.tableInfo.IMO)
          }
        })
        this.$store.dispatch('minimizeWindows', this.minimizePramas)
      }
    },
    mounted() {
      this.initTop()
      this.shipvessel()
    }
    // destroyed() {
    //   store.dispatch('setImo', null)
    // }
  }
</script>
<style>
.detail_title{
  padding-top: 10px;
}
.detail_title .detail_title-text {
  margin-left: 20px;
  /* color: #008CD2; */
  font-size: 16px;
  font-weight: 600;
}
.detail_title .detail_title-icon {
  font-size: 12px;
}
.detail-content{
  margin:18px 0 0 20px;
  font-size: 12px;
}
  .el-dialog__body {
    padding: 0px;
    color: #606266;
    line-height: 24px;
    font-size: 14px;
  }
  .time {
    display: inline-block;
  }
  .time_range {
    display: inline-block;
  }
  .timeP1 {
    width: 176px !important;
    height: 30px;
  }
  .timeP1 input {
    background-color: rgba(33, 33, 33, 0.1);
    color: rgb(229, 229, 229);
    padding-right: 30px;
    border: 1px solid #DADADA;
    font-size: 12px;
  }
  .timeP1 .el-input--suffix .el-input__inner {
    padding-right: 5px;
}
  .timeFrame .timeD {
    width: 90px;
    display: inline-block;
    text-align: right;
  }

  .footTips {
    margin-top: 10px;
  }

  .footTips span {
    font-size: 12px;
    color: #c8c8c8;
    /* color: #fff; */
    padding-bottom: 10px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .detail .el-row {
    color: #fff;
  }
  .el-row:nth-child(3) {
    border-bottom: none;
  }
  .el-row:nth-child(4) {
    border-bottom: none;
  }
  .el-row .name {
    color: #C8C8C8;
    text-align: left;
    padding-right: 10px;
  }
  .table-rignt{
    color: #fff;
    padding-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bascicon{
   font-size: 20px;
  }
  .footer{
    color: #fff
  }
  .detail .line-option{
    height: 24px;
    line-height: 24px;
  }
  .detail .icon_detail{
    cursor: pointer;
  }
.detail .el-button + .el-button {
    margin-left: 0px;
}
/* .footButton .el-button{
    font-size: 14px;
} */
</style>
