<template>
    <div class="typhoon-wrap">
      <tips :width="isI18n ? '294px': '394px'"
            height='194px'
            right="46px"
            bottom="155px"
            :before-close="handleClose"
            :visible.sync='isShow'>
        <template slot="tipsContent">
          <div class="typhoon-radio">
            <el-radio v-model="radio" label="1" @change="typhoonChange">{{$t('typhoon.currentActive')}}</el-radio>
            <el-radio v-model="radio" label="2" @change="typhoonChange">{{$t('typhoon.timeRange')}}</el-radio>
          </div>
          <div class="typhoon-time-select" v-show="timeModule">
            <el-date-picker v-model="typhoonTime1" class="time-select"
                            size="mini" type="date" :placeholder="$t('typhoon.placeholder')"
                            :picker-options="pickerOptionsTyphoon1">
            </el-date-picker>
            <em>-</em>
            <el-date-picker v-model="typhoonTime2" class="time-select"
                            size="mini" type="date" :placeholder="$t('typhoon.placeholder')"
                            :picker-options="pickerOptionsTyphoon2">
            </el-date-picker>
          </div>
          <div class="typhoon-demo">
            <ul>
              <li>
                <div class="typhoon-circle bg-green"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.tropicalDepression')}}</div>
              </li>
              <li>
                <div class="typhoon-circle bg-blue"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.tropicalStorm')}}</div>
              </li>
              <li>
                <div class="typhoon-circle bg-yellow"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.strongTropicalStorm')}}</div>
              </li>
              <li>
                <div class="typhoon-circle bg-orange"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.typhoon')}}</div>
              </li>
              <li>
                <div class="typhoon-circle bg-pink"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.strongTyphoon')}}</div>
              </li>
              <li>
                <div class="typhoon-circle bg-red"></div>
                <div class="typhoon-list">{{$t('typhoon.typhoonStatus.superTyphoon')}}</div>
              </li>
            </ul>
          </div>
        </template>
        <template slot="tipsfooter">
          <div class="typhoon-search">
            <a href="javascript:;" @click="searchTyphoon">{{$t('typhoon.searchBtn')}}</a>
          </div>
        </template>
      </tips>
      <search-result
        v-if="isSeatchResult"
        :before-close="SearchResultFun"
        :detailedTyphoon="detailedTyphoon"
        :typhoonData="typhoonData">

      </search-result>

      <typhoon-dteail
        v-if="isDetail"
        :before-close="typhoonDteailFun"
        :typhoonPath="typhoonPath"
        :typhoonName="typhoonName">

      </typhoon-dteail>
    </div>
