<template>
  <div class="map-information">
    <div class="information-content">
      <div class="information-content-left">
        <div class="information-content-tab">
          <ul>
            <li :class="activeTab === index ? 'active' : ''" @click="selectTab(index)"  v-for='(item, index) in tabData' :key='index'>{{item}}</li>
          </ul>
          <div class="tab-line"></div>
        </div>
        <div class="information-first-content">
          <div class="information-first-img">
            <img :src="item" alt=""  v-if="activeTab === index" v-for='(item, index) in tabUrlData' :key='index'>
          </div>
          <div class="information-first-word">
            <div class="first-word-title" v-if='titleData0 && activeTab === 0'>
              <span @click="showInformationContent('one', titleData0.uuid)">{{titleData0.title}}</span>
              <span class="date">{{dateFormat(titleData0.release_date)}}</span>
            </div>
            <div class="first-word-title" v-if='titleData1 && activeTab === 1'>
              <span @click="showInformationContent('two', titleData1.uuid)">{{titleData1.title}}</span>
              <span class="date">{{dateFormat(titleData1.release_date)}}</span>
            </div>
            <div class="first-word-title" v-if='titleData2 && activeTab === 2'>
              <span @click="showInformationContent('fixture', titleData2.uuid)">{{titleData2.title}}</span>
              <span class="date">{{dateFormat(titleData2.release_date)}}</span>
            </div>
            <div class="first-word-title" v-if='titleData3 && activeTab === 3'>
              <span @click="showInformationContent(titleData3.protdate, titleData3.portId)">{{isLanguageZh ? titleData3.protdateCn+titleData3.portZh : titleData3.protdate+titleData3.portEn}} {{$t('portSearch.content.queuingPlan')}}</span>
              <span class="date">{{dateFormat(titleData3.release_date)}}</span>
            </div>
            <div v-if="activeTab === index" class="first-word-content" v-for='(item, index) in isLanguageZh ? tabTitleData : tabTitleDataEN' :key='index'>
              {{item}}
            </div>
          </div>
        </div>
        <div class="information-title-list">
          <ul>
            <li v-if="activeTab === 0 && index !== 0" v-for="(item, index) in informationList" :key="index" @click="showInformationContent('one', item.uuid)">
              <span>{{item.title}}</span>
              <span class="date">{{dateFormat(item.release_date)}}</span>
            </li>
            <li v-if="activeTab === 1 && index !== 0" v-for="(item, index) in informationList" :key="index" @click="showInformationContent('two', item.uuid)">
              <span>{{item.title}}</span>
              <span class="date">{{dateFormat(item.release_date)}}</span>
            </li>
            <li v-if="activeTab === 2 && index !== 0" v-for="(item, index) in informationList" :key="index" @click="showInformationContent('fixture', item.uuid)">
              <span>{{item.title}}</span>
              <span class="date">{{item.createDateDef}}</span>
            </li>
            <li v-if="activeTab === 3 && index !== 0" v-for="(item, index) in informationList" :key="index" @click="showInformationContent(item.protdate, item.portId)">
              <span>{{isLanguageZh ? item.protdateCn+item.portZh : item.protdate+item.portEn}} {{$t('portSearch.content.queuingPlan')}}
              </span>
              <span class="date">{{item.protdate}}</span>
            </li>
          </ul>
        </div>
        <div class="information-page" v-if='total > 0' >
          <el-pagination
            v-if="activeTab === 0"
            :current-page="currentPage"
            layout="prev, pager, next"
            @current-change="getOneTwoDataList"
            :total="total">
          </el-pagination>
          <el-pagination
            v-if="activeTab === 1"
            :current-page="currentPage"
            layout="prev, pager, next"
            @current-change="getOneTwoDataList"
            :total="total">
          </el-pagination>
          <el-pagination
            v-if="activeTab === 2"
            layout="prev, pager, next"
            :current-page="currentPage2"
            @current-change="getFixtureDataList"
            :total="total">
          </el-pagination>
          <el-pagination
            v-if="activeTab === 3"
            :current-page="currentPage3"
            layout="prev, pager, next"
            @current-change="getPortDataList"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="information-content-right">
        <div  class="information-right-content">
          <div v-if='isLanguageZh' class="right-content-title" @click="goToExponent">
            <span>最新成交指数</span>
            <span class="right-content-entity">
              >
            </span>
          </div>
          <div v-if='!isLanguageZh' class="right-content-title">
            <span>WS</span>
          </div>
          <div class="right-content-content">
            <div class="information-right-echart">
              <div ref="lineCharts" style="height:200px"></div>
            </div>
            <div class="information-right-list">
              <ul>
                <li v-for='(item, index) in underWSPointList' v-if="5 ? index < 5 : true" :key='index' @click='goUnderWSPoint(item.uuid)'>
                  <span>{{item.title}}</span>
                  <span class="date">{{dateFormat(item.release_date)}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="information-right-content" v-if='isLanguageZh'>
          <div class="right-content-title" @click="goToSubscibe">
            <span>行业分析专栏</span>
            <!-- <span v-if='!isLanguageZh'>Voice from Expert</span> -->
            <span class="right-content-entity">
              >
            </span>
          </div>
          <div class="right-content-content clearfix">
            <div class="float-div right-content-portrait-wrap" @click='goAuthoHomepager(infoMation.id)'>
              <div class="right-content-portrait">
                <img :src="infoMation.columnCover" alt="">
              </div>
            </div>
            <div @click='goAuthoHomepager(infoMation.id)' class="float-div right-center">
              <p>{{infoMation.authorName}}</p>
              <p>{{infoMation.columnClassifyName}}</p>
              <el-button type="warning" class="subscription" round v-if="infoMation.subStatus == 1">-订阅</el-button>
              <el-button type="warning" class="subscription" round v-if="infoMation.subStatus == 0">+订阅</el-button>
            </div>
            <div class="right-footer" @click='goSpecialArticle(infoMation.infoList[0].uuid)'>
              <p>{{infoMation.columnTitle}}</p>
              <p>{{infoMation.columnBrief}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import i18n from '@/lang'
import moment from 'moment'
import echarts from 'echarts'
import { infoListOS, fixtureListForward, portQueueList, infoMationFun, shipPointY, removeSubscribe, subscribeColumn } from '@/api/mapInformation'
// infoList
export default {
  components: { },
  name: 'mapInformation',
  data() {
    return {
      infoMation: {},
      total: 0,
      currentPage: 1,
      currentPage2: 1,
      currentPage3: 1,
      activeTab: 0,
      underWSPointList: null,
      informationList: [],
      titleData0: null,
      titleData1: null,
      titleData2: null,
      titleData3: null,
      tabData: [
        i18n.t('mapInformation.FreightMarket'),
        i18n.t('mapInformation.VoyageSchedule'),
        i18n.t('mapInformation.Fixtures'),
        i18n.t('mapInformation.Terminals')
      ],
      tabUrlData: [
        config.staticImagesPath + '/images/FreightMarket.jpg',
        config.staticImagesPath + '/images/VoyageSchedule.jpg',
        config.staticImagesPath + '/images/Fixtures.jpg',
        config.staticImagesPath + '/images/Terminals.jpg'
      ],
      tabTitleData: [
        '油轮运输市场报告，分析解读原油及成品油运输市场走势和成交水平。',
        '密切跟踪港口船货动态，港口预到港信息。',
        '中东/西非-远东航线租约信息，助力您做出更优的决策。',
        '船舶排队计划，帮助船东，货主优化航行靠泊计划，减少滞期发生。'
      ],
      tabTitleDataEN: [
        'Tanker transport market report provided, analyse crude oil shipping chartering trend and fixing levels.',
        'Ship tracking service and terminal monitor information, involving port pre-arrival notification.',
        'Middle East/West Africa to Far East fixtures collection, assisting your vessel chartering decision smarter.',
        'Terminal ship queue notification, assiting ship owners to optimize vessel berthing plan and reducing demurrage claim.'
      ]
    }
  },
  methods: {
    // 日期格式化
    dateFormat(ata) {
      if (!ata) {
        return ''
      }
      return moment(Number(ata)).format('YYYY-MM-DD')
    },
    // 日期格式化
    timeFormat(ata) {
      if (!ata) {
        return ''
      }
      return moment(Number(ata)).format('MM-DD')
    },
    selectTab(index) {
      this.activeTab = index
    },
    // 获取租约信息
    getFixtureDataList(val) {
      const obj = {
        pageNum: val,
        pageSize: 10
      }
      fixtureListForward(obj).then(response => {
        if (response && response.data && response.data.datas) {
          this.informationList = response.data.datas
          if (!this.titleData2) {
            this.titleData2 = response.data.datas[0]
          }
          this.total = response.data.total
          this.currentPage2 = response.data.pageNum
        }
      })
    },
    // 获取港口列表
    getPortDataList(val, code) {
      const obj = {
        pageNum: val,
        pageSize: 10
      }
      portQueueList(obj).then(response => {
        if (response && response.data && response.data.datas) {
          this.informationList = response.data.datas
          if (!this.titleData3) {
            this.titleData3 = response.data.datas[0]
          }
          this.total = response.data.total
          this.currentPage3 = response.data.pageNum
        }
      })
    },
    // 邮轮市场、船期报告
    getOneTwoDataList(val, code) {
      const obj = {
        channelMDesc: this.isLanguageZh ? 'ZX' : 'YYYW',
        channelCode: this.channelMDesc1,
        pageNum: val,
        pageSize: 10
      }
      // 获取船期报告
      if (this.activeTab === 1 && this.isLanguageZh) {
        obj.extend2 = '17CQ+原油船期'
      }
      if (this.activeTab === 1) {
        obj.channelCode = this.channelMDesc2
      }
      infoListOS(obj).then(response => {
        if (response && response.data && response.data.datas) {
          this.informationList = response.data.datas.infoList
          if (this.activeTab === 0) {
            if (!this.titleData0) {
              this.titleData0 = response.data.datas.infoList[0]
            }
          } else {
            if (!this.titleData1) {
              this.titleData1 = response.data.datas.infoList[0]
            }
          }
          this.total = response.data.total
          this.currentPage = response.data.pageNum
        }
      })
    },
    // echarts绘制
    setLineCharts(datas) {
      this.lineCharts = echarts.init(this.$refs.lineCharts)
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '',
            type: 'line',
            stack: '',
            data: []
          },
          {
            name: '',
            type: 'line',
            stack: '',
            data: []
          }
        ]
      }
      for (var i = 0; i < datas.length; i++) {
        option.legend.data.push(datas[i].diliveryRegion)
        option.series[i].name = datas[i].diliveryRegion
        for (var j = 0, k = datas[i].dataList.length - 1; j < datas[i].dataList.length; j++, k--) {
          if (i === 0) {
            option.xAxis.data.push(datas[i].dataList[k].releaseDate)
          }
          option.series[i].data.push(datas[i].dataList[k].point)
        }
      }
      this.lineCharts.setOption(option)
    },
    // 获取echarts的数据
    getShipPointY() {
      shipPointY().then(response => {
        if (response && response.data && response.data.datas) {
          this.setLineCharts(response.data.datas)
        }
      })
    },
    showInformationContent(key, uuid) {
      this.$router.push({ name: 'informationDetails', params: { uuid: uuid, key: key }})
    },
    goUnderWSPoint(uuid) {
      window.open(config.SLD.info + 'page/#/newDetails?uuid=' + uuid)
    },
    goAuthoHomepager(id) {
      window.open(config.SLD.info + 'page/#/zlDetails?id=' + id)
    },
    goSpecialArticle(uuid) {
      window.open(config.SLD.info + 'page/#/ZLactive?uuid=' + uuid)
    },
    goToExponent() {
      window.open(config.SLD.info + 'page/#/newList/sczx/hyxw')
    },
    // 作者专栏订阅
    subscibe(id) {
      subscribeColumn({ columnId: id }).then(response => {
        if (response && response.status === 0) {
          this.infoMation.subStatus = 1
        }
      })
    },
    // 取消订阅
    cancelSubscibe(id) {
      removeSubscribe({ columnId: id }).then(response => {
        if (response && response.status === 0) {
          this.infoMation.subStatus = 0
        }
      })
    },
    // 文章页面
    goToSubscibe() {
      window.open(config.SLD.info + 'page/#/columnList')
    }
  },
  watch: {
    activeTab(newValue, oldValue) {
      if (newValue === 0 || newValue === 1) {
        this.getOneTwoDataList(1)
      }
      if (newValue === 2) {
        this.getFixtureDataList(1)
      }
      if (newValue === 3) {
        this.getPortDataList(1)
      }
    }
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    }
  },
  mounted() {
    if (this.isLanguageZh) {
      this.channelMDesc1 = 'YLSC'
      this.channelMDesc2 = 'HYXW'
    } else {
      this.channelMDesc1 = 'YLSC_EN'
      this.channelMDesc2 = 'HYXW_EN'
    }
    this.getOneTwoDataList(1)
    this.getShipPointY()
    infoListOS({ channelMDesc: 'ZX', channelCode: 'HYXW', pageNum: '1', pageSize: '10' }).then(response => {
      if (response && response.data && response.data.datas) {
        this.underWSPointList = response.data.datas.infoList
      }
    })
    // infoList({ channelName: '油价与相关指数' }).then(response => {
    //   if (response && response.data && response.data.datas) {
    //     this.underWSPointList = response.data.datas.infoList
    //   }
    // })
    infoMationFun().then(response => {
      if (response && response.data && response.data.datas) {
        this.infoMation = response.data.datas[0]
      }
    })
  }
}
</script>

