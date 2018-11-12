<template>
  <map-dialog
      class="port-weather-wrap"
      self-class="maxIndex"
      :drag='1'
      width="600px"
      right="395px"
      top="154px"
      :left="isI18n?'691px':'779px'"
      :before-close="portWeatherClose"
      :visible.sync='isShow'>
      <template slot="title">
        <div class="port-weather-header">
          <span>{{$t('portListsAll.portWeather')}}</span>
        </div>
      </template>
      <div class="port-weather-center">
        <div class="weather-header">
          <p class="port-weather-title">
            <span class="span-left">{{isI18n? portListAll.seaport.nameCn: portListAll.seaport.nameEn}}</span>
            <span class="span-center">{{isI18n? getPortListAllInit.countryCn: getPortListAllInit.countryEn}}</span>
          </p>
          <ul class="clearfix">
            <li>
              <span class="span-left">{{$t('portListsAll.now')}} :</span>
              <span class="span-center">{{isI18n? portListAll.seaport.weathers[0].weather: portListAll.seaport.weathers[0].weatherEn}}</span>
            </li>
            <li>
              <span class="span-left">{{$t('portListsAll.temp')}} :</span>
              <span class="span-center">{{portListAll.seaport.currents[0].temperature}}℃</span>
            </li>
            <li>
              <span class="span-left">{{$t('portListsAll.wind')}} :</span>
              <span class="span-center">{{portListAll.seaport.currents[0].winddirection}}/{{portListAll.seaport.weathers[0].windspeed}}Knots</span>
            </li>
            <li>
              <span class="span-left">{{$t('portListsAll.pressure')}} :</span>
              <span class="span-center">{{portListAll.seaport.currents[0].pressure}}mb</span>
            </li>
            <li>
              <span class="span-left">{{$t('portListsAll.rainfall')}} :</span>
              <span class="span-center">{{portListAll.seaport.currents[0].rain}}mm</span>
            </li>
            <li>
              <span class="span-left">{{$t('portListsAll.humidity')}} :</span>
              <span class="span-center">{{portListAll.seaport.currents[0].humidity}}%</span>
            </li>
          </ul>
        </div>
        <div class="weather-center">
          <ul class="clearfix">
            <li v-for="item in portListAll.seaport.weathers" :key="item">
              <p class="bg-yell">{{item.date}}</p>
              <div class="weather-img">
                <img :src="item.iconurl" alt="">
              </div>
              <p class="font16 weather-C">{{item.maxtemp}} ~ {{item.mintemp}}℃</p>
              <div class="font12 weather-detail">
                <p class="ellipsi" :title="isI18n? item.weather : item.weatherEn">{{isI18n? item.weather : item.weatherEn}}</p>
                <p>{{$t('portListsAll.sunrise')}} : {{item.sunrise}}</p>
                <p>{{$t('portListsAll.sunset')}} : {{item.sunset}}</p>
                <p>{{$t('portListsAll.rain')}} : {{item.rainchance}}%</p>
                <p>{{$t('portListsAll.wind')}} : {{item.winddirection}}/{{Number(item.windspeed).toFixed(2)}}{{$t('portListsAll.knots')}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </map-dialog>
</template>
<script>
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'portWeather',
    components: {
      mapDialog
    },
    computed: {
      ...mapGetters([
        'portListAll', // 港口数据
        'getPortListAllInit' // 港口初始化数据
      ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    props: {
      portWeatherClose: Function
    },
    data() {
      return {
        isShow: true
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  p{
    margin: 0;
    padding: 0;
  }
  .port-weather-wrap .port-weather-header{
    width: auto;
    height: 35px;
    line-height: 35px;
    color: #fff;
    margin: 0 15px;
    border-bottom: 1.5px solid #242424;
    font-size: 14px;
  }
  .port-weather-wrap .port-weather-center{
    margin: 10px 15px 0;
    height: 330px;
    font-size: 12px;
    color: #fff;
    overflow: auto;
  }
  .port-weather-wrap .port-weather-center::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #d3d3d0;
  }
  .port-weather-wrap .port-weather-center::-webkit-scrollbar-thumb{
    width: 8px;
    background-color: #3B99FC;
    border-radius: 3px;
  }
  .port-weather-wrap .port-weather-title{
    padding-bottom: 10px;
    margin: 0;
  }
  .port-weather-wrap .port-weather-title span{
    display: inline-block;
    font-size: 18px;
  }
  .port-weather-wrap .port-weather-title span:nth-child(2){
    margin-left: 10px;
  }
  .port-weather-wrap .weather-center{
    margin-top: 15px;
  }
  .port-weather-wrap .port-weather-center .weather-header ul li{
    cursor: pointer;
    float: left;
    font-size: 14px;
    width: 190px;
    line-height: 25px;
  }
  .language-en .port-weather-wrap .port-weather-center .weather-header ul li{
    width: 185px;
  }
  .port-weather-wrap .port-weather-center .weather-header ul span{
    display: inline-block;
    line-height: 18px;
    height: 20px;
  }
  .port-weather-wrap .weather-center ul li{
    float: left;
    width: 110px;
    cursor: pointer;
  }
  .port-weather-wrap .weather-center .bg-yell{
    font-size: 14px;
    line-height: 25px;
    height: 25px;
    color: #FFCC00;
  }
  .port-weather-wrap .weather-center .weather-img{
    width: 60px;
    height: 60px;
    margin: 10px 0;
  }
  .port-weather-wrap .weather-C{
    line-height: 20px;
    height: 20px;
  }
  .port-weather-wrap .weather-detail{
    margin-top: 10px;
  }
  .port-weather-wrap .weather-detail p{
    height: 16px;
    line-height: 16px;
  }
  .clearfix:after{content:".";display:block;height:0;visibility:hidden;clear:both;}
  .ellipsi{overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
</style>
