<template>
  <div class="weather">
    <tips width='330px'
          height='194px'
          right="46px"
          bottom="155px"
          :before-close="handleClose"
          :visible.sync='isShow'>
      <template slot="tipsContent">
        <div class="input-select">
          <el-checkbox-group v-model="checkList" @change="handleCheckedweather">
            <el-checkbox v-for="(item, index) in options" :key="item.label" :label="$t(`weather.options[${index}].data`)">
              {{$t(`weather.options[${index}].text`)}}
            </el-checkbox>
            <span style="cursor: pointer;" @click="weatherExample"><svg-icon class="setting"  icon-class="wenhao" /></span>
          </el-checkbox-group>
        </div>
        <div class="timeAxis">
          {{defTime}}&nbsp;&nbsp;&nbsp;&nbsp;GMT+8
        </div>
        <div class="block ">
        <el-slider
          v-model="timeValue"
          :show-tooltip="false"
          @change="changeWeather">
        </el-slider>
        <div class="weatherbtn">
          <el-button type="warning"  size="small" @click="arrowLeft"><svg-icon class="font12" icon-class="zuojiantou" /></el-button>
          <el-button type="warning"  size="small" @click="arrowRight"><svg-icon class="font12" icon-class="youjiantou" /></el-button>
        </div>
      </div>
      </template>
    </tips>
    <weathers-tips :tipsV="tipsShow" :beforeClose1="closeTips"></weathers-tips>
  </div>
