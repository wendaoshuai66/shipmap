<template>
    <map-dialog v-if="dataShow" class="port-inquiry-content" :visible.sync='speedVisible' :beforeClose = 'beforeClose' width='568px' top="auto"
    bottom="370px" left='300px'>
      <template slot="title">
        <div class="port-inquiry-title">
          <span class="mr-l-15">
              <svg-icon class="font16" style="color:#ffa900" icon-class="lishishuju" />
          </span>
          <!-- v-text="$t('portInquiry.title')" -->
          <span class="mr-l-10"  >
            历史参考数据
          </span>
        </div>
      </template>
      <div class="table-div">
        <el-table
          :data="tableData"
          @row-click="posiyionlat"
          border
          style="width: 100%">
          <el-table-column
          prop="counrtyCn"
          label="航程"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            prop="counrtyCn"
            label="历史航速"
            width="168"
              align="center">
          </el-table-column>
          <el-table-column
            prop="counrtyEn"
            label="历史目的港停留时间"
            width="168"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>

      <!-- <template slot="footer">

      </template>   -->
  </map-dialog>
</template>

<script>
  import {
    reachPortSearch
  } from '@/api/routemap'
  import {
    mapGetters
  } from 'vuex'
  // import store from '@/store'
  import moment from 'moment'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  import Map from '@/views/routemap/map'
  // import moment from '@/lib/leaflet/moment'
  // import tableKey from '@/lang/zh/shipDetail'
  // import { parseTime } from '@/utils/index'
  import '@/styles/flag-icon.css'
  export default {
    components: {
      mapDialog
    },
    name: 'portInquirydragDialog',

    props: {
      speedVisible: {
        type: Boolean
      },
      beforeClose: {
        type: Function
      }
    },
    data() {
      return {
        tableData: [],
        dataShow: true
      }
    },
    watch: {
      dialogPortVisible: function(newValue, oldValue) {
        this.dataShow = false
        this.inits()
      }
    },
    computed: {
      ...mapGetters([
        'shipInfos'
      ])
    },
    methods: {
      // 时间格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      },
      // 小时格式化
      hourFormat: function(row, column) {
        var date = row[column.property]
        if (date === null) {
          return 0
        }
        return (date / (1000 * 60 * 60)).toFixed(2)
      },
      // 请求
      inits() {
        const str = this.shipInfos.startTime.getTime()
        const end = this.shipInfos.endTime.getTime()
        const obj = {
          startTime: str,
          endTime: end,
          imo: this.shipInfos.imo,
          pageIndex: 0,
          pageSize: -1
        }
        reachPortSearch(obj).then(response => {
          this.dataShow = true
          this.tableData = response.data.datas
        })
      },
      posiyionlat(row, event, column) {
        // Map.removeCurrentMarker()
        const L = window.L
        Map.mapView.setView(L.latLng(row.lat, row.lon))
        // Map.mapView.removeCurrentMarker()
        // Map.addCurrentMarker(row.lat, row.lng, item.heading)
      }
    },
    mounted() {
      // if(this.dialogPortVisible){
      //     this.inits()
      // }
    }
  }
</script>
<style>
 .map_dialog {
    position: absolute;
    /* top: 390px;
    right: 140px; */
}
  /* .bascicon{
   font-size: 20px;
  } */
.port-inquiry-title{
  height: 44px;
  line-height: 44px;
  color: #fff;
}
.port-inquiry-content .el-table th.is-leaf {
    border-bottom: 1px solid #5c5c5c;
    background: rgba(33, 33, 33, .8);
    border-color: rgb(36, 36, 36);
    color: #fff;
}
.port-inquiry-content .el-table--group, .el-table--border {
    border: 1px solid rgb(36, 36, 36);
}
.port-inquiry-content .el-table__fixed::before, .el-table__fixed-right::before {
     background-color: rgba(33, 33, 33, .8);
}
.port-inquiry-content .el-table__row--striped>td,.el-table__body tr.hover-row>td{background-color:rgba(33,0,255,.5) !important;}
.port-inquiry-content .el-table__body tr.current-row>td{background-color:rgba(33,0,255,.5) !important}
.port-inquiry-content .el-table td{
  border-bottom: 1px solid #5c5c5c;
  background: rgba(33, 33, 33, .8);
  border-color: rgb(36, 36, 36);
  color: #fff;
}
.port-inquiry-content .el-table__empty-block {
    background: rgba(33, 33, 33, .8);
    color: #fff;
}
.port-inquiry-content .el-table__body-wrapper::-webkit-scrollbar{
  width: 8px;
  height: 8px;
  background-color:rgba(78, 78, 78, .56);
}
.port-inquiry-content .el-table__body-wrapper::-webkit-scrollbar-thumb{
  width: 100px;
  background-color: #fff;
  border-radius: 8px;
}
.table-div{
  margin: 0 auto;
    width: 538px;
}
.port-inquiry-content .el-table {
    background-color: transparent;
}
.port-inquiry-content .el-table tr {
    background-color: transparent;
}
.port-inquiry-content .el-table--group::after, .port-inquiry-content.el-table--border::after, .el-table::before {
    background-color: transparent;
}
.port-inquiry-content .el-table--group::after, .port-inquiry-content .el-table--border::after, .el-table::before {
    background-color: transparent;
}
.table-div .el-table--enable-row-hover .el-table__body tr:hover > td{
  background-color: rgba(33,0,255,.5)!important;
}
</style>
