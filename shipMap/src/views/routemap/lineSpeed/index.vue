<template>
  <div class="line-speed-table">
    <map-dialog  v-if="dataShow"
    :drag='1'
    :visible.sync='dataShow'
    :beforeClose = 'beforeClose'
    :minimize='minimize'
    :minimize-pramas='minimizePramas'
    :before-minimize="minHide"
    top='380px'
    :drop='1'
    width='1100px'
    minWidth='1100px'
    minHeight="300px"
    left='300px'>
      <template slot="title">
        <div class="line-speed-title">
          <div class="title-left">
            <span>
                <svg-icon class="font16 mr-l-10"  icon-class="hangxianhangsu-01" />
            </span>
            <!-- v-text="$t('portInquiry.title')" -->
            <span class="mr-l-15 font14" v-text="$t('lineSpeed.title')">
              航速航线
            </span>
            <span class="ship-check-list font12" >{{$t('lineSpeed.shipType')}}：
                <el-radio-group v-model="radio2">
                  <el-radio :label="1">{{$t('lineSpeed.vlcc')}}</el-radio>
                  <el-radio :label="2">{{$t('lineSpeed.suezmax')}}</el-radio>
                  <el-radio :label="3">{{$t('lineSpeed.aframax')}}</el-radio>
                </el-radio-group>
            </span>
            <div class="line-speed-title-item mr-l-40">
                <span >{{$t('lineSpeed.distance')}}:</span>
                <span style="color:#ffa900">{{calSpeed}}</span>
                <span>{{$t('lineSpeed.mile')}}</span>
            </div>
            <div class="line-speed-title-item">
              <span>{{$t('lineSpeed.days')}}:</span>
              <span>{{calday}}</span>
              <span>{{$t('lineSpeed.day')}}</span>
            </div>
            <div class="line-speed-title-item">
              <span>{{$t('lineSpeed.speed')}}:</span>
              <span><input type="number" min="0" v-model="inputValue" @change="model" class="numberInput"/></span>
              <span>{{$t('lineSpeed.section')}}</span>
            </div>
            <div class="item-buttom-history" v-show="speedBthShow !== '' " @click="historySpeeds">
              历史航速<span>{{speedBthShow}}</span>节
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <!-- v-text="$t('detail.voyageHistory')" -->
        <div class="line_speed_footer">
          <div class="footButton">
            <div class="foot-button_item_color" v-text="$t('lineSpeed.calculation')" @click='calculation' >计算</div>
            <div class="foot-button-item" v-text="$t('lineSpeed.empty')" @click="clearEmpty">清空</div>
            <!-- <div class="foot-button-item" v-text="$t('lineSpeed.moveUp')" @click="moveUp"></div>
            <div class="foot-button-item" v-text="$t('lineSpeed.moveDown')" @click="moveDwon"></div>
            <div class="foot-button-item" v-text="$t('lineSpeed.insertRow')" @click="addTableRow">增加行</div>
            <div class="foot-button-item" v-text="$t('lineSpeed.deleteRow')" @click="delTableRow">删除行</div> -->
          </div>
          <div class="footTips">
            <div class="tip_quo_l">
              <span style="color:#ffa900">*</span><span v-text="$t('lineSpeed.message')"></span>
            </div>
            <div class="tip_quo_r">
              <!-- <span >{{$t('lineSpeed.table.timeZone')}}:</span><span></span> -->
            </div>
          </div>
        </div>
      </template>
    <div class="table_class">
      <el-table
        ref="singleTable"
        :data="tableData"
        maxHeight="230"
        border class="lineSpeedTable"
        :highlight-current-row="flag"
        @row-click="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          type="index"
          v-bind:label="$t('lineSpeed.table.No')"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          v-bind:label="$t('lineSpeed.table.port')"
          width="200"
            align="center">
            <template slot-scope="props">
              <span v-if="MMSI !== '' && props.$index == 0 " >lat:{{lat}} lng:{{lng}}</span>
              <el-autocomplete  v-else
              v-model="props.row.input"
              class="inline-input"
              :suggestions-index="props.$index"
              :fetch-suggestions="rankingsSearch"
              :trigger-on-focus="false"
               :disabled="props.row.disabled"
              @select="clickFullZ(props)"
                  >
                  <template slot-scope="{ item }" >
                    <div class="lineSpeed_padding" @click="selectItem = item">
                      <div >{{ item.portNameEn || item.en}}</div>
                    </div>
                  </template>
              </el-autocomplete>
              <!-- <map-auto-template
              v-else
              :index="props.$index"
              :datas="portList"
              :change="change">
                <template>

                </template>
              </map-auto-template> -->
         </template>
        </el-table-column>
        <el-table-column
          prop="timeZone"
          v-bind:label="$t('lineSpeed.table.timeZone')"
          width="100"
            align="center">
        </el-table-column>
        <el-table-column
          prop="distance"
          v-bind:label="$t('lineSpeed.table.distance')"
          width="100"
          align="center"
          :formatter="tofixed">
        </el-table-column>
        <el-table-column
          prop="Speed"
          v-bind:label="$t('lineSpeed.table.Speed')"
          width="100"
            align="center">
        </el-table-column>
        <el-table-column
          prop="sailingDays"
          v-bind:label="$t('lineSpeed.table.sailingDays')"
          width="100"
            align="center">
        </el-table-column>
        <!-- rop="residenceTime" -->
        <el-table-column
          v-bind:label="$t('lineSpeed.table.residenceTime')"
          width="180"
          align="center">
          <template slot-scope="props">
            <span v-if="props.row.id == 1">{{props.row.residenceTime}}</span>
            <el-input v-else size="small" class="tab-residence-input" autosize v-model="props.row.residenceTime" placeholder=""></el-input>
          </template>
        </el-table-column>
        <el-table-column
        prop="PortTimeIsExpected"
        v-bind:label="$t('lineSpeed.table.PortTimeIsExpected')"
          width="180"
            align="center">
        </el-table-column>
        <!-- prop="PortTimeIsExpected" -->
        <el-table-column

        v-bind:label="$t('lineSpeed.table.EstimatedTime')"
          width="180"
          align="center">
          <template slot-scope="props">
            <el-date-picker v-if="props.row.id == 1" v-model="timeP1" prefix-icon="fs-calendar"  class="timeP1" size="small" type="datetime"
              placeholder="选择日期" >

            </el-date-picker>
            <span v-else>{{props.row.EstimatedTime}}</span>
          </template>
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

      <!-- <template slot="footer">

      </template>   -->
  </map-dialog >
  <!-- <div v-if="isds">
    aaaaaaaaaaaaaaaaaaaaaaaaaaaa
  </div> -->
  <map-dialog v-if="dataShow1" :drag='1' class="port-inquiry-content history-footer-line" :visible.sync='dataShow1' :beforeClose = 'beforeClose1' width='568px' top="auto" bottom="370px" left='300px'>
    <template slot="title">
      <div class="port-inquiry-title">
        <span class="mr-l-15">
            <svg-icon class="font16" style="color:#ffa900" icon-class="lishishuju" />
        </span>
        <!-- v-text="$t('portInquiry.title')" -->
        <span class="mr-l-10"  >
          {{$t('lineSpeed.title2')}}
        </span>
      </div>
    </template>
    <template slot="footer">
      <div class="hisrory-footer">
        <span >
          {{$t('lineSpeed.footterl')}} {{tableData1.historySpeed}}{{clacSpeed}} {{$t('lineSpeed.section')}}
        </span>
        <!-- v-text="$t('portInquiry.title')" -->
        <span>
          {{$t('lineSpeed.footerr')}}{{calday}} {{$t('lineSpeed.day')}}
        </span>
      </div>
    </template>
    <div class="table-div">

      <el-table
        :data="tableData1"
        border
        maxHeight="230"
        style="width: 100%">
        <el-table-column
        v-bind:label="$t('lineSpeed.lineHistory')"
          width="200"
          align="center">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small">编辑</el-button> -->
            <span>{{scope.row.fromNameCn}}<img src="@/lib/images/arrowlink.png" class="mr-l-5 mr-r-5" alt="">{{scope.row.toNameCn}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="historySpeed"
          v-bind:label="$t('lineSpeed.hSpeed')"
          width="168"
            align="center">
        </el-table-column>
        <el-table-column
          prop="avgWorkTimePort"
          v-bind:label="$t('lineSpeed.tingqiuT')"
          width="168"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>

    <!-- <template slot="footer">

    </template>   -->
</map-dialog>
  </div>
</template>

<script>
  import {
    port,
    plan,
    currentPlan
  } from '@/api/routemap'
  import {
    mapGetters
  } from 'vuex'
  import _ from 'lodash'
  import config from '@/config'
  // import store from '@/store'
  // import mapAutoTemplate from '../ui/auotoTemplate/index'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import Map from '@/views/routemap/map'
  import i18n from '@/lang'
  import '@/styles/flag-icon.css'
  import { upData, downData, parseTime, formatDegree } from '@/utils/index'
  export default {
    components: {
      mapDialog
    },
    name: 'lineSpeeddragDialog',
    props: {
      dialogTableVisible: {
        type: Boolean
      }
      // beforeClose: {
      //   type: Function
      // }
    },
    data() {
      return {
        flags: true,
        crollTop: '',
        speedBthShow: '',
        dataShow: true,
        dataShow1: false,
        minimize: true,
        minimizePramas: {
          title: i18n.t('lineSpeed.title'),
          zoomAction: () => {
            // store.dispatch('', this.tableData)
            this.dataShow = true
          }
        },
        tableData1: [],
        flag: true,
        MMSI: '',
        lat: '',
        lng: '',
        calday: 0,
        calSpeed: 0,
        clacSpeed: 0,
        currentIndex: null,
        inputValue: 13,
        cuurentId: null,
        state1: {},
        timeP1: new Date(),
        selectItem: '',
        portList: [],
        copyTabe: null,
        tableData: [
          {
            id: 1,
            input: '',
            timeZone: '',
            distance: '',
            disabled: false,
            Speed: 13,
            sailingDays: '',
            residenceTime: '',
            PortTimeIsExpected: '',
            EstimatedTime: new Date()
          },
          {
            id: 2,
            input: '',
            timeZone: '',
            distance: '',
            disabled: true,
            Speed: 13,
            sailingDays: '',
            residenceTime: '',
            PortTimeIsExpected: '',
            EstimatedTime: ''
          },
          {
            id: 3,
            input: '',
            timeZone: '',
            distance: '',
            disabled: true,
            Speed: 13,
            sailingDays: '',
            residenceTime: '',
            PortTimeIsExpected: '',
            EstimatedTime: ''
          },
          {
            id: 4,
            input: '',
            timeZone: '',
            distance: '',
            disabled: true,
            Speed: 13,
            sailingDays: '',
            residenceTime: '',
            PortTimeIsExpected: '',
            EstimatedTime: ''
          },
          {
            id: 5,
            input: '',
            timeZone: '',
            distance: '',
            disabled: true,
            Speed: 13,
            sailingDays: '',
            residenceTime: '',
            PortTimeIsExpected: '',
            EstimatedTime: ''
          }
        ],
        radio2: 1,
        currentRow: null,
        tablerow: {},
        // sizeType: ['VLCC', 'Suezmax', 'Aframax']
        sizeType: ['VLCC', 'SUEZMAX', 'AFRAMAX']
      }
    },
    // watch: {
    //   inputValue:function(newValue, oldValue) {
    //     this.model()
    //   }
    // },
    computed: {
      ...mapGetters([
        'shipInfos',
        'getUser'
      ]),
      // 获取登录信息
      isds() {
        return this.$store.getters.getUser ? config.SLD.specialIds.findIndex(item => item === this.$store.getters.getUser.datas.memberId) >= 0 : false
      }
    },
    methods: {
      // 权限
      showquanxian() {
        this.$store.dispatch('setUser').then(() => {
          if (this.getUser.status !== 2) {
            if (!this.isds) {
              this.tableData[0].disabled = true
              this.$alert(i18n.t('commonRemind.lineTips'), '', {
                confirmButtonText: i18n.t('history.confirm'),
                callback: (action, instance) => {
                  this.$router.push({ name: 'ship' })
                }
              }).then(() => {
                this.$router.push({ name: 'ship' })
              })
            }
          } else {
            this.$confirm(i18n.t('commonRemind.loginTips'), {
              confirmButtonText: i18n.t('login.logIn'),
              cancelButtonText: i18n.t('commonRemind.cancel'),
              type: 'warning'
            }).then(() => {
              window.location.href = config.SLD.loginUrl + encodeURIComponent(window.location.href)
            }).catch(() => {
              this.$router.push({ name: 'ship' })
            })
          }
        })
      },
      // 最小化
      minHide() {
        this.dataShow = false
      },
      // table格式化 保留4位小数
      tofixed: function(row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return Number(date).toFixed(4)
      },
      // 港口下拉框
      rankingsSearch(queryString, cb) {
        const index = this.currentIndex
        if (this.MMSI === '') {
          if (index === 0) {
            port(queryString).then(response => {
              if (response && response.data.datas && !_.isEmpty(response.data)) {
                this.portList = response.data.datas
                const restaurants = this.portList
                this.tableData[index + 1].disabled = false
                cb(restaurants)
              } else {
                this.$alert(i18n.t('commonRemind.noMessage'), '')
              }
            })
          } else {
            port(queryString, { portName: this.tableData[index - 1].input, type: 'from' }, 'post').then(response => {
              if (response && response.data.datas && !_.isEmpty(response.data)) {
                this.portList = response.data.datas
                const restaurants = this.portList
                this.tableData[index + 1].disabled = false
                cb(restaurants)
              } else {
                this.$alert(i18n.t('commonRemind.noMessage'), '')
              }
            })
          }
        } else {
          if (index === 1) {
            port(queryString).then(response => {
              if (response && response.data.datas && !_.isEmpty(response.data)) {
                this.portList = response.data.datas
                const restaurants = this.portList
                this.tableData[index + 1].disabled = false
                cb(restaurants)
              } else {
                this.$alert(i18n.t('commonRemind.noMessage'), '')
              }
            })
          } else {
            port(queryString, { portName: this.tableData[index - 1].input, type: 'from' }, 'post').then(response => {
              if (response && response.data.datas && !_.isEmpty(response.data)) {
                this.portList = response.data.datas
                const restaurants = this.portList
                this.tableData[index + 1].disabled = false
                cb(restaurants)
              } else {
                this.$alert(i18n.t('commonRemind.noMessage'), '')
              }
            })
          }
        }
      },
      // 如前台过滤采用这个方法
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.portNameEn.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
        }
      },
      // 下拉框点击事件
      clickFullZ(item) {
        setTimeout(() => {
          item.row.input = this.selectItem.portNameEn || this.selectItem.en
          item.row.timeZone = this.selectItem.timeZone
        }, 100)
      },
      // 增加一行
      addTableRow() {
        const length = this.tableData.length + 1
        const addrow = {
          id: length,
          input: '',
          timeZone: '',
          distance: '',
          Speed: '',
          sailingDays: '',
          residenceTime: '',
          PortTimeIsExpected: '',
          EstimatedTime: ''
        }
        this.tableData.push(addrow)
      },
      // 删除一行
      delTableRow() {
        const length = this.tableData.length
        if (length > 2) {
          this.tableData.pop()
        } else {
          this.$alert('<span style="text-align: center; display: block; font-weight: bold;">至少保留两个港口</span>', '', {
            dangerouslyUseHTMLString: true,
            showClose: false
          })
        }
      },
      // 设置当前行高亮
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row)
      },
      // 行点击
      handleCurrentChange(row, event, column) {
        if (!row) return false
        this.currentIndex = this.tableData.findIndex(v => v.id === row.id)
        this.tablerow = row
        // if (this.currentIndex > 0) {
        //   this.flag = true
        // } else {
        //   this.flag = false
        //   // this.currentRow = null
        // }
        // this.currentRow = row
      },
      // 清空表格
      clearEmpty() {
        this.tableData = this.copyTabe
        Map.removeShipHistoryLine()
        Map.removeLineSpeedMarkers()
        Map.historyMarkerBlean = false
        Map.initShip = true
        Map.LazyLoadShip()
      },
      // 上移
      moveUp() {
        if (this.currentIndex) {
          this.setCurrent()
          setTimeout(() => {
            if (this.currentIndex < this.tableData.length) {
              if (this.currentIndex > 1) {
                upData(this.tableData, this.currentIndex)
                this.currentIndex--
                this.setCurrent(this.tableData[this.currentIndex])
              } else {
                this.currentIndex = 1
                this.setCurrent(this.tableData[this.currentIndex])
              }
            }
          })
        }
      },
      // 下移
      moveDwon() {
        if (this.currentIndex) {
          this.setCurrent()
          setTimeout(() => {
            if (this.currentIndex < this.tableData.length - 1) {
              if (this.currentIndex >= 1) {
                downData(this.tableData, this.currentIndex)
                this.currentIndex++
                this.setCurrent(this.tableData[this.currentIndex])
              }
            } else {
              this.currentIndex = this.tableData.length - 1
              this.setCurrent(this.tableData[this.currentIndex])
            }
          })
        }
      },
      model() {
        this.tableData.map(item => {
          if (item.distance !== '') {
            item.sailingDays = parseFloat(item.distance / (item.Speed * 24)).toFixed(2)
            item.Speed = this.inputValue
          } else {
            item.Speed = this.inputValue
          }
        })
      },
      // 计算航线
      calculation() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const ports = []
        this.tableData.map((item, index) => {
          if (this.flags) {
            if (index === 0) {
              let formPort = ''
              let stime = ''
              if (this.MMSI !== '') {
                formPort = ''
                stime = ''
              } else {
                formPort = item.input
                stime = (this.timeP1).getTime()
              }
              ports.push({
                'fromPort': formPort,
                'toPort': this.tableData[index + 1].input,
                'startTime': stime,
                'stayTime': item.residenceTime,
                'speed': item.Speed
              })
            } else if (index > 0) {
              if (item.input !== '' && this.tableData[index + 1].input !== '') {
                ports.push({
                  'fromPort': item.input,
                  'toPort': this.tableData[index + 1].input,
                  'startTime': '',
                  'stayTime': item.residenceTime,
                  'speed': item.Speed
                })
              }
            }
          }
        })
        const mmsis = this.MMSI || ''
        let obj = {}
        if (this.MMSI !== '') {
          obj = {
            fromPort: '',
            route: ports,
            speed: this.inputValue,
            mmsi: mmsis
          }
          currentPlan(obj).then(response => {
            loading.close()
            if (response && !_.isEmpty(response.data.datas) && !_.isEmpty(response.data.datas.data.data)) {
              const portMarker = response.data.datas.html
              const portMarkers = response.data.datas.data.data
              this.clacSpeed = response.data.datas.data.speed
              const history = response.data.datas.data.history
              this.speedBthShow = response.data.datas.data.speed
              this.tableData1 = response.data.datas.speedReference
              Map.initShip = false // 关闭懒加载船只
              Map.removeCirleMarker()
              Map.removeShipHistoryLine()
              Map.removeLineSpeedMarkers()
              let arr = []
              const day = []
              const speed = []
              // 数据拼接
              portMarkers.map((item, index) => {
                this.tableData[index + 1].timeZone = item.toNameZone
                this.tableData[index + 1].distance = item.distance
                this.tableData[index + 1].Speed = item.speed
                this.tableData[index + 1].sailingDays = (parseFloat(Number(item.consumingTime) / 24).toFixed(2))
                this.tableData[index + 1].residenceTime = item.stayTime
                this.tableData[index + 1].PortTimeIsExpected = item.dateEndStr
                day.push((item.consumingTime - 0) / 24)
                speed.push((item.distance - 0))
                this.tableData[index + 1].EstimatedTime = item.dateStartStr
                arr = [
                  ...arr,
                  ...item.waypoint
                ]
              })
              this.calday = parseFloat(day.reduce(function(prev, curr, idx, arr) { return prev + curr })).toFixed(2)
              this.calSpeed = parseFloat(speed.reduce(function(prev, curr, idx, arr) { return prev + curr })).toFixed(2)
              Map.ShipHistoryline(arr)
              Map.dashLine(history, 5) // 虚线
              Map.lineSpeedMarkers([arr[arr.length - 1]], false)
              Map.lineSpeedMarkers([history[0]], false)
              Map.lineSpeedMarkers(portMarker, true)
            } else {
              this.$alert('<span style="text-align: center; display: block; font-weight: bold;">暂无计算数据</span>', '', {
                dangerouslyUseHTMLString: true,
                showClose: false
              })
            }
          })
        } else {
          obj = {
            fromPortStartTime: parseTime((this.timeP1).getTime()),
            route: ports,
            sizeType: this.sizeType[this.radio2],
            speed: this.inputValue,
            timeZone: this.tableData[0].timeZone
          }
          plan(obj).then(response => {
            loading.close()
            if (response && !_.isEmpty(response.data.datas.data.data)) {
              const portMarker = response.data.datas.html
              const portMarkers = response.data.datas.data.data
              this.clacSpeed = response.data.datas.data.speed
              this.speedBthShow = response.data.datas.data.speed
              this.tableData1 = response.data.datas.speedReference
              Map.initShip = false
              Map.removeCirleMarker()
              Map.removeShipHistoryLine()
              Map.removeLineSpeedMarkers()
              let arr = []
              const day = []
              const speed = []
              portMarkers.map((item, index) => {
                this.tableData[index + 1].timeZone = item.toNameZone
                this.tableData[index + 1].distance = item.distance
                this.tableData[index + 1].Speed = item.speed
                this.tableData[index + 1].sailingDays = (parseFloat(Number(item.consumingTime) / 24).toFixed(2))
                this.tableData[index + 1].residenceTime = item.stayTime
                this.tableData[index + 1].PortTimeIsExpected = item.dateEndStr
                day.push((item.consumingTime - 0) / 24)
                speed.push((item.distance - 0))
                this.tableData[index + 1].EstimatedTime = item.dateStartStr
                arr = [
                  ...arr,
                  ...item.waypoint
                ]
              })
              this.calday = parseFloat(day.reduce(function(prev, curr, idx, arr) { return prev + curr })).toFixed(2)
              this.calSpeed = parseFloat(speed.reduce(function(prev, curr, idx, arr) { return prev + curr })).toFixed(2)
              Map.ShipHistoryline(arr)

              Map.lineSpeedMarkers([arr[0], arr[arr.length - 1]], false)
              Map.lineSpeedMarkers(portMarker, true)
            } else {
              this.$alert('<span style="text-align: center; display: block; font-weight: bold;">暂无计算数据</span>', '', {
                dangerouslyUseHTMLString: true,
                showClose: false
              })
            }
          })
        }
      },
      // 关闭弹窗
      beforeClose() {
        Map.removeShipHistoryLine()
        Map.removeLineSpeedMarkers()
        this.dataShow = false
        this.$router.push({ name: 'ship' })
        this.dataShow1 = false
      },
      // 关闭历史航速
      beforeClose1() {
        this.dataShow1 = false
      },
      // 打开历史航速
      historySpeeds() {
        this.dataShow1 = true
      }
    },
    mounted() {
      this.copyTabe = JSON.parse(JSON.stringify(this.tableData)) // 复制数据
      this.showquanxian()
      // this.portInit()
      if (this.$route.params.MMSI) {
        this.MMSI = this.$route.params.MMSI
        this.tableData[0].timeZone = this.$route.params.zone
        // this.tableData[0].timeZone =
        this.lat = formatDegree(this.$route.params.lat)
        this.lng = formatDegree(this.$route.params.lng)
        this.tableData[1].disabled = false
      }
      this.crollTop = window.innerHeight * 0.5 + 'px'
    }
  }
