<template>
  <div class='setting-page-wrap'>
    <!-- <svg t="1492500959545" @click="toggleClick" class="hamburger" :class="{'is-active':isActive}" style="" viewBox="0 0 1024 1024"
      version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64">
      <path d="M966.8023 568.849776 57.196677 568.849776c-31.397081 0-56.850799-25.452695-56.850799-56.850799l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 543.397081 998.200404 568.849776 966.8023 568.849776z"
        p-id="1692"></path>
      <path d="M966.8023 881.527125 57.196677 881.527125c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.849776 56.850799-56.849776l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.849776l0 0C1023.653099 856.07443 998.200404 881.527125 966.8023 881.527125z"
        p-id="1693"></path>
      <path d="M966.8023 256.17345 57.196677 256.17345c-31.397081 0-56.850799-25.452695-56.850799-56.849776l0 0c0-31.397081 25.452695-56.850799 56.850799-56.850799l909.605623 0c31.397081 0 56.849776 25.452695 56.849776 56.850799l0 0C1023.653099 230.720755 998.200404 256.17345 966.8023 256.17345z"
        p-id="1694"></path>
    </svg> -->
    <!---->
    <el-dropdown trigger="click" class='international parent-element'>
      <div class="setting-btn-wrap" :title="$t('settingCtrl.mapSetting')">
        <svg-icon style="font-size:20px" class="seeting"  icon-class="s-setting"/>
      </div>
      <el-dropdown-menu slot="dropdown">
        <div class="setting-page-content">
          <div class="setting-page-menu">
            <div class="setting-page-ship-status">
              <span class="title-span">{{$t('settingCtrl.status')}}：</span>
              <el-checkbox-group v-model="statusList">
                <el-checkbox v-for="item in statusListDate" :key="item.titie" :label="item.header">
                  <svg-icon class="font18" :icon-class="item.icon" />
                  {{item.titie}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div :class="isI18n? 'setting-page-ship-type':'setting-page-ship-type setting-page-ship-type-en'">
              <span class="title-span">{{$t('settingCtrl.shipType')}}：</span>
              <el-checkbox-group v-model="shipTypeList">
                <el-checkbox :label="item.title" v-for="item in shipTypeListDate" :key="item.titie"></el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="setting-page-ship-port">
              <span class="title-span">{{$t('settingCtrl.port')}}：</span>
              <el-radio v-model="radio" label="Y">{{$t('settingCtrl.show')}}</el-radio>
              <el-radio v-model="radio" label="N">{{$t('settingCtrl.hide')}}</el-radio>
              <el-button class="seting-button" type="warning" size="mini" @click="ctrlShipPort">{{$t('settingCtrl.confirm')}}</el-button>
            </div>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
  import i18n from '@/lang'
  import olMap from '@/views/routemap/map'
  // import store from '@/store'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'hamburger',
    props: {
      // isActive: {
      //   type: Boolean,
      //   default: false
      // },
      // toggleClick: {
      //   type: Function,
      //   default: null
      // }
    },
    computed: {
      ...mapGetters([
        'allbackNew'
      ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    data() {
      return {
        settingPageVisible: false,
        statusList: [1, 2, 3, 4],
        statusListDate: [{
          titie: i18n.t('settingCtrl.ballast'),
          icon: 'kongzai',
          header: 1
        }, {
          titie: i18n.t('settingCtrl.laden'),
          icon: 'manzai',
          header: 2
        }, {
          titie: i18n.t('settingCtrl.positionPostedBallast'),
          icon: 'kongzaichuanpan',
          header: 3
        }, {
          titie: i18n.t('settingCtrl.positionPostedLaden'),
          icon: 'manzaichuanpan',
          header: 4
        }],
        shipTypeList: ['ULCC', 'VLCC', 'Suezmax', 'Aframax'],
        shipTypeListDate: [{
          title: 'ULCC'
        }, {
          title: 'VLCC'
        }, {
          title: 'Suezmax'
        }, {
          title: 'Aframax'
        }],
        radio: 'Y'
      }
    },
    methods: {
      ctrlShipPort() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const obj = {
          portShow: this.radio,
          shipType: this.shipTypeList,
          loadType: this.statusList
        }
        this.$store.dispatch('getBackNew', obj).then((data) => {
          olMap.loadType = this.statusList
          olMap.shipType = this.shipTypeList
          olMap.removeCirleMarker()
          olMap.removeMap(olMap.portListArr)
          if (!this.allbackNew) return
          loading.close()
          olMap.mapView.setZoom(3)
          olMap.shipPlateN = this.allbackNew.shipsN
          olMap.shipPlateY = this.allbackNew.shipsY
          olMap.portLists = this.allbackNew.ports
          if (this.allbackNew.ports !== null) {
            olMap.initPort()
          }
          olMap.initial()
        }).catch(() => {
        // this.loading = false
        })
      }
    }
  }
</script>

<style>
.seeting {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  /* transform: rotate(180deg);
  transition: .38s;
  transform-origin: 50% 50%; */
  color:#fff;
}

/* .hamburger.is-active {
  transform: rotate(0deg);
} 8*/
.setting-page-wrap .el-button{
      background: transparent;
      border: none;
}
.setting-page-wrap .el-button--medium {
  padding: 10px;

}
.setting-page-wrap .el-dropdown-menu--medium{
  background-color: blue;
  width: 100px;
  height: 100px;
  font-size: 22px;
}
.setting-page-wrap .setting-btn-wrap{
  margin: 0 20px;
}
.setting-page-content{
  padding: 10px;
  white-space: nowrap;
}
.setting-page-ship-status,.setting-page-ship-type{
  display: flex;
  line-height: 40px;
  color: #fff;
}
.setting-page-ship-port{
  line-height: 40px;
  vertical-align: middle;
  color: #fff;
}
.el-dropdown-menu {
    background-color: rgba(33, 33, 33, 0.7);
    border: 1px solid  rgba(33, 33, 33, 0.7);
  }
  .el-dropdown-menu__item.is-disabled {
    cursor: default;
    color: #fff;
    pointer-events: none;
}
.el-dropdown-menu__item {
    color: #fff;
}
.el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #FFA900;
  border: none;
  color: #fff;
}
.el-checkbox__label{
  color: #fff;
}
.el-checkbox__input.is-checked + .el-checkbox__label{
  color: #fff;
}
.el-checkbox__inner:hover{
  border: none;
}
.el-radio__input.is-checked + .el-radio__label{
  color: #fff;
}
.el-radio__label{
  color: #fff;
}
.el-radio__input.is-checked .el-radio__inner{
  background-color: #FFA900;
  border: none;
  color: #fff;
}
  .seting-button{
    margin-left: 50px;
    color: #fff;
  }
.seting-button:link{
  color: #fff;
}
.seting-button:active{
  color: #fff;
}
.seting-button:visited{
  color: #fff;
}
.seting-button:hover{
  color: #fff;
}
.setting-page-ship-status label:nth-child(1){
  margin-left: 5px;
}
.setting-page-ship-type label:nth-child(1){
  margin-left: 5px;
}
/*此处注意顺序问题 通过中英文加的class 换句话说就是中英文版class名不同 如果不按照顺序 则样式会失效*/
.setting-page-ship-type label:nth-child(1){
  margin-left: 5px;
}
.setting-page-ship-type-en label:nth-child(1){
  margin-left: 5px;
}
.setting-page-ship-type label:nth-child(2){
  margin-left: 42px;
}
.setting-page-ship-type-en label:nth-child(2){
  margin-left: 56px;
}
.setting-page-ship-type label:nth-child(3){
  margin-left: 42px;
}
.setting-page-ship-type-en label:nth-child(3){
  margin-left: 53px;
}
.setting-page-ship-type label:nth-child(4){
  margin-left: 50px;
}
.setting-page-ship-type-en label:nth-child(4){
  margin-left: 129px;
}
.setting-page-ship-port label:nth-child(2){
  margin-left: 1px;
}
.setting-page-ship-port label:nth-child(3){
  margin-left: 48px;
}
.language-en .title-span{
  display: inline-block;
  width: 100px;
  text-align: right;
}
</style>
