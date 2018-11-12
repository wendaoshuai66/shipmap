<template>
  <div class="ship-hall">
    <div class="ship-hall-content">
      <ship-plate-search  :isSmall="false"></ship-plate-search>
      <ship-hall-table v-if="shipHallSearch" :isSmall="false"></ship-hall-table> 
      <div class="ship-hall-pages" v-if="shipHallCondition && shipHallSearch">
        <el-pagination
          layout="prev, pager, next"
          :current-page='shipHallCondition.pageNum'
          @current-change="getAllShipPlateList"
          @prev-click="getAllShipPlateList"
          @next-click="getAllShipPlateList"
          :total="shipHallSearch.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import shipPlateSearch from '@/views/shipPlateSearch/index'
  import i18n from '@/lang'
  import {
    mapGetters
  } from 'vuex'
  import shipHallTable from '@/components/ShipHallTable'
  export default {
    components: {
      shipHallTable,
      shipPlateSearch
    },
    name: 'shipHall',
    data() {
      return {
        shipTypeList: null,
        shipStatusList: [
          {
            key: 'Full-laden',
            name: i18n.t(`shipHall.fullLaden`)
          },
          {
            key: 'Ratio-laden',
            name: i18n.t(`shipHall.ratioLaden`)
          },
          {
            key: 'Empty',
            name: i18n.t(`shipHall.empty`)
          }
        ]
      }
    },
    computed: {
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      },
      ...mapGetters([
        'shipHallSearch',
        'shipHallCondition'
      ])
    },
    mounted() {
    },
    methods: {
      showShipInformation(uuid) {
        this.$router.push({ name: 'shipPlateDetails', params: { uuid: uuid }})
      },
      getAllShipPlateList(val) {
        this.shipHallCondition.pageNum = val
        this.$store.dispatch('shipHallSearch', { 'updateObj': this.shipHallCondition, 'isSmall': false }).then((data) => {
        })
      }
    }
  }
</script>

<style>
.ship-hall ul,
.ship-hall li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.ship-hall {
  height: 100%;
  position: relative;
  z-index: 1;
  color: #333;
}
.ship-hall .ship-hall-content {
  width: 1180px;
  height: 100%;
  margin: auto;
}
.ship-hall .ship-hall-content .ship-hall-search {
  width: 100%;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
}
.ship-hall .ship-hall-small {
  font-size: 14px;
  padding: 8px 10px;
  background: linear-gradient(-1deg, #0C0C0C 1%, #4E4E4E 100%);
}
.ship-hall-search .el-date-editor.el-input,
.ship-hall-search .el-date-editor.el-input__inner,
.ship-hall-search .el-select {
  width: 100px;
}
.ship-hall-search .el-input--medium .el-input__inner {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  background: #FFFFFF;
  border: 1px solid #DADADA;
  border-radius: 2px;
  font-size: 12px;
}
.ship-hall-small .el-date-editor.el-input,
.ship-hall-small .el-date-editor.el-input__inner,
.ship-hall-small .el-select {
  width: 80px;
}
.ship-hall-small .el-select {
  width: 68px;
}
.ship-hall-small .el-input--medium .el-input__inner {
  padding: 0 5px;
  height: 26px;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  line-height: 26px;
}
.ship-hall-search .block .el-input__prefix,
.ship-hall-search .block .el-input__suffix {
  display: none;
}
.ship-hall-search .search-item .search-title {
  line-height: 20px;
  margin-bottom: 8px;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  letter-spacing: 0.17px;
}
.ship-hall-search .btn-item {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  padding-top: 28px;
}
.ship-hall-search .btn-item .el-input--medium {
  width: 180px;
}
.ship-hall-search .btn-item .el-button--mini {
  background: #FFCC00;
  border-radius: 0 2px 2px 0;
  font-family: MicrosoftYaHei;
  font-size: 12px;
  letter-spacing: 0;
  text-align: center;
  width: 56px;
  height: 28px;
  line-height: 28px;
  padding: 0;
  border: none;
}
.ship-hall-search .small-btn {
  padding-top: 0;
}
.ship-hall-search .small-btn .el-button--mini {
  border-radius: 2px;
}
.ship-hall-table-box {
  margin-top: 31px;
}
.ship-hall-table-small {
  margin-top: 0px;
  padding: 11px 15px;
}
.ship-hall-table {
  border: 1px solid #DADADA;
  width: 100%;
  text-align:center;
  border-collapse:collapse;
  border-spacing:0;
  font-size: 14px;
}
.ship-hall-table-small .ship-hall-table {
  border: 1px solid #242424;
}
/* .ship-hall-table table thead {
  background: #f4f4f4;
} */
.ship-hall-table tr th,
.ship-hall-table tr td{
  border-bottom: 1px solid #DADADA;
  border-right: 1px solid #DADADA;
  line-height: 38px;
}
.ship-hall-table-small .ship-hall-table tr th,
.ship-hall-table-small .ship-hall-table tr td{
  border-bottom: 1px solid #242424;
  border-right: 1px solid #242424;
  line-height: 30px;
  font-weight: normal;
  font-size: 12px;
}
.ship-hall-table tr th:nth-last-child(1),
.ship-hall-table tr td:nth-last-child(1){
  border-right: none;
}
.ship-hall-table tr td{
  font-size: 12px;
}
.ship-hall-pages{
  padding-top: 30px;
  text-align: center;
}
.ship-hall-pages .el-pagination .btn-prev, 
.ship-hall-pages .el-pagination .btn-next,
.ship-hall-pages .el-pager li {
  background-color: transparent;
  font-size: 12px;
}
.ship-hall-pages .el-pager li.active,
.ship-hall-pages .el-pager li:hover{
  color: #FFA900;
}
.ship-hall-bottom {
  color: #fff;
  padding: 10px 20px 20px;
  text-align: right;
}
.ship-hall-bottom span{
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.ship-hall-bottom span:nth-child(1){
  margin-right: 40px;
}
</style>
