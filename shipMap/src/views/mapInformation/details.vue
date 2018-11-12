<template>
  <div class="information-details">
    <div class="information-details-nav">
      <span class='details-nav-big' @click='goBack'>{{$t(`mapInformation.information`)}}</span>
      <span class='details-nav-arrows'>></span>
      <span class="details-nav-small">{{$t(`mapInformation.mainBody`)}}</span>
    </div>
    <div ref="detailsContent">
      <div v-if='key === "one" && detailsInformation' class="info-details-one">
        <div class="details-title-box">
          <div class="details-title-name">{{detailsInformation.title}}</div>
          <div class="details-information">
            <span>
              <svg-icon class="setting"  icon-class="Author" />
              {{$t(`mapInformation.Author`)}} {{detailsInformation.author}}
            </span>
            <span>
              <svg-icon class="setting"  icon-class="Views" />
              {{$t(`mapInformation.Views`)}} {{detailsInformation.browseCount}}
            </span>
            <span>
              <svg-icon class="setting"  icon-class="Source" />
              {{$t(`mapInformation.Source`)}} {{detailsInformation.origin}}
            </span>
            <span>{{detailsInformation.releaseDate}}</span>
          </div>
        </div>
        <div class="information-details-content" v-html="detailsInformation.textHtml">
        </div>
        <div v-if="isLanguageZh" class="disclaimer">
          免责声明：本文非买原油原创，以上仅代表作者个人观点。
        </div>
        <div v-if="!isLanguageZh" class="disclaimer">
          Disclaimer: this article is not original from mycrudeoil.com, which only represent author’s personal perspective.
        </div>
        <div class="information-details-footer">
          <div class="item" v-if='detailsInformation.preTitle' @click='showInformationContent("one", detailsInformation.preUuid)'>{{$t(`mapInformation.Prev`)}}:{{detailsInformation.preTitle}}</div>
          <div class="item" v-if='detailsInformation.nextTitle' @click='showInformationContent("one", detailsInformation.nextUuid)'>{{$t(`mapInformation.Next`)}}:{{detailsInformation.nextTitle}}</div>
        </div>
      </div>
      <div v-if='key === "two" && detailsInformation' class="info-details-tow">
        <div class="details-title-box">
          <div class="details-title-name">{{detailsInformation.title}}</div>
          <div class="details-information">
            <span>{{$t(`mapInformation.Author`)}} {{detailsInformation.author}}</span>
            <span>{{$t(`mapInformation.Views`)}} {{detailsInformation.browseCount}}</span>
            <span>{{$t(`mapInformation.Source`)}} {{detailsInformation.origin}}</span>
            <span>{{detailsInformation.releaseDate}}</span>
          </div>
        </div>
        <div class="information-details-content">
          <div class="table-title" v-html='detailsInformation.textHtml'>
          </div>
          <div v-if="isLanguageZh" class="disclaimer">
            免责声明：本文非买原油原创，以上仅代表作者个人观点。
          </div>
          <div v-if="!isLanguageZh" class="disclaimer">
            Disclaimer: this article is not original from mycrudeoil.com, which only represent author’s personal perspective.
          </div>
          <div class="information-details-footer" v-if='detailsInformation && isLanguageZh'>
            <div class="item" v-if='detailsInformation.preTitle' @click='showInformationContent("two", detailsInformation.preUuid)'>{{$t(`mapInformation.Prev`)}}:{{detailsInformation.preTitle}}</div>
            <div class="item" v-if='detailsInformation.nextTitle' @click='showInformationContent("two", detailsInformation.nextUuid)'>{{$t(`mapInformation.Next`)}}:{{detailsInformation.nextTitle}}</div>
          </div>
        </div>
      </div>
      <!--  :style='{top: echartsTop}' -->
      <!-- <div class="echarts-box" v-show='key === "two"'>
        <div ref="lineCharts" style="height:300px"></div>
        
      </div> -->
      <!-- 租约信息 -->
      <div v-if='key === "fixture" && detailsInformation' class="find-fixture-details">
        <div class="details-title-box">
          <div class="details-title-name">{{detailsInformation.admin.title}}</div>
          <div class="details-information">
            <span>{{detailsInformation.admin.createDate}}</span>
          </div>
        </div>
        <table class='information-details-table'>
          <thead>
            <tr>
              <th>Vessel Name</th>
              <th>IMO</th>
              <th>Built</th>
              <th>Charterer</th>
              <th>Operator</th>
              <th>Trade</th>
              <th>Rate</th>
              <th>Reported Date</th>
              <th>Status</th>
              <th>LayCan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailsInformation.sub" :key="index">
              <td>{{item.vesselName}}</td>
              <td>{{item.imo}}</td>
              <td>{{item.built}}</td>
              <td v-if="index === 1 || index === 0">{{item.charterer}}</td>
              <td v-if="index !== 1 && index !== 0">*****</td>
              <td v-if="index === 1 || index === 0">{{item.operator}}</td>
              <td v-if="index !== 1 && index !== 0">*****</td>
              <td>{{item.trade}}</td>
              <td>{{item.rate}}</td>
              <td>{{item.reportedDate}}</td>
              <td v-if='item.status == 1'>On Subs</td>
              <td v-if='item.status == 2'>Failed</td>
              <td v-if='item.status == ""'></td>
              <td>{{item.laycan}}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="isLanguageZh" class="disclaimer">
          免责声明：本文数据仅供参考。
        </div>
        <div v-if="!isLanguageZh" class="disclaimer">
          Disclaimer: All above viewpoint from good faith, disclaim of any liability.
        </div>
      </div>
      <!-- 港口排队 -->
      <div v-if='key !== "one" && key !== "two" && key !== "fixture"' class="home-berthPlan-details">
        <div class="details-title-box" v-if="detailsInformation">
          <div class="details-title-name">{{detailsInformation.Object.title}}</div>
          <div class="details-information">
            <span>{{detailsInformation.Object.dates}}</span>
          </div>
        </div>
        <table class='information-details-table' v-if="detailsInformation">
          <thead>
            <tr>
              <th>{{$t(`mapInformation.shipName`)}}</th>
              <th>{{$t(`mapInformation.shipType`)}}</th>
              <th>{{$t(`mapInformation.cargo`)}}</th>
              <th>{{$t(`mapInformation.cargoQuantity`)}}</th>
              <th>{{$t(`mapInformation.draft`)}}</th>
              <th>{{$t(`mapInformation.onOnePort`)}}</th>
              <th>{{$t(`mapInformation.estimatedTime`)}}</th>
              <th>{{$t(`mapInformation.InAdvanceBy`)}}</th>
              <th>{{$t(`mapInformation.InAdvanceLeave`)}}</th>
              <th>{{$t(`mapInformation.berth`)}}</th>
              <th>{{$t(`mapInformation.status`)}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailsInformation.list" :key="index">
              <td>{{item.name}}</td>
              <td>{{item.type}}</td>
              <td>{{item.goods}}</td>
              <td>{{item.quantity}}</td>
              <td>{{item.draft}}</td>
              <td>{{isLanguageZh ? item.lastPortZh : item.lastPort }}</td>
              <td>{{item.exArriveDef}}</td>
              <td>{{item.exNearDef}}</td>
              <td>{{item.exLeaveDef}}</td>
              <td>{{item.berth}}</td>
              <td>{{item.status === '1' ? $t(`mapInformation.inPort`) : $t(`mapInformation.estimatedArrival`) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="isLanguageZh" class="disclaimer">
          免责声明：本文数据仅供参考。
        </div>
        <div v-if="!isLanguageZh" class="disclaimer">
          Disclaimer: All above viewpoint from good faith, disclaim of any liability.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { infoDetail, findFixtureDetail, homeBerthPlanDetail } from '@/api/mapInformation'
export default {
  name: 'mapInformation',
  data() {
    return {
      echartsTop: null,
      detailsInformation: null,
      key: this.$route.params.key,
      uuid: this.$route.params.uuid
    }
  },
  methods: {
    // 时间戳格式化
    dateFormat(ata) {
      if (!ata) {
        return ''
      }
      return moment(Number(ata)).format('YYYY-MM-DD')
    },
    selectTab(index) {
      this.activeTab = index
    },
    // 获取租约信息详情
    getFixtureDataList() {
      findFixtureDetail({ uuid: this.uuid }).then(response => {
        if (response && response.data && response.data.datas) {
          this.detailsInformation = response.data.datas
        }
      })
    },
    // 获取邮轮市场、船期报告详情
    getInfoDetail() {
      infoDetail(this.uuid).then(response => {
        if (response && response.data && response.data.datas) {
          this.detailsInformation = response.data.datas
        }
      })
    },
    // lineCharts echart图
    setOption() {
      var lineCharts = echarts.init(this.$refs.lineCharts)
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
      var objArr = this.detailsInformation.echartList
      for (var i = 0; i < objArr.length; i++) {
        if (i === 0) {
          for (var j = objArr[0].dataList.length - 1; j >= 0; j--) {
            option.xAxis.data.push(objArr[0].dataList[j].releaseDate)
          }
        }
        option.legend.data.push(objArr[i].diliveryRegion)
      }
      for (var l = objArr[0].dataList.length - 1; l >= 0; l--) {
        option.series[0].data.push(objArr[0].dataList[l].point)
      }
      for (var k = objArr[1].dataList.length - 1; k >= 0; k--) {
        option.series[1].data.push(objArr[1].dataList[k].point)
      }
      option.series[0].name = objArr[0].diliveryRegion
      option.series[1].name = objArr[1].diliveryRegion
      lineCharts.setOption(option)
    },
    goBack() {
      this.$router.push({ name: 'mapInformation' })
    },
    // 上一篇下一篇
    showInformationContent(key, uuid) {
      this.$router.push({ name: 'informationDetails', params: { uuid: uuid, key: key }})
    },
    // 获取港口排队信息详情
    getHomeBerthPlanDetail() {
      homeBerthPlanDetail({ protId: this.uuid, currentDate: this.key }).then(response => {
        if (response && response.data && response.data.datas) {
          this.detailsInformation = response.data.datas
        }
      })
    }
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    }
  },
  mounted() {
    if (this.key === 'one' || this.key === 'two') {
      this.getInfoDetail()
    } else if (this.key === 'fixture') {
      this.getFixtureDataList()
    } else {
      this.getHomeBerthPlanDetail()
    }
  }
}
</script>

<style>
ul, li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.information-details {
  width: 1180px;
  margin: auto;
  height: 80%;
}
.information-details .disclaimer{
  font-size: 12px;
  color: #999999;
  letter-spacing: 0;
  margin-bottom: 50px;
}
.information-details::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background-color: #d3d3d0;
}
.information-details::-webkit-scrollbar-thumb{
  width: 8px;
  background-color: #3B99FC;
  border-radius: 3px;
}
.information-details-nav{
  font-size: 14px;
  color: #333;
  line-height: 20px;
}
.information-details-nav .details-nav-big{
  cursor: pointer;
}
.information-details-nav .details-nav-arrows{
  margin: 0 10px;
}
.information-details-nav .details-nav-small{
  color: #3F3F3F;
}
.details-title-box {
  margin: 30px 0;
  text-align: center;
}
.details-title-box .details-title-name{
  font-size: 20px;
  line-height: 48px;
  color: #333333;
  letter-spacing: 0;
}
.details-title-box .details-information .setting{
  color: #d8d8d8;
}
.details-title-box .details-information{
  width: 480px;
  margin: auto;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-around;
  -moz-justify-content: space-around;
  -ms-justify-content: space-around;
  -o-justify-content: space-around;
  justify-content: space-around;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 22px;

}
.information-details-table {
  border: 1px solid #DADADA;
  width: 100%;
  text-align:center;
  border-collapse:collapse;
  border-spacing:0;
  font-size: 14px;
  margin-bottom: 40px;
}
.information-details-table tr th,
.information-details-table tr td{
  border-bottom: 1px solid #DADADA;
  border-right: 1px solid #DADADA;
  line-height: 38px;
}
.information-details-footer{
  margin-bottom: 40px;
}
.information-details-footer .item{
  font-size: 14px;
  line-height: 34px;
  color: #333333;
  letter-spacing: 0;
  cursor: pointer;
}
.information-details-footer .item:hover{
  text-decoration: underline;
  color: #FFA900;
}
.information-details-content .table-title{
  text-align: center;
  margin-bottom: 30px;
}
/* .information-details-content .special{
  margin-bottom: 340px;
} */
.information-details-content .special tr th{
  background-color: #389bf3;
  color: #fff;
}
/* .echarts-box{
  position: relative;
  padding:20px;
  width: 100%;
  height: 300px;
  top: -390px;
} */
/* .home-berthPlan-details {
  position: relative;
  top: -280px;
} */
</style>