</template>
<script>
import piratesDrills from '@/lang/zh/piratesDrills'
import weathersTips from './weathertips'
import tips from '../ui/tips/index'
import Map from '../map.js'
import i18n from '@/lang'
import {
  weatherTimeAxis
} from '@/api/routemap'
export default {
  name: 'piratesDrills',
  components: {
    tips,
    weathersTips
  },
  data() {
    return {
      options: ['气压', '风', '浪', '流'],
      isShow: true,
      valueDate: '1',
      tipsShow: false,
      checkList: [],
      selectTimeSlot: piratesDrills.selectTimeSlot,
      checkedList: [],
      timeValue: 0,
      defTime: '',
      timeArr: [],
      step: 0,
      timeLength: 0,
      currentIndex: 0
    }
  },
  // mounted() {
  //   this.showSearchPirates()
  // },
  methods: {
    // 气象台风关闭
    handleClose(done) {
      this.$router.push({
        name: 'ship'
      })
      Map.removeMapPiratesDrills()
      done()
    },
    showSearchPirates() {
      this.isShow = !this.$route.query.flag
    },
    // 气象说明图
    weatherExample() {
      this.tipsShow = true
    },
    // 关闭内容框
    closeTips() {
      this.tipsShow = false
    },
    initializeData() {
      // 初始化时间轴
      weatherTimeAxis().then(response => {
        if (response && response.data && response.data.datas) {
          this.defTime = response.data.datas.defTime
          this.timeArr = response.data.datas.time
          this.step = 100 / response.data.datas.time.length
          this.timeLength = response.data.datas.time.length
          this.currentIndex = this.timeArr.indexOf(this.defTime)
          this.timeValue = (this.currentIndex + 1) * this.step
        }
      })
    },
    // 向左
    arrowLeft() {
      if (this.checkList.length > 0) {
        Map.removeWeatherLayer()
        this.currentIndex--
        if (this.timeValue > 0 && this.timeValue > this.step && this.currentIndex > 0) {
          this.timeValue -= this.step
          this.defTime = this.timeArr[this.currentIndex]
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        } else {
          this.defTime = this.timeArr[0]
          this.timeValue = 0
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        }
      } else {
        this.$alert(i18n.t('commonRemind.option1'), i18n.t('history.prompt'))
      }
    },
    // 向右
    arrowRight() {
      if (this.checkList.length > 0) {
        Map.removeWeatherLayer()
        this.currentIndex++
        if (this.timeValue < 100 && this.currentIndex < this.timeLength - 1) {
          this.timeValue += this.step
          this.defTime = this.timeArr[this.currentIndex]
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        } else {
          this.timeValue = 100
          this.defTime = this.timeArr[this.timeLength - 1]
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        }
        // Map.CoordMapType(this.defTime)
      } else {
        this.$alert(i18n.t('commonRemind.option1'), i18n.t('history.prompt'))
      }
    },
    // 滑动
    changeWeather() {
      if (this.checkList.length > 0) {
        Map.removeWeatherLayer()
        if (this.timeValue > 0) {
          const index = Math.round(this.timeArr.length * (this.timeValue / 100) - 1)
          this.defTime = this.timeArr[index]
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        } else {
          this.defTime = this.timeArr[0]
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        }
      } else {
        this.$alert(i18n.t('commonRemind.option1'), i18n.t('history.prompt'))
      }
    },
    // 单选框
    handleCheckedweather() {
      Map.removeWeatherLayer()
      if (this.checkList.length > 0) {
        if (this.defTime !== '') {
          const time = encodeURI((this.defTime).replace(/\-/g, ''))
          this.checkList.map(item => {
            Map.CoordMapType(item, time)
          })
        }
      }
    }
  },
  mounted() {
    this.initializeData()
  },
  destroyed() {
    Map.removeWeatherLayer()
  }
}
</script>
<style>
/* .weather {
  position: relative;
} */
.weather .time_select {
  font-size: 12px;
  color: #fff;
}
.weather .select-month .el-input--medium .el-input__inner {
  line-height: 26px;
  width: 180px;
  margin: 0;
  height: 26px;
  font-size: 12px;
  background-color: rgba(33, 33, 33, 0.2);
  color: #fff;
  border-radius: 2px;
}
.weather .select-month .el-input__suffix {
  right: 0;
}
.weather .input-select {
  padding-top: 10px;
}
.weather .input-select .setting{
  border-radius: 9px;
  display: inline-block;
  vertical-align: bottom;
  width: 18px;
  height: 18px;
  vertical-align: top;
  margin-right: 3px;
  background: rgba(80,175,235,1);
  color: #fff;
}
.weather .input-select .el-checkbox {
  margin: 0 0 9px 12px;
  min-width: 48px;
  font-size: 12px;
  height: 18px;
}
.weather .input-select .el-checkbox__label {
  font-size: 12px;
  color: #fff;
  line-height: 20px;
}
.weather .input-select .el-checkbox__label{
padding-left: 8px;
}
.weather .input-select .el-checkbox__input.is-checked +.el-checkbox__label {
  color: #fff;
}
.weather .input-select i {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
  text-indent: -999999px;
}
.weather .input-select .el-checkbox__input.is-checked .el-checkbox__inner,
.weather .input-select .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color: #FFA900;
  border-color: #FFA900;
}
.weather .search-box {
  text-align: left;
  margin-top: 6px;
}
.weather .search-box span{
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
.weather .pirates-drills {
  background-color: rgba(33, 33, 33, 0.7);
  color: #fff;
  border: none;
}
.pirates-drills::before{
  display: none;
}
/* .language-en{

} */
.language-en .weather .input-select .el-checkbox {
    margin: 0 0 9px 12px;
    min-width: 96px;
    font-size: 12px;
    height: 18px;
}
.language-en .weather .weatherbtn {
    position: absolute;
    bottom: 32px;
    right: 19px;
}
.weather .el-slider__bar {
    height: 6px;
    background-color:rgba(255,169,0,1);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    position: absolute;
}
.weather .el-slider__button {
    width: 10px;
    height: 10px;
    border: solid 2px #fff;
    background-color: #fff;
    border-radius: 50%;
    -webkit-transition: .2s;
    transition: .2s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.weather .el-slider__runway {
    width: 71%;
    height: 6px;
    margin: 16px 0;
    background-color: #e4e7ed;
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    vertical-align: middle;
    margin-left: 12px;
}
.weather .timeAxis{
  color: #fff;
  margin: 15px 0px 30px 11px;
  font-size: 14px;
}
.weather .weatherbtn{
  position: absolute;
      bottom: 60px;
      right: 19px;
}
.weather .weatherbtn .el-button--warning {
    color: rgba(216,216,216,1);
    background-color: transparent;
    border-color: transparent;
}
.weather .weatherbtn .el-button--small {
    padding: 0 0;
    font-size: 12px;
    /* border-radius: 3px; */
}
/* .language-en .footButton .el-button--small {
  padding: 9px 10px;
} */
</style>
