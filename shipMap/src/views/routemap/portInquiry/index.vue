<template>
    <map-dialog v-if="dataShow"
    class="port-inquiry-content"
    :visible.sync='dialogPortVisible'
    :drag='1'
    :drop='1'
    minWidth='934px'
    minHeight="150px"
    :minimize='minimize'
    :minimize-pramas='minimizePramas'
    :before-minimize="minHide"
    :beforeClose = 'beforeClose'
    width='934px' top="100px"
    left='300px'>
      <template slot="title">
        <div class="port-inquiry-title">
          <span class="mr-l-15">
              <svg-icon class="font16" style="color:#ffa900" icon-class="sousuo" />
          </span>
          <span class="mr-l-10"  v-text="$t('portInquiry.title')">
          </span>
          <span class="mr-l-15 font12">
            {{$t('portInquiry.title_left')}}<span style="color:#ffa900">{{reachPortSearch.length}}</span>{{$t('portInquiry.title_right')}}
          </span>
        </div>
      </template>
        <el-table
          :data="reachPortSearch"
          @row-click="posiyionlat"
          border
          maxHeight="234"
          style="width: 100%">
          <el-table-column
            type="index"
            v-bind:label="$t('portInquiry.No')"
            width="50"
            align="center">
          </el-table-column>
          <el-table-column
            prop="portNameCn"
            v-bind:label="$t('portInquiry.counrtyCn')"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="portNameEn"
            v-bind:label="$t('portInquiry.counrtyEn')"
            width="120"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :prop="isI18n ? 'counrtyCn' : 'counrtyEn'"
            v-bind:label="$t('portInquiry.portNameCn')"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="ata"
            v-bind:label="$t('portInquiry.ata')"
            width="160"
            align="center"
            show-overflow-tooltip
            :formatter="dateFormat">
          </el-table-column>
          <el-table-column
            prop="atd"
            v-bind:label="$t('portInquiry.atd')"
            width="160"
            align="center"
            :formatter="dateFormat"
            show-overflow-tooltip
            >
          </el-table-column>
          <!-- :formatter="dateFormat" -->
          <el-table-column
          prop="draughtIn"
          v-bind:label="$t('portInquiry.draughtIn')"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
          prop="draughtOut"
          v-bind:label="$t('portInquiry.draughtOut')"
            width="120"
              align="center">
          </el-table-column>
          <el-table-column
          prop="workTimePort"
          v-bind:label="$t('portInquiry.workTimePort')"
          :width="isI18n ? 130 :180"
          align="center"
          :formatter="hourFormat">
          </el-table-column>
          <el-table-column
          prop="workTimeDoc"
          v-bind:label="$t('portInquiry.workTimeDoc')"
          :width="isI18n ? 130 : 200"
            align="center"
            :formatter="hourFormat">
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
      <!-- <template slot="footer">

      </template>   -->
  </map-dialog>
</template>

