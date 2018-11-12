<template>
    <map-dialog v-if="dataShow" class="weather-tabs-content" :drag="{dragTitle: '.el-tabs__nav-wrap'}" :visible.sync='dataShow' :beforeClose = 'beforeClose1' width='460px' top="100px" left='550px' >
      <template>
         <div class="weather-time-zoom">
            {{`GMT[${tabLists[0].zone}]`}}
          </div>
      <el-tabs v-model="activeName" >
        <el-tab-pane v-for="(item, index) in tabLists" :label="`${item.time}${$t('detail.weather.rdMay')}`" :name='names[index]' :key="index">
          <div class="weather-tab-high">
            <el-row>
              <el-col :span="12" class="weather-tab-high-title" v-for="(item1,index) in item.tides.higWaters" :key="index"><span>{{$t('detail.weather.Hightide')}}:</span><span>{{item1.waterTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{item1.water}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="weather-tab-high-title" v-for="(item1,index) in item.tides.lowWaters" :key="index"><span>{{$t('detail.weather.Lowtide')}}:</span><span>{{item1.waterTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{item1.water}}</span></el-col>
            </el-row>
          </div>
          <div class="weather-tab-item" v-for="(item2,index) in item.weathers" :key="index" >
            <el-row>
              <el-col :span:="24">
                <div class="">{{item2.date}}{{$t('detail.weather.hours')}}&nbsp;&nbsp; {{isLanguageZh ? item2.weather : item2.weatherEn}}</div>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="4">
                <div class="weather-tab-time">
                <img :src="item2.iconurl" alt="">
              </div>
            </el-col>
            <el-col class="weather-right-content" :span="19">
                <el-row class="weather-item-line">
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8" :title="$t('detail.weather.pressure')">
                          {{$t('detail.weather.pressure')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.pressure">
                          {{item2.pressure}}mb
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row>
                        <el-col  class="weather-item-name" :span="8" :title="$t('detail.weather.Wind')">
                          {{$t('detail.weather.Wind')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.winddirection/item2.windspeed">
                          {{item2.winddirection}}/{{item2.windspeed}}节
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8" :title="$t('detail.weather.Waveheight')">
                          {{$t('detail.weather.Waveheight')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.wave">
                          {{item2.wave}}m
                        </el-col>
                      </el-row>
                    </el-col>
                </el-row>
                <el-row class="weather-item-line">
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8" :title="$t('detail.weather.Swell')">
                          {{$t('detail.weather.Swell')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.current">
                          {{item2.current}}m
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8" :title="$t('detail.weather.Temp')">
                          {{$t('detail.weather.Temp')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.temperature">
                          {{item2.temperature}}℃
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8" :title="$t('detail.weather.Humidity')">
                          {{$t('detail.weather.Humidity')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16" :title="item2.humidity">
                          {{item2.humidity}}%
                        </el-col>
                      </el-row>
                    </el-col>
                </el-row>
                <el-row class="weather-item-line">
                    <el-col :span="8">
                      <el-row>
                        <el-col class="weather-item-name" :span="8">
                          {{$t('detail.weather.Dewpoint')}}:
                        </el-col>
                        <el-col class="weather-item-text" :span="16">
                          {{item2.dew}}℃
                        </el-col>
                      </el-row>
                    </el-col>
                </el-row>
            </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
  </template>
  </map-dialog>
</template>

<script>
import {
  forecast
} from '@/api/routemap'
// import store from '@/store'
// import moment from 'moment'
import _ from 'lodash'
import {
  mapGetters
} from 'vuex'
import store from '@/store'
import mapDialog from '@/views/routemap/dragDialog/mapDialog'
import { parseTime } from '@/utils/index'
import i18n from '@/lang'
export default {
  components: {
    mapDialog
  },
  name: 'portInquirydragDialog',
  props: {
    tabV: {
      type: Boolean
    },
    beforeClose1: {
      type: Function
    }
  },
  data() {
    return {
      dataShow: false,
      activeName: '0',
      tabLists: [],
      names: ['0', '1', '2', '3']
    }
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    },
    ...mapGetters([
      'getWeatherShow'
    ])
  },
  watch: {
    getWeatherShow: function(newValue, oldValue) {
      this.dataShow = false
      this.initDate()
    }
  },
  methods: {
    initDate() {
      if (this.getWeatherShow !== null) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const obj = {
          lat: this.getWeatherShow.lat,
          lng: this.getWeatherShow.lng,
          time: parseTime(new Date().getTime())
        }
        forecast(obj).then((response) => {
          loading.close()
          if (response && !_.isEmpty(response.data.datas)) {
            this.tabLists = response.data.datas
            this.dataShow = true
            this.flag = true
            store.dispatch('getWeatherShow', null)
          } else {
            loading.close()
            this.$alert(i18n.t('commonRemind.weatherInfo'), i18n.t('history.prompt'))
            store.dispatch('shipInfos', null)
            // this.$emit('show', false)
            // this.flag = false
          }
        })
      }
    }
  },
  mounted() {
    // this.initDate()
  }
}
</script>
<style>
  .weather-tabs-content .el-tabs__item {
      color: #fff;
  }
  .weather-tabs-content .el-tabs__content {
    /* overflow: auto; */
    position: relative;
    color: #fff;
    max-height: 370px;
    overflow-y: auto;
}
.weather-tabs-content .el-tabs{
  margin-left: 10px;
}
.weather-tab-high .weather-tab-high-title{
  font-size: 12px;
  height: 18px;
  line-height: 18px;
}
.weather-tab-high{
  margin-left: 17px;
}
.weather-tabs-content .weather-tab-item{
font-size: 12px;
margin-top: 10px;
margin-left: 17px;
}
.weather-tabs-content .weather-tab-item img{
    width: 60px;
    height: 60px;
    margin-top: 5px;
}
.weather-right-content .weather-item-line{
    height: 24px;
    line-height: 24px;
}
.weather-right-content .weather-item-name{
  text-align: right;
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.weather-right-content .weather-item-text{
  padding-left: 5px;
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.weather-tabs-content .el-tabs__content::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background-color: #d3d3d0;
}
.weather-tabs-content .el-tabs__content::-webkit-scrollbar-thumb{
  background-color: #3794EF;
}
.weather-time-zoom{
    position: absolute;
    right: 50px;
    top: 11px;
    color: #fff;
    font-size: 14px;
}
</style>
