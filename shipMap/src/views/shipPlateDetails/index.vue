<template>
  <div class="ship-hall-details">
    <div class="ship-plate-nav">
      <span class='nav-ship-hall' @click='goBack'>{{$t(`shipHall.shipHall`)}}</span>
      <span class='nav-ship-hall'>></span>
      <span class="nav-ship-palte">{{shipPlateInfor.name}}  {{$t(`shipHall.shipPlate`)}}</span>
    </div>
    <div class="ship-plate-title">
      {{shipPlateInfor.name}}  {{$t(`shipHall.shipPlate`)}}
    </div>
    <div class="plate-content-tab">
      <ul>
        <li :class="activeTab === 'shipPlateInformation' ? 'active' :''" @click="selectTab('shipPlateInformation')">{{$t(`shipHall.shipPlateInformation`)}}</li>
        <li :class="activeTab === 'shipFile' ? 'active' :''" @click="selectTab('shipFile')">{{$t(`shipHall.shipFile`)}}</li>
        <li :class="activeTab === 'shipDynamic' ? 'active' :''" @click="selectTab('shipDynamic')">{{$t(`shipHall.shipDynamic`)}}</li>
      </ul>
      <div class="tab-line"></div>
    </div>
    <div class="plate-item-box" v-if="activeTab === 'shipPlateInformation'">
      <el-row class="plate-item-first">
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.shipName`)}}:</span>
          <span class="item-name">{{shipPlateInfor.name}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.shipType`)}}:</span>
          <span class="item-name">{{shipPlateInfor.type}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.bulidYear`)}}:</span>
          <span class="item-name">{{shipPlateInfor.completeDate}}</span>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.deadweightTon`)}}:</span>
          <span class="item-name">{{shipPlateInfor.loadQuantity | numFormat}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.shipOption`)}}:</span>
          <span class="item-name">{{shipPlateInfor.position}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">OPEN:</span>
          <span class="item-name">{{shipPlateInfor.open}}</span>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
          <span class="item-title">EAT Fujairah:</span>
          <span class="item-name">{{shipPlateInfor.eta}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">EAT Cabinda:</span>
          <span class="item-name">{{shipPlateInfor.etaCabinda}}</span>
        </el-col>
      </el-row>
      <div class="plate-item-title">{{$t(`shipHall.contactInfo`)}}</div>
      <el-row v-for="(item, index) in shipPlateList" :key="index">
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.shipPlateIssuer`)}}:</span>
          <span class="item-name">{{item.publishName}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.contactNumber`)}}:</span>
          <span class="item-name">{{item.mobile}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.contactMail`)}}:</span>
          <span class="item-name">{{item.email}}</span>
        </el-col>
        <el-col :span="6">
          <span class="charter-application" @click='goApplication'>{{$t(`shipHall.charterApplication`)}}</span>
        </el-col>
        <el-col :span="12">
          <span class="item-title">{{$t(`shipHall.shipowner`)}}:</span>
          <span class="item-name">{{item.shipOwnerName}}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-title">{{$t(`shipHall.timeRemaining`)}}:</span>
          <span class="item-name">{{item.time}}</span>
        </el-col>
      </el-row>
    </div>
    <ship-plate-details v-if="activeTab === 'shipFile' && shipHallFile && shipHallFile.datas"></ship-plate-details>
  </div>
</template>
<script>
  import shipPlateDetails from '@/components/ShipPlateDetail'
  import { findShipPlateDetailByShip } from '@/api/shipHall'
  import {
    mapGetters
  } from 'vuex'
  import config from '@/config'
  export default {
    components: {
      shipPlateDetails
    },
    name: 'shipHall',
    data() {
      return {
        shipPlateInfor: {},
        activeTab: 'shipPlateInformation',
        shipName: '',
        uuid: this.$route.params.uuid,
        shipPlateList: []
      }
    },
    computed: {
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      },
      ...mapGetters([
        'shipHallFile'
      ])
    },
    mounted() {
      findShipPlateDetailByShip({ uuid: this.uuid }).then(response => {
        if (response && response.data && response.data.datas) {
          this.shipName = response.data.datas.name
          this.shipPlateList = response.data.datas.contactList
          this.shipPlateInfor = response.data.datas
        }
      })
    },
    methods: {
      selectTab(flag) {
        this.activeTab = flag
        if (flag === 'shipFile') {
          const obj = {
            imo: this.shipPlateInfor.imo,
            mmsi: this.shipPlateInfor.mmsi
          }
          this.$store.dispatch('shipHallFile', obj).then((data) => {})
        }
        if (flag === 'shipDynamic') {
          this.$router.push({ name: 'ship', query: { imo: this.shipPlateInfor.imo }})
        }
      },
      goBack() {
        this.$router.push({ name: 'shipHall' })
      },
      goApplication() {
        window.open(config.SLD.ship + '/pallet/palletEdit.htm?palletType=1&shipPlateUuid=' + this.uuid)
      }
    }
  }
</script>

<style scoped>
ul, li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.ship-hall-details {
  width: 1180px;
  margin: auto;
  color: #333333;
}
.ship-plate-nav {
  font-size: 14px;
  color: #333;
  line-height: 20px;
}
.ship-plate-nav .nav-ship-hall {
  margin-right: 10px;
  cursor: pointer;
}
.ship-plate-nav .nav-ship-palte {
  color: #3F3F3F;
}
.ship-plate-title {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 600;
  margin: 37px 0 15px 0;
}
.plate-content-tab ul{
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
.plate-content-tab ul li{
  line-height: 40px;
  border-bottom: 2px solid transparent;
  margin-right: 30px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
  font-weight: 500;
  cursor: pointer;
}
.plate-content-tab .tab-line{
  height: 1px;
  background-color: #ececec;
}
.plate-content-tab ul li.active{
  border-bottom: 2px solid #FFA900;
  color: #FFA900;
}
.plate-item-box .el-col{
  line-height: 26px;
  height: 26px;
  font-size: 14px;
}
.plate-item-box .el-col span.item-title{
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  letter-spacing: 0;
}
.ship-hall-details .plate-item-box .el-row{
  margin: 20px 0;
  border-bottom: 1px solid #ececec;
  padding-bottom: 10px;
}
.ship-hall-details .plate-item-box .plate-item-first {
  border-bottom: none;
  margin-top: 30px;
}
.charter-application {
  display: inline-block;
  line-height: 28px;
  cursor: pointer;
  padding: 0 12px;
  background: #FFCC00;
  border-radius: 2px;
  margin-top: 5px;
}
</style>