<script>
  // import {
  //   reachPortSearch
  // } from '@/api/routemap'
  import {
    mapGetters
  } from 'vuex'
  import _ from 'lodash'
  import store from '@/store'
  import moment from 'moment'
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  // import Map from '@/views/routemap/map'
  // import store from '@/store'
  import i18n from '@/lang'
  import '@/styles/flag-icon.css'
  export default {
    components: {
      mapDialog
    },
    name: 'portInquirydragDialog',

    props: {
      dialogPortVisible: {
        type: Boolean
      },
      beforeClose: {
        type: Function
      }
    },
    data() {
      return {
        tableData: [],
        dataShow: false,
        minimize: true,
        downloadUrl: null,
        minimizePramas: {
          title: i18n.t('portInquiry.title'),
          zoomAction: () => {
            // store.dispatch('', this.tableData)
            this.dataShow = true
          }
        }
      }
    },
    watch: {
      shipInfos: function(newValue, oldValue) {
        this.dataShow = false
        this.inits()
      },
      $route(to, from) {
        this.dataShow = false
      }
    },
    computed: {
      ...mapGetters([
        'shipInfos',
        'reachPortSearch'
      ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    methods: {
      // 最小化
      minHide() {
        this.dataShow = false
      },
      // 日期格式化
      dateFormat: function(row, column) {
        var date = row[column.property]
        if (date === undefined || _.isEmpty(date)) {
          return ''
        }
        return moment(Number(date)).format('YYYY-MM-DD HH:mm:ss')
      },
      // 时间格式化
      hourFormat: function(row, column) {
        var date = row[column.property]
        if (date === null) {
          return 0
        }
        return (date / (1000 * 60 * 60)).toFixed(2)
      },
      // 加载靠港数据
      inits() {
        const str = new Date(this.shipInfos.startTime).getTime()
        const end = new Date(this.shipInfos.endTime).getTime()
        const obj = {
          startTime: str,
          endTime: end,
          imo: this.shipInfos.imo,
          pageIndex: 0,
          pageSize: -1
        }
        this.$store.dispatch('reachPortSearch', obj).then((data) => {
          if (this.reachPortSearch.length > 0) {
            this.dataShow = true
          } else {
            this.$alert(i18n.t('commonRemind.noMessage'), '')
            store.dispatch('shipInfos', null)
          }
        }).catch(() => {
          // this.loading = false
        })
        // reachPortSearch(obj).then(response => {
        //   this.dataShow = true
        //   this.tableData = response.data.datas
        // })
      },
      posiyionlat(row, event, column) { // 打开港口
        const obj = {
          nameCn: row.portNameCn,
          nameEn: row.portNameEn,
          countryCn: row.counrtyCn,
          countryEn: row.counrtyEn
        }
        store.dispatch('getPortListAll', row.portNameEn)
        store.dispatch('getPortListAllInit', obj)
      }
    },
    mounted() {
      // this.inits()
    }
  }
</script>
<style>
 /* .map_dialog {
    position: absolute;
    /* top: 390px;
    right: 140px;
} */
  /* .bascicon{
   font-size: 20px;
  } */
.port-inquiry-title{
  height: 38px;
  line-height: 38px;
  color: #fff;
}
.port-inquiry-content .el-table th.is-leaf {
    border-bottom: 1px solid #5c5c5c;
    background: rgba(255,204,0,0.1);
    border-color: rgb(36, 36, 36);
    color: #fff;
    font-weight: 100;
    font-size: 12px;
}
.port-inquiry-content .el-table--group, .el-table--border {
    border: none;
}
.port-inquiry-content .el-table__fixed::before, .el-table__fixed-right::before {
     background-color: rgba(33, 33, 33, .8);
}
.port-inquiry-content .el-table__row--striped>td,.el-table__body tr.hover-row>td{background-color:rgba(33,0,255,.5) !important;}
.port-inquiry-content .el-table__body tr.current-row>td{background-color:rgba(33,0,255,.5) !important}
.port-inquiry-content .el-table td{
  border-bottom: 1px solid #5c5c5c;
  /* background: rgba(33, 33, 33, .8); */
  border-color: rgb(36, 36, 36);
  color: #fff;
  font-size: 12px;
}
.port-inquiry-content .el-table__empty-block {
    /* background: #181818; */
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
.port-inquiry-content .el-table__body-wrapper::-webkit-scrollbar{
  width: 8px;
  height: 8px;
  background-color:rgba(78, 78, 78, .56);
}
.port-inquiry-content .el-table__body-wrapper::-webkit-scrollbar-thumb{
  width: 100px;
  background-color: #fff;
  /* border-radius: 8px; */
  -webkit-border-radius:2em;-moz-border-radius:2em; -o-border-radius:2em;
}
.port-inquiry-content .el-table__body-wrapper{
    scrollbar-arrow-color: #f4ae21; /**//*三角箭头的颜色*/   
    scrollbar-face-color: #333; /**//*立体滚动条的颜色*/   
    scrollbar-3dlight-color: #666; /**//*立体滚动条亮边的颜色*/   
    scrollbar-highlight-color: #666; /**//*滚动条空白部分的颜色*/   
    scrollbar-shadow-color: #999; /**//*立体滚动条阴影的颜色*/   
    scrollbar-darkshadow-color: #666; /**//*立体滚动条强阴影的颜色*/   
    scrollbar-track-color: #666; /**//*立体滚动条背景颜色*/   
    scrollbar-base-color:#f8f8f8; /**//*滚动条的基本颜色*/   
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
.table-div{
  margin: 0 auto;
    width: 538px;
}
 .port-inquiry-content .record-title{
   display: inline-block;
   border-radius: 4px;
   height: 30px;
   line-height: 30px;
   background-color: #FFCC00;
   padding: 0 10px;
   /* float: right; */
   margin-right: 80px;
   margin-top: 8px;
}
.el-table--enable-row-hover .el-table__body tr:hover > td{
  background-color: rgba(33,0,255,.5)!important;
}
</style>