<style>
ul, li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.map-information {
  width: 1160px;
  height: 100%;
  margin: auto;
  font-size: 14px;
}
.information-content{
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
}
.information-content .information-content-left{
  width: 830px;
}
.information-content .information-content-right{
  width: 280px;
}
.information-content-tab ul{
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  -o-justify-content: flex-start;
  justify-content: flex-start;
}
.information-content-tab ul li{
  line-height: 40px;
  border-bottom: 2px solid transparent;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 600;
  cursor: pointer;
}
.information-content-tab .tab-line{
  height: 1px;
  background-color: #ececec;
}
.information-content-tab ul li.active{
  border-bottom: 2px solid #FFA900;
  color: #FFA900;
}
.information-first-content {
  margin-top: 20px;
  padding-right: 10px;
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
}
.information-first-content .information-first-img img {
  width: 160px;
  height: 160px;
  border-radius: 5px;
}
.information-first-content .information-first-word {
  width: 634px;
  height: 160px;
}
.information-first-content .information-first-word  .first-word-title{
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
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
  line-height: 22px;
  margin-bottom: 9px;
}
.information-first-content .information-first-word  .first-word-title span:nth-child(1){
  width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.information-first-content .information-first-word  .first-word-title .date{
  font-size: 12px;
  color: #666666;
}
.information-first-content .information-first-word  .first-word-content{
  font-family: MicrosoftYaHei;
  font-size: 16px;
  color: #333;
  letter-spacing: 0;
  line-height: 22px;
}
.information-title-list{
  margin-top: 23px;
}
.information-title-list ul li{
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  line-height: 40px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
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
}
.information-title-list ul li .date{
  font-size: 12px;
  color: #666666;
}
.information-title-list ul li span:nth-child(1){
  display: inline-block;
  width: 700px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.information-page {
  text-align: center;
  margin-top: 100px;
}
.information-page .el-pagination .btn-prev,
.information-page .el-pagination .btn-next,
.information-page .el-pager li {
  background-color: transparent;
  font-size: 12px;
}
.information-right-content .right-content-title {
  line-height: 40px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;
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
}
.information-right-content .right-content-content {
  padding: 14px 5px;
  line-height: 24px;
  background: rgba(255,255,255,0.40);
  border: 1px solid #ECECEC;
  border-radius: 2px;
}
.information-right-content .information-right-echart {
  width: 100%;
}
.information-right-content .information-right-list ul li {
  font-size: 12px;
  color: #666666;
  padding: 0 6px;
  cursor: pointer;
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
}
.right-content-content .right-content-portrait-wrap{
  width: 90px;
  height: 90px;
}
.right-content-content .right-content-portrait,.right-content-content .right-content-portrait img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.right-content-content .float-div{
  float: left;
}
.information-first-content .information-first-word  .first-word-title span:nth-child(1):hover,
.information-right-content .information-right-list ul li:hover
.information-title-list ul li:hover,
.information-page .el-pager li:hover,
.information-page .el-pager li.active{
  color: #FFA900;
  cursor: pointer;
}
.right-center{
  width: auto;
  padding-left: 30px;
}
p{
  padding: 0;
  margin: 0;
}
.right-center p{
  line-height: 30px;
}
.right-center p:nth-child(1){
  font-size: 18px;
  color: #333;
}
.right-center p:nth-child(2){
  font-size: 14px;
  color: #666;
}
.right-footer{
  width: 100%;
  height: 120px;
  margin-top: 90px;
  padding:15px 5px 0;
  box-sizing: border-box;
  cursor: pointer;
}
.right-footer p:nth-child(1){
  font-size: 14px;
  color: #333;
  line-height: 20px;
}
.right-footer p:nth-child(2){
  padding-top: 10px;
  font-size: 12px;
  color: #666;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient: vertical;
}
.right-footer p:nth-child(3){
  line-height: 30px;
  color: #999;
  font-size: 12px;
}
.subscription.el-button--medium {
  color: #333;
  background-color: #ffcc00;
  padding: 6px 12px;
  font-size: 12px;
}
</style>