</script>
<style >

.line-speed-title {
  height: 42px;
  line-height: 42px;
}
.line-speed-title .title-left{
  color: #fff;
}

  .line-speed-title-item{
    display: inline-block;
    color: #FFFFFF;
    font-size: 12px;
    margin-right: 20px;
  }
  .item-buttom-history {
    cursor: pointer;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    width: 114px;
    background: #FFF;
    color: #000;
    text-align: center;
    border-radius: 2px;
    font-size: 12px;
  }
.numberInput {
  width: 50px;
  /* background: #18181800; */
  background:rgba(24, 24, 24, 0);
  border: 1px solid #5c5c5c;
  color: #fff;
  text-align: center;
}
.checklist{
  display: inline-block;
}
.ship-check-list{
  margin-left: 20px;
  font-size: 12px;
}
.ship-check-list .el-checkbox__inner{
  background: #181818;
  border: 1px solid #5c5c5c;
}
.ship-check-list .el-checkbox__label{
  padding-left: 5px;
  font-size: 12px;
}
.ship-check-list .el-checkbox+.el-checkbox{
  margin-left: 15px
}
.ship-check-list .el-checkbox{
  color: #FFF;
}
.lineSpeedTable .el-input--medium .el-input__inner {
    margin: 0px;
    width: 179px;
    height: 32px;
    line-height: 32px;
    background-color: transparent;
    border:none;
    color: #fff;
}
.table_class .el-table--border, .el-table--group {
    border: 1px solid #5c5c5c;
}
.table_class .el-table__body-wrapper::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background-color: #d3d3d0;
}
.table_class .el-table__body-wrapper::-webkit-scrollbar-thumb{
  background-color: #3794EF;
}
.table_class .el-table--border::after,.table_class .el-table--group::after, .table_class .el-table::before {
    background-color: #5c5c5c;
}
.table_class .el-table--border::after, .table_class .el-table--group::after, .table_class .el-table::before {
    content: '';
    /* position: absolute; */
    background-color: #5c5c5c;
    z-index: 1;
}
.line_speed_footer .foot-button_item_color{
  float: left;
  background: #FFCC00;
  border-radius: 2px;
  padding: 0px 10px;
  font-size: 13px;
  margin-right: 15px;
  cursor: pointer;
  color: #fff;
}
.line_speed_footer .footButton .foot-button-item{
  float: left;
  border-radius: 2px;
  padding: 0px 10px;
  font-size: 13px;
  cursor: pointer;
  color: #fff;
}
.line_speed_footer .footButton {
  float: left;
  height: 30px;
  line-height: 30px;
}
.line_speed_footer .footTips{
   float: right;
  color: #fff;
  margin-top: 10px;
  padding-bottom: 20px;
  font-size: 12px;
}
.line_speed_footer .footTips .tip_quo_l{
  float: left;
}
.line_speed_footer .footTips .tip_quo_r{
  float: right;
  margin-right: 30px;
}
.el-table__fixed-right::before, .el-table__fixed::before {
    opacity: 0;
}
.lineSpeed_padding{
  margin: 0;
  padding: 0;
}
.line-speed-table  .el-table--enable-row-transition .el-table__body td {
    /* background:rgba(24, 24, 24, .8); */
    color: #fff;
    border-color: rgb(36, 36, 36);
    height: 30px;
    line-height: 30px;
    padding: 0;
    font-size: 12px;
}
.line-speed-table .el-table--border th, .el-table__fixed-right-patch {
    background: rgba(255,204,0,0.1);
    border-color: rgb(36, 36, 36);
    color: #fff;
    font-weight: 100;
}
/* .table_class .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #5c5c5c;
} */
.table_class .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(33,0,255,.5);
}
.table_class .el-table__row--striped>td,.el-table__body tr.hover-row>td{background-color:rgba(33,0,255,.5) !important;}
.table_class .el-table__body tr.current-row>td{background-color:rgba(33,0,255,.5) !important}
.table_class .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 150px;
}
.table_class .el-input__inner {
    background-color: transparent;
    border: none;
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
}
.table_class .el-input--prefix .el-input__inner {
    padding-left: 0px;
}
.line-speed-table .el-table {
    background-color: transparent;

}
.line-speed-table .el-table tr {
    background-color: transparent;
}
.line-speed-table .el-table--group::after, .port-inquiry-content.el-table--border::after, .el-table::before {
    background-color: transparent;
}
.line-speed-table .el-table--group::after, .port-inquiry-content .el-table--border::after, .el-table::before {
    background-color: transparent;
}
.table-div{
  margin: 0 auto;
    width: 538px;
}
.history-footer-line .map_dialog_footer {
    padding: 10px;
     text-align: left;
    color: rgba(255,204,0,1);
    font-size: 12px;
}
.line-speed-table .el-table--medium th, .line-speed-table .el-table--medium td {
    padding: 5px 0;
}
.language-en .line-speed-table .el-table--border th, .language-en .el-table__fixed-right-patch {
    font-size: 12px;
}
.line-speed-table .el-radio{
  color: #fff
}
 .el-autocomplete-suggestion__wrap {
    max-height: 280px;
    padding: 0px 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: auto;
    background-color: rgba(33,33,33,.7);
    border: 1px solid rgba(33,33,33,.7);
    border-radius: 4px;
  }
.el-autocomplete-suggestion li{
  color: #fff;
}
.el-autocomplete-suggestion li{
  color: #fff;
  padding-left: 10px;
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
.el-popper[x-placement^="bottom"] .popper__arrow,
.el-popper[x-placement^="top"] .popper__arrow {
  display: none;
}
.el-autocomplete-suggestion li:hover {
  background-color: rgba(33,0,255,.5) !important;
}
.el-autocomplete-suggestion .el-autocomplete-suggestion__list{
  padding: 0;
}
</style>
