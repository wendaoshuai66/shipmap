<template>
  <div :class="isSmall?'ship-hall-table-small':'ship-hall-table-box'">
    <table class='ship-hall-table'>
      <thead :background="isSmall?'transparent':'#f4f4f4'">
        <tr>
          <th>{{$t(`shipHall.shipName`)}}</th>
          <th>{{$t(`shipHall.shipType`)}}</th>
          <th v-if='!isSmall'>{{$t(`shipHall.shipOption`)}}</th>
          <th v-if='!isSmall'>OPEN</th>
          <th>ETA Fujairah</th>
          <th>ETA Cabinda</th>
          <th>{{$t(`shipHall.shipowner`)}}</th>
          <th>{{$t(`shipHall.shipPlateIssuer`)}}</th>
          <th>{{$t(`shipHall.releaseDate`)}}</th>
          <th>{{$t(`shipHall.operation`)}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in shipHallSearch.datas" v-if="tableDataLength ? index < tableDataLength : true" :key="index">
          <td :title="item.name">{{item.name}}</td>
          <td :title="item.type">{{item.type}}</td>
          <td :title="item.position" v-if='!isSmall'>{{item.position}}</td>
          <td :title="item.open" v-if='!isSmall'>{{item.open}}</td>
          <td :title="item.eta">{{item.eta}}</td>
          <td :title="item.etaCabinda">{{item.etaCabinda}}</td>
          <td :title="isLanguageZh ? item.shipOwner : item.shipOwnerEn">{{isLanguageZh ? item.shipOwner : item.shipOwnerEn}}</td>
          <td :title="item.ext1">{{item.ext1}}</td>
          <td :title="item.publishTime">{{item.publishTime}}</td>
          <td><a @click='showShipInformation(item.uuid)'>{{$t(`shipHall.viewDetails`)}}</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'shipHall',
    props: {
      top: String,
      height: String,
      width: String,
      background: String,
      marginLeft: String,
      borderColor: String,
      color: String,
      tableDataLength: Number,
      isSmall: Boolean
    },
    data() {
      return {
        total: 0,
        pageSize: 10
      }
    },
    computed: {
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      },
      ...mapGetters([
        'shipHallSearch'
      ])
    },
    mounted() {
    },
    methods: {
      showShipInformation(uuid) {
        if (this.isSmall) {
          this.$router.push({ name: 'shipPlateMap', query: { uuid: uuid, source: 'shipPlate' }})
        } else {
          this.$router.push({ name: 'shipPlateDetails', params: { uuid: uuid }})
        }
      },
      mapShipHallMore() {
        this.$router.push({ name: 'shipHall' })
      },
      mapShipHallClose() {
      }
    }
  }
</script>

<style scoped>
.ship-hall-search .small-btn .el-button--mini {
  border-radius: 2px;
}
.ship-hall-table-box {
  margin-top: 31px;
}
.ship-hall-table-small {
  width: 766px;
  padding: 11px 15px;
  color: #fff;
}
.ship-hall-table-small .ship-hall-table {
  border: 1px solid #242424;
}
.ship-hall-table tr th,
.ship-hall-table tr td{
  border-bottom: 1px solid #DADADA;
  border-right: 1px solid #DADADA;
  line-height: 38px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ship-hall-table {
  border: 1px solid #DADADA;
  width: 100%;
  text-align:center;
  border-collapse:collapse;
  border-spacing:0;
  font-size: 14px;
}
.ship-hall-table-small thead {
  background-color: rgba(255,204,0,0.10);;
}
.ship-hall-table-small .ship-hall-table tr th,
.ship-hall-table-small .ship-hall-table tr td{
  border-bottom: 1px solid #242424;
  border-right: 1px solid #242424;
  line-height: 30px;
  font-weight: normal;
  max-width: 100px;
  font-size: 12px;
}
.ship-hall-table tr th:nth-last-child(1),
.ship-hall-table tr td:nth-last-child(1){
  border-right: none;
}
.ship-hall-table tr td{
  font-size: 12px;
}
.ship-hall-table a:hover {
  color: #FFCC00;
  text-decoration: underline;
}
</style>
