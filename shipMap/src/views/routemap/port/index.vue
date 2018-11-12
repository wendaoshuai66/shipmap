<template>
  <div class="portSearch">
    <tips :width="isLanguageZh ? '504px' : '631px'"
          v-if="tabShow"
          left="20px"
          top="99px"
          :minimize='minimize'
          :minimize-pramas='minimizePramas'
          :before-minimize="minClose"
          :before-close="handleClose"
          :visible.sync='isShow'>
      <template slot="tipsContent">
        <div class="out-history-list">
          <ul class="history-search-list">
            <li class="select">
              <div class="block">
                <span class="demonstration">{{$t(`portSearch.content.portName`)}}：</span>
                <el-select v-if="searchList !== '0'" v-model="fromPort"  :placeholder="$t(`lineSpeed.table.port`)">
                  <el-option else
                    v-for="(item,index) in chinaPorts"
                    :key="item.portNameEn+index"
                    :label="isLanguageZh ? item.portName : item.portNameEn"
                    :value="item.portNameEn">
                  </el-option>
                </el-select>
                 <el-select v-if="searchList === '0'" v-model="fromPort"  :placeholder="$t(`lineSpeed.table.port`)">
                  <el-option
                    v-for="(item,index) in allPorts"
                    :key="item.portNameEn+index"
                    :label="isLanguageZh ? item.portName : item.portNameEn"
                    :value="item.portNameEn">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="select">
              <div class="block">
                <span class="demonstration">{{$t(`portSearch.content.searchList`)}}：</span>
                <el-radio-group v-model="searchList" @change="portOptions">
                  <el-radio v-for="(item,index) in listoPtion" :key="index" :label="$t(`portSearch.content.portList[${index}].text`)" >{{$t(`portSearch.content.portList[${index}].Currently`)}}</el-radio>
                </el-radio-group>
              </div>
            </li>
            <li class="select" v-if=" searchList === '2' ">
              <div class="block">
                <span class="demonstration">{{$t(`portSearch.content.timezone`)}}：</span>
                <span>
                  <el-date-picker v-model="startTime"  format="yyyy-MM-dd HH:mm" class="timeP1" size="small" type="datetime"
                    :placeholder="$t(`history.chooseDate`)" :picker-options="pickerOptionsTyphoon4">
                  </el-date-picker>
                  <em>-</em>
                  <el-date-picker v-model="endTime"  format="yyyy-MM-dd HH:mm" class="timeP1" size="small" type="datetime"
                    :placeholder="$t(`history.chooseDate`)" :picker-options="pickerOptionsTyphoon2">
                  </el-date-picker>
                </span>
              </div>
            </li>
            <li class="select" v-if=" searchList === '1' ">
              <div class="block">
                <span class="demonstration">{{$t(`portSearch.content.timezone`)}}：</span>
                <span>
                  <el-date-picker v-model="startTimeE"  format="yyyy-MM-dd HH:mm" class="timeP1" size="small" type="datetime"
                   :placeholder="$t(`history.chooseDate`)" :picker-options="pickerOptionsTyphoon1">

                  </el-date-picker>
                  <em>-</em>
                  <el-date-picker v-model="endTimeE"  format="yyyy-MM-dd HH:mm" class="timeP1" size="small" type="datetime"
                    :placeholder="$t(`history.chooseDate`)" :picker-options="pickerOptionsTyphoon3">
                  </el-date-picker>
                </span>
              </div>
            </li>
            <li>
              <div class="block">
                <span class="demonstration">{{$t(`history.vesselType`)}}：</span>
                <el-checkbox-group v-model="sizeType">
                  <el-checkbox label="VLCC"></el-checkbox>
                  <el-checkbox label="SUEZMAX"></el-checkbox>
                  <el-checkbox label="AFRAMAX"></el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li class="input">
              <div class="block">
                <span class="demonstration">DWT：</span>
                <span>
                  <el-input v-model="dwtMinValue" :placeholder="$t(`history.enterPlease`)"></el-input>
                  -
                  <el-input v-model="dwtMaxValue" :placeholder="$t(`history.enterPlease`)"></el-input>
                  MT
                </span>
              </div>
            </li>
            <li v-if=" searchList === '1' ">
              <div class="block" >
                <span class="demonstration">{{$t(`portSearch.content.Routestate`)}}：</span>
                <el-checkbox-group v-model="naviStatus">
                  <el-checkbox label="1">{{$t(`portSearch.content.static`)}}</el-checkbox>
                  <el-checkbox label="2">{{$t(`portSearch.content.Sail`)}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li>
              <div class="port-box">
                <el-button size="small" type="warning" @click="searchShips">{{$t('history.search')}}</el-button>
                <el-button :disabled="fromPort === ''" size="small" @click="portQueueListDate()"  type="info">{{$t('portSearch.content.button')}}</el-button>
                <!-- <el-button else size="small"  type="info" disabled>{{$t('portSearch.content.button')}}</el-button> -->
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="reminder">
          提示：为了使您获得最佳的查询航速航线体验，建议使用谷歌浏览器
        </div> -->
      </template>
    </tips>
    <map-dialog  v-if="dataShow"
    class="port-search-dialog"
    :visible.sync='dataShow'
    :drag='1'
    :drop='1'
    :minimize='minimize1'
    :minimize-pramas='minimizePramas1'
    :before-minimize="minHide1"
    :before-close="handleClose1"
    :is-minimize-pramas="false"
    width='934px'
    minWidth='934px'
    minHeight="150px"
    top="400px"
    left='300px'>
      <template slot="title">
        <div class="history-line-record">
          <div class="record-title">
            <svg-icon class="setting" icon-class="sousuo" />
            <span class="record" v-if="titleList === 0">{{$t(`portSearch.content.portList[0].Currently`)}}</span>
            <span class="record" v-if="titleList === 1">{{$t(`portSearch.content.portList[1].Currently`)}}</span>
            <span class="record" v-if="titleList === 2">{{$t(`portSearch.content.portList[2].Currently`)}}</span>
            <span class="record-word">{{$t(`history.altogether`)}}</span>
            <span class="record-num">{{dataList.length}}</span>
            <span class="record-word">{{$t(`commonRemind.shipNumber`)}}</span> &nbsp;,&nbsp;
            <span class="record-word">{{$t(`portSearch.content.allWeight`)}}</span>
            <span class="record-num">{{addsWt | numFormat}}</span>
            <span class="record-word">{{$t(`commonRemind.ton`)}}</span>
          </div>
          <div class="record-title btn-box">
            <a :href="downloadUrl">{{$t(`history.exportData`)}}</a>
          </div>
        </div>
      </template>
      <div class="port-inquiry-content">
      <el-table v-if='showFlagOfTable'
        :data="dataList"
        @row-click="posiyionlat"
        border
        maxHeight="234"
        style="width: 100%;height:100%">
        <el-table-column
          type="index"
          v-bind:label="$t('portSearch.tableList.No')"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="shipName"
          v-bind:label="$t('portSearch.tableList.shipName')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="imo"
          v-bind:label="$t('portSearch.tableList.imo')"
          width="120"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="mmsi"
          v-bind:label="$t('portSearch.tableList.mmsi')"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column v-if="titleList === 0"
          :prop="isLanguageZh ? 'sizeTypeCn' : 'sizeTypeEn'"
          v-bind:label="$t('portSearch.tableList.sizeType')"
          width="160"
          align="center"
          show-overflow-tooltip
          >
          </el-table-column>
        <el-table-column v-if="titleList !== 0"
            :prop="isLanguageZh ? 'vesselSizeCn' : 'vesselSizeEn'"
            v-bind:label="$t('portSearch.tableList.sizeType')"
            width="160"
            align="center"
            show-overflow-tooltip
            >
        </el-table-column>
        <el-table-column
          prop="sdwt"
          v-bind:label="$t('portSearch.tableList.sdwt')"
          width="160"
          align="center"
          show-overflow-tooltip
          :formatter="numFormat"
          >
        </el-table-column>
        <!-- :formatter="dateFormat" -->
        <el-table-column
        prop="draft"
        v-bind:label="$t('portSearch.tableList.draft')"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column v-if="titleList !== 2"
        prop="draught"
        v-bind:label="$t('portSearch.tableList.draught')"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column v-if="titleList === 2"
        prop="draughtIn"
        v-bind:label="$t('portSearch.tableList.draught')"
        width="120"
        align="center">
        </el-table-column>
        <el-table-column v-if="titleList === 2"
        prop="draughtOut"
        v-bind:label="$t('portSearch.tableList.draughtOut')"
        :width="isLanguageZh ? 120 : 170"
        align="center">
        </el-table-column>
        <el-table-column v-if="titleList === 0"
        :prop="isLanguageZh ? 'fromPortCn' : 'fromPortEn'"
        v-bind:label="$t('portSearch.tableList.fromPort')"
        :width="isLanguageZh ? 130 :180"
        align="center">
        </el-table-column>
        <el-table-column v-if="titleList !== 0"
        :prop="isLanguageZh ? 'lastPortCn' : 'lastPortEn'"
        v-bind:label="$t('portSearch.tableList.fromPort')"
        :width="isLanguageZh ? 130 :180"
        align="center">
        </el-table-column>
        <el-table-column v-if="titleList === 0"
        prop="ata"
        v-bind:label="$t('portSearch.tableList.ata')"
        :width="200"
        align="center"
        :formatter="dateFormats">
        </el-table-column>
        <el-table-column v-if="titleList === 1"
        :width="200"
        v-bind:label="$t('portSearch.tableList.eta')"
        align="center">
          <template slot-scope="scope">
            <span>{{dateFormatTime(scope.row.eta)}}{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="titleList === 0"
        prop="berthDateTime"
        v-bind:label="$t('portSearch.tableList.berthTime')"
        :width="isLanguageZh ? 130 : 200"
        align="center">
        </el-table-column>
        <el-table-column
        prop="speed" v-if="titleList === 1"
        v-bind:label="$t('portSearch.tableList.Speed')"
        :width="isLanguageZh ? 130 : 200"
        align="center">
        </el-table-column>
        <el-table-column
        prop="receiveTime" v-if="titleList === 1"
        v-bind:label="$t('portSearch.tableList.rTime')"
        width="200"
        align="center"
        :formatter="dateFormats">
        </el-table-column>
        <el-table-column
        prop="atd" v-if="titleList === 2"
        v-bind:label="$t('portSearch.tableList.atd')"
        width="200"
        align="center"
        :formatter="dateFormats">
        </el-table-column>
        <el-table-column
        prop="ata" v-if="titleList === 2"
        v-bind:label="$t('portSearch.tableList.ata')"
        width="200"
        align="center"
        :formatter="dateFormats">
        </el-table-column>
        <!-- <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    </map-dialog >
    <port-list v-if="dataPortshow">
       <template slot="lists">
         <ul class="port-style-li">
           <li v-for="(item, index) in postLists" :key="index" @click="planDetail(index)">
             {{isLanguageZh ? item.protdateCn : item.protdate}}{{isLanguageZh ? item.portZh : item.portEh}}{{$t('portSearch.content.queuingPlan')}}
           </li>
         </ul>
         <!-- {{postLists[0].protdate}}{{postLists[0].portEn}}{{$t('portSearch.content.queuingPlan')}} -->
       </template>
    </port-list>
  </div>
</template>
<script>
  import tips from '../ui/tips/index'
  import moment from 'moment'
  import config from '@/config'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import portList from '@/views/routemap/portListsAll/portQueuing'
  import i18n from '@/lang'
  import Map from '../map.js'
  import _ from 'lodash'
  import { portslist, chinaPorts } from '@/api/routemap'
  import { portQueueList } from '@/api/mapInformation'
  import { mapGetters } from 'vuex'
  // import { parseTime } from '@/utils/index'
  export default {
    name: 'fleet',
    components: {
      tips,
      mapDialog,
      portList
    },
    data() {
      return {
        initPortName: '',
        initStatus: '',
        addsWt: 0,
        postLists: [],
        showFlagOfTable: false,
        dataPortshow: false,
        tabShow: true,
        searchList: '0',
        listoPtion: [0, 1, 2],
        startTime: new Date(new Date() - 30 * 24 * 3600 * 1000),
        endTime: new Date(new Date()),
        startTimeE: new Date(),
        endTimeE: new Date(new Date() - (-(24 * 30) * 60 * 60 * 1000)),
        dataList: [],
        fromPort: '',
        sizeType: ['VLCC'],
        naviStatus: ['1', '2'],
        titleList: 0,
        timeType: '1',
        dwtMaxValue: '',
        dwtMinValue: '',
        miniFlag: true,
        minimizePramas1: {
          title: i18n.t(`portSearch.content.portList[${this.titleList}].Currently`),
          routeName: '0',
          minId: '0',
          zoomAction: () => {
            this.dataList = this.currentPort.data
            this.titleList = 0
            this.miniFlag = true
            this.dataShow = true
          }
        },
        minimizePramas: {
          title: i18n.t('tabNav.tabList[2].text'),
          routeName: 'portSearch',
          zoomAction: () => {
            const timeDate = {
              'fromPort': this.fromPort,
              'searchList': this.searchList,
              'startTime': this.startTime,
              'endTime': this.endTime,
              'startTimeE': this.startTimeE,
              'endTimeE': this.endTimeE,
              'sizeType': this.sizeType,
              'dwtMaxValue': this.dwtMaxValue,
              'dwtMinValue': this.dwtMinValue,
              'naviStatus': this.naviStatus,
              'dataList': this.dataList
            }
            this.$store.dispatch('setPortName', timeDate)
            this.tabShow = true
            if (this.dataList.length > 0) {
              if (this.miniFlag) {
                this.dataShow = true
              }
            }
          }
        },
        pickerOptionsTyphoon1: {
          disabledDate: (time) => {
            if (this.endTimeE) {
              return time.getTime() < Date.now() || time.getTime() < this.endTime
            }
          }
        },
        pickerOptionsTyphoon2: {
          disabledDate: (time) => {
            if (this.startTime.getTime()) {
              return time.getTime() > Date.now() || time.getTime() < this.startTime.getTime()
            }
          }
        },
        pickerOptionsTyphoon3: {
          disabledDate: (time) => {
            if (this.startTimeE.getTime()) {
              const three = 60 * 24 * 3600 * 1000
              const threeMonths = Date.now() + three
              return time.getTime() < this.startTimeE.getTime() || time.getTime() > threeMonths
            }
          }
        },
        pickerOptionsTyphoon4: {
          disabledDate: (time) => {
            return time.getTime() >= this.endTime
          }
        },
        allPorts: [],
        chinaPorts: [],
        minimize: true,
        minimize1: true,
        downloadUrl: null,
        dataShow: false,
        isShow: true
      }
    },
    computed: {
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      },
      ...mapGetters([
        'currentPort',
        'expectedPorts',
        'historyPorts',
        'getPortName',
        'minimizeWindows'
      ])
    },
    watch: {
      currentPort(n, o) {
        this.titleList = 0
        this.minimizePramas1.minId = '0'
        this.dataList = this.currentPort.data
        this.showFlagOfTable = true
        this.dataShow = true
      },
      expectedPorts(n, o) {
        this.minimizePramas1.minId = '1'
        this.titleList = 1
        this.dataList = this.expectedPorts.data
        this.showFlagOfTable = true
        this.dataShow = true
      },
      historyPorts(n, o) {
        this.minimizePramas1.minId = '2'
        this.titleList = 2
        this.dataList = this.historyPorts.data
        this.showFlagOfTable = true
        this.dataShow = true
      }
    },
    mounted() {
      this.initPort()
      if (this.getPortName) {
        this.fromPort = this.getPortName.fromPort
        this.searchList = this.getPortName.searchList
        this.startTime = this.getPortName.startTime
        this.endTime = this.getPortName.endTime
        this.startTimeE = this.getPortName.startTimeE
        this.endTimeE = this.getPortName.endTimeE
        this.sizeType = this.getPortName.sizeType
        this.dwtMaxValue = this.getPortName.dwtMaxValue
        this.dwtMinValue = this.getPortName.dwtMinValue
        this.naviStatus = this.getPortName.naviStatus
        if (this.getPortName.dataList.length > 0) {
          this.dataList = this.getPortName.dataList
          this.dataShow = true
        }
      }
      if (this.$route.query.flag >= 0) {
        const newValue = this.$route.query
        this.tabShow = false
        if (newValue.flag === 0) {
          this.currentPortDate(newValue.portName)
        }
        if (newValue.flag === 1) {
          this.expectedPort(newValue.portName)
        }
        if (newValue.flag === 2) {
          this.historyPort(newValue.portName)
        }
      }
    },
    methods: {
      // 港口排队按钮
      portQueueListDate() {
        const obj = {
          pageNum: 1,
          pageSize: 5,
          protNameEn: this.fromPort,
          flag: 1
        }
        portQueueList(obj).then(response => {
          if (response && !_.isEmpty(response.data) && !_.isEmpty(response.data.datas)) {
            this.postLists = response.data.datas
            this.dataPortshow = true
          } else {
            this.$alert(i18n.t('commonRemind.portPlanTips'), '')
          }
        })
      },
      // 港口排队详情页
      planDetail(index) {
        this.$router.push({ name: 'informationDetails', params: { uuid: this.postLists[index].portId, key: this.postLists[index].protdate }})
      },
      // 最小化参数
      miniOptions(route, data, vxName, vxSet, datas, status) {
        this.$router.push({ name: route })
        setTimeout(() => {
          this.dataList = data
          this.$store.dispatch(vxName, { type: vxSet, data: datas })
          this.miniFlag = true
          this.showFlagOfTable = true
          this.dataShow = true
          this.titleList = status
        }, 0)
      },
      // table 最小化弹窗
      minHide1() {
        this.dataShow = false
        this.miniFlag = false
        switch (this.minimizePramas1.minId) {
          case '0':
            this.minimizePramas1 = Object.assign({}, this.minimizePramas1, {
              title: i18n.t(`portSearch.content.portList[0].Currently`),
              portName: this.fromPort,
              routeName: '0',
              minId: '0',
              zoomAction: () => {
                this.miniOptions('portSearch', this.currentPort.data, 'catchSetcuurentPort', 'CURRENT_PORT', this.currentPort, 0)
              }
            })
            break
          case '1':
            this.minimizePramas1 = Object.assign({}, this.minimizePramas1, {
              title: i18n.t(`portSearch.content.portList[1].Currently`),
              portName: this.fromPort,
              routeName: '1',
              minId: '1',
              zoomAction: () => {
                this.miniOptions('portSearch', this.expectedPorts.data, 'catchSetcuurentPort', 'EXPECTED_PORT', this.expectedPorts, 1)
              }
            })
            break
          case '2':
            this.minimizePramas1 = Object.assign({}, this.minimizePramas1, {
              title: i18n.t(`portSearch.content.portList[2].Currently`),
              portName: this.fromPort,
              routeName: '2',
              minId: '2',
              zoomAction: () => {
                this.miniOptions('portSearch', this.historyPorts.data, 'catchSetcuurentPort', 'HISTORY_PORT', this.historyPorts, 2)
              }
            })
            break
        }
        this.$store.dispatch('minimizeWindows', this.minimizePramas1)
      },
      // table数据格式化 yyyy-MM-DD HH:MM:SS
      dateFormats: function(row, column) {
        var date = row[column.property]
        if (date === undefined || _.isEmpty(date) || date === '-') {
          return '-'
        }
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      },
      // table数据格式化 小时
      dateFormatTime: function(date) {
        if (date === undefined || _.isEmpty(date)) {
          return ''
        }
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      },
      // 千分位格式化
      numFormat(row, column) {
        const value = row[column.property]
        if (!value) {
          return '0'
        }
        const intPart = Number(value).toFixed(0)
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        let floatPart = ''
        let value2Array = null
        if ((value.toString()).indexOf('.') !== -1) {
          value2Array = value.toString().split('.')
        } else {
          value2Array = []
        }
        if (value2Array.length === 2) {
          floatPart = value2Array[1].toString()
          if (floatPart === 0) {
            return intPartFormat
          } else {
            return intPartFormat + '.' + floatPart.slice(0, 2)
          }
        } else {
          return intPartFormat + floatPart
        }
      },
      changeMiniTItle(index) {
        this.minimizePramas1.title = i18n.t(`portSearch.content.portList[${index}].Currently`)
      },
      // 港口数据
      initPort() {
        portslist().then(response => {
          this.allPorts = response.data.datas
        })
        chinaPorts().then(response => {
          this.chinaPorts = response.data.datas
        })
      },
      // 当前在港数据
      currentPortDate(data) {
        Map.removeMap(Map.portShipMarkers)
        Map.removePortZoom()
        const obj = {
          dwtMaxValue: this.dwtMaxValue,
          dwtMinValue: this.dwtMinValue,
          portNameEn: data,
          sizeType: this.sizeType.toString()
        }
        this.$store.dispatch('setcuurentPort', obj).then((data) => {
          if (this.currentPort && !_.isEmpty(this.currentPort.data)) {
            if (this.isLanguageZh) {
              this.downloadUrl = `${config.localPath}api/export/now.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}`
            } else {
              this.downloadUrl = `${config.localPath}api/export/en/now.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}`
            }
            this.titleList = 0
            this.changeMiniTItle(this.titleList)
            this.dataShow = true
            this.dataList = this.currentPort.data
            const calc = []
            this.dataList.map(item => {
              calc.push(item.sdwt)
            })
            this.addsWt = calc.reduce(function(prev, curr, idx, arr) { return prev + curr })
            const port = this.currentPort.html
            // Map.mapView.setZoom(8)
            const L = window.L
            Map.mapView.setView(L.latLng(port.lat, port.lon), 8)
            Map.LazyLoadShip()
            Map.portShipMarker(this.dataList)
            Map.portZoom(this.currentPort.html)
            this.showFlagOfTable = true
          } else {
            this.dataShow = false
            this.openMessageBox(i18n.t('commonRemind.noMessage'))
          }
        }).catch(() => {
          // this.loading = false
        })
      },
      // 预计到港数据
      expectedPort(data) {
        Map.removeMap(Map.portShipMarkers)
        Map.removePortZoom()
        const obj = {
          dwtMaxValue: this.dwtMaxValue,
          dwtMinValue: this.dwtMinValue,
          portNameEn: data,
          sizeType: this.sizeType.toString(),
          endTime: this.endTimeE.getTime(),
          startTime: this.startTimeE.getTime(),
          pageIndex: -1,
          pageSize: -1,
          naviStatus: this.naviStatus.toString()

        }
        this.$store.dispatch('expectedPort', obj).then((data) => {
          if (this.expectedPorts && !_.isEmpty(this.expectedPorts.data)) {
            if (this.isLanguageZh) {
              this.downloadUrl = `${config.localPath}api/export/expected.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&endTime=${obj.endTime}&naviStatus=${obj.naviStatus}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}&pageIndex=-1&pageSize=-1&startTime=${obj.startTime}`
            } else {
              this.downloadUrl = `${config.localPath}api/export/en/expected.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&endTime=${obj.endTime}&naviStatus=${obj.naviStatus}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}&pageIndex=-1&pageSize=-1&startTime=${obj.startTime}`
            }
            this.titleList = 1
            this.changeMiniTItle(this.titleList)
            this.dataShow = true
            this.dataList = this.expectedPorts.data
            const calc = []
            this.dataList.map(item => {
              calc.push(item.sdwt)
            })
            this.addsWt = calc.reduce(function(prev, curr, idx, arr) { return prev + curr })
            const port = this.expectedPorts.html
            // Map.mapView.setZoom(8)
            const L = window.L
            Map.mapView.setView(L.latLng(port.lat, port.lng, 8))
            Map.LazyLoadShip()
            Map.portShipMarker(this.dataList)
            Map.portZoom(this.expectedPorts.html)
            this.showFlagOfTable = true
          } else {
            this.dataShow = false
            this.openMessageBox(i18n.t('commonRemind.noMessage'))
          }
        }).catch(() => {
          // this.loading = false
        })
      },
      // 历史到港数据
      historyPort(data) {
        Map.removeMap(Map.portShipMarkers)
        Map.removePortZoom()
        const obj = {
          dwtMaxValue: this.dwtMaxValue,
          dwtMinValue: this.dwtMinValue,
          portNameEn: data,
          sizeType: this.sizeType.toString(),
          endTime: this.endTime.getTime(),
          startTime: this.startTime.getTime()
        }
        this.$store.dispatch('historyPort', obj).then((data) => {
        // historyPorts(obj).then(response => {
          if (this.historyPorts && !_.isEmpty(this.historyPorts.data)) {
            if (this.isLanguageZh) {
              this.downloadUrl = `${config.localPath}api/export/current.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&endTime=${obj.endTime}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}&pageIndex=-1&pageSize=-1&startTime=${obj.startTime}`
            } else {
              this.downloadUrl = `${config.localPath}api/export/en/current.htm?dwtMaxValue=${obj.dwtMaxValue}&dwtMinValue=${obj.dwtMinValue}&endTime=${obj.endTime}&portNameEn=${obj.portNameEn}&&sizeType=${obj.sizeType}&pageIndex=-1&pageSize=-1&startTime=${obj.startTime}`
            }
            this.titleList = 2
            this.changeMiniTItle(this.titleList)
            this.dataShow = true
            this.dataList = this.historyPorts.data
            const calc = []
            this.dataList.map(item => {
              calc.push(item.sdwt)
            })
            this.addsWt = calc.reduce(function(prev, curr, idx, arr) { return prev + curr })
            const port = this.historyPorts.html
            // Map.mapView.setZoom(8)
            const L = window.L
            Map.mapView.setView(L.latLng(port.lat, port.lon), 8)
            Map.LazyLoadShip()
            Map.portShipMarker(this.dataList)
            Map.portZoom(this.historyPorts.html)
            this.showFlagOfTable = true
          } else {
            this.dataShow = false
            this.openMessageBox(i18n.t('commonRemind.noMessage'))
          }
        }).catch(() => {
          // this.loading = false
        })
      },
      // 查询按钮
      searchShips() {
        this.showFlagOfTable = false
        if (this.fromPort === '') {
          this.openMessageBox(i18n.t('commonRemind.postTips'))
          return
        }
        // 同名查询显示
        const minIDIndex = this.minimizeWindows.findIndex(item => item.minId === this.minimizePramas1.minId && item.portName === this.fromPort)
        if (this.initPortName !== this.fromPort && this.initStatus !== this.searchList) {
          if (minIDIndex !== -1) {
            this.initPortName = this.fromPort
            this.initStatus = this.searchList
            this.minimizeWindows[minIDIndex].zoomAction()
            this.minimizeWindows.splice(minIDIndex, 1)
            this.initPortName = ''
            this.initStatus = ''
          }
        }
        if (this.searchList === '0') {
          this.currentPortDate(this.fromPort)
        }
        if (this.searchList === '1') {
          this.expectedPort(this.fromPort)
        }
        if (this.searchList === '2') {
          this.historyPort(this.fromPort)
        }
      },
      // row 点击事件
      posiyionlat(row, event, column) {
        const L = window.L
        Map.mapView.setView(L.latLng(row.lat, row.lon))
        Map.shipDetail(row.imo)
      },
      // 点击定位船
      showShip(imo) {
        Map.shipDetail(imo)
      },
      // 错误提示
      openMessageBox(content) {
        this.$alert(content, '', {
          confirmButtonText: i18n.t('history.confirm')
        })
      },
      // tips z最小化
      minClose() {
        this.dataShow = false
        this.tabShow = false
      },
      // tips关闭
      handleClose(done) {
        Map.removePortZoom()
        Map.removeMap(Map.portShipMarkers)
        this.$router.push({
          name: 'ship'
        })
        done()
      },
      // table弹窗关闭
      handleClose1() {
        Map.removePortZoom()
        Map.removeMap(Map.portShipMarkers)
        this.dataShow = false
      },
      // 港口状态改变
      portOptions() {
        this.minimizePramas1.routeName = this.searchList
        this.minimizePramas1.minId = this.searchList
        this.fromPort = ''
      }
    },
    // 销毁
    destroyed() {
      Map.removeMap(Map.portShipMarkers)
      Map.removePortZoom()
    }
  }
</script>
<style>
.portSearch ul,
.portSearch li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.portSearch .history-search-list li {
  margin-bottom: 9px;
}
.portSearch .el-input__inner {
    background-color: transparent;
    color: #fff;
}
.portSearch .el-date-editor.el-input,
.portSearch .el-date-editor.el-input__inner,
.portSearch .el-select {
  width: 140px;
  height: 26px;
  line-height: 26px;
}
.portSearch .select .el-select {
  width: 215px;
}
.portSearch .input .el-input {
  width: 100px;
}
.portSearch .el-input--medium .el-input__inner {
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  background: #0000;
  border: 1px solid #DADADA;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
.portSearch .el-checkbox-group {
  display: inline-block;
}
.portSearch .el-button--info.is-disabled, .portSearch .el-button--info.is-disabled:hover, .portSearch .el-button--info.is-disabled:focus, .portSearch .el-button--info.is-disabled:active {
    color: #000;
}
.portSearch .el-radio__label,
.portSearch .el-checkbox__label {
  font-family: ArialMT;
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.portSearch .el-checkbox__input.is-checked + .el-checkbox__label,
.portSearch .el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}
.portSearch .el-checkbox__input.is-checked .el-checkbox__inner,
.portSearch .el-radio__input.is-checked .el-radio__inner{
  background-color: #FFA900;
  border-color: #FFA900;
}
.portSearch .time .el-input--medium .el-input__inner {
  padding: 0 5px 0 25px;
}
.portSearch .time .el-input__suffix-inner{
  display: none;
}
.portSearch .el-input--medium .el-input__icon {
  line-height: 26px;
}
.portSearch .el-input__prefix {
  left: 0;
}
.portSearch .history-search-list li .block {
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 26px;
}
.portSearch .history-search-list li .demonstration {
  display: inline-block;
  min-width: 70px;
  margin-right: 9px;
}
.language-en .history .history-search-list li .demonstration {
  min-width: 107px;
}
.language-en .history-search-list li{
  white-space: nowrap;
}
.portSearch .port-box {
  margin-top: 24px;
}
.language-en .el-radio + .el-radio{
  margin-left: 10px;
}
.history-line-record {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  justify-content: space-between;
  padding-top: 8px;
  color: #fff;
  line-height: 28px;
  font-size: 14px;
  padding-left: 16px;
}
.history-line-record .setting{
  color: #FFCC00;
}
.history-line-record .record{
  margin-right: 20px;
}
.history-line-record .record-word,
.history-line-record .record-num {
  font-size: 12px;
}
.history-line-record .record-num {
  margin: 0 1px;
  color: #FFCC00;
}
.history-line-record .btn-box a {
  display: block;
  cursor: pointer;
  padding: 0 9px;
  color: #333;
  margin-right: 83px;
  background-color: #FFCC00;
  border-radius: 2px;
}
.history-record-content{
  padding: 9px 12px;
}

.history-record-content table {
  border: 1px solid #242424;
  width: 100%;
  text-align:center;
  border-collapse:collapse;
  border-spacing:0;
  font-size: 12px;
}
.history-record-content table tr th {
  background: rgba(255,204,0,0.1);
}
.history-record-content table tr th,
.history-record-content table tr td{
  color: #fff;
  font-weight: normal;
  border-bottom: 1px solid #242424;
  border-right: 1px solid #242424;
  line-height: 28px;
  padding: 0 4px;
  white-space:nowrap;
}
.history-record-content table tr th:nth-last-child(1),
.history-record-content table tr td:nth-last-child(1){
  border-right: none;
}
.history .el-message-box__message p {
  text-align: center;
}
.history .history-table-box {
  width: 100%;
  overflow-y: auto;
  height: 200px;
}
/* .history .history-table-box::-webkit-scrollbar{
  width: 5px;
  height: 5px;
  background-color: #d3d3d0;
}
.history .history-table-box::-webkit-scrollbar-thumb{
  background-color: #3794EF;
  border-radius: 10px;
} */
.portSearch .el-date-editor.el-input, .portSearch .el-date-editor.el-input__inner, .portSearch .el-select {
    width: 174px;
    height: 26px;
    line-height: 26px;
}
.port-inquiry-content .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(33,0,255,.5);
}
.port-style-li{
  height: 18px;
  line-height: 18px;
  cursor: pointer;
}
.port-search-dialog main{
  height: 100%;
}
.port-search-dialog .port-inquiry-content {
  height: 100%;
}
/* .el-table__header, .el-table__body, .el-table__footer{
  width: 1628px!important;
} */
</style>
