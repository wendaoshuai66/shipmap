<template>
  <div class="port-list-all-wrap">
    <map-dialog
      self-class="maxIndex"
      :drag='1'
      :width="isI18n? '340px' : '440px'"
      right="346px"
      top="154px"
      :left="leftNumber"
      :before-close="beforeClose"
      :visible.sync='isShow'>
      <template slot="title">
        <div class="port-header">
          <span class="port-header-i"><svg-icon class="font18" icon-class="gangkouchaxun-01" /></span>
          <span class="font14">{{$t('portListsAll.PortDetails')}}</span>
        </div>
      </template>
      <div class="port-center">
        <div class="port-details-img-wrap" v-if="portListAll.accessory.type == 1 && portListAll.accessory.type != null">
          <el-carousel trigger="click">
            <el-carousel-item v-for="item in portListAll.accessory.fileList" :key="item" height="150px">
              <img :src="item" alt="">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="port-details-video-wrap" v-if="portListAll.accessory.type == 2 && portListAll.accessory.type != null">
          <video v-for="(item, index) in portListAll.accessory.fileList" :key="index" :src="item" controls="controls" width="320" height="150" controlsList="nodownload"></video>
        </div>
      </div>
      <template slot="footer">
        <div class="port-footer">
          <div class="port-address">{{isI18n? getPortListAllInit.nameCn: getPortListAllInit.nameEn}}</div>
          <div class="port-nav">
            <span>{{isI18n? getPortListAllInit.countryCn: getPortListAllInit.countryEn}}</span>
            <label v-if="portListAll.seaport.weathers && portListAll.seaport.weathers.length !== 0 && portListAll.seaport.weathers[0].weatherEn != null"
                   :title="$t('portListsAll.portWeather')"
            @click="portWeather">
              <span>{{isI18n? portListAll.seaport.weathers[0].weather: portListAll.seaport.weathers[0].weatherEn}}</span>
              <i><svg-icon class="font18" icon-class="qixiang" /></i>
            </label>
            <el-button type="primary" v-show="portListAll.accessory.type != null" @click="portDetailsInfo()">{{$t('portListsAll.detail')}}</el-button>
          </div>
          <div class="port-menu">
            <label @click="searchPort(getPortListAllInit.nameEn,0)" v-if="portListAll.foreign == 0">
              <i class="port-i-style-1"><svg-icon class="font18" icon-class="fujindechuan" /></i>
              <span>{{$t(`portListsAll.nearbyBoat`)}}</span>
            </label>
            <label @click="searchPort(getPortListAllInit.nameEn,1)" v-if="portListAll.country == 1">
              <i class="port-i-style-2"><svg-icon class="font18" icon-class="yujidaogang" /></i>
              <span>{{$t(`portSearch.content.portList[1].Currently`)}}</span>
            </label>
            <label  @click="searchPort(getPortListAllInit.nameEn,2)" v-if="portListAll.country == 1">
              <i class="port-i-style-3"><svg-icon class="font18" icon-class="lishidaogang" /></i>
              <span>{{$t(`portSearch.content.portList[2].Currently`)}}</span>
            </label>
            <label  @click="portQueuingClick(getPortListAllInit.nameEn)" v-if="portListAll.berthPlan.length !== 0">
              <i class="port-i-style-4"><svg-icon class="font18" icon-class="lishidaogang" /></i>
              <span>{{$t('portListsAll.lineUp')}}</span>
            </label>
          </div>
        </div>
      </template>
    </map-dialog>
    <port-list-info v-if="portDetailInfoVisible" :before-close="handleClose" :portInfo="portInfo">

    </port-list-info>
    <port-weather v-if="portWeatherVisible" :portWeatherClose="portWeatherClose">

    </port-weather>
    <port-queuing v-if="portQueuingVisible" :portQueuingClose="portQueuingClose" :postLists="postLists">

    </port-queuing>
  </div>
</template>

