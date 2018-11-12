<template>
  <div class="history">
    <tips v-if="tabShow"
    :width="isLanguageZh ? '504px' : '631px'"
          left="20px"
          top="99px"
          :minimize='minimize'
          :minimize-pramas='minimizePramas'
          :before-minimize="miniHide"
          :before-close="handleClose"
          :visible.sync='isShow'>
      <template slot="tipsContent">
        <div class="out-history-list">
          <ul class="history-search-list">
            <li class="select">
              <div class="block">
                <span class="demonstration">{{$t(`history.loadingPort`)}}：</span>
                <el-select v-model="fromPort" filterable :placeholder="$t(`history.loadingPort`)" :filter-method="getPorts">
                  <el-option
                    v-for="item in deliveryPort"
                    :key="item.portNameEn"
                    :label="item.portNameEn"
                    :value="item.portNameEn">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="select">
              <div class="block">
                <span class="demonstration">{{$t(`history.dischargePort`)}}：</span>
                <el-select v-model="toPort" :placeholder="$t(`history.dischargePort`)">
                  <el-option
                    v-for="item in arrivePort"
                    :key="item.value"
                    :label="isLanguageZh ? item.portName : item.portNameEN"
                    :value="item.portNameEn">
                  </el-option>
                  <!-- portName
                  portNameEn -->
                </el-select>
              </div>
            </li>
            <li>
              <div class="block">
                <span class="demonstration">{{$t(`history.vesselType`)}}：</span>
                <el-checkbox-group v-model="sizeType">
                  <el-checkbox label="VLCC"></el-checkbox>
                  <!-- <el-checkbox label="Suezmax"></el-checkbox>
                  <el-checkbox label="Aframax"></el-checkbox> -->
                  <el-checkbox label="SUEZMAX"></el-checkbox>
                  <el-checkbox label="AFRAMAX"></el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li class="input">
              <div class="block">
                <span class="demonstration">DWT：</span>
                <span>
                  <el-input v-model="dwtMaxValue" :placeholder="$t(`history.enterPlease`)"></el-input>
                  -
                  <el-input v-model="dwtMinValue" :placeholder="$t(`history.enterPlease`)"></el-input>
                 MT
                </span>
              </div>
            </li>
            <li class="radio">
              <div class="block">
                <span class="demonstration">{{$t(`history.timeType`)}}：</span>
                <span>
                  <el-radio v-model="timeType" label="1">{{$t(`history.arrival`)}}</el-radio>
                  <el-radio v-model="timeType" label="2">{{$t(`history.departure`)}}</el-radio>
                </span>
              </div>
            </li>
            <li class="time">
              <div class="block">
                <span class="demonstration">{{$t(`history.timeRange`)}}：</span>
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  :placeholder="$t(`history.chooseDate`)">
                </el-date-picker>
                -
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  :placeholder="$t(`history.chooseDate`)">
                </el-date-picker>
              </div>
            </li>
            <li>
              <div class="search-box">
                <span @click='getHistoryLine'>{{$t(`history.search`)}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="reminder">
          提示：为了使您获得最佳的查询航速航线体验，建议使用谷歌浏览器
        </div> -->
      </template>
    </tips>
    <!-- <map-dialog :drag='1' :minimize='minimize' :before-minimize="beforeClose" :minimize-pramas='minimizePramasList' v-if="dataShow" :visible.sync='dataShow' width='934px' top="400px" left='300px'> -->
    <!-- 历史航线列表 -->
    <map-dialog :drag='1'
    v-if="dataShow"
    :drop='1'
    minWidth='934px'
    minHeight="150px"
    :visible.sync='dataShow'
    :minimize='minimize1'
    :minimize-pramas='minimizePramas1'
    :before-minimize="minHide1"
    width='934px'
    top="400px"
    left='300px'>
      <template slot="title">
        <div class="history-line-record">
          <div class="record-title">
            <svg-icon class="setting" icon-class="sousuo" />
            <span class="record">{{$t(`history.historicRecord`)}}</span>
            <span class="record-word">{{$t(`history.altogether`)}}</span>
            <span class="record-num">{{historyLineData.length}}</span>
            <span class="record-word">{{$t(`history.record`)}}</span>
          </div>
          <div class="record-title btn-box">
            <a :href="isLanguageZh ? downloadUrlCn : downloadUrlEn">{{$t(`history.exportData`)}}</a>
          </div>
        </div>
      </template>
      <!-- <div class="history-record-content">
        <div class="history-table-box">
          <table>
            <thead>
              <tr>
                <th>{{$t(`history.serialNum`)}}</th>
                <th>{{$t(`history.vesselName`)}}</th>
                <th>IMO</th>
                <th>MMSI</th>
                <th>{{$t(`history.vesselSizeType`)}}</th>
                <th>{{$t(`history.draft`)}}</th>
                <th>{{$t(`history.draughtOut`)}}</th>
                <th>{{$t(`history.draughtIn`)}}</th>
                <th>{{$t(`history.fromPort`)}}</th>
                <th>{{$t(`history.fromCounrty`)}}</th>
                <th>{{$t(`portSearch.tableList.atd`)}}</th>
                <th>{{$t(`history.subPorts`)}}</th>
                <th>{{$t(`history.toPort`)}}</th>
                <th>{{$t(`portSearch.tableList.ata`)}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(item, index) in historyLineData' :key="index" @click="showShip(item.imo)">
                <td>{{index + 1}}</td>
                <td>{{item.vesselName}}</td>
                <td>{{item.imo}}</td>
                <td>{{item.mmsi}}</td>
                <td>{{isLanguageZh ? item.vesselSizeTypeCN : item.vesselSizeTypeEN}}</td>
                <td>{{item.draft}}</td>
                <td>{{item.draughtOut}}</td>
                <td>{{item.draughtIn}}</td>
                <td>{{isLanguageZh ? item.fromPortCN : item.fromPortEN}}</td>
                <td>{{isLanguageZh ? item.fromCounrtyCN : item.fromCounrtyEN}}</td>
                <td>{{dateFormat(item.atd)}}</td>
                <td>{{isLanguageZh ? item.subPortsCN : item.subPortsEN}}</td>
                <td>{{isLanguageZh ? item.toPortCN : item.toPortEN}}</td>
                <td>{{dateFormat(item.ata)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
      <!-- @row-click="posiyionlat" -->
      <div class="port-inquiry-content">
      <el-table
        :data="historyLineData"
        border
        @row-click="showShip"
        maxHeight="234"
        style="width: 100%;height:100%">
        <el-table-column
          type="index"
          v-bind:label="$t('history.serialNum')"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="vesselName"
          v-bind:label="$t('history.vesselName')"
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
        <el-table-column
          :prop="isLanguageZh ? 'vesselSizeTypeCN' : 'vesselSizeTypeEN'"
          v-bind:label="$t('history.vesselSizeType')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="draft"
          v-bind:label="$t('history.draft')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="draughtOut"
          v-bind:label="$t('history.draughtOut')"
          width="190"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="draughtIn"
          v-bind:label="$t('history.draughtIn')"
          width="190"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :prop="isLanguageZh ? 'fromPortCN' : 'fromPortEN'"
          v-bind:label="$t('history.fromPort')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :prop="isLanguageZh ? 'fromCounrtyCN' : 'fromCounrtyEN'"
          v-bind:label="$t('history.fromCounrty')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="atd"
          v-bind:label="$t('portSearch.tableList.atd')"
          width="120"
          align="center"
          :formatter="dateFormat"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :prop="isLanguageZh ? 'subPortsCN' : 'subPortsEN'"
          v-bind:label="$t('history.subPorts')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :prop="isLanguageZh ? 'toPortCN' : 'toPortEN'"
          v-bind:label="$t('history.toPort')"
          width="120"
            align="center"
            show-overflow-tooltip>
        </el-table-column>
         <el-table-column
          prop="ata"
          v-bind:label="$t('portSearch.tableList.ata')"
          width="120"
          align="center"
          :formatter="dateFormat"
          show-overflow-tooltip>
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
  </div>
</template>
<script>
  import tips from '../ui/tips/index'
  import moment from 'moment'
  import store from '@/store'
  import config from '@/config'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import i18n from '@/lang'
  import Map from '../map.js'
  import _ from 'lodash'
  import {
    mapGetters
  } from 'vuex'
  import { port, chinaPorts } from '@/api/routemap'
  export default {
    name: 'fleet',
    components: {
      tips,
      mapDialog
    },
    data() {
      return {
        fromPort: '',
        toPort: '',
        historyLineData: [],
        tabShow: true,
        // sizeType: ['VLCC', 'Suezmax', 'Aframax'],
        sizeType: ['VLCC', 'SUEZMAX', 'AFRAMAX'],
        timeType: '1',
        dwtMaxValue: '',
        dwtMinValue: '',
        startTime: new Date(new Date() - 30 * 24 * 3600 * 1000),
        endTime: new Date(new Date()),
        miniFlag: true,
        minimizePramas: {
          title: i18n.t('tabNav.tabList[4].text'),
          routeName: 'history',
          zoomAction: () => {
            const searchData = {
              'fromPort': this.fromPort,
              'toPort': this.toPort,
              'sizeType': this.sizeType,
              'timeType': this.timeType,
              'dwtMaxValue': this.dwtMaxValue,
              'dwtMinValue': this.dwtMinValue,
              'startTime': this.startTime,
              'endTime': this.startTime,
              'historyLineData': this.historyLineData
            }
            store.dispatch('historyCourse', searchData)
            this.tabShow = true
            if (this.historyLineData.length > 0) {
              if (this.miniFlag) {
                this.dataShow = true
              }
            }
            // this.$router.push({
            //   name: 'history'
            // })
          }
        },
        minimizePramas1: {
          title: i18n.t(`history.historicRecord`),
          zoomAction: () => {
            // store.dispatch('', this.tableData)
            this.miniFlag = true
            this.dataShow = true
          }
        },
        minimizePramasList: {
          title: i18n.t('history.historicRecord'),
          routeName: 'history',
          zoomAction: () => {
            this.$router.push({
              name: 'history'
            })
          }
        },
        deliveryPort: [],
        arrivePort: [],
        minimize: true,
        minimize1: true,
        downloadUrlCn: null,
        downloadUrlEn: null,
        dataShow: false,
        isShow: true
      }
    },
    computed: {
      ...mapGetters([
        'historyCourse',
        'gethistoryportDate' // stroe数据
      ]),
      isLanguageZh() {
        return this.$store.getters.language === 'zh' // 中英文语言
      }
    },
    watch: {
      gethistoryportDate(n, o) { // 监听数据变化
        this.historyLineData = this.gethistoryportDate.data
        this.dataShow = true
      }
    },
    mounted() {
      if (this.historyCourse) {
        this.fromPort = this.historyCourse.fromPort
        this.toPort = this.historyCourse.toPort
        this.sizeType = this.historyCourse.sizeType
        this.timeType = this.historyCourse.timeType
        this.dwtMaxValue = this.historyCourse.dwtMaxValue
        this.dwtMinValue = this.historyCourse.dwtMinValue
        this.startTime = this.historyCourse.startTime
        this.startTime = this.historyCourse.startTime
        if (this.historyCourse.historyLineData.length > 0) {
          this.historyLineData = this.historyCourse.historyLineData
          this.dataShow = true
        }
      }
      this.getPorts('')
      // 到货
      chinaPorts().then(response => {
        if (response && response.data && response.data.datas) {
          this.arrivePort = response.data.datas
        }
      })
    },
    methods: {
      // 日期格式化
      dateFormat(row, column) {
        var date = row[column.property]
        if (date === undefined || _.isEmpty(date) || date === '-') {
          return ''
        }
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      },
      // 点击定位船
      showShip(row, event, column) {
        Map.shipDetail(row.imo)
      },
      // 获取历史航线的船信息
      getHistoryLine() {
        if (this.fromPort === '') {
          // Loading Port Information can not be blank
          this.openMessageBox(i18n.t('history.loadingPortNull'))
          return
        }
        if (this.toPort === '') {
          this.openMessageBox(i18n.t('history.dischargePortNull'))
          return
        }
        if (this.startTime === '' || this.endTime === '') {
          this.openMessageBox(i18n.t('history.dateNull'))
          return
        }
        const startTime = new Date(this.startTime)
        const endTime = new Date(this.endTime)
        const searchData = {
          'fromPort': this.fromPort,
          'toPort': this.toPort,
          'sizeType': this.sizeType.toString(),
          'timeType': this.timeType,
          'dwtMaxValue': this.dwtMaxValue,
          'dwtMinValue': this.dwtMinValue,
          'startTime': startTime.getTime(),
          'endTime': endTime.getTime()
        }
        // 发货港，到货港，时间必填 sethistoryportDate
        this.$store.dispatch('sethistoryportDate', searchData).then((data) => {
          if (this.gethistoryportDate && !_.isEmpty(this.gethistoryportDate.data)) {
            this.historyLineData = this.gethistoryportDate.data
            this.dataShow = true
            this.downloadUrlCn = `${config.localPath}api/export/historyport.htm?fromPort=${this.fromPort}&toPort=${this.toPort}&sizeType=${this.sizeType}&timeType=${this.timeType}&dwtMaxValue=${this.dwtMaxValue}&dwtMinValue=${this.dwtMinValue}&startTime=${startTime.getTime()}&endTime=${endTime.getTime()}`
            this.downloadUrlEn = `${config.localPath}/api/export/en/historyport.htm?fromPort=${this.fromPort}&toPort=${this.toPort}&sizeType=${this.sizeType}&timeType=${this.timeType}&dwtMaxValue=${this.dwtMaxValue}&dwtMinValue=${this.dwtMinValue}&startTime=${startTime.getTime()}&endTime=${endTime.getTime()}`
          } else {
            this.openMessageBox(i18n.t('commonRemind.noMessage'))
          }
        }).catch(() => {
          // this.loading = false
        })
      },
      // 错误提示
      openMessageBox(content) {
        this.$alert(content, i18n.t('history.prompt'), {
          confirmButtonText: i18n.t('history.confirm')
        })
      },
      // 最小化参数
      miniOptions(route, data, vxName, vxSet, datas, status) {
        this.$router.push({ name: route })
        setTimeout(() => {
          this.historyLineData = data
          this.dataShow = true
          this.miniFlag = true
          this.$store.dispatch(vxName, { type: vxSet, data: datas })
        }, 0)
      },
      // table 最小化按钮
      minHide1() {
        this.dataShow = false
        this.miniFlag = false
        this.minimizePramas1 = Object.assign({}, this.minimizePramas1, {
          title: i18n.t(`history.historicRecord`),
          zoomAction: () => {
            this.miniOptions('history', this.gethistoryportDate.data, 'catchSetcuurentPort', 'SET_HISTORY_PORT_DATE', this.gethistoryportDate)
          }
        })
        this.$store.dispatch('minimizeWindows', this.minimizePramas1)
      },
      // tips 最小化
      miniHide() {
        this.dataShow = false
        this.tabShow = false
      },
      // 获取发货港口，到货港口
      getPorts(key) {
        // 发货
        port(key).then(response => {
          if (response && response.data && response.data.datas) {
            this.deliveryPort = response.data.datas
          }
        })
      },
      // 关闭
      handleClose(done) {
        this.$router.push({
          name: 'ship'
        })
        done()
      }
    }
  }
</script>
<style>
.history ul,
.history li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.history .history-search-list li {
  margin-bottom: 9px;
}
.history .el-date-editor.el-input,
.history .el-date-editor.el-input__inner,
.history .el-select {
  width: 140px;
  height: 26px;
  line-height: 26px;
}
.history .select .el-select {
  width: 215px;
}
.history .input .el-input {
  width: 100px;
}
.history .el-input--medium .el-input__inner {
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  background: rgba(0,0,0,0);/*firefox、chrome*/
  filter: alpha(opacity=100); /*IE*/
  border: 1px solid #DADADA;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
.history .el-checkbox-group {
  display: inline-block;
}
.history .el-radio__label,
.history .el-checkbox__label {
  font-family: ArialMT;
  font-size: 12px;
  color: #FFFFFF;
  letter-spacing: 0;
}
.history .el-checkbox__input.is-checked + .el-checkbox__label,
.history .el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}
.history .el-checkbox__input.is-checked .el-checkbox__inner,
.history .el-radio__input.is-checked .el-radio__inner{
  background-color: #FFA900;
  border-color: #FFA900;
}
.history .time .el-input--medium .el-input__inner {
  padding: 0 5px 0 25px;
}
.history .time .el-input__suffix-inner{
  display: none;
}
.history .el-input--medium .el-input__icon {
  line-height: 26px;
}
.history .el-input__prefix {
  left: 0;
}
.history .history-search-list li .block {
  font-size: 14px;
  color: #FFFFFF;
  letter-spacing: 0;
  line-height: 26px;
}
.history .history-search-list li .demonstration {
  display: inline-block;
  min-width: 70px;
  margin-right: 9px;
}
.language-en .history .history-search-list li .demonstration {
  min-width: 107px;
}
.history .history-search-list li .search-box {
  text-align: left;
  margin-top: 24px;
}
.search-box span{
  display: block;
  cursor: pointer;
  width: 70px;
  line-height: 26px;
  background-color: #FFA900;
  color: #fff;
  font-size: 14px;
  text-align: center;
  border-radius: 2px 2px 2px 2px;
}
.history-line-record {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
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
.history .history-table-box::-webkit-scrollbar{
  width: 5px;
  height: 5px;
  background-color: #d3d3d0;
}
.history .history-table-box::-webkit-scrollbar-thumb{
  background-color: #3794EF;
  border-radius: 10px;
}
.el-message-box__headerbtn .el-message-box__close {
  color: #303133;
}
/* .gutter{
  display: none;
} */
</style>
