<template>
  <div class="ship-plate-file">
    <div class="plate-scroll-box" v-if="shipHallFile && shipHallFile.datas" :style="{fontSize:fontSize, height:height}" :class='isSmall ? "plate-small-box":""'>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.basicInformation`)}}</div>
        <div class="plate-item-information">
          <el-row>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.ShipName`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.shipName}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">IMO:</span>
              <span class="item-name">{{shipHallFile.datas.basic.imo}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">MMSI:</span>
              <span class="item-name">{{shipHallFile.datas.basic.mmsi}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Callsign`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.callsign}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.ShipType`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.shipType}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Flag`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.flag}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.GrossTonnage`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.grossTonnage | numFormat}}Mt</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.deadweightTon`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.deadWeight | numFormat}}Mt</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.ServiceStatus`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.serviceStatus}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.ServiceSpeed`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.basic.serviceSpeed}}Knots</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.ClassificationSociety`)}}</div>
        <div class="plate-item-information">
          <el-row v-for="(item, index) in shipHallFile.datas.pis" :key="index">
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Flag`)}}:</span>
              <span class="item-name">{{item.flag}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.PortofRegistry`)}}:</span>
              <span class="item-name">{{item.portOfRegisttry}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.P_l`)}}:</span>
              <span class="item-name">{{item.pi}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.Dimension`)}}</div>
        <div class="plate-item-information">
          <el-row>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Lpb`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.lpb}}m</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Loa`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.loa}}m</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.BreadthExtreme`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.breadthRxtreme}}m</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Breadth`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.breadthMoulded}}m</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.DepthMoulded`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.depthMoulded}}m</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Draught`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.dimension.draught}}m</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.Built`)}}</div>
        <div class="plate-item-information">
          <el-row>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.Builder`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.built.builder}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.YearofBuilt`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.built.yearOfBuilt}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.Company`)}}</div>
        <div class="plate-item-information">
          <el-row>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.GroupOwner`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.companyname.own}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Operator`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.companyname.run}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Shipmanager`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.companyname.manage}}</span>
            </el-col>
            <el-col :span="8">
              <span class="item-title">{{$t(`shipHall.Charterer`)}}:</span>
              <span class="item-name">{{shipHallFile.datas.companyname.rent}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item">
        <div class="plate-item-title">{{$t(`shipHall.SurveyRecords`)}}</div>
        <div class="plate-item-information">
          <el-row class='item-row' v-for="(item, index) in shipHallFile.datas.classfications" :key="index">
            <el-col :span="24">
              {{item.content}}
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="plate-item plate-item-PSC">
        <div class="plate-item-title">PSC</div>
        <div class="plate-item-information">
          <el-row class='item-row' v-for="(item, index) in shipHallFile.datas.pscs" :key="index">
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.PSCOrgnizition`)}}:</span>
              <span class="item-name">{{item.pscOrganization}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.authority`)}}:</span>
              <span class="item-name">{{item.authority}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.portOfInspection`)}}:</span>
              <span class="item-name">{{item.portOfInspection}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.typeOfInspection`)}}:</span>
              <span class="item-name">{{item.typeOfInspection}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.detention`)}}:</span>
              <span class="item-name">{{item.detention}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.durationDays`)}}:</span>
              <span class="item-name">{{item.durationDays}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.numberOfDeficiencies`)}}:</span>
              <span class="item-name">{{item.numberOfDeficiencies}}</span>
            </el-col>
            <el-col :span="12">
              <span class="item-title">{{$t(`shipHall.dateOfReport`)}}:</span>
              <span class="item-name">{{item.dateOfReport}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="plate-no-data-box" v-if="!shipHallFile || !shipHallFile.datas">
        {{$t('commonRemind.noMessage')}}
    </div>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'shipPlateDetail',
    props: {
      fontSize: String,
      isSmall: Boolean
    },
    data() {
      return {
        height: window.innerHeight - 230 + 'px',
        shipPlateInfor: ''
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
    },
    methods: {
      getShipPlate(uuid) {
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
.ship-plate-file {
  padding-bottom: 10px;
}
.plate-no-data-box {
  padding: 10px 0 10px;
  text-align: center;
}
.plate-scroll-box{
  padding-top: 10px;
  font-size: 14px;
  /* max-height: 500px; */
  overflow-y: scroll;
}
.plate-small-box {
  padding-left: 20px;
  max-height: 400px;
}
.plate-scroll-box .plate-item .plate-item-title{
  margin: 10px 0 20px;
}
.plate-scroll-box .plate-item .el-col {
  line-height: 20px;
  margin-bottom: 6px;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
}
.plate-small-box .plate-item .el-col .item-title {
  min-width: 95px;
}
.plate-item .el-col .item-title {
  min-width: 100px;
}
.language-en .plate-small-box .plate-item-PSC .el-col span.item-title{
  min-width: 130px;
}
.language-en .plate-item-PSC .el-col span.item-title{
  min-width: 155px;
}
.plate-scroll-box .plate-item-PSC .el-row{
  margin-top: 10px;
}
.plate-scroll-box::-webkit-scrollbar{
  width: 7px;
  height: 7px;
  background: rgba(255,255,255,0.13);
  border: 1px solid rgba(78,78,78,0.56);
  border-radius: 3px;
}
.plate-scroll-box::-webkit-scrollbar-thumb{
  width: 8px;
  background-color: #999;
  border-radius: 3px;
}
</style>
