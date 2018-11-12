<template>
    <map-dialog class="weather-tips-content" :visible.sync='tipsV' :beforeClose = 'beforeClose1' width='368px' top="auto" right='382px' bottom="2px">
      <template slot="title">
        <div class="weather-tips-title">
           <!-- v-text="$t('weather.tips.wind.title')" -->
          <span class="mr-l-10" >
            {{$t('weather.tips.wind.title')}}
          </span>
        </div>
      </template>
      <div class="weather-tips-content">
        <div class="weather-tips-content-info">
            <div class="info-item" v-for="(index, item) in number">
              <img :src="url1+'wind_'+index+'.png'" alt=""/>
              <div class="">
                {{$t(`weather.tips.wind.content[${index-1}]`)}}
              </div>
            </div>
        </div>
         <div class="weather-tips-content-wind">
          <div class="title">
            {{$t('weather.tips.wind1.title')}}
          </div>
          <div class="content">
            <div class="">
              <span>1</span>
              <span>4</span>
              <span>7</span>
              <span>11</span>
              <span>17</span>
              <span>22</span>
              <span>28</span>
              <span>34</span>
              <span>41</span>
              <span>48</span>
              <span>56</span>
              <span>64</span>
              <span>{{$t('weather.tips.wind1.speed')}}</span>
            </div>
            <div class="">
              <img :src="url2" alt="">
            </div>
            <div class="">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
              <span>12</span>
              <span>{{$t('weather.tips.wind1.Grade')}}</span>
            </div>
          </div>
        </div>
         <div class="weather-tips-content-wind">
          <div class="title">
            {{$t('weather.tips.wave')}}
          </div>
          <div class="content">
            <div class="">
              <img :src="url3" alt="">
            </div>
            <div class="">
              <span class="span2">2</span>
              <span class="span2">4</span>
              <span class="span2">6</span>
              <span class="span2">8</span>
              <span class="span2">10</span>
              <span class="span2">12</span>
              <span class="span2">14</span>
              <span class="span2">30m</span>
            </div>
          </div>
        </div>
        <div class="weather-tips-content-wind">
          <div class="title">
              {{$t('weather.tips.flow')}}
          </div>
          <div class="content1">
            <div class="info-item" v-for="(index, item) in fnumber" :key="index">
              <img :src="url1+'arrow_'+index+'.png'" alt="">
              <div class="text" v-if="index===5">
                >{{index-1}}kn
              </div>
              <div class="text" v-else>
                {{index-1}}kn
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="calc_weather_wind">
        50+10+10+5=75
      </div>
  </map-dialog>
</template>

<script>
  // import store from '@/store'
  // import moment from 'moment'
  import config from '@/config'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  // import Map from '@/views/routemap/map'
  // import moment from '@/lib/leaflet/moment'
  // import tableKey from '@/lang/zh/shipDetail'
  // import { parseTime } from '@/utils/index'
  // import '@/styles/flag-icon.css'
  export default {
    components: {
      mapDialog
    },
    name: 'portInquirydragDialog',

    props: {
      tipsV: {
        type: Boolean
      },
      beforeClose1: {
        type: Function
      }
    },
    data() {
      return {
        tableData: [],
        dataShow: false,
        number: 4,
        fnumber: 5,
        url1: `${config.staticImagesPath}/images/`,
        url2: `${config.staticImagesPath}/images/scale_1.png`,
        url3: `${config.staticImagesPath}/images/scale_2.png`
        // url4: `${config.staticImagesPath}/images/`
      }
    },
    methods: {

    },
    mounted() {
      // if(this.dialogPortVisible){
      //     this.inits()
      // }
    }
  }
</script>
<style>
.weather-tips-content{
  color: #fff;
}
.weather-tips-title{
  font-size: 14px;
  padding: 10px;
}
.weather-tips-content .map_dialog_footer{
  padding: 0px;
}
.weather-tips-content{
  margin-left: 10px;
}
.weather-tips-content-info .info-item{
  display: inline-block;
  text-align: center;
  margin-left:14px;
}
.weather-tips-content-info .info-item img{
  height: 35px

}
.weather-tips-content-info .info-item div{
  font-size: 12px
}
.weather-tips-content-wind{
  font-size: 14px;
  padding: 10px 10px 5px;
}
.weather-tips-content-wind .content{
  margin-top: 10px;
}
.weather-tips-content-wind .content1{
  margin-bottom: 10px;
}
.weather-tips-content-wind .content span{
min-width: 17px;
display: inline-block;
text-align: left;
font-size: 12px;
margin-left:-1px;
}
.weather-tips-content-wind .content .span2{
min-width: 32px;
display: inline-block;
text-align: left;
font-size: 12px;
margin-left:-1px;
}
.weather-tips-content-wind .content1 .info-item{
  display: inline-block;
  text-align: center;
  margin-right: 25px;
}
.weather-tips-content-wind .content1 .info-item img{
  height: 35px;
}
.weather-tips-content-wind .content1 .info-item .tex{
  font-size: 12px
}
.calc_weather_wind{
  font-size: 12px;
position: absolute;
top: 21px;
left: 216px;
}
</style>