</template>
<script>
import tips from '../ui/tips/index'
import typhoonDteail from './typhoonDteail'
import searchResult from './searchResult'
import Map from '../map.js'
import moment from 'moment'
import {
  typhoonDataFun
} from '@/api/routemap'
export default {
  components: {
    tips,
    typhoonDteail,
    searchResult
  },
  name: 'typhoon',
  computed: {
    // ...mapGetters([
    //   'shipImo'
    //   // isI18n: language === 'zh'
    // ]),
    isI18n() {
      return this.$store.getters.language === 'zh'
    }
  },
  data() {
    return {
      isShow: false,
      isSeatchResult: false,
      isDetail: false,
      radio: '1',
      timeModule: false,
      typhoonData: [],
      typhoonPath: [],
      typhoonName: '',
      typhoonTime1: new Date(new Date() - (24 * 60) * 60 * 60 * 1000),
      typhoonTime2: new Date(),
      pickerOptionsTyphoon1: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      pickerOptionsTyphoon2: {
        disabledDate: (time) => {
          if (this.typhoonTime1) {
            const currentTime = this.typhoonTime1
            const threeMonths = currentTime.setMonth(currentTime.getMonth() + 2)
            currentTime.setMonth(currentTime.getMonth() - 2)
            return time.getTime() < this.typhoonTime1 || time.getTime() > threeMonths
          }
        }
      }
    }
  },
  mounted() {
    this.showSearchPirates()
  },
  methods: {
    // 关闭回调函数
    handleClose(done) {
      this.$router.push({
        name: 'ship'
      })
      done()
      Map.removeMap(Map.typhoonLineArr)
      Map.mapView.setZoom(2)
    },
    // 显示台风组件
    showSearchPirates() {
      this.isShow = !this.$route.query.flag
    },
    // 台风查询结果页面隐藏
    SearchResultFun() {
      this.isSeatchResult = false
    },
    // 显示搜索详情组件
    ifTyphoonDteail() {
      this.isDetail = true
    },
    // 隐藏搜索详情组件
    typhoonDteailFun() {
      this.isDetail = false
    },
    // 时间组件显示隐藏
    typhoonChange() {
      this.radio === '2' ? this.timeModule = true : this.timeModule = false
    },
    // 请求台风数据
    searchTyphoon() {
      const loading = Map.loadingFun(this)
      if (this.typhoonTime1 !== null && this.typhoonTime2 !== null) {
        let beginTime = ''
        let endTime = ''
        if (this.radio === '2') {
          beginTime = moment(this.typhoonTime1).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(this.typhoonTime2).format('YYYY-MM-DD HH:mm:ss')
        }
        const parameter = { beginTime, endTime }
        // 请求台风数据
        typhoonDataFun(parameter).then(response => {
          loading.close()
          if (response.status !== 401 && response && response.data && response.data.datas) {
            loading.close()
            this.typhoonData = response.data.datas
            Map.removeMap(Map.typhoonLineArr)
            // Map.removeCirleMarker()
            Map.drawingTyphoonFun(this.typhoonData)
            this.isSeatchResult = true
            Map.mapView.setZoom(2)
          }
        })
      } else {
        loading.close()
        this.$alert(`<span style="text-align: center; display: block; font-weight: bold;">${this.$t('commonRemind.pleaseDate')}</span>`, '', {
          dangerouslyUseHTMLString: true,
          showClose: false
        })
      }
    },
    // 台风详情
    detailedTyphoon(msg, name) {
      this.typhoonPath = msg
      this.typhoonName = name
      this.ifTyphoonDteail()
      // const typhoonLine = window.L.polyline(msg)
      // Map.mapView.fitBounds(typhoonLine.getBounds())
      Map.mapView.setView({ lat: msg[msg.length - 1].lat, lng: msg[msg.length - 1].lng }, 5)
    }
  },
  destroyed() {
    Map.initShip = true
    // Map.initPort()
    Map.initial()
    Map.removeMap(Map.typhoonLineArr)
  }
}
</script>
<style>
.typhoon-wrap{
  position: fixed;
  width: 294px;
  height: 194px;
  bottom: 155px;
  right: 46px;
  z-index: 1
}
.language-en .typhoon-wrap{
  width: 394px;
}
.typhoon-radio{
  width: 100%;
  height: 40px;
  white-space: nowrap;
}
.language-en .typhoon-radio{
  width: 100%;
  height: 20px;
  white-space: nowrap;
}
.language-en .typhoon-radio label{
  line-height: 20px;
}
.language-en .el-radio{
  width: 180px;
}
.typhoon-radio label{
  line-height: 40px;
}
.el-radio__input.is-checked + .el-radio__label{
  color: #ffd000;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #ffd000;
  background: #ffd000;
}
.el-radio__label{
  font-size: 12px;
}
.el-radio__inner{
  width: 10px;
  height: 10px;
}
.typhoon-time-select{
  width: 100%;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
}
.typhoon-wrap .el-date-editor.el-input, .typhoon-wrap .el-date-editor.el-input__inner{
  width: 120px;
  font-size: 10px;
}
.language-en .typhoon-wrap .el-date-editor.el-input, .language-en .typhoon-wrap .el-date-editor.el-input__inner{
  width: 145px;
}
.language-en .typhoon-demo ul li{
  width: 145px;
}
/*.language-en .typhoon-search{
  width: 0;
  margin-top: -13px;
}*/
.el-input__inner{
  background-color: rgba(33, 33, 33, 0.11);
  color: #fff;
  border-radius: 2px;
  border: 1px solid #dcdfe6;
}
.el-input--suffix .el-input__inner{
  padding-right: 0px;
}
.language-en .el-radio + .el-radio{
  margin-left: 0;
}
.typhoon-demo{
  width: 100%;
  height: 50px;
  margin-top: 10px;
}
.typhoon-demo ul{
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.typhoon-demo ul li{
  float: left;
  width: 83px;
  height: 25px;
  line-height: 25px;
}
.typhoon-circle{
  float: left;
  width: 10px;
  height: 10px;
  line-height: 10px;
  border-radius: 50%;
  margin-top: 7px;
}
.typhoon-list{
  float: left;
  font-size: 12px;
  color: #fff;
  line-height: 25px;
  margin-left: 5px;
}
.typhoon-search{
  width: 100%;
  height: 40px;
  line-height: 35px;
  text-align: left;
  margin-top: 5px;
}
.typhoon-radio label{
  color: #fff;
}
.typhoon-search a{
  text-align: center;
  line-height: 25px;
  border-radius: 2px;
  display: inline-block;
  width: 70px;
  height: 25px;
  background-color: #FFA900;
  color: #fff;
  font-size: 14px;
}
.bg-green{
  background-color: #34F533;
}
.bg-blue{
  background-color: #1D64FF;
}
.bg-yellow{
  background-color: #FDF100;
}
.bg-orange{
  background-color: #FC7116;
}
.bg-pink{
  background-color: #FF51F9;
}

.bg-red{
  background-color: #FF1616;
}
.clear-fix:after{content:".";display:block;height:0;visibility:hidden;clear:both;}

</style>