<script>
  // import store from '@/store'
  import tips from '../ui/tips/index'
  import portListInfo from './portListInfo'
  import portWeather from './portWeather'
  import portQueuing from './portQueuing'
  import { portQueueList } from '@/api/mapInformation'
  import i18n from '@/lang'
  import _ from 'lodash'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import {
    portDetailInfoData
  } from '@/api/routemap'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'portListsAll',
    components: {
      tips,
      mapDialog,
      portDetailInfoData,
      portListInfo,
      portWeather,
      portQueuing
    },
    computed: {
      ...mapGetters([
        'portListAll',
        'getPortListAllInit'
        // isI18n: language === 'zh'
      ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    props: {
      beforeClose: Function
    },
    data() {
      return {
        isShow: true,
        portDetailInfoVisible: false,
        portWeatherVisible: false,
        portQueuingVisible: false,
        postLists: [],
        portInfo: {},
        leftNumber: '530px'
      }
    },
    watch: {
      portListAll(newValue, oldValue) {
        if (newValue && newValue.seaport.nameEn !== oldValue.seaport.nameEn) {
          this.portDetailInfoVisible = false
          this.portWeatherVisible = false
          this.portQueuingVisible = false
        }
      }
    },
    methods: {
      handleClose(done) {
        this.portDetailInfoVisible = false
        done()
      },
      portWeatherClose(done) {
        this.portWeatherVisible = false
        done()
      },
      portQueuingClose(done) {
        this.portQueuingVisible = false
        done()
      },
      portDetailsInfo() {
        portDetailInfoData(this.portListAll.seaport.nameEn).then(response => {
          if (response && response.data && response.data.datas) {
            this.portDetailInfoVisible = true
            this.portInfo = response.data.datas
          }
        })
      },
      searchPort(data, flag) {
        this.$router.push({
          name: 'portSearch'
        })
        const datas = {
          flag: flag,
          portName: data
        }
        // store.dispatch('getPortFlag', datas)
        this.$router.push({ name: 'portSearch', query: datas })
      },
      portWeather() {
        this.portWeatherVisible = true
      },
      portQueuingClick(name) {
        const obj = {
          pageNum: 1,
          pageSize: 5,
          protNameEn: name,
          flag: 1
        }
        portQueueList(obj).then(response => {
          if (response && !_.isEmpty(response.data) && !_.isEmpty(response.data.datas)) {
            this.postLists = response.data.datas
            this.portQueuingVisible = true
          } else {
            this.$alert(i18n.t('commonRemind.portPlanTips'), i18n.t('history.prompt'))
          }
        })
      }
    },
    mounted() {
      const dalogNumber = document.querySelectorAll('.detail')
      if (dalogNumber.length > 0) {
        this.leftNumber = '530px'
      }
    },
    destroyed() {
      this.portDetailInfoVisible = false
      this.portWeatherVisible = false
      this.portQueuingVisible = false
    }
  }
</script>

<style>
.port-list-all-wrap{
  color: #fff;
}
.port-list-all-wrap .port-header{
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.port-header .port-header-i{
  color: #FFCC00;
  margin: 15px 0px 0px 10px;
  vertical-align: middle;
}
.port-list-all-wrap .port-center{
  text-align: center;
  max-width: 100%;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.port-list-all-wrap .port-details-img-wrap{
  margin: 0 10px;
  height: 150px;
}
.port-list-all-wrap .el-carousel__container{
  height: 150px;
}
.port-list-all-wrap .port-details-img-wrap img{
  max-height: 100%;
  max-width: 100%;
}
.port-list-all-wrap .port-details-video-wrap{
  text-align: center;
  width: 100%;
  height: 150px;
}
.port-list-all-wrap .port-details-video-wrap video{
  max-width: 100%;
  max-height:100%;
}
/*.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}*/

.port-list-all-wrap .port-footer{
  font-size: 12px;
  font-weight: 500;
}
.port-list-all-wrap .port-address{
  font-size: 16px;
  text-align: left;
}

.port-list-all-wrap .port-nav{
  position: relative;
  text-align: left;
  font-size: 14px;
  height: 28px;
  line-height: 28px;
  margin-top: 10px;
}
.port-list-all-wrap .el-button--primary{
  position: absolute;
  top: 0px;
  right: 0;
  background-color: #FFCC00;
  border: none;
  width: 70px;
  height: 28px;
  line-height: 28px;
  padding: 0;
}

.port-list-all-wrap .el-button:hover, .el-button:focus{
  background-color: #FFCC00;
}

.port-list-all-wrap .el-button--primary:active{
  background-color: #ffa506;
}

.port-list-all-wrap .port-nav span,.port-list-all-wrap .port-nav label,.port-list-all-wrap .port-nav label span{
  display: inline-block;
}
.port-list-all-wrap .port-nav label{
  cursor: pointer;
  margin-left: 10px;
  font-weight: 500;
}
.port-list-all-wrap .port-menu{
  width: 100%;
  height: 30px;
  margin-top: 10px;
  border-top: 1px solid #242424;
  text-align: left;
  white-space: nowrap;
}
.port-list-all-wrap .port-menu label{
  width: 80px;
}
.language-en .port-list-all-wrap .port-menu label:nth-child(1){
   width: 85px;
}
.language-en .port-list-all-wrap .port-menu label:nth-child(2){
  width: 145px;
}
.language-en .port-list-all-wrap .port-menu label:nth-child(3){
  width: 115px;
}
.language-en .port-list-all-wrap .port-menu label:nth-child(4){
  width: 70px;
}
.port-list-all-wrap .port-menu label,.port-list-all-wrap .port-menu label span{
  cursor: pointer;
  display: inline-block;
  font-weight: 500;
  font-size: 12px;
  line-height: 40px;
  height: 30px;
}

.port-list-all-wrap .port-menu label:active span{
  color: #FFA900;
}

.port-list-all-wrap .port-menu label i{
  font-size: 16px;
  vertical-align: middle;
}

.port-list-all-wrap .port-menu .port-i-style-1{
  color: #2C75E2;
}
.port-list-all-wrap .port-menu .port-i-style-2{
  color: #3CB88F;
}
.port-list-all-wrap .port-menu .port-i-style-3{
  color: #E28D2C;
}
.port-list-all-wrap .port-menu .port-i-style-4{
  color: #2C75E2;
}
</style>
