<template>
  <div class="ship-plate-details" :style="{left: isLanguageZh ? '534px' : '661px',top:'59px'}">
    <div v-if='shipPlateInfor'>
      <div class="ship-plate-item-name">
          {{shipName}}  {{$t(`shipHall.shipPlate`)}}
      </div>
      <div class="ship-plate-content-tab">
        <ul>
          <li :class="activeTab === 'shipPlateInformation' ? 'active' :''" @click="selectTab('shipPlateInformation')">{{$t(`shipHall.shipPlateInformation`)}}</li>
          <li :class="activeTab === 'shipFile' ? 'active' :''" @click="selectTab('shipFile')">{{$t(`shipHall.shipFile`)}}</li>
          <li :class="activeTab === 'shipDynamic' ? 'active' :''" @click="selectTab('shipDynamic')">{{$t(`shipHall.shipDynamic`)}}</li>
        </ul>
        <div class="go-back-btn">
          <span @click="goBackShipPlate">{{$t(`shipHall.goBack`)}}</span>
        </div>
      </div>
      <div class="scroll-box" v-if="activeTab === 'shipPlateInformation'">
        <div class="plate-item-box">
          <el-row>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.shipName`)}}:</span>
              <span class="item-name">{{shipPlateInfor.name}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.shipType`)}}:</span>
              <span class="item-name">{{shipPlateInfor.type}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.bulidYear`)}}:</span>
              <span class="item-name">{{shipPlateInfor.completeDate}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.deadweightTon`)}}:</span>
              <span class="item-name">{{shipPlateInfor.loadQuantity | numFormat}}mt</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.shipOption`)}}:</span>
              <span class="item-name">{{shipPlateInfor.position}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">OPEN:</span>
              <span class="item-name">{{shipPlateInfor.open}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">EAT Fujairah:</span>
              <span class="item-name">{{shipPlateInfor.eta}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">EAT Cabinda:</span>
              <span class="item-name">{{shipPlateInfor.etaCabinda}}</span>
            </el-col>
          </el-row>
          <div class="sihp-plate-item-title">{{$t(`shipHall.contactInfo`)}}</div>
          <ul>
            <li v-for="(item, index) in shipPlateList" :key="index">
              <el-row>
                <el-col :span="8">
                  <span class="item-title">{{$t(`shipHall.shipPlateIssuer`)}}:</span>
                  <span class="item-name">{{item.publishName}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="item-title">{{$t(`shipHall.contactNumber`)}}:</span>
                  <span class="item-name">{{item.mobile}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="item-title">{{$t(`shipHall.contactMail`)}}:</span>
                  <span class="item-name">{{item.email}}</span>
                </el-col>
                <el-col :span="16">
                  <span class="item-title">{{$t(`shipHall.shipowner`)}}:</span>
                  <span class="item-name">{{item.shipOwnerName}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="item-title">{{$t(`shipHall.timeRemaining`)}}:</span>
                  <span class="item-name">{{item.time}}</span>
                </el-col>
                <el-col :span="24">
                  <div class="plate-btn-box">
                    <span @click="goApplication" class="charter-application">{{$t(`shipHall.charterApplication`)}}</span>
                  </div>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </div>
      <ship-plate-detail v-if="activeTab === 'shipFile'" fontSize='12px' :isSmall='true'></ship-plate-detail>
    </div>
  </div>
</template>
<script>
import shipPlateDetail from '@/components/ShipPlateDetail'
import Map from '../map.js'
import { findShipPlateDetailByShip } from '@/api/shipHall'
import config from '@/config'
import {
  mapGetters
} from 'vuex'
export default {
  components: {
    shipPlateDetail
  },
  name: 'shipPlateDetails',
  data() {
    return {
      shipPlateInfor: null,
      shipName: '',
      activeTab: 'shipPlateInformation',
      uuid: this.$route.query.uuid,
      mmsi: this.$route.query.mmsi,
      imo: this.$route.query.imo,
      source: this.$route.query.source,
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
    findShipPlateDetailByShip({ uuid: this.uuid, mmsi: this.mmsi, imo: this.imo }).then(response => {
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
        Map.shipDetail(this.shipPlateInfor.imo)
      }
    },
    goBackShipPlate() {
      if (this.source.search('imo') !== -1) {
        Map.ship = null
        Map.currentSearchIMO = null
        Map.mapView.setZoom(3)
        this.$router.push({ name: 'ship', query: { imo: this.shipPlateInfor.imo }})
      } else {
        this.$router.push({ name: this.source })
      }
    },
    goApplication() {
      window.open(config.SLD.ship + '/pallet/palletEdit.htm?palletType=1&shipPlateUuid=' + this.uuid)
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
.ship-plate-details {
  position: relative;
  width: 766px;
  z-index: 1;
  background-color: rgba(33,33,33,0.80);
  color: #fff;
}
.ship-plate-item-name {
  line-height: 32px;
  font-size: 14px;
  text-align: center;
  background-color: rgba(255,204,0,0.10);
}
.ship-plate-content-tab{
  position: relative;
}
.ship-plate-content-tab ul{
  padding-left: 20px;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  justify-content: flex-start;
}
.ship-plate-content-tab ul li{
  line-height: 19px;
  padding-bottom: 6px;
  border-bottom: 2px solid transparent;
  margin-right: 30px;
  margin-top: 15px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.ship-plate-content-tab ul li.active{
  border-bottom: 2px solid #FFA900;
  color: #FFA900;
}
.scroll-box {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: scroll;
}
.scroll-box::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background: rgba(255,255,255,0.13);
  border: 1px solid rgba(78,78,78,0.56);
  border-radius: 3px;
}
.scroll-box::-webkit-scrollbar-thumb{
  width: 8px;
  background-color: #999;
  border-radius: 3px;
}
.plate-item-box {
  padding: 0 20px 20px;
}
.ship-plate-details .plate-item-box .el-col{
  line-height: 26px;
  font-size: 14px;
}
.ship-plate-details .el-col .item-title{
  display: inline-block;
  min-width: 85px;
  font-size: 12px;
  color: #C8C8C8;
  font-weight: 400;
}
.ship-plate-details .plate-item-box .item-name {
  font-size: 12px;
  font-weight: 400;
}
.ship-plate-details .sihp-plate-item-title {
  line-height: 19px;
  font-size: 14px;
  margin: 20px 0 10px;
}
.ship-plate-details .plate-btn-box {
  margin-top: 20px;
}
.go-back-btn span,
.ship-plate-details .plate-btn-box span {
  display: inline-block;
  line-height: 28px;
  font-size: 12px;
  width: 70px;
  text-align: center;
  border-radius: 2px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
}
.ship-plate-content-tab .go-back-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}
.ship-plate-details .plate-btn-box .charter-application {
  background: #FFCC00;
  margin-right: 20px;
}
</style>
